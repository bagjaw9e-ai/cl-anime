"""SFX BARU video "otak bodoh" — semuanya disintesis dari nol untuk video ini (tidak memakai file SFX lama mana pun).
Foley natural berbasis fisika sederhana: noise berfilter + envelope, modal synthesis (resonansi benda: kayu, logam, kaca,
kertas), stick-slip (derit), granular (kertas/daun/pasir/air), napas/formant (hmm), mesin (harmonik + jitter).
TANPA laser/zap/sci-fi. Output public/sfx_ob/<nama>.wav (48 kHz mono, dinormalisasi -20 LUFS; level akhir diatur mixer)."""
import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve
import pyloudnorm as pyln

SR = 48000
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'sfx_ob')
os.makedirs(OUT, exist_ok=True)
R = np.random.default_rng(20261124)

# ---------------- primitif DSP (ditulis ulang untuk video ini) ----------------
def T(d): return np.arange(int(SR * d)) / SR
def wn(d): return R.standard_normal(int(SR * d))
def Z(d): return np.zeros(int(SR * d))
def filt(x, kind, f, o=2): return sosfilt(butter(o, f, kind, fs=SR, output='sos'), x)
def LP(x, f, o=2): return filt(x, 'low', f, o)
def HP(x, f, o=2): return filt(x, 'high', f, o)
def BP(x, a, b, o=2): return filt(x, 'band', [a, b], o)
def pinkn(d):
    x = wn(d); X = np.fft.rfft(x); fr = np.fft.rfftfreq(len(x), 1 / SR); X[1:] /= np.sqrt(fr[1:]); y = np.fft.irfft(X, len(x)); return y / (np.abs(y).max() + 1e-9)
def brownn(d): y = np.cumsum(wn(d)); y = HP(y, 20); return y / (np.abs(y).max() + 1e-9)
def dec(n, tau): return np.exp(-np.arange(n) / (SR * tau))
def adsr(n, a, r):
    e = np.ones(n); ia, ir = min(n, int(SR * a)), min(n, int(SR * r))
    if ia: e[:ia] = np.linspace(0, 1, ia)
    if ir: e[-ir:] *= np.linspace(1, 0, ir)
    return e
def put(buf, x, s, g=1.0):
    i = int(SR * s); n = min(len(x), len(buf) - i)
    if n > 0: buf[i:i + n] += x[:n] * g
    return buf
def modal(modes, d, strike=0.002):
    """resonansi benda: modes = [(frek, amplitudo, tau)]; dipukul dengan impuls noise pendek"""
    t = T(d); y = np.zeros_like(t)
    for f, a, tau in modes: y += a * np.sin(2 * np.pi * f * t + R.random() * 6) * np.exp(-t / tau)
    exc = np.concatenate([LP(wn(strike), 6000) * np.linspace(1, 0, int(SR * strike)), np.zeros(len(t) - int(SR * strike))])
    return y * 0.8 + exc * 0.6
def osc(f, d, shape='sin'):
    f = np.broadcast_to(f, int(SR * d)) if np.ndim(f) else np.full(int(SR * d), f)
    ph = 2 * np.pi * np.cumsum(f) / SR
    if shape == 'saw': return 2 * ((ph / (2 * np.pi)) % 1) - 1
    if shape == 'sq': return np.sign(np.sin(ph))
    return np.sin(ph)
def lin(a, b, d): return np.linspace(a, b, int(SR * d))
def expo(a, b, d): return a * (b / a) ** np.linspace(0, 1, int(SR * d))
def verb(x, mix=0.2, rt=0.5, bright=5000):
    ir = LP(wn(rt), bright) * dec(int(SR * rt), rt / 5)
    ir[:int(SR * 0.008)] = 0
    y = np.concatenate([x, Z(rt)]); y /= (np.abs(y).max() + 1e-9)
    w = fftconvolve(x, ir)[:len(y)]; w = np.concatenate([w, np.zeros(len(y) - len(w))]); w /= (np.abs(w).max() + 1e-9)
    return y * (1 - mix) + w * mix
def grains(d, rate, lo, hi, glen=(0.001, 0.005), amp=(0.1, 0.6), shape=None):
    y = Z(d); n = int(rate * d)
    for _ in range(n):
        s = R.uniform(0, d); L = R.uniform(*glen)
        g = BP(wn(L + 0.01), lo, hi)[:int(SR * L)] * dec(int(SR * L), L / 3) * R.uniform(*amp)
        k = (shape(s / d) if shape else 1)
        put(y, g * k, s)
    return y
def creak(d, f0, f1, jit=1.2, lo=150, hi=2500):
    """stick-slip: rangkaian pulsa dengan frekuensi berjitter -> derit kayu/logam/karet"""
    t = T(d); f = f0 + (f1 - f0) * t / d
    f = f * np.exp(LP(R.standard_normal(len(t)), 18) * jit)
    ph = np.cumsum(np.maximum(f, 20) / SR); p = np.zeros(len(t)); p[np.where(np.diff(np.floor(ph)) > 0)[0]] = 1
    return BP(p * (0.5 + 0.5 * R.random(len(p))), lo, hi) * 4
