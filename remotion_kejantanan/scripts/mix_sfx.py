"""Mixer SFX 3 lapis + voiceover -> public/mix_final.wav (+ public/sfx/sfx_bus.wav, preview/sfx_map.txt).

Level relatif voiceover (LUFS integrated): penting -9 dB, ilustrasi -18 dB, keluar -23 dB, kamera -28 dB (low-pass).
Aturan:
 1. SFX kamera dimatikan bila barengan SFX penting.
 2. Sunyi 4 frame sebelum tiap impact (SFX lain di-fade sebelum itu; yang mulai di jendela itu digeser ke setelah impact).
 3. Maks 3 bunyi barengan & maks 1 kamera. Prioritas: penting > ilustrasi > keluar > kamera. Yang paling tidak penting
    digeser 2-4 frame, kalau masih bentrok dipotong (fade) / dibuang.
 4. Fade in/out: kamera & SFX keluar 2 frame in / 3 frame out; SFX ilustrasi & penting 5 ms in (jaga transien) / 3 frame out.
 5. SFX yang dipakai berulang: variasi pitch ±6% & volume ±0.8 dB.
 6. Ducking: bus SFX turun 3.5 dB saat narasi, naik lagi di jeda napas (attack 40 ms, release 220 ms).
 7. Master (voice + SFX) dilimit, true-peak (4x oversampling) <= -1 dBFS.
"""
import json, os, subprocess
from collections import Counter
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, resample_poly
import pyloudnorm as pyln

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(ROOT, 'data/sfx_cues.json')))
FPS = D['fps']; TOTAL = D['total_frames'] / FPS; VO_END = D['vo_duration']; LEVELS = D['levels']
PRIO = {'imp': 3, 'ill': 2, 'out': 1, 'cam': 0}
FR = 1 / FPS

raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(ROOT, 'public/voiceover.m4a'), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                     capture_output=True, check=True).stdout
vo = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
meter = pyln.Meter(SR, block_size=0.4)
VO_L = meter.integrated_loudness(vo)
REF = -20.0
lp = lambda x, f: sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)

def load(name):
    sr, x = wavfile.read(os.path.join(ROOT, 'public/sfx', name + '.wav'))
    assert sr == SR, name
    x = x.astype(np.float64) / 32767
    return x if x.ndim == 1 else x.mean(1)

def resample_rate(x, rate):
    if abs(rate - 1) < 1e-3: return x
    n = int(len(x) / rate)
    return np.interp(np.arange(n) * rate, np.arange(len(x)), x)

cues = sorted(D['cues'], key=lambda c: (c['f'], -PRIO[c['kind']]))
uses = Counter(c['sfx'] for c in cues if c['kind'] != 'cam')
rng = np.random.default_rng(42)
items = []
for c in cues:
    x = load(c['sfx'])
    rate = c.get('rate') or 1.0
    vvar = 0.0
    if c['kind'] == 'cam':
        L = max(12, c['len']) / FPS + 0.15
        rate = len(x) / SR / L            # bentuk ulang panjang template = durasi gerak kamera
        x = lp(resample_rate(x, rate), 2500)
        rate_shown = 1.0
    else:
        if uses[c['sfx']] > 1 and not c.get('rate'):
            rate *= 1 + rng.uniform(-0.06, 0.06)
        if uses[c['sfx']] > 1:
            vvar = rng.uniform(-0.8, 0.8)
        x = resample_rate(x, rate)
        rate_shown = rate
    rel = c['db'] if c.get('db') is not None else LEVELS[c['kind']]
    g = 10 ** ((VO_L + rel + vvar - REF) / 20)
    items.append(dict(c, x=x * g, start=c['f'] / FPS, rel=rel + vvar, rate_eff=rate_shown, note2=[], dropped=False))
for it in items:
    it['end'] = it['start'] + len(it['x']) / SR

imps = [it for it in items if it['kind'] == 'imp']
# 1. kamera mati bila barengan SFX penting
for it in items:
    if it['kind'] == 'cam':
        for im in imps:
            if it['start'] < im['start'] + 1.2 and it['end'] > im['start'] - 0.2:
                it['dropped'] = True; it['note2'].append(f"dimatikan (barengan {im['sfx']})"); break
# 2. sunyi 4 frame sebelum impact
for im in imps:
    w0 = im['start'] - 4 * FR
    for it in items:
        if it is im or it['dropped'] or it.get('carry'): continue
        if it['start'] < w0 and it['end'] > w0:
            it['end'] = w0; it['note2'].append('di-fade (sunyi pra-impact)')
        elif w0 <= it['start'] < im['start']:
            if it['kind'] == 'cam': it['dropped'] = True; it['note2'].append('dibuang (sunyi pra-impact)')
            else:
                d = im['start'] + 3 * FR - it['start']; it['start'] += d; it['end'] += d
                it['note2'].append(f"digeser +{round(d * FPS)} frame (sunyi pra-impact)")
