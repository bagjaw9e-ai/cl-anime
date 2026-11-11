"""Video 3: faceless glowing stickmen (warm orange neon, reference lv_0_20261111214604.mp4).
One scene per sentence; illustrations stay in the middle band, ground line fixed at FLOOR."""
import math, random
import numpy as np
import skia
import engine as E
from engine import (C, SP, FP, clamp, sm, eo, ei, eio, bo, prog, lerp, mix, rrect, poly, spline, noise1)

W, H = 1080, 1920
FLOOR = 1330
CORE = (255, 238, 215)
ORG = (255, 105, 55)
DEEP = (190, 40, 22)
EMB = (255, 150, 80)
DARK = (14, 3, 3)

AUDIO_LEN = 74.97
B = [0.0, 6.54, 13.55, 22.91, 28.60, 34.80, 41.23, 50.48, 54.22, 60.23, 65.67, AUDIO_LEN]
TR = 0.6
PMO_IMG = None
CTA = {}


# ------------------------------------------------------------------ glow primitives
def GP(c=ORG, w=20, a=.6, sigma=8.0, fill=False):
    p = skia.Paint(AntiAlias=True, Color=C(c, a), StrokeWidth=w,
                   Style=skia.Paint.kFill_Style if fill else skia.Paint.kStroke_Style,
                   StrokeCap=skia.Paint.kRound_Cap, StrokeJoin=skia.Paint.kRound_Join)
    p.setMaskFilter(skia.MaskFilter.MakeBlur(skia.kNormal_BlurStyle, sigma))
    return p


def gl(cv, path, w=5, a=1.0, core=CORE, glow=ORG, ga=.6):
    if a <= 0:
        return
    cv.drawPath(path, GP(glow, w * 2.6 + 10, ga * a, 7))
    cv.drawPath(path, SP(core, w, a))


def gline(cv, x1, y1, x2, y2, w=5, a=1.0, core=CORE, glow=ORG):
    gl(cv, poly([(x1, y1), (x2, y2)], False), w, a, core, glow)


def gfill(cv, path, col=DEEP, a=1.0, edge=ORG, w=4):
    cv.drawPath(path, GP(col, 1, .5 * a, 12, fill=True))
    cv.drawPath(path, FP(col, a))
    if w > 0:
        cv.drawPath(path, SP(edge, w, a))


def gdot(cv, x, y, r, c=CORE, a=1.0, glow=ORG):
    cv.drawCircle(x, y, r * 2.2, GP(glow, 1, .55 * a, r * .9 + 2, fill=True))
    cv.drawCircle(x, y, r, FP(c, a))


def gcirc(cv, x, y, r, w=5, a=1.0, core=CORE, glow=ORG):
    p = skia.Path()
    p.addCircle(x, y, max(r, .5))
    gl(cv, p, w, a, core, glow)


def sparkle(cv, x, y, r, a=1.0, c=EMB):
    gline(cv, x - r, y - r, x + r, y + r, 3, a, c, ORG)
    gline(cv, x - r, y + r, x + r, y - r, 3, a, c, ORG)


def rays(cv, x, y, r0, r1, n=18, a=1.0, rot=0.0):
    for i in range(n):
        an = i / n * 2 * math.pi + rot
        cv.drawLine(x + math.cos(an) * r0, y + math.sin(an) * r0, x + math.cos(an) * r1, y + math.sin(an) * r1,
                    GP(DEEP, 4, .55 * a, 2))


# ------------------------------------------------------------------ faceless glowing stickman
def stick(cv, x, y, pose, s=1.0, f=1, kind='man', ground=FLOOR, a=1.0, core=CORE, glow=ORG, child=False,
          head_col=None):
    J = E.joints(x, y, pose, s, f)
    lw = (15 if kind == 'man' else 13) * s
    if ground is not None:
        ys = [J['an1'][1], J['an2'][1], J['kn1'][1], J['kn2'][1], J['hip'][1], J['ha1'][1], J['ha2'][1],
              J['head'][1] + J['R'] * .85]
        J = E.joints(x, y + ground - max(ys) - lw * .5, pose, s, f)
    if a < 1:
        cv.saveLayerAlpha(None, int(clamp(a) * 255))
    lines = []
    for i in ('1', '2'):
        lines.append(([J['hip'], J['kn' + i], J['an' + i], J['ft' + i]], lw))
        lines.append(([J['sh'], J['el' + i], J['ha' + i]], lw * .9))
    lines.append(([J['hip'], J['neck']], lw * 1.1))
    R = J['R'] * .82
    hx, hy = J['head']
    hair = dress = None
    if kind == 'woman':
        hair = spline([E.hp(J, .5, .7), E.hp(J, 0, 1.05), E.hp(J, -.7, .85), E.hp(J, -1.08, 0), E.hp(J, -1.1, -1.2),
                       E.hp(J, -.8, -1.75), E.hp(J, -.35, -1.5), E.hp(J, -.05, -.6)])
        up = J['up']
        un = (-up[1], up[0])
        hip = J['hip']
        mk = ((J['kn1'][0] + J['kn2'][0]) / 2, (J['kn1'][1] + J['kn2'][1]) / 2)
        dv = (mk[0] - hip[0], mk[1] - hip[1])
        dl = math.hypot(*dv) + 1e-6
        dv = (dv[0] / dl, dv[1] / dl)
        nv = (-dv[1], dv[0])
        ch = E.add(hip, up, E.LEN['T'] * s * .78)
        bot = E.add(hip, dv, E.LEN['TH'] * s * .8)
        dress = poly([E.add(ch, un, 12 * s), E.add(bot, nv, 60 * s), E.add(bot, nv, -60 * s), E.add(ch, un, -12 * s)])
    # glow pass
    for pts, w in lines:
        cv.drawPath(poly(pts, False), GP(glow, w * 2.4 + 12, .55, 9))
    if hair is not None:
        cv.drawPath(hair, GP(glow, 1, .6, 10, fill=True))
    cv.drawCircle(hx, hy, R * 1.9, GP(glow, 1, .6, R * .7, fill=True))
    # core pass
    if hair is not None:
        cv.drawPath(hair, FP(DEEP))
        cv.drawPath(hair, SP(ORG, 3.5 * s))
    for pts, w in lines:
        cv.drawPath(poly(pts, False), SP(core, w))
    if dress is not None:
        cv.drawPath(dress, FP(DEEP))
        cv.drawPath(dress, SP(ORG, 4 * s))
    cv.drawCircle(hx, hy, R, FP(head_col or core))
    if a < 1:
        cv.restore()
    J['Rh'] = R
    return J