def breath(d, lo, hi, a=0.1, r=0.3): return BP(pinkn(d), lo, hi) * adsr(int(SR * d), a, r)
def formant_hum(d, f0, formants=((300, 1.0), (900, 0.35), (2300, 0.1))):
    """suara "hmm" mulut tertutup: sumber denyut glotal (saw lembut) + resonansi formant"""
    src = LP(osc(f0 * (1 + 0.01 * np.sin(2 * np.pi * 5 * T(d))), d, 'saw'), 1800)
    y = sum(a * BP(src, f * 0.85, f * 1.15) for f, a in formants)
    return y * adsr(len(y), 0.06, 0.25)

def A(*xs):  # jumlahkan sinyal beda panjang (zero-pad)
    n = max(len(x) for x in xs); y = np.zeros(n)
    for x in xs: y[:len(x)] += x
    return y

S = {}
def sfx(cls):
    def deco(fn): S[fn.__name__] = (fn, cls); return fn
    return deco

# ================= TRANSISI / KAMERA (15% VO) =================
@sfx('trans')
def tr_snap_zoom():      # snap zoom cepat: hembusan udara naik singkat
    d = 0.38; x = BP(wn(d), 500, 5000) * np.concatenate([lin(0, 1, 0.22), lin(1, 0, d - 0.22) ** 2])
    return x + LP(wn(d), 300) * 0.3 * adsr(int(SR * d), 0.15, 0.2)
@sfx('trans')
def tr_whip():           # whip pan: sapuan udara lebar kiri->kanan (filter bergerak)
    d = 0.45; t = T(d); x = wn(d); y = np.zeros_like(x)
    for i, (a, b) in enumerate([(400, 1200), (900, 2800), (1800, 6000)]):
        y += BP(x, a, b) * np.exp(-((t - 0.16 - i * 0.04) / 0.07) ** 2)
    return y
@sfx('trans')
def tr_push():           # push-in kamera: dorongan udara rendah + desis
    d = 0.5; return LP(brownn(d), 500) * adsr(int(SR * d), 0.25, 0.22) + HP(wn(d), 3000) * 0.08 * adsr(int(SR * d), 0.3, 0.15)
@sfx('trans')
def tr_air_rise():       # zoom pelan / tilt: udara lembut yang naik pelan
    d = 1.4; t = T(d); x = pinkn(d); y = np.zeros_like(x)
    for k in range(16):
        s0, s1 = int(len(t) * k / 16), int(len(t) * (k + 1) / 16); fc = 300 * (6 ** (k / 15))
        y[s0:s1] = BP(x, fc * 0.6, fc * 1.6)[s0:s1]
    return y * np.sin(np.pi * t / d) ** 1.5
@sfx('trans')
def tr_air_fall():       # pull-out / tilt turun: kebalikan tr_air_rise
    return tr_air_rise()[::-1].copy()
@sfx('trans')
def tr_dark_fade():      # fade lewat gelap: tarikan napas ruang rendah yang meredup
    d = 1.0; return LP(brownn(d), 260) * adsr(int(SR * d), 0.35, 0.55) + BP(pinkn(d), 200, 800) * 0.2 * adsr(int(SR * d), 0.4, 0.5)
@sfx('trans')
def tr_door_light():     # masuk lewat pintu bercahaya: udara mengembang + gema ruang (tanpa nada sci-fi)
    d = 1.1; t = T(d); x = BP(pinkn(d), 200, 3000) * np.minimum(1, t / 0.55) ** 2 * np.exp(-np.maximum(0, t - 0.6) / 0.15)
    return verb(x + LP(brownn(d), 180) * 0.5 * adsr(int(SR * d), 0.4, 0.4), 0.35, 1.0)
@sfx('trans')
def tr_dissolve():       # dissolve halus: desir kain/angin pendek
    d = 0.8; return BP(pinkn(d), 600, 3500) * np.sin(np.pi * T(d) / d) ** 2
@sfx('trans')
def neon_on():           # panel neon menyala: trafo berdengung + ketukan starter + kedip 3x
    d = 1.0; t = T(d); y = Z(d)
    hum = (osc(100, d) * 0.5 + osc(200, d) * 0.3 + osc(300, d) * 0.15 + BP(wn(d), 2000, 6000) * 0.05)
    gate = np.zeros_like(t)
    for a, b in [(0.02, 0.08), (0.14, 0.18), (0.26, 0.34), (0.42, 1.0)]: gate[int(a * SR):int(b * SR)] = 1
    gate = LP(gate, 60)
    for s in (0.0, 0.12, 0.24, 0.4): put(y, HP(wn(0.006), 2500) * dec(int(SR * 0.006), 0.002), s, 0.8)
    return y + hum * gate * adsr(len(t), 0.0, 0.3)
@sfx('trans')
def neon_off():          # panel neon mati: kedip lalu dengung turun hilang
    d = 0.9; t = T(d); hum = osc(100, d) * 0.5 + osc(200, d) * 0.3 + BP(wn(d), 2000, 6000) * 0.04
    gate = np.ones_like(t); gate[int(0.1 * SR):int(0.16 * SR)] = 0.1; gate[int(0.26 * SR):int(0.3 * SR)] = 0.2
    y = hum * LP(gate, 60) * np.exp(-t / 0.35); put(y, HP(wn(0.006), 2500) * dec(int(SR * 0.006), 0.002), 0.46, 0.7); return y
