"""Foley sintesis (numpy+scipy) untuk video 30 hari — senatural mungkin: layer noise + envelope, granular, resonansi
benda (kayu/logam/kaca), Karplus-Strong untuk senar. TANPA beep synth (kecuali 3 bunyi teknologi: ekg_flatline,
neon_switch_click, neon_buzz_soft). Semua dinormalisasi ke -20 LUFS (referensi); level akhir diatur mixer."""
import os, sys
import numpy as np
from scipy.io import wavfile
import pyloudnorm as pyln
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_sfx import (SR, t, N, env, ar, bell, bp, lp, hp, tone, glide, pink, brown, sweep_bp, place, silence, ks, reverb, add)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'sfx')
rng = np.random.default_rng(23)
S = {}
def sfx(fn): S[fn.__name__] = fn; return fn

# ---------- blok bangunan foley ----------
def grains(d, n, lo, hi, dec=(0.002, 0.008), amp=(0.2, 1.0), dens=None):
    """butiran noise acak (kertas, kain, pasir, hujan). dens = fungsi densitas waktu (0..1)."""
    y = silence(d)
    for _ in range(n):
        s = rng.uniform(0, d - 0.02)
        if dens is not None and rng.uniform() > dens(s / d): continue
        g = env(bp(N(0.03), lo, hi), 0.0003, rng.uniform(*dec)) * rng.uniform(*amp)
        place(y, g, s)
    return y
def knock(f0=180, dec=0.05, q=(0.8, 1.25), nd=0.03):   # ketukan kayu/meja
    return add(env(bp(N(0.25), f0 * q[0], f0 * q[1], 3), 0.0005, dec), env(lp(N(0.1), 400), 0.0005, nd) * 0.6)
def thump(d=0.4, f=120, dec=0.09):                       # benda berat/lembut jatuh
    return add(env(lp(N(d), f * 2), 0.002, dec) * 1.2, env(tone(glide(f, f * 0.6, d), d), 0.002, dec * 0.8) * 0.5)
def metal(fs, dec=0.25, d=0.8):                          # resonansi logam (inharmonik)
    return sum(a * env(tone(f, d), 0.0005, dec / (1 + i * 0.3)) for i, (f, a) in enumerate(fs))
def click(d=0.004, lo=2000, hi=8000, a=1.0):
    return env(bp(N(0.03), lo, hi), 0.0002, d) * a
def breath(d, lo=500, hi=3000, shape='exhale'):
    x = bp(pink(d), lo, hi)
    u = np.linspace(0, 1, len(x))
    e = np.sin(np.pi * u) ** (0.6 if shape == 'exhale' else 1.4)
    if shape == 'exhale': e *= np.exp(-u * 1.5)
    return x * e
def stroke_env(d, rate, jitter=0.3):                      # amplop goresan tangan (pulpen/kapur/pensil)
    tt = t(d); ph = np.cumsum(rate * (1 + jitter * rng.standard_normal(len(tt)) * 0.02)) / SR
    return np.clip(np.sin(2 * np.pi * ph), 0, 1) ** 1.5 * (0.6 + 0.4 * rng.uniform(size=len(tt)) ** 4)
def whoosh(d, f0, f1, peak=0.5, lpf=2600):
    return lp(bell(sweep_bp(pink(d), f0, f1, 0.9), peak), lpf)

# ---------- HOOK ----------
@sfx
def camera_shutter():
    y = silence(0.35)
    place(y, add(click(0.006, 1800, 7000, 1.2), env(bp(N(0.05), 3000, 3600, 4), 0.0003, 0.01) * 0.5, env(lp(N(0.05), 500), 0.0005, 0.012) * 0.5), 0)
    place(y, add(click(0.008, 1500, 6000, 0.9), env(lp(N(0.05), 600), 0.0005, 0.015) * 0.5), 0.07)
    return y