STAND = dict(E.STAND)


def walk(u, speed=6.0, amp=22):
    ph = u * speed
    sn = math.sin(ph)
    return dict(h1=amp * sn, k1=amp * sn - max(0, -math.cos(ph)) * 30, h2=-amp * sn,
                k2=-amp * sn - max(0, math.cos(ph)) * 30, a1=-amp * .8 * sn, f1=-amp * .6 * sn + 10,
                a2=amp * .8 * sn, f2=amp * .6 * sn + 10)


# ------------------------------------------------------------------ props (line art)
def ring(cv, x, y, r, a=1.0):
    gcirc(cv, x, y, r, 7, a)


def heart(cv, x, y, s, a=1.0, crack=0.0, dim=0.0, fill=True):
    p = E.heart_path(x, y, s)
    if fill:
        gfill(cv, p, mix(DEEP, (40, 8, 5), dim), a, mix(ORG, (90, 30, 20), dim), 0)
    gl(cv, p, 5, a, mix(CORE, (120, 50, 35), dim), mix(ORG, DEEP, dim))
    if crack > 0:
        pts = [(x, y - 9 * s), (x - 3 * s, y - 3 * s), (x + 3 * s, y + 2 * s), (x - 2 * s, y + 7 * s), (x, y + 12 * s)]
        n = max(2, int(len(pts) * crack + .99))
        cv.drawPath(poly(pts[:n], False), SP(DARK, 6, a))


def house(cv, x, y, s=1.0, a=1.0, win=1.0, burn=0.0):
    pts = [(x - 120 * s, y), (x - 120 * s, y - 150 * s), (x - 140 * s, y - 150 * s), (x, y - 260 * s),
           (x + 140 * s, y - 150 * s), (x + 120 * s, y - 150 * s), (x + 120 * s, y)]
    gl(cv, poly(pts, False), 5, a)
    for dx in (-60, 20):
        r = rrect(x + dx * s, y - 120 * s, 44 * s, 44 * s, 4)
        cv.drawPath(r, FP(mix(DEEP, ORG, win * .6), a * (.5 + .5 * win)))
        gl(cv, r, 4, a)
    gl(cv, rrect(x - 20 * s, y - 70 * s, 40 * s, 70 * s, 3), 4, a)


def car(cv, x, y, s=1.0, a=1.0):
    p = skia.Path()
    p.moveTo(x - 110 * s, y - 20 * s)
    p.lineTo(x - 110 * s, y - 50 * s)
    p.lineTo(x - 60 * s, y - 55 * s)
    p.lineTo(x - 30 * s, y - 90 * s)
    p.lineTo(x + 40 * s, y - 90 * s)
    p.lineTo(x + 75 * s, y - 55 * s)
    p.lineTo(x + 110 * s, y - 48 * s)
    p.lineTo(x + 110 * s, y - 20 * s)
    gl(cv, p, 4.5, a)
    for dx in (-60, 62):
        gcirc(cv, x + dx * s, y - 18 * s, 18 * s, 4.5, a)


def phone3(cv, x, y, w, h, a=1.0, scr=1.0, ang=0.0, girl=False, u=0.0, glitch=0.0):
    cv.save()
    cv.translate(x, y)
    cv.rotate(ang)
    if scr > 0:
        cv.drawCircle(0, 0, h * 1.1, GP(ORG, 1, .35 * a * scr, h * .4, fill=True))
    body = rrect(-w / 2, -h / 2, w, h, w * .16)
    cv.drawPath(body, FP(DARK, a))
    gl(cv, body, max(w * .05, 3), a)
    sc = rrect(-w * .4, -h * .42, w * .8, h * .84, w * .08)
    cv.drawPath(sc, FP(mix(DEEP, CORE, .55 * scr), a))
    if girl:
        cv.save()
        cv.clipPath(sc, doAntiAlias=True)
        s_ = h * .8 / 600
        E.fig(cv, -6 * s_, 0, sexy_pose(u), s_, 1, 'woman', 'none', ground=h * .41, c=DEEP, fill=(70, 12, 6),
              curvy=2, a=a)
        if glitch > 0:
            rnd = random.Random(int(u * 24))
            for k in range(5):
                yy = rnd.uniform(-h * .4, h * .4)
                cv.drawRect(skia.Rect.MakeXYWH(-w * .4, yy, w * .8, rnd.uniform(3, 12)), FP(mix(ORG, CORE, rnd.random()),
                                                                                          a * glitch))
        cv.restore()
    cv.restore()


