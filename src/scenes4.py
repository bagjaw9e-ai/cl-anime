"""Video 4: same script as video 3, redone in the red-neon / black style of the grok reference
(black-filled figures with red neon outline, smoke). Faceless figures with a full neon head.
Clear (non-abstract) illustration per sentence, everything centred above the fixed ground line."""
import math, random
import skia
import engine as E
from engine import (RED, HOT, WHT, ICE, DRED, BLACK, C, SP, FP, clamp, sm, eo, ei, eio, bo, prog, lerp, mix, neon,
                    rrect, poly, spline, circ, dot, glow_dot, radial)
import scenes as SC

W, H = 1080, 1920
FLOOR = 1330
AUDIO_LEN = 74.97
B = [0.0, 6.54, 13.55, 22.91, 28.60, 34.80, 41.23, 50.48, 54.22, 60.23, 65.67, AUDIO_LEN]
TRW = 0.9          # transition window (camera pan between scenes)
PMO_IMG = None
CTA = {}


# ------------------------------------------------------------------ helpers
def person(cv, x, pose, s=1.0, f=1, kind='man', a=1.0, c=RED, child=False, curvy=False, ground=FLOOR, y=0,
           head=RED, tie=False, veil=False):
    J = E.fig(cv, x, y, pose, s, f, kind, 'none', ground=ground, a=a, c=c, child=child, curvy=curvy)
    hx, hy = J['head']
    R = J['R']
    if veil:
        v = poly([E.hp(J, -.2, .9), E.hp(J, -1.6, -2.6), E.hp(J, -.4, -2.2), E.hp(J, .2, .5)])
        neon(cv, v, HOT, 2.5 * s, a * .9, (60, 0, 8), .5)
    # full neon head, no face
    glow_dot(cv, hx, hy, R * 1.15, RED, .3 * a)
    dot(cv, hx, hy, R * .98, mix(RED, head, .5), a)
    dot(cv, hx - R * .22 * f, hy - R * .25, R * .42, HOT, a * .55)
    if tie:
        n = J['neck']
        p = E.add(n, J['up'], -E.LEN['T'] * s * .45)
        neon(cv, poly([E.add(n, J['up'], -6 * s), E.add(p, (J['up'][1], -J['up'][0]), 9 * s),
                       E.add(p, J['up'], -12 * s), E.add(p, (J['up'][1], -J['up'][0]), -9 * s)]), HOT, 2.5 * s, a,
             RED, .8)
    return J


def chest(J, s):
    return E.add(J['hip'], J['up'], E.LEN['T'] * s * .66)


def heart(cv, x, y, s, a=1.0, crack=0.0, dim=0.0, stone=0.0):
    col = mix(mix(RED, DRED, dim), (70, 60, 60), stone)
    radial(cv, x, y, 26 * s, col, .45 * a * (1 - dim))
    neon(cv, E.heart_path(x, y, s), mix(HOT, (120, 110, 110), stone), max(2.5, s * 1.4), a, col, .95)
    if crack > 0:
        pts = [(x, y - 9 * s), (x - 3 * s, y - 3 * s), (x + 3 * s, y + 2 * s), (x - 2 * s, y + 7 * s), (x, y + 12 * s)]
        n = max(2, int(len(pts) * crack + .99))
        cv.drawPath(poly(pts[:n], False), SP(BLACK, max(3, s * 1.2), a))


def phone_girl(cv, x, y, w, h, u, a=1.0, ang=0.0, glitch=0.0):
    cv.save()
    cv.translate(x, y)
    cv.rotate(ang)
    radial(cv, 0, 0, h * .9, RED, .35 * a)
    E.phone(cv, 0, 0, w, h, a, 0, 0, 1, None, .4)
    cv.save()
    cv.clipPath(rrect(-w * .4, -h * .42, w * .8, h * .84, w * .1), doAntiAlias=True)
    s_ = h * .8 / 600
    E.fig(cv, -6 * s_, 0, sexy_pose(u), s_, 1, 'woman', 'none', ground=h * .41, c=RED, fill=(40, 0, 6), curvy=2, a=a)
    if glitch > 0:
        rnd = random.Random(int(u * 24))
        for k in range(6):
            cv.drawRect(skia.Rect.MakeXYWH(-w * .4, rnd.uniform(-h * .4, h * .4), w * .8, rnd.uniform(3, 12)),
                        FP(mix(RED, WHT, rnd.random()), a * glitch))
    cv.restore()
    cv.restore()


