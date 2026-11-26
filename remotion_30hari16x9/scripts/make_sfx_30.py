"""SFX BARU video "30 hari" 16:9 — semuanya disintesis untuk video ini (nama & bunyi baru; tidak memakai file SFX mana pun yang
sudah ada di repo). Foley natural: modal synthesis (benda kayu/logam/kaca/plastik), noise berfilter + envelope, granular
(kertas/daun/pasir/air/hujan), stick-slip (derit), napas/formant. TANPA laser/zap/sci-fi.
Output public/sfx30/<nama>.wav (48 kHz mono, -20 LUFS; level akhir diatur mixer)."""
import os, sys
import numpy as np
from scipy.io import wavfile
import pyloudnorm as pyln
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
# hanya primitif DSP (filter, envelope, resonator) — bukan file audio lama
from make_sfx_ob import SR, T, wn, Z, LP, HP, BP, pinkn, brownn, dec, adsr, put, modal, osc, lin, expo, verb, grains, creak, breath, formant_hum, A

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'sfx30')
os.makedirs(OUT, exist_ok=True)
R = np.random.default_rng(3030)
S = {}
def sfx(cls):
    def deco(fn): S[fn.__name__] = (fn, cls); return fn
    return deco
def tick(f, a=1.0, tau=0.01, d=0.05): return modal([(f, a, tau), (f * 2.3, a * 0.3, tau * 0.5)], d)
def thud(d=0.3, f=90, tau=0.08): return LP(wn(d), f * 3) * dec(int(SR * d), tau) + osc(expo(f, f * 0.7, d), d) * dec(int(SR * d), tau * 1.2) * 0.6

# ================= TRANSISI / KAMERA / PANEL (15% VO) =================
@sfx('trans')
def t30_snap():          # snap zoom: tarikan udara pendek yang menajam
    d = 0.32; return BP(wn(d), 700, 6000) * np.concatenate([lin(0, 1, 0.2), lin(1, 0, d - 0.2) ** 3]) + LP(wn(d), 260) * 0.25 * adsr(int(SR * d), 0.12, 0.15)
@sfx('trans')
def t30_whip():          # whip pan horizontal: sapuan udara melebar kiri->kanan
    d = 0.5; t = T(d); x = wn(d); y = np.zeros_like(x)
    for i, (a, b) in enumerate([(300, 1000), (800, 2600), (2000, 7000)]): y += BP(x, a, b) * np.exp(-((t - 0.2 - i * 0.035) / 0.08) ** 2)
    return y
@sfx('trans')
def t30_air():           # gerakan kamera pelan (zoom/tilt/pan): desir udara lembut
    d = 1.1; t = T(d); x = pinkn(d); y = np.zeros_like(x)
    for k in range(12):
        s0, s1 = int(len(t) * k / 12), int(len(t) * (k + 1) / 12); fc = 400 * (4 ** (k / 11))
        y[s0:s1] = BP(x, fc * 0.6, fc * 1.6)[s0:s1]
    return y * np.sin(np.pi * t / d) ** 1.6
@sfx('trans')
def t30_dark():          # fade lewat gelap: hembusan ruang rendah meredup
    d = 1.0; return LP(brownn(d), 220) * adsr(int(SR * d), 0.3, 0.6) + BP(pinkn(d), 180, 700) * 0.18 * adsr(int(SR * d), 0.35, 0.5)
@sfx('trans')
def t30_light():         # light reveal pagi: udara mengembang hangat + kilau kaca tipis
    d = 1.1; y = BP(pinkn(d), 250, 3500) * np.minimum(1, T(d) / 0.5) ** 2 * np.exp(-np.maximum(0, T(d) - 0.55) / 0.2)
    for i, f in enumerate((2637, 3520)): put(y, modal([(f, 0.25, 0.3)], 0.6), 0.45 + i * 0.08)
    return verb(y, 0.3, 0.9)
@sfx('trans')
def t30_dissolve():      # blur dissolve: desir kain lembut
    d = 0.9; return BP(pinkn(d), 500, 3000) * np.sin(np.pi * T(d) / d) ** 2