@sfx
def paper_scan_whoosh():
    d = 0.7
    return whoosh(d, 700, 3200, 0.55, 6000) * 0.8 + grains(d, 160, 1500, 7000, amp=(0.05, 0.25), dens=lambda u: np.sin(np.pi * u))
@sfx
def whoosh_air(): return whoosh(0.45, 300, 1600, 0.5)
@sfx
def light_sweep_air():
    d = 0.9; return lp(bell(hp(pink(d), 1500) * 0.6 + bp(pink(d), 500, 2000) * 0.4, 0.55), 7000)
@sfx
def blur_whoosh_soft(): return whoosh(0.6, 200, 900, 0.45, 1500)
@sfx
def lock_click():
    y = silence(0.4)
    place(y, add(click(0.004, 2500, 8000), metal([(4300, .3), (6100, .2)], 0.03, 0.1)), 0)
    place(y, add(click(0.006, 2000, 7000, 0.8), env(lp(N(0.05), 700), 0.0005, 0.02) * 0.5, metal([(3200, .25), (5200, .15)], 0.05, 0.15)), 0.09)
    return y
@sfx
def pen_scribble():
    d = 0.55; return bp(N(d), 2200, 7000) * stroke_env(d, 9) * 0.9 + bp(N(d), 600, 1500) * stroke_env(d, 9) * 0.15
@sfx
def paper_flip_fast():
    d = 0.9; y = silence(d); s = 0.0; iv = 0.11
    while s < d - 0.08:
        place(y, add(env(bp(N(0.06), 900, 5000), 0.002, 0.018) * 0.9, bell(bp(pink(0.07), 300, 1500), 0.3) * 0.4), s)
        s += iv; iv = max(0.035, iv * 0.85)
    return y
@sfx
def stamp_thud():
    y = silence(0.5)
    place(y, thump(0.3, 110, 0.05), 0)
    place(y, env(bp(N(0.05), 900, 3000), 0.0005, 0.012) * 0.8, 0)
    place(y, knock(190, 0.04) * 0.6, 0.002)
    return reverb(y, 0.12, 0.2)

# ---------- FASE 1 ----------
@sfx
def marker_circle():
    d = 0.7; return bp(N(d), 1500, 4500) * (0.5 + 0.5 * np.sin(2 * np.pi * 2.2 * t(d)) ** 2) * ar(np.ones(int(SR * d)), 0.05, 0.1) * 0.7
@sfx
def heavy_sack_thud():
    y = silence(0.8)
    place(y, thump(0.6, 80, 0.12) * 1.2, 0)
    place(y, grains(0.5, 120, 400, 3000, (0.004, 0.012), (0.1, 0.5), dens=lambda u: np.exp(-u * 4)), 0)
    return y
@sfx
def pen_check():
    y = silence(0.35)
    place(y, bp(N(0.07), 2500, 7000) * ar(np.ones(int(SR * 0.07)), 0.005, 0.02), 0)
    place(y, bp(N(0.13), 2500, 7000) * ar(np.ones(int(SR * 0.13)), 0.005, 0.03), 0.08)
    return y
@sfx
def toy_train_loop():
    d = 1.6; y = silence(d)
    for s in np.arange(0, d - 0.1, 0.16):
        place(y, knock(1800, 0.008) * 0.5, s); place(y, knock(1500, 0.008) * 0.4, s + 0.045)
    motor = bp(N(d), 150, 600) * (0.5 + 0.5 * np.sin(2 * np.pi * 14 * t(d))) * 0.08
    return y + motor
@sfx
def clock_tick():
    d = 2.0; y = silence(d)
    for k, s in enumerate(np.arange(0, d - 0.05, 0.5)): place(y, knock(2600 if k % 2 == 0 else 2100, 0.01) * 0.8, s)
    return reverb(y, 0.2, 0.3)
