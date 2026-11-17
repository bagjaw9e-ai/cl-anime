"""Foley sintesis tambahan video promo (natural: resonansi logam/kayu + noise + envelope, tanpa beep/laser).
chain_rattle, chain_snap, chain_drop, chest_hinge, padlock_drop -> public/sfx/*.wav (-20 LUFS referensi, level diatur mixer)."""
import os, sys
import numpy as np
from scipy.io import wavfile
import pyloudnorm as pyln
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_sfx import SR, t, N, env, ar, bp, lp, hp, tone, place, silence, reverb, add

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'sfx')
rng = np.random.default_rng(77)

def link_clink(sc=1.0, dec=0.06, d=0.35):
    """satu benturan mata rantai: partial logam inharmonik acak + transien noise"""
    base = rng.uniform(1700, 2600) * sc
    parts = [(base, .5), (base * 1.52, .35), (base * 2.31, .22), (base * 3.7, .1)]
    m = sum(a * env(tone(f * rng.uniform(.98, 1.02), d), 0.0003, dec / (1 + i * .4)) for i, (f, a) in enumerate(parts))
    return add(m, env(hp(N(0.02), 2500), 0.0002, 0.004) * 0.6)

def chain_rattle():  # rantai ditarik-tarik: kerumunan klik logam bergelombang ikut gerak meronta (2,6 Hz)
    d = 1.1; y = silence(d + 0.3)
    s = 0.0
    while s < d:
        dens = 0.5 + 0.5 * np.sin(2 * np.pi * 2.6 * s) ** 2
        place(y, link_clink(rng.uniform(.8, 1.2), rng.uniform(.02, .05)) * rng.uniform(.15, .55) * dens, s)
        s += rng.uniform(0.008, 0.03) / (0.4 + dens)
    place(y, env(bp(N(d), 3000, 9000), 0.05, 0.6) * 0.05, 0)  # gesekan halus
    return reverb(y, 0.12, 0.25)

def chain_snap():  # mata rantai patah: retak logam tajam + "ping" pendek + 2-3 mata rantai bergemerincing
    y = silence(0.7)
    place(y, env(hp(N(0.03), 1800), 0.0001, 0.006) * 1.3, 0)
    place(y, env(bp(N(0.05), 300, 1200), 0.0005, 0.02) * 0.6, 0)
    m = sum(a * env(tone(f, 0.5), 0.0003, 0.12 / (1 + i * .5)) for i, (f, a) in enumerate([(1320, .5), (2050, .4), (3180, .25), (4790, .12)]))
    place(y, m * 0.8, 0.002)
    for s in (0.07, 0.13, 0.2): place(y, link_clink(rng.uniform(.9, 1.3), 0.04) * rng.uniform(.2, .4), s + rng.uniform(0, .02))
    return reverb(y, 0.15, 0.3)

def chain_drop():  # potongan rantai jatuh ke lantai keras: benturan pertama + gemerincing yang menipis
    y = silence(1.0)
    place(y, env(lp(N(0.1), 600), 0.0005, 0.025) * 0.8, 0)
    s, a = 0.0, 0.9
    while a > 0.06:
        place(y, link_clink(rng.uniform(.85, 1.15), 0.035) * a, s)
        s += rng.uniform(0.015, 0.06); a *= rng.uniform(0.72, 0.9)
    place(y, env(lp(N(0.1), 500), 0.0005, 0.02) * 0.35, 0.18)  # pantulan kecil
    for k in range(5): place(y, link_clink(1.0, 0.03) * 0.15 * (1 - k / 5), 0.2 + k * 0.03)
    return reverb(y, 0.15, 0.3)

def chest_hinge():  # engsel peti kayu berderit: gesekan stick-slip bernada turun-naik + ketuk kayu di akhir
    d = 0.65; y = silence(1.0)
    tt = t(d)
    f0 = 260 + 140 * np.sin(2 * np.pi * 1.3 * tt) + 90 * np.sin(2 * np.pi * 3.7 * tt + 1) - 80 * tt
    f0 = f0 * np.exp(lp(rng.standard_normal(len(tt)), 30) * 2.5)  # jitter stick-slip (tidak bernada rata)
    pulses = np.zeros(len(tt)); ph = np.cumsum(np.maximum(f0, 60) / SR)
    pulses[np.where(np.diff(np.floor(ph)) > 0)[0]] = 1.0
    pulses *= 0.6 + 0.4 * rng.random(len(pulses))
    cr = bp(pulses, 350, 3000, 2) * 3 * (0.6 + 0.4 * np.abs(lp(rng.standard_normal(len(tt)), 12)) * 3).clip(0, 1.4)
    cr = add(cr, bp(N(d), 900, 2400) * 0.04)
    place(y, ar(cr, 0.06, 0.15) * 0.8, 0.0)
    place(y, add(env(bp(N(0.2), 140, 420, 3), 0.0005, 0.05), env(lp(N(0.1), 300), 0.0005, 0.03) * 0.5) * 0.7, 0.62)
    return reverb(y, 0.15, 0.3)

def padlock_drop():  # gembok kuningan jatuh: clunk berat + ring logam rendah + 1 pantulan
    y = silence(0.9)
    def hit(a):
        m = sum(b * env(tone(f, 0.4), 0.0003, 0.08 / (1 + i * .5)) for i, (f, b) in enumerate([(780, .5), (1240, .35), (2110, .2), (3350, .1)]))
        return add(env(lp(N(0.08), 700), 0.0005, 0.02) * 1.0, m * 0.6) * a
    place(y, hit(1.0), 0); place(y, hit(0.35), 0.16); place(y, hit(0.12), 0.27)
    return reverb(y, 0.12, 0.25)

if __name__ == '__main__':
    meter = pyln.Meter(SR, block_size=0.1)
    for fn in (chain_rattle, chain_snap, chain_drop, chest_hinge, padlock_drop):
        x = fn().astype(np.float64)
        fd = int(SR * 0.01); x[-fd:] *= np.linspace(1, 0, fd)
        xx = np.concatenate([x, np.zeros(SR // 2)]) if len(x) < SR // 2 else x
        x *= 10 ** ((-20 - meter.integrated_loudness(xx)) / 20)
        pk = np.abs(x).max()
        if pk > 0.95: x *= 0.95 / pk
        wavfile.write(os.path.join(OUT, fn.__name__ + '.wav'), SR, (x * 32767).astype(np.int16))
        print(fn.__name__, round(len(x) / SR, 2), 's')