@sfx('trans')
def t30_neon_swap():     # panel neon ganti: dengung lama putus + starter klik + dengung baru kedip 3x lalu stabil
    d = 1.2; t = T(d); hum = osc(120, d) * 0.45 + osc(240, d) * 0.25 + osc(360, d) * 0.1 + BP(wn(d), 2500, 6500) * 0.05
    g = np.zeros_like(t)
    for a, b in [(0.0, 0.06), (0.1, 0.12), (0.3, 0.36), (0.42, 0.47), (0.55, 0.6), (0.66, 1.2)]: g[int(a * SR):int(b * SR)] = 1
    y = hum * LP(g, 70) * adsr(len(t), 0, 0.3)
    for s in (0.08, 0.28, 0.41, 0.54, 0.65): put(y, HP(wn(0.005), 2800) * dec(int(SR * 0.005), 0.0018), s, 0.7)
    return y
@sfx('trans')
def t30_charge_full():   # penutup: "charge penuh" — denting kristal lembut 3 nada naik (bukan beep)
    y = Z(1.8)
    for i, f in enumerate((1568, 2093, 3136)): put(y, modal([(f, 1, 0.6), (f * 2.0, 0.25, 0.25), (f * 3.01, 0.1, 0.12)], 1.2) * 0.5, i * 0.09)
    return verb(y, 0.4, 1.2)

# ================= HOOK =================
@sfx('anim')
def mri_knock():         # mesin MRI: dengung dalam + ketukan magnet berirama
    d = 1.4; y = (osc(55, d) * 0.3 + osc(110, d) * 0.12 + LP(brownn(d), 180) * 0.4) * adsr(int(SR * d), 0.05, 0.3)
    for i in range(7): put(y, modal([(420, 1, 0.02), (980, 0.4, 0.01)], 0.06) + 0, 0.1 + i * 0.17, 0.5)
    return y
@sfx('anim')
def drawer_lock():       # laci kayu ditutup (geser + bentur) lalu anak kunci diputar klik
    y = Z(1.0); put(y, BP(wn(0.22), 300, 2500) * adsr(int(SR * 0.22), 0.03, 0.05) * 0.5, 0)
    put(y, A(thud(0.2, 120, 0.04), modal([(240, 0.6, 0.05), (610, 0.3, 0.03)], 0.2)), 0.2)
    put(y, BP(wn(0.15), 3000, 8000) * adsr(int(SR * 0.15), 0.02, 0.05) * 0.2, 0.45)
    put(y, modal([(2700, 1, 0.02), (4300, 0.5, 0.012)], 0.1), 0.6); return verb(y, 0.15, 0.35)
@sfx('anim')
def flip_spin():         # papan flip berputar cepat (klak-klak makin rapat) lalu "tak" berhenti di 30
    y = Z(1.3); s, g = 0.0, 0.07
    while s < 0.9: put(y, modal([(R.uniform(1500, 1900), 0.7, 0.008)], 0.03) + 0, s); s += g; g = max(0.025, g * 0.93)
    put(y, A(modal([(900, 1, 0.03), (2100, 0.6, 0.015)], 0.12), LP(wn(0.02), 1500) * dec(int(SR * 0.02), 0.006)), 0.95, 1.2); return y

# ================= HARI 1-3 =================
@sfx('anim')
def wall_scratch():      # kapur menggores tembok sekali (satu garis turus)
    d = 0.32; return (BP(wn(d), 1500, 6500) * 0.8 + creak(d, 600, 500, 0.5, 1200, 5000) * 0.05) * adsr(int(SR * d), 0.02, 0.08)
@sfx('anim')
def wind_room():         # angin menderu di dalam ruangan + kertas berhamburan
    d = 2.2; t = T(d); y = BP(pinkn(d), 300, 1800) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * t)) * adsr(len(t), 0.3, 0.5)
    y += BP(wn(d), 1500, 4000) * 0.15 * (0.5 + 0.5 * np.sin(2 * np.pi * 1.3 * t + 1))
    return A(y, grains(d, 90, 1200, 7000, (0.002, 0.008), (0.05, 0.3)))
@sfx('anim')
def gauge_click():       # jarum indikator naik (desir halus) lalu klik mantap
    y = Z(0.8); put(y, BP(wn(0.35), 1200, 4000) * adsr(int(SR * 0.35), 0.05, 0.05) * 0.15, 0)
    put(y, modal([(2200, 1, 0.012), (3600, 0.5, 0.006)], 0.06), 0.38); return y
