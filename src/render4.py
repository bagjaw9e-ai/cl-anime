#!/usr/bin/env python3
"""Video 4 compositor: red-neon smoke background, camera-pan transitions (incoming scene enters from the
right or left with zoom + tilt), fixed ground line, crisp CTA logo."""
import math, os, sys, subprocess, random
import numpy as np
import skia
import engine as E
from engine import C, FP, SP, clamp, sm, eio, lerp, mix
import scenes4 as S

W, H, FPS = S.W, S.H, 30
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
_surf = _small = _small2 = None

rng = np.random.default_rng(5)
NP = 110
P_BAND = rng.random(NP)                    # which band: top / bottom / sparse middle
P_X = rng.uniform(0, W, NP)
P_Y0 = np.where(P_BAND < .45, rng.uniform(0, 540, NP),
                np.where(P_BAND < .9, rng.uniform(1390, H, NP), rng.uniform(540, 1390, NP)))
P_SPD = rng.uniform(10, 34, NP)            # slow upward drift (px/s)
P_FX = rng.uniform(.08, .25, NP)
P_AMP = rng.uniform(20, 60, NP)
P_PH = rng.uniform(0, 6.28, NP)
P_R = rng.uniform(1.8, 4.2, NP)
P_KIND = rng.random(NP)