SEXY = [dict(t=-8, hd=-10, a1=160, f1=265, a2=-35, f2=40, h1=-3, k1=4, h2=16, k2=-8),
        dict(t=-14, hd=-16, a1=165, f1=268, a2=172, f2=262, h1=-6, k1=2, h2=14, k2=-10),
        dict(t=-10, hd=-15, a1=165, f1=268, a2=-30, f2=30, h1=5, k1=-95, h2=-5, k2=-90)]


def sexy_pose(u, idx=None):
    i = int(u / .8) % len(SEXY) if idx is None else idx
    sw = math.sin(u * 3.2)
    p = dict(SEXY[i])
    p['t'] += 6 * sw
    p['hd'] -= 5 * sw
    if p['k1'] > -50:
        p['h1'] -= 6 * sw
        p['h2'] += 5 * sw
    return p


def illusion(cv, x, ground, s, u, a=1.0, ghosts=True):
    """glowing curvy bikini silhouette (explicit but SFW)"""
    cv.drawCircle(x, ground - 260 * s, 260 * s, GP(ORG, 1, .25 * a, 80 * s, fill=True))
    for gx, ga in (((-40, .3), (40, .3), (0, 1)) if ghosts else ((0, 1),)):
        E.fig(cv, x + gx * s, ground - 100, sexy_pose(u + gx * .01), s, 1, 'woman', 'none', ground=ground, c=EMB,
              fill=(80, 16, 8), curvy=2, a=a * ga)


def lips(cv, x, y, s=1.0, a=1.0):
    cv.save()
    cv.translate(x, y)
    up = skia.Path()
    up.moveTo(-48 * s, 0)
    up.cubicTo(-30 * s, -26 * s, -12 * s, -24 * s, 0, -12 * s)
    up.cubicTo(12 * s, -24 * s, 30 * s, -26 * s, 48 * s, 0)
    up.cubicTo(20 * s, 6 * s, -20 * s, 6 * s, -48 * s, 0)
    lo = skia.Path()
    lo.moveTo(-48 * s, 2 * s)
    lo.cubicTo(-20 * s, 10 * s, 20 * s, 10 * s, 48 * s, 2 * s)
    lo.cubicTo(30 * s, 34 * s, -30 * s, 34 * s, -48 * s, 2 * s)
    gfill(cv, up, DEEP, a, ORG, 3)
    gfill(cv, lo, DEEP, a, ORG, 3)
    cv.restore()


def tissues(cv, x, y, s=1.0, a=1.0):
    cv.save()
    cv.translate(x, y)
    cv.scale(s, s)
    gl(cv, rrect(-62, -48, 124, 48, 8), 4, a)
    gl(cv, spline([(-26, -46), (-36, -68), (-22, -90), (0, -82), (20, -98), (38, -76), (30, -46)], tension=.8), 3.5, a)
    for k in range(3):
        cx, cy = -110 + k * 90 + (k % 2) * 14, -14 + (k % 2) * 4
        pts = [(cx + math.cos(j * .9) * (17 + (j % 3) * 5), cy + math.sin(j * .9) * (13 + (j % 2) * 5)) for j in range(7)]
        gl(cv, spline(pts), 3, a)
    cv.restore()


def chain3(cv, p0, p1, a=1.0, link=28, sag=0.0):
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]
    L = math.hypot(dx, dy)
    n = max(int(L / (link * .8)), 1)
    ang = math.degrees(math.atan2(dy, dx))
    for i in range(n):
        t = (i + .5) / n
        cv.save()
        cv.translate(p0[0] + dx * t, p0[1] + dy * t + math.sin(math.pi * t) * sag)
        cv.rotate(ang)
        if i % 2 == 0:
            gl(cv, rrect(-link / 2, -link * .28, link, link * .56, link * .28), 3.5, a)
        else:
            gline(cv, -link / 2, 0, link / 2, 0, 4, a)
        cv.restore()


def bolt(cv, x0, y0, x1, y1, seed, a=1.0, w=4, jag=26):
    rnd = random.Random(seed)
    pts = [(x0, y0)]
    n = 7
    for j in range(1, n):
        q = j / n
        pts.append((lerp(x0, x1, q) + rnd.uniform(-jag, jag), lerp(y0, y1, q) + rnd.uniform(-jag, jag)))
    pts.append((x1, y1))
    gl(cv, poly(pts, False), w, a, CORE, ORG)


def scribble(cv, x, y, r, u, a=1.0, seed=0):
    rnd = random.Random(seed)
    p = skia.Path()
    for i in range(40):
        th = i * .7 + u * 3
        rr = r * (.5 + .5 * rnd.random())
        px, py = x + math.cos(th) * rr, y + math.sin(th) * rr * .6
        (p.moveTo if i == 0 else p.lineTo)(px, py)
    gl(cv, p, 3, a, EMB, DEEP)


