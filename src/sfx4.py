#!/usr/bin/env python3
"""Video 4 SFX: only on animations (no transition sounds), each matched to what happens on screen.
Mixed at -6 dB LUFS under the voice (~50% volume), no music."""
import sys, math
import numpy as np
from scipy.io import wavfile
import scenes4 as S4
import b3d_sfx as X       # FM / tonal / granular generators
import sfx as O           # noise / impact generators from video 1
import sfx3 as G          # wind / fire roar

SR = 44100
B = S4.B


def buzz(d=1.0):
    t = X.T(d)
    s = np.sign(np.sin(2 * np.pi * 150 * t)) * (np.sin(2 * np.pi * 12 * t) > 0)
    return X.filt(s, 'band', [100, 1200]) * .5


def build():
    total = int((S4.AUDIO_LEN + .5) * SR)
    L = np.zeros(total)
    R = np.zeros(total)

    def put(t, x, g=.5, pan=0.0):
        i = int(max(t, 0) * SR)
        x = np.asarray(x, float)[:max(total - i, 0)]
        L[i:i + len(x)] += x * g * min(1, 1 - pan)
        R[i:i + len(x)] += x * g * min(1, 1 + pan)

    # 1 wedding: rings chime, hidden phone buzzes, the bride's heart cracks
    b = B[0]
    put(b + .4, O.chime((880, 1320, 1760), 1.6), .35)
    put(b + 2.2, buzz(1.0), .3, .3)
    put(b + 3.6, X.metal_crack(), .3, -.2)
    put(b + 3.7, O.crackle(.7, 30), .25, -.2)
    put(b + 4.5, O.heartbeat(), .5, -.2)
    # 2 facade: halo shimmer, power off, phone descends, strings attach, puppet jerks
    b = B[1]
    put(b + .3, X.shimmer(2.6, 1400), .3)
    put(b + 3.0, O.powerdown(.8), .3)
    put(b + 3.05, O.whoosh(.6, 2500, 400), .25)
    for k, f in enumerate((196, 247, 294)):
        put(b + 3.4 + k * .1, X.pluck(f, .9), .35, (k - 1) * .4)
    k = 0
    while 3.6 + .224 + k * .449 < 6.9:
        put(b + 3.6 + .224 + k * .449, X.knock_wood(), .35, .3 if k % 2 else -.3)
        k += 1
    # 3 ignored: wife reaches, laptop typing, tissues drop, energy drained, heart falls and cracks
    b = B[2]
    put(b + .5, X.shimmer(1.4, 900), .2, -.4)
    put(b + 1.0, X.typing(1.4), .35, .4)
    for t0 in (3.5, 5.0, 6.3):
        put(b + t0 + .45, X.flick(), .4, .4)
    put(b + 4.0, X.deflate(3.2) * .7, .2, .2)
    put(b + 7.4, X.stone(), .45, -.4)
    put(b + 7.45, X.metal_crack(), .3, -.4)
    # 4 abusive: fist raised, shockwaves, brain chained to the phone
    b = B[3]
    put(b + .25, O.whoosh(.4, 400, 2500), .3, .3)
    put(b + .5, O.boom(1.2, 110, 40), .45)
    for k in range(6):
        put(b + .5 + k * .8, X.sub_thump(55, .4), .4, -.2)
    put(b + 2.0, X.clank(), .35, .3)
    put(b + 2.05, X.rattle(1.2), .2, .3)
    # 5 lazy: grumbling, boxes thud onto the pile, she speaks, he blocks her
    b = B[4]
    put(b + .6, X.wobble(2.8), .3, -.3)
    put(b + .2, X.stone(), .35, .4)
    for k in range(1, 5):
        put(b + 1.25 + (k - 1) * .8, X.stone(), .35, .4)
    put(b + 3.8, X.bubble(800), .35, .3)
    put(b + 4.45, X.glide(220, 180, .35, 'square') * X.adsr(int(.35 * SR), .005, .15), .3, -.3)
    # 6 rage: child footsteps, ball rolls and bumps, screen glitch, explosion of anger, phone drops
    b = B[5]
    for k in range(5):
        put(b + .35 + k * .22, X.knock_wood() * .5, .3, -.5)
    put(b + 1.4, G.roar(.9) * .5, .25, -.2)
    put(b + 2.3, X.knock_wood(), .45)
    put(b + 2.35, O.glitch(.3), .35)
    put(b + 2.7, O.boom(1.3, 130, 35), .5)
    put(b + 2.75, G.roar(3.4), .35)
    put(b + 2.8, O.zap(.4), .25, .3)
    put(b + 3.4, O.click(.06, 1500), .4, .3)
    put(b + 3.45, O.click(.05, 2400), .3, .3)
    # 7 insults hurled at the family, his heart turns to stone and crumbles
    b = B[6]
    put(b + .1, X.stutter(.8, 180), .25, .3)
    for k in range(5):
        put(b + .5 + k, O.whoosh(.4, 600, 3500), .3, .4)
        put(b + 1.0 + k, X.crumble(.4) * .7, .35, -.3)
    put(b + 5.6, X.deflate(1.4), .25, .3)
    put(b + 6.0, X.metal_crack(), .35, .3)
    put(b + 7.2, X.crumble(1.6), .4, .3)
    # 8 prefrontal shrinks and cracks
    b = B[7]
    put(b + .7, X.deflate(2.0), .35)
    put(b + 1.8, O.crackle(1.0, 35), .3)
    # 9 frozen nerves, crown falls and shatters, family walks away
    b = B[8]
    put(b + .3, O.crackle(1.7, 70), .25)
    put(b + .3, X.shimmer(2.0, 2400), .2)
    put(b + 3.2, O.whoosh(.5, 1500, 400), .25, .2)
    put(b + 3.8, X.glass_burst(1.0), .4, .2)
    for k in range(8):
        put(b + 4.0 + k * .27, X.knock_wood() * .4, .3, -.5)
    # 10 house catches fire and collapses to ash
    b = B[9]
    put(b + .6, O.hiss(1.0), .3)
    put(b + .7, G.roar(4.2), .55)
    put(b + 3.2, O.rumble(1.6), .5)
    put(b + 3.3, X.crumble(2.0), .4)
    # 11 neurons reconnect, PMO Savior phone, arrow, tap
    b = B[10]
    for k, f in enumerate((392, 440, 523, 587, 659, 784, 880, 1047)):
        put(b + .3 + k * .3, X.pluck(f, .8), .25, (k % 3 - 1) * .4)
    put(b + .3, X.tinkles(2.4, 30), .15)
    put(b + 3.4, O.whoosh(.5, 300, 3000), .3)
    put(b + 3.8, X.marimba(784), .4)
    put(b + 3.92, X.marimba(1175), .3)
    put(b + 4.3, X.bubble(1000), .3)
    put(b + 5.85, O.click(.04, 2000), .35, .3)
    put(b + 5.9, X.marimba(1568, 1.2), .35, .3)
    return np.stack([L, R], 1)


