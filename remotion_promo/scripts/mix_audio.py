"""Mix VO + SFX -> public/mix_final.wav (+ preview/sfx_map.txt dengan level aktual).
Aturan (brief video promo): VO 100%, TANPA BGM. SFX maks 20% VO (-14 dB relatif loudness VO):
  imp (aksi utama) 19% = -14.5 dB, ill (ilustrasi/gerak) 15% = -16.5 dB, trans (transisi) 8% = -22 dB, amb 6% = -24.4 dB.
  Cap dinamis K-weighted (jendela 0,4 dtk): bus SFX tidak pernah > 20% VO saat narasi, dan tidak > level VO rata-rata saat jeda.
Maks 2 SFX barengan (cue ke-3 memotong cue berprioritas terendah dengan fade 3 frame).
Fade in 2 frame (transisi/ambience) atau 5 ms (bunyi transien supaya serangannya tetap ada), fade out 3 frame.
Master: limiter true-peak -1 dBFS (oversampling 4x)."""
import json, os, subprocess
import numpy as np
from scipy.io import wavfile
from scipy.signal import resample_poly
from scipy.ndimage import minimum_filter1d
import pyloudnorm as pyln

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(ROOT, 'data/sfx_cues.json')))
FPS = D['fps']; FR = 1 / FPS
TOTAL_FRAMES = 501
N = int(TOTAL_FRAMES / FPS * SR)
REL = {'imp': -14.5, 'ill': -16.5, 'trans': -22.0, 'amb': -24.4}
PRIO = {'imp': 3, 'ill': 2, 'trans': 1, 'amb': 0}

def dec(p):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(r, dtype=np.float32).astype(np.float64)
vo = dec(os.path.join(ROOT, 'public/voiceover.m4a'))
v = np.zeros(N); v[:min(N, len(vo))] = vo[:N]
meter = pyln.Meter(SR, block_size=0.4)
VO_L = meter.integrated_loudness(vo)
sm = pyln.Meter(SR, block_size=0.1)

# --- jadwal + aturan maks 2 barengan ---
items = []
for c in D['cues']:
    x = dec(os.path.join(ROOT, 'public/sfx', c['file'] + '.wav'))
    if c['dur']: x = x[:int(c['dur'] * SR)]
    nz = np.where(np.abs(x) > 1e-4)[0]; x = x[:nz[-1] + 1] if len(nz) else x
    st = c['frame'] / FPS
    items.append({**c, 'x': x, 'start': st, 'end': st + len(x) / SR})
items.sort(key=lambda i: i['start'])
for i, it in enumerate(items):
    while True:
        act = [o for o in items[:i] if o['end'] > it['start'] + 1e-4]
        if len(act) < 2: break
        lo = min(act, key=lambda o: (PRIO[o['cls']], o['start']))  # prioritas terendah dipotong (fade 3 frame sebelum cue baru)
        lo['end'] = it['start']