@sfx('anim')
def dominoes():          # barisan domino jatuh berurutan (ketukan kayu makin cepat)
    y = Z(1.4); s, g = 0.0, 0.14
    for i in range(10): put(y, modal([(R.uniform(1100, 1400), 1, 0.02), (2900, 0.4, 0.01)], 0.08), s, 0.6 + 0.04 * i); s += g; g *= 0.9
    return verb(y, 0.18, 0.4)
@sfx('anim')
def ball_bounce():       # bola tenis memantul berirama di tembok (2 pantulan)
    y = Z(1.0)
    for s in (0.0, 0.66): put(y, A(LP(wn(0.04), 1200) * dec(int(SR * 0.04), 0.01), modal([(320, 0.6, 0.03)], 0.08)), s)
    return verb(y, 0.2, 0.4)
@sfx('anim')
def far_switches():      # saklar-saklar jauh mati satu-satu + angin malam
    d = 1.6; y = BP(pinkn(d), 200, 900) * 0.25 * adsr(int(SR * d), 0.2, 0.4)
    for i in range(4): put(y, modal([(2600, 0.5, 0.006)], 0.04), 0.15 + i * 0.32, 0.5 - i * 0.08)
    return verb(y, 0.4, 0.8)
@sfx('anim')
def phone_buzz_slide():  # HP bergetar di meja kayu lalu meluncur (gesekan)
    d = 0.7; y = Z(d)
    put(y, (osc(170, 0.3) * 0.5 + BP(wn(0.3), 150, 600) * 0.4) * (np.sin(2 * np.pi * 18 * T(0.3)) > 0), 0)
    put(y, BP(wn(0.35), 600, 3500) * adsr(int(SR * 0.35), 0.03, 0.15) * 0.4, 0.3); return y
@sfx('anim')
def box_hinge_hum():     # engsel kotak terbuka (derit pendek) + dengung lembut cahaya
    y = Z(1.4); put(y, creak(0.4, 220, 340, 1.0, 300, 2500) * adsr(int(SR * 0.4), 0.03, 0.1) * 0.6, 0)
    put(y, (osc(220, 1.0) * 0.12 + osc(330, 1.0) * 0.06 + BP(pinkn(1.0), 400, 1500) * 0.15) * adsr(int(SR * 1.0), 0.2, 0.4), 0.35); return y
@sfx('anim')
def curtain_lamp():      # tirai ditarik (cincin bergesek di rel) + saklar lampu meja
    y = Z(1.0); put(y, BP(pinkn(0.5), 500, 3000) * adsr(int(SR * 0.5), 0.05, 0.2) * 0.6, 0)
    for i in range(6): put(y, modal([(R.uniform(3000, 3600), 0.3, 0.01)], 0.04), 0.02 + i * 0.07)
    put(y, A(modal([(3100, 1, 0.006)], 0.04), LP(wn(0.02), 600) * dec(int(SR * 0.02), 0.008)), 0.6); return y
@sfx('anim')
def tick_reverse_breath():   # jam berdetak terbalik (tok-tik) + napas gelisah
    y = Z(2.0)
    for i in range(6): put(y, modal([(1700 if i % 2 else 2300, 0.8, 0.012)], 0.05), i * 0.32)
    for s in (0.2, 1.0): put(y, breath(0.45, 400, 2200, 0.08, 0.25) * 0.5, s)
    return y
@sfx('anim')
def pacing_heart():      # langkah mondar-mandir di keramik + detak jantung
    y = Z(1.6)
    for i in range(4): put(y, A(LP(wn(0.05), 1600) * dec(int(SR * 0.05), 0.012), BP(wn(0.03), 2500, 6000) * dec(int(SR * 0.03), 0.006) * 0.3), i * 0.36, 0.6)
    for s in (0.1, 0.4, 0.9, 1.2): put(y, osc(expo(60, 45, 0.15), 0.15) * dec(int(SR * 0.15), 0.04), s, 0.9)
    return y

# ================= HARI KE-7 =================
@sfx('anim')
def scoreboard_flip():   # papan skor elektromekanis: relai berderak menyusun "DAY 7"
    y = Z(0.8)
    for i in range(8): put(y, A(modal([(R.uniform(800, 1100), 0.7, 0.01)], 0.04), LP(wn(0.01), 2000) * dec(int(SR * 0.01), 0.003)), i * 0.05)
    return verb(y, 0.25, 0.5)
@sfx('anim')
def pages_flip():        # halaman jurnal dibalik cepat beruntun
    y = Z(1.2)
    for i in range(5): put(y, BP(pinkn(0.16), 1500, 8000) * np.sin(np.pi * T(0.16) / 0.16) ** 2 * 0.6, i * 0.2)
    return y
