#!/usr/bin/env python3
"""Synthesised sound effects synced to the motion graphics (no music)."""
import os, sys
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
import scenes as S

SR = 44100
B = S.B
rng = np.random.default_rng(1)


def env(n, a=.01, r=.3):
    t = np.arange(n) / SR
    e = np.minimum(t / max(a, 1e-4), 1) * np.exp(-np.maximum(t - a, 0) / max(r, 1e-4))
    return e


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, 'low', fs=SR, output='sos'), x)


def hpf(x, f, order=2):
    return sosfilt(butter(order, f, 'high', fs=SR, output='sos'), x)


def noise(d):
    return rng.standard_normal(int(d * SR))


def sweep_filter(x, f0, f1, q=1.5):
    """time-varying band-pass via block processing"""
    out = np.zeros_like(x)
    n = len(x)
    blk = 512
    for i in range(0, n, blk):
        t = i / n
        fc = f0 * (f1 / f0) ** t
        lo, hi = fc / q, min(fc * q, SR / 2 - 100)
        out[i:i + blk] = bp(x[max(0, i - 2048):i + blk], lo, hi)[-len(x[i:i + blk]):]
    return out


def whoosh(d=.7, f0=300, f1=4000):
    n = int(d * SR)
    x = sweep_filter(noise(d), f0, f1, 1.8)
    t = np.linspace(0, 1, n)
    e = np.sin(np.pi * t) ** 1.5
    return x * e / (np.abs(x).max() + 1e-9)


def boom(d=1.4, f0=110, f1=35):
    n = int(d * SR)
    t = np.arange(n) / SR
    f = f0 * (f1 / f0) ** (t / d)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t * 3.2)
    s += lp(noise(d), 300) * np.exp(-t * 9) * .4
    return s / np.abs(s).max()


def click(d=.06, f=3000):
    x = bp(noise(d), f * .6, f * 1.6) * env(int(d * SR), .001, .012)
    return x / np.abs(x).max()


def lock():
    a = click(.05, 2500)
    b = click(.08, 1600)
    out = np.zeros(int(.25 * SR))
    out[:len(a)] += a
    o = int(.09 * SR)
    out[o:o + len(b)] += b * 1.2
    return out


def knock():
    d = .18
    t = np.arange(int(d * SR)) / SR
    s = np.sin(2 * np.pi * 140 * t) * np.exp(-t * 35) + lp(noise(d), 900) * np.exp(-t * 60) * .5
    return s / np.abs(s).max()


def flush(d=2.8):
    n = int(d * SR)
    t = np.arange(n) / SR
    x = lp(noise(d), 1400) * (1 + .5 * np.sin(2 * np.pi * 6 * t))
    x += bp(noise(d), 200, 600) * .6
    e = np.minimum(t / .25, 1) * np.exp(-np.maximum(t - 1.2, 0) * 1.8)
    x *= e
    return x / np.abs(x).max()


def zap(d=.35):
    n = int(d * SR)
    t = np.arange(n) / SR
    f = 120 + 900 * rng.random(n // 400 + 1).repeat(400)[:n]
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sign(np.sin(ph)) * .5 + hpf(noise(d), 2000) * .6
    s *= env(n, .002, .12) * (rng.random(n) > .15)
    return s / np.abs(s).max()


def beep(f=1200, d=.12):
    t = np.arange(int(d * SR)) / SR
    return np.sin(2 * np.pi * f * t) * env(len(t), .005, .05)


def powerdown(d=1.0, f0=900, f1=60):
    t = np.arange(int(d * SR)) / SR
    f = f0 * (f1 / f0) ** (t / d)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = (np.sin(ph) + .3 * np.sign(np.sin(ph))) * (1 - t / d) ** 1.5
    return lp(s, 3000) / np.abs(s).max()


def riser(d=1.5, f0=200, f1=1800):
    n = int(d * SR)
    t = np.arange(n) / SR
    x = sweep_filter(noise(d), f0, f1, 1.4)
    f = f0 * (f1 / f0) ** (t / d)
    x = x / (np.abs(x).max() + 1e-9) + .3 * np.sin(2 * np.pi * np.cumsum(f) / SR)
    return x * (t / d) ** 2


def heartbeat():
    def thump(d=.16):
        t = np.arange(int(d * SR)) / SR
        return np.sin(2 * np.pi * 55 * t) * np.exp(-t * 22)
    out = np.zeros(int(.5 * SR))
    a = thump()
    out[:len(a)] += a
    o = int(.2 * SR)
    out[o:o + len(a)] += a * .7
    return out


def shatter(d=1.2):
    n = int(d * SR)
    out = hpf(noise(d), 2500) * env(n, .001, .08)
    t = np.arange(n) / SR
    for i in range(40):
        st = int(rng.random() * .5 * SR)
        f = rng.uniform(2500, 7500)
        L = n - st
        tt = np.arange(L) / SR
        out[st:] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * rng.uniform(15, 40)) * .5
    return out / np.abs(out).max()


