#!/usr/bin/env python3
"""Video 3 SFX: wind only (gusts on every crossfade + wind variations for the illustrations), mixed at
-6 dB LUFS under the voice (~50% volume), no music."""
import sys, math, subprocess
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
import scenes3 as S

SR = 44100
rng = np.random.default_rng(21)
B = S.B


def pink(n):
    w = rng.standard_normal(n)
    return sosfilt(butter(1, 400, 'low', fs=SR, output='sos'), w) * 3 + w * .25


def tv_band(x, f0, f1, q=1.6, curve=None):
    """time-varying band-pass (block processed)"""
    out = np.zeros_like(x)
    n, blk = len(x), 512
    for i in range(0, n, blk):
        t = i / n
        c = curve(t) if curve else t
        fc = f0 * (f1 / f0) ** c
        lo, hi = max(fc / q, 30), min(fc * q, SR / 2 - 200)
        seg = sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x[max(0, i - 4096):i + blk])
        out[i:i + blk] = seg[-len(x[i:i + blk]):]
    return out


def norm(x):
    m = np.abs(x).max()
    return x / m if m > 0 else x


def gust(d=1.2, f0=250, f1=900, peak=.55, howl=0.0, hf0=500, hf1=900):
    """one wind gust: swelling filtered noise, optional whistling howl"""
    n = int(d * SR)
    t = np.arange(n) / d / SR
    env = np.where(t < peak, (t / peak) ** 1.6, ((1 - t) / (1 - peak)) ** 1.3)
    env *= 1 + .25 * np.sin(2 * np.pi * 3.1 * t * d) * np.sin(np.pi * t)
    x = tv_band(pink(n), f0, f1, 1.7, lambda q: math.sin(math.pi * q) if f0 == f1 else q)
    x = norm(x) * env
    if howl > 0:
        h = tv_band(rng.standard_normal(n), hf0, hf1, 1.06)
        x += norm(h) * env * howl
    return x


def breeze(d=2.0, f=500):
    n = int(d * SR)
    t = np.arange(n) / SR
    env = np.sin(np.pi * t / d) ** 2 * (.7 + .3 * np.sin(2 * np.pi * .9 * t))
    return norm(tv_band(pink(n), f * .7, f * 1.3, 1.8, lambda q: .5 + .5 * math.sin(q * 9))) * env


