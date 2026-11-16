"""Mixing VO + BGM + SFX -> public/mix_final.wav (+ preview/sfx_map.txt).

Level (relatif VO, amplitudo/loudness LUFS):
  VO 100%. SFX penting 28% (-11 dB), ilustrasi 18% (-15 dB), transisi/kamera 10% (-20 dB), ambience hujan 9% (-21 dB).
  Batas: SFX tidak pernah > 30% VO (-10.5 dB) saat narasi (cap dinamis K-weighted, jendela 0.4 s).
BGM: 1% saat ada VO, naik ke 1,4% di jeda napas / end card (revisi user: BGM terlalu kencang)
     (attack 80 ms, release 300 ms). Fade in 0.5 s, fade out 2 s di end card, dipotong di akhir video.
Aturan SFX: maks 3 barengan (prioritas penting > ilustrasi > transisi; hujan dihitung tapi tidak dipotong),
     fade in 5 ms (transien) / 2 frame (transisi & ambience), fade out 3 frame, variasi pitch ±6% & volume ±0.7 dB
     untuk SFX yang dipakai berulang. Master dilimit true-peak -1 dBFS.
"""
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
FPS = D['fps']; FR = 1 / FPS; TOTAL = D['total_frames'] / FPS; VO_END = D['vo_duration']
N = int(TOTAL * SR)
# Level BGM (gain linear dari file asli). Revisi: diturunkan ke 1% (sebelumnya 7% / duck 5% / jeda 10%).
BGM_VO, BGM_GAP, BGM_END = 0.010, 0.014, 0.014
REL = {'imp': -11.0, 'ill': -15.0, 'trans': -20.0, 'amb': -21.0}
PRIO = {'imp': 3, 'ill': 2, 'trans': 1, 'amb': 0}

def dec(p, ch):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(r, dtype=np.float32).astype(np.float64)
    return x.reshape(-1, ch) if ch > 1 else x
vo = dec(os.path.join(ROOT, 'public/voiceover.m4a'), 1)
v = np.zeros(N); v[:min(N, len(vo))] = vo[:N]
bgm = dec(os.path.join(ROOT, 'public/bgm.m4a'), 2)[:N]
if len(bgm) < N: bgm = np.vstack([bgm, np.zeros((N - len(bgm), 2))])
meter = pyln.Meter(SR, block_size=0.4)
VO_L = meter.integrated_loudness(vo)

# ---------------- VO aktif? (untuk ducking BGM & cap SFX) ----------------
hop = int(0.01 * SR)
rms = np.sqrt(np.convolve(v ** 2, np.ones(int(0.03 * SR)) / int(0.03 * SR), 'same'))[::hop]
active = (20 * np.log10(rms + 1e-9) > -40).astype(float)
# jeda napas pendek (<120 ms) dianggap tetap bicara supaya BGM tidak naik-turun cepat
k = int(0.12 / 0.01)
act = np.convolve(active, np.ones(2 * k + 1), 'same') > 0

# ---------------- BGM: 7% dasar, 5% saat VO, 10% di jeda ----------------
g = np.empty(len(act)); cur = BGM_GAP
a_c, r_c = np.exp(-0.01 / 0.08), np.exp(-0.01 / 0.30)
for i, on in enumerate(act):
    tgt = BGM_VO if on else BGM_GAP
    if i * 0.01 > VO_END + 0.2: tgt = BGM_END
    cur = tgt + (cur - tgt) * (a_c if tgt < cur else r_c); g[i] = cur
gb = np.interp(np.arange(N), np.arange(len(g)) * hop, g)
tt = np.arange(N) / SR
gb *= np.clip(tt / 0.5, 0, 1)                         # fade in 0.5 s
gb *= np.clip((TOTAL - tt) / 2.0, 0, 1)               # fade out 2 s di end card
bgm_out = bgm * gb[:, None]
BGM_STATS = (np.percentile(g[act[:len(g)]], 50) if act.any() else 0, np.percentile(g[~act[:len(g)]], 50))