def crackle(d=1.2, dens=60):
    n = int(d * SR)
    out = np.zeros(n)
    for i in range(int(dens * d)):
        st = int(rng.random() * (n - 800))
        c = click(.015, rng.uniform(2000, 6000))
        out[st:st + len(c)] += c * rng.uniform(.3, 1)
    return out / np.abs(out).max()


def hiss(d=1.0):
    n = int(d * SR)
    t = np.arange(n) / SR
    x = hpf(noise(d), 3000) * np.exp(-t * 3) * np.minimum(t / .03, 1)
    return x / np.abs(x).max()


def chime(fs=(880, 1320, 1760), d=1.6):
    t = np.arange(int(d * SR)) / SR
    s = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * (2.5 + i)) / (i + 1) for i, f in enumerate(fs))
    return s * np.minimum(t / .005, 1) / 1.6


def sparkle(d=.25):
    t = np.arange(int(d * SR)) / SR
    f = rng.uniform(2000, 4000)
    return np.sin(2 * np.pi * f * t) * np.exp(-t * 25)


def tick():
    return click(.02, 4500)


def drip():
    d = .12
    t = np.arange(int(d * SR)) / SR
    f = 1300 * np.exp(-t * 18) + 400
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), .002, .04)


def glitch(d=.3):
    n = int(d * SR)
    x = noise(d)
    x = np.round(x * 3) / 3
    x *= (rng.random(n // 600 + 1).repeat(600)[:n] > .4)
    return bp(x, 400, 6000) / 3


def rumble(d=1.5):
    t = np.arange(int(d * SR)) / SR
    x = lp(noise(d), 120, 4) * np.sin(np.pi * t / d)
    return x / np.abs(x).max()


def pop():
    d = .09
    t = np.arange(int(d * SR)) / SR
    f = 600 * np.exp(-t * 30) + 200
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), .001, .03)


