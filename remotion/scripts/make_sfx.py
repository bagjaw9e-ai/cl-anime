"""Sintesis 6 SFX (numpy+scipy) -> public/sfx/*.wav, level -12 LU di bawah voiceover."""
import subprocess, sys, os
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
import pyloudnorm as pyln

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'sfx')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)

def t(d): return np.arange(int(SR * d)) / SR
def env(x, a, d): # attack + exp decay
    n = len(x); tt = np.arange(n) / SR
    e = np.minimum(1, tt / max(a, 1e-4)) * np.exp(-tt / d)
    return x * e
def bp(x, lo, hi, o=4): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f, o=4): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=4): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def pad(x, d):
    y = np.zeros(int(SR * d)); y[:min(len(x), len(y))] = x[:len(y)]; return y
def at(buf, x, s):
    i = int(s * SR); buf[i:i + len(x)] += x[:len(buf) - i]
def sweep(f0, f1, d, k=4):
    tt = t(d); f = f1 + (f0 - f1) * np.exp(-tt * k)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)

def bass_hit():
    d = 1.6
    body = env(sweep(110, 34, d, 6), 0.004, 0.55)
    sub = env(np.sin(2 * np.pi * 42 * t(d)), 0.01, 0.8) * 0.6
    click = env(hp(rng.standard_normal(int(SR * d)), 2000), 0.0005, 0.012) * 0.5
    thump = env(lp(rng.standard_normal(int(SR * d)), 300), 0.002, 0.08) * 0.8
    return np.tanh(1.6 * (body + sub + click + thump))

def alert_glitch():
    d = 0.9; y = np.zeros(int(SR * d))
    for k, (s, f) in enumerate([(0, 1180), (0.16, 880), (0.32, 1180)]):
        tone = np.sign(np.sin(2 * np.pi * f * t(0.12))) * 0.5 + np.sin(2 * np.pi * f * 2 * t(0.12)) * 0.2
        at(y, env(tone, 0.003, 0.07), s)
    for s in [0.05, 0.22, 0.4, 0.47, 0.55]:
        n = rng.standard_normal(int(SR * 0.035))
        n = np.round(n * 4) / 4  # bitcrush
        at(y, bp(n, 800, 6000) * 0.8, s)
    # stutter: ulang potongan pendek
    seg = y[int(0.32 * SR):int(0.36 * SR)].copy()
    for r in range(4): at(y, seg * (0.8 - r * 0.15), 0.5 + r * 0.045)
    return lp(y, 9000)

def thud():
    d = 1.0
    body = env(sweep(85, 38, d, 10), 0.002, 0.25)
    knock = env(bp(rng.standard_normal(int(SR * d)), 120, 900), 0.001, 0.06) * 1.2
    wood = env(np.sin(2 * np.pi * 190 * t(d)) + 0.5 * np.sin(2 * np.pi * 310 * t(d)), 0.001, 0.05) * 0.4
    return np.tanh(1.8 * (body + knock + wood))

BRAKE_LEAD = 0.5
def brake_snap():
    d = 1.3; y = np.zeros(int(SR * d))
    tt = t(0.6)
    fm = 2600 + 380 * np.sin(2 * np.pi * 11 * tt) + 200 * rng.standard_normal(len(tt)).cumsum() / 400
    squeal = np.sin(2 * np.pi * np.cumsum(fm) / SR) * 0.35 + bp(rng.standard_normal(len(tt)), 1800, 4200) * 0.5
    squeal *= np.minimum(1, tt / 0.08) * np.minimum(1, (0.6 - tt) / 0.05)
    at(y, squeal, 0.0)
    crack = env(hp(rng.standard_normal(int(SR * 0.2)), 1500), 0.0003, 0.02) * 1.6
    at(y, crack, BRAKE_LEAD)
    ping = sum(np.sin(2 * np.pi * f * t(0.7)) * a for f, a in [(1430, 0.5), (2290, 0.35), (3870, 0.25), (5120, 0.15)])
    at(y, env(ping, 0.001, 0.18) * 0.6, BRAKE_LEAD)
    at(y, env(sweep(140, 50, 0.5, 12), 0.001, 0.12) * 0.7, BRAKE_LEAD)
    return np.tanh(1.3 * y)

def shimmer_rise():
    d = 1.9; y = np.zeros(int(SR * d))
    notes = [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98, 2093.0]
    for i, f in enumerate(notes):
        s = i * 0.11
        tone = np.sin(2 * np.pi * f * t(1.2)) + 0.3 * np.sin(2 * np.pi * f * 2.01 * t(1.2)) + 0.15 * np.sin(2 * np.pi * f * 3.98 * t(1.2))
        at(y, env(tone, 0.005, 0.45) * (0.32 - i * 0.02), s)
    sw = rng.standard_normal(len(y))
    tt = t(d)
    swell = bp(sw, 3000, 12000) * np.clip(tt / 1.0, 0, 1) ** 2 * np.exp(-np.maximum(0, tt - 1.0) * 3) * 0.12
    pad_ = sum(np.sin(2 * np.pi * f * tt) for f in [261.6, 329.6, 392.0]) * 0.06 * np.clip(tt / 0.6, 0, 1) * np.exp(-np.maximum(0, tt - 1.0) * 2)
    return y + swell + pad_

def chain_break():
    d = 1.4; y = np.zeros(int(SR * d))
    crack = env(hp(rng.standard_normal(int(SR * 0.25)), 1200), 0.0003, 0.03) * 1.4
    at(y, crack, 0)
    def clank(scale=1.0):
        fs = np.array([820, 1310, 2140, 3020, 4470]) * scale
        return sum(np.sin(2 * np.pi * f * t(0.5)) * a for f, a in zip(fs, [0.5, 0.4, 0.3, 0.2, 0.12]))
    at(y, env(clank(1.0), 0.0005, 0.12) * 0.9, 0.0)
    for s in sorted(rng.uniform(0.12, 0.9, 9)):
        at(y, env(clank(rng.uniform(1.1, 1.7)), 0.0005, 0.05) * rng.uniform(0.15, 0.4), s)
    at(y, env(sweep(120, 55, 0.4, 14), 0.001, 0.08) * 0.6, 0.0)
    return np.tanh(1.2 * y)

SFX = {'bass_hit': bass_hit, 'alert_glitch': alert_glitch, 'thud': thud,
       'brake_snap': brake_snap, 'shimmer_rise': shimmer_rise, 'chain_break': chain_break}

if __name__ == '__main__':
    vo = os.path.join(ROOT, 'public', 'voiceover.m4a')
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', vo, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    v = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
    meter = pyln.Meter(SR, block_size=0.2)
    vo_l = meter.integrated_loudness(v)
    target = vo_l - 12.0
    print(f'voiceover {vo_l:.1f} LUFS -> SFX target {target:.1f} LUFS')
    for name, fn in SFX.items():
        x = fn().astype(np.float64)
        fade = int(SR * 0.02); x[-fade:] *= np.linspace(1, 0, fade)
        l = meter.integrated_loudness(x)
        x = x * 10 ** ((target - l) / 20)
        pk = np.max(np.abs(x))
        if pk > 0.9: x *= 0.9 / pk
        wavfile.write(os.path.join(OUT, name + '.wav'), SR, (x * 32767).astype(np.int16))
        print(f'{name}: {len(x)/SR:.2f}s, {meter.integrated_loudness(x):.1f} LUFS')
