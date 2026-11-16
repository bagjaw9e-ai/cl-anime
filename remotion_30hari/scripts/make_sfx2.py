"""SFX tambahan untuk video kejantanan (reuse helper & library dari make_sfx.py).
- SFX ilustrasi baru (layering noise + tone + envelope)
- SFX PENTING (imp_*) berlapis: impact/bass + elemen utama + ekor reverb pendek
- template SFX kamera (cam_*) — panjang final dibentuk ulang di mixer sesuai durasi gerak kamera
Semua dinormalisasi ke -20 LUFS (referensi); level akhir di mix_sfx.py."""
import os, sys
import numpy as np
from scipy.io import wavfile
import pyloudnorm as pyln
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make_sfx as B  # noqa: E402
from make_sfx import (SR, t, N, env, ar, bell, bp, lp, hp, tone, saw, glide, brown, pink, sweep_bp, place, silence,
                      bellish, ks, reverb, click, add)

OUT = B.OUT
rng = np.random.default_rng(11)
S = {}
def sfx(fn): S[fn.__name__] = fn; return fn
def tail(x, amt=0.35, d=0.5): return reverb(x, amt, d)
def impact(d=1.2, f0=95, f1=36, k=7):
    return np.tanh(1.6 * add(env(tone(glide(f0, f1, d, k), d), 0.003, 0.4), env(lp(N(d), 260), 0.002, 0.07) * 0.8))

# ---------------- ilustrasi ----------------
@sfx
def sand_flow():
    d = 1.6; g = silence(d)
    for s in rng.uniform(0, d - 0.02, 900): place(g, env(bp(N(0.006), 3000, 9000), 0.0002, 0.0015) * rng.uniform(.1, .4), s)
    return ar(lp(g, 9000) + bp(N(d), 1500, 5000) * 0.05, 0.2, 0.4)

@sfx
def check_tick():
    y = silence(0.35)
    place(y, env(tone(1320, 0.12), 0.002, 0.04), 0)
    place(y, env(tone(1980, 0.18), 0.002, 0.06), 0.07)
    place(y, click(0.003, 2500) * 0.4, 0)
    return y

@sfx
def whistle():
    notes = [(1180, 0.22), (1400, 0.18), (1250, 0.2), (1580, 0.34)]
    y = silence(1.2); s = 0
    for f, d in notes:
        v = tone(f * (1 + 0.012 * np.sin(2 * np.pi * 6 * t(d))), d) + bp(N(d), f * 0.8, f * 1.3) * 0.08
        place(y, ar(v, 0.03, 0.05), s); s += d
    return y * 0.8

@sfx
def crack_soft():
    y = silence(0.6)
    for s in [0, 0.05, 0.13, 0.22]: place(y, env(bp(N(0.05), 900, 4000), 0.0003, 0.012) * rng.uniform(.4, .8), s)
    place(y, env(lp(N(0.3), 300), 0.002, 0.05) * 0.4, 0)
    return y

@sfx
def holo_blip():
    y = silence(1.0)
    place(y, env(tone(glide(400, 1600, 0.18), 0.18), 0.003, 0.08), 0)
    place(y, env(tone(glide(800, 2400, 0.12), 0.12), 0.003, 0.05) * 0.5, 0.12)
    place(y, ar(bp(N(0.6), 4000, 10000), 0.1, 0.4) * 0.08, 0.1)
    return tail(y, 0.25)

@sfx
def molecule_whoosh():
    d = 0.9
    w = bell(sweep_bp(pink(d), 600, 3000, 0.7), 0.5)
    bub = silence(d)
    for s in sorted(rng.uniform(0.1, 0.7, 10)): place(bub, env(tone(glide(500, 1300, 0.05), 0.05), 0.001, 0.02) * 0.3, s)
    return w + bub

@sfx
def dark_hum():
    d = 1.9; tt = t(d)
    h = lp(saw(55 * (1 + 0.004 * np.sin(2 * np.pi * 0.7 * tt)), d), 500) * 0.5 + tone(110, d) * 0.2
    h += bp(N(d), 2500, 4000) * 0.04 * (0.5 + 0.5 * np.sin(2 * np.pi * 5 * tt))
    return ar(h, 0.3, 0.5)

@sfx
def suction():
    d = 0.9
    w = sweep_bp(pink(d), 3500, 300, 0.9) * np.linspace(0.3, 1, int(SR * d)) ** 1.5
    return ar(w + tone(glide(300, 90, d), d) * 0.2, 0.05, 0.05)

