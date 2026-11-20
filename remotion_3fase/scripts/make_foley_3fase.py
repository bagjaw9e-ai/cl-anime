"""Foley sintesis tambahan video 3 fase (22 bunyi, user pilih opsi 2). Natural: noise berlapis + envelope, granular,
resonansi benda (kayu/logam/kaca/keramik), tanpa beep/laser/zap. Semua dinormalisasi -20 LUFS (level akhir diatur mixer)."""
import os, sys
import numpy as np
from scipy.io import wavfile
import pyloudnorm as pyln
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_sfx import SR, t, N, env, ar, bp, lp, hp, tone, saw, glide, pink, brown, place, silence, reverb, add
from make_foley import grains, knock, thump, metal, click, breath, stroke_env

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'sfx')
rng = np.random.default_rng(303)
S = {}
def sfx(fn): S[fn.__name__] = fn; return fn

def shard(f0, dec=0.12, d=0.4):   # pecahan kaca/keramik: partial tinggi inharmonik
    fs = [(f0, .5), (f0 * 1.63, .35), (f0 * 2.41, .22), (f0 * 3.9, .12)]
    return add(metal(fs, dec, d), env(hp(N(0.02), 3000), 0.0002, 0.004) * 0.5)

@sfx
def tissue_pull():   # tisu ditarik: desis kertas tipis naik lalu "sret"
    d = 0.6; y = silence(d)
    x = bp(N(0.45), 2500, 9000) * stroke_env(0.45, 40, 0.5)
    place(y, ar(x, 0.05, 0.15) * 0.6, 0.0)
    place(y, env(hp(N(0.08), 3000), 0.002, 0.03) * 0.8, 0.4)
    return y

@sfx
def crack_creep():   # retakan merayap: butiran derak kecil makin rapat
    d = 1.2; y = silence(d)
    s = 0.0; iv = 0.08
    while s < 1.0:
        place(y, env(bp(N(0.03), 1500, 7000), 0.0003, rng.uniform(0.003, 0.01)) * rng.uniform(0.2, 0.7), s)
        s += iv * rng.uniform(0.5, 1.5); iv = max(0.012, iv * 0.92)
    place(y, env(lp(N(1.0), 300), 0.3, 0.4) * 0.15, 0.1)
    return reverb(y, 0.1, 0.2)

@sfx
def rusty_clank():   # logam berkarat berdentang tumpul: resonansi rendah redam cepat + gesek karat
    y = silence(1.0)
    place(y, metal([(310, .5), (497, .35), (811, .2), (1290, .1)], 0.09, 0.6) * 0.9, 0)
    place(y, env(lp(N(0.15), 900), 0.001, 0.04) * 0.9, 0)
    place(y, grains(0.35, 60, 800, 3000, (0.002, 0.006), (0.05, 0.25)), 0.05)
    return reverb(y, 0.15, 0.3)

@sfx
def cup_tray():      # cangkir keramik diletakkan di nampan kayu
    y = silence(0.8)
    place(y, knock(220, 0.04) * 0.7, 0)
    place(y, metal([(2350, .35), (3820, .2), (5600, .08)], 0.12, 0.5) * 0.5, 0.002)
    place(y, knock(260, 0.03) * 0.3, 0.07)
    place(y, metal([(2350, .2), (3820, .1)], 0.08, 0.3) * 0.25, 0.072)
    return reverb(y, 0.12, 0.3)

@sfx
def scale_clank():   # timbangan kuningan berdentang + miring (berderit pendek)
    y = silence(1.3)
    place(y, metal([(880, .5), (1356, .35), (2210, .2), (3480, .1)], 0.35, 1.0) * 0.7, 0)
    place(y, env(hp(N(0.03), 2000), 0.0002, 0.005) * 0.6, 0)
    cr = bp(saw(glide(260, 200, 0.4), 0.4), 400, 2200) * ar(np.ones(int(SR * 0.4)), 0.05, 0.1) * 0.15
    place(y, cr, 0.12)
    return reverb(y, 0.18, 0.4)