SEXY = [dict(t=-8, hd=-10, a1=160, f1=265, a2=-35, f2=40, h1=-3, k1=4, h2=16, k2=-8),
        dict(t=-14, hd=-16, a1=165, f1=268, a2=172, f2=262, h1=-6, k1=2, h2=14, k2=-10),
        dict(t=-10, hd=-15, a1=165, f1=268, a2=-30, f2=30, h1=5, k1=-95, h2=-5, k2=-90)]


def sexy_pose(u):
    p = dict(SEXY[int(u / .8) % 3])
    sw = math.sin(u * 3.2)
    p['t'] += 6 * sw
    p['hd'] -= 5 * sw
    if p['k1'] > -50:
        p['h1'] -= 6 * sw
        p['h2'] += 5 * sw
    return p


def house(cv, x, s=1.0, a=1.0, lit=1.0):
    base = FLOOR
    body = poly([(x - 150 * s, base), (x - 150 * s, base - 200 * s), (x + 150 * s, base - 200 * s), (x + 150 * s, base)])
    neon(cv, body, RED, 6, a, (10, 0, 2))
    neon(cv, poly([(x - 185 * s, base - 195 * s), (x, base - 330 * s), (x + 185 * s, base - 195 * s)]), RED, 6, a,
         (10, 0, 2))
    for dx in (-95, 45):
        r = rrect(x + dx * s, base - 160 * s, 54 * s, 54 * s, 4)
        neon(cv, r, RED, 4, a, mix((20, 0, 3), (200, 40, 40), lit * .7))
        cv.drawLine(x + (dx + 27) * s, base - 160 * s, x + (dx + 27) * s, base - 106 * s, SP(RED, 3, a))
    neon(cv, rrect(x - 25 * s, base - 95 * s, 50 * s, 95 * s, 4), RED, 4, a, (20, 0, 3))
    dot(cv, x + 14 * s, base - 48 * s, 4 * s, HOT, a)


def car(cv, x, s=1.0, a=1.0):
    y = FLOOR
    p = poly([(x - 120 * s, y - 22 * s), (x - 120 * s, y - 56 * s), (x - 66 * s, y - 62 * s), (x - 34 * s, y - 100 * s),
              (x + 44 * s, y - 100 * s), (x + 82 * s, y - 62 * s), (x + 120 * s, y - 54 * s), (x + 120 * s, y - 22 * s)])
    neon(cv, p, RED, 5, a, (10, 0, 2))
    for dx in (-66, 68):
        circ(cv, x + dx * s, y - 22 * s, 22 * s, RED, 5, a, (20, 0, 3))


def tissues(cv, x, y, s=1.0, a=1.0):
    cv.save()
    cv.translate(x, y)
    cv.scale(s, s)
    neon(cv, rrect(-55, -44, 110, 44, 6), RED, 4, a, (14, 0, 2))
    neon(cv, spline([(-24, -42), (-32, -62), (-20, -82), (0, -74), (18, -88), (34, -68), (26, -42)], tension=.8), HOT, 3,
         a, (60, 0, 8))
    cv.restore()


def crumpled(cv, x, y, s=1.0, a=1.0):
    pts = [(x + math.cos(j * .9) * (16 + (j % 3) * 5) * s, y + math.sin(j * .9) * (13 + (j % 2) * 5) * s)
           for j in range(7)]
    neon(cv, spline(pts), HOT, 3, a, (60, 0, 8))


def speech(cv, x, y, w, h, tail, a=1.0, jag=False, u=0.0):
    if jag:
        pts = []
        n = 18
        for i in range(n):
            an = i / n * 2 * math.pi
            r = 1 if i % 2 == 0 else .78
            pts.append((x + math.cos(an) * w / 2 * r, y + math.sin(an) * h / 2 * r))
        p = poly(pts)
    else:
        p = skia.Path()
        p.addOval(skia.Rect(x - w / 2, y - h / 2, x + w / 2, y + h / 2))
    neon(cv, p, RED, 5, a, (20, 0, 3))
    neon(cv, poly([(x - 18, y + h / 2 - 10), tail, (x + 14, y + h / 2 - 8)]), RED, 5, a, (20, 0, 3))
    # scribbled "words" (no letters)
    rnd = random.Random(int(x + y))
    for k in range(3):
        yy = y - h * .22 + k * h * .22
        p = skia.Path()
        x0 = x - w * .3
        p.moveTo(x0, yy)
        for j in range(8):
            p.lineTo(x0 + (j + 1) * w * .075, yy + (math.sin(j * 2 + u * 10) * 7 if jag else rnd.uniform(-4, 4)))
        cv.drawPath(p, SP(HOT if jag else RED, 4, a))