@sfx('anim')
def metal_ding():        # dentingan logam lembut (molekul menyala)
    return verb(modal([(1046, 1, 0.5), (2630, 0.4, 0.3), (4200, 0.15, 0.15)], 1.0) * 0.6, 0.3, 0.8)
@sfx('anim')
def striker_bell():      # palu menghantam pad, bandul melesat naik, bel berdenting di puncak
    y = Z(1.6); put(y, A(thud(0.3, 80, 0.06) * 1.2, modal([(180, 0.6, 0.06)], 0.2)), 0)
    put(y, BP(wn(0.5), 800, 3000) * lin(0.1, 0.5, 0.5) * 0.4, 0.05)
    put(y, modal([(1400, 1, 0.6), (3360, 0.5, 0.4), (5600, 0.2, 0.2)], 1.0) * 0.8, 0.58); return verb(y, 0.25, 0.6)
@sfx('anim')
def puck_slide():        # bandul meluncur turun di rel logam
    d = 0.9; return BP(wn(d), 1200, 5000) * lin(0.6, 0.1, d) * adsr(int(SR * d), 0.03, 0.2) + creak(d, 500, 300, 0.4, 600, 3000) * 0.06
@sfx('anim')
def balloon_laugh():     # balon melayang (gesek karet) + tawa kecil teredam "heh-heh"
    y = Z(1.4); put(y, creak(0.35, 500, 700, 0.9, 500, 3500) * adsr(int(SR * 0.35), 0.03, 0.1) * 0.4, 0)
    for i in range(3): put(y, LP(formant_hum(0.13, 190 - i * 8, ((500, 1.0), (1400, 0.4), (2500, 0.1))), 1500) * 0.7, 0.45 + i * 0.17)
    return y
@sfx('anim')
def dial_clicks():       # putaran termostat (detent klik-klik)
    y = Z(1.0)
    for i in range(8): put(y, modal([(2900 + i * 30, 0.6, 0.006)], 0.03), i * 0.1)
    return y

# ================= HARI KE-14 =================
@sfx('anim')
def rain_platform():     # hujan di atap peron + tetesan ke genangan
    d = 3.0; y = BP(pinkn(d), 800, 6000) * 0.3 * adsr(int(SR * d), 0.4, 0.6)
    return A(y, grains(d, 260, 1500, 8000, (0.001, 0.004), (0.05, 0.3)))
@sfx('anim')
def umbrella_sigh():     # payung ditutup (kain + jeprit) + helaan napas
    y = Z(1.4); put(y, BP(pinkn(0.3), 400, 2500) * adsr(int(SR * 0.3), 0.05, 0.1) * 0.5, 0)
    put(y, modal([(1900, 0.8, 0.01)], 0.05), 0.3); put(y, breath(0.8, 250, 1500, 0.1, 0.5) * 0.7, 0.5); return y
@sfx('anim')
def fizzle():            # sumbu kembang api mendesis lalu padam (desis menyurut + letup kecil basah)
    d = 1.0; y = HP(wn(d), 2500) * (0.6 + 0.4 * np.abs(LP(wn(d), 40)) * 4).clip(0, 1.2) * np.concatenate([np.ones(int(SR * 0.5)), lin(1, 0, d - 0.5)]) * 0.5
    put(y, LP(wn(0.05), 800) * dec(int(SR * 0.05), 0.02) * 0.5, 0.55); return y
@sfx('anim')
def splitflap():         # papan split-flap berputar (cepat) lalu berhenti
    y = Z(1.0); s = 0.0
    while s < 0.85: put(y, modal([(R.uniform(2400, 3000), 0.4, 0.004)], 0.02), s); s += R.uniform(0.018, 0.03)
    put(y, modal([(1500, 0.8, 0.02)], 0.06), 0.88); return y
@sfx('anim')
def train_pass():        # kereta lewat cepat: gemuruh roda di rel + desir angin, doppler
    d = 2.2; t = T(d); a = np.exp(-((t - 0.9) / 0.42) ** 2)
    rail = sum(LP(wn(0.04), 600) * dec(int(SR * 0.04), 0.01) for _ in range(1))
    y = (LP(brownn(d), 300) * 0.7 + BP(wn(d), 800, 4000) * 0.4) * a
    for i in range(12): put(y, rail * 0.6 * float(np.exp(-((0.4 + i * 0.09 - 0.9) / 0.42) ** 2)), 0.4 + i * 0.09)
    return y