@sfx
def yawn():   # menguap: tarik napas panjang + hembus, tanpa suara vokal sintetis
    y = silence(1.7)
    place(y, breath(0.8, 250, 1600, 'inhale') * 0.8, 0)
    place(y, breath(0.8, 200, 1200, 'exhale') * 0.9, 0.75)
    return lp(y, 3500)
@sfx
def door_close_soft():
    y = silence(0.9)
    place(y, whoosh(0.3, 200, 600, 0.6, 900) * 0.4, 0)
    place(y, thump(0.4, 90, 0.08), 0.28)
    place(y, add(click(0.005, 1500, 5000, 0.7), metal([(2100, .2), (3300, .1)], 0.04, 0.1)), 0.3)
    return reverb(y, 0.2, 0.4)
@sfx
def phone_pickup():
    y = silence(0.5)
    place(y, grains(0.25, 50, 800, 4000, amp=(0.1, 0.4)), 0)
    place(y, knock(900, 0.02) * 0.5, 0.02)
    return y
@sfx
def phone_notification_soft():   # notifikasi HP: dua "tok" marimba lembut (bukan beep)
    y = silence(0.8)
    for s, f in [(0, 880), (0.12, 1320)]:
        place(y, add(env(tone(f, 0.4), 0.002, 0.09), env(tone(f * 4.0, 0.4), 0.001, 0.02) * 0.3, knock(f, 0.01) * 0.2), s)
    return reverb(y, 0.2, 0.3)
@sfx
def screen_tap():
    y = silence(0.2); place(y, add(click(0.003, 1500, 6000, 0.8), env(lp(N(0.05), 300), 0.0005, 0.01) * 0.4), 0); return y
@sfx
def screen_scroll():
    y = silence(0.5)
    for s in (0, 0.2): place(y, bell(bp(N(0.14), 2000, 7000), 0.3) * 0.5, s)
    return y
@sfx
def door_lock_click():
    y = silence(0.6)
    for s in (0, 0.05, 0.1): place(y, click(0.004, 2500, 8000, 0.6), s)
    place(y, add(env(lp(N(0.06), 600), 0.0005, 0.02) * 0.8, metal([(1700, .3), (2800, .2)], 0.06, 0.2)), 0.18)
    return y
@sfx
def light_switch():
    y = silence(0.3); place(y, add(click(0.005, 1200, 5000, 1.0), env(lp(N(0.04), 700), 0.0005, 0.01) * 0.6), 0); return reverb(y, 0.15, 0.2)
@sfx
def heavy_breath():
    y = silence(2.2)
    for s in (0, 1.05):
        place(y, breath(0.45, 400, 2500, 'inhale') * 0.6, s)
        place(y, breath(0.55, 300, 1800, 'exhale') * 0.9, s + 0.48)
    return y
@sfx
def heartbeat():
    y = silence(2.0)
    for s in (0, 0.78, 1.56):
        place(y, add(env(lp(N(0.15), 120), 0.004, 0.05) * 1.2, env(tone(55, 0.15), 0.004, 0.05) * 0.8), s)
        place(y, add(env(lp(N(0.15), 110), 0.004, 0.04) * 0.8, env(tone(48, 0.15), 0.004, 0.04) * 0.6), s + 0.2)
    return y
@sfx
def blanket_rustle():
    d = 0.9; return grains(d, 500, 700, 6000, (0.003, 0.01), (0.05, 0.4), dens=lambda u: np.sin(np.pi * u) ** 0.7) + bp(pink(d), 300, 1500) * bell(np.ones(int(SR * d)), 0.4) * 0.15
@sfx
def teeth_chatter():
    d = 0.8; y = silence(d)
    for s in np.arange(0, d - 0.03, 0.055): place(y, knock(2200, 0.006) * rng.uniform(0.3, 0.7), s + rng.uniform(0, 0.01))
    return y