@sfx('trans')
def neon_broken():       # neon rusak: dengung kasar + putus-sambung tak beraturan
    d = 1.2; t = T(d); hum = osc(100, d, 'sq') * 0.08 + osc(100, d) * 0.4 + osc(300, d) * 0.15 + BP(wn(d), 1500, 5000) * 0.08
    gate = (LP(R.standard_normal(len(t)), 14) > -0.05).astype(float); gate = LP(gate, 80)
    y = hum * gate * adsr(len(t), 0.0, 0.25)
    for s in R.uniform(0, d - 0.05, 5): put(y, HP(wn(0.004), 3000) * dec(int(SR * 0.004), 0.0015), s, 0.6)
    return y

# ================= HOOK =================
@sfx('anim')
def stamp_paper():       # cap stempel karet menghantam kertas di meja kayu
    y = Z(0.6); put(y, LP(wn(0.02), 900) * dec(int(SR * 0.02), 0.006), 0, 1.0)
    put(y, modal([(180, 1, 0.05), (410, 0.5, 0.03), (760, 0.25, 0.02)], 0.25), 0.002, 0.7)
    put(y, BP(wn(0.08), 1500, 6000) * dec(int(SR * 0.08), 0.02), 0.004, 0.35)   # kertas bergetar
    return verb(y, 0.12, 0.3)
@sfx('anim')
def paper_slide():       # kertas ujian diletakkan/bergeser
    d = 0.45; return BP(pinkn(d), 1200, 7000) * adsr(int(SR * d), 0.05, 0.25) * (0.6 + 0.4 * LP(np.abs(wn(d)), 20) * 5).clip(0, 1.4)
@sfx('anim')
def phone_ping():        # notifikasi HP: dua ketukan marimba kecil (kayu, bukan beep)
    y = Z(0.7)
    for s, f in ((0, 1320), (0.11, 1760)): put(y, modal([(f, 1, 0.09), (f * 3.9, 0.25, 0.03)], 0.4), s)
    return verb(y, 0.2, 0.4)
@sfx('anim')
def screen_tap():        # ketukan jari di kaca layar
    y = Z(0.12); put(y, BP(wn(0.01), 2000, 9000) * dec(int(SR * 0.01), 0.002), 0); put(y, modal([(300, 0.4, 0.015)], 0.06), 0, 0.5); return y
@sfx('anim')
def key_lock():          # anak kunci diputar: gesek logam + klik slot terkunci
    y = Z(0.7); put(y, BP(wn(0.22), 2500, 8000) * adsr(int(SR * 0.22), 0.02, 0.05) * 0.25, 0)
    put(y, modal([(2400, 1, 0.03), (3900, 0.6, 0.02), (6100, 0.3, 0.01)], 0.15), 0.22)
    put(y, modal([(1700, 1, 0.04), (2900, 0.5, 0.02)], 0.2), 0.3, 0.9)
    put(y, LP(wn(0.03), 700) * dec(int(SR * 0.03), 0.008), 0.3, 0.6)
    return verb(y, 0.15, 0.35)
@sfx('anim')
def chain_clank():       # rantai berderak: mata rantai logam saling beradu
    d = 0.9; y = Z(d)
    for i in range(14):
        s = 0.03 + i * 0.055 + R.uniform(-0.015, 0.015); f = R.uniform(1800, 3200)
        put(y, modal([(f, 1, 0.03), (f * 2.3, 0.5, 0.015), (f * 4.1, 0.2, 0.008)], 0.12), s, R.uniform(0.3, 0.9) * (1 - i / 18))
    return verb(y + LP(wn(d), 400) * 0.08 * adsr(int(SR * d), 0.05, 0.3), 0.18, 0.4)

# ================= ONE SHOT =================
@sfx('anim')
def light_switch():      # saklar dinding ditekan + relay lampu besar menyala (thunk ruang kosong)
    y = Z(0.9); put(y, modal([(3200, 1, 0.006), (5200, 0.4, 0.004)], 0.05), 0)
    put(y, LP(wn(0.05), 500) * dec(int(SR * 0.05), 0.02), 0.02, 0.8)
    put(y, LP(brownn(0.5), 120) * adsr(int(SR * 0.5), 0.01, 0.4) * 0.5, 0.03)
    return verb(y, 0.35, 0.9, 3500)
@sfx('anim')
def room_hum():          # dengung ruangan kosong pelan
    d = 3.0; return (LP(brownn(d), 200) * 0.7 + osc(60, d) * 0.04 + BP(pinkn(d), 300, 900) * 0.12) * adsr(int(SR * d), 0.6, 0.8)