# ---------------- SFX ----------------
def load(name):
    sr, x = wavfile.read(os.path.join(ROOT, 'public/sfx', name + '.wav'))
    assert sr == SR, name
    x = x.astype(np.float64) / 32767
    return x if x.ndim == 1 else x.mean(1)
def rerate(x, r):
    if abs(r - 1) < 1e-3: return x
    n = int(len(x) / r); return np.interp(np.arange(n) * r, np.arange(len(x)), x)
REF = -20.0
cues = sorted(D['cues'], key=lambda c: (c['f'], -PRIO[c['kind']]))
uses = Counter(c['sfx'] for c in cues)
rng = np.random.default_rng(30)
items = []
for c in cues:
    x = load(c['sfx'])
    rate = c.get('rate') or 1.0; vv = 0.0
    if uses[c['sfx']] > 1:
        if not c.get('rate'): rate *= 1 + rng.uniform(-0.06, 0.06)
        vv = rng.uniform(-0.7, 0.7)
    x = rerate(x, rate)
    if c.get('len'): x = x[:int(c['len'] / FPS * SR)]
    rel = REL[c['kind']] + vv
    x = x * 10 ** ((VO_L + rel - REF) / 20)
    items.append(dict(c, x=x, start=c['f'] / FPS, end=c['f'] / FPS + len(x) / SR, rel=rel, rate_eff=rate, note2=[], dropped=False))

# maks 3 barengan (ambience tidak dipotong)
placed = []
for it in sorted(items, key=lambda i: i['start']):
    for attempt in range(3):
        act_ = [o for o in placed if o['end'] > it['start'] + 1e-3]
        if len(act_) < 3: break
        low = min([o for o in act_ if o['kind'] != 'amb'] + [it], key=lambda o: (PRIO[o['kind']], -o['start']))
        if low is it:
            if attempt < 2: it['start'] += 2 * FR; it['end'] += 2 * FR; it['note2'].append('digeser +2 frame (maks 3)'); continue
            it['dropped'] = True; it['note2'].append('dibuang (maks 3)'); break
        low['end'] = max(low['start'] + 0.05, it['start']); low['note2'].append(f"dipotong krn {it['sfx']}"); break
    if not it['dropped']: placed.append(it)

