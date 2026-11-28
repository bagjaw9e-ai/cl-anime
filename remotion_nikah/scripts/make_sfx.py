"""Library SFX sintesis (numpy+scipy), layering noise + tone + envelope.
Tiap file dinormalisasi ke -20 LUFS (referensi); level akhir relatif voice diatur di mix_sfx.py.
Output: public/sfx/<nama>.wav (48 kHz mono)."""
import os
import numpy as np
from scipy.signal import butter, sosfilt, lfilter
from scipy.io import wavfile
import pyloudnorm as pyln

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'sfx')
rng = np.random.default_rng(7)


# ---------------- helper ----------------
def t(d): return np.arange(int(SR * d)) / SR
def N(d): return rng.standard_normal(int(SR * d))
def env(x, a, d):
    tt = np.arange(len(x)) / SR
    return x * np.minimum(1, tt / max(a, 1e-4)) * np.exp(-tt / d)
def ar(x, a, r):  # attack-release linear, sustain flat
    n = len(x); e = np.ones(n); ia = max(1, int(a * SR)); ir = max(1, int(r * SR))
    e[:ia] = np.linspace(0, 1, ia); e[-ir:] *= np.linspace(1, 0, ir)
    return x * e
def bell(x, peak):  # bentuk lonceng (naik-turun) puncak di fraksi 'peak'
    u = np.linspace(0, 1, len(x)); e = np.where(u < peak, (u / peak) ** 2, ((1 - u) / (1 - peak)) ** 1.5)
    return x * e
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def tone(f, d, ph=0):
    f = np.broadcast_to(np.asarray(f, dtype=float), (int(SR * d),))
    return np.sin(2 * np.pi * np.cumsum(f) / SR + ph)
def saw(f, d):
    f = np.broadcast_to(np.asarray(f, dtype=float), (int(SR * d),))
    p = np.cumsum(f) / SR
    return 2 * (p - np.floor(p + 0.5))
def glide(f0, f1, d, k=None):
    u = np.linspace(0, 1, int(SR * d))
    return f0 * (f1 / f0) ** u if k is None else f1 + (f0 - f1) * np.exp(-u * k)
def brown(d):
    x = np.cumsum(N(d)); x = hp(x, 20); return x / (np.abs(x).max() + 1e-9)
def pink(d):
    b = [0.049922035, -0.095993537, 0.050612699, -0.004408786]; a = [1, -2.494956002, 2.017265875, -0.522189400]
    x = lfilter(b, a, N(d)); return x / (np.abs(x).max() + 1e-9)
def sweep_bp(x, f0, f1, q=0.6, steps=48):  # band-pass yang bergerak (blok-blok)
    out = np.zeros_like(x); n = len(x); edges = np.linspace(0, n, steps + 1).astype(int)
    fs = f0 * (f1 / f0) ** np.linspace(0, 1, steps)
    for i in range(steps):
        s, e = edges[i], edges[i + 1]
        lo, hi = fs[i] * (1 - q / 2), min(fs[i] * (1 + q / 2), SR / 2 - 100)
        seg = bp(x[max(0, s - 2048):e], lo, hi)[-(e - s):]
        out[s:e] = seg
    return out
def place(buf, x, s):
    i = int(s * SR); j = min(len(buf), i + len(x)); buf[i:j] += x[:j - i]
def silence(d): return np.zeros(int(SR * d))
def bellish(f, d, dec=0.6, partials=((1, 1), (2.76, 0.4), (5.4, 0.2), (8.9, 0.08))):
    y = sum(a * env(tone(f * r, d), 0.002, dec / (1 + r * 0.4)) for r, a in partials); return y
def ks(f, d, damp=0.996):  # Karplus-Strong string
    n = int(SR * d); p = int(SR / f); buf = rng.uniform(-1, 1, p); y = np.zeros(n)
    for i in range(n):
        y[i] = buf[i % p]; buf[i % p] = damp * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return y
def reverb(x, amt=0.25, d=0.6):
    y = np.concatenate([x, silence(d)]); out = y.copy()
    for dl, g in [(0.031, .5), (0.047, .42), (0.061, .35), (0.083, .3), (0.113, .22), (0.157, .15)]:
        k = int(dl * SR); out[k:] += amt * g * lp(y, 5000)[:-k]
    return out
