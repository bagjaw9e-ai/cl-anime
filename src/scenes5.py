"""Video 5: revision of video 4 (red neon, grok reference).
- a new beat at every full stop / comma / pause (26 beats)
- livelier stickmen (breathing, sway, follow-through) whose head blends with the body (same neon fill)
- realistic objects where the narration is about an object: 3D brain mesh, anatomical heart, diamond ring,
  detailed phone / laptop / house; the stickman is not always the main subject."""
import math, random
import numpy as np
import skia
import engine as E
from engine import (RED, HOT, WHT, ICE, DRED, BLACK, C, SP, FP, clamp, sm, eo, ei, eio, bo, prog, lerp, mix, neon,
                    rrect, poly, spline, circ, dot, glow_dot, radial)
import scenes as SC
import scenes4 as S4
import b3d_video as BV
import b3d_mesh as BM

W, H = 1080, 1920
FLOOR = 1330
AUDIO_LEN = 74.97
B = [0.0, 3.74, 6.54, 9.40, 11.80, 13.55, 16.20, 21.50, 22.91, 26.25, 28.60, 31.77, 34.80, 37.77, 41.23, 44.83,
     48.77, 50.48, 52.83, 54.22, 57.00, 60.23, 63.20, 65.67, 68.20, 70.14, AUDIO_LEN]
TRW = 0.7
PMO_IMG = None
CTA = {}
NOW = [0.0]          # absolute time, set by the compositor (drives idle motion)
BODY = (46, 2, 8)    # shared neon-dark fill for head + body


# ------------------------------------------------------------------ lively faceless stickman
def alive(pose, seed, amt=1.0):
    """secondary motion: breathing, sway, loose arms, head bob"""
    t = NOW[0]
    p = dict(E.STAND)
    p.update(pose)
    r = seed * 1.37
    p['t'] += (1.8 * math.sin(t * 1.7 + r)) * amt
    p['hd'] += (3.0 * math.sin(t * 1.3 + r + 1) + 1.2 * math.sin(t * 3.1 + r)) * amt
    for k, ph in (('a1', 0), ('a2', 1.9)):
        p[k] += 4.5 * math.sin(t * 1.9 + r + ph) * amt
    for k, ph in (('f1', .5), ('f2', 2.3)):
        p[k] += 6.5 * math.sin(t * 1.9 + r + ph - .5) * amt    # forearm lags the upper arm
    for k, ph in (('h1', 0), ('h2', 2)):
        p[k] += 1.4 * math.sin(t * 1.1 + r + ph) * amt
    return p


def person(cv, x, pose, s=1.0, f=1, kind='man', a=1.0, c=RED, child=False, curvy=False, ground=FLOOR, y=0,
           live=1.0, tie=False, veil=False, body=BODY):
    pose = alive(pose, int(x) % 97 + (3 if kind == 'woman' else 0), live)
    J = E.fig(cv, x, y, pose, s, f, kind, 'none', ground=ground, a=a, c=c, child=child, curvy=curvy, fill=body)
    hx, hy = J['head']
    R = J['R']
    # head blends with the body: same fill + soft inner neon, no face
    sh = skia.GradientShader.MakeRadial(skia.Point(hx - R * .25 * f, hy - R * .3), R * 1.1,
                                        [C(mix(body, c, .55), a), C(body, a)])
    cv.drawCircle(hx, hy, R * .93, skia.Paint(AntiAlias=True, Shader=sh))
    if veil:
        v = poly([E.hp(J, -.2, .9), E.hp(J, -1.6, -2.6), E.hp(J, -.4, -2.2), E.hp(J, .2, .5)])
        neon(cv, v, HOT, 2.5 * s, a * .9, (60, 0, 8), .45)
    if tie:
        n = J['neck']
        up = J['up']
        q = E.add(n, up, -E.LEN['T'] * s * .45)
        neon(cv, poly([E.add(n, up, -6 * s), E.add(q, (up[1], -up[0]), 9 * s), E.add(q, up, -12 * s),
                       E.add(q, (up[1], -up[0]), -9 * s)]), HOT, 2.5 * s, a, RED, .8)
    return J


def chest(J, s):
    return E.add(J['hip'], J['up'], E.LEN['T'] * s * .66)