def mix(voice_path, out_wav, ratio_db=-6.0, target=-14.0):
    import pyloudnorm as pyln
    meter = pyln.Meter(SR)
    v = G.load_voice(voice_path)
    s = build()
    n = max(len(v), len(s))
    v = np.pad(v, ((0, n - len(v)), (0, 0)))
    s = np.pad(s, ((0, n - len(s)), (0, 0)))
    lv, ls = meter.integrated_loudness(v), meter.integrated_loudness(s)
    g = 10 ** ((lv + ratio_db - ls) / 20)        # SFX loudness = voice - 6 dB (~50% volume)
    m = v + s * g
    m *= 10 ** ((target - meter.integrated_loudness(m)) / 20)
    th = 10 ** (-1 / 20)
    over = np.abs(m) > th
    m[over] = np.sign(m[over]) * (th + (1 - th) * np.tanh((np.abs(m[over]) - th) / (1 - th)))
    m = m[:int(S4.AUDIO_LEN * SR)]
    wavfile.write(out_wav, SR, (np.clip(m, -1, 1) * 32767).astype(np.int16))
    print(f'voice {lv:.1f} LUFS, sfx {ls + 20 * math.log10(g):.1f} LUFS, mix -> {target} LUFS')


if __name__ == '__main__':
    mix(sys.argv[1], sys.argv[2])