def flame(cv, x, y, s, u, a=1.0):
    cv.drawCircle(x, y - 90 * s, 160 * s, GP(ORG, 1, .45 * a, 50 * s, fill=True))
    gfill(cv, E.flame_path(x, y, 1.5 * s, u, 1.1), DEEP, a, ORG, 5)
    gfill(cv, E.flame_path(x, y + 10 * s, .9 * s, u + 2, 1), ORG, a, EMB, 4)
    gfill(cv, E.flame_path(x, y + 18 * s, .45 * s, u + 4, 1), CORE, a, CORE, 0)


def brain_bubble(cv, x, y, r, u, a=1.0, shrink=0.0, frost=0.0, rewire=-1.0, crack=0.0):
    """circle bubble with a circuit-brain inside (like the reference)"""
    cv.drawCircle(x, y, r * 1.05, GP(ORG, 1, .25 * a, r * .3, fill=True))
    cv.drawCircle(x, y, r, FP(DARK, a))
    gcirc(cv, x, y, r, 6, a)
    rnd = random.Random(31)
    cv.save()
    cv.clipPath(_circle(x, y, r - 6), doAntiAlias=True)
    for k in range(26):
        sx, sy = rnd.uniform(-.75, .75) * r, rnd.uniform(-.7, .7) * r
        if sx * sx + sy * sy > (r * .78) ** 2:
            continue
        front = sx > r * .15                       # prefrontal side (right)
        sc = 1 - shrink * .55 if front else 1
        pts = [(x + sx * sc, y + sy * sc)]
        cx_, cy_ = sx, sy
        for j in range(3):
            if j % 2 == 0:
                cx_ += rnd.choice((-1, 1)) * rnd.uniform(20, 55)
            else:
                cy_ += rnd.choice((-1, 1)) * rnd.uniform(20, 55)
            pts.append((x + cx_ * sc, y + cy_ * sc))
        alive = 1.0
        if front and shrink > 0:
            alive = 1 - shrink * .75
        if frost > 0:
            alive *= 1 - frost * .6
        col = mix(CORE, (200, 215, 230), frost * .7)
        if rewire >= 0:
            q = clamp(rewire * 1.4 - k / 26 * .4)
            alive = q
            col = CORE
        gl(cv, poly(pts, False), 3.5, a * alive, col, ORG if frost < .5 else (120, 140, 170))
        gdot(cv, *pts[-1], 5, col, a * alive)
    if crack > 0:
        p = [(x, y - r), (x - 20, y - r * .5), (x + 25, y - r * .1), (x - 10, y + r * .3), (x + 15, y + r * .7),
             (x, y + r)]
        n = max(2, int(len(p) * crack + .99))
        gl(cv, poly(p[:n], False), 4, a, CORE, ORG)
    if frost > 0:
        for k in range(10):
            an = k / 10 * 2 * math.pi
            L = frost * r * .55
            px, py = x + math.cos(an) * r, y + math.sin(an) * r
            gl(cv, poly([(px, py), (px - math.cos(an) * L, py - math.sin(an) * L)], False), 2.5, a * frost,
               (220, 235, 255), (120, 150, 190))
    cv.restore()


def _circle(x, y, r):
    p = skia.Path()
    p.addCircle(x, y, r)
    return p


def crown(cv, x, y, s, a=1.0):
    gfill(cv, E.crown_path(x, y, s), DEEP, a, ORG, 0)
    gl(cv, E.crown_path(x, y, s), 4.5, a)


# ------------------------------------------------------------------ scenes
def s1_wedding(cv, u, D):
    """marrying a porn-addicted man slowly destroys the wife inside"""
    rays(cv, 540, 640, 100, 360, 20, .35 * sm(u / .6), u * .05)
    ring(cv, 505, 640, 42, sm(u / .5))
    ring(cv, 575, 640, 42, sm((u - .2) / .5))
    sparkle(cv, 640, 700, 12, .7 + .3 * math.sin(u * 4))
    sparkle(cv, 430, 720, 9, .7 + .3 * math.sin(u * 5 + 1))
    hold = 1 - eio(prog(u, 2.6, 3.6))
    mp = dict(STAND, a2=lerp(-10, 45, hold), f2=lerp(-5, 40, hold), a1=60, f1=150, hd=lerp(0, 22, prog(u, 2.6, 3.4)))
    J = stick(cv, 650, 0, mp, .92, -1, 'man')
    # phone with a curvy silhouette in his other hand
    ph = J['ha1']
    phone3(cv, ph[0] - 10, ph[1] - 40, 66, 116, 1, 1, -8, girl=True, u=u)
    wp = dict(STAND, a2=lerp(-10, 45, hold), f2=lerp(-5, 40, hold), t=lerp(0, 6, 1 - hold), hd=lerp(0, 18, 1 - hold))
    W_ = stick(cv, 420, 0, wp, .88, 1, 'woman')
    # wife's heart cracking and dimming
    ch = E.add(W_['hip'], W_['up'], E.LEN['T'] * .88 * .66)
    k = prog(u, 3.4, 6.2)
    heart(cv, ch[0] + 4, ch[1], 1.9, 1, crack=eio(k), dim=k * .8)