# ---------- FASE 2 ----------
@sfx
def paper_page_turn():
    d = 0.5; return add(bell(bp(pink(d), 400, 3000), 0.45) * 0.7, grains(d, 60, 1500, 6000, amp=(0.05, 0.3), dens=lambda u: np.sin(np.pi * u)))
@sfx
def glass_clink():
    y = silence(0.9)
    place(y, add(metal([(2800, .5), (4520, .35), (6710, .2), (8900, .1)], 0.35, 0.8), click(0.002, 4000, 10000, 0.5)), 0)
    place(y, metal([(2950, .3), (4700, .2), (7000, .1)], 0.25, 0.6) * 0.6, 0.11)
    return y
@sfx
def chalk_fast():
    d = 0.7; return bp(N(d), 1800, 7500) * stroke_env(d, 6) * (1 + 0.6 * (rng.uniform(size=int(SR * d)) > 0.97)) * 0.8
@sfx
def soft_hit():
    y = silence(0.6); place(y, add(thump(0.4, 75, 0.1), env(bp(N(0.1), 500, 1500), 0.001, 0.02) * 0.3), 0); return reverb(y, 0.2, 0.4)
@sfx
def chalk_down():
    d = 0.45; return bp(N(d), 1800, 6500) * ar(np.ones(int(SR * d)), 0.02, 0.08) * (0.7 + 0.3 * rng.uniform(size=int(SR * d)) ** 3)
@sfx
def cape_flutter():
    d = 1.0; tt = t(d)
    flap = (0.5 + 0.5 * np.sin(2 * np.pi * (9 + 3 * np.sin(2 * np.pi * 1.1 * tt)) * tt)) ** 2
    return bp(pink(d), 250, 2200) * flap * bell(np.ones(len(tt)), 0.3)
@sfx
def cloth_drop():
    y = silence(0.7); place(y, whoosh(0.3, 300, 900, 0.5, 1500) * 0.5, 0); place(y, thump(0.3, 140, 0.04) * 0.5, 0.26)
    place(y, grains(0.25, 60, 600, 3000, amp=(0.05, 0.3)), 0.26); return y
@sfx
def knob_click():
    y = silence(0.5)
    for k in range(5): place(y, click(0.003, 2500, 7000, 0.6 - k * 0.05), k * 0.075)
    return y

# ---------- FASE 3 ----------
@sfx
def rain_loop():
    d = 22.0
    bed = bp(pink(d), 500, 7000) * 0.25 + lp(pink(d), 400) * 0.1
    drops = grains(d, 9000, 2000, 9000, (0.001, 0.004), (0.05, 0.4))
    heavy = grains(d, 600, 400, 2000, (0.004, 0.012), (0.1, 0.5))
    y = bed + drops + heavy
    fade = int(SR * 0.6); y[:fade] *= np.linspace(0, 1, fade); y[-fade:] *= np.linspace(1, 0, fade)
    return y
@sfx
def paper_rustle():
    d = 0.6; return grains(d, 200, 1200, 7000, (0.002, 0.008), (0.05, 0.5), dens=lambda u: np.sin(np.pi * u))
@sfx
def body_flop_bed():
    y = silence(1.0); place(y, thump(0.6, 70, 0.15) * 1.1, 0)
    sp = bp(np.sin(2 * np.pi * np.cumsum(520 + 60 * np.sin(2 * np.pi * 7 * t(0.35))) / SR) + 0.3 * N(0.35), 400, 1600) * ar(np.ones(int(SR * 0.35)), 0.02, 0.15) * 0.12
    place(y, sp, 0.05); place(y, grains(0.4, 100, 700, 4000, amp=(0.05, 0.3)), 0); return y
@sfx
def needle_drop():
    y = silence(0.9)
    for k in range(8): place(y, click(0.003, 2000, 6000, 0.5 - k * 0.04), k * 0.07)
    place(y, knock(1200, 0.02) * 0.5, 0.6); return y
