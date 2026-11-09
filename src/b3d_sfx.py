#!/usr/bin/env python3
"""SFX for the 3D brain one-shot video (new sound palette: FM / tonal / granular, no music),
plus the final mix: SFX bus set to 50% (-6 dB) of the voice-over loudness."""
import os, sys, math, subprocess
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
import b3d_video as V

SR = 44100
rng = np.random.default_rng(11)


def T(d):
    return np.arange(int(d * SR)) / SR


def adsr(n, a=.005, r=.2):
    t = np.arange(n) / SR
    return np.minimum(t / max(a, 1e-4), 1) * np.exp(-np.maximum(t - a, 0) / max(r, 1e-4))


def filt(x, kind, f, order=2):
    return sosfilt(butter(order, f, kind, fs=SR, output='sos'), x)


def acc(out, st, x, g=1.0):
    n = max(0, min(len(x), len(out) - st))
    out[st:st + n] += x[:n] * g


def norm(x):
    m = np.abs(x).max()
    return x / m if m > 0 else x


def glide(f0, f1, d, wave='sine', curve='exp'):
    t = T(d)
    f = f0 * (f1 / f0) ** (t / d) if curve == 'exp' else f0 + (f1 - f0) * t / d
    ph = 2 * np.pi * np.cumsum(f) / SR
    if wave == 'sine':
        return np.sin(ph)
    if wave == 'saw':
        return 2 * ((ph / (2 * np.pi)) % 1) - 1
    if wave == 'square':
        return np.sign(np.sin(ph))
    if wave == 'tri':
        return 2 * np.abs(2 * ((ph / (2 * np.pi)) % 1) - 1) - 1


def fm_bell(f, d=1.2, ratio=1.4, idx=3.0, decay=2.5):
    t = T(d)
    m = np.sin(2 * np.pi * f * ratio * t) * idx * np.exp(-t * decay * 1.5)
    return np.sin(2 * np.pi * f * t + m) * np.exp(-t * decay)


def sub_thump(f=48, d=.35):
    t = T(d)
    return np.sin(2 * np.pi * (f + 40 * np.exp(-t * 30)) * t) * np.exp(-t * 11)


# ---------------------------------------------------------------- camera moves
def cam_zip(up=True, d=.32):
    a, b = (180, 1500) if up else (1500, 200)
    x = glide(a, b, d, 'saw')
    x = filt(x, 'low', 3500) * np.sin(np.pi * np.arange(len(x)) / len(x)) ** 1.2
    tr = glide(a * 2, b * 2, d, 'sine') * .3 * np.sin(np.pi * np.arange(len(x)) / len(x))
    y = norm(x + tr) * .8
    th = sub_thump()
    out = np.zeros(len(y) + len(th))
    out[:len(y)] += y
    out[int(d * .8 * SR):int(d * .8 * SR) + len(th)] += th * .9
    return out


def cam_pan(d=.3):
    x = glide(700, 260, d, 'tri') * .6 + glide(1400, 520, d, 'sine') * .4
    x *= np.sin(np.pi * np.arange(len(x)) / len(x)) ** .8
    th = sub_thump(55, .3)
    out = np.zeros(len(x) + len(th))
    out[:len(x)] += x
    out[int(d * .75 * SR):int(d * .75 * SR) + len(th)] += th * .8
    return out


def cam_servo(d=.36):
    t = T(d)
    f = 260 + 220 * (t / d)
    s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * (.5 + .5 * np.sin(2 * np.pi * 38 * t))
    s = filt(s, 'band', [150, 2500]) * np.sin(np.pi * t / d)
    th = sub_thump(60, .25)
    out = np.zeros(len(s) + len(th))
    out[:len(s)] += norm(s) * .55
    out[int(d * .8 * SR):int(d * .8 * SR) + len(th)] += th * .8
    return out


# ---------------------------------------------------------------- illustration sounds
def pluck(f, d=.8):
    n = int(d * SR)
    L = int(SR / f)
    buf = rng.uniform(-1, 1, L)
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % L]
        buf[i % L] = .5 * (buf[i % L] + buf[(i + 1) % L]) * .996
    return out


