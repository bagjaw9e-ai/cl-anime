#!/usr/bin/env python3
"""One-shot (no cut) 3D brain video: slowly rotating realistic brain, illustrations per sentence
appear around it (left / right / top) with instant camera moves. Neon red tone, moderate glow."""
import os, sys, math, random, subprocess
import numpy as np
import skia
import engine as E
from engine import (W, H, FPS, RED, HOT, WHT, ICE, DRED, BLACK, C, SP, FP, clamp, sm, eo, eio, bo, prog, lerp, mix,
                    neon, rrect, poly, spline, circ, dot, glow_dot, radial)
import scenes as SC
import b3d_mesh as M

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
AUDIO_LEN = 83.2
BX, BY = 540, 960          # brain centre in world coords
SCALE = 3.0                # px per mm at zoom 1
LX, RX, TY = 170, 910, 620  # illustration anchor zones: left x, right x, top y

# ------------------------------------------------------------------ timeline (one beat per sentence / clause)
# (start, cam cx, cam cy, zoom, tilt deg, move type)
BEATS = [
    (0.00, 540, 960, .70, 0, 'start'),
    (0.30, 600, 950, 1.12, 0, 'zoom'),      # PFC destroyed by porn
    (3.80, 540, 875, 1.00, -8, 'tilt'),     # focus / logic / discipline
    (8.50, 655, 960, 1.06, 0, 'pan'),       # venting lust in front of a screen
    (11.10, 545, 960, 1.30, 0, 'zoom'),     # dopamine explosion
    (14.10, 470, 960, 1.10, 0, 'pan'),      # hypofrontality
    (16.80, 480, 1000, 1.16, 6, 'tilt'),    # executive paralysis
    (19.78, 540, 960, .95, 0, 'zoomout'),   # addiction (chains)
    (21.40, 520, 950, 1.22, 0, 'zoom'),     # grey matter shrinking
    (26.90, 610, 960, 1.02, 0, 'pan'),      # impulse brake fails
    (31.00, 440, 960, 1.08, 0, 'pan'),      # can't work
    (34.60, 585, 880, 1.08, -8, 'tilt'),    # concentration few minutes
    (37.70, 540, 960, .93, 0, 'zoomout'),   # instant stimulation
    (41.75, 540, 960, 1.34, 0, 'zoom'),     # structural damage
    (44.50, 430, 960, 1.08, 0, 'pan'),      # procrastination
    (46.80, 650, 980, 1.14, 0, 'pan'),      # panic
    (49.00, 540, 880, 1.02, -8, 'tilt'),    # trembling decisions
    (51.68, 650, 950, 1.04, 0, 'pan'),      # paralysed planning future
    (54.60, 450, 930, 1.05, -4, 'pan'),     # energy drained
    (57.00, 440, 975, 1.14, 0, 'zoom'),     # dirty fake illusion
    (59.24, 610, 950, 1.14, 4, 'pan'),      # shrinkage without repair
    (64.20, 540, 960, .95, 0, 'zoomout'),   # trapped forever
    (67.30, 540, 880, 1.00, -8, 'tilt'),    # thousands of plans
    (69.95, 640, 975, 1.10, 0, 'pan'),      # total failure
    (72.27, 540, 960, .88, 0, 'zoomout'),   # future shattered
    (74.45, 540, 960, 1.24, 0, 'zoom'),     # neuroplasticity
    (76.85, 700, 960, .92, 0, 'pan'),       # PMO Savior, link in bio
    (79.60, 665, 960, .97, 0, 'zoom'),      # rewire, regain control
]
BT = [b[0] for b in BEATS]
MOVE = .42


def beat_index(t):
    i = 0
    for k, b in enumerate(BEATS):
        if t >= b[0]:
            i = k
    return i


def _end_state(k, t):
    b = BEATS[k]
    return b[1], b[2], b[3] * (1 + .012 * (t - b[0])), b[4]


def cam(t):
    i = beat_index(t)
    b = BEATS[i]
    tgt = _end_state(i, t)
    if i == 0:
        return tgt
    pv = _end_state(i - 1, b[0])
    e = clamp((1 - 2 ** (-10 * clamp((t - b[0]) / MOVE))) / (1 - 2 ** -10))
    return tuple(lerp(pv[j], tgt[j], e) for j in range(4))


# ------------------------------------------------------------------ brain state over time
def env(t, a, b, fi=.4, fo=.4):
    return sm((t - a) / fi) * (1 - sm((t - b) / fo))


def state(t):
    s = {}
    s['pfc_hot'] = env(t, .6, 3.6, .8, .6) * (.75 + .25 * math.sin(t * 9))
    s['pfc_ctrl'] = env(t, 4.2, 8.2, .5, .4)
    s['reward'] = env(t, 8.7, 11.0, .3, .3) * (.6 + .4 * math.sin(t * 14))
    s['flood'] = sm((t - 11.1) / .25) * (1 - sm((t - 11.6) / 2.6))
    restore = sm((t - 74.6) / 2.2)
    s['pfc_dim'] = sm((t - 14.2) / 3.5) * .85 * (1 - restore)
    s['shrink'] = (sm((t - 21.6) / 5.0) * .55 + sm((t - 59.4) / 4.5) * .45) * (1 - restore)
    s['cracks'] = sm((t - 41.8) / 2.5) * (1 - sm((t - 72.3) / .4))
    s['amyg'] = env(t, 46.9, 49.0, .2, .3)
    s['jitter'] = env(t, 49.1, 51.6, .2, .3)
    s['freeze'] = env(t, 51.8, 54.5, .5, .5)
    s['drain'] = env(t, 54.7, 59.2, .5, .5)
    dark = (sm((t - 19.8) / 10) * .15 + sm((t - 41.8) / 8) * .15 + sm((t - 54.6) / 4) * .15
            + sm((t - 59.3) / 4) * .15)
    s['dark'] = dark * (1 - restore)
    s['cage'] = sm((t - 64.3) / 1.4) * (1 - sm((t - 72.3) / .3))
    s['cage_fly'] = prog(t, 72.3, 73.6)
    s['explode'] = eo(prog(t, 72.35, 73.3)) * (1 - eio(prog(t, 74.5, 75.9)))
    s['rewire'] = prog(t, 75.0, 79.0)
    s['heal'] = sm((t - 75.5) / 2.0)
    s['final'] = sm((t - 79.6) / 1.2)
    return s