# 3. maks 3 barengan, maks 1 kamera
live = sorted([i for i in items if not i['dropped']], key=lambda i: i['start'])
placed = []
for it in live:
    for attempt in range(3):
        act = [o for o in placed if o['end'] > it['start'] + 1e-3 and not o['dropped']]
        cams = [o for o in act if o['kind'] == 'cam']
        if it['kind'] == 'cam' and cams:
            for o in cams: o['end'] = it['start']; o['note2'].append('dipotong (kamera berikutnya)')
            act = [o for o in act if o['kind'] != 'cam']
        if len(act) < 3: break
        low = min(act + [it], key=lambda o: (PRIO[o['kind']], -o['start']))
        if low is it:
            if attempt < 2:
                it['start'] += 2 * FR; it['end'] += 2 * FR; it['note2'].append('digeser +2 frame (maks 3)'); continue
            it['dropped'] = True; it['note2'].append('dibuang (maks 3 barengan)'); break
        low['end'] = it['start']; low['note2'].append(f"dipotong krn {it['sfx']} (maks 3)"); break
    if not it['dropped']: placed.append(it)
for it in placed:
    if it['end'] - it['start'] < 0.03:
        it['dropped'] = True; it['note2'].append('dibuang (terlalu pendek setelah dipotong)')
placed = [i for i in placed if not i['dropped']]