def s2_facade(cv, u, D):
    """looks strong and established outside, actually too weak to control himself"""
    reveal = eio(prog(u, 3.2, 4.2))
    rays(cv, 540, 900, 140, 560, 22, .55 * (1 - reveal), u * .04)
    for k, (x, y) in enumerate(((330, 700), (760, 660), (700, 760), (380, 820))):
        sparkle(cv, x, y, 10, (1 - reveal) * (.6 + .4 * math.sin(u * 4 + k)))
    house(cv, 285, FLOOR, 1.0, 1 - reveal * .75, 1 - reveal)
    car(cv, 820, FLOOR, 1.1, 1 - reveal * .75)
    proud = dict(t=-4, hd=-8, a1=-30, f1=-60, a2=25, f2=60, h1=8, k1=4, h2=-8, k2=-4)       # hands on hips
    puppet = dict(t=8, hd=26, a1=150 + 25 * math.sin(u * 7), f1=170, a2=140 + 25 * math.sin(u * 7 + 2), f2=165,
                  h1=14 * math.sin(u * 7), k1=10 * math.sin(u * 7), h2=-14 * math.sin(u * 7), k2=0)
    J = stick(cv, 545 + math.sin(u * 7) * 10 * reveal, 0, E.lerp_pose(proud, puppet, reveal), 1.05 - .08 * reveal, 1)
    if reveal > 0:
        # a phone with a curvy silhouette pulls his strings
        px, py = 545, 600 - 30 * (1 - reveal)
        phone3(cv, px, py, 120, 200, reveal, 1, 0, girl=True, u=u)
        for hk in ('ha1', 'ha2', 'hip'):
            hx, hy = J[hk]
            jig = math.sin(u * 7 + len(hk)) * 6
            cv.drawLine(px + (hx - px) * .3, py + 100, hx + jig, hy, GP(ORG, 6, .5 * reveal, 3))
            cv.drawLine(px + (hx - px) * .3, py + 100, hx + jig, hy, SP(CORE, 2, reveal))


def s3_ignored(cv, u, D):
    """wife's body and sincerity ignored; his energy wasted on a fake illusion"""
    # bed on the left with the wife reaching out
    gl(cv, rrect(150, FLOOR - 120, 330, 40, 10), 4)
    gl(cv, poly([(150, FLOOR - 80), (150, FLOOR)], False), 4)
    gl(cv, poly([(480, FLOOR - 80), (480, FLOOR)], False), 4)
    gl(cv, rrect(130, FLOOR - 230, 22, 230, 8), 4)
    reach = eio(prog(u, .4, 1.4)) * (1 - eio(prog(u, 6.0, 7.2)))
    wp = dict(t=-25, hd=lerp(0, 25, prog(u, 6.0, 7.0)), h1=86, k1=10, h2=80, k2=4, a1=40, f1=60,
              a2=lerp(20, 85, reach), f2=lerp(40, 95, reach))
    W_ = stick(cv, 340, FLOOR - 130, wp, .9, 1, 'woman', ground=None)
    ch = E.add(W_['hip'], W_['up'], E.LEN['T'] * .9 * .66)
    heart(cv, ch[0] + 4, ch[1], 1.5, 1, dim=prog(u, 5.5, 9.0) * .85)
    # husband turned away, toward the glowing illusion
    turn = eio(prog(u, 1.2, 1.8))
    hp_ = dict(t=lerp(0, 10, turn), hd=lerp(0, 8, turn), a1=lerp(-10, 70, turn), f1=lerp(-5, 80, turn), a2=10, f2=6)
    J = stick(cv, 610, 0, hp_, .95, 1 if turn > .5 else -1)
    ia = sm(prog(u, 1.6, 2.4)) * (1 - prog(u, 8.6, 9.3))
    if ia > 0:
        illusion(cv, 880, FLOOR, .68, u, ia)
        # energy drained from him into the illusion
        rnd = random.Random(3)
        for k in range(22):
            ph = (u * .8 + k / 22) % 1
            sx, sy = J['hip'][0] + rnd.uniform(-20, 20), J['hip'][1] + rnd.uniform(-60, 20)
            x = lerp(sx, 850, eio(ph))
            y = lerp(sy, FLOOR - 230, eio(ph)) - math.sin(ph * math.pi) * 70
            gdot(cv, x, y, 4, EMB, ia * (1 - ph * .4))
    if u > 6.5:
        # the illusion is fake: it glitches
        rnd = random.Random(int(u * 20))
        for k in range(6):
            yy = rnd.uniform(FLOOR - 420, FLOOR - 20)
            cv.drawRect(skia.Rect.MakeXYWH(760 + rnd.uniform(-30, 30), yy, 220, rnd.uniform(3, 10)),
                        FP(mix(ORG, CORE, rnd.random()), .7 * ia))