def click(d=0.004, f=3000): return env(hp(N(0.03), f), 0.0002, d)
def add(*xs):
    n = max(len(x) for x in xs); y = np.zeros(n)
    for x in xs: y[:len(x)] += x
    return y


# ---------------- desain SFX ----------------
S = {}
def sfx(fn): S[fn.__name__] = fn; return fn

@sfx
def phone_hum():
    d = 1.3; tt = t(d)
    h = sum(a * np.sin(2 * np.pi * f * tt) for f, a in [(100, .5), (200, .3), (300, .15), (420, .08)])
    h *= 0.8 + 0.2 * np.sin(2 * np.pi * 3.1 * tt)
    whine = bp(N(d), 6800, 8200) * 0.15
    return ar(h + whine, 0.25, 0.4)

@sfx
def notif_soft():
    y = silence(0.9)
    place(y, bellish(1318.5, 0.6, 0.45), 0.0)
    place(y, bellish(1975.5, 0.7, 0.55) * 0.9, 0.13)
    place(y, env(bp(N(0.05), 2000, 6000), 0.001, 0.01) * 0.3, 0)
    return reverb(y, 0.3)

@sfx
def bass_hit():
    d = 1.6
    body = env(tone(glide(110, 34, d, 6), d), 0.004, 0.55)
    sub = env(tone(42, d), 0.01, 0.8) * 0.6
    clk = env(hp(N(d), 2000), 0.0005, 0.012) * 0.5
    thump = env(lp(N(d), 300), 0.002, 0.08) * 0.8
    return np.tanh(1.6 * (body + sub + clk + thump))

@sfx
def deflate():
    d = 1.2
    air = sweep_bp(N(d), 3200, 350, 0.8) * 0.9
    rub = tone(glide(320, 70, d) * (1 + 0.05 * np.sin(2 * np.pi * 9 * t(d))), d) * 0.35
    return ar(air + lp(saw(glide(320, 70, d), d), 900) * 0.25 + rub, 0.03, 0.5)

@sfx
def whoosh_fast():
    d = 0.5; return bell(sweep_bp(pink(d), 350, 3500, 0.9), 0.55)

@sfx
def whoosh_soft():
    d = 0.6; return bell(sweep_bp(pink(d), 300, 1600, 0.8), 0.5) * 0.7

@sfx
def whoosh_trans():
    d = 0.38; return bell(sweep_bp(pink(d), 500, 2600, 1.0), 0.45)

@sfx
def monitor_beep():
    y = silence(1.0)
    for s in [0.0, 0.48]:
        b = np.sin(2 * np.pi * 1000 * t(0.09)) + 0.25 * np.sign(np.sin(2 * np.pi * 1000 * t(0.09)))
        place(y, ar(b, 0.004, 0.02), s)
    return reverb(lp(y, 6000), 0.35)

@sfx
def puzzle_click():
    y = silence(0.22)
    place(y, click(0.003, 2500) * 0.8, 0)
    place(y, env(bp(N(0.05), 2200, 2800, 3), 0.0005, 0.018), 0.002)
    place(y, env(bp(N(0.06), 500, 900), 0.0005, 0.02) * 0.6, 0.12)
    return y

@sfx
def mri_hum_rise():
    d = 1.8; tt = t(d)
    hum = sum(a * np.sin(2 * np.pi * f * tt) for f, a in [(60, .5), (120, .35), (180, .2)])
    whine = lp(saw(glide(260, 880, d), d), 1500) * 0.3 * np.linspace(0.2, 1, len(tt))
    knock = np.zeros_like(tt)
    for s in np.arange(0.4, d, 0.125): place(knock, env(bp(N(0.03), 700, 1500), 0.0005, 0.008) * 0.4, s)
    return ar(hum + whine + knock, 0.3, 0.3)

@sfx
def alert_glitch():
    d = 0.9; y = silence(d)
    for s, f in [(0, 1180), (0.16, 880), (0.32, 1180)]:
        tn = np.sign(np.sin(2 * np.pi * f * t(0.12))) * 0.5 + np.sin(2 * np.pi * f * 2 * t(0.12)) * 0.2
        place(y, env(tn, 0.003, 0.07), s)
    for s in [0.05, 0.22, 0.4, 0.47, 0.55]:
        n = np.round(N(0.035) * 4) / 4; place(y, bp(n, 800, 6000) * 0.8, s)
    seg = y[int(0.32 * SR):int(0.36 * SR)].copy()
    for r in range(4): place(y, seg * (0.8 - r * 0.15), 0.5 + r * 0.045)
    return lp(y, 9000)