# ================= FASE 1 =================
@sfx('anim')
def cable_plug():        # colokan kabel masuk soket: klik plastik + gesek
    y = Z(0.4); put(y, BP(wn(0.08), 800, 4000) * adsr(int(SR * 0.08), 0.03, 0.03) * 0.3, 0)
    put(y, modal([(1400, 1, 0.02), (2600, 0.6, 0.012)], 0.1), 0.08); put(y, LP(wn(0.02), 900) * dec(int(SR * 0.02), 0.006), 0.08, 0.5); return y
@sfx('anim')
def hum_down():          # dengung listrik turun (energi terkuras) — trafo melambat
    d = 1.6; f = expo(120, 50, d); y = osc(f, d) * 0.5 + osc(f * 2, d) * 0.25 + osc(f * 3, d) * 0.1
    return y * adsr(len(y), 0.05, 0.6) + LP(brownn(d), 150) * 0.2 * adsr(len(y), 0.1, 0.6)
@sfx('anim')
def bulb_flicker():      # lampu pijar berkedip & meredup: desis filamen terputus-putus
    d = 1.2; t = T(d); g = (np.sin(2 * np.pi * 7 * t + 3 * np.sin(2 * np.pi * 1.3 * t)) > -0.2).astype(float) * np.exp(-t / 0.7)
    y = (osc(100, d) * 0.3 + BP(wn(d), 3000, 8000) * 0.12) * LP(g, 90)
    for s in np.where(np.diff(g > 0.5))[0][:8] / SR: put(y, HP(wn(0.004), 3000) * dec(int(SR * 0.004), 0.0015), s, 0.3)
    return y
@sfx('anim')
def gears_soft():        # roda gigi kecil berputar halus (tik-tik gigi + dengung poros)
    d = 1.6; y = Z(d)
    for i in range(int(d * 22)): put(y, modal([(R.uniform(2200, 2800), 1, 0.006), (4800, 0.3, 0.003)], 0.03), i / 22, 0.35 + 0.1 * (i % 2))
    return y + BP(wn(d), 200, 600) * 0.06 * adsr(int(SR * d), 0.2, 0.3)
@sfx('anim')
def pencil_scratch():    # pensil menggores cepat di kertas
    d = 0.8; t = T(d); strokes = (np.sin(2 * np.pi * 5.5 * t) > 0).astype(float); strokes = LP(strokes, 40)
    return BP(wn(d), 1800, 8000) * strokes * (0.6 + 0.4 * np.abs(LP(wn(d), 60)) * 6).clip(0, 1.3) * adsr(len(t), 0.02, 0.1)
@sfx('anim')
def chess_knock():       # bidak catur kayu diletakkan di papan
    y = Z(0.45)
    for s, a in ((0, 0.6), (0.18, 1.0)): put(y, modal([(820, 1, 0.03), (1950, 0.5, 0.015), (3300, 0.2, 0.008)], 0.2), s, a)
    return verb(y, 0.15, 0.3)
@sfx('anim')
def chalk_board():       # kapur di papan tulis: gesekan kasar berirama + ketuk kapur
    d = 1.2; t = T(d); y = BP(wn(d), 1500, 6000) * LP((np.sin(2 * np.pi * 3.2 * t + 1) > -0.3).astype(float), 30) * 0.6
    y += creak(d, 700, 900, 0.6, 1500, 5000) * 0.05
    for s in (0.0, 0.5, 0.95): put(y, modal([(1100, 1, 0.01)], 0.05), s, 0.4)
    return y * adsr(len(t), 0.02, 0.15)
@sfx('anim')
def map_unfold():        # kertas peta besar dibentangkan
    d = 0.9; return grains(d, 170, 900, 7000, (0.002, 0.008), (0.1, 0.5), lambda k: np.sin(np.pi * k)) + BP(pinkn(d), 300, 1500) * 0.3 * adsr(int(SR * d), 0.2, 0.3)
@sfx('anim')
def brake_stomp():       # pedal rem diinjak: hentakan karet-logam + desis hidrolik
    y = Z(0.8); put(y, LP(wn(0.06), 500) * dec(int(SR * 0.06), 0.02), 0, 1.0)
    put(y, modal([(220, 1, 0.08), (530, 0.4, 0.04)], 0.3), 0.005, 0.6); put(y, BP(wn(0.4), 2500, 7000) * adsr(int(SR * 0.4), 0.02, 0.3) * 0.2, 0.05)
    return verb(y, 0.12, 0.3)
@sfx('anim')
def wheel_squeak():      # roda hamster logam berderit berirama
    d = 1.8; y = Z(d)
    for i in range(6): put(y, creak(0.18, 900, 1300, 0.8, 900, 4000) * adsr(int(SR * 0.18), 0.03, 0.08), i * 0.3, 0.6)
    return y + grains(d, 40, 1500, 4000, (0.001, 0.003), (0.05, 0.2))
@sfx('anim')
def engine_slow():       # mesin melambat + gear macet berderit
    d = 2.2; t = T(d); f = expo(38, 9, d)
    y = LP(osc(f, d, 'saw'), 400) * 0.4 * np.exp(-t / 1.6)
    put(y, creak(0.7, 160, 90, 1.5, 200, 2500) * adsr(int(SR * 0.7), 0.05, 0.2) * 0.5, 1.3)
    put(y, modal([(310, 1, 0.1), (870, 0.4, 0.05)], 0.3), 1.95, 0.5)
    return y + BP(wn(d), 1500, 5000) * 0.04 * np.exp(-t / 1.0)