def s4_abusive(cv, u, D):
    """abusive to wife and kids; brain enslaved by lust"""
    shake = math.sin(u * 40) * 6 * prog(u, .6, 1.0)
    rage = dict(t=-8, hd=-10, a1=160 + 10 * math.sin(u * 9), f1=200, a2=60, f2=20, h1=14, k1=4, h2=-14, k2=-4)
    J = stick(cv, 650 + shake, 0, rage, 1.08, -1, 'man', head_col=mix(CORE, ORG, .5 + .5 * math.sin(u * 8)))
    hx, hy = J['head']
    # shockwaves toward the family
    for k in range(3):
        ph = (u * 1.3 + k / 3) % 1
        p = skia.Path()
        r = 60 + ph * 260
        p.addArc(skia.Rect(hx - r, hy - r, hx + r, hy + r), 150, 60)
        gl(cv, p, 4, (1 - ph) * sm(u / .6), CORE, DEEP)
    # wife shielding the child
    cower = dict(t=22, hd=30, a1=60, f1=150, a2=50, f2=140, h1=30, k1=-40, h2=10, k2=-60)
    stick(cv, 330 + math.sin(u * 30) * 2, 0, cower, .92, 1, 'woman')
    stick(cv, 400, 0, dict(t=10, hd=24, a1=120, f1=170, a2=100, f2=160), .55, -1, child=True)
    # brain enslaved: chained to a lustful phone
    ba = sm(prog(u, 2.0, 2.6))
    if ba > 0:
        bx, by = hx + 150, hy - 70
        brain_bubble(cv, bx, by, 85, u, ba, shrink=.3)
        px, py = 960, by + 120
        phone3(cv, px, py, 80, 140, ba, 1, 6, girl=True, u=u)
        chain3(cv, (bx + 30, by + 80), (px - 30, py - 60), ba, 22, sag=14 * math.sin(u * 3))


def s5_lazy(cv, u, D):
    """lazy, complains, rejects criticism, dumps every burden on the wife"""
    # sofa
    sofa = rrect(150, FLOOR - 150, 360, 90, 26)
    gl(cv, sofa, 4)
    gl(cv, rrect(130, FLOOR - 220, 60, 160, 20), 4)
    gl(cv, poly([(170, FLOOR - 60), (170, FLOOR)], False), 4)
    gl(cv, poly([(490, FLOOR - 60), (490, FLOOR)], False), 4)
    lie = dict(t=-70, hd=-30, h1=95, k1=90, h2=88, k2=85, a1=150, f1=110, a2=60, f2=150)
    J = stick(cv, 300, FLOOR - 155, lie, .85, 1, ground=None)
    ph = J['ha2']
    phone3(cv, ph[0] + 10, ph[1] - 20, 40, 70, 1, 1, 30, girl=True, u=u)
    # complaints: scribble clouds out of his head
    hx, hy = J['head']
    for k in range(3):
        st = .4 + k * 1.2
        al = sm(prog(u, st, st + .3)) * (1 - prog(u, st + 1.6, st + 2.0))
        if al > 0:
            scribble(cv, hx + 40 + k * 30, hy - 120 - k * 40, 46, u, al, k)
    # wife carrying a growing pile of burdens
    nload = 1 + int(clamp((u - .5) / 4.5) * 5)
    bend = min(nload * 6, 30)
    wp = dict(t=bend, hd=bend * .6, a1=150, f1=170, a2=140, f2=165, h1=8, k1=-6, h2=-8, k2=-10)
    W_ = stick(cv, 790, 0, wp, .95, -1, 'woman')
    top = (W_['ha1'][0] + W_['ha2'][0]) / 2, min(W_['ha1'][1], W_['ha2'][1])
    for k in range(nload):
        y = top[1] - 20 - k * 46
        gl(cv, rrect(top[0] - 70 + (k % 2) * 10, y - 40, 140 - (k % 3) * 14, 40, 6), 4)
    # rejecting criticism: a raised hand with a pushback wave when she turns
    if u > 3.6:
        pa = sm(prog(u, 3.6, 3.9))
        cx, cy = hx + 120, hy - 10
        for r in range(2):
            ph = (u * 1.6 + r * .5) % 1
            p = skia.Path()
            rr = 30 + ph * 140
            p.addArc(skia.Rect(cx - rr, cy - rr, cx + rr, cy + rr), -40, 80)
            gl(cv, p, 4, pa * (1 - ph), CORE, DEEP)


def s6_explode(cv, u, D):
    """dirty watching interrupted -> rage over trivial things"""
    # chair
    gl(cv, poly([(560, FLOOR - 170), (720, FLOOR - 170)], False), 4)
    gl(cv, poly([(720, FLOOR - 170), (720, FLOOR - 380)], False), 4)
    gl(cv, poly([(580, FLOOR - 170), (580, FLOOR)], False), 4)
    gl(cv, poly([(700, FLOOR - 170), (700, FLOOR)], False), 4)
    hit = 2.6
    angry = eio(prog(u, hit, hit + .4))
    sit = dict(t=lerp(10, -10, angry), hd=lerp(18, -12, angry), h1=lerp(88, 40, angry), k1=lerp(0, -10, angry),
               h2=lerp(84, 30, angry), k2=lerp(2, -20, angry),
               a1=lerp(60, 165, angry), f1=lerp(130, 200, angry), a2=lerp(55, 150, angry), f2=lerp(125, 190, angry))
    shake = math.sin(u * 45) * 8 * angry
    J = stick(cv, 640 + shake, FLOOR - 175 if angry < .5 else 0, sit, 1.0, -1, ground=None if angry < .5 else FLOOR,
              head_col=mix(CORE, ORG, angry))
    if angry < .5:
        ph = ((J['ha1'][0] + J['ha2'][0]) / 2, (J['ha1'][1] + J['ha2'][1]) / 2)
        phone3(cv, ph[0] - 10, ph[1] - 20, 60, 104, 1, 1, -10, girl=True, u=u, glitch=prog(u, hit - .2, hit))
    # small ball rolls in (a trivial disturbance)
    bxp = lerp(-40, 420, eo(prog(u, 1.2, hit)))
    gcirc(cv, bxp, FLOOR - 22, 22, 4)
    if u < hit + .3:
        stick(cv, 200 + lerp(-120, 0, eo(prog(u, .8, 2.0))), 0, dict(walk(u, 8, 18), t=4), .55, 1, child=True)
    else:
        stick(cv, 230, 0, dict(t=18, hd=26, a1=120, f1=170, a2=100, f2=160), .55, 1, child=True)
    # explosion of rage
    if angry > 0:
        hx, hy = J['head']
        flame(cv, hx, hy + 40, 1.0 + .2 * math.sin(u * 9), u, angry * .9)
        J = stick(cv, 640 + shake, 0, sit, 1.0, -1, head_col=mix(CORE, ORG, angry))
        rnd = random.Random(int(u * 14))
        for k in range(6):
            an = rnd.uniform(-math.pi, 0)
            bolt(cv, hx + math.cos(an) * 80, hy + math.sin(an) * 80, hx + math.cos(an) * 220, hy + math.sin(an) * 200,
                 int(u * 14) + k, angry * .9, 3.5, 18)