def bolt(cv, x0, y0, x1, y1, seed, a=1.0, w=4, jag=22):
    rnd = random.Random(seed)
    pts = [(x0, y0)]
    for j in range(1, 7):
        q = j / 7
        pts.append((lerp(x0, x1, q) + rnd.uniform(-jag, jag), lerp(y0, y1, q) + rnd.uniform(-jag, jag)))
    pts.append((x1, y1))
    p = poly(pts, False)
    cv.drawPath(p, SP(RED, w * 2.2, a * .6))
    cv.drawPath(p, SP(WHT, w * .7, a))


def flame(cv, x, y, s, u, a=1.0):
    radial(cv, x, y - 80 * s, 200 * s, RED, .5 * a)
    neon(cv, E.flame_path(x, y, 1.4 * s, u, 1.1), HOT, 5, a, (110, 0, 8))
    neon(cv, E.flame_path(x, y + 12 * s, .8 * s, u + 2, 1), WHT, 3, a, (200, 30, 20))


def table(cv, x, w=240, h=150, a=1.0):
    neon(cv, rrect(x - w / 2, FLOOR - h, w, 16, 5), RED, 5, a, (14, 0, 2))
    for dx in (-w / 2 + 16, w / 2 - 16):
        cv.drawLine(x + dx, FLOOR - h + 16, x + dx, FLOOR, SP(RED, 6, a))


def chair(cv, x, f=1, a=1.0):
    neon(cv, rrect(x - 60, FLOOR - 170, 120, 16, 5), RED, 5, a, (14, 0, 2))
    cv.drawLine(x - 50, FLOOR - 154, x - 50, FLOOR, SP(RED, 6, a))
    cv.drawLine(x + 50, FLOOR - 154, x + 50, FLOOR, SP(RED, 6, a))
    bx = x - 58 * f
    cv.drawLine(bx, FLOOR - 170, bx, FLOOR - 360, SP(RED, 6, a))


def laptop(cv, x, y, s, u, a=1.0, glitch=0.0):
    cv.save()
    cv.translate(x, y)
    cv.scale(s, s)
    neon(cv, rrect(-110, -150, 220, 140, 10), RED, 5, a, (12, 0, 3))
    neon(cv, poly([(-130, -8), (130, -8), (146, 8), (-146, 8)]), RED, 5, a, (12, 0, 3))
    scr = rrect(-98, -140, 196, 120, 6)
    cv.save()
    cv.clipPath(scr, doAntiAlias=True)
    cv.drawPath(scr, FP((150, 20, 26), a))
    radial(cv, 0, -80, 140, HOT, .5 * a)
    E.fig(cv, 0, 0, sexy_pose(u), .2, 1, 'woman', 'none', ground=-22, c=RED, fill=(40, 0, 6), curvy=2, a=a)
    if glitch > 0:
        rnd = random.Random(int(u * 24))
        for k in range(5):
            cv.drawRect(skia.Rect.MakeXYWH(-98, rnd.uniform(-140, -30), 196, rnd.uniform(3, 12)),
                        FP(mix(RED, WHT, rnd.random()), a * glitch))
    cv.restore()
    cv.restore()


# ------------------------------------------------------------------ scenes (u = local time)
def s1_wedding(cv, u, D):
    # wedding arch + rings
    arch = skia.Path()
    arch.addArc(skia.Rect(300, 640, 780, 1120), 180, 180)
    cv.drawPath(arch, SP(RED, 7))
    for x in (300, 780):
        cv.drawLine(x, 880, x, FLOOR, SP(RED, 7))
    for k in range(7):
        an = math.pi + (k + .5) / 7 * math.pi
        heart(cv, 540 + math.cos(an) * 240, 880 + math.sin(an) * 240, 1.0, .9)
    ra = bo(prog(u, .4, .8))
    if ra > 0:
        for dx in (-30, 30):
            circ(cv, 540 + dx, 760, 36 * ra, HOT, 6, 1, None)
    groom = dict(STAND_, a2=40, f2=60, a1=-50, f1=-80, hd=lerp(0, -30, eio(prog(u, 2.3, 2.7)) * (1 - eio(prog(u, 3.3, 3.7)))))
    J = person(cv, 610, groom, .95, -1, 'man', tie=True)
    # phone hidden behind his back, buzzing with a curvy silhouette
    buzz = math.sin(u * 60) * 3 if 2.2 < u < 3.2 else 0
    hx, hy = J['ha1']
    phone_girl(cv, hx + 20 + buzz, hy - 20, 60, 104, u, sm(prog(u, 1.8, 2.2)), 10)
    sad = eio(prog(u, 3.8, 4.8))
    bride = dict(STAND_, a2=40, f2=60, hd=lerp(0, 26, sad), t=lerp(0, 8, sad))
    Wf = person(cv, 450, bride, .9, 1, 'woman', veil=True)
    c = chest(Wf, .9)
    heart(cv, c[0] + 6, c[1], 2.0, 1, crack=eio(prog(u, 3.6, 4.4)), dim=prog(u, 3.6, 6.0) * .8)