# ================= PMO SAVIOR =================
@sfx('anim')
def link_click():        # klik tombol link (switch plastik kecil)
    y = Z(0.2); put(y, modal([(3800, 1, 0.005), (6400, 0.4, 0.003)], 0.04), 0); put(y, modal([(2900, 0.7, 0.005)], 0.04), 0.045); return y
@sfx('anim')
def book_open():         # buku dibuka + halaman dibalik
    y = Z(1.1); put(y, LP(wn(0.05), 800) * dec(int(SR * 0.05), 0.02), 0, 0.5)
    put(y, grains(0.35, 120, 800, 6000, (0.002, 0.006), (0.1, 0.4), lambda k: np.sin(np.pi * k)), 0.05)
    put(y, BP(pinkn(0.35), 1500, 8000) * np.sin(np.pi * T(0.35) / 0.35) ** 2 * 0.5, 0.55); return y
@sfx('anim')
def crystal_mend():      # kristal/kaca menyatu lembut: dentingan tinggi halus berurutan + kilau
    y = Z(1.6)
    for i, f in enumerate((2093, 2637, 3136, 4186)): put(y, modal([(f, 1, 0.5), (f * 2.01, 0.2, 0.2)], 0.9) * 0.4, i * 0.12)
    return verb(y, 0.35, 1.0)
@sfx('anim')
def switch_off():        # saklar mati + hening ruang (lampu panggung padam)
    y = Z(0.8); put(y, modal([(2700, 1, 0.006), (4600, 0.4, 0.004)], 0.05), 0); put(y, LP(brownn(0.6), 140) * dec(int(SR * 0.6), 0.2) * 0.4, 0.01)
    return verb(y, 0.3, 0.8)
@sfx('anim')
def door_creak():        # pintu kayu berderit terbuka pelan
    d = 1.6; y = creak(d, 70, 140, 1.6, 120, 2200) * adsr(int(SR * d), 0.1, 0.4)
    put(y, modal([(110, 1, 0.15), (260, 0.4, 0.08)], 0.4) * 0.3, d - 0.2); return verb(y, 0.25, 0.6)

# ================= FASE 2 (hutan) =================
@sfx('anim')
def night_owl():         # burung malam (hu-hu lembut, siulan berformant) + jangkrik jauh
    d = 2.0; y = Z(d)
    for s, f in ((0.1, 420), (0.55, 400), (0.75, 380)):
        n = 0.28; ff = f * (1 + 0.06 * np.sin(np.pi * T(n) / n)); put(y, BP(osc(ff, n), f * 0.8, f * 1.3) * np.sin(np.pi * T(n) / n) ** 2 * 0.6 + breath(n, f * 0.9, f * 2.4) * 0.08, s)
    cr = BP(wn(d), 4200, 5200) * LP((np.sin(2 * np.pi * 18 * T(d)) > 0.6).astype(float), 300) * (np.sin(2 * np.pi * 0.9 * T(d)) > 0)
    return verb(y + cr * 0.05, 0.3, 0.9)
@sfx('anim')
def leaf_steps():        # langkah di daun kering (4 langkah, kresek)
    d = 1.4; y = Z(d)
    for i in range(4):
        put(y, grains(0.16, 300, 1200, 7000, (0.001, 0.004), (0.1, 0.6), lambda k: np.exp(-k * 3)), i * 0.32)
        put(y, LP(wn(0.04), 300) * dec(int(SR * 0.04), 0.015), i * 0.32, 0.4)
    return y
@sfx('anim')
def lizard_monkey():     # desis kadal + celoteh monyet pelan (siulan pendek berformant)
    y = Z(1.4); put(y, BP(wn(0.45), 3000, 8000) * adsr(int(SR * 0.45), 0.03, 0.25) * 0.4, 0)
    for i in range(4):
        n = 0.09; f = R.uniform(650, 900); put(y, BP(osc(lin(f, f * 1.4, n), n, 'saw'), f * 0.8, f * 3) * np.sin(np.pi * T(n) / n) * 0.5, 0.55 + i * 0.13)
    return verb(y, 0.25, 0.6)
@sfx('anim')
def twig_fire():         # ranting dipatahkan + api unggun berkeretak
    d = 1.8; y = Z(d)
    put(y, A(modal([(950, 1, 0.02), (2100, 0.6, 0.01)], 0.08), LP(wn(0.08), 3000) * dec(int(SR * 0.08), 0.01)), 0)
    put(y, modal([(1200, 0.8, 0.015)], 0.06), 0.06, 0.7)
    fire = A(LP(brownn(1.4), 400) * 0.35, grains(1.4, 60, 1500, 6000, (0.001, 0.003), (0.2, 0.9)))
    put(y, fire * adsr(len(fire), 0.2, 0.4), 0.35); return y
