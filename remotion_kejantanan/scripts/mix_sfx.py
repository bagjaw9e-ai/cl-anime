"""Rakit bus SFX dari data/sfx_cues.json -> public/sfx/sfx_bus.wav + preview/sfx_map.txt.

Aturan:
- Level relatif voice (LUFS): SFX biasa -20 dB, penting (imp/★) -11 dB, atau override `db` per cue.
- SFX yang dipakai berulang: variasi pitch ±6% & volume ±0.8 dB (deterministik).
- Ekor SFX dipotong (fade 60 ms) sebelum SFX pertama scene berikutnya mulai (kecuali carry).
- Maksimal 2 SFX bunyi barengan: kalau ada yang ke-3, SFX yang paling lama dipotong (fade 40 ms).
- Hum neon (carry) di-fade out selama end card.
"""
import json, os, subprocess
from collections import Counter
import numpy as np
from scipy.io import wavfile
import pyloudnorm as pyln

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data = json.load(open(os.path.join(ROOT, 'data/sfx_cues.json')))
FPS = data['fps']
TOTAL = data['total_frames'] / FPS
VO_END = data['vo_duration']

raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(ROOT, 'public/voiceover.m4a'), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                     capture_output=True, check=True).stdout
vo = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
meter = pyln.Meter(SR, block_size=0.4)
VO_L = meter.integrated_loudness(vo)
REF = -20.0  # level file library

def load(name):
    sr, x = wavfile.read(os.path.join(ROOT, 'public/sfx', name + '.wav'))
    assert sr == SR
    return x.astype(np.float64) / 32767

def fade_out(x, n):
    n = min(n, len(x))
    if n > 0: x[-n:] *= np.linspace(1, 0, n)
    return x

cues = sorted(data['cues'], key=lambda c: (c['frame'], c['scene']))
uses = Counter(c['sfx'] for c in cues)
rng = np.random.default_rng(42)

# ---- siapkan tiap cue ----
items = []
for k, c in enumerate(cues):
    x = load(c['sfx'])
    rate = c['rate']
    vol_var = 0.0
    if uses[c['sfx']] > 1:
        rate *= 1 + rng.uniform(-0.06, 0.06)
        vol_var = rng.uniform(-0.8, 0.8)
    if abs(rate - 1) > 1e-3:  # pitch/kecepatan (resample)
        n = int(len(x) / rate)
        x = np.interp(np.arange(n) * rate, np.arange(len(x)), x)
    rel = c['db'] if c.get('db') is not None else (-11.0 if c['imp'] else -20.0)
    gain_db = VO_L + rel + vol_var - REF
    items.append(dict(c, x=x * 10 ** (gain_db / 20), start=c['frame'] / FPS, rel=rel + vol_var, rate_eff=rate))

for it in items:
    it['end'] = it['start'] + len(it['x']) / SR
    it['note'] = ''

# ---- ekor tidak boleh nabrak SFX pertama scene berikutnya ----
first_of_scene = {}
for it in items:
    first_of_scene.setdefault(it['scene'], it['start'])
scene_ids = sorted(first_of_scene)
for it in items:
    if it['carry']:
        continue
    later = [first_of_scene[s] for s in scene_ids if s > it['scene']]
    if later and it['end'] > later[0] - 0.02:
        it['end'] = max(it['start'] + 0.05, later[0] - 0.02)
        it['note'] += 'ekor dipotong@scene berikut; '

# ---- maksimal 2 bunyi barengan ----
for i, it in enumerate(items):
    active = [o for o in items[:i] if o['end'] > it['start'] + 1e-3]
    while len(active) >= 2:
        victim = min((o for o in active if not o['carry']), key=lambda o: o['start'], default=None)
        if victim is None:
            break
        victim['end'] = max(victim['start'] + 0.05, it['start'])
        victim['note'] += f"dipotong krn {it['sfx']}; "
        active = [o for o in items[:i] if o['end'] > it['start'] + 1e-3]

# ---- render bus ----
bus = np.zeros(int(TOTAL * SR) + SR)
for it in items:
    n = int((it['end'] - it['start']) * SR)
    x = it['x'][:n].copy()
    cut = n < len(it['x'])
    x = fade_out(x, int((0.06 if cut else 0.015) * SR))
    if it['carry']:  # hum neon: fade out selama end card
        tt = it['start'] + np.arange(len(x)) / SR
        x *= np.clip((TOTAL - 0.1 - tt) / (TOTAL - 0.1 - VO_END), 0, 1) ** 1.5
    i0 = int(it['start'] * SR)
    bus[i0:i0 + len(x)] += x[:len(bus) - i0]
bus = bus[:int(TOTAL * SR)]

# ---- ducking: voice prioritas. Saat narasi aktif, loudness SFX (K-weighted, 0.4 s) <= voice - 6 dB ----
HOP = int(0.05 * SR); WIN = int(0.4 * SR)
vv = np.zeros(len(bus)); vv[:min(len(vo), len(bus))] = vo[:len(bus)]
def _kw(x):
    for f in meter._filters.values(): x = f.apply_filter(x)
    return x
