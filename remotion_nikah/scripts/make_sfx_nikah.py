"""17 SFX foley BARU video "nikah dengan pecandu" (bunyi yang belum ada di library, lihat preview/sfx_missing.txt).
Foley natural: modal synthesis (kayu/logam/kaca), noise berfilter + envelope, granular, stick-slip (derit), formant (gumam).
TANPA laser/zap/sci-fi. Output public/sfx/<nama>.wav (48 kHz mono, -20 LUFS; level akhir diatur mixer)."""
import os, sys
import numpy as np
from scipy.io import wavfile
import pyloudnorm as pyln
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_sfx_ob import SR, T, wn, Z, LP, HP, BP, pinkn, brownn, dec, adsr, put, modal, osc, lin, expo, verb, grains, creak, breath, formant_hum, A

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'sfx')
R = np.random.default_rng(5050)
S = {}
def sfx(fn): S[fn.__name__] = fn; return fn
def knock(f, d=0.12, tau=0.02, a=1.0): return modal([(f, a, tau), (f * 2.6, a * 0.35, tau * 0.6), (f * 4.1, a * 0.15, tau * 0.4)], d)
def thud(d=0.3, f=90, tau=0.08): return LP(wn(d), f * 3) * dec(int(SR * d), tau) + osc(expo(f, f * 0.7, d), d) * dec(int(SR * d), tau * 1.2) * 0.6

@sfx
def ink_bottle_fall():    # botol kaca kecil terguling (gulir di kayu) lalu jatuh "tok" + denting kaca kecil
    y = Z(1.0)
    put(y, BP(wn(0.28), 400, 2500) * (0.5 + 0.5 * np.sin(2 * np.pi * 14 * T(0.28))) * adsr(int(SR * 0.28), 0.03, 0.08) * 0.35, 0)
    put(y, A(thud(0.18, 160, 0.03), knock(520, 0.2, 0.03, 0.6)), 0.27)
    put(y, modal([(3150, 0.6, 0.12), (5200, 0.3, 0.07), (7100, 0.15, 0.04)], 0.4), 0.29, 0.5)
    put(y, modal([(3150, 0.3, 0.08), (5200, 0.15, 0.05)], 0.3), 0.41, 0.35)
    return verb(y, 0.12, 0.3)

@sfx
def wood_plank_crack():   # kayu kering patah: retakan serat berbutir lalu "krak" + serpih jatuh
    y = Z(0.9)
    put(y, grains(0.16, 900, 800, 5000, (0.0005, 0.002), (0.1, 0.5)) * lin(0.3, 1, 0.16), 0)
    put(y, A(BP(wn(0.08), 600, 4500) * dec(int(SR * 0.08), 0.015) * 1.4, knock(340, 0.25, 0.03, 0.9), knock(780, 0.2, 0.02, 0.5)), 0.15)
    put(y, grains(0.35, 120, 1500, 6000, (0.001, 0.004), (0.05, 0.25)) * lin(1, 0, 0.35), 0.22)
    return verb(y, 0.1, 0.35)

@sfx
def rubber_squeak():      # sarung tangan karet tebal digenggam: decit karet stick-slip naik-turun, kenyal
    d = 0.7; t = T(d)
    f = 700 + 260 * np.sin(2 * np.pi * 2.2 * t) + 120 * np.sin(2 * np.pi * 7 * t)
    x = osc(f, d, 'saw') * 0.4 + osc(f * 2, d) * 0.15
    gate = (np.sin(2 * np.pi * 9 * t) > -0.2).astype(float)
    y = BP(x * LP(gate, 60), 500, 3200) * adsr(len(t), 0.03, 0.15)
    return A(y, LP(wn(d), 900) * 0.12 * adsr(len(t), 0.02, 0.2))

@sfx
def muffled_talk():       # gumam bicara teredam tanpa kata (formant berubah-ubah, low-pass kuat seperti dari balik earphone)
    d = 1.4; y = Z(d); s = 0.0
    while s < d - 0.2:
        L = R.uniform(0.12, 0.26); f0 = R.uniform(190, 250)
        fm = ((R.uniform(350, 750), 1.0), (R.uniform(1000, 1700), 0.4), (2400, 0.1))
        put(y, formant_hum(L, f0, fm), s, R.uniform(0.6, 1)); s += L + R.uniform(0.03, 0.09)
    return LP(y, 900, 4) * adsr(len(y), 0.05, 0.2)