# ------------------------------------------------------------------ realistic objects
def anat_heart(cv, x, y, s=1.0, a=1.0, beat=0.0, crack=0.0, stone=0.0, dim=0.0, frost=0.0):
    """anatomical heart: ventricles, atria, aorta arch, pulmonary trunk, coronary vessels"""
    k = 1 + .045 * beat
    cv.save()
    cv.translate(x, y)
    cv.scale(s * k, s * k)
    flesh = mix(mix((200, 30, 40), (90, 10, 16), dim), (62, 54, 56), stone)
    dark_ = mix(mix((70, 4, 10), (30, 2, 6), dim), (22, 18, 20), stone)
    line = mix(mix(HOT, RED, dim), (120, 100, 104), stone)
    line = mix(line, ICE, frost)

    def tube(pts, w):
        p = spline(pts, closed=False)
        cv.drawPath(p, SP(line, w + 8, a))
        cv.drawPath(p, SP(mix(flesh, dark_, .35), w, a))
        cv.drawPath(p, SP(mix(flesh, WHT, .25), w * .25, a * .5))
    radial(cv, 0, 20, 240, mix(RED, (90, 80, 80), stone), .35 * a * (1 - dim))
    tube([(-40, -40), (-55, -120), (-110, -150)], 30)                      # pulmonary trunk
    tube([(10, -50), (0, -150), (60, -185), (110, -150), (115, -90)], 40)  # aorta arch
    for dx in (20, 50, 78):
        tube([(dx, -160 - (10 if dx == 50 else 0)), (dx + 5, -220)], 13)  # arch branches
    tube([(-95, -60), (-120, -130)], 22)                                   # vena cava
    atr_r = skia.Path()
    atr_r.addOval(skia.Rect(-140, -95, -50, -5))
    atr_l = skia.Path()
    atr_l.addOval(skia.Rect(55, -100, 130, -30))
    body = spline([(-100, -30), (-118, 45), (-80, 115), (5, 175), (80, 112), (118, 25), (100, -50), (40, -72),
                   (-40, -72)])
    sh = skia.GradientShader.MakeRadial(skia.Point(-40, -10), 230, [C(mix(flesh, WHT, .2), a), C(flesh, a),
                                                                   C(dark_, a)], [0, .45, 1])
    for p in (atr_r, atr_l, body):
        cv.drawPath(p, skia.Paint(AntiAlias=True, Shader=sh))
        cv.drawPath(p, SP(line, 5, a))
    # interventricular groove + coronary vessels
    cv.drawPath(spline([(30, -60), (10, 30), (5, 120), (5, 170)], closed=False), SP(dark_, 7, a))
    for pts in ([(10, -20), (-30, 20), (-60, 70)], [(8, 40), (50, 70), (75, 105)], [(-20, -50), (-70, -15),
                                                                                    (-95, 30)],
                [(6, 90), (-30, 120), (-45, 140)]):
        cv.drawPath(spline(pts, closed=False), SP(mix(line, WHT, .3), 3.5, a * .9))
    if crack > 0:
        pts = [(-20, -70), (-5, -20), (-30, 20), (0, 60), (-15, 110), (5, 170)]
        n = max(2, int(len(pts) * crack + .99))
        cv.drawPath(poly(pts[:n], False), SP(BLACK, 9, a))
        cv.drawPath(poly(pts[:n], False), SP(line, 2, a * .8))
        for j in range(1, n - 1):
            cv.drawLine(pts[j][0], pts[j][1], pts[j][0] + 30 * (1 if j % 2 else -1), pts[j][1] + 20, SP(BLACK, 5, a))
    if frost > 0:
        rnd = random.Random(5)
        for j in range(16):
            an = rnd.uniform(0, 6.28)
            px_, py_ = math.cos(an) * 110, math.sin(an) * 110 + 30
            L = frost * 70
            cv.drawLine(px_, py_, px_ - math.cos(an) * L, py_ - math.sin(an) * L, SP(ICE, 3, a * frost))
    cv.restore()


def diamond_ring(cv, x, y, s=1.0, a=1.0, u=0.0, spin=0.0):
    cv.save()
    cv.translate(x, y)
    cv.scale(s, s)
    sq = .35 + .1 * math.sin(spin)
    band = skia.Path()
    band.addOval(skia.Rect(-80, -80 * sq, 80, 80 * sq))
    cv.drawPath(band, SP(RED, 22, a))
    cv.drawPath(band, SP(HOT, 8, a))
    cv.drawPath(band, SP(WHT, 2, a * .7))
    top = -80 * sq
    neon(cv, poly([(-22, top), (22, top), (14, top - 18), (-14, top - 18)]), HOT, 3, a, RED, .6)     # setting
    gem = poly([(-30, top - 30), (30, top - 30), (18, top - 52), (-18, top - 52)])
    pav = poly([(-30, top - 30), (30, top - 30), (0, top - 4)])
    neon(cv, gem, WHT, 3, a, (255, 150, 150), .5)
    neon(cv, pav, WHT, 3, a, (230, 90, 100), .5)
    for xx in (-10, 10):
        cv.drawLine(xx, top - 52, xx * 2.2, top - 30, SP(WHT, 2, a * .8))
        cv.drawLine(xx * 2.2, top - 30, 0, top - 4, SP(WHT, 1.6, a * .6))
    tw = .5 + .5 * math.sin(u * 6)
    for (dx, dy, r) in ((26, -66, 10), (-30, -44, 7)):
        cv.drawLine(dx - r * tw, top + dy + 20, dx + r * tw, top + dy + 20, SP(WHT, 2.5, a))
        cv.drawLine(dx, top + dy + 20 - r * tw, dx, top + dy + 20 + r * tw, SP(WHT, 2.5, a))
    cv.restore()


def smartphone(cv, x, y, w, h, u, a=1.0, ang=0.0, girl=True, glitch=0.0, logo=False):
    """detailed phone: rounded body, side buttons, punch-hole camera, glare"""
    cv.save()
    cv.translate(x, y)
    cv.rotate(ang)
    radial(cv, 0, 0, h * .85, RED, .3 * a)
    for (bx, by, bh) in ((w / 2, -h * .22, h * .12), (-w / 2 - 5, -h * .26, h * .07), (-w / 2 - 5, -h * .15, h * .07)):
        cv.drawPath(rrect(bx - 1, by, 6, bh, 3), FP(RED, a))
    body = rrect(-w / 2, -h / 2, w, h, w * .16)
    neon(cv, body, RED, max(w * .035, 3), a, (20, 0, 4))
    scr = rrect(-w / 2 + w * .05, -h / 2 + w * .05, w * .9, h - w * .1, w * .12)
    cv.save()
    cv.clipPath(scr, doAntiAlias=True)
    if girl:
        cv.drawPath(scr, FP((150, 18, 26), a))
        radial(cv, 0, -h * .1, h * .6, HOT, .55 * a)
        s_ = h * .78 / 600
        E.fig(cv, -6 * s_, 0, S4.sexy_pose(u), s_, 1, 'woman', 'none', ground=h * .42, c=RED, fill=(40, 0, 6),
              curvy=2, a=a)
        if glitch > 0:
            rnd = random.Random(int(u * 24))
            for k in range(7):
                cv.drawRect(skia.Rect.MakeXYWH(-w / 2, rnd.uniform(-h / 2, h / 2), w, rnd.uniform(3, 16)),
                            FP(mix(RED, WHT, rnd.random()), a * glitch))
            cv.translate(rnd.uniform(-8, 8) * glitch, 0)
    else:
        cv.drawPath(scr, FP((6, 0, 2), a))
    gl = poly([(-w * .45, -h * .5), (-w * .1, -h * .5), (-w * .45, -h * .1)])
    cv.drawPath(gl, FP(WHT, .07 * a))
    cv.restore()
    dot(cv, 0, -h / 2 + w * .1, w * .035, (10, 0, 2), a)
    circ(cv, 0, -h / 2 + w * .1, w * .035, RED, 1.5, a, None)
    cv.restore()