@sfx('anim')
def soft_hum():          # dengung lembut (amigdala menyala)
    d = 1.2; return (osc(196, d) * 0.15 + osc(294, d) * 0.08 + BP(pinkn(d), 300, 1200) * 0.15) * adsr(int(SR * d), 0.25, 0.5)
@sfx('anim')
def fader_slide():       # slider mixer digeser turun (gesek plastik halus)
    d = 0.8; return BP(wn(d), 1500, 5000) * adsr(int(SR * d), 0.05, 0.1) * 0.5 + creak(d, 300, 200, 0.3, 400, 2000) * 0.03
@sfx('anim')
def puddle_taps():       # ketukan kaki di genangan (cipratan kecil berirama)
    y = Z(1.4)
    for i in range(5): put(y, A(LP(wn(0.03), 1200) * dec(int(SR * 0.03), 0.01), grains(0.1, 120, 1500, 6000, (0.001, 0.003), (0.1, 0.4))), i * 0.31)
    return y
@sfx('anim')
def slot_coins():        # gulungan mesin slot berputar (ratchet) + koin berjatuhan
    y = Z(2.0); s = 0.0
    while s < 0.9: put(y, modal([(R.uniform(1800, 2200), 0.4, 0.005)], 0.02), s); s += 0.035
    for i in range(9): put(y, modal([(R.uniform(3500, 4500), 0.6, 0.08), (R.uniform(6000, 7000), 0.3, 0.05)], 0.2), 1.0 + i * 0.09 + R.uniform(0, 0.03))
    return verb(y, 0.2, 0.4)
@sfx('anim')
def drip_bin():          # tetesan infus (plip lembut) + HP jatuh ke tong sampah logam
    y = Z(2.0)
    for s in (0.0, 0.5, 1.0): put(y, osc(expo(1200, 700, 0.06), 0.06) * dec(int(SR * 0.06), 0.015) * 0.5, s)
    put(y, A(modal([(520, 1, 0.12), (1340, 0.6, 0.08), (2600, 0.3, 0.04)], 0.5), LP(wn(0.03), 2000) * dec(int(SR * 0.03), 0.008)), 1.33, 0.9)
    return verb(y, 0.2, 0.5)

# ================= HARI 21-30 =================
@sfx('anim')
def dawn_birds():        # burung pagi berkicau (siulan bernada naik-turun)
    d = 2.0; y = Z(d)
    for i in range(8):
        n = R.uniform(0.08, 0.16); f0 = R.uniform(2600, 3800)
        put(y, osc(f0 * (1 + 0.15 * np.sin(2 * np.pi * R.uniform(10, 25) * T(n))), n) * np.sin(np.pi * T(n) / n) ** 2 * 0.4, R.uniform(0, d - 0.2))
    return verb(y, 0.3, 0.8)
@sfx('anim')
def door_bolt():         # pintu didorong dari balik (dentum berulang) lalu gerendel digeser & dikunci
    y = Z(1.8)
    for i in range(3): put(y, A(thud(0.25, 100, 0.05), modal([(180, 0.5, 0.05)], 0.2)), i * 0.4, 0.8 - i * 0.15)
    put(y, BP(wn(0.2), 1500, 5000) * adsr(int(SR * 0.2), 0.02, 0.05) * 0.3, 1.25); put(y, modal([(2200, 1, 0.03), (3500, 0.5, 0.015)], 0.12), 1.42)
    return verb(y, 0.15, 0.4)
@sfx('anim')
def sign_steps2():       # langkah kecil berderap + rambu kayu berderit
    y = Z(1.4)
    for i in range(5): put(y, LP(wn(0.03), 2000) * dec(int(SR * 0.03), 0.008) * 0.5, i * 0.16)
    put(y, creak(0.45, 150, 220, 1.0, 200, 2200) * adsr(int(SR * 0.45), 0.05, 0.15) * 0.5, 0.8); return y
@sfx('anim')
def watch_flutter():     # jam saku dibuka (klik pegas) + kepakan kertas kecil
    y = Z(1.4); put(y, A(modal([(3300, 1, 0.01), (5100, 0.4, 0.006)], 0.05), modal([(2400, 0.4, 0.05)], 0.1)), 0)
    put(y, grains(0.9, 140, 800, 6000, (0.003, 0.012), (0.05, 0.3), lambda k: np.sin(np.pi * k)), 0.15); return y