@sfx('anim')
def chew():              # kunyah renyah lucu (3 gigitan)
    y = Z(0.9)
    for i in range(3): put(y, A(grains(0.09, 260, 1500, 6000, (0.001, 0.004), (0.2, 0.7)), LP(wn(0.09), 250) * dec(int(SR * 0.09), 0.03) * 0.5), i * 0.24)
    return y
@sfx('anim')
def chicks():            # kicau anak burung (cuit-cuit tipis)
    y = Z(1.3)
    for i in range(7):
        n = R.uniform(0.05, 0.08); f0 = R.uniform(3200, 4200)
        put(y, osc(lin(f0, f0 * 1.25, n), n) * np.sin(np.pi * T(n) / n) ** 2 * 0.5, i * 0.16 + R.uniform(0, 0.04))
    return verb(y, 0.2, 0.5)
@sfx('anim')
def scratch_hmm():       # garuk kepala + "hmm" pelan
    y = Z(1.3); put(y, BP(wn(0.35), 2500, 8000) * LP((np.sin(2 * np.pi * 9 * T(0.35)) > 0).astype(float), 60) * 0.3, 0)
    put(y, formant_hum(0.7, 150), 0.4, 0.8); return y
@sfx('anim')
def cardboard_boing():   # kardus tipis ditekuk + pegas "boing" lembut (resonansi kayu, bukan synth)
    y = Z(1.2); put(y, creak(0.25, 300, 200, 1.0, 300, 3000) * 0.4 + BP(wn(0.25), 400, 2500) * 0.3 * adsr(int(SR * 0.25), 0.02, 0.1), 0)
    n = 0.7; f = 180 * (1 + 0.25 * np.exp(-T(n) / 0.1) * np.sin(2 * np.pi * 9 * T(n)))
    put(y, osc(f, n) * np.exp(-T(n) / 0.25) * 0.5, 0.28); return y
@sfx('anim')
def camera_shutter():    # shutter kamera mekanis + kertas dibalik
    y = Z(0.9); put(y, A(modal([(2600, 1, 0.01), (4100, 0.5, 0.006)], 0.05), HP(wn(0.012), 2000) * dec(int(SR * 0.012), 0.004)), 0)
    put(y, modal([(1900, 0.8, 0.01)], 0.05), 0.07)
    put(y, BP(pinkn(0.3), 1500, 7000) * np.sin(np.pi * T(0.3) / 0.3) ** 2 * 0.4, 0.4); return y
@sfx('anim')
def clock_fast():        # jam dinding tik-tok makin cepat
    y = Z(2.2); s = 0.0; k = 0; gap = 0.42
    while s < 2.1:
        put(y, modal([(2400 if k % 2 else 1900, 1, 0.012), (5200, 0.3, 0.005)], 0.05), s, 0.7); s += gap; gap = max(0.07, gap * 0.85); k += 1
    return verb(y, 0.2, 0.4)
@sfx('anim')
def giant_step():        # dentum langkah raksasa (tanah bergetar, ranting bergoyang)
    y = Z(2.0)
    for i in range(2):
        put(y, A(LP(wn(0.6), 90) * dec(int(SR * 0.6), 0.18) * 1.2, osc(expo(55, 35, 0.6), 0.6) * dec(int(SR * 0.6), 0.2)), i * 0.75)
        put(y, grains(0.4, 80, 800, 4000, (0.002, 0.008), (0.05, 0.2)), i * 0.75 + 0.05)
    return verb(y, 0.25, 0.8, 1500)
@sfx('anim')
def wheel_grab():        # setir direbut paksa: cengkeraman kulit berdecit + hentakan
    y = Z(1.0); put(y, creak(0.35, 500, 900, 1.2, 700, 4000) * adsr(int(SR * 0.35), 0.02, 0.1) * 0.5, 0)
    put(y, LP(wn(0.05), 600) * dec(int(SR * 0.05), 0.02), 0.34, 1.0); put(y, modal([(140, 1, 0.12), (330, 0.4, 0.06)], 0.3), 0.34, 0.5)
    put(y, BP(wn(0.25), 500, 3000) * adsr(int(SR * 0.25), 0.05, 0.15) * 0.3, 0.4); return verb(y, 0.12, 0.3)

# ================= FASE 3 (jalan basah) =================
@sfx('anim')
def car_wet():           # mobil lewat di jalan basah: desis ban di air + mesin, doppler
    d = 2.2; t = T(d); a = np.exp(-((t - 1.0) / 0.45) ** 2)
    eng = LP(osc(expo(95, 70, d), d, 'saw'), 350) * 0.3
    spray = BP(wn(d), 1500, 7000) * 0.8 + BP(wn(d), 300, 1200) * 0.3
    return (eng + spray) * a
@sfx('anim')
def crown_ding():        # mahkota logam berdenting saat dipasang
    y = Z(1.4); put(y, modal([(1480, 1, 0.5), (3540, 0.5, 0.3), (5920, 0.25, 0.15)], 1.2), 0, 0.6)
    put(y, modal([(1490, 0.5, 0.3), (3600, 0.3, 0.2)], 0.8), 0.12, 0.4); return verb(y, 0.3, 0.8)