STAND_ = dict(E.STAND)


def s2_facade(cv, u, D):
    rev = eio(prog(u, 3.0, 3.6))
    radial(cv, 540, 850, 420, RED, .35 * (1 - rev))
    for i in range(14):
        an = i / 14 * 2 * math.pi + u * .1
        cv.drawLine(540 + math.cos(an) * 200, 860 + math.sin(an) * 200, 540 + math.cos(an) * 430,
                    860 + math.sin(an) * 430, SP(RED, 3, .45 * (1 - rev)))
    house(cv, 250, .75, 1 - .6 * rev, 1 - rev)
    car(cv, 850, .95, 1 - .6 * rev)
    proud = dict(t=-4, hd=-8, a1=-35, f1=-70, a2=35, f2=70, h1=8, k1=4, h2=-8, k2=-4)
    jerk = math.sin((u - 3.6) * 14) if u > 3.6 else 0
    puppet = dict(t=8 + 6 * jerk, hd=28, a1=150 + 20 * jerk, f1=170, a2=135 - 20 * jerk, f2=160,
                  h1=16 * jerk, k1=12 * jerk, h2=-14 * jerk, k2=0)
    J = person(cv, 545 + 8 * jerk * rev, E.lerp_pose(proud, puppet, rev), 1.0 - .1 * rev, 1, 'man', tie=True)
    if rev > 0:
        py = lerp(420, 640, eo(prog(u, 3.0, 3.6)))
        phone_girl(cv, 545, py, 130, 230, u, rev)
        st = eo(prog(u, 3.3, 3.7))
        for kk in ('ha1', 'ha2', 'hip'):
            x, y = J[kk]
            sx, sy = 545 + (x - 545) * .4, py + 110
            cv.drawLine(sx, sy, lerp(sx, x, st), lerp(sy, y, st), SP(HOT, 2.5, rev))


def s3_ignored(cv, u, D):
    # bed (left) with the wife offering her heart
    E.bed(cv, 90, 420, FLOOR - 120, head_h=140, foot_h=60, floor=FLOOR)
    E.pillow(cv, 140, FLOOR - 140, 110, 44)
    reach = eio(prog(u, .5, 1.5))
    give_up = eio(prog(u, 6.6, 7.4))
    wp = dict(t=-30 + 20 * give_up, hd=-6 + 30 * give_up, h1=86, k1=92, h2=82, k2=88, a1=40, f1=60,
              a2=lerp(25, 80, reach * (1 - give_up)), f2=lerp(45, 85, reach * (1 - give_up)))
    Wf = person(cv, 230, wp, .85, 1, 'woman', curvy=True, ground=None, y=FLOOR - 128)
    hx, hy = Wf['ha2']
    if u < 7.0:
        heart(cv, hx + 22, hy - 8, 2.0, 1, dim=prog(u, 4.0, 7.0) * .7)
    else:
        q = prog(u, 7.0, 7.4)
        heart(cv, hx + 22, lerp(hy - 8, FLOOR - 24, ei(q)), 2.0, 1, crack=prog(u, 7.4, 7.8), dim=.8)
    # husband at the desk, back turned, staring at a lustful laptop
    table(cv, 820, 270, 180)
    chair(cv, 610, -1)
    sit = dict(t=12, hd=10, h1=88, k1=0, h2=84, k2=2, a1=80, f1=95, a2=74, f2=90)
    J = person(cv, 625, sit, .95, 1, 'man', ground=None, y=FLOOR - 178)
    laptop(cv, 830, FLOOR - 182, .95, u, 1)
    tissues(cv, 925, FLOOR - 182, .8)
    for k, t0 in enumerate((3.5, 5.0, 6.3)):
        q = prog(u, t0, t0 + .5)
        if q > 0:
            crumpled(cv, lerp(930, 880 + k * 40, q), lerp(FLOOR - 230, FLOOR - 18, ei(q)), 1.1)
    if u > 4.0:
        rnd = random.Random(3)
        for k in range(16):
            ph = (u * .8 + k / 16) % 1
            x = lerp(J['hip'][0] + 20, 820, eio(ph))
            y = lerp(J['hip'][1] - 30, FLOOR - 270, eio(ph)) - math.sin(ph * math.pi) * 50
            glow_dot(cv, x, y, 7, HOT, sm(prog(u, 4.0, 4.6)) * (1 - ph * .5))