@sfx
def merge_pop():
    y = silence(0.9)
    place(y, env(tone(glide(160, 60, 0.3), 0.3), 0.002, 0.1), 0)
    place(y, bellish(1046, 0.6, 0.4) * 0.4, 0.01)
    return tail(y, 0.25)

@sfx
def reel():
    d = 0.9; y = silence(d); s = 0.0; iv = 0.05
    while s < d - 0.05:
        place(y, env(bp(N(0.02), 2500, 4500), 0.0003, 0.006) * 0.7, s); s += iv; iv *= 0.97
    place(y, ar(tone(glide(300, 520, 0.5), 0.5), 0.05, 0.1) * 0.15, 0.35)
    return y

@sfx
def tap_tap():
    y = silence(2.1)
    for k, s in enumerate(np.arange(0, 2.0, 0.155)):
        place(y, add(env(bp(N(0.04), 1800, 3200, 3), 0.0004, 0.01), env(tone(900, 0.04), 0.0005, 0.01) * 0.3) * (0.9 if k % 2 == 0 else 0.6), s)
    return y

@sfx
def loop_whoosh():
    d = 1.2; tt = t(d)
    return ar(sweep_bp(pink(d), 500, 1800, 0.8) * (0.6 + 0.4 * np.sin(2 * np.pi * 2.5 * tt)), 0.15, 0.3)

@sfx
def digital_signal():
    y = silence(1.2)
    for k, s in enumerate(np.arange(0, 1.0, 0.07)):
        f = rng.choice([1600, 2000, 2400, 3000])
        place(y, ar(np.sign(np.sin(2 * np.pi * f * t(0.04))) * 0.3, 0.003, 0.01), s)
    place(y, ar(bp(N(1.0), 3000, 7000), 0.2, 0.3) * 0.05, 0)
    return lp(y, 8000)

@sfx
def scroll_fast():
    d = 1.3; y = silence(d)
    for s in np.arange(0, d - 0.05, 0.045): place(y, env(bp(N(0.02), 2000, 5000), 0.0003, 0.004) * rng.uniform(.3, .6), s)
    return y + ar(sweep_bp(pink(d), 800, 2400, 0.6), 0.1, 0.3) * 0.4

@sfx
def click_sharp():
    y = silence(0.4)
    place(y, env(hp(N(0.03), 2500), 0.0002, 0.004) * 1.2, 0)
    place(y, env(tone(2400, 0.08), 0.0005, 0.015) * 0.6, 0)
    place(y, env(tone(glide(900, 1800, 0.1), 0.1), 0.001, 0.04) * 0.3, 0.02)
    return tail(y, 0.2, 0.3)

@sfx
def card_burst():
    d = 1.2; y = silence(d)
    for s in sorted(rng.uniform(0, 0.5, 26)): place(y, env(bp(N(0.04), 900, 4500), 0.0005, 0.012) * rng.uniform(.3, .8), s)
    return y + bell(sweep_bp(pink(d), 400, 3000, 1.0), 0.2) * 0.6

@sfx
def ice_freeze():
    d = 1.6; y = silence(d)
    for s in sorted(rng.uniform(0, 1.3, 40)): place(y, env(bp(N(0.02), 3000, 9000), 0.0002, 0.005) * rng.uniform(.2, .6), s)
    glass = sum(a * env(tone(f, 1.0), 0.002, 0.4) for f, a in [(2637, .3), (3951, .2), (5274, .1)])
    place(y, glass, 0.1)
    return tail(y + ar(bp(N(d), 5000, 11000), 0.4, 0.5) * 0.05, 0.3)

@sfx
def knob_turn():
    d = 1.0; y = silence(d)
    for k, s in enumerate(np.arange(0, 0.9, 0.08)): place(y, env(bp(N(0.02), 1500, 3500), 0.0003, 0.005) * (0.7 - k * 0.04), s)
    return y

@sfx
def muffle_down():
    d = 1.4
    src = bp(N(d), 300, 6000) * 0.4 + saw(220, d) * 0.15
    out = np.zeros_like(src); n = len(src); steps = 30; e = np.linspace(0, n, steps + 1).astype(int)
    for i in range(steps):
        fc = 6000 * (120 / 6000) ** (i / (steps - 1))
        out[e[i]:e[i + 1]] = lp(src, max(fc, 100))[e[i]:e[i + 1]]
    return ar(out, 0.05, 0.3)

@sfx
def wilt():
    d = 1.4
    cr = bp(saw(glide(500, 250, d) * (1 + 0.02 * N(d)), d), 300, 1500) * 0.3
    return ar(cr + tone(glide(600, 300, d), d) * 0.12, 0.1, 0.5)