# 4. render bus dengan fade
bus = np.zeros(int(TOTAL * SR) + SR)
for it in placed:
    n = max(0, int((it['end'] - it['start']) * SR))
    x = it['x'][:n].copy()
    if len(x) == 0: continue
    fin = int((2 * FR if it['kind'] in ('cam', 'out') else 0.005) * SR); fout = int(3 * FR * SR)
    fin = min(fin, len(x) // 2); fout = min(fout, len(x) // 2)
    if fin: x[:fin] *= np.linspace(0, 1, fin)
    if fout: x[-fout:] *= np.linspace(1, 0, fout)
    if it.get('carry'):
        tt = it['start'] + np.arange(len(x)) / SR
        x *= np.clip((TOTAL - 0.15 - tt) / (TOTAL - 0.15 - VO_END), 0, 1) ** 1.5
    i0 = int(it['start'] * SR); bus[i0:i0 + len(x)] += x[:len(bus) - i0]
bus = bus[:int(TOTAL * SR)]

# 6. ducking 3.5 dB saat narasi
v = np.zeros(len(bus)); v[:min(len(vo), len(v))] = vo[:len(v)]
hop = int(0.01 * SR)
rms = np.sqrt(np.convolve(v ** 2, np.ones(int(0.03 * SR)) / int(0.03 * SR), 'same'))[::hop]
active = (20 * np.log10(rms + 1e-9) > -38).astype(float)
g = np.ones(len(active)); target = 10 ** (-3.5 / 20); cur = 1.0
a_c, r_c = np.exp(-0.01 / 0.04), np.exp(-0.01 / 0.22)
for i, a in enumerate(active):
    tg = target if a else 1.0
    cur = tg + (cur - tg) * (a_c if tg < cur else r_c); g[i] = cur
bus *= np.interp(np.arange(len(bus)), np.arange(len(g)) * hop, g)

# 6b. batas dinamis: saat narasi, loudness SFX (K-weighted, 0.4 s) <= voice - 5 dB
def _kw(x):
    for f in meter._filters.values(): x = f.apply_filter(x)
    return x
vkk, bkk = _kw(v.copy()), _kw(bus.copy())
cs = lambda x: np.concatenate([[0], np.cumsum(x ** 2)])
cv, cb = cs(vkk), cs(bkk)
H2, W2 = int(0.05 * SR), int(0.4 * SR)
cen = np.arange(0, len(bus), H2); gc = np.ones(len(cen))
for j, c0 in enumerate(cen):
    a0, a1 = max(0, c0 - W2 // 2), min(len(bus), c0 + W2 // 2)
    vr = np.sqrt((cv[a1] - cv[a0]) / max(1, a1 - a0)); br = np.sqrt((cb[a1] - cb[a0]) / max(1, a1 - a0))
    if vr > 0.03 and br > 1e-6: gc[j] = min(1.0, vr * 10 ** (-5 / 20) / br)
gc = np.minimum.reduce([np.roll(gc, k) for k in (-2, -1, 0, 1, 2)])
for j in range(1, len(gc)): gc[j] = min(gc[j], gc[j - 1] + 0.1)
CAP_MIN = gc.min()
bus *= np.interp(np.arange(len(bus)), cen, gc)

# 7. master + limiter true-peak -1 dBFS
mixm = v + bus
ceil = 10 ** (-1.0 / 20)
up = resample_poly(mixm, 4, 1)
pk = np.abs(up).reshape(-1, 4).max(1)[:len(mixm)]
need = np.minimum(1.0, (ceil * 0.985) / np.maximum(pk, 1e-9))
look = int(0.005 * SR)
need = np.minimum.accumulate(np.r_[need[look:], np.ones(look)][::-1])[::-1] if False else need
# lookahead (min dalam jendela 5 ms ke depan) + release 80 ms
from scipy.ndimage import minimum_filter1d
need = minimum_filter1d(need, size=2 * look + 1)
gl = np.empty_like(need); cur = 1.0; rel = np.exp(-1 / (0.08 * SR))
for i, n in enumerate(need):
    cur = n if n < cur else n + (cur - n) * rel; gl[i] = cur
mixm *= gl
tp = np.abs(resample_poly(mixm, 4, 1)).max()
if tp > ceil: mixm *= ceil / tp
tp_db = 20 * np.log10(np.abs(resample_poly(mixm, 4, 1)).max())
os.makedirs(os.path.join(ROOT, 'public/sfx'), exist_ok=True)
wavfile.write(os.path.join(ROOT, 'public/mix_final.wav'), SR, (np.stack([mixm, mixm], 1) * 32767).astype(np.int16))
wavfile.write(os.path.join(ROOT, 'public/sfx/sfx_bus.wav'), SR, (np.stack([bus, bus], 1) * 32767 / max(1, np.abs(bus).max())).astype(np.int16))

# verifikasi: maks bunyi barengan (sampling 10 ms)
mx = mxc = 0
for t0 in np.arange(0, TOTAL, 0.01):
    act = [i for i in placed if i['start'] <= t0 < i['end']]
    mx = max(mx, len(act)); mxc = max(mxc, sum(1 for i in act if i['kind'] == 'cam'))
mixL = meter.integrated_loudness(mixm)
# loudness SFX vs voice saat narasi (K-weighted, 0.4 s)
def kw(x):
    for f in meter._filters.values(): x = f.apply_filter(x)
    return x
vk, bk = kw(v.copy()), kw(bus.copy()); w = int(0.4 * SR); worst = (-99, 0)
for i in range(0, len(bus) - w, w // 2):
    vr = np.sqrt(np.mean(vk[i:i + w] ** 2)); br = np.sqrt(np.mean(bk[i:i + w] ** 2))
    if vr > 0.03 and br > 0: worst = max(worst, (20 * np.log10(br / vr), i / SR))

# sfx_map.txt
beats = {b['id']: b for b in D['beats']}
L = [f'SFX MAP — video kejantanan | voiceover {VO_L:.1f} LUFS | master {mixL:.1f} LUFS, true-peak {tp_db:.2f} dBFS (limit -1)',
     f'{len(placed)} SFX terpasang ({sum(i["dropped"] for i in items)} dibuang oleh aturan) | maks bunyi barengan: {mx} (kamera maks {mxc})',
     f'Level relatif voice: penting {LEVELS["imp"]} dB, ilustrasi {LEVELS["ill"]} dB, keluar {LEVELS["out"]} dB, kamera {LEVELS["cam"]} dB (low-pass 2.5 kHz)',
     f'Ducking 3.5 dB saat narasi + batas dinamis SFX <= voice-5 dB (penurunan terbesar {20 * np.log10(CAP_MIN):.1f} dB). Loudness SFX/voice terburuk saat narasi: {worst[0]:.1f} dB @ {worst[1]:.1f}s',
     '', f'{"beat":>4} | {"jenis":10s} | {"sfx":18s} | {"frame":>5} | {"waktu":>8} | {"dB":>6} | {"dur":>5} | keterangan']
last = None
for it in sorted(items, key=lambda i: (i['start'], -PRIO[i['kind']])):
    if it['beat'] != last:
        b = beats[it['beat']]; L.append(f'--- beat {b["id"]}{" ★" if b["imp"] else ""}: {b["text"]}'); last = it['beat']
    t0 = it['start']; kind = {'imp': 'PENTING', 'ill': 'ilustrasi', 'out': 'keluar', 'cam': 'kamera'}[it['kind']]
    st = 'DIBUANG ' if it['dropped'] else ''
    L.append(f'{it["beat"]:>4} | {kind:10s} | {it["sfx"]:18s} | {round(t0 * FPS):>5} | {int(t0 // 60):02d}:{t0 % 60:05.2f} | {it["rel"]:>6.1f} | {it["end"] - t0:>4.2f}s | '
             f'{st}{it.get("note", "")}{" — " + "; ".join(it["note2"]) if it["note2"] else ""}')
open(os.path.join(ROOT, 'preview/sfx_map.txt'), 'w').write('\n'.join(L) + '\n')
print('\n'.join(L[:4]))