def s4_abusive(cv, u, D):
    raise_ = eio(prog(u, .3, .6))
    rage = dict(t=-6, hd=-10, a1=lerp(20, 165, raise_), f1=lerp(30, 200, raise_), a2=50, f2=30, h1=14, k1=4, h2=-14,
                k2=-4)
    shake = math.sin(u * 40) * 5 * raise_
    J = person(cv, 670 + shake, rage, 1.08, -1, 'man', head=HOT)
    for k in range(3):
        ph = ((u - .5) * 1.25 + k / 3) % 1
        if u < .5:
            break
        p = skia.Path()
        hx, hy = J['head']
        r = 60 + ph * 280
        p.addArc(skia.Rect(hx - r, hy - r, hx + r, hy + r), 150, 60)
        cv.drawPath(p, SP(HOT, 5, 1 - ph))
    tr = math.sin(u * 34) * 3
    person(cv, 330 + tr, dict(t=26, hd=34, a1=60, f1=150, a2=50, f2=140, h1=30, k1=-40, h2=10, k2=-60), .9, 1, 'woman')
    person(cv, 410 - tr, dict(t=10, hd=24, a1=120, f1=170, a2=100, f2=160), .55, -1, 'man', child=True)
    ba = sm(prog(u, 2.0, 2.5))
    if ba > 0:
        hx, hy = J['head']
        bx, by = hx + 120, hy - 90
        E.brain(cv, bx, by, .26, ba)
        px, py = 950, by + 120
        phone_girl(cv, px, py, 80, 140, u, ba, 6)
        E.chain(cv, (bx + 40, by + 30), (px - 30, py - 50), 24, ba, 4, sag=14 * math.sin(u * 3))
        for k in range(4):
            an = k / 4 * 2 * math.pi + u
            E.chain(cv, (bx + math.cos(an) * 70, by + math.sin(an) * 50),
                    (bx + math.cos(an + 1.6) * 70, by + math.sin(an + 1.6) * 50), 20, ba, 3.5)


def s5_lazy(cv, u, D):
    # sofa with the husband lying on his phone
    neon(cv, rrect(110, FLOOR - 150, 380, 90, 26), RED, 5, 1, (12, 0, 2))
    neon(cv, rrect(90, FLOOR - 230, 64, 170, 22), RED, 5, 1, (12, 0, 2))
    neon(cv, rrect(450, FLOOR - 200, 54, 140, 20), RED, 5, 1, (12, 0, 2))
    lie = dict(t=86, hd=-40, h1=-88, k1=-95, h2=-80, k2=-120, a1=150, f1=200, a2=-150, f2=-170)
    J = person(cv, 250, lie, .8, 1, 'man', ground=None, y=FLOOR - 172)
    ph = J['ha1']
    phone_girl(cv, ph[0], ph[1] - 30, 44, 76, u, 1, 160)
    hx, hy = J['head']
    ca = sm(prog(u, .6, .9)) * (1 - prog(u, 3.4, 3.7))
    if ca > 0:
        speech(cv, hx + 40, hy - 150, 170, 100, (hx + 20, hy - 60), ca, jag=True, u=u)
    # wife carrying a growing pile of burdens
    n = min(1 + int(max(u - 1.0, 0) / .8), 5)
    bend = n * 5
    W_ = person(cv, 800, dict(t=bend, hd=bend * .7, a1=150, f1=172, a2=140, f2=166, h1=8, k1=-6, h2=-8, k2=-10), .92,
                -1, 'woman')
    top = (W_['ha1'][0] + W_['ha2'][0]) / 2, min(W_['ha1'][1], W_['ha2'][1])
    for k in range(n):
        y = top[1] - 18 - k * 44
        drop = 1 - eo(prog(u, 1.0 + (k - 1) * .8 if k else 0, 1.25 + (k - 1) * .8 if k else .2))
        neon(cv, rrect(top[0] - 66 + (k % 2) * 10, y - 40 - drop * 120, 132 - (k % 3) * 12, 40, 6), RED, 4, 1,
             (20, 0, 3))
        for j in range(2):
            cv.drawLine(top[0] - 50 + j * 50, y - 30 - drop * 120, top[0] - 50 + j * 50, y - 10 - drop * 120,
                        SP(DRED, 3))
    # she speaks up -> he blocks her with a raised hand
    if u > 3.8:
        sa = sm(prog(u, 3.8, 4.1))
        speech(cv, 660, 760, 120, 80, (720, 820), sa)
        ba = bo(prog(u, 4.4, 4.7))
        if ba > 0:
            cx, cy = hx + 110, hy - 40
            circ(cv, cx, cy, 46 * ba, HOT, 6, 1, (60, 0, 6))
            cv.drawLine(cx - 26 * ba, cy - 26 * ba, cx + 26 * ba, cy + 26 * ba, SP(WHT, 7))
            cv.drawLine(cx - 26 * ba, cy + 26 * ba, cx + 26 * ba, cy - 26 * ba, SP(WHT, 7))