@sfx
def power_down():
    d = 1.4
    tn = lp(saw(glide(900, 45, d, 3.5), d), 2200) * 0.6 + tone(glide(450, 30, d, 3.5), d) * 0.4
    hum = tone(100, d) * 0.15
    return ar((tn + hum) * np.exp(-t(d) * 1.6), 0.005, 0.2)

@sfx
def elec_flicker():
    d = 0.8; y = silence(d); buzz = np.sign(np.sin(2 * np.pi * 120 * t(d))) * 0.25
    gate = np.zeros(len(y))
    for s in sorted(rng.uniform(0, 0.7, 9)):
        i = int(s * SR); L = int(rng.uniform(0.015, 0.06) * SR); gate[i:i + L] = 1
        place(y, env(hp(N(0.02), 2500), 0.0003, 0.004) * 0.7, s)
    return lp(y + buzz * gate, 7000)

@sfx
def chime_soft():
    y = silence(1.6)
    place(y, bellish(880, 1.2, 0.9) * 0.7, 0)
    place(y, bellish(1318.5, 1.2, 0.9) * 0.5, 0.09)
    place(y, bellish(1760, 1.0, 0.8) * 0.35, 0.18)
    return reverb(y, 0.35)

@sfx
def gear_spin():
    d = 1.9; y = silence(d)
    for k, s in enumerate(np.arange(0, d - 0.05, 1 / 13)):
        f = 1200 if k % 2 else 2300
        place(y, env(bp(N(0.03), f * 0.9, f * 1.1, 2), 0.0004, 0.009) * rng.uniform(0.5, 0.9), s)
    grind = lp(brown(d), 260) * 0.35 * (0.8 + 0.2 * np.sin(2 * np.pi * 6.5 * t(d)))
    return ar(y + grind, 0.08, 0.3)

@sfx
def bulb_ding():
    y = bellish(1568, 1.3, 1.0, ((1, 1), (2.0, 0.35), (3.01, 0.25), (4.2, 0.1)))
    buzz = env(np.sign(np.sin(2 * np.pi * 120 * t(1.3))), 0.002, 0.08) * 0.08
    return reverb(y + buzz, 0.3)

@sfx
def node_pop():
    d = 0.09
    return add(env(tone(glide(650, 1500, d), d), 0.001, 0.025), click(0.002, 3000) * 0.3)

@sfx
def chess_tap():
    d = 0.25
    return (env(bp(N(d), 820, 1000, 3), 0.0005, 0.03) * 1.2 + env(bp(N(d), 1900, 2300, 3), 0.0005, 0.02) * 0.6
            + env(tone(180, d), 0.001, 0.04) * 0.5)

@sfx
def warm_swell():
    d = 1.8; tt = t(d)
    chord = sum(lp(saw(f * (1 + dt), d), 1400) for f in [196, 246.9, 293.7, 392] for dt in (-0.003, 0.003)) * 0.12
    air = bp(N(d), 2000, 7000) * 0.06
    return bell(chord + air + tone(98, d) * 0.15, 0.6)

@sfx
def suck_swoosh():
    d = 0.9
    w = sweep_bp(pink(d), 300, 4200, 0.9) * (np.linspace(0, 1, int(SR * d)) ** 2)
    y = np.concatenate([w, silence(0.1)])
    place(y, env(tone(glide(400, 1200, 0.06), 0.06), 0.001, 0.02) * 0.6, d - 0.02)
    return y

@sfx
def pedal_stomp():
    y = silence(0.5)
    place(y, env(tone(glide(130, 60, 0.3), 0.3), 0.001, 0.08) + env(bp(N(0.3), 150, 900), 0.0005, 0.03) * 0.8, 0)
    sq = tone(glide(1700, 2300, 0.16) * (1 + 0.02 * np.sin(2 * np.pi * 40 * t(0.16))), 0.16)
    place(y, ar(bp(sq, 1200, 3500), 0.01, 0.05) * 0.35, 0.04)
    return y