@sfx
def fridge_door():        # pintu kulkas: tarikan seal karet (hisap) -> dengung kompresor sesaat -> tutup empuk + botol berdenting
    y = Z(1.4)
    put(y, BP(wn(0.12), 200, 1400) * adsr(int(SR * 0.12), 0.01, 0.08) * 0.6 + LP(wn(0.12), 300) * 0.3 * dec(int(SR * 0.12), 0.04), 0)
    put(y, (osc(100, 0.7) * 0.15 + osc(200, 0.7) * 0.06) * adsr(int(SR * 0.7), 0.1, 0.2), 0.12)
    put(y, A(thud(0.3, 110, 0.05), BP(wn(0.1), 300, 1200) * dec(int(SR * 0.1), 0.02) * 0.5), 0.85)
    for i, f in enumerate((2400, 2900)): put(y, modal([(f, 0.3, 0.06)], 0.2), 0.9 + i * 0.06)
    return verb(y, 0.12, 0.4)

@sfx
def cashier_beep():       # scan kasir lembut: bip bulat pendek (sinus lembut, onset halus) + desir sensor kertas
    d = 0.32; t = T(d)
    b = (osc(2093, d) * 0.6 + osc(4186, d) * 0.08) * np.minimum(1, t / 0.008) * np.where(t < 0.16, 1, np.exp(-(t - 0.16) / 0.03))
    return A(b, BP(wn(0.08), 2000, 6000) * 0.05 * adsr(int(SR * 0.08), 0.02, 0.04))

@sfx
def kettle_whistle():     # ketel bersiul: uap berdesis + siulan tabung (nada naik, napas tak rata)
    d = 1.6; t = T(d)
    f = 1200 + 900 * np.minimum(1, t / 0.9) + 25 * np.sin(2 * np.pi * 6 * t)
    whistle = osc(f, d) * (0.4 + 0.25 * np.sin(2 * np.pi * 3.1 * t) ** 2) * np.minimum(1, t / 0.4) ** 2
    steam = BP(wn(d), 2500, 9000) * 0.25 * np.minimum(1, t / 0.2)
    return (whistle + BP(whistle * (1 + 0.3 * wn(d)), 1500, 4000) * 0.2 + steam) * adsr(len(t), 0.05, 0.12)

@sfx
def kettle_lid_pop():     # tutup ketel meletup: hembusan uap kuat + "plok" logam terangkat lalu jatuh berdenting
    y = Z(1.1)
    put(y, BP(wn(0.35), 1500, 8000) * dec(int(SR * 0.35), 0.12) * 0.6, 0)
    put(y, modal([(1180, 1, 0.12), (2650, 0.5, 0.08), (4300, 0.25, 0.05)], 0.4), 0.02)
    put(y, modal([(1180, 0.6, 0.15), (2650, 0.3, 0.09)], 0.5), 0.38)
    put(y, modal([(1220, 0.35, 0.1), (2700, 0.18, 0.06)], 0.4), 0.52)
    return verb(y, 0.15, 0.5)

@sfx
def pebble_glass_hit():   # kerikil kena kaca jendela: "tik" kaca keras + getar kaca pendek
    y = Z(0.6)
    put(y, A(HP(wn(0.004), 2000) * dec(int(SR * 0.004), 0.001) * 1.5, modal([(2400, 0.7, 0.05), (3900, 0.5, 0.035), (6100, 0.3, 0.02), (850, 0.25, 0.08)], 0.35)), 0)
    put(y, knock(1400, 0.08, 0.01, 0.3), 0.18)
    return verb(y, 0.1, 0.3)

@sfx
def garage_roller():      # pintu garasi gulung naik: derak bilah logam berirama + gemuruh poros + per
    d = 1.9; t = T(d); y = LP(brownn(d), 160) * 0.5 * adsr(len(t), 0.15, 0.3)
    s = 0.05
    while s < d - 0.2:
        put(y, modal([(R.uniform(420, 520), 0.5, 0.03), (R.uniform(1300, 1600), 0.25, 0.015)], 0.08), s, 0.7); s += R.uniform(0.07, 0.11)
    y += BP(wn(d), 1500, 5000) * 0.06 * (0.5 + 0.5 * np.sin(2 * np.pi * 9 * t) ** 2) * adsr(len(t), 0.1, 0.3)
    put(y, A(thud(0.25, 90, 0.05), knock(300, 0.2, 0.04, 0.5)), d - 0.25)
    return verb(y, 0.2, 0.6)

@sfx
def metal_drawer():       # laci arsip besi ditarik: bantalan rel menggelinding (gemerincing) + benturan stop logam
    d = 0.9; t = T(d)
    roll = BP(wn(d), 1800, 6500) * (0.35 + 0.3 * np.sin(2 * np.pi * 23 * t) ** 2) * np.where(t < 0.6, 1, 0) * adsr(len(t), 0.04, 0.1)
    y = A(roll, LP(wn(d), 300) * 0.25 * np.where(t < 0.6, 1, 0))
    put(y, modal([(620, 1, 0.08), (1480, 0.6, 0.05), (2950, 0.35, 0.03)], 0.3), 0.6)
    return verb(y, 0.15, 0.4)