# ------------------------------------------------------------------ mesh setup
class Brain:
    def __init__(self):
        V, F, S, P, ctr = M.load()
        self.V, self.F, self.S, self.P, self.ctr = V, F, S, P, ctr
        self.N, _ = M.vertex_normals(V, F)
        o = lambda x, y, z: np.array([x, y, z]) - ctr   # MNI coords -> centred
        y = V[:, 1] + ctr[1]
        x = V[:, 0] + ctr[0]
        z = V[:, 2] + ctr[2]
        cortex = (P == 0)
        self.w_pfc = np.clip((y - 8) / 40, 0, 1) ** 1.2 * cortex
        self.w_temp = np.clip(1 - np.linalg.norm(np.stack([np.abs(x) - 40, (y - 2) * .8, (z + 24) * 1.1], 1), axis=1)
                              / 26, 0, 1) * cortex
        self.anchor = o(0, 0, 12)
        self.pfc_pt = o(0, 52, 18)
        self.temp_pts = [o(-42, 4, -22), o(42, 4, -22)]
        self.reward_pt = o(0, 12, 2)
        k = np.clip((np.clip(S, -1.6, 1.6) + 1.6) / 3.2, 0, 1)
        self.base = np.stack([.72 - .64 * k, .075 - .065 * k, .09 - .078 * k], 1)
        self.base[P == 1] *= np.array([.85, .9, .9])
        # explode clusters (k-means on face centroids), split vertices per cluster
        rng = np.random.default_rng(3)
        fc = V[F].mean(1)
        K = 16
        cent = fc[rng.choice(len(fc), K, replace=False)]
        for _ in range(12):
            lab = np.argmin(((fc[:, None, :] - cent[None]) ** 2).sum(2), 1)
            cent = np.array([fc[lab == j].mean(0) if (lab == j).any() else cent[j] for j in range(K)])
        keys = F.ravel() * K + np.repeat(lab, 3)
        uk, inv = np.unique(keys, return_inverse=True)
        self.smap = uk // K
        self.scl = uk % K
        self.SF = inv.reshape(-1, 3)
        d = cent / (np.linalg.norm(cent, axis=1, keepdims=True) + 1e-9)
        self.cdir = d + rng.normal(0, .25, d.shape)
        self.cspin = rng.normal(0, 1, (K, 3))
        self.cent = cent
        # random-walk paths along the mesh for cracks / rewiring
        nb = M.adjacency(F, len(V))
        r = random.Random(5)

        def walks(n, L, pred):
            out = []
            cand = [i for i in range(len(V)) if pred(i)]
            for _ in range(n):
                v = r.choice(cand)
                path = [v]
                prev = -1
                for _ in range(L):
                    nx = [q for q in nb[v] if q != prev]
                    if not nx:
                        break
                    prev, v = v, r.choice(nx)
                    path.append(v)
                out.append(np.array(path))
            return out
        self.cracks = walks(45, 22, lambda i: P[i] == 0 and (self.w_pfc[i] > .2 or r.random() < .35))
        self.wires = walks(150, 26, lambda i: P[i] == 0)
        self.nodes = [i for i in range(0, len(V), 97) if self.w_pfc[i] > .5][:14]
        self.rot_cache = None

    def view(self, t, st, pitch_off=0.0):
        yaw = math.radians(YAW0 + YAW_SPEED * t)
        pitch = math.radians(-13 + pitch_off)
        R = M.rot(yaw, pitch)
        V = self.V
        sh = st['shrink']
        if sh > 0:
            w = (self.w_pfc * sh)[:, None]
            d = self.anchor - V
            V = V + d * w * np.array([.22, .38, .2])
        Vv = V @ R.T
        Nv = self.N @ R.T
        return R, V, Vv, Nv

    def project(self, Vv, jit=(0, 0)):
        f = 1 + Vv[:, 2] * .0016
        return np.stack([BX + jit[0] + Vv[:, 0] * SCALE * f, BY + jit[1] + Vv[:, 1] * SCALE * f], 1)

    def pt(self, p, R, jit=(0, 0)):
        v = R @ p
        f = 1 + v[2] * .0016
        return (BX + jit[0] + v[0] * SCALE * f, BY + jit[1] + v[1] * SCALE * f, v[2])


BR = None
YAW_SPEED = -9.0   # deg/s, slow sideways rotation for the whole video
YAW0 = 0.0


def choose_yaw():
    """pick start angle so the frontal lobe faces the camera during the PFC beats"""
    key = [1.5, 3, 6, 15, 18, 23, 25, 29, 60, 62, 76, 78, 81]
    best, by = -9, 0
    for y0 in range(0, 360, 2):
        sc = 0
        for t in key:
            a = math.radians(y0 + YAW_SPEED * t)
            front = -math.sin(a)       # depth of +y (front) direction
            side = math.cos(a)         # front pointing right on screen
            sc += min(front + .35, .6) + .25 * side
        if sc > best:
            best, by = sc, y0
    return by


# ------------------------------------------------------------------ render helpers
def brain_draw(cv, t, st, pitch_off, jit):
    B = BR
    R, Vd, Vv, Nv = B.view(t, st, pitch_off)
    base = B.base.copy()
    emis = np.zeros_like(base)
    dim = st['pfc_dim']
    if dim > 0:
        w = (B.w_pfc * dim)[:, None]
        base = base * (1 - .75 * w)                 # frontal goes dark (charred), stays red/black
    dark = st['dark']
    base *= (1 - .55 * dark)
    if st['freeze'] > 0:
        f = st['freeze']
        base = base * (1 - .6 * f)
    hot = st['pfc_hot']
    if hot > 0:
        emis += (B.w_pfc * hot)[:, None] * np.array([1.0, .3, .25]) * .75
    if st['flood'] > 0:
        fl = st['flood']
        emis += fl * np.array([.5, .16, .14]) * (.6 + .4 * np.clip(Nv[:, 2:3], 0, 1))
    if st['amyg'] > 0:
        pul = .5 + .5 * math.sin(t * 22)
        emis += (B.w_temp * st['amyg'] * pul)[:, None] * np.array([1.0, .25, .2]) * 1.2
    if st['heal'] > 0:
        emis += (B.w_pfc * st['heal'] * (.35 + .1 * math.sin(t * 4)))[:, None] * np.array([1, .14, .12])
    light = 1.0 - .3 * dark + .25 * st['final']
    rim = .5 + .15 * st['final'] - .2 * dark
    cols = M.shade(Vv, Nv, base, emis, light, rim)
    # split mesh for explosion
    ex = st['explode']
    sv = Vv[B.smap]
    if ex > 0:
        off = (B.cdir @ R.T) * ex * 70
        sv = sv + off[B.scl]
    P2 = B.project(sv, jit)
    SF = B.SF
    a, b_, c = sv[SF[:, 0]], sv[SF[:, 1]], sv[SF[:, 2]]
    fz = (b_[:, 0] - a[:, 0]) * (c[:, 1] - a[:, 1]) - (b_[:, 1] - a[:, 1]) * (c[:, 0] - a[:, 0])
    vis = SF[fz < 0]
    M.draw_mesh(cv, P2, sv[:, 2], vis, cols[B.smap])
    return R, Vd, Vv, Nv, B.project(Vv, jit)


def path_draw(cv, P2, Nv, path, frac, col, w, a, glow=False):
    n = max(2, int(len(path) * clamp(frac)))
    pts = path[:n]
    vis = Nv[pts, 2] > .12
    p = skia.Path()
    started = False
    for k, v in enumerate(pts):
        if not vis[k]:
            started = False
            continue
        x, y = P2[v]
        if not started:
            p.moveTo(x, y)
            started = True
        else:
            p.lineTo(x, y)
    if glow:
        cv.drawPath(p, SP(col, w * 3.2, a * .25))
    cv.drawPath(p, SP(col, w, a))


def additive_glow(cv, x, y, r, col, a):
    sh = skia.GradientShader.MakeRadial(skia.Point(x, y), max(r, 1), [C(col, a), C(col, a * .35), C(col, 0)],
                                        [0, .35, 1])
    cv.drawCircle(x, y, r, skia.Paint(AntiAlias=True, Shader=sh, BlendMode=skia.BlendMode.kPlus))


def win(t, a, b, fi=.28, fo=.3):
    """appear/disappear factor for illustrations"""
    return sm((t - a) / fi) * (1 - sm((t - b) / fo))


POP_IN = .34    # pop entrance duration
GLITCH_OUT = .42  # glitch exit duration