@sfx
def dive_whoosh():
    d = 1.0
    w = bell(sweep_bp(pink(d), 180, 1300, 1.0), 0.75)
    sub = ar(tone(glide(90, 38, d), d), 0.4, 0.2) * 0.5
    return w + sub

@sfx
def low_rumble():
    d = 2.7; tt = t(d)
    r = lp(brown(d), 120) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.7 * tt)) + tone(42, d) * 0.3
    return ar(r, 0.3, 0.6)

@sfx
def stone_rumble():
    d = 1.9; tt = t(d)
    am = lp(np.abs(N(d)), 6); am = am / am.max()
    r = lp(brown(d), 220) * (0.4 + 0.6 * am)
    peb = silence(d)
    for s in sorted(rng.uniform(0.1, 1.6, 14)): place(peb, env(bp(N(0.02), 2000, 4500), 0.0003, 0.006) * rng.uniform(.2, .6), s)
    dust = hp(N(d), 4000) * 0.04 * np.linspace(0, 1, len(tt))
    return ar(r + peb + dust, 0.15, 0.5)

@sfx
def lizard_hiss():
    d = 0.7
    h = bp(N(d), 3000, 8500) * (0.85 + 0.15 * np.sin(2 * np.pi * 23 * t(d)))
    return ar(h, 0.06, 0.3)

@sfx
def monkey_chatter():
    y = silence(0.7)
    for k, s in enumerate([0, 0.13, 0.26, 0.42]):
        d = 0.1 if k < 3 else 0.2
        f = glide(500, 1100, d) if k % 2 == 0 else glide(1000, 650, d)
        v = saw(f * (1 + 0.04 * np.sin(2 * np.pi * 30 * t(d))), d)
        v = bp(v, 700, 1800) + bp(v, 2200, 3200) * 0.4
        place(y, ar(v, 0.01, 0.04), s)
    return y

@sfx
def pop_soft():
    d = 0.16
    return add(env(tone(glide(380, 900, d, 25), d), 0.001, 0.04), click(0.002, 2000) * 0.2)

@sfx
def bird_chirp():
    y = silence(1.0)
    for s in [0, 0.14, 0.26, 0.5, 0.6]:
        d = 0.08
        f = np.concatenate([glide(2800, 5200, d / 2), glide(5200, 3500, d / 2)])
        place(y, ar(tone(f * (1 + 0.05 * np.sin(2 * np.pi * 60 * t(len(f) / SR))), len(f) / SR), 0.005, 0.03) * rng.uniform(.6, 1), s)
    return reverb(y, 0.2)

@sfx
def bonk():
    y = silence(0.8)
    place(y, env(bp(N(0.1), 600, 1400, 3), 0.0005, 0.03) * 1.2, 0)
    place(y, env(tone(glide(720, 260, 0.45) * (1 + 0.04 * np.sin(2 * np.pi * 18 * t(0.45))), 0.45), 0.002, 0.18) * 0.7, 0)
    ring = sum(a * env(tone(f, 0.8), 0.001, 0.35) for f, a in [(810, .4), (1240, .3), (2130, .15)])
    place(y, ring * 0.5, 0)
    return y

@sfx
def twinkle_stars():
    y = silence(1.3)
    for k, s in enumerate(np.arange(0, 0.9, 0.11)):
        place(y, bellish(rng.choice([2093, 2349, 2637, 3136, 3520]), 0.35, 0.25) * rng.uniform(.3, .6), s)
    return reverb(y, 0.3)

@sfx
def hmm_cartoon():
    d = 0.55
    f = np.concatenate([np.full(int(SR * 0.35), 150.0), glide(150, 260, 0.2)])
    v = saw(f * (1 + 0.01 * np.sin(2 * np.pi * 5 * t(d))), d)
    v = bp(v, 200, 350) * 1.0 + bp(v, 2200, 2800) * 0.25
    return ar(v, 0.04, 0.08)

@sfx
def boing():
    d = 0.8; tt = t(d)
    f = 210 * (1 + 0.35 * np.exp(-tt * 4) * np.sin(2 * np.pi * 14 * tt)) * (1 + 0.3 * np.exp(-tt * 6))
    return env(tone(f, d) + 0.3 * tone(f * 2, d), 0.002, 0.35)

