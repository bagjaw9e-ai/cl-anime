"""Mix VO + BGM + SFX -> public/mix_final.wav (+ preview/sfx_map.txt final dengan level & durasi aktual).
Setelan (brief video "otak bodoh"): VO 100% mulai frame 0. BGM 1% diputar UTUH dari frame 0 sampai habis (video = durasi BGM),
fade in 1 dtk + fade out 1 dtk terakhir (ending BGM turun mendadak). SFX animasi/ilustrasi/gerakan = 20% VO,
SFX transisi + camera movement + panel neon ganti = 15% VO. Semua SFX dari public/sfx_ob (disintesis baru).
Setelan dasar (/style3):
  VO 100%. BGM 1% dari VO (-40 dB relatif loudness VO), fade in 1 dtk, fade out 2 dtk di akhir.
  SFX penting ⭐ (imp) 20% VO = -14 dB; ilustrasi/gerak (ill) 15% = -16.5 dB; transisi (trans) 10% = -20 dB.
  Cap dinamis K-weighted (0,4 dtk): bus SFX tidak pernah > 20% VO saat narasi.
  Maks 3 SFX barengan (cue ke-4 memotong cue berprioritas terendah, fade 3 frame).
  Fade in 2 frame (transisi/ambience) atau 5 ms (bunyi transien supaya serangannya tetap ada), fade out 3 frame.
  SFX yang dipakai berulang diberi variasi pitch ±5-10% (resample) & volume ±0,7 dB.
  Master limiter true-peak -1 dBFS (ceiling -1,6 dBFS untuk overshoot AAC)."""
import json, os, subprocess
from collections import Counter
import numpy as np
from scipy.io import wavfile
from scipy.signal import resample_poly
from scipy.ndimage import minimum_filter1d
import pyloudnorm as pyln

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(ROOT, 'data/sfx_cues.json')))
FPS = 30; FR = 1 / FPS
TOTAL_FRAMES = 3885
VO_FRAMES = 3843
N = int(TOTAL_FRAMES / FPS * SR)
REL = {'anim': -14.3, 'trans': -16.8}   # anim ≈19-20% VO, trans ≈14-15% VO
PRIO = {'anim': 2, 'trans': 1}
rng = np.random.default_rng(7)

def dec(p, ch=1):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(r, dtype=np.float32).astype(np.float64)
    return x.reshape(-1, ch) if ch > 1 else x
vo = dec(os.path.join(ROOT, 'public/voiceover.m4a'))
v = np.zeros(N); v[:min(N, len(vo))] = vo[:N]
meter = pyln.Meter(SR, block_size=0.4); sm = pyln.Meter(SR, block_size=0.1)
VO_L = meter.integrated_loudness(vo)

# ---- BGM 1% ----
bgm = dec(os.path.join(ROOT, 'public/bgm.m4a'), 2)
if len(bgm) < N: bgm = np.vstack([bgm, np.zeros((N - len(bgm), 2))])
bgm = bgm[:N].copy()
BGM_L = meter.integrated_loudness(bgm)
bgm *= 10 ** ((VO_L - 40 - BGM_L) / 20)
fi = SR * 1; a0 = N - SR * 1
bgm[:fi] *= np.linspace(0, 1, fi)[:, None]
bgm[a0:] *= np.linspace(1, 0, N - a0)[:, None]   # fade out 1 dtk terakhir (BGM tetap utuh sampai habis)

# ---- jadwal + aturan maks 3 barengan ----
cnt = Counter(c['file'] for c in D['cues']); seen = Counter()
items = []
for c in D['cues']:
    x = dec(os.path.join(ROOT, 'public/sfx_ob', c['file'] + '.wav'))
    if c['dur']: x = x[:int(c['dur'] * SR)]
    nz = np.where(np.abs(x) > 1e-4)[0]; x = x[:nz[-1] + 1] if len(nz) else x
    gj = 0.0
    if cnt[c['file']] > 1:  # variasi pitch ±5-10% untuk SFX berulang
        k = seen[c['file']]; seen[c['file']] += 1
        if k > 0:
            r = 1 + (0.05 + 0.05 * rng.random()) * (1 if k % 2 else -1)
            up, down = int(round(100 / r)), 100
            x = resample_poly(x, up, down); gj = rng.uniform(-0.7, 0.7)
    st = c['frame'] / FPS
    items.append({**c, 'x': x, 'start': st, 'end': st + len(x) / SR, 'gj': gj})
items.sort(key=lambda i: i['start'])
for i, it in enumerate(items):
    while True:
        act = [o for o in items[:i] if o['end'] > it['start'] + 1e-4]
        if len(act) < 3: break
        lo = min(act, key=lambda o: (PRIO[o['cls']], o['start']))
        lo['end'] = it['start']
items = [i for i in items if i['end'] - i['start'] > 0.03]