def laptop_real(cv, x, y, s, u, a=1.0, glitch=0.0, dissolve=0.0):
    cv.save()
    cv.translate(x, y)
    cv.scale(s, s)
    neon(cv, rrect(-150, -210, 300, 196, 12), RED, 5, a, (14, 0, 3))          # lid
    scr = rrect(-136, -198, 272, 172, 6)
    cv.save()
    cv.clipPath(scr, doAntiAlias=True)
    cv.drawPath(scr, FP((140, 16, 24), a))
    radial(cv, 0, -110, 190, HOT, .55 * a)
    if dissolve < 1:
        E.fig(cv, 0, 0, S4.sexy_pose(u), .27, 1, 'woman', 'none', ground=-30, c=RED, fill=(40, 0, 6), curvy=2,
              a=a * (1 - dissolve))
    rnd = random.Random(int(u * 24))
    if glitch > 0:
        for k in range(9):
            cv.drawRect(skia.Rect.MakeXYWH(-136, rnd.uniform(-198, -26), 272, rnd.uniform(3, 18)),
                        FP(mix(RED, WHT, rnd.random()), a * glitch))
    if dissolve > 0:
        for k in range(int(260 * dissolve)):
            dot(cv, rnd.uniform(-136, 136), rnd.uniform(-198, -26), rnd.uniform(1, 3), mix(RED, WHT, rnd.random()),
                a * dissolve)
    cv.restore()
    dot(cv, 0, -204, 3, HOT, a)
    base = poly([(-170, -12), (170, -12), (196, 14), (-196, 14)])
    neon(cv, base, RED, 5, a, (14, 0, 3))
    for r in range(3):
        for c_ in range(12):
            xx = -150 + c_ * 25 + r * 6
            cv.drawPath(rrect(xx, -8 + r * 6, 20, 4, 1), FP(DRED, a))
    cv.restore()


def house_real(cv, x, s=1.0, a=1.0, lit=1.0, tilt=0.0, crack=0.0):
    cv.save()
    cv.translate(x, FLOOR)
    cv.rotate(tilt)
    cv.scale(s, s)
    neon(cv, rrect(90, -330, 40, 90, 3), RED, 5, a, (12, 0, 2))                # chimney
    roof = poly([(-200, -210), (0, -350), (200, -210)])
    neon(cv, roof, RED, 6, a, (14, 0, 3))
    for k in range(1, 6):
        q = k / 6
        cv.drawLine(lerp(-200, 0, q * .98), lerp(-210, -350, q * .98), lerp(200, 0, q * .98), lerp(-210, -350, q * .98),
                    SP(DRED, 2.5, a))
    neon(cv, poly([(-170, 0), (-170, -215), (170, -215), (170, 0)]), RED, 6, a, (12, 0, 2))
    for k in range(1, 7):
        cv.drawLine(-170, -k * 30, 170, -k * 30, SP((60, 4, 10), 2, a))        # siding
    for dx in (-130, 60):
        r = rrect(dx, -170, 70, 70, 4)
        neon(cv, r, RED, 4, a, mix((20, 0, 3), (230, 70, 60), lit * .75))
        cv.drawLine(dx + 35, -170, dx + 35, -100, SP(RED, 3, a))
        cv.drawLine(dx, -135, dx + 70, -135, SP(RED, 3, a))
        if lit > 0:
            radial(cv, dx + 35, -135, 90, HOT, .25 * lit * a)
    neon(cv, rrect(-30, -120, 60, 120, 4), RED, 5, a, (20, 0, 3))
    dot(cv, 18, -60, 5, HOT, a)
    neon(cv, rrect(-46, -8, 92, 8, 2), RED, 3, a, (20, 0, 3))
    if crack > 0:
        pts = [(-60, -215), (-40, -160), (-70, -110), (-45, -60), (-60, 0)]
        n = max(2, int(len(pts) * crack + .99))
        cv.drawPath(poly(pts[:n], False), SP(BLACK, 8, a))
        cv.drawPath(poly(pts[:n], False), SP(HOT, 2, a))
    cv.restore()


def car_real(cv, x, s=1.0, a=1.0):
    cv.save()
    cv.translate(x, FLOOR)
    cv.scale(s, s)
    body = spline([(-130, -26), (-132, -62), (-80, -70), (-46, -112), (40, -114), (86, -72), (128, -62), (132, -26)],
                  closed=False)
    cv.drawPath(body, SP(RED, 6, a))
    neon(cv, poly([(-38, -104), (-6, -104), (-6, -72), (-70, -72)]), RED, 3, a, (60, 6, 12))
    neon(cv, poly([(4, -104), (36, -104), (70, -72), (4, -72)]), RED, 3, a, (60, 6, 12))
    cv.drawLine(-130, -26, 132, -26, SP(RED, 5, a))
    dot(cv, 124, -52, 7, HOT, a)
    dot(cv, -126, -52, 6, RED, a)
    for dx in (-76, 78):
        circ(cv, dx, -24, 26, RED, 6, a, (14, 0, 2))
        circ(cv, dx, -24, 11, HOT, 3, a, (40, 0, 6))
    cv.restore()


def crown_real(cv, x, y, s=1.0, a=1.0):
    neon(cv, E.crown_path(x, y, s), WHT, 5, a, (170, 30, 40), .8)
    cv.drawLine(x - 90 * s, y + 30 * s, x + 90 * s, y + 30 * s, SP(HOT, 6 * s, a))
    for k, dx in enumerate((-55, 0, 55)):
        dot(cv, x + dx * s, y + 30 * s, 9 * s, WHT if k == 1 else HOT, a)
    for dx in (-90, -30, 30, 90):
        dot(cv, x + dx * s * (1 if abs(dx) < 90 else .99), y - 32 * s if abs(dx) == 90 else y - 54 * s, 7 * s, WHT, a)


