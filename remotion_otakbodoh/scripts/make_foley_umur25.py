"""Foley sintesis tambahan video umur25 (20 bunyi, user pilih opsi 2). Natural: noise berlapis + envelope, granular,
resonansi benda (kayu/logam/kertas/air/mesin), tanpa beep/laser/zap. Dinormalisasi -20 LUFS (level akhir diatur mixer)."""
import os, sys
import numpy as np
from scipy.io import wavfile
import pyloudnorm as pyln
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_sfx import SR, t, N, env, ar, bp, lp, hp, tone, saw, glide, pink, brown, place, silence, reverb, add
from make_foley import grains, knock, thump, metal, click, breath

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'sfx')
rng = np.random.default_rng(525)
S = {}
def sfx(fn): S[fn.__name__] = fn; return fn

@sfx
def party_popper():   # tali ditarik -> "pop" kertas + hujan confetti kertas
    y = silence(1.4)
    place(y, env(bp(N(0.06), 800, 3000), 0.003, 0.02) * 0.4, 0)
    place(y, add(env(lp(N(0.08), 1800), 0.0005, 0.03) * 1.3, env(hp(N(0.03), 2500), 0.0002, 0.006)), 0.06)
    place(y, grains(1.1, 160, 2500, 9000, (0.001, 0.004), (0.03, 0.18)), 0.1)
    return reverb(y, 0.15, 0.3)

@sfx
def candle_blow():    # tiupan "fuh" ke lilin: napas bandpass + desis api padam
    y = silence(0.9)
    x = bp(pink(0.5), 300, 2500) * ar(np.ones(int(SR * 0.5)), 0.04, 0.25)
    place(y, x * 0.9, 0)
    place(y, env(hp(N(0.12), 2500), 0.005, 0.03) * 0.06, 0.3)
    return y

@sfx
def fuse_hiss():      # sumbu terbakar: desis tinggi berkerlip + letupan percik kecil
    d = 1.3; y = silence(d)
    x = hp(N(d), 3000) * (0.5 + 0.5 * np.abs(lp(N(d), 30)) * 4).clip(0, 1.2)
    place(y, ar(x, 0.05, 0.2) * 0.5, 0)
    place(y, grains(d, 50, 3000, 9000, (0.001, 0.003), (0.1, 0.4)), 0)
    return y

@sfx
def chair_scrape():   # kaki kursi kayu bergeser di lantai: gesek stick-slip pendek
    d = 0.55; y = silence(0.8); tt = t(d)
    f0 = 140 + 60 * np.sin(2 * np.pi * 3 * tt)
    f0 *= np.exp(lp(rng.standard_normal(len(tt)), 25) * 1.5)
    ph = np.cumsum(np.maximum(f0, 40) / SR); pul = np.zeros(len(tt)); pul[np.where(np.diff(np.floor(ph)) > 0)[0]] = 1
    x = bp(pul * (0.5 + 0.5 * rng.random(len(pul))), 200, 2400) * 3 + bp(N(d), 400, 3000) * 0.08
    place(y, ar(x, 0.03, 0.12) * 0.8, 0)
    place(y, knock(160, 0.03) * 0.4, d - 0.02)
    return reverb(y, 0.12, 0.25)

@sfx
def paper_tear():     # kertas disobek: robekan berbutir naik-turun + kibasan
    d = 0.55; y = silence(0.8)
    s = 0.0
    while s < d:
        place(y, env(bp(N(0.015), 1500, 7000), 0.0003, rng.uniform(0.002, 0.006)) * rng.uniform(0.3, 0.9), s)
        s += rng.uniform(0.004, 0.012)
    place(y, env(bp(N(0.1), 300, 1500), 0.005, 0.04) * 0.3, d)
    return y

@sfx
def spoon_clink():    # sendok logam berdenting di piring
    y = silence(0.8)
    place(y, metal([(3150, .4), (4720, .25), (7100, .1)], 0.12, 0.5) * 0.8, 0)
    place(y, metal([(3150, .2), (4720, .1)], 0.06, 0.3) * 0.35, 0.09)
    return reverb(y, 0.12, 0.3)

@sfx
def munch():          # kunyah lucu: 3 gigitan renyah lembut (bukan vokal)
    y = silence(0.9)
    for k, s in enumerate((0.0, 0.25, 0.5)):
        place(y, add(env(bp(N(0.08), 400, 2500), 0.004, 0.03) * 0.7, grains(0.08, 25, 2000, 7000, (0.001, 0.003), (0.1, 0.4))), s)
        place(y, thump(0.1, 110, 0.03) * 0.3, s + 0.01)
    return y

@sfx
def cartoon_blast():  # "poof" ledakan kartun teredam: dentum lembut + kepulan debu
    y = silence(1.6)
    place(y, thump(0.8, 70, 0.18) * 1.2, 0)
    place(y, ar(lp(N(1.0), 900), 0.02, 0.8) * 0.6, 0)
    place(y, grains(1.0, 80, 800, 4000, (0.002, 0.01), (0.05, 0.25)), 0.08)
    return reverb(y, 0.2, 0.5)

@sfx
def shield_clang():   # perisai logam berdentang
    y = silence(1.4)
    place(y, metal([(620, .5), (1010, .4), (1570, .3), (2480, .15)], 0.45, 1.2) * 0.8, 0)
    place(y, env(hp(N(0.03), 1500), 0.0002, 0.006) * 0.6, 0)
    return reverb(y, 0.2, 0.5)