def s7_victims(cv, u, D):
    """wife and kids become a punching bag of insults, living in fear; his conscience is dead"""
    yell = dict(t=-10, hd=-14, a1=100, f1=90, a2=-30, f2=-10, h1=12, h2=-12)
    J = stick(cv, 700, 0, yell, 1.05, -1)
    hx, hy = J['head']
    # insults: jagged bolts and scribbles thrown at the family
    for k in range(5):
        st = .2 + k * 1.1
        q = prog(u, st, st + .7)
        if 0 < q < 1:
            x = lerp(hx - 60, 360, eo(q))
            y = lerp(hy, 1000 + (k % 3) * 40, eo(q))
            bolt(cv, x + 50, y - 20, x - 40, y + 20, k * 7 + int(u * 10), 1 - q * .3, 4, 14)
            scribble(cv, x, y - 60, 30, u, (1 - q), k)
    # family trembling, holding each other
    tr = math.sin(u * 34) * 3
    stick(cv, 330 + tr, 0, dict(t=14, hd=24, a1=50, f1=140, a2=60, f2=150, h1=6, h2=-6), .92, 1, 'woman')
    stick(cv, 410 - tr, 0, dict(t=8, hd=20, a1=120, f1=160, a2=100, f2=150), .55, 1, child=True)
    stick(cv, 250 + tr, 0, dict(t=8, hd=20, a1=120, f1=160, a2=100, f2=150), .5, 1, child=True)
    # dead conscience: his heart dims, cracks and turns to ash
    ch = E.add(J['hip'], J['up'], E.LEN['T'] * 1.05 * .66)
    k = prog(u, 5.6, 8.6)
    if k < 1:
        heart(cv, ch[0] - 4, ch[1], 1.6, 1 - prog(u, 8.2, 8.8), crack=eio(prog(u, 5.6, 7.0)), dim=k)
    if k > .6:
        rnd = random.Random(2)
        for i in range(16):
            q = clamp((k - .6) / .4 * 1.2 - rnd.random() * .2)
            gdot(cv, ch[0] + rnd.uniform(-30, 30) + q * 40, ch[1] - q * 160 * rnd.random(), 2.5, (120, 60, 40),
                 1 - q)


def s8_shrink(cv, u, D):
    """control centre in his brain has shrunk; no shame"""
    J = stick(cv, 540, 0, dict(t=10, hd=24, a1=6, f1=2, a2=-6, f2=-2), .72, 1)
    hx, hy = J['head']
    by = hy - 215
    cv.drawLine(hx, hy - J['Rh'], hx, by + 150, GP(ORG, 6, .5, 3))
    cv.drawLine(hx, hy - J['Rh'], hx, by + 150, SP(CORE, 2.5))
    sh = eio(prog(u, .6, 3.0))
    brain_bubble(cv, 540, by, 125, u, 1, shrink=sh)
    # inward arrows on the prefrontal side
    for k in range(3):
        an = (k - 1) * .5
        d = 150 + 15 * math.sin(u * 7)
        x, y = 540 + math.cos(an) * d, by + math.sin(an) * d
        cv.save()
        cv.translate(x, y)
        cv.rotate(math.degrees(an) + 180)
        gl(cv, poly([(-14, -20), (8, 0), (-14, 20)], False), 5, sm(prog(u, .6, 1.0)))
        cv.restore()


def s9_frozen(cv, u, D):
    """sense and affection nerves frozen; loses authority as head of the family"""
    fall = prog(u, 2.6, 3.6)
    J = stick(cv, 540, 0, E.lerp_pose(dict(t=-3, hd=-6, a1=8, f1=4, a2=-8, f2=-4),
                                      dict(t=22, hd=34, a1=6, f1=2, a2=-6, f2=-2), eio(prog(u, 2.6, 3.4))), .72, 1)
    hx, hy = J['head']
    by = hy - 250
    brain_bubble(cv, 540, by, 120, u, 1, shrink=1, frost=eio(prog(u, .3, 2.2)))
    ch = E.add(J['hip'], J['up'], E.LEN['T'] * .72 * .66)
    heart(cv, ch[0] + 4, ch[1], 1.4, 1, dim=eio(prog(u, .3, 2.2)))
    # crown slips and shatters on the ground
    cy = lerp(hy - 75, FLOOR - 40, ei(fall))
    if fall < 1:
        crown(cv, hx + 110 * fall, cy, .75, 1)
    else:
        lt = u - 3.6
        rnd = random.Random(4)
        for k in range(12):
            vx, vy = rnd.uniform(-260, 260), rnd.uniform(-420, -120)
            x = hx + 110 + vx * lt
            y = FLOOR - 30 + vy * lt + 900 * lt * lt
            if y > FLOOR:
                continue
            gdot(cv, x, y, 5, EMB, 1 - lt / 2)