@sfx
def sigh():   # helaan napas murni
    return lp(breath(1.0, 250, 2000, 'exhale') * 1.0, 3000)
@sfx
def ekg_flatline():   # bunyi teknologi (1/3): nada monitor lembut, bukan laser
    d = 1.8; return add(ar(tone(880, d) * 0.5 + tone(1760, d) * 0.06, 0.08, 0.5), click(0.003, 1500, 4000, 0.2))
@sfx
def paper_unfold():
    d = 0.7; return add(grains(d, 180, 1000, 6000, (0.003, 0.01), (0.05, 0.5)), bell(bp(pink(d), 300, 1500), 0.5) * 0.4)
@sfx
def water_slosh():
    d = 0.9; tt = t(d)
    x = lp(pink(d), 900) * (0.5 + 0.5 * np.sin(2 * np.pi * 2.3 * tt) ** 2) * bell(np.ones(len(tt)), 0.35)
    for s in rng.uniform(0.1, 0.7, 6): place(x, env(tone(glide(400, rng.uniform(700, 1100), 0.04), 0.04), 0.001, 0.015) * 0.15, s)
    return x
@sfx
def footsteps_pacing():
    d = 3.0; y = silence(d)
    for k, s in enumerate(np.arange(0.05, d - 0.2, 0.42)):
        place(y, add(thump(0.15, 140, 0.03) * (0.9 if k % 2 else 0.7), env(bp(N(0.08), 1000, 3500), 0.003, 0.02) * 0.3), s)
    return reverb(y, 0.12, 0.25)
@sfx
def footsteps_walk():
    d = 2.0; y = silence(d)
    for k, s in enumerate(np.arange(0.05, d - 0.2, 0.48)):
        place(y, add(thump(0.15, 160, 0.025) * 0.6, grains(0.12, 50, 1500, 6000, (0.002, 0.006), (0.1, 0.5))), s)
    return y
@sfx
def pop_soft():
    y = silence(0.3); place(y, add(env(lp(N(0.05), 900), 0.0005, 0.01) * 0.8, env(tone(glide(500, 260, 0.08), 0.08), 0.001, 0.02) * 0.4), 0); return y
@sfx
def water_flow():
    d = 2.2; tt = t(d)
    x = bp(pink(d), 400, 5000) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.9 * tt + 1) * np.sin(2 * np.pi * 2.7 * tt)) * ar(np.ones(len(tt)), 0.2, 0.4)
    for s in rng.uniform(0.1, 2.0, 28): place(x, env(tone(glide(500, rng.uniform(800, 1600), 0.03), 0.03), 0.001, 0.01) * 0.12, s)
    return x

# ---------- FASE 4 ----------
@sfx
def curtain_open():
    d = 1.2; y = grains(d, 260, 2500, 7000, (0.002, 0.006), (0.1, 0.5), dens=lambda u: 1 - u * 0.6)
    for s in np.arange(0.02, 0.8, 0.09): place(y, metal([(3400, .2), (5100, .1)], 0.02, 0.06), s)
    return y + bell(bp(pink(d), 300, 1800), 0.4) * 0.5
@sfx
def birds_morning():
    d = 2.4; y = silence(d)
    for s in sorted(rng.uniform(0, d - 0.3, 9)):
        n = rng.integers(2, 5); f0 = rng.uniform(2800, 4200)
        for k in range(n):
            dd = 0.05; f = np.concatenate([glide(f0, f0 * 1.35, dd / 2), glide(f0 * 1.35, f0 * 0.95, dd / 2)])
            place(y, ar(np.sin(2 * np.pi * np.cumsum(f * (1 + 0.04 * np.sin(2 * np.pi * 70 * t(len(f) / SR)))) / SR), 0.004, 0.015) * rng.uniform(0.2, 0.5), s + k * 0.07)
    return reverb(lp(y, 9000), 0.3, 0.5)