@sfx
def yawn():
    d = 1.4; tt = t(d)
    f = 180 * np.interp(tt, [0, 0.4, 1.0, 1.4], [1.0, 1.35, 1.1, 0.8])
    v = saw(f, d)
    v = bp(v, 400, 900) + bp(v, 900, 1400) * np.interp(tt, [0, 0.5, 1.4], [0.2, 1, 0.3]) * 0.6
    return ar(v, 0.15, 0.4) * 0.6

@sfx
def gauge_rise():
    d = 1.0; y = silence(d)
    place(y, ar(tone(glide(300, 1100, 0.9), 0.9), 0.05, 0.1) * 0.4, 0)
    for s in np.arange(0, 0.85, 0.06): place(y, env(bp(N(0.02), 2000, 3500), 0.0003, 0.004) * 0.4, s)
    return y

@sfx
def alarm_soft():
    y = silence(1.0)
    for s in [0, 0.32, 0.64]: place(y, ar(tone(glide(880, 660, 0.24), 0.24) + tone(1320, 0.24) * 0.3, 0.01, 0.06) * 0.5, s)
    return lp(y, 6000)

@sfx
def treadmill_run():
    d = 2.6; tt = t(d)
    motor = lp(saw(70, d), 400) * 0.25 + tone(140, d) * 0.08
    steps = silence(d)
    for k, s in enumerate(np.arange(0.05, d - 0.1, 0.19)):
        place(steps, add(env(lp(N(0.1), 500), 0.001, 0.03) * 0.9, env(bp(N(0.06), 1500, 3000), 0.001, 0.01) * 0.3), s)
    return ar(motor + steps, 0.15, 0.3)

@sfx
def crickets():
    y = silence(1.8)
    for s in np.arange(0, 1.6, 0.42):
        for k in range(3):
            place(y, ar(tone(4400, 0.035), 0.004, 0.01) * 0.4, s + k * 0.05)
    return y

@sfx
def pop_out():
    d = 0.18
    return add(env(tone(glide(900, 380, d), d), 0.001, 0.04), env(bp(N(0.05), 800, 3000), 0.0005, 0.01) * 0.3)

@sfx
def bubble_pop():
    y = silence(0.5)
    place(y, env(tone(glide(300, 1200, 0.08), 0.08), 0.001, 0.03), 0)
    place(y, env(tone(glide(500, 1500, 0.06), 0.06), 0.001, 0.02) * 0.5, 0.09)
    return tail(y, 0.2, 0.3)

@sfx
def servo():
    d = 1.3; tt = t(d)
    f = 400 + 300 * np.sin(2 * np.pi * 0.9 * tt) ** 2
    v = bp(saw(f, d), 300, 3000) * 0.35 + bp(N(d), 1000, 3000) * 0.05
    y = ar(v, 0.05, 0.1)
    place(y, env(bp(N(0.03), 1500, 3000), 0.0003, 0.006) * 0.6, d - 0.08)
    return y

@sfx
def blip_nope():
    y = silence(0.6)
    place(y, ar(np.sign(np.sin(2 * np.pi * 660 * t(0.12))) * 0.3 + tone(660, 0.12) * 0.4, 0.005, 0.03), 0)
    place(y, ar(np.sign(np.sin(2 * np.pi * 440 * t(0.18))) * 0.3 + tone(440, 0.18) * 0.4, 0.005, 0.05), 0.16)
    return lp(y, 5000)

@sfx
def level_rise():
    y = silence(1.4)
    for k, s in enumerate(np.arange(0, 1.2, 0.12)): place(y, ar(tone(600 + k * 90, 0.07), 0.004, 0.02) * 0.5, s)
    return y

@sfx
def zip_jacket():
    d = 0.5; y = silence(d)
    for s in np.arange(0, 0.4, 0.012): place(y, env(bp(N(0.01), 2500, 7000), 0.0002, 0.002) * rng.uniform(.3, .7), s)
    return y

@sfx
def whoosh_throw():
    d = 0.5; return bell(sweep_bp(pink(d), 400, 3800, 1.0), 0.35)

@sfx
def phone_far():
    y = silence(0.7)
    for s, a in [(0, 1), (0.12, 0.6), (0.2, 0.35)]: place(y, env(bp(N(0.05), 1500, 4000), 0.0003, 0.01) * a, s)
    return lp(tail(y, 0.4, 0.5), 3500) * 0.7

@sfx
def book_open():
    y = silence(0.7)
    place(y, bell(bp(N(0.3), 600, 3500), 0.3) * 0.8, 0)
    place(y, env(lp(N(0.1), 400), 0.001, 0.03) * 0.4, 0.25)
    return y