def s6_rage(cv, u, D):
    hit = 2.3
    up = eio(prog(u, 2.7, 3.0))
    chair(cv, 640, -1)
    sit = dict(t=10, hd=22, h1=88, k1=0, h2=84, k2=2, a1=60, f1=130, a2=55, f2=125)
    stand = dict(t=-8, hd=-12, a1=165, f1=205, a2=150, f2=195, h1=16, k1=4, h2=-16, k2=-4)
    shake = math.sin(u * 45) * 7 * up
    if up < .5:
        J = person(cv, 650, sit, 1.0, -1, 'man', ground=None, y=FLOOR - 178)
        ph = ((J['ha1'][0] + J['ha2'][0]) / 2, (J['ha1'][1] + J['ha2'][1]) / 2)
        phone_girl(cv, ph[0] - 12, ph[1] - 28, 64, 110, u, 1, -10, glitch=prog(u, hit, hit + .2))
    else:
        hx = 650 + shake
        flame(cv, hx, FLOOR - 300, 1.4 + .2 * math.sin(u * 9), u, up)
        J = person(cv, hx, stand, 1.0, -1, 'man', head=WHT)
        q = prog(u, 2.8, 3.4)
        E.phone(cv, lerp(600, 760, q), lerp(1000, FLOOR - 20, ei(q)), 44, 76, 1, q * 300)
        rnd = random.Random(int(u * 14))
        hxh, hyh = J['head']
        for k in range(5):
            an = rnd.uniform(-math.pi, 0)
            bolt(cv, hxh + math.cos(an) * 90, hyh + math.sin(an) * 90, hxh + math.cos(an) * 230,
                 hyh + math.sin(an) * 200, int(u * 14) + k, up)
    # child with a ball (the trivial disturbance)
    bx = lerp(250, 560, eo(prog(u, 1.4, hit)))
    if u > hit:
        bx = 560 - eo(prog(u, hit, hit + .6)) * 120
    circ(cv, bx, FLOOR - 24, 24, HOT, 5, 1, (60, 0, 6))
    cx = lerp(80, 260, eo(prog(u, .3, 1.4)))
    pose = dict(SC.walk(u, 8, 18), t=4) if u < 1.4 else (dict(STAND_, a2=60, f2=40) if u < 2.8 else
                                                          dict(t=20, hd=30, a1=120, f1=170, a2=100, f2=160))
    person(cv, cx, pose, .56, 1, 'man', child=True)