class Pop:
    """Illustration wrapper: POP entrance (scale 0 -> overshoot -> 1) and GLITCH exit
    (sliced horizontal offsets, red channel split, flicker, collapse to a line).
    world=True: draw in world coords, (x, y) is only the anchor for the animation."""

    def __init__(self, cv, x, y, t, a, b, s=1.0, world=False, pop=True, seed=None):
        self.cv, self.x, self.y, self.t, self.a, self.b, self.s = cv, x, y, t, a, b, s
        self.world, self.pop = world, pop
        self.on = a <= t < b + GLITCH_OUT
        self.seed = seed if seed is not None else int(a * 1000 + x * 7 + y * 3)

    def __enter__(self):
        if not self.on:
            return None
        self.rec = skia.PictureRecorder()
        c = self.rec.beginRecording(skia.Rect(-3000, -3000, 3000, 3000))
        if self.world:
            c.translate(-self.x, -self.y)
        return c

    def __exit__(self, *e):
        if not self.on:
            return
        pic = self.rec.finishRecordingAsPicture()
        cv, t = self.cv, self.t
        if t < self.b:
            k = bo(prog(t, self.a, self.a + POP_IN)) if self.pop else 1.0
            al = sm((t - self.a) / .1)
            if k <= .002 or al <= .003:
                return
            cv.save()
            cv.translate(self.x, self.y)
            cv.scale(k * self.s, k * self.s)
            cv.saveLayerAlpha(None, int(al * 255))
            cv.drawPicture(pic)
            cv.restore()
            cv.restore()
            return
        g = clamp((t - self.b) / GLITCH_OUT)
        rnd = random.Random(self.seed * 131 + int(t * FPS))
        if g > .12 and rnd.random() < .22 + .45 * g:
            return                                   # flicker off
        sx = 1 + .3 * g
        sy = max(1 - g ** 1.6 * .96, .03)            # collapse to a thin line
        ext = 900 if self.world else 340
        cv.save()
        cv.translate(self.x, self.y)
        cv.scale(self.s * sx, self.s * sy)
        # red split ghost
        tint = skia.Paint(ColorFilter=skia.ColorFilters.Blend(C(RED), skia.BlendMode.kSrcIn))
        tint.setAlphaf(.75 * (1 - g * .5))
        cv.saveLayer(None, tint)
        cv.translate(18 * (.4 + g) * (1 if rnd.random() < .5 else -1), 0)
        cv.drawPicture(pic)
        cv.restore()
        # sliced copy
        y = -ext
        while y < ext:
            hgt = rnd.uniform(.04, .16) * ext
            dx = 0 if rnd.random() < .45 else rnd.uniform(-1, 1) * (40 + 120 * g) * (ext / 340)
            cv.save()
            cv.clipRect(skia.Rect(-ext * 3, y, ext * 3, y + hgt))
            cv.translate(dx, 0)
            cv.drawPicture(pic)
            cv.restore()
            y += hgt
        # digital blocks
        for _ in range(int(3 + 5 * g)):
            bx, by = rnd.uniform(-170, 120), rnd.uniform(-150, 150)
            cv.drawRect(skia.Rect.MakeXYWH(bx, by, rnd.uniform(15, 90), rnd.uniform(3, 12)),
                        FP(RED if rnd.random() < .7 else BLACK, .8))
        cv.restore()


def callout(cv, p0, p1, a=1.0, prog_=1.0):
    x = lerp(p0[0], p1[0], prog_)
    y = lerp(p0[1], p1[1], prog_)
    cv.drawLine(p0[0], p0[1], x, y, SP(RED, 2.2, .7 * a))
    dot(cv, p0[0], p0[1], 5, WHT, a)
    circ(cv, p0[0], p0[1], 11, RED, 2, a * .7, None)


# ------------------------------------------------------------------ illustration primitives (local coords)
def crosshair(cv, u, a=1.0):
    circ(cv, 0, 0, 52, RED, 5, a, (20, 0, 4))
    circ(cv, 0, 0, 26, HOT, 3, a, None)
    for k in range(4):
        an = k * math.pi / 2 + u * .8
        cv.drawLine(math.cos(an) * 38, math.sin(an) * 38, math.cos(an) * 66, math.sin(an) * 66, SP(RED, 5, a))
    dot(cv, 0, 0, 7, WHT, a)