@sfx
def paper_flap():
    d = 0.5; y = silence(d)
    for s in sorted(rng.uniform(0, 0.35, 40)):
        place(y, env(bp(N(0.02), 1800, 6500), 0.0002, 0.004) * rng.uniform(.2, .8), s)
    place(y, bell(bp(N(0.25), 300, 1500), 0.4) * 0.4, 0)
    return y

@sfx
def clock_fast():
    d = 2.3; y = silence(d); s = 0.0; iv = 0.17; k = 0
    while s < d - 0.05:
        f = 2800 if k % 2 == 0 else 2150
        place(y, env(bp(N(0.03), f * 0.92, f * 1.08, 3), 0.0003, 0.008) * 0.9, s)
        s += iv; iv = max(0.06, iv * 0.93); k += 1
    return y

@sfx
def rumble_rise():
    d = 1.6; u = np.linspace(0, 1, int(SR * d))
    return ar((lp(brown(d), 160) + tone(glide(40, 95, d), d) * 0.4) * u ** 1.5, 0.05, 0.15)

@sfx
def heartbeat_heavy():
    y = silence(1.7)
    for s in [0, 0.85]:
        place(y, env(tone(glide(70, 45, 0.25), 0.25), 0.005, 0.07) + env(lp(N(0.25), 200), 0.002, 0.03) * 0.5, s)
        place(y, (env(tone(glide(60, 40, 0.25), 0.25), 0.005, 0.06)) * 0.7, s + 0.2)
    return y

@sfx
def fall_whoosh():
    d = 0.4
    return bell(sweep_bp(pink(d), 2500, 500, 0.8), 0.7) + ar(tone(glide(1400, 500, d), d), 0.05, 0.05) * 0.15

@sfx
def thud():
    d = 1.0
    body = env(tone(glide(85, 38, d, 10), d), 0.002, 0.25)
    knock = env(bp(N(d), 120, 900), 0.001, 0.06) * 1.2
    wood = env(tone(190, d) + 0.5 * tone(310, d), 0.001, 0.05) * 0.4
    return np.tanh(1.8 * (body + knock + wood))

BRAKE_LEAD = 0.5
@sfx
def brake_snap():
    d = 1.3; y = silence(d); tt = t(0.6)
    fm = 2600 + 380 * np.sin(2 * np.pi * 11 * tt)
    sq = tone(fm, 0.6) * 0.35 + bp(N(0.6), 1800, 4200) * 0.5
    sq *= np.minimum(1, tt / 0.08) * np.minimum(1, (0.6 - tt) / 0.05)
    place(y, sq, 0)
    place(y, env(hp(N(0.2), 1500), 0.0003, 0.02) * 1.6, BRAKE_LEAD)
    ping = sum(a * tone(f, 0.7) for f, a in [(1430, .5), (2290, .35), (3870, .25), (5120, .15)])
    place(y, env(ping, 0.001, 0.18) * 0.6, BRAKE_LEAD)
    place(y, env(tone(glide(140, 50, 0.5, 12), 0.5), 0.001, 0.12) * 0.7, BRAKE_LEAD)
    return np.tanh(1.3 * y)

@sfx
def engine_roar():
    d = 1.5; f = glide(55, 150, d)
    e = sum(lp(saw(f * h, d), 1800) / h for h in (1, 2, 3)) + bp(N(d), 300, 1500) * 0.2
    return ar(np.tanh(2.2 * e) * np.linspace(0.5, 1, len(f)), 0.1, 0.35)

@sfx
def wheel_creak():
    d = 1.3; y = silence(d)
    for s in np.arange(0, d - 0.2, 0.33):
        dd = 0.18; f = rng.uniform(850, 1150) * (1 + 0.06 * np.sin(2 * np.pi * 37 * t(dd)))
        v = bp(saw(f, dd), 700, 2600) * (1 + 0.5 * rng.standard_normal(int(SR * dd)) * 0.2)
        place(y, ar(v, 0.03, 0.06) * 0.6, s)
    rattle = silence(d)
    for s in np.arange(0, d, 0.055): place(rattle, env(bp(N(0.01), 1500, 3000), 0.0002, 0.003) * 0.25, s)
    return y + rattle

@sfx
def tape_rewind():
    d = 0.7; tt = t(d)
    f = glide(900, 4200, d) * (1 + 0.03 * np.sin(2 * np.pi * 17 * tt))
    v = lp(saw(f, d), 6000) * 0.25 + sweep_bp(N(d), 1500, 6000, 0.7) * 0.6
    y = ar(v, 0.03, 0.04)
    y = np.concatenate([y, silence(0.08)])
    place(y, click(0.004, 1500) * 0.8, d)
    return y