# --- bus SFX ---
sfx = np.zeros(N)
items = [i for i in items if i['end'] - i['start'] > 0.03]  # cue yang terpotong habis dibuang
for it in items:
    x = it['x'][:int((it['end'] - it['start']) * SR)].copy()
    pad = np.concatenate([x, np.zeros(SR // 2)]) if len(x) < SR // 2 else x
    L = sm.integrated_loudness(pad)
    g = 10 ** ((VO_L + REL[it['cls']] - L) / 20) if np.isfinite(L) else 0
    x *= g
    fi = int((2 * FR if it['cls'] in ('trans', 'amb') else 0.005) * SR)
    fo = int(max(3 * FR, it['fade']) * SR) if it['end'] < it['start'] + len(it['x']) / SR - 1e-3 or it['fade'] > 0.1 else int(3 * FR * SR)
    fi = min(fi, len(x) // 2); fo = min(fo, len(x) - fi)
    x[:fi] *= np.linspace(0, 1, fi); x[-fo:] *= np.linspace(1, 0, fo)
    i0 = int(it['start'] * SR); sfx[i0:i0 + len(x)] += x[:N - i0]
    it['gain_db'] = 20 * np.log10(g) if g > 0 else -99

# --- cap dinamis: SFX <= 20% VO saat narasi ---
def kw(x):
    for f in meter._filters.values(): x = f.apply_filter(x)
    return x
vk, sk = kw(v.copy()), kw(sfx.copy())
cs = lambda x: np.concatenate([[0], np.cumsum(x ** 2)])
cv, cb = cs(vk), cs(sk)
VR_AVG = np.sqrt(np.mean(kw(vo.copy()) ** 2))
H2, W2 = int(0.05 * SR), int(0.4 * SR); cen = np.arange(0, N, H2); gc = np.ones(len(cen))
for j, c0 in enumerate(cen):
    a0, a1 = max(0, c0 - W2 // 2), min(N, c0 + W2 // 2)
    vr = np.sqrt((cv[a1] - cv[a0]) / max(1, a1 - a0)); br = np.sqrt((cb[a1] - cb[a0]) / max(1, a1 - a0))
    lim = max(vr, 0.0) * 10 ** (-15.5 / 20) if vr > 0.03 else VR_AVG * 10 ** (-15.5 / 20) * 1.5
    if br > 1e-6: gc[j] = min(1.0, lim / br)
gc = np.minimum.reduce([np.roll(gc, s) for s in (-2, -1, 0, 1, 2)])
for j in range(1, len(gc)): gc[j] = min(gc[j], gc[j - 1] + 0.1)
sfx *= np.interp(np.arange(N), cen, gc)

# --- master + limiter true-peak -1 dBFS ---
mix = v + sfx
ceil = 10 ** (-1 / 20)
pk = np.abs(resample_poly(mix, 4, 1)).reshape(-1, 4).max(1)[:N]
need = minimum_filter1d(np.minimum(1, ceil * 0.985 / np.maximum(pk, 1e-9)), size=2 * int(0.005 * SR) + 1)
gl = np.empty_like(need); cur = 1.0; rc = np.exp(-1 / (0.08 * SR))
for i, n_ in enumerate(need): cur = n_ if n_ < cur else n_ + (cur - n_) * rc; gl[i] = cur
mix *= gl
tp = np.abs(resample_poly(mix, 4, 1)).max()
if tp > ceil: mix *= ceil / tp
TP = 20 * np.log10(np.abs(resample_poly(mix, 4, 1)).max())
st = np.stack([mix, mix], 1)
wavfile.write(os.path.join(ROOT, 'public/mix_final.wav'), SR, (st * 32767).astype(np.int16))

# --- verifikasi ---
mx = max(sum(1 for i in items if i['start'] <= t0 < i['end']) for t0 in np.arange(0, N / SR, 0.005))
worst = -99
for i in range(0, N - W2, W2 // 4):
    vr = np.sqrt(np.mean(vk[i:i + W2] ** 2))
    if vr > 0.03:
        br = np.sqrt(np.mean(kw(sfx[i:i + W2].copy()) ** 2)); worst = max(worst, 20 * np.log10(max(br, 1e-9) / vr))
L_MIX = meter.integrated_loudness(mix)
out = [f'# SFX MAP video promo | VO {VO_L:.1f} LUFS (100%), tanpa BGM | master {L_MIX:.1f} LUFS, true-peak {TP:.2f} dBFS (limit -1)',
       f'# SFX terkeras vs VO (jendela 0,4 dtk saat narasi): {worst:.1f} dB = {100 * 10 ** (worst / 20):.0f}% VO (batas 20%) | maks barengan: {mx}',
       '# frame | detik | file | kelas (target relatif VO) | durasi main | catatan']
for it in items:
    out.append(f"{it['frame']:4d} | {it['start']:6.2f}s | {it['file'] + '.wav':22s} | {it['cls']:5s} {REL[it['cls']]:+.1f} dB | {it['end'] - it['start']:.2f}s | {it['note']}")
open(os.path.join(ROOT, 'preview/sfx_map.txt'), 'w').write('\n'.join(out) + '\n')
print('\n'.join(out[:2]))