# ---- bus SFX ----
sfx = np.zeros(N)
for it in items:
    x = it['x'][:int((it['end'] - it['start']) * SR)].copy()
    pad = np.concatenate([x, np.zeros(SR // 2)]) if len(x) < SR // 2 else x
    L = sm.integrated_loudness(pad)
    g = 10 ** ((VO_L + REL[it['cls']] + it['gj'] - L) / 20) if np.isfinite(L) else 0
    x *= g
    fi = int((2 * FR if it['cls'] == 'trans' else 0.005) * SR)
    fo = int(3 * FR * SR)
    fi = min(fi, len(x) // 2); fo = min(fo, len(x) - fi)
    x[:fi] *= np.linspace(0, 1, fi); x[-fo:] *= np.linspace(1, 0, fo)
    i0 = int(it['start'] * SR); sfx[i0:i0 + len(x)] += x[:N - i0]
    it['gain_db'] = 20 * np.log10(g) if g > 0 else -99

# ---- cap dinamis: SFX <= 20% VO saat narasi ----
def kw(x):
    for f in meter._filters.values(): x = f.apply_filter(x)
    return x
vk = kw(v.copy())
cs = lambda x: np.concatenate([[0], np.cumsum(x ** 2)])
cv = cs(vk)
VR = np.sqrt(np.mean(kw(vo.copy()) ** 2))
H2, W2 = int(0.05 * SR), int(0.4 * SR); cen = np.arange(0, N, H2)
for _pass in range(3):  # cap diulang supaya puncak singkat juga tertahan
    cb = cs(kw(sfx.copy())); gc = np.ones(len(cen))
    for j, c0 in enumerate(cen):
        a0, a1 = max(0, c0 - W2 // 2), min(N, c0 + W2 // 2)
        vr = np.sqrt((cv[a1] - cv[a0]) / max(1, a1 - a0)); br = np.sqrt((cb[a1] - cb[a0]) / max(1, a1 - a0))
        lim = vr * 10 ** (-16 / 20) if vr > 0.03 else VR * 10 ** (-16 / 20) * 1.5
        if br > 1e-6: gc[j] = min(1.0, lim / br)
    gc = np.minimum.reduce([np.roll(gc, s) for s in (-2, -1, 0, 1, 2)])
    for j in range(1, len(gc)): gc[j] = min(gc[j], gc[j - 1] + 0.1)
    sfx *= np.interp(np.arange(N), cen, gc)

# ---- master + limiter true-peak -1 dBFS ----
mix = np.stack([v + sfx, v + sfx], 1) + bgm
ceil = 10 ** (-2.8 / 20)  # -1 dBFS + headroom untuk overshoot encode AAC (transien kertas/daun)
pk = np.abs(resample_poly(mix, 4, 1, axis=0)).max(1).reshape(-1, 4).max(1)[:N]
need = minimum_filter1d(np.minimum(1, ceil * 0.97 / np.maximum(pk, 1e-9)), size=2 * int(0.005 * SR) + 1)
gl = np.empty_like(need); cur = 1.0; rc = np.exp(-1 / (0.08 * SR))
for i, n_ in enumerate(need): cur = n_ if n_ < cur else n_ + (cur - n_) * rc; gl[i] = cur
mix *= gl[:, None]
tp = np.abs(resample_poly(mix, 4, 1, axis=0)).max()
if tp > ceil * 0.97: mix *= ceil * 0.97 / tp
TP = 20 * np.log10(np.abs(resample_poly(mix, 4, 1, axis=0)).max())
wavfile.write(os.path.join(ROOT, 'public/mix_final.wav'), SR, (mix * 32767).astype(np.int16))

# ---- verifikasi + peta ----
mx = max(sum(1 for i in items if i['start'] <= t0 < i['end']) for t0 in np.arange(0, N / SR, 0.005))
worst = -99
for i in range(0, N - W2, W2 // 4):
    vr = np.sqrt(np.mean(vk[i:i + W2] ** 2))
    if vr > 0.03:
        br = np.sqrt(np.mean(kw(sfx[i:i + W2].copy()) ** 2)); worst = max(worst, 20 * np.log10(max(br, 1e-9) / vr))
bl = meter.integrated_loudness(bgm[int(2 * SR):int((TOTAL_FRAMES / FPS - 2) * SR)]) - VO_L
out = [f'# SFX MAP video otak bodoh | VO {VO_L:.1f} LUFS (100%) | BGM {bl:.1f} dB vs VO (≈{100 * 10 ** (bl / 20):.1f}%), diputar utuh 0-{N / SR:.2f} dtk, fade in 1 dtk / fade out 1 dtk terakhir',
       f'# master {meter.integrated_loudness(mix):.1f} LUFS, true-peak {TP:.2f} dBFS (limit -1) | SFX terkeras saat narasi {worst:.1f} dB = {100 * 10 ** (worst / 20):.0f}% VO (batas 20%) | maks barengan {mx} (batas 3)',
       '# jenis: anim (animasi/ilustrasi/gerakan karakter) -14.3 dB ≈ 19-20% VO | trans (transisi + camera move + panel neon) -16.8 dB ≈ 14-15% VO | semua SFX = sintesis baru (public/sfx_ob)',
       '# frame | detik | beat | jenis | SFX | durasi main']
for it in items:
    bt = it['note'].split(' ')[0]
    out.append(f"{it['frame']:5d} | {it['start']:7.2f}s | {bt:8s} | {('animasi 20%' if it['cls'] == 'anim' else 'transisi 15%'):12s} | {it['file'] + '.wav':26s} | {it['end'] - it['start']:.2f}s | {' '.join(it['note'].split(' ')[1:])}")
open(os.path.join(ROOT, 'preview/sfx_map.txt'), 'w').write('\n'.join(out) + '\n')
print('\n'.join(out[:3]))