def bed_real(cv, x0, x1, top, a=1.0):
    E.bed(cv, x0, x1, top, a, head_h=170, foot_h=70, floor=FLOOR)
    blanket = spline([(x0 + 120, top + 4), (x0 + 200, top - 16), (x0 + 300, top - 6), (x1, top - 12), (x1 + 4, top + 50),
                      (x0 + 120, top + 56)])
    neon(cv, blanket, RED, 4, a, (60, 4, 12), .9)
    for k in range(3):
        cv.drawPath(spline([(x0 + 150 + k * 70, top + 2), (x0 + 170 + k * 70, top + 30), (x0 + 160 + k * 70, top + 52)],
                           closed=False), SP(DRED, 3, a))
    E.pillow(cv, x0 + 50, top - 20, 110, 46, a)


def sofa_real(cv, x0, x1, a=1.0):
    neon(cv, rrect(x0 + 20, FLOOR - 230, x1 - x0 - 40, 100, 24), RED, 5, a, (30, 2, 6))      # back
    for k in range(2):
        w_ = (x1 - x0 - 80) / 2
        neon(cv, rrect(x0 + 40 + k * w_, FLOOR - 150, w_, 50, 16), RED, 4, a, (40, 2, 8))  # cushions
    neon(cv, rrect(x0, FLOOR - 190, 60, 150, 22), RED, 5, a, (30, 2, 6))
    neon(cv, rrect(x1 - 60, FLOOR - 190, 60, 150, 22), RED, 5, a, (30, 2, 6))
    neon(cv, rrect(x0 + 10, FLOOR - 100, x1 - x0 - 20, 60, 10), RED, 5, a, (30, 2, 6))
    for xx in (x0 + 30, x1 - 30):
        cv.drawLine(xx, FLOOR - 40, xx, FLOOR, SP(RED, 6, a))


def punching_bag(cv, x, y, s, swing, a=1.0):
    cv.save()
    cv.translate(x, y)
    cv.rotate(swing)
    cv.drawLine(0, -40, 0, 0, SP(RED, 4, a))
    neon(cv, rrect(-60 * s, 0, 120 * s, 300 * s, 50 * s), RED, 6, a, (60, 4, 10))
    for k in (1, 2):
        cv.drawLine(-60 * s, k * 100 * s, 60 * s, k * 100 * s, SP(DRED, 4, a))
    cv.restore()


# ------------------------------------------------------------------ realistic 3D brain
_brain_ready = [False]


def brain3d(cv, cx, cy, scale, t, a=1.0, pitch=0.0, **kw):
    if not _brain_ready[0]:
        BV.BR = BV.Brain()
        _brain_ready[0] = True
    st = dict(pfc_hot=0, reward=0, flood=0, pfc_dim=0, shrink=0, cracks=0, amyg=0, jitter=0, freeze=0, drain=0,
              dark=0, cage=0, cage_fly=0, explode=0, rewire=0, heal=0, final=0)
    st.update(kw)
    BV.BX, BV.BY, BV.SCALE = cx, cy, scale
    BV.YAW0, BV.YAW_SPEED = 200, -12
    if a < 1:
        cv.saveLayerAlpha(None, int(clamp(a) * 255))
    radial(cv, cx, cy, 340 * scale / 3, RED, .18)
    R, Vd, Vv, Nv, P2 = BV.brain_draw(cv, t, st, pitch, (0, 0))
    if st['cracks'] > 0:
        for k, pth in enumerate(BV.BR.cracks):
            fr = clamp(st['cracks'] * 1.4 - (k % 7) * .06)
            BV.path_draw(cv, P2, Nv, pth, fr, HOT, 2.6, .85)
            BV.path_draw(cv, P2, Nv, pth, fr, (20, 0, 2), 1.1, 1)
    if st['rewire'] > 0:
        al = sm(st['rewire'] * 4)
        for k, pth in enumerate(BV.BR.wires):
            fr = clamp(st['rewire'] * 1.6 - (k % 10) * .06)
            if fr > 0:
                BV.path_draw(cv, P2, Nv, pth, fr, WHT if k % 3 else HOT, 1.6, al * .7, glow=True)
    if a < 1:
        cv.restore()
    return R, P2, BV.BR.pt(BV.BR.pfc_pt, R)


# ------------------------------------------------------------------ beats
def b01_wedding(cv, u, D):
    arch = skia.Path()
    arch.addArc(skia.Rect(310, 660, 770, 1120), 180, 180)
    cv.drawPath(arch, SP(RED, 7))
    for x in (310, 770):
        cv.drawLine(x, 890, x, FLOOR, SP(RED, 7))
    for k in range(9):
        an = math.pi + (k + .5) / 9 * math.pi
        S4.heart(cv, 540 + math.cos(an) * 230, 890 + math.sin(an) * 230, .9, .9)
    diamond_ring(cv, 540, 790, .95 * bo(prog(u, .1, .5)) + .001, sm(u / .3), u, u * 2)
    look = eio(prog(u, 1.8, 2.2)) * (1 - eio(prog(u, 3.0, 3.4)))
    J = person(cv, 610, dict(a2=40, f2=60, a1=-50, f1=-80, hd=-30 * look), .95, -1, 'man', tie=True)
    hx, hy = J['ha1']
    buzz = math.sin(u * 60) * 3 if 1.6 < u < 2.8 else 0
    smartphone(cv, hx + 22 + buzz, hy - 26, 60, 116, u, sm(prog(u, 1.3, 1.7)), 12)
    person(cv, 455, dict(a2=40, f2=60), .9, 1, 'woman', veil=True)


def b02_heart_crack(cv, u, D):
    """close-up of the wife's real heart cracking slowly"""
    bt = (u * 1.3) % 1
    anat_heart(cv, 540, 960, 1.05, 1, math.exp(-bt * 8), crack=eio(prog(u, .5, 2.4)), dim=prog(u, .5, 2.6) * .8)