@sfx('anim')
def balloon_deflate():   # balon mengempis pelan (udara keluar dari mulut balon, nada turun)
    d = 1.3; t = T(d); f = expo(520, 180, d) * (1 + 0.04 * np.sin(2 * np.pi * 23 * t))
    return (BP(osc(f, d, 'saw'), 150, 2000) * 0.25 + BP(wn(d), 800, 4000) * 0.3) * adsr(len(t), 0.05, 0.3) * np.linspace(1, 0.4, len(t))
@sfx('anim')
def switches_snap():     # saklar mati berurutan (6x) + patah (snap)
    y = Z(1.6)
    for i in range(6): put(y, modal([(3000 - i * 120, 1, 0.006), (5000, 0.4, 0.004)], 0.05), i * 0.15, 0.7)
    put(y, A(modal([(700, 1, 0.03), (1700, 0.6, 0.02), (3900, 0.3, 0.01)], 0.15), HP(wn(0.03), 1500) * dec(int(SR * 0.03), 0.008)), 1.05, 1.0)
    return verb(y, 0.15, 0.4)
@sfx('anim')
def red_torrent():       # arus air deras di aspal
    d = 3.2; t = T(d); y = LP(wn(d), 1200) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.9 * t)) + BP(wn(d), 1200, 5000) * 0.25
    y += grains(d, 120, 1500, 6000, (0.002, 0.006), (0.05, 0.25))
    return y * adsr(len(t), 0.3, 0.6)
@sfx('anim')
def rope_rewind():       # tali ditarik tegang (serat berderit) + rewind kaset (gulungan pita mekanis)
    y = Z(1.4); put(y, creak(0.5, 260, 420, 0.9, 400, 3500) * adsr(int(SR * 0.5), 0.05, 0.1) * 0.6, 0)
    n = 0.7; f = expo(30, 75, n); rw = BP(osc(f * 8, n, 'saw'), 300, 3000) * 0.15 + BP(wn(n), 2000, 6000) * 0.2
    put(y, rw * adsr(int(SR * n), 0.05, 0.1), 0.55); put(y, modal([(1800, 1, 0.01)], 0.05), 1.25, 0.6); return y
@sfx('anim')
def match_hiss():        # korek api digores, menyala, lalu desis/asap
    y = Z(1.4); put(y, BP(wn(0.12), 1500, 7000) * adsr(int(SR * 0.12), 0.01, 0.05) * 0.8, 0)
    put(y, LP(wn(0.15), 2500) * dec(int(SR * 0.15), 0.05) * 0.8, 0.1)
    put(y, BP(wn(1.0), 500, 3000) * adsr(int(SR * 1.0), 0.1, 0.5) * 0.25 + LP(brownn(1.0), 300) * 0.2 * adsr(int(SR * 1.0), 0.1, 0.5), 0.2)
    return y
@sfx('anim')
def scale_fall():        # timbangan logam patah & jatuh berdentang
    y = Z(1.4); put(y, A(modal([(600, 1, 0.03), (1500, 0.6, 0.02)], 0.1), HP(wn(0.02), 2000) * dec(int(SR * 0.02), 0.005)), 0)
    put(y, modal([(820, 1, 0.3), (2210, 0.6, 0.2), (3900, 0.3, 0.1)], 0.9), 0.35, 0.9); put(y, modal([(860, 0.6, 0.2), (2300, 0.3, 0.1)], 0.6), 0.55, 0.5)
    return verb(y, 0.2, 0.5)
@sfx('anim')
def lamp_buzz():         # lampu jalan berdengung & berkedip
    d = 1.4; t = T(d); g = LP((LP(R.standard_normal(len(t)), 10) > -0.3).astype(float), 60)
    return (osc(100, d) * 0.4 + osc(200, d) * 0.25 + osc(300, d) * 0.1 + BP(wn(d), 2500, 6000) * 0.08) * g * adsr(len(t), 0.05, 0.2)
@sfx('anim')
def dull_knife():        # pisau tumpul digesek (gesekan kasar tanpa dering tajam)
    d = 1.0; y = BP(wn(d), 900, 4000) * LP(np.abs(np.sin(2 * np.pi * 1.6 * T(d))), 20) * 0.7 + creak(d, 140, 180, 1.4, 300, 2500) * 0.15
    return y * adsr(int(SR * d), 0.05, 0.2)
@sfx('anim')
def papers_fly():        # kertas beterbangan tertiup angin
    d = 1.5; return grains(d, 220, 1000, 8000, (0.002, 0.01), (0.08, 0.5), lambda k: np.sin(np.pi * k)) + BP(pinkn(d), 300, 2000) * 0.35 * np.sin(np.pi * T(d) / d)
@sfx('anim')
def paper_collapse():    # kertas disobek + tumpukan kertas ambruk
    y = Z(1.8); s = 0.0
    while s < 0.45:
        put(y, BP(wn(0.012), 1500, 7000) * dec(int(SR * 0.012), 0.004) * R.uniform(0.3, 0.9), s); s += R.uniform(0.004, 0.012)
    for i in range(5): put(y, A(LP(wn(0.08), 900) * dec(int(SR * 0.08), 0.03) * 0.6, grains(0.12, 150, 1000, 6000)), 0.6 + i * 0.14)
    return y