def roar(d=4.0):
    """fire wind: low rumble gusts with crackly flutter"""
    n = int(d * SR)
    t = np.arange(n) / SR
    env = np.minimum(t / .6, 1) * np.minimum((d - t) / 1.0, 1)
    x = norm(tv_band(pink(n), 120, 420, 2.2, lambda q: .5 + .5 * math.sin(q * 13)))
    flutter = 1 + .5 * (rng.random(n // 300 + 1).repeat(300)[:n] - .5)
    return x * env * flutter


def build():
    total = int((S.AUDIO_LEN + .5) * SR)
    L = np.zeros(total)
    R = np.zeros(total)

    def put(t, x, g=.5, pan=0.0, sweep=0.0):
        i = int(max(t, 0) * SR)
        x = x[:max(total - i, 0)]
        n = len(x)
        p = pan + sweep * np.linspace(-1, 1, n)
        p = np.clip(p, -1, 1)
        L[i:i + n] += x * g * np.minimum(1, 1 - p)
        R[i:i + n] += x * g * np.minimum(1, 1 + p)

    # crossfades: strong gusts sweeping across the stereo field
    for k, b in enumerate(B[1:-1]):
        put(b - .6, gust(1.3, 220, 1400, .5, .25, 450, 1100), .7, 0, .6 if k % 2 else -.6)
    # 1 wedding / heart cracks
    put(.1, breeze(2.2, 700), .35)
    put(B[0] + 3.3, gust(1.6, 500, 200, .4, .3, 700, 350), .45, -.3)
    # 2 facade revealed, puppet strings
    put(B[1] + .1, breeze(2.0, 900), .3)
    put(B[1] + 3.0, gust(1.6, 300, 1300, .45, .4, 500, 1200), .6, 0, .4)
    put(B[1] + 4.5, breeze(2.4, 400), .3)
    # 3 illusion appears, energy drained, glitch
    put(B[2] + 1.5, gust(1.4, 900, 2500, .5, .35, 1100, 1700), .45, .4)
    put(B[2] + 3.0, breeze(3.5, 1200), .3, .3)
    put(B[2] + 6.4, gust(.8, 2000, 600, .3), .45, .4)
    # 4 rage shockwaves, brain chained
    put(B[3] + .4, gust(1.4, 150, 700, .3, .3, 300, 600), .7)
    put(B[3] + 2.0, gust(1.0, 600, 1000, .5, .3, 800, 1300), .4, .4)
    # 5 complaints puffs, burdens, push back
    for k in range(3):
        put(B[4] + .4 + k * 1.2, gust(.6, 800, 500, .4), .35, -.4)
    put(B[4] + 3.6, gust(.9, 400, 1200, .35), .5, -.2)
    # 6 ball rolls, explosion of rage
    put(B[5] + 1.2, breeze(1.4, 600), .3, -.5)
    put(B[5] + 2.5, gust(1.8, 120, 900, .25, .45, 250, 700), .8)
    put(B[5] + 2.8, roar(3.2), .45)
    # 7 insults thrown, conscience dies
    for k in range(5):
        put(B[6] + .15 + k * 1.1, gust(.7, 500, 1600, .35), .4, .4, -.5)
    put(B[6] + 5.6, gust(3.0, 600, 200, .35, .55, 500, 250), .45)
    # 8 control centre shrinks
    put(B[7] + .5, gust(2.6, 900, 250, .3, .5, 900, 300), .5)
    # 9 frozen, crown falls
    put(B[8] + .3, gust(2.2, 1800, 3200, .5, .6, 2200, 2900), .35)
    put(B[8] + 2.5, gust(1.2, 300, 120, .4), .55, .3)
    # 10 house burns to ash
    put(B[9] + .7, roar(4.4), .6)
    put(B[9] + 3.1, gust(1.8, 200, 600, .3, .3, 300, 500), .55)
    # 11 rewire swell, phone, tap
    put(B[10] + .2, gust(3.2, 200, 1800, .8, .35, 400, 1400), .45)
    put(B[10] + 3.3, gust(1.0, 300, 1500, .4), .55)
    put(B[10] + 5.8, gust(.5, 1200, 700, .25), .35, .4)
    put(B[10] + 6.2, breeze(2.8, 800), .3)
    return np.stack([L, R], 1)


def load_voice(path):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)


def mix(voice_path, out_wav, ratio_db=-6.0, target=-14.0):
    import pyloudnorm as pyln
    meter = pyln.Meter(SR)
    v = load_voice(voice_path)
    s = build()
    n = max(len(v), len(s))
    v = np.pad(v, ((0, n - len(v)), (0, 0)))
    s = np.pad(s, ((0, n - len(s)), (0, 0)))
    lv, ls = meter.integrated_loudness(v), meter.integrated_loudness(s)
    g = 10 ** ((lv + ratio_db - ls) / 20)        # wind loudness = voice - 6 dB (~50% volume)
    m = v + s * g
    m *= 10 ** ((target - meter.integrated_loudness(m)) / 20)
    th = 10 ** (-1 / 20)
    over = np.abs(m) > th
    m[over] = np.sign(m[over]) * (th + (1 - th) * np.tanh((np.abs(m[over]) - th) / (1 - th)))
    m = m[:int(S.AUDIO_LEN * SR)]
    wavfile.write(out_wav, SR, (np.clip(m, -1, 1) * 32767).astype(np.int16))
    print(f'voice {lv:.1f} LUFS, wind {ls + 20 * math.log10(g):.1f} LUFS, mix -> {target} LUFS')


if __name__ == '__main__':
    mix(sys.argv[1], sys.argv[2])