def b03_facade(cv, u, D):
    radial(cv, 540, 850, 430, RED, .32)
    for i in range(16):
        an = i / 16 * 2 * math.pi + u * .1
        cv.drawLine(540 + math.cos(an) * 210, 870 + math.sin(an) * 210, 540 + math.cos(an) * 440,
                    870 + math.sin(an) * 440, SP(RED, 3, .4))
    house_real(cv, 230, .62)
    car_real(cv, 860, .8)
    person(cv, 545, dict(t=-4, hd=-8, a1=-35, f1=-70, a2=35, f2=70, h1=8, k1=4, h2=-8, k2=-4), 1.0, 1, 'man', tie=True)


def b04_shadow(cv, u, D):
    """spotlight: the proud man casts the shadow of a small, trembling, weak man"""
    sp = skia.GradientShader.MakeRadial(skia.Point(540, 700), 520, [C(RED, .35), C(RED, 0)])
    cv.drawPath(poly([(470, 560), (610, 560), (900, FLOOR), (180, FLOOR)]), skia.Paint(AntiAlias=True, Shader=sp))
    neon(cv, rrect(160, 640, 760, 690, 10), DRED, 4, .6, None)                # wall
    rev = eio(prog(u, .3, 1.2))
    tr = math.sin(u * 30) * 4 * rev
    cv.save()
    cv.translate(700 + tr, 0)
    cv.scale(1.25, 1.0)
    cv.translate(-700, 0)
    E.fig(cv, 700, 0, dict(t=28, hd=36, a1=60, f1=150, a2=50, f2=140, h1=30, k1=-40, h2=10, k2=-60), 1.0 * rev + .01,
          -1, 'man', 'none', ground=FLOOR, c=(90, 8, 14), fill=(28, 0, 4), a=.9 * rev)
    cv.restore()
    person(cv, 420, dict(t=-4, hd=-8, a1=-35, f1=-70, a2=35, f2=70), .9, 1, 'man', tie=True)


def b05_puppet(cv, u, D):
    jerk = math.sin(u * 14)
    py = lerp(430, 600, eo(prog(u, 0, .5)))
    smartphone(cv, 540, py, 150, 270, u, 1)
    pose = dict(t=8 + 6 * jerk, hd=28, a1=150 + 20 * jerk, f1=170, a2=135 - 20 * jerk, f2=160, h1=16 * jerk,
                k1=12 * jerk, h2=-14 * jerk, k2=0)
    J = person(cv, 545 + 8 * jerk, pose, .9, 1, 'man', live=.3)
    st = eo(prog(u, .3, .7))
    for kk in ('ha1', 'ha2', 'hip'):
        x, y = J[kk]
        sx, sy = 545 + (x - 545) * .4, py + 130
        cv.drawLine(sx, sy, lerp(sx, x, st), lerp(sy, y, st), SP(HOT, 2.5))


def b06_wife_offers(cv, u, D):
    bed_real(cv, 160, 700, FLOOR - 130)
    reach = eio(prog(u, .2, 1.0))
    wp = dict(t=-32, hd=-4, h1=86, k1=92, h2=82, k2=88, a1=40, f1=60, a2=lerp(25, 80, reach), f2=lerp(45, 85, reach))
    Wf = person(cv, 330, wp, .95, 1, 'woman', curvy=True, ground=None, y=FLOOR - 138)
    hx, hy = Wf['ha2']
    bt = (u * 1.2) % 1
    anat_heart(cv, hx + 40, hy - 14, .2, 1, math.exp(-bt * 8), dim=prog(u, 1.2, 2.6) * .5)
    # husband's back at the edge of frame, walking away
    person(cv, lerp(860, 960, eio(prog(u, .4, 2.6))), dict(SC.walk(u, 6, 16), t=4), .95, 1, 'man')


def b07_laptop(cv, u, D):
    """lust over the wife: laptop silhouette, tissues, his energy drained into the screen"""
    S4.table(cv, 650, 380, 190)
    laptop_real(cv, 650, FLOOR - 192, 1.05, u)
    S4.tissues(cv, 800, FLOOR - 192, .85)
    for k, t0 in enumerate((1.2, 2.4, 3.6, 4.6)):
        q = prog(u, t0, t0 + .5)
        if q > 0:
            S4.crumpled(cv, lerp(810, 720 + k * 50, q), lerp(FLOOR - 250, FLOOR - 18, ei(q)), 1.1)
    S4.chair(cv, 330, -1)
    sit = dict(t=14, hd=12, h1=88, k1=0, h2=84, k2=2, a1=80, f1=95, a2=74, f2=90)
    J = person(cv, 345, sit, .95, 1, 'man', ground=None, y=FLOOR - 178, live=.6)
    rnd = random.Random(3)
    for k in range(18):
        ph = (u * .8 + k / 18) % 1
        x = lerp(J['hip'][0] + 30, 650, eio(ph))
        y = lerp(J['hip'][1] - 30, FLOOR - 300, eio(ph)) - math.sin(ph * math.pi) * 60
        glow_dot(cv, x, y, 7, HOT, sm(prog(u, .5, 1.0)) * (1 - ph * .5))


def b08_illusion(cv, u, D):
    """close-up of the screen: the illusion glitches and dissolves - it was fake"""
    laptop_real(cv, 540, 1150, 1.7, u, 1, glitch=prog(u, .1, .5), dissolve=eio(prog(u, .5, 1.3)))


def b09_abuse(cv, u, D):
    raise_ = eio(prog(u, .2, .5))
    shake = math.sin(u * 40) * 5 * raise_
    J = person(cv, 670 + shake, dict(t=-6, hd=-10, a1=lerp(20, 165, raise_), f1=lerp(30, 200, raise_), a2=50, f2=30,
                                     h1=14, k1=4, h2=-14, k2=-4), 1.08, -1, 'man', live=.4)
    hx, hy = J['head']
    for k in range(3):
        ph = ((u - .4) * 1.25 + k / 3) % 1
        if u < .4:
            break
        p = skia.Path()
        r = 60 + ph * 280
        p.addArc(skia.Rect(hx - r, hy - r, hx + r, hy + r), 150, 60)
        cv.drawPath(p, SP(HOT, 5, 1 - ph))
    tr = math.sin(u * 34) * 3
    person(cv, 330 + tr, dict(t=26, hd=34, a1=60, f1=150, a2=50, f2=140, h1=30, k1=-40, h2=10, k2=-60), .9, 1, 'woman',
           live=.4)
    person(cv, 410 - tr, dict(t=10, hd=24, a1=120, f1=170, a2=100, f2=160), .55, -1, 'man', child=True, live=.4)