@sfx
def phone_slide_table():
    d = 0.45; return bp(N(d), 400, 2500) * ar(np.ones(int(SR * d)), 0.03, 0.12) * (0.8 + 0.2 * rng.uniform(size=int(SR * d)))
@sfx
def hand_swat():
    y = silence(0.4); place(y, whoosh(0.15, 600, 2500, 0.7, 4000) * 0.6, 0); place(y, add(env(hp(N(0.04), 1000), 0.0003, 0.008) * 1.0, env(lp(N(0.04), 500), 0.0005, 0.01) * 0.5), 0.13); return y
@sfx
def dumbbell_set_down():
    y = silence(0.9); place(y, add(thump(0.4, 100, 0.06), metal([(620, .4), (1460, .3), (2390, .15)], 0.3, 0.8) * 0.6), 0); return y
@sfx
def door_open():
    y = silence(1.2); place(y, add(click(0.005, 1500, 5000, 0.8), metal([(2100, .2), (3300, .1)], 0.04, 0.1)), 0)
    cr = bp(np.sin(2 * np.pi * np.cumsum(330 + 90 * np.sin(2 * np.pi * 1.3 * t(0.8)) + 25 * rng.standard_normal(int(SR * 0.8))) / SR), 250, 1500)
    place(y, cr * ar(np.ones(len(cr)), 0.1, 0.3) * 0.25, 0.08); return y
@sfx
def guitar_strum():
    y = silence(2.0)
    for k, f in enumerate([82.4, 110, 146.8, 196, 246.9, 329.6]): place(y, ks(f, 1.8, 0.996) * 0.35, k * 0.014)
    place(y, env(bp(N(0.05), 2000, 6000), 0.001, 0.01) * 0.2, 0)
    return lp(y, 6000)
@sfx
def workout_breath():
    y = silence(2.0)
    for s in (0, 0.65, 1.3): place(y, breath(0.35, 600, 3000, 'exhale') * 0.9, s)
    return y
@sfx
def book_close():
    y = silence(0.5); place(y, whoosh(0.12, 400, 1500, 0.6) * 0.4, 0); place(y, add(thump(0.25, 160, 0.03), env(bp(N(0.05), 600, 2500), 0.001, 0.015) * 0.5), 0.1); return y
@sfx
def book_open():
    y = silence(0.7); place(y, add(knock(700, 0.02) * 0.3, bell(bp(pink(0.4), 400, 3000), 0.3) * 0.7), 0)
    place(y, grains(0.3, 50, 1500, 6000, amp=(0.05, 0.3)), 0.15); return y
@sfx
def pencil_write():
    d = 1.2; return bp(N(d), 2500, 8000) * stroke_env(d, 5.5) * 0.6 + bp(N(d), 800, 2000) * stroke_env(d, 5.5) * 0.08
@sfx
def scissors_snip():
    y = silence(0.4); place(y, bp(N(0.09), 3000, 9000) * np.linspace(0.2, 1, int(SR * 0.09)) * 0.6, 0)
    place(y, add(click(0.004, 2500, 8000, 1.0), metal([(3900, .2), (6200, .1)], 0.03, 0.1)), 0.09); return y
@sfx
def string_drop():
    y = silence(0.5); place(y, grains(0.3, 40, 800, 4000, amp=(0.05, 0.3)), 0); place(y, thump(0.15, 200, 0.02) * 0.2, 0.28); return y
@sfx
def mascot_hmph():   # suara maskot kartun pendek (vokal), bukan beep
    d = 0.45; u = np.linspace(0, 1, int(SR * d))
    f0 = np.interp(u, [0, 0.4, 1], [210, 260, 200])
    v = sum(np.sin(2 * np.pi * np.cumsum(f0 * h) / SR) / h for h in (1, 2, 3, 4, 5))
    v = bp(v, 200, 600) + bp(v, 2000, 3000) * 0.2
    y = v * np.interp(u, [0, 0.1, 0.6, 1], [0, 1, 0.7, 0]) * 0.5
    place(y, breath(0.12, 800, 3000, 'exhale') * 0.5, 0.3); return y