@sfx
def ting_short():
    return bellish(2349, 0.35, 0.18, ((1, 1), (2.32, 0.4), (3.9, 0.2)))

@sfx
def spot_thunk():
    y = silence(0.8)
    place(y, env(lp(N(0.2), 600), 0.0005, 0.04) * 1.2, 0)
    place(y, env(tone(glide(110, 60, 0.3), 0.3), 0.001, 0.08) * 0.8, 0)
    return tail(y, 0.3)

# ---------------- PENTING (berlapis: impact + elemen utama + ekor reverb) ----------------
@sfx
def imp_glass_crack():
    y = silence(1.8)
    place(y, impact(1.4, 100, 34), 0)
    place(y, env(hp(N(0.12), 1800), 0.0002, 0.02) * 1.4, 0)
    for s in [0.01, 0.04, 0.08, 0.13, 0.2]: place(y, env(bp(N(0.05), 2500, 9000), 0.0002, 0.01) * rng.uniform(.4, .9), s)
    glass = sum(a * env(tone(f, 0.8), 0.001, 0.25) for f, a in [(2793, .4), (4186, .3), (5587, .2)])
    place(y, glass * 0.5, 0.01)
    return tail(np.tanh(1.4 * y), 0.35, 0.6)

@sfx
def imp_flash():
    y = silence(1.6)
    place(y, impact(1.2, 120, 40), 0)
    place(y, env(hp(N(0.3), 3000), 0.0005, 0.06) * 0.9, 0)
    place(y, env(tone(glide(3000, 600, 0.3), 0.3), 0.001, 0.1) * 0.4, 0)
    return tail(np.tanh(1.3 * y), 0.35, 0.6)

@sfx
def imp_dopamine():
    d = 2.2; y = silence(d)
    place(y, ar(tone(glide(45, 90, 1.2), 1.2) + lp(brown(1.2), 150) * 0.6, 0.6, 0.3) * 0.9, 0)
    place(y, bell(sweep_bp(pink(1.0), 500, 5000, 1.0), 0.25) * 0.8, 0.1)
    bub = silence(1.8)
    for s in sorted(rng.uniform(0, 1.6, 40)): place(bub, env(tone(glide(300, rng.uniform(800, 1600), 0.05), 0.05), 0.001, 0.02) * 0.35, s)
    place(y, bub, 0.2)
    return tail(y, 0.3, 0.5)

@sfx
def imp_digital_boom():
    d = 2.2; y = silence(d)
    ch = silence(1.2)
    for s in sorted(rng.uniform(0, 1.1, 70)):
        f = rng.choice([1200, 1800, 2400, 3200])
        place(ch, ar(np.sign(np.sin(2 * np.pi * f * t(0.03))) * 0.25, 0.002, 0.008) * (s / 1.1), s)
    place(y, ch, 0)
    place(y, impact(1.2, 90, 32) * 1.1, 1.0)
    place(y, env(lp(N(0.6), 900), 0.002, 0.15) * 0.6, 1.0)
    return tail(np.tanh(1.3 * y), 0.35, 0.6)

@sfx
def imp_deflate():
    d = 1.8; y = silence(d)
    place(y, impact(1.2, 80, 30) * 0.8, 0)
    place(y, ar(sweep_bp(N(1.3), 2500, 200, 0.8) * 0.9 + tone(glide(260, 50, 1.3), 1.3) * 0.4, 0.02, 0.5), 0.02)
    return tail(y, 0.3, 0.5)

@sfx
def imp_warp():
    d = 1.8; tt = t(d); y = silence(d)
    wob = tone(glide(300, 120, d) * (1 + 0.25 * np.sin(2 * np.pi * np.interp(tt, [0, d], [3, 9]) * tt)), d) * 0.5
    place(y, ar(wob + lp(saw(glide(150, 60, d), d), 800) * 0.25, 0.01, 0.5), 0)
    place(y, impact(1.0, 110, 40), 0)
    return tail(np.tanh(1.3 * y), 0.35, 0.6)

@sfx
def imp_drain():
    d = 1.8; y = silence(d)
    place(y, ar(lp(saw(glide(600, 40, 1.4, 3), 1.4), 1800) * 0.6 + tone(glide(300, 30, 1.4, 3), 1.4) * 0.4, 0.01, 0.3), 0)
    place(y, impact(1.4, 70, 28) * 0.9, 0.35)
    return tail(np.tanh(1.3 * y), 0.3, 0.5)