vkk, bkk = _kw(vv.copy()), _kw(bus.copy())
cs = lambda x: np.concatenate([[0], np.cumsum(x ** 2)])
cv, cb = cs(vkk), cs(bkk)
centers = np.arange(0, len(bus), HOP)
g = np.ones(len(centers))
for j, c0 in enumerate(centers):
    a0, a1 = max(0, c0 - WIN // 2), min(len(bus), c0 + WIN // 2)
    vr = np.sqrt((cv[a1] - cv[a0]) / max(1, a1 - a0)); br = np.sqrt((cb[a1] - cb[a0]) / max(1, a1 - a0))
    if vr > 0.03 and br > 1e-6:
        g[j] = min(1.0, (vr * 10 ** (-6 / 20)) / br)
# haluskan: attack cepat (ambil minimum tetangga), release pelan
g = np.minimum.reduce([np.roll(g, k) for k in (-2, -1, 0, 1, 2)])
for j in range(1, len(g)):
    g[j] = min(g[j], g[j - 1] + 0.12)  # release
gs = np.interp(np.arange(len(bus)), centers, g)
DUCK_MIN = gs.min()
bus *= gs
pk = np.abs(bus).max()
if pk > 0.98:
    bus *= 0.98 / pk
st = np.stack([bus, bus], 1)
wavfile.write(os.path.join(ROOT, 'public/sfx/sfx_bus.wav'), SR, (st * 32767).astype(np.int16))

# ---- verifikasi ----
pts = sorted([(it['start'], 1) for it in items] + [(it['end'], -1) for it in items], key=lambda p: (p[0], p[1]))
cur = mx = 0
for _, d in pts:
    cur += d; mx = max(mx, cur)
# rasio SFX vs voice per jendela 0.4 s saat voice aktif
w = int(0.4 * SR); worst = -99; worst_t = 0
v = np.zeros(len(bus)); v[:min(len(vo), len(v))] = vo[:len(v)]
def kw(x):  # K-weighting (seperti LUFS)
    for f in meter._filters.values(): x = f.apply_filter(x)
    return x
vk, bk = kw(v.copy()), kw(bus.copy())
for i in range(0, len(bus) - w, w // 2):
    vr = np.sqrt(np.mean(vk[i:i + w] ** 2)); br = np.sqrt(np.mean(bk[i:i + w] ** 2))
    if vr > 0.03 and br > 0:
        r = 20 * np.log10(br / vr)
        if r > worst: worst, worst_t = r, i / SR

# ---- sfx_map.txt ----
os.makedirs(os.path.join(ROOT, 'preview'), exist_ok=True)
texts = {s['id']: s['text'] for s in data['scenes']}
L = [f'SFX MAP (bus: public/sfx/sfx_bus.wav) | voiceover {VO_L:.1f} LUFS | {len(items)} SFX | maks bunyi barengan: {mx}',
     f'SFX biasa -20 dB, penting (★) -11 dB relatif voice; variasi pitch/volume utk SFX berulang. loudness SFX/voice terburuk (K-weighted, jendela 0.4 s) saat narasi: {worst:.1f} dB @ {worst_t:.1f}s',
     f'Ducking otomatis: saat narasi, SFX ditekan supaya <= voice - 6 dB (penurunan terbesar {20 * np.log10(DUCK_MIN):.1f} dB). Hum neon fade out selama end card.',
     '', f'{"scene":>5} | {"sfx":22s} | {"frame":>5} | {"waktu":>7} | {"rel dB":>6} | {"pitch":>5} | {"durasi":>6} | catatan']
last = None
for it in items:
    if it['scene'] != last:
        L.append(f'--- {it["scene"]:>2}. {texts[it["scene"]]}')
        last = it['scene']
    t = it['start']
    L.append(f'{it["scene"]:>5} | {it["sfx"] + (" ★" if it["imp"] else ""):22s} | {it["frame"]:>5} | {int(t // 60):02d}:{t % 60:05.2f} | {it["rel"]:>6.1f} | {it["rate_eff"]:>5.2f} | {it["end"] - t:>5.2f}s | {it["note"]}')
open(os.path.join(ROOT, 'preview/sfx_map.txt'), 'w').write('\n'.join(L) + '\n')
print('\n'.join(L[:2]))
print('ducking min gain dB', round(20*np.log10(DUCK_MIN),1)); print('cues', len(items), '| scenes with sfx', len(first_of_scene), '| max concurrent', mx)

if os.environ.get('SFX_REPORT'):
    rows = []
    for i in range(0, len(bus) - w, w // 2):
        vr = np.sqrt(np.mean(vk[i:i + w] ** 2)); br = np.sqrt(np.mean(bk[i:i + w] ** 2))
        if vr > 0.03 and br > 0: rows.append((20 * np.log10(br / vr), i / SR))
    for r, t0 in sorted(rows, reverse=True)[:14]:
        names = [it['sfx'] for it in items if it['start'] < t0 + 0.4 and it['end'] > t0]
        print(f'{t0:6.1f}s  {r:6.1f} dB  {names}')