@sfx
def padlock_open():
    y = silence(0.7)
    for s in (0, 0.06): place(y, click(0.004, 2500, 8000, 0.6), s)
    place(y, add(env(lp(N(0.05), 800), 0.0005, 0.015) * 0.7, metal([(2600, .4), (3900, .25), (5800, .1)], 0.15, 0.5)), 0.16)
    return reverb(y, 0.15, 0.3)
@sfx
def warm_swell():   # swell hangat lembut (pad udara + akor redup), tanpa beep
    d = 2.0; u = np.linspace(0, 1, int(SR * d))
    chord = sum(np.sin(2 * np.pi * f * t(d) + rng.uniform(0, 6)) * (1 + 0.003 * np.sin(2 * np.pi * 4 * t(d))) for f in (196, 246.9, 293.7, 392)) * 0.12
    air = bp(pink(d), 800, 5000) * 0.25
    return lp(chord + air, 3500) * np.interp(u, [0, 0.55, 1], [0, 1, 0]) ** 1.3

# ---------- FASE 5 ----------
@sfx
def tape_pull():
    d = 0.7; y = silence(d); s = 0.0; iv = 0.03
    while s < 0.5:
        place(y, env(bp(N(0.02), 1500, 6000), 0.0005, 0.004) * rng.uniform(0.3, 0.8), s); s += iv; iv = max(0.008, iv * 0.9)
    place(y, env(hp(N(0.05), 1500), 0.0005, 0.012) * 0.8, 0.52); return y
@sfx
def ribbon_snap():
    y = silence(0.8); place(y, add(env(hp(N(0.05), 800), 0.0003, 0.01) * 1.2, env(lp(N(0.05), 400), 0.0005, 0.015) * 0.5), 0)
    place(y, cape_flutter()[:int(SR * 0.5)] * 0.4, 0.02); return y
@sfx
def steering_grip():
    d = 0.4; tt = t(d)
    sq = bp(N(d), 900, 2600) * (0.5 + 0.5 * (np.sin(2 * np.pi * 38 * tt) > 0.3)) * ar(np.ones(len(tt)), 0.03, 0.1)
    return sq * 0.6
@sfx
def engine_idle_soft():
    d = 1.8; tt = t(d); pulses = silence(d)
    for s in np.arange(0, d, 1 / 26.0): place(pulses, env(lp(N(0.03), 300), 0.002, 0.012), s)
    return lp(pulses + lp(brown(d), 120) * 0.4, 500) * ar(np.ones(len(tt)), 0.25, 0.4)
@sfx
def snore_soft():
    d = 2.6; y = silence(d)
    for s in (0, 1.3):
        tt = t(0.7); flutter = (0.5 + 0.5 * np.sin(2 * np.pi * 28 * tt)) ** 2
        place(y, lp(pink(0.7), 500) * flutter * np.sin(np.pi * np.linspace(0, 1, len(tt))) * 0.9, s)
        place(y, breath(0.5, 300, 1500, 'exhale') * 0.4, s + 0.72)
    return y
@sfx
def alarm_clock_bell():
    d = 1.5; y = silence(d)
    for k, s in enumerate(np.arange(0, 1.2, 1 / 18)):
        place(y, metal([(2350 if k % 2 else 2470, .4), (5900, .2), (7700, .1)], 0.05, 0.15) * 0.7, s)
        place(y, click(0.002, 3000, 8000, 0.3), s)
    return y
@sfx
def water_bubbles():
    d = 1.4; y = lp(pink(d), 600) * 0.12 * bell(np.ones(int(SR * d)), 0.4)
    for s in sorted(rng.uniform(0, d - 0.05, 22)): place(y, env(tone(glide(300, rng.uniform(600, 1300), 0.035), 0.035), 0.001, 0.012) * rng.uniform(0.1, 0.3), s)
    return y