@sfx
def water_pour():    # air dituang ke gelas: aliran berbuih + nada rongga naik saat gelas terisi
    d = 1.8; y = silence(d + 0.3)
    flow = bp(N(d), 400, 4000) * (0.6 + 0.4 * np.abs(lp(N(d), 8)) * 3).clip(0, 1.4)
    cav = np.zeros(int(SR * d))
    for k in range(6):
        f0 = 600 + k * 160
        seg = bp(N(d / 6), f0 * 0.95, f0 * 1.05, 2) * 4
        cav[int(k * SR * d / 6): int(k * SR * d / 6) + len(seg)] += seg[:len(cav) - int(k * SR * d / 6)]
    place(y, ar(flow * 0.5 + cav * 0.25, 0.05, 0.25), 0)
    place(y, grains(d, 120, 2000, 8000, (0.001, 0.004), (0.05, 0.2)), 0)
    return y

@sfx
def siren_soft():    # sirene jauh pelan: dua nada naik-turun lembut, teredam & bergaung (bukan laser)
    d = 3.0; tt = t(d)
    f = 680 + 170 * np.sin(2 * np.pi * 0.55 * tt)
    x = tone(f, d) * 0.6 + tone(f * 2, d) * 0.15 + tone(f * 3, d) * 0.05
    x = lp(x, 1800) * ar(np.ones(len(tt)), 0.4, 0.8) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.3 * tt))
    return reverb(x * 0.6, 0.35, 0.8)

@sfx
def wood_gnaw():     # kayu digerogoti: klik-klik kayu kecil berirama tak teratur + serpih
    d = 2.0; y = silence(d)
    s = 0.0
    while s < d - 0.05:
        place(y, knock(rng.uniform(900, 1600), rng.uniform(0.006, 0.015), nd=0.004) * rng.uniform(0.2, 0.6), s)
        s += rng.uniform(0.03, 0.09) * (1.6 if rng.random() < 0.15 else 1)
    place(y, grains(d, 90, 2000, 6000, (0.001, 0.004), (0.03, 0.15)), 0)
    return y

@sfx
def match_strike():  # korek api digesek: gesekan kasar -> "fwoosh" nyala -> desis api kecil
    y = silence(1.4)
    place(y, ar(bp(N(0.12), 1500, 7000), 0.005, 0.04) * 0.9, 0)
    place(y, env(hp(N(0.06), 1000), 0.002, 0.03) * 0.6, 0.1)
    fw = lp(N(0.5), 1400) * ar(np.ones(int(SR * 0.5)), 0.03, 0.4)
    place(y, fw * 0.7, 0.12)
    place(y, grains(1.0, 40, 1500, 6000, (0.001, 0.004), (0.05, 0.2)), 0.3)
    return y

@sfx
def desk_slam():     # telapak menggebrak meja kayu: dentum rendah + ketuk kayu + benda kecil bergetar
    y = silence(1.0)
    place(y, thump(0.4, 90, 0.08) * 1.2, 0)
    place(y, knock(150, 0.07) * 1.0, 0)
    place(y, env(bp(N(0.05), 600, 3000), 0.0005, 0.012) * 0.7, 0)  # tepukan telapak
    for k, s in enumerate((0.06, 0.1, 0.15)): place(y, metal([(2100 + k * 400, .2), (3300 + k * 300, .1)], 0.05, 0.15) * 0.25, s)
    return reverb(y, 0.15, 0.35)

@sfx
def dice_roll():     # 2 dadu bergulir di meja: ketukan plastik keras makin rapat lalu berhenti
    y = silence(1.0); s = 0.0; iv = 0.13
    for k in range(14):
        for dd in (0, rng.uniform(0.01, 0.03)):
            place(y, add(knock(rng.uniform(1800, 2600), 0.012, nd=0.004), click(0.002, 3000, 9000, 0.4)) * (0.7 - k * 0.04), s + dd)
        s += iv; iv *= 0.82
        if s > 0.9: break
    return reverb(y, 0.1, 0.2)

