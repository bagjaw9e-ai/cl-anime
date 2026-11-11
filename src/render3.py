#!/usr/bin/env python3
"""Video 3 compositor: persistent ember/firefly background + fixed ground line, scenes crossfade."""
import math, os, sys, subprocess, random
import numpy as np
import skia
import engine as E
from engine import C, FP, SP, clamp, sm, eio, lerp, mix
import scenes3 as S

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
    cv.clear(C(S.DARK))
    # warm haze in the middle, darker edges
    sh = skia.GradientShader.MakeRadial(skia.Point(W / 2, S.FLOOR - 300), 900,
                                        [C((38, 9, 4), 1), C((20, 5, 3), 1), C(S.DARK, 1)], [0, .5, 1])
    cv.drawRect(skia.Rect(0, 0, W, H), skia.Paint(Shader=sh))
    # slow fire tongues along the bottom edge
    for k in range(9):
        x = (k + .5) * W / 9 + math.sin(t * .4 + k) * 30
        hgt = 170 + 70 * math.sin(t * .9 + k * 1.7) + 40 * math.sin(t * 1.7 + k)
        p = skia.Path()
        p.moveTo(x - 90, H + 10)
        p.cubicTo(x - 70, H - hgt * .5, x - 10 + 20 * math.sin(t * 1.3 + k), H - hgt * .8, x, H - hgt)
        p.cubicTo(x + 10, H - hgt * .7, x + 70, H - hgt * .4, x + 90, H + 10)
        cv.drawPath(p, S.GP(S.ORG if k % 2 else S.DEEP, 1, .22, 28, fill=True))
    # fireflies / embers drifting slowly upward
    for i in range(NP):
        if P_BAND[i] < .45:
            lo, hi = 0, 540
        elif P_BAND[i] < .9:
            lo, hi = 1390, H
        else:
            lo, hi = 540, 1390
        y = lo + ((P_Y0[i] - lo - P_SPD[i] * t) % (hi - lo))
        x = P_X[i] + math.sin(t * P_FX[i] * 6.28 + P_PH[i]) * P_AMP[i]
        tw = .45 + .55 * (.5 + .5 * math.sin(t * (1.2 + P_FX[i] * 6) + P_PH[i] * 3))
        edge = min((y - lo) / 60, (hi - y) / 60, 1)
        a = tw * clamp(edge) * (.55 if P_BAND[i] >= .9 else 1)
        c = S.EMB if P_KIND[i] < .6 else (S.CORE if P_KIND[i] < .8 else S.ORG)
        S.gdot(cv, x, y, P_R[i], c, a)
    # ground line (fixed across the whole video) + faint lines below like the reference
    cv.drawLine(-50, S.FLOOR, W + 50, S.FLOOR, S.GP(S.ORG, 14, .55, 6))
    cv.drawLine(-50, S.FLOOR, W + 50, S.FLOOR, SP(S.EMB, 3.5))
    for k in range(3):
        p = skia.Path()
        y0 = S.FLOOR + 40 + k * 38
        for i in range(0, W + 41, 40):
            y = y0 + math.sin(i * .01 + k + t * .3) * 6
            (p.moveTo if i == 0 else p.lineTo)(i, y)
        cv.drawPath(p, SP(S.DEEP, 2, .35 - k * .08))


def scene(cv, i, u, alpha):
    if alpha <= .003:
        return
    D = S.B[i + 1] - S.B[i]
    z = 1 + .035 * clamp(u / D)
    cv.saveLayerAlpha(None, int(clamp(alpha) * 255))
    cv.translate(W / 2, S.FLOOR)
    cv.scale(z, z)
    cv.translate(-W / 2, -S.FLOOR)
    S.SCENES[i](cv, u, D)
    if i == len(S.SCENES) - 1 and 'pos' in S.CTA:
        S.CTA['mat'] = cv.getTotalMatrix()
        S.CTA['alpha'] = alpha
    cv.restore()


def bloom(cv, a1=.6, a2=.42):
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
    k = None
    for b in range(1, n):
        if abs(t - B[b]) < S.TR / 2:
            k = b
    if k is None:
        i = min(max(j for j in range(n) if B[j] <= t + 1e-9), n - 1)
        scene(cv, i, t - B[i], 1)
    else:
        p = (t - (B[k] - S.TR / 2)) / S.TR
        scene(cv, k - 1, t - B[k - 1], 1 - sm(p))     # crossfade
        scene(cv, k, t - B[k], sm(p))
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
    return _surf.toarray()[:, :, :3]


def render_idx(i):
    return frame(i / FPS).tobytes()


def main():
    import multiprocessing as mp
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'build', 'v3_noaudio.mp4')
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