def gear(cv, u, a=1.0, r=50):
    pts = []
    for i in range(40):
        an = i / 40 * 2 * math.pi + u * .6
        rr = r if (i // 2) % 2 == 0 else r * .78
        pts.append((math.cos(an) * rr, math.sin(an) * rr))
    neon(cv, poly(pts), RED, 4.5, a, (20, 0, 4))
    circ(cv, 0, 0, r * .36, HOT, 4, a, None)
    for k in range(3):
        an = k * 2.1 + u * .6
        cv.drawLine(0, 0, math.cos(an) * r * .36, math.sin(an) * r * .36, SP(HOT, 3, a))
    dot(cv, 0, 0, 5, WHT, a)


def shield(cv, u, a=1.0):
    p = skia.Path()
    p.moveTo(0, -62)
    p.cubicTo(30, -50, 45, -48, 52, -46)
    p.cubicTo(52, 10, 35, 40, 0, 64)
    p.cubicTo(-35, 40, -52, 10, -52, -46)
    p.cubicTo(-45, -48, -30, -50, 0, -62)
    p.close()
    neon(cv, p, RED, 5, a, (20, 0, 4))
    cv.drawPath(poly([(-22, 2), (-6, 20), (24, -16)], False), SP(HOT, 6, a))


def laptop(cv, u, a=1.0, girl=False, glitch=0.0):
    neon(cv, rrect(-120, -90, 240, 160, 12), RED, 5, a, (12, 0, 3))
    neon(cv, poly([(-140, 78), (140, 78), (160, 100), (-160, 100)]), RED, 5, a)
    scr = rrect(-106, -78, 212, 136, 6)
    cv.save()
    cv.clipPath(scr, doAntiAlias=True)
    cv.drawPath(scr, FP((40, 4, 8), a))
    if girl:
        radial(cv, 0, -10, 140, RED, .6 * a)
        cv.restore()
        cv.save()
        cv.clipPath(scr, doAntiAlias=True)
        SC.screen_girl(cv, 0, -10, 175, 170, u * 1.4, HOT, (60, 0, 8), a)
    else:
        for k in range(5):
            cv.drawLine(-86, -56 + k * 22, -86 + (150 if k % 2 else 110), -56 + k * 22, SP(HOT, 4, a * .7))
    cv.restore()
    if glitch > 0:
        rnd = random.Random(int(u * 20))
        for k in range(4):
            y = rnd.uniform(-78, 58)
            cv.drawRect(skia.Rect.MakeXYWH(-106 + rnd.uniform(-20, 20), y, 212, rnd.uniform(4, 14)),
                        FP(mix(RED, WHT, rnd.random()), a * glitch * .7))


def phone_girl(cv, u, a=1.0, w=150, h=270):
    radial(cv, 0, 0, h * .9, RED, .35 * a)
    E.phone(cv, 0, 0, w, h, a, 0, 0, 1, None, .4)
    SC.screen_girl(cv, 0, 0, w, h, u * 1.3, RED, (40, 0, 6), a)


def eeg(cv, u, flat, a=1.0):
    neon(cv, rrect(-130, -80, 260, 160, 14), RED, 4, a, (12, 0, 3))
    for k in range(3):
        cv.drawLine(-120, -40 + k * 40, 120, -40 + k * 40, SP(RED, 1.2, .25 * a))
    p = skia.Path()
    for i in range(0, 241, 3):
        x = -120 + i
        f = lerp(.25, .05, flat)
        amp = 45 * (1 - flat) + 3
        y = math.sin(i * f + u * 9) * amp * (.6 + .4 * math.sin(i * .05 + u))
        (p.moveTo if i == 0 else p.lineTo)(x, y)
    cv.drawPath(p, SP(HOT, 3.5, a))


def gauge(cv, level, a=1.0, blink=1.0):
    neon(cv, rrect(-38, -150, 76, 300, 30), RED, 5, a, (12, 0, 3))
    for i in range(7):
        cv.drawLine(44, -130 + i * 43, 62, -130 + i * 43, SP(RED, 3, a))
    h = 270 * clamp(level)
    cv.drawPath(rrect(-24, 136 - h, 48, h, 16), FP(HOT if level > .45 else RED, a * blink))


def brake(cv, u, spin, crack, a=1.0):
    cv.save()
    cv.rotate(spin)
    circ(cv, 0, 0, 100, RED, 6, a, (16, 0, 3))
    circ(cv, 0, 0, 40, RED, 5, a, (30, 0, 5))
    for k in range(10):
        an = k / 10 * 2 * math.pi
        circ(cv, math.cos(an) * 72, math.sin(an) * 72, 7, HOT, 3, a, (40, 0, 6))
    for k in range(5):
        an = k / 5 * 2 * math.pi
        dot(cv, math.cos(an) * 22, math.sin(an) * 22, 5, WHT, a)
    cv.restore()
    # caliper
    cv.save()
    cv.rotate(-35 + crack * 25)
    cv.translate(crack * 26, -crack * 40)
    p = skia.Path()
    p.addArc(skia.Rect(-112, -112, 112, 112), -120, 60)
    cv.drawPath(p, SP(RED, 34, a))
    cv.drawPath(p, SP((50, 0, 8), 24, a))
    if crack > 0:
        cv.drawPath(poly([(30, -100), (40, -86), (34, -76), (46, -64)], False), SP(WHT, 3, a * crack))
    cv.restore()


def stopwatch(cv, u, level, a=1.0):
    circ(cv, 0, 0, 78, RED, 6, a, (14, 0, 3))
    neon(cv, rrect(-14, -104, 28, 22, 5), RED, 5, a)
    cv.drawLine(52, -60, 66, -74, SP(RED, 8, a))
    if level > 0:
        p = skia.Path()
        p.addArc(skia.Rect(-62, -62, 62, 62), -90, 360 * level)
        cv.drawPath(p, SP(HOT, 12, a, butt=True))
    an = -math.pi / 2 + (1 - level) * 2 * math.pi
    cv.drawLine(0, 0, math.cos(an) * 50, math.sin(an) * 50, SP(WHT, 5, a))
    dot(cv, 0, 0, 7, WHT, a)


def notif(cv, kind, a=1.0):
    neon(cv, rrect(-46, -32, 92, 64, 18), RED, 4, a, (40, 0, 6))
    if kind == 0:
        cv.drawPath(E.heart_path(0, 2, 1.3), FP(WHT, a))
    elif kind == 1:
        cv.drawPath(poly([(-10, -14), (-10, 14), (14, 0)]), FP(WHT, a))
    else:
        cv.drawPath(E.flame_path(0, 6, .2, 0), FP(WHT, a))
    dot(cv, 40, -26, 9, HOT, a)


def hourglass(cv, u, a=1.0):
    neon(cv, rrect(-80, -128, 160, 16, 6), RED, 5, a)
    neon(cv, rrect(-80, 112, 160, 16, 6), RED, 5, a)
    p = skia.Path()
    p.moveTo(-62, -112)
    p.cubicTo(-62, -40, -8, -20, -8, 0)
    p.cubicTo(-8, 20, -62, 40, -62, 112)
    p.lineTo(62, 112)
    p.cubicTo(62, 40, 8, 20, 8, 0)
    p.cubicTo(8, -20, 62, -40, 62, -112)
    p.close()
    neon(cv, p, RED, 5, a, (14, 0, 3))
    cv.drawPath(poly([(-54, -96), (54, -96), (12, -14), (-12, -14)]), FP(HOT, a * .9))   # stuck sand on top
    cv.drawPath(poly([(-30, 108), (30, 108), (0, 96)]), FP(HOT, a * .6))
    if int(u * 3) % 2 == 0:
        dot(cv, 0, 8, 3, WHT, a)


def task_cards(cv, u, n, a=1.0):
    for k in range(n):
        y = -k * 26
        neon(cv, rrect(-60, y - 16, 120, 32, 8), RED, 3.5, a, (24, 0, 4))
        cv.drawLine(-44, y, 30, y, SP(HOT, 3, a * .7))


def knot(cv, u, a=1.0):
    p = skia.Path()
    for i in range(240):
        th = i / 240 * 2 * math.pi * 3
        r = 70 + 30 * math.sin(th * 2.3 + u * 2) + 18 * math.sin(th * 5.1)
        x = math.cos(th * 1.0 + u * .6) * r
        y = math.sin(th * 1.3) * r * .85
        (p.moveTo if i == 0 else p.lineTo)(x, y)
    cv.drawPath(p, SP(RED, 4.5, a))
    cv.drawPath(p, SP(HOT, 1.6, a))


def fork(cv, u, a=1.0):
    fl = .5 + .5 * math.sin(u * 16)
    cv.drawLine(0, 70, 0, 0, SP(RED, 9, a))
    for sgn, k in ((-1, fl), (1, 1 - fl)):
        x1, y1 = sgn * 80, -60
        cv.drawLine(0, 0, x1, y1, SP(mix(RED, WHT, k), 9, a * (.4 + .6 * k)))
        ang = math.atan2(y1, x1)
        for d in (2.5, -2.5):
            cv.drawLine(x1, y1, x1 - math.cos(ang + d * .2) * 30, y1 - math.sin(ang + d * .2) * 30,
                        SP(mix(RED, WHT, k), 9, a * (.4 + .6 * k)))
    circ(cv, 0, 0, 12, WHT, 3, a, RED, .6)


def stairs(cv, u, fall, a=1.0):
    for k in range(5):
        x, y = -110 + k * 46, 80 - k * 40
        drop = clamp(fall * 6 - (4 - k)) if fall > 0 else 0
        dy = drop * drop * 300
        neon(cv, rrect(x, y + dy, 46, 40 - 0, 4), RED, 4, a * (1 - drop), (20, 0, 4))
    # flag at the top
    cv.drawLine(120, -120, 120, -40, SP(WHT, 4, a))
    cv.drawPath(poly([(120, -120), (168, -104), (120, -88)]), FP(HOT, a))


def bulb(cv, on, a=1.0, broken=0.0):
    p = skia.Path()
    p.addCircle(0, -10, 26)
    if broken < .5:
        if on > 0:
            radial(cv, 0, -10, 60, HOT, .5 * on * a)
        neon(cv, p, mix(RED, WHT, on), 4, a, (60 * on, 0, 6))
        cv.drawPath(spline([(-7, 2), (-7, -14), (0, -20), (7, -14), (7, 2)], False), SP(WHT, 2.5, a * on))
    neon(cv, rrect(-12, 14, 24, 18, 4), RED, 4, a)


def graph_crash(cv, u, k, a=1.0):
    cv.drawLine(-120, 100, 130, 100, SP(RED, 3, a))
    cv.drawLine(-120, 100, -120, -110, SP(RED, 3, a))
    pts = [(-110, 40), (-70, -10), (-40, 10), (-10, -50), (20, -70)]
    if k > 0:
        pts += [(lerp(20, 50, k), lerp(-70, 0, k)), (lerp(20, 80, k), lerp(-70, 30, k)),
                (lerp(20, 120, k), lerp(-70, 90, k))]
    cv.drawPath(poly(pts, False), SP(HOT, 6, a))
    ex, ey = pts[-1]
    px, py = pts[-2]
    ang = math.atan2(ey - py, ex - px)
    for d in (2.6, -2.6):
        cv.drawLine(ex, ey, ex - math.cos(ang + d * .2) * 26, ey - math.sin(ang + d * .2) * 26, SP(HOT, 6, a))


def calendar(cv, u, a=1.0):
    neon(cv, rrect(-90, -80, 180, 170, 12), RED, 5, a, (14, 0, 3))
    cv.drawRect(skia.Rect(-90, -80, 90, -40), FP(RED, a * .8))
    for k in (-50, 50):
        neon(cv, rrect(k - 6, -98, 12, 30, 5), WHT, 3, a, RED)
    for r in range(3):
        for c_ in range(4):
            dot(cv, -60 + c_ * 40, -10 + r * 34, 6, HOT, a * .8)
    ph = (u * 2.6) % 1
    cv.save()
    cv.translate(0, -40)
    cv.scale(1, math.cos(ph * math.pi))
    neon(cv, rrect(-90, 0, 180, 130, 10), WHT, 3, a * (1 - ph), (50, 0, 6))
    cv.restore()


# ------------------------------------------------------------------ 3D props around the brain
def ring3d(R, rx, ry, z0, n=72, tilt=0.0):
    pts = []
    for i in range(n):
        th = i / n * 2 * math.pi
        p = np.array([math.cos(th) * rx, math.sin(th) * ry, z0 + math.sin(th) * tilt])
        pts.append(p)
    return pts


def proj3(R, p, jit=(0, 0)):
    return BR.pt(p, R, jit)


def chains3d(cv, R, t, a, front, jit):
    """two tilted chain rings around the brain; front=False draws far half"""
    for k, (tilt, z0, spd) in enumerate(((25, -10, .8), (-30, 20, -.6))):
        n = 34
        for i in range(n):
            th = i / n * 2 * math.pi + t * spd
            p = np.array([math.cos(th) * 105, math.sin(th) * 118, z0 + math.sin(th) * tilt])
            x, y, d = proj3(R, p, jit)
            if (d > 0) != front:
                continue
            th2 = th + .1
            p2 = np.array([math.cos(th2) * 105, math.sin(th2) * 118, z0 + math.sin(th2) * tilt])
            x2, y2, _ = proj3(R, p2, jit)
            ang = math.degrees(math.atan2(y2 - y, x2 - x))
            cv.save()
            cv.translate(x, y)
            cv.rotate(ang)
            lk = 30
            if i % 2 == 0:
                neon(cv, rrect(-lk / 2, -lk * .28, lk, lk * .56, lk * .28), RED if front else DRED, 4.5, a, None)
            else:
                cv.drawLine(-lk / 2, 0, lk / 2, 0, SP(RED if front else DRED, 6, a))
            cv.restore()


def cage3d(cv, R, t, a, fly, front, jit):
    nb = 14
    drop = 1 - eo(clamp(a * 1.2))
    for i in range(nb):
        th = i / nb * 2 * math.pi
        top = np.array([0.0, 0.0, 120])
        pts = []
        for j in range(13):
            ph = j / 12 * math.pi
            r = math.sin(ph)
            pts.append(np.array([math.cos(th) * 92 * r, math.sin(th) * 104 * r, 92 * math.cos(ph) - 6]))
        off = np.array([math.cos(th), math.sin(th), .3]) * fly * 120
        pp = [proj3(R, p + off + np.array([0, 0, drop * 160]), jit) for p in pts]
        mid = proj3(R, np.array([math.cos(th) * 92, math.sin(th) * 104, -6]), jit)
        if (mid[2] > 0) != front:
            continue
        pth = poly([(x, y) for x, y, _ in pp], False)
        cv.drawPath(pth, SP(RED if front else DRED, 4, .75 * a * (1 - fly)))
        cv.drawPath(pth, SP(HOT if front else RED, 1.4, .7 * a * (1 - fly)))
    for z0 in (46, -46):
        ring = ring3d(R, 92 * math.sin(math.acos(z0 / 92)), 104 * math.sin(math.acos(z0 / 92)), z0 - 6)
        segs = [proj3(R, p + np.array([0, 0, drop * 160]), jit) for p in ring]
        for k in range(len(segs)):
            x, y, d = segs[k]
            x2, y2, d2 = segs[(k + 1) % len(segs)]
            if (d > 0) == front:
                cv.drawLine(x, y, x2, y2, SP(RED if front else DRED, 3.5, .7 * a * (1 - fly)))


def particles3d(cv, R, t, n, mode, a, front, jit, seed=1):
    rng = np.random.default_rng(seed)
    dirs = rng.normal(0, 1, (n, 3))
    dirs /= np.linalg.norm(dirs, axis=1, keepdims=True)
    ph = rng.random(n)
    for i in range(n):
        if mode == 'burst':
            q = clamp((t - 11.1) / 1.6 - ph[i] * .15)
            r = 30 + eo(q) * 95
            al = a * (1 - q ** 2)
        elif mode == 'rain':
            q = ((t * .7 + ph[i]) % 1)
            r = 150 - q * 80
            al = a * sm(q * 4) * (1 - q)
        else:
            continue
        p = dirs[i] * r
        x, y, d = proj3(R, p, jit)
        if (d > 0) != front:
            continue
        if i % 3 == 0:
            E.molecule(cv, x, y, .55 * (1 + d * .003), al, ang=t * 40 + i * 20)
        else:
            glow_dot(cv, x, y, 7, HOT, al)
            dot(cv, x, y, 3, WHT, al)


# ------------------------------------------------------------------ illustrations per beat
def illus_back(cv, t, st, R, jit):
    if st['cage'] > 0 or 0 < st['cage_fly'] < 1:
        cage3d(cv, R, t, max(st['cage'], 1 - st['cage_fly']), st['cage_fly'], False, jit)
    with Pop(cv, BX, BY, t, 19.9, 21.45, world=True, seed=77) as c:
        if c:
            chains3d(c, R, t, 1, False, jit)
    if 11.1 < t < 14.2:
        particles3d(cv, R, t, 70, 'burst', 1 - prog(t, 13.6, 14.2), False, jit)
        particles3d(cv, R, t, 40, 'rain', sm((t - 11.8) / .4) * (1 - prog(t, 13.6, 14.2)), False, jit, 2)
    # soft backlight behind the brain
    radial(cv, BX, BY, 520, RED, .16 + .1 * st['final'] + .1 * st['flood'])


def illus_front(cv, t, st, R, Vv, Nv, P2, jit):
    B = BR
    pfc = B.pt(B.pfc_pt, R, jit)
    rew = B.pt(B.reward_pt, R, jit)
    # region glows (moderate)
    if st['pfc_hot'] > 0:
        additive_glow(cv, pfc[0], pfc[1], 150, RED, .35 * st['pfc_hot'])
    if st['reward'] > 0:
        additive_glow(cv, rew[0], rew[1], 120, HOT, .4 * st['reward'])
    if st['amyg'] > 0:
        for tp in B.temp_pts:
            x, y, d = B.pt(tp, R, jit)
            if d > -30:
                additive_glow(cv, x, y, 90, RED, .5 * st['amyg'] * (.5 + .5 * math.sin(t * 22)))
                ph = (t * 2.5) % 1
                circ(cv, x, y, 20 + ph * 120, RED, 3, st['amyg'] * (1 - ph), None)
    # cracks
    if st['cracks'] > 0:
        for k, pth in enumerate(B.cracks):
            fr = clamp(st['cracks'] * 1.4 - (k % 7) * .06)
            path_draw(cv, P2, Nv, pth, fr, HOT, 2.6, .85)
            path_draw(cv, P2, Nv, pth, fr, (20, 0, 2), 1.1, 1)
    # rewire neural paths
    if st['rewire'] > 0:
        al = sm((st['rewire']) * 4)
        for k, pth in enumerate(B.wires):
            fr = clamp(st['rewire'] * 1.6 - (k % 10) * .06)
            if fr <= 0:
                continue
            path_draw(cv, P2, Nv, pth, fr, RED, 3.2, al * .35)
            path_draw(cv, P2, Nv, pth, fr, HOT, 1.3, al * .7)
            head = pth[max(0, int(len(pth) * fr) - 1)]
            if Nv[head, 2] > .12 and fr < 1:
                glow_dot(cv, P2[head][0], P2[head][1], 7, HOT, al)
    # front 3D props
    if st['cage'] > 0 or 0 < st['cage_fly'] < 1:
        cage3d(cv, R, t, max(st['cage'], 1 - st['cage_fly']), st['cage_fly'], True, jit)
    with Pop(cv, BX, BY, t, 19.9, 21.45, world=True, seed=77) as c:
        if c:
            chains3d(c, R, t, 1, True, jit)
    if 11.1 < t < 14.2:
        particles3d(cv, R, t, 70, 'burst', 1 - prog(t, 13.6, 14.2), True, jit)
        particles3d(cv, R, t, 40, 'rain', sm((t - 11.8) / .4) * (1 - prog(t, 13.6, 14.2)), True, jit, 2)

    # ---- beat 1: phone with dancer beams into PFC (right)
    with Pop(cv, RX, 920, t, .35, 3.85) as c:
        if c:
            phone_girl(c, t)
    with Pop(cv, RX - 70, 920, t, .45, 3.85, world=True) as c:
        if c:
            sh = skia.GradientShader.MakeLinear([skia.Point(RX - 60, 920), skia.Point(pfc[0], pfc[1])],
                                                [C(HOT, .4), C(RED, .12)])
            c.drawPath(poly([(RX - 70, 820), (RX - 70, 1020), (pfc[0], pfc[1])]), skia.Paint(AntiAlias=True, Shader=sh))
    # ---- beat 2: focus / logic / discipline linked to PFC (top arc)
    for k, (x, y, fn, t0) in enumerate(((330, 650, crosshair, 5.6), (540, 590, gear, 6.3), (750, 650, shield, 6.9))):
        snap_t = 7.6 + k * .12
        with Pop(cv, x, y + 40, t, t0, snap_t, world=True, pop=False) as c:
            if c:
                callout(c, (pfc[0], pfc[1]), (x, y + 40), 1, eo(prog(t, t0, t0 + .4)))
        with Pop(cv, x, y, t, t0, 8.45) as c:
            if c:
                fl = 1 if t < snap_t else (.3 + .7 * (int(t * 18) % 2))
                fn(c, t, fl)
    # ---- beat 3: laptop with dancer (right), reward centre pulses
    with Pop(cv, RX, 950, t, 8.55, 11.15) as c:
        if c:
            laptop(c, t, 1, girl=True)
    with Pop(cv, RX - 130, 950, t, 8.7, 11.15, world=True, pop=False) as c:
        if c:
            callout(c, (rew[0], rew[1]), (RX - 130, 950), 1, eo(prog(t, 8.7, 9.1)))
    # ---- beat 5: hypofrontality scan ring + medical icon (left)
    with Pop(cv, BX, BY, t, 14.15, 16.85, world=True) as c:
      if c:
        a = 1
        ph = (t - 14.15) / 1.3
        zc = math.cos(ph * math.pi) * 80
        ring = ring3d(R, 118 * math.sqrt(max(1 - (zc / 95) ** 2, .05)), 128 * math.sqrt(max(1 - (zc / 95) ** 2, .05)), zc)
        pts = [proj3(R, p, jit) for p in ring]
        for k in range(len(pts)):
            x, y, d = pts[k]
            x2, y2, _ = pts[(k + 1) % len(pts)]
            c.drawLine(x, y, x2, y2, SP(HOT if d > 0 else RED, 3 if d > 0 else 2, a * (.9 if d > 0 else .4)))
    with Pop(cv, LX, 960, t, 14.25, 16.85) as c:
        if c:
            E.med_cross(c, 0, 0, 1.15, 1)
            E.warn(c, 0, 150, .55, .6 + .4 * (int(t * 4) % 2))
    # ---- beat 6: EEG slowing (left) + control nodes switching off
    with Pop(cv, LX + 20, 960, t, 16.85, 19.8) as c:
        if c:
            eeg(c, t, eio(prog(t, 17.0, 19.5)))
    with Pop(cv, BX, BY, t, 16.85, 19.8, world=True, pop=False) as c:
      if c:
        a = 1
        for k, v in enumerate(B.nodes):
            if Nv[v, 2] < .15:
                continue
            off = t > 17.1 + k * .17
            x, y = P2[v]
            if not off:
                glow_dot(c, x, y, 12, HOT, a)
                dot(c, x, y, 5, HOT, a)
            else:
                circ(c, x, y, 7, DRED, 2, a, None)
    # ---- beat 8: grey matter gauge (left) + inward chevrons on PFC
    with Pop(cv, LX, 960, t, 21.5, 26.95) as c:
        if c:
            lv = 1 - .6 * eio(prog(t, 22.0, 26.5))
            gauge(c, lv)
    with Pop(cv, pfc[0], pfc[1], t, 21.6, 26.95, world=True) as c:
        if c:
            for k in range(3):
                an = -math.pi / 2 + (k - 1) * .9
                d = 120 + 25 * math.sin(t * 7)
                x, y = pfc[0] + math.cos(an) * d, pfc[1] + math.sin(an) * d
                c.save()
                c.translate(x, y)
                c.rotate(math.degrees(an) + 180)
                c.drawPath(poly([(-16, -24), (8, 0), (-16, 24)], False), SP(HOT, 6, 1))
                c.restore()
    # ---- beat 9: brake failure (right) + impulses through brain
    with Pop(cv, RX + 30, 960, t, 26.95, 31.05, .9) as c:
        if c:
            u = t - 26.95
            spin = u * 160 + max(0, u - 1.2) ** 2 * 300
            brake(c, u, spin, eo(prog(t, 28.0, 28.4)))
            if t > 28.0:
                rnd = random.Random(int(t * 30))
                for k in range(10):
                    an = rnd.uniform(-2.6, -.6)
                    r0 = 100
                    L = rnd.uniform(20, 70)
                    c.drawLine(math.cos(an) * r0, math.sin(an) * r0, math.cos(an) * (r0 + L), math.sin(an) * (r0 + L),
                               SP(RED if k % 2 else HOT, 3, 1))
    with Pop(cv, BX, BY, t, 28.1, 31.05, world=True) as cl:
      if cl:
        a = 1
        rnd = random.Random(int(t * 12))
        for k in range(3):
            x, y = BX - 240 + rnd.uniform(0, 80), BY + rnd.uniform(-150, 120)
            pts = [(x, y)]
            for j in range(9):
                x += rnd.uniform(35, 65)
                y += rnd.uniform(-40, 40)
                pts.append((x, y))
            p = poly(pts, False)
            cl.drawPath(p, SP(RED, 6, a * .5))
            cl.drawPath(p, SP(HOT, 2.4, a))
    # ---- beat 10: laptop work stuck (left)
    with Pop(cv, LX + 10, 960, t, 31.05, 34.65) as c:
        if c:
            g = prog(t, 33.0, 33.3) * (1 - prog(t, 34.2, 34.6))
            laptop(c, t, 1, girl=False, glitch=g)
            c.drawPath(rrect(-90, 112, 180, 14, 7), SP(RED, 3, 1))
            lv = min(prog(t, 31.3, 32.4) * .35, .35)
            c.drawPath(rrect(-90, 112, 180 * lv, 14, 7), FP(HOT, .5 + .5 * (int(t * 4) % 2)))
    # ---- beat 11: stopwatch draining (top right) + scattering focus
    with Pop(cv, 800, 660, t, 34.65, 37.75) as c:
        if c:
            stopwatch(c, t, 1 - eio(prog(t, 34.9, 37.2)))
    with Pop(cv, pfc[0], pfc[1], t, 34.7, 37.75, world=True) as c:
      if c:
        a = 1
        sc_ = prog(t, 35.6, 37.4)
        rnd = random.Random(4)
        for k in range(16):
            an = rnd.uniform(0, 6.28)
            d = 20 + eo(sc_) * rnd.uniform(80, 240)
            dot(c, pfc[0] + math.cos(an) * d, pfc[1] + math.sin(an) * d, 4, HOT, a * (1 - sc_ * .7))
        crosshair_a = a * (1 - sc_)
        if crosshair_a > 0:
            c.save()
            c.translate(pfc[0], pfc[1])
            c.scale(.7, .7)
            crosshair(c, t, crosshair_a)
            c.restore()
    # ---- beat 12: notifications popping around (instant stimulation)
    if 37.7 < t < 42.3:
        rnd = random.Random(7)
        for k in range(14):
            t0 = 37.85 + k * .26
            side = -1 if k % 2 == 0 else 1
            x = BX + side * rnd.uniform(270, 390)
            y = BY + rnd.uniform(-260, 260)
            with Pop(cv, x, y, t, t0, 41.8, .9) as c:
                if c:
                    notif(c, k % 3)
        with Pop(cv, BX, BY, t, 37.8, 41.8, world=True, pop=False) as c:
            if c:
                rnd2 = random.Random(int(t * 15))
                for k in range(6):
                    pth = B.wires[rnd2.randrange(len(B.wires))]
                    path_draw(c, P2, Nv, pth, 1, HOT, 1.6, .7, glow=True)
    # ---- beat 14: hourglass + piling tasks (left)
    with Pop(cv, LX + 5, 930, t, 44.55, 46.85) as c:
        if c:
            hourglass(c, t)
    with Pop(cv, LX + 10, 1130, t, 44.75, 46.85, .9) as c:
        if c:
            task_cards(c, t, 1 + int(clamp((t - 44.8) / 1.8) * 5))
    # ---- beat 15: tangled knot (right) for complex problems
    with Pop(cv, RX, 980, t, 46.85, 49.05) as c:
        if c:
            knot(c, t)
    # ---- beat 16: decision fork (top)
    with Pop(cv, BX, TY, t, 49.05, 51.72) as c:
        if c:
            fork(c, t)
    # ---- beat 17: future stairs crumbling (right)
    with Pop(cv, RX, 960, t, 51.72, 54.65) as c:
        if c:
            stairs(c, t, prog(t, 52.6, 54.2))
    # ---- beat 18: energy drain to battery (left)
    with Pop(cv, LX + 10, 900, t, 54.65, 57.05) as c:
        if c:
            E.battery(c, 0, 0, 1.0, 1 - eio(prog(t, 54.9, 56.8)) * .92, 1, 1 if int(t * 5) % 2 or t < 56 else .3)
    with Pop(cv, BX, BY, t, 54.7, 59.3, world=True, pop=False) as c:
      if c:
        a = 1
        tgt = (LX + 20, 900) if t < 57 else (LX + 30, 1000)
        rnd = random.Random(2)
        for k in range(26):
            ph = (t * .9 + k / 26) % 1
            sx_, sy_ = BX + rnd.uniform(-120, 120), BY + rnd.uniform(-120, 100)
            x = lerp(sx_, tgt[0], eio(ph))
            y = lerp(sy_, tgt[1], eio(ph)) - math.sin(ph * math.pi) * 60
            glow_dot(c, x, y, 8, HOT, a * (1 - ph * .5))
    # ---- beat 19: glitchy fake silhouette (left)
    with Pop(cv, LX + 30, 1000, t, 57.05, 59.3) as c:
        if c:
            rnd = random.Random(int(t * 24))
            for k in range(5):
                y0 = -260 + k * 70
                c.save()
                c.clipRect(skia.Rect(-200, y0, 200, y0 + 70))
                c.translate(rnd.uniform(-14, 14) if rnd.random() < .5 else 0, 0)
                E.fig(c, 0, 120, SC.fant_pose(t * 1.4, 1.2), .62, 1, 'woman', 'none', ground=130, c=HOT,
                      fill=(70, 0, 8), curvy=True)
                c.restore()
            for k in range(30):
                dot(c, rnd.uniform(-110, 110), rnd.uniform(-260, 130), 2, HOT, rnd.random() * .6)
    # ---- beat 20: calendar flipping (right), no repair
    with Pop(cv, RX, 950, t, 59.3, 64.25) as c:
        if c:
            calendar(c, t)
    # ---- beat 22: thousands of plans (bulbs)
    if 67.3 < t < 72.8:
        rnd = random.Random(9)
        for k in range(14):
            an = math.radians(-180 + (k + .5) / 14 * 180) if k % 2 == 0 else math.radians(-180 + (k + .5) / 14 * 180 + 6)
            rr = 345 if k % 2 == 0 else 285
            x = BX + math.cos(an) * rr * 1.05
            y = BY + math.sin(an) * rr * .95 + 40
            y = clamp(y, 620, 1300)
            t0 = 67.4 + k * .13
            brk = prog(t, 70.0 + (k % 6) * .1, 70.15 + (k % 6) * .1)
            fall = max(0, t - (70.15 + (k % 6) * .1))
            with Pop(cv, x, y + min(fall * 160, 90), t, t0, min(72.3, 70.9 + (k % 6) * .1), 1.25) as c:
                if c:
                    bulb(c, (.6 + .4 * math.sin(t * 6 + k)) * (1 - brk), 1, brk)
                    if brk > 0:
                        for j in range(5):
                            an2 = j * 1.25 + k
                            d = 30 + 50 * brk
                            c.drawPath(poly([(math.cos(an2) * d, math.sin(an2) * d - 10),
                                             (math.cos(an2) * d + 8, math.sin(an2) * d - 2),
                                             (math.cos(an2) * d - 3, math.sin(an2) * d + 6)]), FP(HOT, 1 - brk * .4))
    # ---- beat 23: crash graph (right)
    with Pop(cv, RX - 10, 980, t, 70.0, 72.35) as c:
        if c:
            graph_crash(c, t, eio(prog(t, 70.4, 71.4)))
    # ---- CTA: phone with PMO Savior logo (right), arrow up, tap
    if t >= 76.9:
        px, py = CTA_X, CTA_Y
        k = bo(prog(t, 76.9, 76.9 + POP_IN))
        a = sm((t - 76.9) / .1)
        radial(cv, px, py, 420, RED, .3 * a * min(k, 1))
        with Pop(cv, px, py, t, 76.9, 999) as c:
            if c:
                E.phone(c, 0, 0, CTA_W, CTA_H, 1, img='blank')
        CTA_STATE['py'] = py
        CTA_STATE['a'] = a
        CTA_STATE['k'] = k
        bounce = abs(math.sin(t * 5)) * 26
        with Pop(cv, px, py - CTA_H / 2 - 95 - bounce, t, 77.5, 999) as c:
            if c:
                E.arrow_up(c, 0, 0, .6, 1, HOT)
        ta = eio(prog(t, 77.9, 78.4)) * (1 - eio(prog(t, 79.2, 79.6)))
        if ta > 0:
            tap = prog(t, 78.45, 78.65)
            press = math.sin(tap * math.pi) * 24
            hx = lerp(px + 420, px + 60, ta) - press * .3
            hy = py + 170 + press
            SC.limb(cv, [(px + 640, py + 260), (px + 330, py + 230), (hx, hy)], 26)
            circ(cv, hx, hy, 22, RED, 5)
            tr = prog(t, 78.55, 79.3)
            if 0 < tr < 1:
                for r in range(3):
                    q = clamp(tr * 1.3 - r * .15)
                    circ(cv, hx, hy, 16 + q * 150, HOT, 4, 1 - q, None)
    # ---- final: lightning connecting phone to brain
    with Pop(cv, CTA_X - CTA_W / 2, CTA_Y, t, 79.65, 999, world=True) as cl:
      if cl:
        a = 1
        rnd = random.Random(int(t * 14))
        for k in range(3):
            x0, y0 = CTA_X - CTA_W / 2, CTA_Y + rnd.uniform(-160, 160)
            pts = [(x0, y0)]
            n = 8
            for j in range(1, n + 1):
                q = j / n
                pts.append((lerp(x0, pfc[0], q) + rnd.uniform(-18, 18),
                            lerp(y0, pfc[1], q) + rnd.uniform(-30, 30)))
            p = poly(pts, False)
            cl.drawPath(p, SP(RED, 6, a * .5))
            cl.drawPath(p, SP(HOT, 2.2, a))
    if t > 79.65:
        additive_glow(cv, pfc[0], pfc[1], 160, RED, .35 * sm((t - 79.65) / .3))


CTA_X, CTA_Y, CTA_W, CTA_H = 905, 960, 300, 540
CTA_STATE = {}


def jitter(t, st):
    j = st['jitter']
    if j <= 0:
        return (0, 0)
    return (math.sin(t * 91) * 7 * j, math.cos(t * 77) * 5 * j)


SHAKES = [(11.1, 14), (28.0, 10), (46.85, 8), (72.3, 18), (74.5, 6)]


def cam_shake(t):
    dx = dy = 0.0
    for t0, s in SHAKES:
        d = t - t0
        if 0 <= d < .7:
            k = s * math.exp(-d * 6)
            dx += math.sin(d * 83) * k
            dy += math.cos(d * 61) * k
    return dx, dy


# ------------------------------------------------------------------ frame compositor
_surf = _small = _small2 = None
PMO = None


def init():
    global _surf, _small, _small2, BR, PMO, YAW0
    info = skia.ImageInfo.Make(W, H, skia.ColorType.kRGBA_8888_ColorType, skia.AlphaType.kPremul_AlphaType)
    _surf = skia.Surface.MakeRaster(info)
    si = skia.ImageInfo.Make(W // 4, H // 4, skia.ColorType.kRGBA_8888_ColorType, skia.AlphaType.kPremul_AlphaType)
    _small = skia.Surface.MakeRaster(si)
    _small2 = skia.Surface.MakeRaster(si)
    BR = Brain()
    YAW0 = choose_yaw()
    PMO = skia.Image.open(os.path.join(ROOT, 'assets', 'pmo_savior.png'))


def bloom(cv, amt1=.55, amt2=.42):
    img = _surf.makeImageSnapshot()
    sc = _small.getCanvas()
    sc.clear(0)
    lin = skia.SamplingOptions(skia.FilterMode.kLinear)
    sc.drawImageRect(img, skia.Rect(0, 0, W // 4, H // 4), lin)
    simg = _small.makeImageSnapshot()
    for sigma, amt in ((3.0, amt1), (11.0, amt2)):
        s2 = _small2.getCanvas()
        s2.clear(0)
        s2.drawImage(simg, 0, 0, lin, skia.Paint(ImageFilter=skia.ImageFilters.Blur(sigma, sigma)))
        cv.drawImageRect(_small2.makeImageSnapshot(), skia.Rect(0, 0, W, H), lin,
                         skia.Paint(BlendMode=skia.BlendMode.kPlus, Color=C(WHT, amt)))
    sh = skia.GradientShader.MakeRadial(skia.Point(W / 2, H / 2), H * .72,
                                        [C(BLACK, 0), C(BLACK, 0), C(BLACK, .6)], [0, .55, 1])
    cv.drawRect(skia.Rect(0, 0, W, H), skia.Paint(Shader=sh))


def frame(t):
    cv = _surf.getCanvas()
    E.background(cv, t)
    cx, cy, z, tilt = cam(t)
    sx, sy = cam_shake(t)
    st = state(t)
    jit = jitter(t, st)
    CTA_STATE.clear()
    cv.save()
    cv.translate(W / 2 + sx, H / 2 + sy)
    cv.scale(z, z)
    cv.translate(-cx, -cy)
    R = M.rot(math.radians(YAW0 + YAW_SPEED * t), math.radians(-13 + tilt))
    illus_back(cv, t, st, R, jit)
    R, Vd, Vv, Nv, P2 = brain_draw(cv, t, st, tilt, jit)
    illus_front(cv, t, st, R, Vv, Nv, P2, jit)
    mat = cv.getTotalMatrix()
    cv.restore()
    fade = clamp(t / .4) * clamp((AUDIO_LEN - t) / .5)
    if fade < 1:
        cv.drawRect(skia.Rect(0, 0, W, H), FP(BLACK, 1 - fade))
    bloom(cv)
    # crisp CTA logo after bloom
    if 'py' in CTA_STATE:
        cv.save()
        cv.setMatrix(mat)
        py, al = CTA_STATE['py'], CTA_STATE['a'] * fade
        kk = max(min(CTA_STATE['k'], 1.2), .001)
        cv.translate(CTA_X, py)
        cv.scale(kk, kk)
        cv.translate(-CTA_X, -py)
        w, h = CTA_W, CTA_H
        scr = rrect(CTA_X - w / 2 + w * .1, py - h / 2 + h * .08, w * .8, h * .84, w * .1)
        cv.clipPath(scr, doAntiAlias=True)
        iw, ih = PMO.width(), PMO.height()
        s_ = w * .8 * .9 / (iw * .37)
        dst = skia.Rect.MakeXYWH(CTA_X - iw * s_ / 2, py - ih * s_ / 2, iw * s_, ih * s_)
        lin = skia.SamplingOptions(skia.FilterMode.kLinear)
        cv.drawImageRect(PMO, dst, lin, skia.Paint(Color=C(WHT, .7 * al), BlendMode=skia.BlendMode.kPlus,
                                                   ImageFilter=skia.ImageFilters.Blur(10, 10)))
        cv.drawImageRect(PMO, dst, lin, skia.Paint(Color=C(WHT, al), BlendMode=skia.BlendMode.kLighten))
        cv.restore()
    arr = _surf.toarray()[:, :, :3]
    # motion blur during instant camera moves
    c0 = cam(t - 1 / FPS)
    dxs = (cx - c0[0]) * z
    dys = (cy - c0[1]) * z
    dzr = (z - c0[2]) / z
    sp = math.hypot(dxs, dys)
    if sp > 6:
        arr = dir_blur(arr, -dxs * .9, -dys * .9)
    if abs(dzr) > .012:
        arr = zoom_blur(arr, min(abs(dzr) * 12, 1.2))
    return arr


def dir_blur(arr, dx, dy, n=6):
    acc = arr.astype(np.uint16)
    for k in range(1, n):
        acc += np.roll(np.roll(arr, int(dx * k / n), axis=1), int(dy * k / n), axis=0)
    return (acc // n).astype(np.uint8)


def zoom_blur(arr, k):
    acc = arr.astype(np.float32)
    n = 4
    for j in range(1, n + 1):
        s = 1 + .02 * k * j
        hh, ww = int(H / s), int(W / s)
        y0, x0 = (H - hh) // 2, (W - ww) // 2
        crop = arr[y0:y0 + hh, x0:x0 + ww]
        acc += crop[(np.arange(H) * hh // H)][:, (np.arange(W) * ww // W)]
    return np.clip(acc / (n + 1), 0, 255).astype(np.uint8)


def render_idx(i):
    return frame(i / FPS).tobytes()


def main():
    import multiprocessing as mp
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'build', 'b3d_noaudio.mp4')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    n = int(round(AUDIO_LEN * FPS))
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