def b10_brain_chained(cv, u, D):
    t = B[9] + u
    R, P2, pfc = brain3d(cv, 500, 960, 3.0, t, dark=.35, pfc_dim=.5)
    for k in range(3):
        y = 900 + k * 70
        E.chain(cv, (250, y - 40 + k * 20), (760, y + 30 - k * 20), 30, 1, 5, sag=40 * math.sin(u * 2 + k))
    smartphone(cv, 900, 990, 110, 200, u, sm(prog(u, .2, .6)), 8)
    E.chain(cv, (700, 960), (850, 990), 26, sm(prog(u, .4, .8)), 4.5, sag=12 * math.sin(u * 3))


def b11_sofa(cv, u, D):
    sofa_real(cv, 230, 850)
    lie = dict(t=86, hd=-40, h1=-88, k1=-95, h2=-80, k2=-120, a1=150, f1=200, a2=-150, f2=-170)
    J = person(cv, 420, lie, .85, 1, 'man', ground=None, y=FLOOR - 165, live=.5)
    hx, hy = J['ha1']
    smartphone(cv, hx, hy - 34, 48, 88, u, 1, 160)
    hx, hy = J['head']
    ca = sm(prog(u, .4, .7))
    S4.speech(cv, hx + 60, hy - 170, 190, 110, (hx + 30, hy - 60), ca, jag=True, u=u)
    for k in range(3):
        q = (u * .7 + k / 3) % 1
        dot(cv, hx + 160 + q * 40, hy - 250 - q * 80, 5, HOT, (1 - q) * ca)


def b12_burden(cv, u, D):
    n = min(1 + int(max(u - .2, 0) / .55), 5)
    bend = n * 6
    W_ = person(cv, 610, dict(t=bend, hd=bend * .7, a1=150, f1=172, a2=140, f2=166, h1=8, k1=-6, h2=-8, k2=-10), .95,
                -1, 'woman', live=.5)
    top = (W_['ha1'][0] + W_['ha2'][0]) / 2, min(W_['ha1'][1], W_['ha2'][1])
    for k in range(n):
        y = top[1] - 18 - k * 46
        t0 = .2 + max(k - 0, 0) * .55
        drop = 1 - eo(prog(u, t0, t0 + .25))
        x0 = top[0] - 68 + (k % 2) * 10
        neon(cv, rrect(x0, y - 42 - drop * 140, 136 - (k % 3) * 12, 42, 6), RED, 4, 1, (40, 2, 8))
        cv.drawLine(x0 + 10, y - 21 - drop * 140, x0 + 120 - (k % 3) * 12, y - 21 - drop * 140, SP(DRED, 3))
    # he dismisses her with a raised palm
    J = person(cv, 300, dict(t=-4, a1=110, f1=95, a2=-10, f2=-5), .9, 1, 'man', live=.6)
    ba = bo(prog(u, .9, 1.2))
    if ba > 0:
        cx, cy = J['ha1'][0] + 60, J['ha1'][1] - 10
        circ(cv, cx, cy, 44 * ba, HOT, 6, 1, (60, 0, 6))
        cv.drawLine(cx - 24 * ba, cy - 24 * ba, cx + 24 * ba, cy + 24 * ba, SP(WHT, 7))
        cv.drawLine(cx - 24 * ba, cy + 24 * ba, cx + 24 * ba, cy - 24 * ba, SP(WHT, 7))


def b13_watching(cv, u, D):
    hit = 2.2
    S4.chair(cv, 640, -1)
    J = person(cv, 650, dict(t=12, hd=22, h1=88, k1=0, h2=84, k2=2, a1=60, f1=130, a2=55, f2=125), 1.0, -1, 'man',
               ground=None, y=FLOOR - 178, live=.5)
    ph = ((J['ha1'][0] + J['ha2'][0]) / 2, (J['ha1'][1] + J['ha2'][1]) / 2)
    smartphone(cv, ph[0] - 14, ph[1] - 40, 74, 136, u, 1, -10, glitch=prog(u, hit, hit + .2))
    bx = lerp(250, 560, eo(prog(u, 1.2, hit)))
    circ(cv, bx, FLOOR - 24, 24, HOT, 5, 1, (60, 0, 6))
    cv.drawLine(bx - 16, FLOOR - 24, bx + 16, FLOOR - 24, SP(RED, 3))
    cx = lerp(60, 230, eo(prog(u, .1, 1.2)))
    person(cv, cx, dict(SC.walk(u, 8, 18), t=4) if u < 1.2 else dict(a2=60, f2=40), .56, 1, 'man', child=True)


def b14_rage(cv, u, D):
    up = eio(prog(u, 0, .3))
    hx = 640 + math.sin(u * 45) * 7
    S4.flame(cv, hx, FLOOR - 300, 1.4 + .2 * math.sin(u * 9), u, up)
    J = person(cv, hx, dict(t=-8, hd=-12, a1=165, f1=205, a2=150, f2=195, h1=16, k1=4, h2=-16, k2=-4), 1.0, -1,
               'man', live=.5)
    rnd = random.Random(int(u * 14))
    hxh, hyh = J['head']
    for k in range(5):
        an = rnd.uniform(-math.pi, 0)
        S4.bolt(cv, hxh + math.cos(an) * 90, hyh + math.sin(an) * 90, hxh + math.cos(an) * 230,
                hyh + math.sin(an) * 200, int(u * 14) + k, up)
    # the tiny "problem": a small ball in a spotlight
    radial(cv, 300, FLOOR - 24, 90, HOT, .35)
    circ(cv, 300, FLOOR - 24, 20, HOT, 5, 1, (60, 0, 6))
    person(cv, 200, dict(t=20, hd=30, a1=120, f1=170, a2=100, f2=160), .55, 1, 'man', child=True, live=.3)


