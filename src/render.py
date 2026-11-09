#!/usr/bin/env python3
"""Compositor: scenes + transitions + reflection + bloom -> frames -> ffmpeg."""
import math, os, sys, subprocess
import numpy as np
import skia
import engine as E
from engine import W, H, FPS, FLOOR, C, clamp, eio, sm, prog, lerp, RED, WHT
import scenes as S

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

_surf = None
CTA_POST = []
_alpha = [1.0]
_small = None


def init():
    global _surf, _small, _small2
    info = skia.ImageInfo.Make(W, H, skia.ColorType.kRGBA_8888_ColorType, skia.AlphaType.kPremul_AlphaType)
    _surf = skia.Surface.MakeRaster(info)
    sinfo = skia.ImageInfo.Make(W // 4, H // 4, skia.ColorType.kRGBA_8888_ColorType, skia.AlphaType.kPremul_AlphaType)
    _small = skia.Surface.MakeRaster(sinfo)
    _small2 = skia.Surface.MakeRaster(sinfo)
    img = skia.Image.open(os.path.join(ROOT, 'assets', 'pmo_savior.png'))
    S.PMO_IMG = img


def draw_scene(cv, i, u):
    fn, has_floor = S.SCENES[i]
    D = S.B[i + 1] - S.B[i]
    rec = skia.PictureRecorder()
    c2 = rec.beginRecording(skia.Rect(-W, -H, 2 * W, 2 * H))
    fn(c2, u, D)
    pic = rec.finishRecordingAsPicture()
    # gentle push-in camera
    z = 1 + .045 * clamp(u / D)
    cv.save()
    cv.translate(W / 2, H * .55)
    cv.scale(z, z)
    cv.translate(-W / 2, -H * .55)
    cv.drawPicture(pic)
    if fn is S.s_cta and 'py' in S.CTA_SCREEN:
        CTA_POST.append((cv.getTotalMatrix(), S.CTA_SCREEN['py'], _alpha[-1]))
    if has_floor:
        cv.save()
        cv.clipRect(skia.Rect(-W, FLOOR + 2, 2 * W, 2 * H))
        cv.saveLayer()
        cv.save()
        cv.translate(0, 2 * FLOOR)
        cv.scale(1, -1)
        cv.drawPicture(pic)
        cv.restore()
        sh = skia.GradientShader.MakeLinear([skia.Point(0, FLOOR), skia.Point(0, FLOOR + 380)],
                                            [C(WHT, .30), C(WHT, 0)])
        cv.drawRect(skia.Rect(-W, FLOOR, 2 * W, 2 * H), skia.Paint(Shader=sh, BlendMode=skia.BlendMode.kDstIn))
        cv.restore()
        cv.restore()
    cv.restore()


def layer(cv, i, u, tf, alpha):
    """tf: (dx, dy, scale, rot)"""
    dx, dy, sc, rot = tf
    if alpha <= 0.003:
        return
    cv.saveLayerAlpha(None, int(clamp(alpha) * 255))
    _alpha.append(alpha)
    cv.translate(W / 2 + dx, H / 2 + dy)
    cv.rotate(rot)
    cv.scale(sc, sc)
    cv.translate(-W / 2, -H / 2)
    # scene drawn with its own black so it occludes the outgoing one
    cv.drawRect(skia.Rect(-W, -H, 2 * W, 2 * H), E.FP((4, 1, 2), 0))
    draw_scene(cv, i, u)
    _alpha.pop()
    cv.restore()


def shake_at(t):
    dx = dy = 0.0
    for (t0, s) in S.SHAKES:
        d = t - t0
        if 0 <= d < .6:
            k = s * math.exp(-d * 7)
            dx += math.sin(d * 83) * k
            dy += math.cos(d * 67) * k
    return dx, dy


def frame(t):
    cv = _surf.getCanvas()
    CTA_POST.clear()
    S.CTA_SCREEN.clear()
    E.background(cv, t)
    sx, sy = shake_at(t)
    cv.save()
    cv.translate(sx, sy)
    B = S.B
    n = len(S.SCENES)
    post = {}
    # locate scene / transition
    k = None
    for b in range(1, n):
        if abs(t - B[b]) < S.TR / 2:
            k = b
    if k is None:
        i = max(j for j in range(n) if B[j] <= t + 1e-9) if t >= 0 else 0
        i = min(i, n - 1)
        layer(cv, i, t - B[i], (0, 0, 1, 0), 1)
    else:
        p = (t - (B[k] - S.TR / 2)) / S.TR
        e = eio(p)
        mode = S.TRANS[k - 1]
        uo, ui = t - B[k - 1], t - B[k]
        if mode == 'fade':
            layer(cv, k - 1, uo, (0, 0, 1 + .035 * e, 0), 1 - sm(p))
            layer(cv, k, ui, (0, 0, 1.035 - .035 * e, 0), sm(p))
        elif mode == 'zoom':
            layer(cv, k - 1, uo, (0, 0, 1 + .6 * e, 0), 1 - sm(p * 1.1))
            layer(cv, k, ui, (0, 0, .7 + .3 * e, 0), sm(p * 1.2 - .1))
            post['blur'] = math.sin(p * math.pi) * .8
        elif mode == 'spin':
            layer(cv, k - 1, uo, (0, 0, 1 + .5 * e, 28 * e), 1 - sm(p))
            layer(cv, k, ui, (0, 0, .75 + .25 * e, -28 * (1 - e)), sm(p))
            post['blur'] = math.sin(p * math.pi) * .8
        elif mode == 'slide':
            layer(cv, k - 1, uo, (0, -H * e, 1, 0), 1)
            layer(cv, k, ui, (0, H * (1 - e), 1, 0), 1)
            post['vblur'] = math.sin(p * math.pi)
        elif mode == 'wipe':
            y = H * e
            cv.save()
            cv.clipRect(skia.Rect(0, y, W, H))
            layer(cv, k - 1, uo, (0, 0, 1, 0), 1)
            cv.restore()
            cv.save()
            cv.clipRect(skia.Rect(0, 0, W, y))
            E.background(cv, t)
            layer(cv, k, ui, (0, 0, 1, 0), 1)
            cv.restore()
            sh = skia.GradientShader.MakeLinear([skia.Point(0, y - 140), skia.Point(0, y)], [C(RED, 0), C(RED, .6)])
            cv.drawRect(skia.Rect(0, y - 140, W, y), skia.Paint(Shader=sh))
            cv.drawLine(-50, y, W + 50, y, E.SP(RED, 14))
            cv.drawLine(-50, y, W + 50, y, E.SP(WHT, 5))
        elif mode == 'flash':
            layer(cv, k - 1, uo, (0, 0, 1 + .15 * e, 0), 1 - sm(p))
            layer(cv, k, ui, (0, 0, 1.15 - .15 * e, 0), sm(p))
            post['flash'] = (1 - abs(p * 2 - 1)) ** 2 * .42
        elif mode == 'glitch':
            if p < .5:
                layer(cv, k - 1, uo, (0, 0, 1 + .1 * p, 0), 1)
            else:
                layer(cv, k, ui, (0, 0, 1.05 - .1 * (p - .5), 0), 1)
            post['glitch'] = 1 - abs(p * 2 - 1)
    cv.restore()
    # global flashes
    fl = post.get('flash', 0)
    for (t0, s) in S.FLASHES:
        d = t - t0
        if 0 <= d < .45:
            fl += s * math.exp(-d * 9)
    for (t0, s) in S.GLITCHES:
        d = t - t0
        if 0 <= d < s:
            post['glitch'] = max(post.get('glitch', 0), 1 - d / s)
    # fade in/out
    fade = clamp(t / .35) * clamp((S.AUDIO_LEN - t) / .45)
    if fade < 1:
        cv.drawRect(skia.Rect(0, 0, W, H), E.FP((0, 0, 0), 1 - fade))
    bloom(cv)
    for (m, py, al) in CTA_POST:
        cv.save()
        cv.setMatrix(m)
        w, h = 560, 1020
        scr = E.rrect(540 - w / 2 + w * .1, py - h / 2 + h * .08, w * .8, h * .84, w * .1)
        cv.clipPath(scr, doAntiAlias=True)
        img = S.PMO_IMG
        iw, ih = img.width(), img.height()
        sc = w * .8 * .9 / (iw * .37)
        dst = skia.Rect.MakeXYWH(540 - iw * sc / 2, py - ih * sc / 2, iw * sc, ih * sc)
        lin = skia.SamplingOptions(skia.FilterMode.kLinear)
        cv.drawImageRect(img, dst, lin, skia.Paint(Color=C(WHT, .7 * al), BlendMode=skia.BlendMode.kPlus,
                                                   ImageFilter=skia.ImageFilters.Blur(14, 14)))
        cv.drawImageRect(img, dst, lin, skia.Paint(Color=C(WHT, al), BlendMode=skia.BlendMode.kLighten))
        cv.restore()
    if fl > 0:
        cv.drawRect(skia.Rect(0, 0, W, H), E.FP((255, 40, 50), clamp(fl * .45)))
        cv.drawRect(skia.Rect(0, 0, W, H), E.FP(WHT, clamp(fl * .25)))
    arr = _surf.toarray()[:, :, :3]
    if post.get('blur', 0) > .05:
        arr = radial_blur(arr, post['blur'])
    if post.get('vblur', 0) > .05:
        arr = vblur(arr, int(post['vblur'] * 90))
    if post.get('glitch', 0) > .02:
        arr = glitch(arr, post['glitch'], t)
    return arr


def bloom(cv):
    img = _surf.makeImageSnapshot()
    sc = _small.getCanvas()
    sc.clear(0)
    sc.drawImageRect(img, skia.Rect(0, 0, W // 4, H // 4), skia.SamplingOptions(skia.FilterMode.kLinear))
    simg = _small.makeImageSnapshot()
    lin = skia.SamplingOptions(skia.FilterMode.kLinear)
    for sigma, amt in ((3.0, .95), (11.0, .85)):
        s2 = _small2.getCanvas()
        s2.clear(0)
        s2.drawImage(simg, 0, 0, lin, skia.Paint(ImageFilter=skia.ImageFilters.Blur(sigma, sigma)))
        bimg = _small2.makeImageSnapshot()
        p = skia.Paint(BlendMode=skia.BlendMode.kPlus, Color=C(WHT, amt))
        cv.drawImageRect(bimg, skia.Rect(0, 0, W, H), lin, p)
    # vignette
    sh = skia.GradientShader.MakeRadial(skia.Point(W / 2, H / 2), H * .72, [C((0, 0, 0), 0), C((0, 0, 0), 0),
                                                                          C((0, 0, 0), .55)], [0, .6, 1])
    cv.drawRect(skia.Rect(0, 0, W, H), skia.Paint(Shader=sh))


def radial_blur(arr, k):
    out = arr.astype(np.float32)
    acc = out.copy()
    n = 4
    for j in range(1, n + 1):
        s = 1 + .025 * k * j
        hh, ww = int(H / s), int(W / s)
        y0, x0 = (H - hh) // 2, (W - ww) // 2
        crop = arr[y0:y0 + hh, x0:x0 + ww]
        yi = (np.arange(H) * hh // H)
        xi = (np.arange(W) * ww // W)
        acc += crop[yi][:, xi]
    return np.clip(acc / (n + 1), 0, 255).astype(np.uint8)


def vblur(arr, r):
    if r < 2:
        return arr
    c = np.cumsum(np.pad(arr.astype(np.int32), ((r, r), (0, 0), (0, 0)), mode='edge'), axis=0)
    out = (c[2 * r:] - c[:-2 * r]) // (2 * r)
    return out[:H].astype(np.uint8)


def glitch(arr, k, t):
    rnd = np.random.default_rng(int(t * 1000))
    out = arr.copy()
    sh = int(18 * k)
    out[:, :, 0] = np.roll(arr[:, :, 0], sh, axis=1)
    out[:, :, 2] = np.roll(arr[:, :, 2], -sh, axis=1)
    for _ in range(int(10 * k)):
        y = rnd.integers(0, H - 80)
        h = rnd.integers(8, 90)
        out[y:y + h] = np.roll(out[y:y + h], rnd.integers(-80, 80), axis=1)
    return out


def worker_init():
    init()


def render_idx(i):
    return frame(i / FPS).tobytes()


def main():
    import multiprocessing as mp
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'build', 'video_noaudio.mp4')
    t0 = float(sys.argv[2]) if len(sys.argv) > 2 else 0
    t1 = float(sys.argv[3]) if len(sys.argv) > 3 else S.AUDIO_LEN
    os.makedirs(os.path.dirname(out), exist_ok=True)
    frames = range(int(round(t0 * FPS)), int(round(t1 * FPS)))
    ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
                           '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium',
                           '-crf', '17', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
    with mp.Pool(os.cpu_count(), initializer=worker_init) as pool:
        for n, buf in enumerate(pool.imap(render_idx, frames, chunksize=4)):
            ff.stdin.write(buf)
            if n % 150 == 0:
                print(f'frame {n}/{len(frames)}', flush=True)
    ff.stdin.close()
    ff.wait()


if __name__ == '__main__':
    main()