@sfx
def compass_spin():  # jarum kompas berputar: tik-tik logam halus cepat lalu melambat
    y = silence(1.3); s = 0.0; iv = 0.025
    while s < 1.2:
        place(y, metal([(4200, .3), (6300, .15)], 0.01, 0.03) * 0.5, s)
        s += iv; iv *= 1.04
    place(y, env(lp(N(1.2), 400), 0.1, 0.5) * 0.1, 0)
    return y

@sfx
def fire_crackle():  # api berkobar pelan: gemuruh rendah + letupan kertas/kayu acak
    d = 3.0; y = silence(d)
    place(y, ar(lp(brown(d), 300), 0.4, 0.6) * 0.9, 0)
    place(y, ar(bp(N(d), 300, 1500) * 0.25, 0.4, 0.6), 0)
    for _ in range(70):
        s = rng.uniform(0, d - 0.05)
        place(y, env(bp(N(0.02), 1000, 6000), 0.0002, rng.uniform(0.002, 0.008)) * rng.uniform(0.2, 0.9), s)
    return y

@sfx
def thread_snap():   # benang putus: tegang bergetar singkat -> "tik" tipis + sedikit ayun
    y = silence(0.6)
    place(y, tone(glide(900, 1400, 0.08), 0.08) * ar(np.ones(int(SR * 0.08)), 0.02, 0.01) * 0.08, 0)
    place(y, env(hp(N(0.02), 3000), 0.0001, 0.004) * 1.0, 0.08)
    place(y, env(bp(N(0.2), 200, 1200), 0.01, 0.06) * 0.15, 0.09)
    return y

@sfx
def remote_click():  # tombol remote plastik: klik kecil dua lapis (tekan-lepas)
    y = silence(0.3)
    place(y, add(knock(2300, 0.008, nd=0.003), click(0.002, 2500, 8000, 0.5)) * 0.9, 0)
    place(y, add(knock(2700, 0.006, nd=0.002), click(0.002, 3000, 9000, 0.3)) * 0.5, 0.07)
    return y

@sfx
def swipe_fast():    # jempol swipe layar cepat berulang: gesek kulit-kaca pendek
    y = silence(1.6)
    for k in range(5):
        x = bp(N(0.12), 1500, 6000) * ar(np.ones(int(SR * 0.12)), 0.03, 0.06)
        place(y, x * (0.8 - k * 0.08), k * 0.3)
    return y

@sfx
def muffled_shout(): # bentakan teredam di balik dinding: vokal tanpa kata, formant + lowpass kuat
    d = 1.0; y = silence(d + 0.4); tt = t(d)
    f0 = 160 + 90 * np.exp(-((tt - 0.25) / 0.12) ** 2) + 55 * np.exp(-((tt - 0.65) / 0.1) ** 2) + 6 * np.sin(2 * np.pi * 7 * tt)
    src = saw(f0, d)
    vow = bp(src, 500, 900) * 1.0 + bp(src, 1100, 1500) * 0.5
    syl = np.clip(np.exp(-((tt - 0.25) / 0.14) ** 2) + 0.8 * np.exp(-((tt - 0.65) / 0.12) ** 2), 0, 1)
    br = bp(N(d), 600, 2000) * syl * 0.15                      # napas/serak
    x = lp(vow * syl + br, 1100, 2)
    place(y, x * 1.2, 0)
    return reverb(y, 0.3, 0.4)