def s10_ash(cv, u, D):
    """if left unchecked, the household burns to ash"""
    burn = eio(prog(u, .8, 3.0))
    collapse = eio(prog(u, 3.2, 4.8))
    a = 1 - collapse
    house(cv, 540, FLOOR, 1.5, a, 1 - burn)
    if a > 0:
        # family silhouettes in the windows
        for dx in (-50, 50):
            gdot(cv, 540 + dx * 1.5 - 10, FLOOR - 160, 7, CORE, a * (1 - burn))
    if burn > 0:
        for k, (dx, s_) in enumerate(((-110, .9), (0, 1.5), (120, 1.0))):
            flame(cv, 540 + dx, FLOOR - 40 - collapse * 0, s_ * (burn * (1 - collapse * .8) + .1), u + k, burn)
    # ash rising
    if u > 2.0:
        rnd = random.Random(8)
        for k in range(50):
            ph = (u * .25 + rnd.random()) % 1
            x = 540 + rnd.uniform(-260, 260) + math.sin(u + k) * 20
            y = FLOOR - 40 - ph * 640
            gdot(cv, x, y, 2.5 + rnd.random() * 2, (150, 90, 70), (1 - ph) * sm(prog(u, 2.0, 3.0)), DEEP)
    if collapse > 0:
        p = spline([(330, FLOOR), (420, FLOOR - 40 * collapse), (540, FLOOR - 70 * collapse),
                    (650, FLOOR - 35 * collapse), (750, FLOOR)], closed=False)
        gl(cv, p, 4, collapse, (160, 90, 70), DEEP)


def s11_cta(cv, u, D):
    """before it collapses: master neuroplasticity from PMO Savior, link in bio"""
    # A: rewiring brain bubble above the man (0 .. 3.6)
    pa = 1 - sm(prog(u, 3.4, 3.9))
    if pa > 0:
        J = stick(cv, 540, 0, E.lerp_pose(dict(t=22, hd=30), dict(t=-3, hd=-8, a1=-25, f1=-50, a2=25, f2=50),
                                          eio(prog(u, .6, 2.2))), .72, 1, a=pa)
        hx, hy = J['head']
        brain_bubble(cv, 540, hy - 240, 125, u, pa, rewire=prog(u, .3, 2.6))
        for k in range(4):
            ph = (u * .9 + k / 4) % 1
            gcirc(cv, 540, hy - 240, 125 + ph * 60, 3, pa * (1 - ph) * prog(u, 1.0, 1.4))
    # B: phone with PMO Savior logo (crisp logo drawn after bloom by the compositor)
    pb = sm(prog(u, 3.4, 3.9))
    if pb > 0:
        k = bo(prog(u, 3.4, 4.0)) * .84
        px, py = 540, 990
        rays(cv, px, py, 300, 620, 24, .45 * pb, u * .05)
        cv.save()
        cv.translate(px, py)
        cv.scale(k, k)
        phone3(cv, 0, 0, 380, 680, pb, 0)
        cv.restore()
        sc = rrect(px - 152 * k, py - 285 * k, 304 * k, 571 * k, 30 * k)
        cv.drawPath(sc, FP(DARK, pb))
        CTA['pos'] = (px, py, k, pb)
        # arrow to the bio
        aa = sm(prog(u, 4.3, 4.7))
        if aa > 0:
            bounce = abs(math.sin(u * 5)) * 24
            ay = py - 340 * k - 30 - bounce
            arrow = poly([(px, ay - 60), (px + 50, ay - 8), (px + 18, ay - 8), (px + 18, ay + 50), (px - 18, ay + 50),
                          (px - 18, ay - 8), (px - 50, ay - 8)])
            gfill(cv, arrow, DEEP, aa, ORG, 0)
            gl(cv, arrow, 4.5, aa)
        # tapping finger from the right
        ta = eio(prog(u, 5.2, 5.7)) * (1 - eio(prog(u, 7.6, 8.2)))
        if ta > 0:
            tap = prog(u, 5.8, 6.0)
            press = math.sin(tap * math.pi) * 22
            fx = lerp(px + 520, px + 80, ta) - press * .3
            fy = py + 200 + press
            gl(cv, poly([(px + 700, py + 300), (px + 330, py + 260), (fx, fy)], False), 16)
            gdot(cv, fx, fy, 16, CORE)
            tr = prog(u, 5.9, 6.7)
            if 0 < tr < 1:
                for r in range(3):
                    q = clamp(tr * 1.3 - r * .15)
                    gcirc(cv, fx, fy, 14 + q * 150, 4, 1 - q)


SCENES = [s1_wedding, s2_facade, s3_ignored, s4_abusive, s5_lazy, s6_explode, s7_victims, s8_shrink, s9_frozen,
          s10_ash, s11_cta]