@sfx('anim')
def bow_arrow():         # tali busur ditarik (derit) -> dilepas (twang) -> anak panah menancap (thunk)
    y = Z(1.8); put(y, creak(0.4, 120, 200, 0.6, 300, 2500) * adsr(int(SR * 0.4), 0.05, 0.05) * 0.4, 0)
    put(y, osc(expo(140, 110, 0.4), 0.4) * dec(int(SR * 0.4), 0.08) * 0.5, 0.4)
    put(y, BP(wn(0.6), 1500, 5000) * lin(0.4, 0.05, 0.6) * 0.2, 0.42)
    put(y, A(thud(0.2, 140, 0.03), modal([(520, 0.6, 0.06), (1200, 0.3, 0.03)], 0.2)), 1.32); return y
@sfx('anim')
def kite_flutter():      # layangan berkibar (kain bergetar) + angin
    d = 2.0; t = T(d); flap = BP(wn(d), 300, 1500) * (0.5 + 0.5 * np.sin(2 * np.pi * 9 * t)) ** 2
    return (flap * 0.5 + BP(pinkn(d), 200, 1200) * 0.3) * adsr(len(t), 0.2, 0.5)
@sfx('anim')
def cute_snore():        # dengkur kecil lucu (tarik napas bergetar + siul hembus)
    y = Z(2.2)
    for s in (0.0, 1.1):
        n = 0.6; put(y, BP(osc(55 + 8 * np.sin(2 * np.pi * 30 * T(n)), n, 'saw'), 100, 1200) * np.sin(np.pi * T(n) / n) * 0.25, s)
        put(y, osc(expo(900, 1300, 0.3), 0.3) * np.sin(np.pi * T(0.3) / 0.3) * 0.08, s + 0.65)
    return y
@sfx('anim')
def lighthouse_on():     # lampu mercusuar menyala (relai berat + dengung) + swell hangat
    y = Z(2.0); put(y, A(modal([(300, 1, 0.05), (760, 0.4, 0.03)], 0.2), LP(wn(0.03), 800) * dec(int(SR * 0.03), 0.01)), 0)
    put(y, (osc(110, 1.6) * 0.12 + osc(165, 1.6) * 0.1 + osc(220, 1.6) * 0.08 + BP(pinkn(1.6), 200, 1500) * 0.2) * adsr(int(SR * 1.6), 0.6, 0.6), 0.1)
    return y

# ================= BUTUH 66 HARI =================
@sfx('anim')
def soil_sprout():       # tanah bergeser (butir) + tunas tumbuh (krek halus batang)
    d = 2.0; y = grains(d, 70, 400, 3000, (0.003, 0.01), (0.1, 0.4), lambda k: 1 - k * 0.5) + LP(brownn(d), 300) * 0.2 * adsr(int(SR * d), 0.2, 0.5)
    for i in range(3): put(y, creak(0.12, 300, 500, 0.5, 600, 3000) * 0.2, 0.6 + i * 0.4)
    return y
@sfx('anim')
def run_whistle():       # langkah lari di lintasan karet + peluit kecil (tiupan, bukan beep)
    y = Z(2.0)
    for i in range(7): put(y, A(LP(wn(0.04), 1300) * dec(int(SR * 0.04), 0.012), BP(wn(0.02), 2000, 5000) * dec(int(SR * 0.02), 0.005) * 0.2), i * 0.24, 0.7)
    n = 0.35; put(y, (BP(wn(n), 2600, 3600) * 0.5 + osc(3100 * (1 + 0.03 * np.sin(2 * np.pi * 30 * T(n))), n) * 0.15) * adsr(int(SR * n), 0.02, 0.1), 0.9)
    return y
@sfx('anim')
def baton_catch():       # tongkat estafet ditangkap (tepuk telapak) + langkah cepat
    y = Z(1.5); put(y, A(LP(wn(0.04), 3000) * dec(int(SR * 0.04), 0.01), modal([(700, 0.5, 0.03)], 0.1)), 0)
    for i in range(6): put(y, LP(wn(0.04), 1300) * dec(int(SR * 0.04), 0.012) * 0.6, 0.18 + i * 0.19)
    return y