@sfx
def washer_spin():        # mesin cuci: drum berputar (dengung motor naik) + air berkecipak berirama
    d = 1.8; t = T(d)
    motor = (osc(expo(40, 75, d), d) * 0.3 + osc(expo(80, 150, d), d) * 0.12) * adsr(len(t), 0.2, 0.3)
    slosh = BP(wn(d), 300, 2200) * (0.25 + 0.25 * np.sin(2 * np.pi * expo(1.2, 3.5, d).cumsum() / SR) ** 4) * adsr(len(t), 0.1, 0.3)
    y = A(motor, slosh)
    for i in range(6): put(y, grains(0.15, 300, 600, 4000, (0.001, 0.004), (0.05, 0.3)), 0.1 + i * 0.27, 0.5)
    return y

@sfx
def needle_sew():         # menjahit: jarum menembus kain (tusuk berserat) + benang ditarik (desis gesek) x3
    y = Z(1.5)
    for i in range(3):
        s = 0.05 + i * 0.45
        put(y, A(BP(wn(0.03), 2000, 7000) * dec(int(SR * 0.03), 0.008) * 0.8, grains(0.04, 600, 3000, 8000, (0.0005, 0.002), (0.1, 0.4))), s)
        put(y, BP(wn(0.28), 1500, 6000) * np.sin(np.pi * T(0.28) / 0.28) ** 2 * 0.35 * lin(0.6, 1.2, 0.28), s + 0.08)
    return verb(y, 0.1, 0.3)

@sfx
def floor_creak():        # lantai kayu rumah berderit diinjak (stick-slip rendah) + ketuk papan
    y = Z(1.0)
    put(y, creak(0.55, 140, 90, 1.4, 120, 1600) * adsr(int(SR * 0.55), 0.05, 0.15) * 0.8, 0.05)
    put(y, knock(210, 0.2, 0.04, 0.5), 0.02)
    put(y, creak(0.25, 180, 150, 1.0, 150, 1800) * adsr(int(SR * 0.25), 0.03, 0.1) * 0.4, 0.62)
    return verb(y, 0.2, 0.5)

@sfx
def brick_place():        # bata disusun: gesek semen (pasir basah) lalu "klak" bata berat
    y = Z(0.7)
    put(y, BP(wn(0.18), 300, 2500) * adsr(int(SR * 0.18), 0.03, 0.06) * 0.35 + grains(0.18, 200, 800, 4000, (0.001, 0.003), (0.05, 0.2)), 0)
    put(y, A(thud(0.25, 140, 0.03), modal([(620, 0.7, 0.03), (1450, 0.35, 0.02), (2300, 0.15, 0.012)], 0.2)), 0.17)
    return verb(y, 0.12, 0.35)

@sfx
def door_slam():          # pintu kayu dibanting: hembusan udara + DUM berat + getar kusen + gerendel
    y = Z(1.3)
    put(y, BP(wn(0.15), 200, 1500) * lin(0, 1, 0.15) ** 2 * 0.4, 0)
    put(y, A(thud(0.6, 70, 0.12) * 1.3, knock(180, 0.4, 0.06, 0.9), BP(wn(0.06), 800, 5000) * dec(int(SR * 0.06), 0.012) * 0.9), 0.14)
    put(y, modal([(2300, 0.3, 0.04), (3600, 0.2, 0.025)], 0.12), 0.18)
    put(y, LP(wn(0.5), 140) * dec(int(SR * 0.5), 0.15) * 0.6, 0.15)
    return verb(y, 0.3, 0.8, 3000)

@sfx
def cloth_tear():         # kain payung sobek: robekan kain (serat berbutir lebih rendah & panjang dari kertas) + kibasan
    d = 0.8; t = T(d)
    rip = grains(0.5, 1400, 400, 3200, (0.001, 0.004), (0.1, 0.6)) * np.concatenate([lin(0.4, 1, 0.3), lin(1, 0.2, 0.2)])
    y = Z(d); put(y, rip + BP(wn(0.5), 300, 1800) * 0.25 * adsr(int(SR * 0.5), 0.05, 0.1), 0)
    put(y, BP(wn(0.25), 200, 1200) * np.sin(np.pi * T(0.25) / 0.25) * 0.3, 0.5)
    return verb(y, 0.1, 0.3)

if __name__ == '__main__':
    meter = pyln.Meter(SR, block_size=0.1)
    for name, fn in S.items():
        x = np.asarray(fn(), dtype=np.float64)
        fd = int(SR * 0.008); x[-fd:] *= np.linspace(1, 0, fd)
        xx = np.concatenate([x, Z(0.5)]) if len(x) < SR // 2 else x
        x *= 10 ** ((-20 - meter.integrated_loudness(xx)) / 20)
        pk = np.abs(x).max()
        if pk > 0.95: x *= 0.95 / pk
        wavfile.write(os.path.join(OUT, name + '.wav'), SR, (x * 32767).astype(np.int16))
    print(len(S), 'SFX baru ->', OUT, ':', ', '.join(S))