def sizzle(d):
    t = T(d)
    x = filt(rng.standard_normal(len(t)), 'high', 4000)
    g = (rng.random(len(t) // 220 + 1) ** 6).repeat(220)[:len(t)]
    return x * g * np.minimum(t / .3, 1) * np.minimum((d - t) / .3, 1)


def snap():
    return glide(1800, 400, .07, 'sine') * adsr(int(.07 * SR), .001, .03)


def bass_pulse(d, rate=4.0):
    t = T(d)
    return np.sin(2 * np.pi * 52 * t) * (np.sin(np.pi * rate * t) ** 8) * np.minimum((d - t) / .2, 1)


def tinkles(d, n=40, lo=2500, hi=7000):
    out = np.zeros(int(d * SR))
    for _ in range(n):
        st = int(rng.random() * (len(out) - SR * .3))
        b = fm_bell(rng.uniform(lo, hi), .3, rng.uniform(1.2, 3.1), 1.5, 14)
        acc(out, st, b, rng.uniform(.2, .6))
    return out


def sub_drop(d=1.6):
    t = T(d)
    x = glide(130, 28, d, 'sine') * np.exp(-t * 1.8)
    x += np.tanh(glide(65, 30, d, 'sine') * 3) * np.exp(-t * 6) * .4
    return x


def mri(d):
    t = T(d)
    s = np.sign(np.sin(2 * np.pi * 210 * t)) * (np.sin(2 * np.pi * 6 * t) > .2)
    return filt(s, 'band', [150, 1800]) * .5 * np.minimum(t / .2, 1) * np.minimum((d - t) / .2, 1)


def chirp2():
    a = glide(900, 1300, .09, 'tri') * adsr(int(.09 * SR), .002, .05)
    b = glide(1300, 900, .09, 'tri') * adsr(int(.09 * SR), .002, .05)
    return np.concatenate([a, np.zeros(int(.04 * SR)), b])


def eeg_slow(d):
    t = T(d)
    rate = 9 * (1 - t / d) + .2
    vib = np.sin(2 * np.pi * np.cumsum(rate) / SR)
    f = 330 + 60 * vib * (1 - t / d)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * .4 * np.minimum(t / .2, 1)


def blip_off():
    return glide(500, 160, .08, 'square') * adsr(int(.08 * SR), .001, .03) * .4


def clank():
    b = fm_bell(320, 1.0, 2.76, 6, 4)
    b[:int(.8 * SR)] += fm_bell(510, .8, 3.3, 4, 6) * .6
    return b


def rattle(d):
    out = np.zeros(int(d * SR))
    for k in range(int(d * 14)):
        st = int(k / 14 * SR + rng.random() * 600)
        c = fm_bell(rng.uniform(1800, 3200), .08, 2.76, 4, 40)
        acc(out, st, c, rng.uniform(.3, .7))
    return out


def deflate(d):
    t = T(d)
    x = glide(380, 110, d, 'sine') * .7 + filt(rng.standard_normal(len(t)), 'band', [300, 1200]) * .15
    return x * np.minimum(t / .2, 1) * np.minimum((d - t) / .4, 1)


def screech(d):
    t = T(d)
    f = 2800 + 300 * np.sin(2 * np.pi * 7 * t)
    m = np.sin(2 * np.pi * 410 * t) * 2.5
    x = np.sin(2 * np.pi * np.cumsum(f) / SR + m) * np.minimum(t / .15, 1) * np.minimum((d - t) / .2, 1)
    return x * .5


def metal_crack():
    x = filt(rng.standard_normal(int(.25 * SR)), 'high', 2500) * adsr(int(.25 * SR), .001, .04)
    b = fm_bell(1900, .4, 3.7, 5, 12) * .6
    b[:len(x)] += x
    return b


def arcs(d):
    t = T(d)
    x = filt(rng.standard_normal(len(t)), 'band', [900, 3200])
    g = (rng.random(len(t) // 600 + 1) > .55).repeat(600)[:len(t)].astype(float)
    g = filt(g, 'low', 60)
    return x * g * .7


def typing(d):
    out = np.zeros(int(d * SR))
    k = 0.0
    while k < d - .05:
        st = int(k * SR)
        c = filt(rng.standard_normal(int(.02 * SR)), 'band', [1500, 5000]) * adsr(int(.02 * SR), .0005, .006)
        acc(out, st, c, rng.uniform(.4, .9))
        k += rng.uniform(.06, .14)
    return out


def stutter(d, f=700):
    t = T(d)
    s = np.sin(2 * np.pi * f * t + 3 * np.sin(2 * np.pi * 90 * t))
    gate = (np.sin(2 * np.pi * 26 * t) > 0).astype(float)
    return s * gate * .5


def woodtick():
    t = T(.05)
    return np.sin(2 * np.pi * 1850 * t) * np.exp(-t * 120)


def ticks_accel(d):
    out = np.zeros(int(d * SR))
    k, step = 0.0, .32
    while k < d:
        st = int(k * SR)
        w = woodtick()
        acc(out, st, w)
        k += step
        step = max(step * .86, .05)
    return out


def bubble(f=900):
    return glide(f, f * .35, .1, 'sine') * adsr(int(.1 * SR), .002, .04)


def crumble(d):
    out = np.zeros(int(d * SR))
    for _ in range(int(d * 45)):
        st = int(rng.random() * (len(out) - 3000))
        g = filt(rng.standard_normal(2000), 'band', [200, rng.uniform(900, 2500)]) * adsr(2000, .0005, .01)
        acc(out, st, g, rng.uniform(.2, 1))
    return out


def knock_wood():
    t = T(.12)
    return np.sin(2 * np.pi * 420 * t) * np.exp(-t * 60) + np.sin(2 * np.pi * 900 * t) * np.exp(-t * 90) * .4


def flick():
    n = int(.06 * SR)
    return filt(rng.standard_normal(n), 'band', [2000, 7000]) * adsr(n, .002, .015)


def alarm(d):
    t = T(d)
    f = np.where((t * 4) % 1 < .5, 640, 860)
    s = 2 * ((np.cumsum(f) / SR) % 1) - 1
    return filt(s, 'low', 2500) * .35 * np.minimum((d - t) / .2, 1)


def wobble(d):
    t = T(d)
    f = 140 * (1 + .06 * np.sin(2 * np.pi * 11 * t))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) + .3 * np.sin(2 * np.pi * np.cumsum(f * 2.01) / SR)
    return s * (.6 + .4 * np.sin(2 * np.pi * 9 * t)) * np.minimum(t / .2, 1) * np.minimum((d - t) / .3, 1) * .6


def stone():
    t = T(.3)
    return np.sin(2 * np.pi * (90 + 60 * np.exp(-t * 25)) * t) * np.exp(-t * 14) + \
        filt(rng.standard_normal(len(t)), 'low', 600) * np.exp(-t * 30) * .3


def shimmer(d, base=1800):
    t = T(d)
    s = sum(np.sin(2 * np.pi * base * r * t + k) for k, r in enumerate((1, 1.005, 1.5, 2.002, 2.997)))
    return s / 5 * np.sin(np.pi * t / d) ** 2 * .5


def drain(d):
    t = T(d)
    s = glide(620, 70, d, 'square')
    s = np.round(s * 4) / 4
    return filt(s, 'low', 2200) * .5 * np.minimum((d - t) / .15, 1)


def gate_slam():
    b = fm_bell(140, 1.6, 2.4, 8, 2.5) * .8
    x = np.zeros(int(1.8 * SR))
    x[:len(b)] += b
    th = sub_thump(45, .5)
    x[:len(th)] += th
    # comb "metal room" tail
    y = x.copy()
    for dl, g in ((.031, .5), (.053, .35), (.087, .25)):
        k = int(dl * SR)
        y[k:] += x[:-k] * g
    return y


def glass_burst(d=.8):
    return tinkles(d, 50, 3000, 9000) + filt(rng.standard_normal(int(d * SR)), 'high', 5000) * adsr(int(d * SR), .001, .05)


def crash_synth(d=1.0):
    t = T(d)
    return glide(900, 90, d, 'saw') * np.exp(-t * 2) * .5


def big_hit():
    x = np.zeros(int(2.0 * SR))
    k = np.tanh(sub_drop(1.2) * 2.5)
    x[:len(k)] += k
    x[:int(1.5 * SR)] += crumble(1.5) * .6
    return x


def reverse_swell(d=1.4):
    b = fm_bell(660, d, 1.5, 4, 2.2) + fm_bell(990, d, 2.0, 3, 2.6) * .6
    return b[::-1] * .8


def marimba(f, d=1.0):
    t = T(d)
    return (np.sin(2 * np.pi * f * t) * np.exp(-t * 6) + .5 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 18))


def build():
    total = int((V.AUDIO_LEN + .5) * SR)
    L = np.zeros(total)
    R = np.zeros(total)

    def put(t, x, g=.5, pan=0.0):
        i = int(max(t, 0) * SR)
        x = np.asarray(x)[:max(total - i, 0)]
        L[i:i + len(x)] += x * g * min(1, 1 - pan)
        R[i:i + len(x)] += x * g * min(1, 1 + pan)

    # camera moves
    prev = V.BEATS[0]
    for b in V.BEATS[1:]:
        t0, cx, cy, z, tilt, mv = b
        pan = clampf((cx - prev[1]) / 160, -.7, .7)
        if mv in ('zoom', 'zoomout'):
            put(t0 - .06, cam_zip(mv == 'zoom'), .42, pan)
        elif mv == 'pan':
            put(t0 - .05, cam_pan(), .45, pan)
        else:
            put(t0 - .05, cam_servo(), .45)
        prev = b
    # 1 PFC burned by the screen
    put(.35, fm_bell(1250, 1.0, 1.4, 2.5, 3), .25, .4)
    put(.6, sizzle(3.0), .12)
    for k, (t0, f) in enumerate(((5.6, 523), (6.3, 659), (6.9, 784))):
        put(t0, pluck(f), .35, (k - 1) * .4)
    for k in range(3):
        put(7.6 + k * .12, snap(), .3, (k - 1) * .4)
    # 2 lust in front of a screen, dopamine explosion
    put(8.55, glide(300, 900, .5, 'tri') * np.sin(np.pi * T(.5) / .5), .2, .4)
    put(8.7, bass_pulse(2.3), .5)
    put(11.05, sub_drop(1.8), .6)
    put(11.1, tinkles(2.2, 60), .22)
    # hypofrontality scan + EEG
    put(14.15, mri(2.6), .16)
    put(14.25, chirp2(), .25, -.4)
    put(16.9, eeg_slow(2.8), .2, -.3)
    for k in range(8):
        put(17.1 + k * .17, blip_off(), .3)
    # chains, grey matter shrink, brake
    put(19.9, clank(), .35)
    put(19.95, rattle(1.3), .2)
    put(21.5, bubble(700), .3, -.4)
    put(22.0, deflate(4.5), .22)
    put(26.95, screech(1.1), .14, .4)
    put(28.0, metal_crack(), .4, .4)
    put(28.1, arcs(2.8), .18)
    # 4 can't work / few minutes / instant stimulation
    put(31.1, typing(1.9), .3, -.4)
    put(33.0, stutter(1.2), .2, -.4)
    put(34.7, ticks_accel(2.5), .32, .3)
    put(37.2, glide(220, 110, .5, 'square') * adsr(int(.5 * SR), .005, .2), .2, .3)
    put(35.6, tinkles(1.4, 18, 1500, 4000), .15)
    for k in range(14):
        put(37.85 + k * .26, bubble(700 + 160 * (k % 4)), .32, -.5 if k % 2 == 0 else .5)
    # 5 structural damage, procrastination, panic, trembling
    put(41.8, crumble(2.5), .3)
    put(44.55, knock_wood(), .4, -.4)
    for k in range(5):
        put(44.85 + k * .36, flick(), .35, -.4)
    put(46.9, alarm(2.1), .25, .3)
    put(49.05, wobble(2.6), .35)
    # 6 paralysed future, energy drained, fake illusion
    put(51.75, fm_bell(1568, .8, 1.4, 2, 4), .2, .4)
    put(51.8, shimmer(2.6), .14)
    for k in range(5):
        put(52.6 + k * .32, stone(), .4, .4)
    put(54.7, drain(2.2), .3, -.4)
    put(57.05, stutter(2.2, 420), .22, -.4)
    put(57.1, tinkles(2.0, 20, 4000, 8000), .12, -.4)
    # 7 no repair, cage, plans, failure
    for k in range(13):
        put(59.35 + k * .38, flick() * 1.2, .3, .4)
    put(59.4, deflate(4.5) * .8, .15)
    put(64.35, rattle(1.0), .2)
    put(65.6, gate_slam(), .5)
    for k in range(14):
        put(67.4 + k * .13, fm_bell(1200 + 90 * k, .5, 1.4, 1.5, 6), .16, (k % 3 - 1) * .5)
    put(70.0, glass_burst(1.0), .35)
    put(70.4, crash_synth(1.1), .3, .4)
    # 8 shatter, neuroplasticity, CTA
    put(72.3, big_hit(), .65)
    put(74.5, reverse_swell(1.4), .45)
    put(75.9, snap() * 1.5, .4)
    for k, f in enumerate((392, 440, 523, 587, 659, 784, 880, 1047)):
        put(75.2 + k * .45, pluck(f, .9), .22, (k % 3 - 1) * .4)
    put(75.3, arcs(3.5), .08)
    put(76.9, glide(250, 1200, .45, 'tri') * np.sin(np.pi * T(.45) / .45), .25, .4)
    put(77.5, marimba(784), .4, .3)
    put(77.62, marimba(1175), .3, .3)
    put(78.5, knock_wood() * .6, .4, .4)
    put(78.55, marimba(1568, 1.2), .35, .4)
    put(79.65, arcs(3.3), .14)
    put(79.7, shimmer(2.8, 1200), .2)
    # pop entrances / glitch exits of the illustrations
    for t0, pan in POP_IN_T:
        put(t0, pop_in(), .22, pan)
    for t0, pan in GLITCH_OUT_T:
        put(t0, glitch_out(), .2, pan)
    return np.stack([L, R], 1)


POP_IN_T = [(.35, .4), (8.55, .4), (14.25, -.4), (16.85, -.4), (21.5, -.4), (26.95, .4), (31.05, -.4),
            (34.65, .3), (44.55, -.4), (46.85, .4), (49.05, 0), (51.72, .4), (54.65, -.4), (57.05, -.4),
            (59.3, .4), (70.0, .4), (76.9, .4), (77.5, .3)]
GLITCH_OUT_T = [(3.85, .4), (7.6, 0), (8.45, 0), (11.15, .4), (16.85, -.4), (19.8, -.4), (21.45, 0),
                (26.95, -.4), (31.05, .4), (34.65, -.4), (37.75, .3), (41.8, 0), (46.85, -.4), (49.05, .4),
                (51.72, 0), (54.65, .4), (57.05, -.4), (59.3, -.4), (64.25, .4), (71.0, 0), (72.35, .4)]


def pop_in():
    t = T(.14)
    x = np.sin(2 * np.pi * np.cumsum(260 + 900 * (t / .14) ** .5) / SR) * np.exp(-t * 22)
    x[:200] += rng.standard_normal(200) * np.linspace(.6, 0, 200)
    return x


def glitch_out(d=.36):
    t = T(d)
    f = np.where((t * 40).astype(int) % 3 == 0, 1800, np.where((t * 40).astype(int) % 3 == 1, 600, 3200))
    s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR))
    gate = (rng.random(len(t) // 700 + 1) > .35).repeat(700)[:len(t)]
    s = np.round(s * gate * 3) / 3
    return filt(s, 'band', [300, 6000]) * np.exp(-t * 5) * .6


def clampf(x, a, b):
    return max(a, min(b, x))


def load_voice(path):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)


def mix(voice_path, out_wav, sfx_ratio_db=-6.0, target_lufs=-14.0):
    import pyloudnorm as pyln
    meter = pyln.Meter(SR)
    v = load_voice(voice_path)
    s = build()
    n = max(len(v), len(s))
    v = np.pad(v, ((0, n - len(v)), (0, 0)))
    s = np.pad(s, ((0, n - len(s)), (0, 0)))
    lv = meter.integrated_loudness(v)
    ls = meter.integrated_loudness(s)
    g = 10 ** ((lv + sfx_ratio_db - ls) / 20)   # SFX loudness = voice - 6 dB  (~50% perceived volume)
    s *= g
    m = v + s
    lm = meter.integrated_loudness(m)
    m *= 10 ** ((target_lufs - lm) / 20)
    # soft limiter above -1 dBFS
    th = 10 ** (-1 / 20)
    over = np.abs(m) > th
    m[over] = np.sign(m[over]) * (th + (1 - th) * np.tanh((np.abs(m[over]) - th) / (1 - th)))
    m = m[:int(V.AUDIO_LEN * SR)]
    wavfile.write(out_wav, SR, (np.clip(m, -1, 1) * 32767).astype(np.int16))
    print(f'voice {lv:.1f} LUFS, sfx {ls:.1f} -> {ls + 20 * math.log10(g):.1f} LUFS, mix -> {target_lufs} LUFS')


if __name__ == '__main__':
    mix(sys.argv[1], sys.argv[2])