@sfx
def string_zip():
    d = 0.35; y = silence(d)
    s = ks(196, d, 0.994)
    place(y, s * 0.8, 0)
    place(y, ar(bp(N(0.12), 2000, 6000), 0.01, 0.05) * 0.35, 0)
    return y

@sfx
def thunder_crack():
    d = 2.0; y = silence(d)
    place(y, env(hp(N(0.12), 1200), 0.0002, 0.025) * 1.5, 0)
    for s in [0.01, 0.03, 0.06]: place(y, env(hp(N(0.05), 800), 0.0002, 0.01) * 0.8, s)
    place(y, env(lp(brown(d), 220), 0.03, 0.6) * 1.2, 0.02)
    return np.tanh(1.4 * y)

@sfx
def steam_hiss():
    d = 2.5; tt = t(d)
    puffs = 0.55 + 0.45 * np.abs(np.sin(2 * np.pi * 1.6 * tt))
    return ar(hp(N(d), 3000) * puffs * 0.6 + bp(N(d), 800, 2000) * 0.12, 0.08, 0.4)

@sfx
def rope_snap():
    y = silence(0.6)
    place(y, env(hp(N(0.1), 900), 0.0002, 0.015) * 1.4, 0)
    place(y, ks(110, 0.5, 0.985) * 0.7, 0.005)
    place(y, env(bp(N(0.15), 400, 1200), 0.001, 0.05) * 0.5, 0.01)
    return y

@sfx
def piece_fall():
    y = silence(0.32)
    place(y, env(bp(N(0.1), 700, 1100, 3), 0.0005, 0.03) * 1.0 + 0, 0)
    place(y, env(bp(N(0.1), 1300, 1700, 3), 0.0005, 0.02) * 0.5, 0.08)
    place(y, env(bp(N(0.1), 1100, 1400, 3), 0.0005, 0.015) * 0.3, 0.15)
    return y

@sfx
def wind_soft():
    d = 1.3; return ar(sweep_bp(pink(d), 400, 900, 0.7) * (0.8 + 0.2 * np.sin(2 * np.pi * 1.3 * t(d))), 0.4, 0.5)

@sfx
def gear_jam():
    d = 1.7; y = silence(d); s = 0.0; iv = 0.07; k = 0
    while s < 1.1:
        f = 1100 if k % 2 else 1900
        place(y, env(bp(N(0.03), f * 0.9, f * 1.1, 2), 0.0004, 0.01) * 0.8, s)
        s += iv; iv *= 1.22; k += 1
    cr = bp(saw(420 * (1 + 0.08 * np.sin(2 * np.pi * 7 * t(0.9)) + 0.03 * rng.standard_normal(int(SR * 0.9))), 0.9), 300, 2500)
    place(y, ar(cr, 0.1, 0.2) * 0.45, 0.2)
    place(y, add(env(bp(N(0.2), 200, 900), 0.001, 0.05), env(tone(110, 0.3), 0.001, 0.06) * 0.6), 1.15)
    return y

@sfx
def shimmer_rise():
    d = 1.9; y = silence(d); tt = t(d)
    for i, f in enumerate([523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98, 2093.0]):
        tn = tone(f, 1.2) + 0.3 * tone(f * 2.01, 1.2) + 0.15 * tone(f * 3.98, 1.2)
        place(y, env(tn, 0.005, 0.45) * (0.32 - i * 0.02), i * 0.11)
    swell = bp(N(d), 3000, 12000) * np.clip(tt / 1.0, 0, 1) ** 2 * np.exp(-np.maximum(0, tt - 1.0) * 3) * 0.12
    pad_ = sum(np.sin(2 * np.pi * f * tt) for f in [261.6, 329.6, 392.0]) * 0.06 * np.clip(tt / 0.6, 0, 1) * np.exp(-np.maximum(0, tt - 1.0) * 2)
    return y + swell + pad_

@sfx
def crystal_ting():
    y = bellish(2093, 1.1, 0.7, ((1, 1), (2.32, 0.5), (3.9, 0.3), (5.6, 0.15)))
    glow = ar(bp(N(1.1), 5000, 11000), 0.2, 0.6) * 0.05
    return reverb(y + glow, 0.35)