@sfx
def door_creak():    # pintu kayu berderit pelan: stick-slip tak beraturan + klik engsel
    d = 1.3; y = silence(d + 0.3); tt = t(d)
    f0 = 180 + 90 * np.sin(2 * np.pi * 0.7 * tt) + 40 * np.sin(2 * np.pi * 2.1 * tt + 1)
    f0 = f0 * np.exp(lp(rng.standard_normal(len(tt)), 20) * 2.0)
    ph = np.cumsum(np.maximum(f0, 50) / SR); pul = np.zeros(len(tt)); pul[np.where(np.diff(np.floor(ph)) > 0)[0]] = 1
    pul *= 0.6 + 0.4 * rng.random(len(pul))
    place(y, ar(bp(pul, 300, 2500) * 3, 0.15, 0.3) * 0.7, 0)
    place(y, click(0.004, 1500, 5000, 0.4), 0)
    return reverb(y, 0.2, 0.4)

@sfx
def frame_fall():    # bingkai foto jatuh: gesek paku dinding -> dentum kayu di lantai
    y = silence(1.0)
    place(y, env(bp(N(0.1), 1500, 5000), 0.002, 0.03) * 0.4, 0)
    place(y, thump(0.3, 140, 0.06) * 0.8, 0.32)
    place(y, knock(240, 0.05) * 0.9, 0.32)
    place(y, knock(300, 0.03) * 0.3, 0.42)
    return reverb(y, 0.15, 0.3)

@sfx
def glass_shatter(): # kaca bingkai pecah di lantai: benturan + hamburan pecahan berdenting
    y = silence(1.4)
    place(y, env(hp(N(0.06), 1500), 0.0002, 0.02) * 1.2, 0)
    place(y, shard(2900, 0.2, 0.5) * 0.8, 0)
    for _ in range(26):
        s = rng.uniform(0.02, 0.7) ** 1.4
        place(y, shard(rng.uniform(2500, 6500), rng.uniform(0.02, 0.08), 0.15) * rng.uniform(0.1, 0.45), s)
    return reverb(y, 0.18, 0.4)

@sfx
def plate_break():   # piring keramik pecah: "klonk" keramik lebih rendah + pecahan
    y = silence(1.3)
    place(y, thump(0.2, 200, 0.03) * 0.6, 0)
    place(y, metal([(1450, .5), (2380, .35), (3600, .18)], 0.08, 0.3) * 0.9, 0)
    place(y, env(hp(N(0.05), 1200), 0.0002, 0.015) * 0.9, 0)
    for _ in range(16):
        s = rng.uniform(0.03, 0.6) ** 1.3
        place(y, shard(rng.uniform(1800, 4500), rng.uniform(0.02, 0.06), 0.12) * rng.uniform(0.1, 0.4), s)
    return reverb(y, 0.15, 0.35)

@sfx
def stone_grind():   # batu mengeras: gesek batu berat pelan + retak kecil
    d = 1.6; y = silence(d + 0.3)
    g = lp(brown(d), 500) * (0.6 + 0.4 * np.abs(lp(N(d), 6)) * 3).clip(0, 1.5)
    place(y, ar(g, 0.2, 0.4) * 0.9, 0)
    place(y, grains(d, 50, 600, 3000, (0.002, 0.01), (0.05, 0.3)), 0)
    place(y, knock(110, 0.08) * 0.6, d - 0.25)
    return reverb(y, 0.15, 0.4)

if __name__ == '__main__':
    meter = pyln.Meter(SR, block_size=0.1)
    for name, fn in S.items():
        x = fn().astype(np.float64)
        fd = int(SR * 0.01); x[-fd:] *= np.linspace(1, 0, fd)
        xx = np.concatenate([x, np.zeros(SR // 2)]) if len(x) < SR // 2 else x
        x *= 10 ** ((-20 - meter.integrated_loudness(xx)) / 20)
        pk = np.abs(x).max()
        if pk > 0.95: x *= 0.95 / pk
        wavfile.write(os.path.join(OUT, name + '.wav'), SR, (x * 32767).astype(np.int16))
        print(name, round(len(x) / SR, 2), 's')