# ---------- CTA ----------
@sfx
def crystal_join_soft():
    y = silence(1.2)
    place(y, metal([(1870, .3), (2930, .2), (4410, .12)], 0.5, 1.1) * 0.5, 0.0)
    place(y, grains(0.6, 120, 4000, 10000, (0.002, 0.006), (0.02, 0.12)), 0.05)
    return reverb(y, 0.25, 0.5)
@sfx
def neon_switch_click():   # bunyi teknologi (2/3)
    y = silence(0.5); place(y, light_switch(), 0)
    place(y, grains(0.2, 40, 2000, 8000, (0.001, 0.003), (0.1, 0.5)), 0.03); return y
@sfx
def neon_buzz_soft():   # bunyi teknologi (3/3)
    d = 4.0; tt = t(d)
    h = sum(a * np.sin(2 * np.pi * f * tt) for f, a in [(120, .5), (240, .2), (360, .1)]) * (0.85 + 0.15 * np.sin(2 * np.pi * 0.7 * tt))
    return ar(h * 0.5 + grains(d, 60, 2000, 7000, (0.001, 0.003), (0.02, 0.1)), 0.15, 0.6)


# ---------- tambahan revisi 2 ----------
@sfx
def scan_sweep():   # sapuan scan halus (udara), bukan laser
    d = 0.7; return lp(bell(sweep_bp(pink(d), 1200, 4000, 0.7), 0.5) * 0.7, 7000)
@sfx
def bar_rise():     # batang grafik naik: luncuran halus naik + ketuk kecil di akhir
    d = 1.0; y = lp(sweep_bp(pink(d), 400, 2400, 0.8) * np.linspace(0.3, 1, int(SR * d)) ** 1.2, 4000) * ar(np.ones(int(SR * d)), 0.05, 0.1)
    place(y, knock(900, 0.03) * 0.5, d - 0.08); return y
@sfx
def bar_fall():
    d = 0.8; return lp(sweep_bp(pink(d), 2000, 400, 0.8), 3500) * ar(np.ones(int(SR * d)), 0.03, 0.2)
@sfx
def whoosh_up():
    d = 0.6; return lp(bell(sweep_bp(pink(d), 500, 3000, 0.9), 0.7), 5000)
@sfx
def push_whoosh():  # dorongan tangan (udara)
    d = 0.45; return lp(bell(sweep_bp(pink(d), 900, 300, 0.9), 0.35), 2500)
@sfx
def footsteps_short():
    d = 0.9; y = silence(d)
    for k, s in enumerate((0.0, 0.32, 0.62)):
        place(y, add(thump(0.15, 140, 0.03) * (0.8 if k % 2 else 0.65), env(bp(N(0.08), 1000, 3500), 0.003, 0.02) * 0.3), s)
    return reverb(y, 0.12, 0.25)
@sfx
def bed_sit():      # duduk di kasur: tekanan kasur empuk + kain
    y = silence(0.7); place(y, thump(0.4, 90, 0.08) * 0.7, 0)
    place(y, grains(0.35, 80, 600, 3500, amp=(0.05, 0.25)), 0.02); return y

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    meter = pyln.Meter(SR, block_size=0.1)
    for name, fn in S.items():
        x = fn().astype(np.float64)
        fd = int(SR * 0.01); x[-fd:] *= np.linspace(1, 0, fd)
        xx = np.concatenate([x, np.zeros(SR // 2)]) if len(x) < SR // 2 else x
        x *= 10 ** ((-20 - meter.integrated_loudness(xx)) / 20)
        pk = np.abs(x).max()
        if pk > 0.95: x *= 0.95 / pk
        wavfile.write(os.path.join(OUT, name + '.wav'), SR, (x * 32767).astype(np.int16))
    print(len(S), 'foley ditulis')