@sfx
def grow_soft():
    d = 1.4; tt = t(d)
    rise = lp(saw(glide(180, 360, d), d), 900) * 0.25 * np.linspace(0.3, 1, len(tt))
    grains = silence(d)
    for s in sorted(rng.uniform(0.05, 1.2, 22)): place(grains, env(bp(N(0.02), 400, 1400), 0.001, 0.008) * rng.uniform(.2, .5), s)
    air = bp(N(d), 3000, 8000) * 0.04
    return ar(rise + grains + air, 0.2, 0.4)

@sfx
def sparkle():
    y = silence(1.0)
    for s in sorted(rng.uniform(0, 0.6, 9)):
        place(y, bellish(rng.uniform(2600, 5200), 0.3, 0.18) * rng.uniform(.25, .5), s)
    return reverb(y, 0.3)

@sfx
def swell_positive():
    d = 2.0; tt = t(d)
    chord = sum(tone(f * (1 + dt), d) for f in [261.6, 329.6, 392, 523.3] for dt in (-0.002, 0.002)) * 0.12
    chord = lp(chord + sum(lp(saw(f, d), 1200) for f in [261.6, 392]) * 0.08, 2500)
    return bell(chord + bp(N(d), 4000, 10000) * 0.03, 0.65)

@sfx
def confident_stomp():
    y = silence(0.5)
    place(y, env(tone(glide(140, 48, 0.4, 18), 0.4), 0.001, 0.12), 0)
    place(y, env(bp(N(0.15), 900, 3500), 0.0005, 0.03) * 0.6, 0.0)
    return np.tanh(1.5 * y)

@sfx
def neon_click():
    y = silence(0.28)
    place(y, env(hp(N(0.02), 1500), 0.0002, 0.004) * 1.0, 0)
    bz = np.sign(np.sin(2 * np.pi * 120 * t(0.22))) * 0.5 + bp(N(0.22), 2000, 6000) * 0.3
    place(y, ar(lp(bz, 4000), 0.002, 0.06) * 0.7, 0.005)
    return y

@sfx
def neon_hum():
    d = 6.4; tt = t(d)
    h = sum(a * np.sin(2 * np.pi * f * tt) for f, a in [(120, .5), (240, .25), (360, .12)])
    h += lp(np.sign(np.sin(2 * np.pi * 120 * tt)), 1500) * 0.08
    h *= 0.9 + 0.1 * np.sin(2 * np.pi * 0.8 * tt)
    return ar(h, 0.2, 0.3)

@sfx
def chain_break_sparkle():
    d = 2.0; y = silence(d)
    place(y, env(hp(N(0.25), 1200), 0.0003, 0.03) * 1.4, 0)
    def clank(sc=1.0):
        return sum(a * tone(f * sc, 0.5) for f, a in zip([820, 1310, 2140, 3020, 4470], [.5, .4, .3, .2, .12]))
    place(y, env(clank(), 0.0005, 0.12) * 0.9, 0)
    for s in sorted(rng.uniform(0.12, 0.9, 9)): place(y, env(clank(rng.uniform(1.1, 1.7)), 0.0005, 0.05) * rng.uniform(.15, .4), s)
    place(y, env(tone(glide(120, 55, 0.4, 14), 0.4), 0.001, 0.08) * 0.6, 0)
    y = np.tanh(1.2 * y)
    for s in sorted(rng.uniform(0.25, 1.3, 10)):
        place(y, bellish(rng.uniform(2600, 5200), 0.4, 0.22) * rng.uniform(.15, .3), s)
    return y


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    meter = pyln.Meter(SR, block_size=0.1)
    for name, fn in S.items():
        x = fn().astype(np.float64)
        fade = int(SR * 0.015); x[-fade:] *= np.linspace(1, 0, fade)
        xx = np.concatenate([x, np.zeros(SR // 2)]) if len(x) < SR // 2 else x
        l = meter.integrated_loudness(xx)
        x *= 10 ** ((-20 - l) / 20)
        pk = np.abs(x).max()
        if pk > 0.95: x *= 0.95 / pk
        wavfile.write(os.path.join(OUT, name + '.wav'), SR, (x * 32767).astype(np.int16))
        print(f'{name:22s} {len(x) / SR:4.2f}s')