def s7_insults(cv, u, D):
    yell = dict(t=-10, hd=-14, a1=100, f1=95, a2=-30, f2=-10, h1=12, k1=4, h2=-12, k2=-4)
    J = person(cv, 720, yell, 1.05, -1, 'man', head=HOT)
    hx, hy = J['head']
    speech(cv, hx - 40, hy - 170, 200, 120, (hx - 20, hy - 60), sm(prog(u, .1, .4)), jag=True, u=u)
    # overturned table as a hiding place, family trembling behind it
    tr = math.sin(u * 34) * 3
    person(cv, 300 + tr, dict(t=20, hd=28, a1=50, f1=140, a2=60, f2=150, h1=30, k1=-40, h2=10, k2=-60), .9, 1, 'woman')
    person(cv, 380 - tr, dict(t=10, hd=24, a1=120, f1=160, a2=100, f2=160), .55, 1, 'man', child=True)
    person(cv, 220 + tr, dict(t=10, hd=24, a1=120, f1=160, a2=100, f2=160), .5, 1, 'woman', child=True)
    neon(cv, rrect(430, FLOOR - 190, 26, 190, 6), RED, 5, 1, (14, 0, 2))
    cv.drawLine(456, FLOOR - 170, 520, FLOOR - 170, SP(RED, 6))
    cv.drawLine(456, FLOOR - 40, 520, FLOOR - 40, SP(RED, 6))
    # insults hurled: jagged shards fly from his mouth and smash against the table
    for k in range(5):
        st = .5 + k * 1.0
        q = prog(u, st, st + .5)
        if 0 < q < 1:
            x = lerp(hx - 60, 470, eo(q))
            y = lerp(hy - 20, FLOOR - 120 - (k % 3) * 40, eo(q))
            bolt(cv, x + 50, y - 14, x - 30, y + 14, k * 7, 1, 4, 10)
        if 0 < prog(u, st + .5, st + .9) < 1:
            r = prog(u, st + .5, st + .9)
            circ(cv, 470, FLOOR - 120 - (k % 3) * 40, 10 + r * 60, HOT, 4, 1 - r, None)
    # his conscience dies: the heart turns to stone and crumbles
    c = chest(J, 1.05)
    k = prog(u, 5.6, 7.0)
    if u < 7.6:
        heart(cv, c[0] - 6, c[1], 1.8, 1 - prog(u, 7.2, 7.6), crack=eio(prog(u, 6.0, 7.0)), dim=k, stone=k)
    if u > 7.2:
        rnd = random.Random(2)
        for i in range(16):
            q = clamp((u - 7.2) / 1.6 - rnd.random() * .2)
            dot(cv, c[0] + rnd.uniform(-30, 30) + q * 30, c[1] + q * q * 300 * rnd.random(), 4, (120, 100, 100), 1 - q)


def s8_shrink(cv, u, D):
    sh = eio(prog(u, .7, 2.6))
    cx, cy, s = 560, 940, 1.05
    cv.save()
    cv.translate(cx - 270 * s, 0)
    cv.scale(1 - .22 * sh, 1 - .06 * sh)
    cv.translate(-(cx - 270 * s), 0)
    pulse = .6 + .4 * math.sin(u * 7)
    E.brain(cv, cx, cy, s, 1, [(180, -60, 120, 100, lerp(1.2 * pulse, .25, sh), mix(WHT, DRED, sh))],
            crack=prog(u, 1.8, 2.8), dim=.5 * sh)
    cv.restore()
    rx = cx - 270 * s + (180 + 270) * s * (1 - .22 * sh)
    ry = cy - 60 * s
    for k in range(3):
        an = (k - 1) * .6
        d = lerp(190, 140, sh) + 20 * math.sin(u * 8)
        x, y = rx + math.cos(an) * d, ry + math.sin(an) * d
        cv.save()
        cv.translate(x, y)
        cv.rotate(math.degrees(an) + 180)
        cv.drawPath(poly([(-20, -28), (10, 0), (-20, 28)], False), SP(HOT, 8))
        cv.restore()


def s9_frozen(cv, u, D):
    fr = eio(prog(u, .3, 2.0))
    slump = eio(prog(u, 3.0, 3.8))
    J = person(cv, 540, E.lerp_pose(dict(t=-3, hd=-6), dict(t=22, hd=34), slump), .9, 1, 'man',
               c=mix(RED, ICE, fr * .5), head=mix(RED, ICE, fr))
    hx, hy = J['head']
    bx, by = 540, hy - 220
    E.brain(cv, bx, by, .38, 1, dim=.4)
    if fr > 0:
        rnd = random.Random(6)
        for k in range(14):
            an = rnd.uniform(0, 6.28)
            x, y = bx + math.cos(an) * 110, by + math.sin(an) * 80
            L = fr * 60
            cv.drawLine(x, y, x - math.cos(an) * L, y - math.sin(an) * L, SP(ICE, 3, fr))
            cv.drawLine(x - math.cos(an) * L * .5, y - math.sin(an) * L * .5,
                        x - math.cos(an + .8) * L * .8, y - math.sin(an + .8) * L * .8, SP(ICE, 2, fr))
    c = chest(J, .9)
    heart(cv, c[0] + 4, c[1], 1.6, 1, dim=fr * .6)
    if fr > 0:
        neon(cv, E.heart_path(c[0] + 4, c[1], 1.6), ICE, 3, fr, None)
    # crown slips off and shatters
    fall = prog(u, 3.2, 3.8)
    if fall < 1:
        E.neon(cv, E.crown_path(hx + 80 * fall, lerp(hy - 75, FLOOR - 40, ei(fall)), .5), WHT, 5, 1, RED, .5)
    else:
        lt = u - 3.8
        rnd = random.Random(4)
        for k in range(12):
            vx, vy = rnd.uniform(-260, 260), rnd.uniform(-420, -120)
            x = hx + 80 + vx * lt
            y = FLOOR - 40 + vy * lt + 900 * lt * lt
            if y < FLOOR:
                neon(cv, poly([(x - 8, y - 3), (x + 5, y - 8), (x + 8, y + 4), (x - 2, y + 8)]), WHT, 2, 1 - lt / 2,
                     RED, .5)
    # family walks away
    wx = lerp(260, -160, eio(prog(u, 4.0, 6.2)))
    if wx > -150:
        person(cv, wx, dict(SC.walk(u, 6, 16), t=4), .85, -1, 'woman')
        person(cv, wx + 90, dict(SC.walk(u + .3, 7, 14), t=4), .52, -1, 'man', child=True)