# ================= HANCURNYA MASA DEPAN =================
@sfx('anim')
def book_slam():         # buku tebal ditutup keras
    y = Z(0.8); put(y, BP(wn(0.08), 800, 4000) * adsr(int(SR * 0.08), 0.06, 0.01) * 0.3, 0)
    put(y, LP(wn(0.05), 700) * dec(int(SR * 0.05), 0.015) * 1.2, 0.08); put(y, modal([(160, 1, 0.06), (370, 0.5, 0.03)], 0.2), 0.08, 0.6)
    return verb(y, 0.2, 0.5)
@sfx('anim')
def marker_down():       # spidol menggaris turun di whiteboard (decit spidol)
    d = 0.9; return creak(d, 1100, 650, 0.5, 900, 5000) * 0.35 * adsr(int(SR * d), 0.03, 0.15) + BP(wn(d), 3000, 8000) * 0.08 * adsr(int(SR * d), 0.03, 0.15)
@sfx('anim')
def awkward_tick():      # hening canggung: jam tik-tok pelan + dengung AC
    d = 2.4; y = LP(brownn(d), 180) * 0.25 * adsr(int(SR * d), 0.3, 0.4)
    for i in range(5): put(y, modal([(2100 if i % 2 else 1700, 1, 0.012)], 0.05), 0.2 + i * 0.5, 0.5)
    return y
@sfx('anim')
def office_hum():        # dengung ruangan kantor pelan (AC + lampu)
    d = 2.0; return (LP(brownn(d), 250) * 0.6 + osc(120, d) * 0.03 + BP(pinkn(d), 400, 1200) * 0.12) * adsr(int(SR * d), 0.4, 0.5)
@sfx('anim')
def files_pen():         # berkas ditumpuk (bertubi-tubi) + pulpen mencoret
    y = Z(2.0)
    for i in range(6): put(y, A(LP(wn(0.06), 1200) * dec(int(SR * 0.06), 0.02) * 0.7, grains(0.1, 120, 1200, 6000)), i * 0.18)
    for i in range(4): put(y, BP(wn(0.14), 2000, 7000) * np.sin(np.pi * T(0.14) / 0.14) * 0.5, 1.15 + i * 0.18)
    return y
@sfx('anim')
def lens_turn():         # ring fokus lensa diputar (klik-klik halus + gesek)
    d = 1.3; y = BP(wn(d), 1500, 5000) * 0.12 * adsr(int(SR * d), 0.1, 0.2)
    for i in range(int(d * 18)): put(y, modal([(R.uniform(3000, 3600), 1, 0.004)], 0.02), i / 18, 0.35)
    return y
@sfx('anim')
def rusty_gear():        # gear berkarat berderit berat
    d = 1.8; y = creak(d, 45, 70, 1.8, 150, 1800) * adsr(int(SR * d), 0.15, 0.4) * 0.8
    for s in (0.6, 1.3): put(y, modal([(240, 1, 0.1), (690, 0.4, 0.05)], 0.3), s, 0.4)
    return verb(y, 0.15, 0.4)
@sfx('anim')
def sign_steps():        # papan rambu logam berdecit + langkah di aspal
    y = Z(2.0); put(y, creak(0.6, 380, 300, 1.0, 500, 4000) * adsr(int(SR * 0.6), 0.05, 0.2) * 0.4, 0)
    for i in range(4): put(y, A(LP(wn(0.05), 1500) * dec(int(SR * 0.05), 0.015) * 0.6, BP(wn(0.03), 2000, 5000) * dec(int(SR * 0.03), 0.008) * 0.2), 0.75 + i * 0.3)
    return verb(y, 0.15, 0.4)
@sfx('anim')
def sand_flow():         # pasir jam pasir mengalir halus
    d = 2.2; return (grains(d, 900, 3000, 9000, (0.0005, 0.002), (0.05, 0.25)) + BP(pinkn(d), 2000, 7000) * 0.15) * adsr(int(SR * d), 0.3, 0.6)
@sfx('anim')
def candle_out():        # lilin ditiup padam: tiupan "fuh" + desis sumbu
    y = Z(1.3); n = 0.5; put(y, breath(n, 300, 2500, 0.05, 0.3), 0)
    put(y, BP(wn(0.6), 3000, 8000) * dec(int(SR * 0.6), 0.2) * 0.1, 0.35); return y
@sfx('anim')
def treadmill_steps():   # treadmill berputar + langkah di sabuk
    d = 2.0; y = LP(osc(28, d, 'saw'), 300) * 0.15 + BP(wn(d), 300, 1500) * 0.15 * (0.8 + 0.2 * np.sin(2 * np.pi * 2.8 * T(d)))
    for i in range(int(d / 0.36)): put(y, LP(wn(0.06), 700) * dec(int(SR * 0.06), 0.02) * 0.8, 0.05 + i * 0.36)
    return y * adsr(int(SR * d), 0.2, 0.4)

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
    print(', '.join(f'{k}({v[1]})' for k, v in S.items()))