@sfx
def imp_panic():
    d = 2.0; y = silence(d)
    place(y, impact(1.0, 110, 40), 0)
    for s in [0, 0.28, 0.56, 0.84]: place(y, ar(np.sign(np.sin(2 * np.pi * 950 * t(0.14))) * 0.25 + tone(1900, 0.14) * 0.15, 0.005, 0.03), s)
    for s in [0.1, 0.55, 1.0, 1.45]:
        place(y, env(tone(glide(70, 45, 0.25), 0.25), 0.005, 0.07) * 0.9, s)
        place(y, env(tone(glide(60, 40, 0.25), 0.25), 0.005, 0.06) * 0.6, s + 0.18)
    return tail(lp(np.tanh(1.3 * y), 7000), 0.3, 0.5)

@sfx
def imp_flatline():
    d = 2.6; y = silence(d)
    place(y, env(tone(glide(90, 40, 0.6), 0.6), 0.003, 0.2) * 0.8, 0)
    place(y, ar(tone(1000, 2.2) + tone(2000, 2.2) * 0.1, 0.01, 0.6) * 0.45, 0.05)
    return tail(y, 0.3, 0.6)

@sfx
def imp_spotlight():
    d = 2.4; y = silence(d)
    place(y, env(lp(N(0.25), 600), 0.0005, 0.05) * 1.3, 0)
    place(y, env(tone(glide(120, 55, 0.4), 0.4), 0.001, 0.12) * 1.0, 0)
    chord = sum(lp(saw(f, 2.2), 1600) for f in [196, 246.9, 293.7, 392]) * 0.12
    place(y, bell(chord + bp(N(2.2), 3000, 8000) * 0.03, 0.55), 0.05)
    return tail(y, 0.35, 0.6)

@sfx
def imp_neon():
    y = silence(1.4)
    place(y, impact(0.9, 100, 45) * 0.8, 0)
    place(y, env(hp(N(0.03), 1500), 0.0002, 0.005) * 1.2, 0)
    bz = np.sign(np.sin(2 * np.pi * 120 * t(0.5))) * 0.5 + bp(N(0.5), 2000, 6000) * 0.3
    place(y, ar(lp(bz, 4000), 0.002, 0.2) * 0.7, 0.005)
    return tail(y, 0.3, 0.5)

@sfx
def imp_rewire():
    d = 2.6; y = silence(d)
    place(y, env(tone(glide(80, 45, 0.6), 0.6), 0.004, 0.2) * 0.7, 0)
    chord = sum(tone(f * (1 + dd), d) for f in [261.6, 329.6, 392, 523.3] for dd in (-0.002, 0.002)) * 0.1
    place(y, bell(lp(chord, 2500) + bp(N(d), 4000, 10000) * 0.03, 0.5), 0)
    for s in sorted(rng.uniform(0.3, 2.0, 8)): place(y, bellish(rng.uniform(2600, 4800), 0.4, 0.2) * 0.2, s)
    return tail(y, 0.3, 0.5)

@sfx
def imp_end_hit():
    y = silence(2.0)
    place(y, env(tone(glide(90, 45, 0.6), 0.6), 0.004, 0.25) * 0.8, 0)
    place(y, bellish(523.3, 1.6, 1.0, ((1, 1), (2.0, 0.4), (3.0, 0.2))) * 0.35, 0)
    return tail(y, 0.4, 0.8)

# ---------------- template kamera (dibentuk ulang di mixer) ----------------
@sfx
def cam_whoosh():
    d = 0.6; return lp(bell(sweep_bp(pink(d), 300, 1800, 1.0), 0.5), 2200)

@sfx
def cam_air():
    d = 1.0; return lp(bell(sweep_bp(pink(d), 250, 900, 0.8), 0.5), 1600)

@sfx
def cam_rumble():
    d = 1.2; return lp(bell(lp(brown(d), 120) + tone(48, d) * 0.3, 0.5), 400)

@sfx
def cam_swell():
    d = 1.0; tt = t(d)
    return lp(bell(sum(tone(f, d) for f in [220, 330]) * 0.2 + bp(pink(d), 300, 1200) * 0.6, 0.7), 1800)


if __name__ == '__main__':
    meter = pyln.Meter(SR, block_size=0.1)
    for name, fn in S.items():
        x = fn().astype(np.float64)
        fade = int(SR * 0.015); x[-fade:] *= np.linspace(1, 0, fade)
        xx = np.concatenate([x, np.zeros(SR // 2)]) if len(x) < SR // 2 else x
        x *= 10 ** ((-20 - meter.integrated_loudness(xx)) / 20)
        pk = np.abs(x).max()
        if pk > 0.95: x *= 0.95 / pk
        wavfile.write(os.path.join(OUT, name + '.wav'), SR, (x * 32767).astype(np.int16))
        print(f'{name:20s} {len(x) / SR:4.2f}s')