def b15_insults(cv, u, D):
    """the family as a punching bag of insults"""
    J = person(cv, 760, dict(t=-10, hd=-14, a1=100, f1=95, a2=-30, f2=-10, h1=12, k1=4, h2=-12, k2=-4), 1.0, -1,
               'man', live=.6)
    hx, hy = J['head']
    S4.speech(cv, hx - 30, hy - 170, 190, 110, (hx - 10, hy - 60), sm(prog(u, 0, .3)), jag=True, u=u)
    hitt = [.5 + k * .7 for k in range(5)]
    swing = 0
    for t0 in hitt:
        if u > t0 + .3:
            swing += 12 * math.exp(-(u - t0 - .3) * 3) * math.sin((u - t0 - .3) * 9)
    punching_bag(cv, 420, 700, 1.0, swing)
    # wife and child hug the bag's shadow - they take the blows
    tr = math.sin(u * 34) * 3
    person(cv, 300 + tr, dict(t=20, hd=28, a1=50, f1=140, a2=60, f2=150, h1=30, k1=-40, h2=10, k2=-60), .85, 1,
           'woman', live=.3)
    person(cv, 520 - tr, dict(t=10, hd=24, a1=120, f1=160, a2=100, f2=160), .52, -1, 'man', child=True, live=.3)
    for k, t0 in enumerate(hitt):
        q = prog(u, t0, t0 + .3)
        if 0 < q < 1:
            S4.bolt(cv, lerp(hx - 60, 470, eo(q)) + 40, lerp(hy, 900, eo(q)) - 12, lerp(hx - 60, 470, eo(q)) - 30,
                    lerp(hy, 900, eo(q)) + 12, k * 7, 1, 4, 10)
        r = prog(u, t0 + .3, t0 + .6)
        if 0 < r < 1:
            circ(cv, 470, 900, 10 + r * 70, HOT, 4, 1 - r, None)


def b16_fear(cv, u, D):
    """living in fear: the father's huge shadow looms on the wall over the huddled family"""
    neon(cv, rrect(150, 600, 780, 730, 8), DRED, 4, .5, None)
    sw = .8 + .2 * math.sin(u * 2)
    cv.save()
    cv.translate(760, FLOOR)
    cv.scale(1.6 * sw, 1.6 * sw)
    cv.translate(-760, -FLOOR)
    E.fig(cv, 760, 0, dict(t=-10, hd=-14, a1=150, f1=190, a2=-30, f2=-10), 1.0, -1, 'man', 'none', ground=FLOOR,
          c=(110, 10, 16), fill=(30, 0, 4), a=.85)
    cv.restore()
    tr = math.sin(u * 36) * 3
    person(cv, 330 + tr, dict(t=24, hd=32, a1=50, f1=140, a2=60, f2=150, h1=30, k1=-40, h2=10, k2=-60), .85, 1,
           'woman', live=.3)
    person(cv, 250 - tr, dict(t=12, hd=26, a1=120, f1=160, a2=100, f2=160), .5, 1, 'man', child=True, live=.3)
    person(cv, 410 + tr, dict(t=12, hd=26, a1=120, f1=160, a2=100, f2=160), .48, -1, 'woman', child=True, live=.3)


def b17_stone_heart(cv, u, D):
    st = eio(prog(u, 0, 1.0))
    bt = (u * .9) % 1
    anat_heart(cv, 540, 960, 1.0, 1 - prog(u, 1.35, 1.7) * .4, math.exp(-bt * 8) * (1 - st), crack=prog(u, .7, 1.4),
               stone=st, dim=st)


def b18_brain_pfc(cv, u, D):
    t = B[17] + u
    R, P2, pfc = brain3d(cv, 540, 960, 3.3, t, pfc_hot=.6 + .4 * math.sin(u * 7))
    ring_ = skia.Path()
    ring_.addCircle(pfc[0], pfc[1], 110)
    cv.drawPath(ring_, skia.Paint(AntiAlias=True, Color=C(WHT, .9), Style=skia.Paint.kStroke_Style, StrokeWidth=4,
                                  PathEffect=skia.DashPathEffect.Make([26, 16], u * 60)))


def b19_brain_shrink(cv, u, D):
    t = B[18] + u
    sh = eio(prog(u, 0, 1.2))
    R, P2, pfc = brain3d(cv, 540, 960, 3.3, t, shrink=sh, pfc_dim=sh * .8, dark=.2 * sh)
    for k in range(3):
        an = -math.pi / 2 + (k - 1) * .9
        d = 120 + 20 * math.sin(u * 8)
        x, y = pfc[0] + math.cos(an) * d, pfc[1] + math.sin(an) * d
        cv.save()
        cv.translate(x, y)
        cv.rotate(math.degrees(an) + 180)
        cv.drawPath(poly([(-18, -26), (10, 0), (-18, 26)], False), SP(HOT, 7))
        cv.restore()


def b20_brain_freeze(cv, u, D):
    t = B[19] + u
    fr = eio(prog(u, .1, 2.0))
    brain3d(cv, 540, 960, 3.3, t, shrink=1, pfc_dim=.8, dark=.25, freeze=fr)
    rnd = random.Random(6)
    for k in range(22):
        an = rnd.uniform(0, 6.28)
        x, y = 540 + math.cos(an) * 270, 960 + math.sin(an) * 200
        L = fr * rnd.uniform(40, 90)
        cv.drawLine(x, y, x - math.cos(an) * L, y - math.sin(an) * L, SP(ICE, 3, fr * .9))
        cv.drawLine(x - math.cos(an) * L * .5, y - math.sin(an) * L * .5, x - math.cos(an + .8) * L * .6,
                    y - math.sin(an + .8) * L * .6, SP(ICE, 2, fr * .8))
    for k in range(26):
        x = rnd.uniform(200, 880)
        y = (rnd.uniform(600, 1300) + u * 60) % 700 + 600
        dot(cv, x, y, 3, ICE, .5 * fr)