@sfx('anim')
def alarm_blanket():     # alarm lembut (marimba kayu 3 nada) + kain selimut bergeser
    y = Z(2.0)
    for i, f in enumerate((784, 988, 1175, 988)): put(y, modal([(f, 0.6, 0.15), (f * 4, 0.15, 0.04)], 0.4), i * 0.2)
    put(y, BP(pinkn(0.8), 300, 2500) * adsr(int(SR * 0.8), 0.2, 0.4) * 0.5, 0.9); return verb(y, 0.25, 0.5)
@sfx('anim')
def dam_water():         # air mengalir lembut dari pintu air + daun bergoyang
    d = 2.4; y = LP(wn(d), 1500) * (0.6 + 0.2 * np.sin(2 * np.pi * 1.1 * T(d))) * adsr(int(SR * d), 0.4, 0.6) * 0.6
    y = A(y, grains(d, 100, 1500, 5000, (0.002, 0.006), (0.05, 0.2)))
    put(y, BP(pinkn(0.6), 1000, 5000) * np.sin(np.pi * T(0.6) / 0.6) * 0.2, 0.8); return y
@sfx('anim')
def crank_scribble():    # engkol besi diputar paksa (derit berat berirama) lalu coretan spidol tegas
    y = Z(2.0)
    for i in range(3): put(y, creak(0.32, 90, 130, 1.4, 150, 2000) * adsr(int(SR * 0.32), 0.04, 0.1) * 0.7, i * 0.36)
    for i in range(2): put(y, BP(wn(0.22), 2000, 7000) * adsr(int(SR * 0.22), 0.02, 0.05) * 0.6, 1.33 + i * 0.25)
    return y

# ================= NEUROPLASTICITY =================
@sfx('anim')
def branch_grow():       # cabang cahaya tumbuh: krepitasi halus menyebar + nada hangat pelan
    d = 1.8; y = grains(d, 60, 2500, 8000, (0.001, 0.003), (0.05, 0.2), lambda k: k) + (osc(262, d) * 0.06 + osc(392, d) * 0.04) * adsr(int(SR * d), 0.6, 0.6)
    return verb(y, 0.3, 0.8)
@sfx('anim')
def step_ting():         # langkah lembut + "ting" kaca kecil tiap jejak menyala
    y = Z(2.0)
    for i in range(5):
        put(y, LP(wn(0.04), 1000) * dec(int(SR * 0.04), 0.012) * 0.6, i * 0.38)
        put(y, modal([(2349 + i * 120, 0.35, 0.25)], 0.5), i * 0.38 + 0.03)
    return verb(y, 0.3, 0.6)
@sfx('anim')
def city_switches():     # lampu-lampu kota menyala berurutan (klik saklar + dengung kecil)
    y = Z(2.4)
    for i in range(8): put(y, A(modal([(2400 + i * 60, 0.5, 0.006)], 0.04), osc(120, 0.25) * dec(int(SR * 0.25), 0.08) * 0.08), i * 0.26)
    return y
@sfx('anim')
def link_click2():       # klik link: tombol kaca halus dua tahap
    y = Z(0.3); put(y, modal([(4200, 0.8, 0.006), (6800, 0.3, 0.004)], 0.04), 0); put(y, modal([(3200, 0.6, 0.008)], 0.04), 0.06); return y
@sfx('anim')
def warm_swell2():       # swell hangat (paduan nada lembut + napas udara) untuk spotlight akhir
    d = 2.4; t = T(d); y = (osc(220, d) * 0.12 + osc(277, d) * 0.08 + osc(330, d) * 0.08 + BP(pinkn(d), 300, 2000) * 0.15)
    return y * np.minimum(1, t / 1.4) ** 2 * adsr(len(t), 0, 0.6)

if __name__ == '__main__':
    meter = pyln.Meter(SR, block_size=0.1)
    for name, (fn, cls) in S.items():
        x = np.asarray(fn(), dtype=np.float64)
        fd = int(SR * 0.008); x[-fd:] *= np.linspace(1, 0, fd)
        xx = np.concatenate([x, Z(0.5)]) if len(x) < SR // 2 else x
        x *= 10 ** ((-20 - meter.integrated_loudness(xx)) / 20)
        pk = np.abs(x).max()
        if pk > 0.95: x *= 0.95 / pk
        wavfile.write(os.path.join(OUT, name + '.wav'), SR, (x * 32767).astype(np.int16))
    print(len(S), 'SFX baru ->', OUT)