def init():
    global _surf, _small, _small2
    info = skia.ImageInfo.Make(W, H, skia.ColorType.kRGBA_8888_ColorType, skia.AlphaType.kPremul_AlphaType)
    _surf = skia.Surface.MakeRaster(info)
    si = skia.ImageInfo.Make(W // 4, H // 4, skia.ColorType.kRGBA_8888_ColorType, skia.AlphaType.kPremul_AlphaType)
    _small = skia.Surface.MakeRaster(si)
    _small2 = skia.Surface.MakeRaster(si)
    S.PMO_IMG = skia.Image.open(os.path.join(ROOT, 'assets', 'pmo_savior.png'))


def background(cv, t):
    E.background(cv, t * 2.4)                       # drifting smoke, a little livelier than video 1
    p = .5 + .5 * math.sin(t * .6)
    sh = skia.GradientShader.MakeRadial(skia.Point(W / 2 + math.sin(t * .23) * 120, S.FLOOR - 380), 760,
                                        [C(E.RED, .10 + .05 * p), C(E.RED, 0)])
    cv.drawRect(skia.Rect(0, 0, W, H), skia.Paint(Shader=sh))


def scene(cv, i, u, xoff):
    D = S.B[i + 1] - S.B[i]
    z = 1 + .035 * clamp(u / D)
    cv.save()
    cv.translate(xoff + W / 2, S.FLOOR)
    cv.scale(z, z)
    cv.translate(-W / 2, -S.FLOOR)
    S.SCENES[i](cv, u, D)
    if i == len(S.SCENES) - 1 and 'pos' in S.CTA:
        S.CTA['mat'] = cv.getTotalMatrix()
        S.CTA['alpha'] = 1.0
    cv.restore()


def cam(t):
    """returns (camera x, zoom, tilt deg, dy, transition index or None)"""
    for b in range(1, len(S.SCENES)):
        if abs(t - S.B[b]) < S.TRW / 2:
            p = (t - (S.B[b] - S.TRW / 2)) / S.TRW
            d = 1 if b % 2 == 1 else -1
            s_ = math.sin(math.pi * p)
            return eio(p) * d * W, 1 - .17 * s_, 2.5 * d * s_, -40 * s_, b
    return 0.0, 1.0, 0.0, 0.0, None


def bloom(cv, a1=.75, a2=.6):
    img = _surf.makeImageSnapshot()
    lin = skia.SamplingOptions(skia.FilterMode.kLinear)
    sc = _small.getCanvas()
    sc.clear(0)
    sc.drawImageRect(img, skia.Rect(0, 0, W // 4, H // 4), lin)
    simg = _small.makeImageSnapshot()
    for sigma, amt in ((3.0, a1), (12.0, a2)):
        s2 = _small2.getCanvas()
        s2.clear(0)
        s2.drawImage(simg, 0, 0, lin, skia.Paint(ImageFilter=skia.ImageFilters.Blur(sigma, sigma)))
        cv.drawImageRect(_small2.makeImageSnapshot(), skia.Rect(0, 0, W, H), lin,
                         skia.Paint(BlendMode=skia.BlendMode.kPlus, Color=C(E.WHT, amt)))
    sh = skia.GradientShader.MakeRadial(skia.Point(W / 2, H / 2), H * .75,
                                        [C((0, 0, 0), 0), C((0, 0, 0), 0), C((0, 0, 0), .5)], [0, .6, 1])
    cv.drawRect(skia.Rect(0, 0, W, H), skia.Paint(Shader=sh))


def frame(t):
    cv = _surf.getCanvas()
    background(cv, t)
    S.CTA.clear()
    B = S.B
    n = len(S.SCENES)
    cx, z, tilt, dy, k = cam(t)
    cv.save()
    cv.translate(W / 2, S.FLOOR - 300 + dy)
    cv.rotate(tilt)
    cv.scale(z, z)
    cv.translate(-W / 2 - cx, -(S.FLOOR - 300))
    E.floor_line(cv, S.FLOOR, 1, -2 * W, 3 * W)
    if k is None:
        i = min(max(j for j in range(n) if B[j] <= t + 1e-9), n - 1)
        scene(cv, i, t - B[i], 0)
    else:
        d = 1 if k % 2 == 1 else -1
        scene(cv, k - 1, t - B[k - 1], 0)
        scene(cv, k, t - B[k], d * W)
    cv.restore()
    fade = clamp(t / .4) * clamp((S.AUDIO_LEN - t) / .5)
    if fade < 1:
        cv.drawRect(skia.Rect(0, 0, W, H), FP((0, 0, 0), 1 - fade))
    bloom(cv)
    if 'pos' in S.CTA and 'mat' in S.CTA:
        px, py, kk, pb = S.CTA['pos']
        al = pb * S.CTA['alpha'] * fade
        cv.save()
        cv.setMatrix(S.CTA['mat'])
        cv.translate(px, py)
        cv.scale(max(kk, .001), max(kk, .001))
        scr = E.rrect(-152, -285, 304, 571, 30)
        cv.clipPath(scr, doAntiAlias=True)
        img = S.PMO_IMG
        iw, ih = img.width(), img.height()
        s_ = 304 * .9 / (iw * .37)
        dst = skia.Rect.MakeXYWH(-iw * s_ / 2, -ih * s_ / 2, iw * s_, ih * s_)
        lin = skia.SamplingOptions(skia.FilterMode.kLinear)
        cv.drawImageRect(img, dst, lin, skia.Paint(Color=C(E.WHT, .7 * al), BlendMode=skia.BlendMode.kPlus,
                                                   ImageFilter=skia.ImageFilters.Blur(10, 10)))
        cv.drawImageRect(img, dst, lin, skia.Paint(Color=C(E.WHT, al), BlendMode=skia.BlendMode.kLighten))
        cv.restore()
    arr = _surf.toarray()[:, :, :3]
    c0 = cam(t - 1 / FPS)
    sp = (cx - c0[0]) * z
    if abs(sp) > 6:
        acc = arr.astype(np.uint16)
        nb = 6
        for j in range(1, nb):
            acc += np.roll(arr, int(-sp * .8 * j / nb), axis=1)
        arr = (acc // nb).astype(np.uint8)
    return arr


def render_idx(i):
    return frame(i / FPS).tobytes()


def main():
    import multiprocessing as mp
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'build', 'v4_noaudio.mp4')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    n = int(round(S.AUDIO_LEN * FPS))
    ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
                           '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium',
                           '-crf', '17', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
    with mp.Pool(os.cpu_count(), initializer=init) as pool:
        for k, buf in enumerate(pool.imap(render_idx, range(n), chunksize=4)):
            ff.stdin.write(buf)
            if k % 300 == 0:
                print(f'frame {k}/{n}', flush=True)
    ff.stdin.close()
    ff.wait()


if __name__ == '__main__':
    main()