def b21_crown(cv, u, D):
    slump = eio(prog(u, .8, 1.6))
    J = person(cv, 560, E.lerp_pose(dict(t=-3, hd=-6), dict(t=22, hd=34), slump), .95, 1, 'man')
    hx, hy = J['head']
    fall = prog(u, .5, 1.1)
    if fall < 1:
        crown_real(cv, hx + 90 * fall, lerp(hy - 85, FLOOR - 40, ei(fall)), .55)
    else:
        lt = u - 1.1
        rnd = random.Random(4)
        for k in range(14):
            vx, vy = rnd.uniform(-260, 260), rnd.uniform(-420, -120)
            x = hx + 90 + vx * lt
            y = FLOOR - 40 + vy * lt + 900 * lt * lt
            if y < FLOOR:
                neon(cv, poly([(x - 8, y - 3), (x + 5, y - 8), (x + 8, y + 4), (x - 2, y + 8)]), WHT, 2,
                     max(0, 1 - lt / 2), RED, .5)
    wx = lerp(300, -160, eio(prog(u, 1.2, 3.2)))
    if wx > -150:
        person(cv, wx, dict(SC.walk(u, 6, 16), t=4), .85, -1, 'woman')
        person(cv, wx + 90, dict(SC.walk(u + .3, 7, 14), t=4), .52, -1, 'man', child=True)


def b22_brain_decay(cv, u, D):
    t = B[21] + u
    brain3d(cv, 540, 960, 3.3, t, shrink=1, pfc_dim=.85, dark=.3 + .3 * prog(u, 0, 2.8),
            cracks=eio(prog(u, .1, 2.6)))


def b23_house_burn(cv, u, D):
    burn = eio(prog(u, 0, 1.0))
    col = eio(prog(u, 1.3, 2.3))
    if col < 1:
        house_real(cv, 540, 1.0, 1 - col, 1 - burn)
    for k, (dx, s_) in enumerate(((-140, .8), (0, 1.35), (150, .9))):
        S4.flame(cv, 540 + dx, FLOOR - 20, s_ * (burn * (1 - col * .8) + .1), u + k, burn)
    rnd = random.Random(8)
    for k in range(60):
        ph = (u * .3 + rnd.random()) % 1
        x = 540 + rnd.uniform(-300, 300) + math.sin(u + k) * 20
        dot(cv, x, FLOOR - 40 - ph * 620, 2.5 + rnd.random() * 2, (150, 120, 120), (1 - ph) * burn)
    if col > 0:
        p = spline([(280, FLOOR), (410, FLOOR - 60 * col), (540, FLOOR - 95 * col), (670, FLOOR - 50 * col),
                    (800, FLOOR)], closed=False)
        neon(cv, p, RED, 5, col, (40, 10, 10))


def b24_hold_house(cv, u, D):
    """before it collapses: the man runs in and props up his cracking house"""
    tilt = -6 * (1 - eio(prog(u, 1.2, 2.2)))
    house_real(cv, 600, 1.0, 1, .6, tilt, crack=eio(prog(u, 0, .8)))
    run = eio(prog(u, 0, 1.0))
    if u < 1.0:
        person(cv, lerp(-80, 330, run), dict(SC.walk(u, 10, 30), t=14), .9, 1, 'man', live=.3)
    else:
        person(cv, 340, dict(t=30, hd=-10, a1=120, f1=110, a2=110, f2=100, h1=-20, k1=-40, h2=26, k2=10), .9, 1,
               'man', live=.4)


def b25_brain_rewire(cv, u, D):
    t = B[24] + u
    rw = prog(u, 0, 1.8)
    brain3d(cv, 540, 960, 3.3, t, shrink=1 - eio(rw), heal=eio(rw), final=eio(rw) * .6, rewire=rw)
    for k in range(3):
        ph = (u * .9 + k / 3) % 1
        circ(cv, 540, 960, 280 + ph * 120, HOT, 3, (1 - ph) * .6, None)


def b26_cta(cv, u, D):
    k = bo(prog(u, 0, .6)) * .84
    px, py = 540, 990
    radial(cv, px, py, 520, RED, .4 * sm(u / .3))
    cv.save()
    cv.translate(px, py)
    cv.scale(max(k, .001), max(k, .001))
    E.phone(cv, 0, 0, 380, 680, 1, img='blank')
    cv.restore()
    CTA['pos'] = (px, py, k, sm(u / .2))
    aa = sm(prog(u, .7, 1.0))
    if aa > 0:
        E.arrow_up(cv, px, py - 340 * k - 40 - abs(math.sin(u * 5)) * 24, .55, aa)
    ta = eio(prog(u, 1.6, 2.1)) * (1 - eio(prog(u, 4.0, 4.6)))
    if ta > 0:
        tap = prog(u, 2.2, 2.4)
        press = math.sin(tap * math.pi) * 22
        fx = lerp(px + 520, px + 80, ta) - press * .3
        fy = py + 200 + press
        SC.limb(cv, [(px + 700, py + 300), (px + 330, py + 260), (fx, fy)], 26)
        circ(cv, fx, fy, 22, RED, 5)
        tr = prog(u, 2.3, 3.1)
        if 0 < tr < 1:
            for r in range(3):
                q = clamp(tr * 1.3 - r * .15)
                circ(cv, fx, fy, 14 + q * 150, WHT, 4, 1 - q, None)


SCENES = [b01_wedding, b02_heart_crack, b03_facade, b04_shadow, b05_puppet, b06_wife_offers, b07_laptop,
          b08_illusion, b09_abuse, b10_brain_chained, b11_sofa, b12_burden, b13_watching, b14_rage, b15_insults,
          b16_fear, b17_stone_heart, b18_brain_pfc, b19_brain_shrink, b20_brain_freeze, b21_crown, b22_brain_decay,
          b23_house_burn, b24_hold_house, b25_brain_rewire, b26_cta]
assert len(SCENES) == len(B) - 1