@sfx
def ink_spread():     # tinta basah merembes: gelembung kecil + aliran kental lembut
    d = 1.6; y = silence(d)
    place(y, ar(lp(N(d), 600) * 0.4, 0.2, 0.5), 0)
    for _ in range(30):
        s = rng.uniform(0, d - 0.05); f = rng.uniform(300, 900)
        place(y, env(tone(glide(f, f * 1.6, 0.03), 0.03), 0.002, 0.012) * rng.uniform(0.05, 0.2), s)
    return y

@sfx
def car_pass():       # mobil lewat: deru ban + mesin dengan efek doppler naik-turun
    d = 1.6; tt = t(d)
    amp = np.exp(-((tt - 0.75) / 0.35) ** 2)
    eng = saw(glide(110, 80, d), d) * 0.3
    x = (lp(eng, 400) + bp(N(d), 300, 2500) * 0.6) * amp
    return x

@sfx
def heels_steps():    # langkah heels di trotoar: ketuk keras tinggi berirama
    y = silence(1.3)
    for k in range(4):
        s = k * 0.3
        place(y, add(knock(1700, 0.012, nd=0.004) * 0.8, env(bp(N(0.02), 2500, 6000), 0.0003, 0.004) * 0.6), s)
        place(y, knock(500, 0.02) * 0.25, s + 0.05)
    return reverb(y, 0.15, 0.35)

@sfx
def bus_pass():       # bus lewat: mesin diesel berat + angin
    d = 1.8; tt = t(d)
    amp = np.exp(-((tt - 0.9) / 0.45) ** 2)
    eng = saw(glide(55, 48, d), d) * (1 + 0.3 * np.sin(2 * np.pi * 9 * tt))
    return (lp(eng, 300) * 0.8 + bp(N(d), 200, 1500) * 0.5) * amp

@sfx
def paper_crumple():  # kertas diremas: kresek berbutir rapat
    d = 0.7; y = silence(0.9)
    place(y, grains(d, 220, 1200, 8000, (0.001, 0.005), (0.1, 0.6)), 0)
    place(y, ar(bp(N(d), 800, 4000), 0.05, 0.2) * 0.15, 0)
    return y

@sfx
def knock_tap():      # ketukan kayu dua kali
    y = silence(0.6)
    place(y, knock(420, 0.04) * 0.9, 0); place(y, knock(440, 0.035) * 0.8, 0.16)
    return reverb(y, 0.12, 0.25)

@sfx
def seesaw_creak():   # papan kayu jungkat-jungkit berderit pelan (stick-slip rendah)
    d = 1.2; y = silence(1.4); tt = t(d)
    f0 = 90 + 50 * np.sin(2 * np.pi * 0.8 * tt)
    f0 *= np.exp(lp(rng.standard_normal(len(tt)), 15) * 1.6)
    ph = np.cumsum(np.maximum(f0, 30) / SR); pul = np.zeros(len(tt)); pul[np.where(np.diff(np.floor(ph)) > 0)[0]] = 1
    place(y, ar(bp(pul * (0.5 + 0.5 * rng.random(len(pul))), 150, 1600) * 3, 0.15, 0.3) * 0.8, 0)
    return reverb(y, 0.18, 0.35)

@sfx
def glass_fog():      # napas "hah" di kaca dingin + embun (desis halus)
    y = silence(1.4)
    place(y, breath(0.7, 400, 2500, 'exhale') * 0.9, 0)
    place(y, ar(hp(N(0.8), 5000), 0.2, 0.4) * 0.05, 0.3)
    return reverb(y, 0.15, 0.3)

@sfx
def water_rush():     # arus air deras: noise lowpass bergelombang + gemericik
    d = 1.8; tt = t(d)
    x = lp(N(d), 1500) * (0.7 + 0.3 * np.sin(2 * np.pi * 1.3 * tt)) + bp(N(d), 1500, 5000) * 0.25
    y = ar(x, 0.15, 0.3)
    y = y + grains(d, 140, 1500, 6000, (0.001, 0.004), (0.05, 0.2))[:len(y)]
    return y

@sfx
def bus_brake():      # rem bus mendadak: decit karet + desis udara rem
    y = silence(1.6)
    sq = bp(saw(glide(900, 700, 0.6), 0.6), 700, 2500) * ar(np.ones(int(SR * 0.6)), 0.03, 0.2)
    place(y, sq * 0.25, 0)
    place(y, ar(hp(N(0.8), 1500), 0.02, 0.6) * 0.5, 0.45)
    place(y, thump(0.3, 70, 0.08) * 0.4, 0.5)
    return reverb(y, 0.15, 0.4)

@sfx
def room_tone():      # dengung ruangan pelan (AC/kafe sepi) — rendah, lembut
    d = 2.6; tt = t(d)
    x = lp(brown(d), 250) * 0.8 + tone(100, d) * 0.03 + bp(pink(d), 300, 1200) * 0.15
    return ar(x, 0.4, 0.6)

if __name__ == '__main__':
    meter = pyln.Meter(SR, block_size=0.1)
    for name, fn in S.items():
        x = np.asarray(fn(), dtype=np.float64)
        fd = int(SR * 0.01); x[-fd:] *= np.linspace(1, 0, fd)
        xx = np.concatenate([x, np.zeros(SR // 2)]) if len(x) < SR // 2 else x
        x *= 10 ** ((-20 - meter.integrated_loudness(xx)) / 20)
        pk = np.abs(x).max()
        if pk > 0.95: x *= 0.95 / pk
        wavfile.write(os.path.join(OUT, name + '.wav'), SR, (x * 32767).astype(np.int16))
        print(name, round(len(x) / SR, 2), 's')