sfx = np.zeros(N)
for it in placed:
    n = int((it['end'] - it['start']) * SR); x = it['x'][:n].copy()
    if not len(x): continue
    fi = int((2 * FR if it['kind'] in ('trans', 'amb') else 0.005) * SR); fo = int(3 * FR * SR)
    fi, fo = min(fi, len(x) // 2), min(fo, len(x) // 2)
    if fi: x[:fi] *= np.linspace(0, 1, fi)
    if fo: x[-fo:] *= np.linspace(1, 0, fo)
    i0 = int(it['start'] * SR); sfx[i0:i0 + len(x)] += x[:N - i0]

# cap dinamis: SFX <= 30% VO (-10.5 dB) saat narasi
def kw(x):
    for f in meter._filters.values(): x = f.apply_filter(x)
    return x
vk, sk = kw(v.copy()), kw(sfx.copy())
cs = lambda x: np.concatenate([[0], np.cumsum(x ** 2)])
cv, cb = cs(vk), cs(sk)
H2, W2 = int(0.05 * SR), int(0.4 * SR); cen = np.arange(0, N, H2); gc = np.ones(len(cen))
for j, c0 in enumerate(cen):
    a0, a1 = max(0, c0 - W2 // 2), min(N, c0 + W2 // 2)
    vr = np.sqrt((cv[a1] - cv[a0]) / max(1, a1 - a0)); br = np.sqrt((cb[a1] - cb[a0]) / max(1, a1 - a0))
    if vr > 0.03 and br > 1e-6: gc[j] = min(1.0, vr * 10 ** (-10.5 / 20) / br)
gc = np.minimum.reduce([np.roll(gc, s) for s in (-2, -1, 0, 1, 2)])
for j in range(1, len(gc)): gc[j] = min(gc[j], gc[j - 1] + 0.1)
CAP_MIN = gc.min()
sfx *= np.interp(np.arange(N), cen, gc)

# ---------------- master + limiter -1 dBFS ----------------
mix = np.stack([v + sfx, v + sfx], 1) + bgm_out
ceil = 10 ** (-1 / 20)
pk = np.abs(resample_poly(mix, 4, 1, axis=0)).max(1).reshape(-1, 4).max(1)[:N]
need = minimum_filter1d(np.minimum(1, ceil * 0.985 / np.maximum(pk, 1e-9)), size=2 * int(0.005 * SR) + 1)
gl = np.empty_like(need); cur = 1.0; rel_c = np.exp(-1 / (0.08 * SR))
for i, n_ in enumerate(need): cur = n_ if n_ < cur else n_ + (cur - n_) * rel_c; gl[i] = cur
mix *= gl[:, None]
tp = np.abs(resample_poly(mix, 4, 1, axis=0)).max()
if tp > ceil: mix *= ceil / tp
TP = 20 * np.log10(np.abs(resample_poly(mix, 4, 1, axis=0)).max())
wavfile.write(os.path.join(ROOT, 'public/mix_final.wav'), SR, (mix * 32767).astype(np.int16))

# ---------------- verifikasi & peta ----------------
mx = max(sum(1 for i in placed if i['start'] <= t0 < i['end']) for t0 in np.arange(0, TOTAL, 0.01))
worst = (-99, 0)
for i in range(0, N - W2, W2 // 2):
    vr = np.sqrt(np.mean(vk[i:i + W2] ** 2)); br = np.sqrt(np.mean(kw(sfx[i:i + W2].copy()) ** 2)) if False else None
L_MIX = meter.integrated_loudness(mix)
beats = {b['id']: b for b in D['beats']}
L = [f'SFX MAP — video 30 hari | VO {VO_L:.1f} LUFS | master {L_MIX:.1f} LUFS (stereo), true-peak {TP:.2f} dBFS (limit -1)',
     f'BGM: {BGM_VO*100:.1f}% saat VO (median {BGM_STATS[0]*100:.2f}%), naik ke {BGM_GAP*100:.1f}% di jeda/end card; fade in 0.5 s, fade out 2 s di end card.',
     f'SFX: penting 28% (-11 dB), ilustrasi 18% (-15 dB), transisi 10% (-20 dB), hujan 9% (-21 dB); cap <= 30% VO saat narasi (penurunan terbesar {20*np.log10(CAP_MIN):.1f} dB).',
     f'{len(placed)} SFX terpasang ({sum(i["dropped"] for i in items)} dibuang) | maks bunyi SFX barengan: {mx} | bunyi teknologi: ekg_flatline, neon_switch_click, neon_buzz_soft',
     '', f'{"beat":>4} | {"jenis":9s} | {"sfx":24s} | {"frame":>5} | {"waktu":>8} | {"% VO":>5} | {"dB":>6} | keterangan']
last = None
for it in sorted(items, key=lambda i: i['start']):
    if it['beat'] != last:
        b = beats[it['beat']]; L.append(f'--- beat {b["id"]}{" ⭐" if b["imp"] else ""}: {b["text"]}'); last = it['beat']
    t0 = it['start']; kind = {'imp': 'PENTING', 'ill': 'ilustrasi', 'trans': 'transisi', 'amb': 'ambience'}[it['kind']]
    L.append(f'{it["beat"]:>4} | {kind:9s} | {it["sfx"]:24s} | {round(t0 * FPS):>5} | {int(t0 // 60):02d}:{t0 % 60:05.2f} | {10 ** (it["rel"] / 20) * 100:>4.0f}% | {it["rel"]:>6.1f} | '
             f'{"DIBUANG " if it["dropped"] else ""}{it["note"]}{" — " + "; ".join(it["note2"]) if it["note2"] else ""}')
open(os.path.join(ROOT, 'preview/sfx_map.txt'), 'w').write('\n'.join(L) + '\n')
print('\n'.join(L[:4]))