def build():
    total = int((S.AUDIO_LEN + .5) * SR)
    L = np.zeros(total)
    R = np.zeros(total)

    def put(t, x, g=.5, pan=0.0):
        i = int(max(t, 0) * SR)
        x = x[:max(total - i, 0)]
        L[i:i + len(x)] += x * g * (1 - max(pan, 0))
        R[i:i + len(x)] += x * g * (1 + min(pan, 0))

    # transitions
    for k in range(1, len(B) - 1):
        mode = S.TRANS[k - 1]
        b = B[k]
        if mode == 'fade':
            put(b - .45, whoosh(.8, 250, 3500), .3)
            put(b - .05, boom(.9, 90, 40), .12)
        elif mode in ('zoom', 'spin'):
            put(b - .45, whoosh(.75, 250, 5000), .32)
            put(b - .05, boom(.9, 90, 40), .18)
        elif mode == 'slide':
            put(b - .4, whoosh(.65, 2500, 300), .34)
        elif mode == 'wipe':
            put(b - .35, whoosh(.6, 400, 6000), .28, .3)
            put(b - .35, riser(.4, 800, 4000), .08)
        elif mode == 'flash':
            put(b - .5, riser(.5, 300, 3000), .2)
            put(b - .03, boom(1.0, 120, 40), .26)
        elif mode == 'glitch':
            put(b - .2, glitch(.45), .3)
    # scene 1
    put(0.0, boom(1.6, 70, 30), .3)
    put(.1, riser(1.0, 100, 600) * .5, .1)
    put(B[0] + 2.55, glitch(.3), .25)
    put(B[0] + 2.6, whoosh(.3, 2000, 400), .2)
    # scene 2 door
    put(B[1] + .8, lock(), .45, .25)
    put(B[1] + 1.0, chime((660,), .3), .12)
    for k in range(4):
        put(B[1] + 1.82 + k * .27, knock(), .45, -.2)
    # scene 3 bed
    put(B[2] + 2.0, pop(), .25)
    put(B[2] + 2.15, pop(), .2)
    put(B[2] + 2.3, pop(), .2)
    put(B[2] + 2.35, sparkle(.4), .12)
    put(B[2] + 3.2, crackle(.5, 20), .25)
    put(B[2] + 3.22, boom(.6, 160, 60), .2)
    # scene 4 crying + clock
    for k in range(18):
        put(B[3] + .2 + k * .19, tick(), .1, .3)
    for k in range(5):
        put(B[3] + .4 + k * .75, drip(), .14)
    # toilet
    put(B[4] + .62, click(.05, 1800), .35, .3)
    put(B[4] + .7, flush(3.0), .3)
    put(B[4] + 3.0, sparkle(.8) * .8, .12)
    put(B[4] + 3.0, whoosh(1.1, 3000, 400), .15)
    # medical
    put(B[5] + .2, beep(1500), .14)
    put(B[5] + .45, beep(1500), .14)
    for k in range(3):
        put(B[5] + 2.42 + k * .3, zap(.32), .2, (k - 1) * .3)
    for k in range(4):
        put(B[5] + 3.4 + k * .4, beep(880, .18), .13)
    put(B[5] + 3.6, powerdown(1.3), .2)
    # brain stim
    for k in range(int(3.5 * 4.5)):
        put(B[6] + .1 + k * .222, beep(2200 + 300 * (k % 3), .05), .08)
    put(B[6] + 3.6, powerdown(.4, 1500, 200), .15)
    put(B[6] + 4.3, zap(.3), .14)
    # dopamine
    for st in (.3, 1.1, 1.9, 2.7):
        put(B[7] + st + .15, sparkle(.2), .1)
        put(B[7] + st + .9, pop(), .25)
        put(B[7] + st + .92, hiss(.3), .07)
    for k in range(3):
        put(B[7] + 3.5 + k * .33, beep(330, .2), .15)
    # split
    put(B[8] + .05, whoosh(.5, 600, 3000), .15)
    put(B[8] + 1.0, powerdown(1.4, 500, 50), .14)
    put(B[8] + 3.9, whoosh(.5, 300, 4000), .25)
    put(B[8] + 4.05, boom(1.0, 130, 45), .3)
    put(B[8] + 4.1, crackle(2.6, 40), .12)
    # pfc
    put(B[9] + .2, beep(1000, .15), .1)
    put(B[9] + 1.0, powerdown(1.6, 600, 80), .2)
    put(B[9] + 1.8, crackle(1.0, 30), .22)
    # crown
    put(B[10] + .2, chime((990, 1485), 1.0), .1)
    put(B[10] + .75, crackle(.4, 30), .2)
    put(B[10] + 1.12, shatter(1.4), .35)
    put(B[10] + 1.12, boom(1.0, 100, 35), .25)
    # heart / rage / flame
    for k, tt in enumerate((.1, .75, 1.55, 2.6)):
        put(B[11] + tt, heartbeat(), .45 - k * .07)
    put(B[11] + .4, crackle(1.3, 45), .13)
    put(B[11] + 3.5, riser(.15, 200, 1200), .1)
    put(B[11] + 3.58, boom(1.2, 140, 35), .38)
    put(B[11] + 3.6, rumble(.8), .3)
    put(B[11] + 3.6, zap(.5), .15)
    put(B[11] + 4.35, whoosh(.4, 300, 1500), .12)
    put(B[11] + 4.7, hiss(.9), .14)
    # family + trash
    put(B[12] + .3, rumble(1.5), .35)
    put(B[12] + .3, crackle(1.2, 25), .18)
    put(B[12] + 2.3, whoosh(.55, 800, 3500), .3)
    put(B[12] + 3.05, knock() * .8, .3, .4)
    put(B[12] + 3.06, click(.08, 1200), .3, .4)
    put(B[12] + 3.4, chime((784, 1175), 1.2), .1)
    # neurons
    put(B[13] - .1, riser(2.0, 200, 3000), .12)
    for k in range(14):
        put(B[13] + .15 + k * .11, sparkle(.2), .1, (k % 3 - 1) * .4)
    # CTA
    put(B[14] + .05, whoosh(.6, 300, 3000), .3)
    put(B[14] + .55, boom(1.0, 120, 45), .22)
    put(B[14] + .6, chime((523, 784, 1046), 2.0), .18)
    put(B[14] + 1.0, sparkle(.4), .12)
    put(B[14] + 2.95, click(.04, 2000), .3)
    put(B[14] + 3.0, chime((1046, 1568, 2093), 1.8), .16)
    put(B[14] + 3.0, whoosh(.5, 1500, 6000), .1)
    st = np.stack([L, R], 1)
    st = np.tanh(st * 1.1) * .9
    return st


if __name__ == '__main__':
    out = sys.argv[1]
    st = build()
    wavfile.write(out, SR, (st * 32767).astype(np.int16))
    print('ok', st.shape, np.abs(st).max())