def s10_burn(cv, u, D):
    burn = eio(prog(u, .6, 2.6))
    col = eio(prog(u, 3.2, 4.6))
    a = 1 - col
    if a > 0:
        house(cv, 540, 1.25, a, 1 - burn)
        for dx in (-95, 45):
            dot(cv, 540 + (dx + 27) * 1.25, FLOOR - 120 * 1.25, 9, HOT, a * (1 - burn))
    if burn > 0:
        for k, (dx, s_) in enumerate(((-130, .8), (0, 1.3), (140, .9))):
            flame(cv, 540 + dx, FLOOR - 20, s_ * (burn * (1 - col * .8) + .1), u + k, burn)
    if u > 2.0:
        rnd = random.Random(8)
        for k in range(50):
            ph = (u * .25 + rnd.random()) % 1
            x = 540 + rnd.uniform(-280, 280) + math.sin(u + k) * 20
            y = FLOOR - 40 - ph * 600
            dot(cv, x, y, 2.5 + rnd.random() * 2, (150, 120, 120), (1 - ph) * sm(prog(u, 2.0, 3.0)))
    if col > 0:
        p = spline([(300, FLOOR), (420, FLOOR - 50 * col), (540, FLOOR - 80 * col), (660, FLOOR - 40 * col),
                    (780, FLOOR)], closed=False)
        neon(cv, p, RED, 5, col, (40, 10, 10))


def s11_cta(cv, u, D):
    pa = 1 - sm(prog(u, 3.3, 3.8))
    if pa > 0:
        E.brain(cv, 540, 930, 1.05, .45 * pa)
        SC.network(cv, 540, 910, .95, u, eio(prog(u, .2, 2.6)) * 1.05, pa)
    pb = sm(prog(u, 3.4, 3.8))
    if pb > 0:
        k = bo(prog(u, 3.4, 4.0)) * .84
        px, py = 540, 990
        radial(cv, px, py, 520, RED, .4 * pb)
        cv.save()
        cv.translate(px, py)
        cv.scale(k, k)
        E.phone(cv, 0, 0, 380, 680, pb, img='blank')
        cv.restore()
        CTA['pos'] = (px, py, k, pb)
        aa = sm(prog(u, 4.3, 4.7))
        if aa > 0:
            bounce = abs(math.sin(u * 5)) * 24
            E.arrow_up(cv, px, py - 340 * k - 40 - bounce, .55, aa)
        ta = eio(prog(u, 5.2, 5.7)) * (1 - eio(prog(u, 7.6, 8.2)))
        if ta > 0:
            tap = prog(u, 5.8, 6.0)
            press = math.sin(tap * math.pi) * 22
            fx = lerp(px + 520, px + 80, ta) - press * .3
            fy = py + 200 + press
            SC.limb(cv, [(px + 700, py + 300), (px + 330, py + 260), (fx, fy)], 26)
            circ(cv, fx, fy, 22, RED, 5)
            tr = prog(u, 5.9, 6.7)
            if 0 < tr < 1:
                for r in range(3):
                    q = clamp(tr * 1.3 - r * .15)
                    circ(cv, fx, fy, 14 + q * 150, WHT, 4, 1 - q, None)


SCENES = [s1_wedding, s2_facade, s3_ignored, s4_abusive, s5_lazy, s6_rage, s7_insults, s8_shrink, s9_frozen,
          s10_burn, s11_cta]
