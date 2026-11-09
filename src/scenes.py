"""Scene definitions, one per sentence (or half sentence) of the narration."""
import math, random
import skia
from engine import *

AUDIO_LEN = 68.21
# scene boundaries aligned to pauses in the voice-over
B = [0.0, 4.50, 8.12, 14.05, 17.80, 22.15, 28.12, 33.55, 38.39, 45.33, 48.50, 51.52, 57.01, 61.20, 63.10, AUDIO_LEN]
TRANS = ['zoom', 'wipe', 'zoom', 'slide', 'glitch', 'zoom', 'spin', 'wipe', 'flash', 'zoom', 'slide', 'spin',
         'flash', 'zoom']
TR = 0.56

PMO_IMG = None


def limb(cv, pts, w=20, c=RED, a=1.0, ol=5):
    p = poly(pts, False)
    cv.drawPath(p, SP(c, w + 2 * ol, a))
    cv.drawPath(p, SP(BLACK, w, 1))


KNEEL = dict(t=18, hd=30, a1=40, f1=130, a2=30, f2=125, h1=78, k1=-96, h2=72, k2=-100)
HUG = dict(t=26, hd=36, a1=55, f1=105, a2=48, f2=100, h1=132, k1=10, h2=124, k2=4)


def walk(u, speed=6.0, amp=24):
    ph = u * speed
    s = math.sin(ph)
    return dict(h1=amp * s, k1=amp * s - max(0, -math.cos(ph)) * 30, h2=-amp * s,
                k2=-amp * s - max(0, math.cos(ph)) * 30, a1=-amp * .8 * s, f1=-amp * .6 * s + 10,
                a2=amp * .8 * s, f2=amp * .6 * s + 10)


# ------------------------------------------------------------------ 1 crowd
def s_crowd(cv, u, D):
    z = lerp(1.32, 1.0, eo(u / 3.2))
    cv.save()
    cv.translate(540, 1150)
    cv.scale(z, z)
    cv.translate(-540, -1150)
    floor_line(cv)
    # giant phone + rays
    fl = .5 + .5 * math.sin(u * 19) * math.sin(u * 7)
    sh = skia.GradientShader.MakeLinear([skia.Point(0, 780), skia.Point(0, 1480)],
                                        [C(RED, .32 + .1 * fl), C(RED, 0)])
    cv.drawPath(poly([(400, 790), (680, 790), (1100, 1480), (-20, 1480)]), skia.Paint(AntiAlias=True, Shader=sh))
    radial(cv, 540, 520, 520, RED, .35 + .15 * fl)
    phone(cv, 540, 520, 300, 520, glow=.85, flick=fl)
    tri = poly([(505, 450), (505, 590), (615, 520)])
    neon(cv, tri, RED, 6, 1, (90, 0, 6))
    # rows
    rnd = random.Random(4)
    for row, (gy, sc, n) in enumerate(((1190, .3, 9), (1310, .44, 6))):
        cv.drawLine(-100, gy, W + 100, gy, SP(RED, 2, .35))
        for i in range(n):
            x = (i + .5) * W / n + (row * 40)
            f = 1 if x < 540 else -1
            bob = math.sin(u * 3 + i * 1.7 + row) * 4
            fig(cv, x, gy, dict(KNEEL, hd=KNEEL['hd'] + bob), sc, f, 'man', 'none', ground=gy,
                phone=dict(glow=1, w=40, h=66, beam=.25), a=.6 + .15 * row)
    for i, x in enumerate((150, 540, 930)):
        f = 1 if x < 540 else -1
        bob = math.sin(u * 3 + i) * 5
        pose = dict(KNEEL, hd=KNEEL['hd'] + bob)
        ex = 'sad'
        ph = dict(glow=1, w=44, h=74, beam=.4)
        sx = x
        if i == 1:
            k = eio(prog(u, 2.5, 3.1))
            pose = lerp_pose(pose, HUG, k)
            if k > .5:
                ph = None
                ex = 'fear'
                sx = x + math.sin(u * 60) * 4 * k
            f = 1
        fig(cv, sx, FLOOR, pose, .85 if i == 1 else .72, f, 'man', ex, ground=FLOOR, phone=ph)
    cv.restore()


# ------------------------------------------------------------------ 2 bathroom door
def s_door(cv, u, D):
    floor_line(cv)
    # door frame
    neon(cv, rrect(270, 610, 460, FLOOR - 610 + 6, 14), RED, 6, 1, (8, 0, 2))
    door = rrect(300, 640, 400, FLOOR - 640, 10)
    neon(cv, door, RED, 5, 1)
    # light leaking under door
    fl = .6 + .4 * math.sin(u * 23) * math.sin(u * 5.3)
    radial(cv, 500, FLOOR - 4, 240, WHT, .25 * fl)
    # frosted window with husband silhouette
    win = rrect(360, 700, 280, 330, 14)
    cv.save()
    cv.clipPath(win, doAntiAlias=True)
    cv.drawPath(win, FP((30, 0, 4)))
    a = sm(prog(u, .1, .6))
    radial(cv, 560, 840, 300, RED, .65 * a * fl)
    fig(cv, 470 - 60 * (1 - a), 1150, dict(t=12, hd=20, a1=40, f1=150, a2=35, f2=140), .95, 1, 'man', 'crazy',
        a=a, phone=dict(glow=1, beam=1.2 * fl), eyeglow=.3 * fl)
    cv.restore()
    neon(cv, win, RED, 5, 1, None)
    for k in range(3):
        cv.drawLine(380 + k * 30, 730 + k * 20, 430 + k * 30, 700 + k * 20, SP(WHT, 2, .25))
    # knob + bolt lock
    circ(cv, 660, 1120, 20, RED, 5)
    lk = eo(prog(u, .75, .9))
    neon(cv, rrect(640 + 50 * lk, 1060, 70, 18, 6), WHT, 4, 1, RED, .6)
    # padlock pop
    pa = bo(prog(u, .9, 1.25)) * (1 - prog(u, 2.6, 3.0))
    if pa > 0:
        cv.save()
        cv.translate(500, 560)
        cv.scale(pa, pa)
        neon(cv, rrect(-55, -20, 110, 90, 14), WHT, 6, 1, RED, .5)
        p = skia.Path()
        sh = 1 - lk
        p.moveTo(-32, -20)
        p.lineTo(-32, -55)
        p.arcTo(skia.Rect(-32, -92, 32, -28), 180, 180, False)
        p.lineTo(32, -20 - 18 * sh)
        cv.drawPath(p, SP(WHT, 8))
        dot(cv, 0, 22, 9, BLACK)
        cv.restore()
    # wife
    wx = lerp(1180, 870, eo(prog(u, .15, 1.5)))
    walking = u < 1.5
    pose = walk(u, 7) if walking else dict(STAND)
    pose['t'] = 4
    ex = 'sad'
    if u > 1.5:
        kk = prog(u, 1.55, 1.8)
        knock = math.sin((u - 1.8) * 22) * 10 if 1.8 < u < 2.65 else 0
        pose = lerp_pose(dict(STAND, t=4), dict(t=6, a2=105, f2=95 + knock, a1=-6, f1=10), eio(kk))
        if u > 2.75:
            pose = lerp_pose(pose, dict(t=14, hd=32, a2=40, f2=150, a1=-4, f1=8), eio(prog(u, 2.75, 3.2)))
            ex = 'cry'
    fig(cv, wx, FLOOR, pose, 1.0, -1, 'woman', ex, ground=FLOOR, u=u)


# ------------------------------------------------------------------ 3 bed at night
def window(cv, u, sun=0.0, moon=1.0):
    win = rrect(140, 300, 300, 300, 16)
    cv.save()
    cv.clipPath(win, doAntiAlias=True)
    cv.drawPath(win, FP((12, 0, 3)))
    if sun > 0:
        radial(cv, 290, 600 - 170 * sun, 260, HOT, .55 * sun)
        circ(cv, 290, 610 - 170 * sun, 55, WHT, 5, sun, HOT, .4)
    for i in range(7):
        x, y = 170 + (i * 97) % 250, 330 + (i * 61) % 220
        dot(cv, x, y, 2.5, WHT, (.4 + .4 * math.sin(u * 3 + i)) * moon)
    my = 400 + (1 - moon) * 300
    circ(cv, 350, my, 48, HOT, 4, moon, (60, 0, 6))
    dot(cv, 372, my - 14, 44, (12, 0, 3), 1)
    cv.restore()
    neon(cv, win, RED, 6, 1, None)
    cv.drawLine(290, 300, 290, 600, SP(RED, 4))
    cv.drawLine(140, 450, 440, 450, SP(RED, 4))


def s_bed(cv, u, D):
    floor_line(cv)
    window(cv, u)
    bed(cv, 120, 960, 1300)
    pillow(cv, 200, 1270)
    # wife half sitting, reaching
    reach = eio(prog(u, .3, 1.2)) * (1 - eio(prog(u, 3.2, 3.9)))
    wpose = dict(t=-38, hd=10, h1=86, k1=92, h2=82, k2=88, a1=40, f1=60,
                 a2=lerp(30, 82, reach), f2=lerp(60, 92, reach))
    fig(cv, 300, 1290, wpose, .95, 1, 'woman', 'sad' if u < 3.4 else 'cry', u=u)
    # thought bubble
    ba = sm(prog(u, 2.0, 2.6))
    tug = eio(prog(u, 3.2, 3.6))
    jerk = math.sin(max(0, u - 3.2) * 18) * 6 * (1 - prog(u, 3.6, 4.4)) if u > 3.2 else 0
    hpose = dict(t=lerp(14, -6, tug), hd=lerp(22, -26, tug) + jerk, h1=82, k1=6, h2=78, k2=0,
                 a1=lerp(165, 20, tug), f1=lerp(-80, 50, tug), a2=lerp(20, 40, tug), f2=lerp(40, 60, tug))
    rub = math.sin(u * 8) * 8 if u < 3.2 else 0
    hpose['f1'] += rub
    J = fig(cv, 760, 1290, hpose, .95, 1, 'man', 'tired' if u < 3.3 else 'crazy', eyeglow=.4 * tug)
    if ba > 0:
        bx, by = 720, 560
        hx, hy = J['head']
        for k, r in enumerate((14, 22, 32)):
            t = (k + 1) / 4
            circ(cv, lerp(hx + 40, bx, t), lerp(hy - 60, by + 170, t), r * ba, RED, 4, ba)
        cl = [(bx + math.cos(i / 9 * 2 * math.pi) * 200, by + math.sin(i / 9 * 2 * math.pi) * 135, 82 * ba)
              for i in range(9)] + [(bx, by, 170 * ba)]
        blobs(cv, cl, RED, 6, ba)
        # curvy silhouette (fantasy)
        sway = math.sin(u * 2.5) * 6
        fp = dict(t=-8 + sway * .4, hd=-10, a1=160, f1=265, a2=-35, f2=40, h1=-3, k1=4, h2=16, k2=-8)
        fig(cv, bx - 5, by + 70, fp, .56, 1, 'woman', 'none', c=WHT, fill=(70, 0, 8), a=ba)
        glow_dot(cv, bx, by, 150, RED, .25 * ba)
    if tug > 0:
        hx, hy = J['head']
        chain(cv, (hx + 20, hy - 30), (690, 700), 30, tug, 4)


# ------------------------------------------------------------------ 4 wife crying alone
def s_cry(cv, u, D):
    floor_line(cv)
    k = prog(u, .2, D - .2)
    window(cv, u, sun=eio(prog(u, 1.4, 3.4)), moon=1 - eio(prog(u, .2, 2.0)))
    # clock spinning
    cx, cy = 760, 520
    circ(cv, cx, cy, 120, RED, 6)
    for i in range(12):
        a = i / 12 * 2 * math.pi
        cv.drawLine(cx + math.cos(a) * 100, cy + math.sin(a) * 100, cx + math.cos(a) * 112, cy + math.sin(a) * 112,
                    SP(RED, 4))
    hm = u * 9
    line(cv, cx, cy, cx + math.sin(hm) * 90, cy - math.cos(hm) * 90, WHT, 5)
    line(cv, cx, cy, cx + math.sin(hm / 12) * 58, cy - math.cos(hm / 12) * 58, WHT, 8)
    dot(cv, cx, cy, 9, WHT)
    bed(cv, 120, 960, 1300)
    pillow(cv, 200, 1270)
    sob = math.sin(u * 9) * 3
    pose = dict(t=8 + sob, hd=34 + sob, a1=70, f1=150, a2=62, f2=145, h1=122, k1=12, h2=116, k2=6)
    J = fig(cv, 300, 1296, pose, 1.0, 1, 'woman', 'cry', u=u)
    cx_, cy_ = (J['ha1'][0] + J['kn1'][0]) / 2 + 6, (J['ha1'][1] + J['kn1'][1]) / 2 + 4
    pillow(cv, cx_, cy_, 120, 150, 1, 8 + sob)
    limb(cv, [J['el1'], J['ha1']], 14, ol=4)
    for i in range(3):
        ph = (u * .9 + i * .33) % 1
        hx, hy = J['head']
        dot(cv, hx + 14 + i * 6, hy + 20 + ph * 140, 5 * (1 - ph * .5), WHT, 1 - ph)


# ------------------------------------------------------------------ 5 toilet flush
def s_toilet(cv, u, D):
    floor_line(cv)
    # tank
    neon(cv, rrect(560, 760, 210, 300, 18), RED, 6)
    lev = eio(prog(u, .55, .75)) * (1 - eio(prog(u, 1.3, 1.6)))
    cv.save()
    cv.translate(752, 800)
    cv.rotate(lev * 28)
    neon(cv, rrect(0, -9, 60, 18, 8), WHT, 4, 1, RED, .5)
    cv.restore()
    body = spline([(330, 1080), (545, 1060), (770, 1075), (770, 1160), (700, 1270), (690, FLOOR - 4),
                   (480, FLOOR - 4), (470, 1270), (360, 1170)])
    neon(cv, body, RED, 6)
    # bowl opening (3/4 view) with vortex
    cx, cy, rx, ry = 545, 1075, 205, 60
    ov = skia.Path()
    ov.addOval(skia.Rect(cx - rx, cy - ry, cx + rx, cy + ry))
    neon(cv, ov, RED, 6, 1, (25, 0, 4))
    flush = prog(u, .7, D)
    cv.save()
    cv.clipPath(ov, doAntiAlias=True)
    spin = u * (2 + 9 * flush)
    for k in range(5):
        p = skia.Path()
        for j in range(40):
            th = spin + k * 1.256 + j * .18
            r = (1 - j / 40)
            x, y = cx + math.cos(th) * rx * r, cy + math.sin(th) * ry * r
            (p.moveTo if j == 0 else p.lineTo)(x, y)
        cv.drawPath(p, SP(HOT, 3, .25 + .6 * min(flush * 2, 1)))
    radial(cv, cx, cy, 60, WHT, .5 * flush)
    cv.restore()
    # glowing droplets spiralling in
    rnd = random.Random(9)
    for i in range(46):
        st = .9 + rnd.random() * 2.6
        lt = (u - st) / 1.2
        if 0 < lt < 1:
            th = rnd.random() * 6.28 + lt * 9
            r = (1 - eo(lt))
            sx, sy = rnd.uniform(200, 900), rnd.uniform(500, 900)
            ex, ey = cx + math.cos(th) * rx * r, cy + math.sin(th) * ry * r
            mx = lerp(sx, ex, eo(min(lt * 2, 1)))
            my = lerp(sy, ey, eo(min(lt * 2, 1)))
            glow_dot(cv, mx, my, 9, HOT, 1 - lt * .6)
            dot(cv, mx, my, 4, WHT, 1 - lt * .5)
    # illusion ghost dissolving
    ga = sm(prog(u, 2.1, 2.6)) * (1 - prog(u, 3.3, 4.1))
    if ga > 0:
        fp = dict(t=-8, hd=-10, a1=160, f1=265, a2=-35, f2=40, h1=-3, k1=4, h2=16, k2=-8)
        fig(cv, 300, 900, fp, .78, 1, 'woman', 'none', c=WHT, fill=(60, 0, 8), a=ga * .9)
    dis = prog(u, 3.0, 4.2)
    if dis > 0:
        rnd = random.Random(5)
        for i in range(60):
            x0, y0 = 300 + rnd.uniform(-100, 100), 480 + rnd.uniform(0, 520)
            q = eio(min(dis * 1.3 - rnd.random() * .3, 1))
            if q <= 0:
                continue
            th = q * 7 + i
            x = lerp(x0, cx + math.cos(th) * 30, q)
            y = lerp(y0, cy, q)
            dot(cv, x, y, 3.5, WHT, 1 - q * .7)
    # husband pressing lever
    reach = eio(prog(u, .2, .6)) * (1 - eio(prog(u, 1.6, 2.1)))
    pose = dict(t=6, hd=lerp(15, 30, prog(u, 1.6, 2.2)), a2=lerp(10, 98, reach), f2=lerp(5, 92, reach) + lev * 8,
                a1=-8, f1=-4)
    fig(cv, 990, FLOOR, pose, 1.0, -1, 'man', 'blank' if u < 2 else 'sad', ground=FLOOR)


# ------------------------------------------------------------------ 6 medical
def hud(cv, u, a=1.0):
    for x in range(0, W + 1, 90):
        cv.drawLine(x, 0, x, H, SP(RED, 1.2, .07 * a))
    for y in range(0, H + 1, 90):
        cv.drawLine(0, y, W, y, SP(RED, 1.2, .07 * a))
    for (x, y, sx, sy) in ((60, 160, 1, 1), (W - 60, 160, -1, 1), (60, H - 160, 1, -1), (W - 60, H - 160, -1, -1)):
        cv.drawPath(poly([(x, y + 70 * sy), (x, y), (x + 70 * sx, y)], False), SP(RED, 5, a))


def s_medical(cv, u, D):
    hud(cv, u)
    floor_line(cv, 1500, .7)
    zap = prog(u, 2.4, 3.4)
    J = joints(540, 1000, {}, 1.25, 1)
    J = fig(cv, 540, 1500, dict(t=0, hd=-4, a1=8, f1=4, a2=-8, f2=-4), 1.25, 1, 'man', 'sad' if zap > .3 else 'blank',
            ground=1500, fill=(18, 0, 4))
    hip, neck = J['hip'], J['neck']
    # spine + nerves
    n = 14
    for i in range(n):
        y = lerp(neck[1] + 10, hip[1] - 4, i / (n - 1))
        x = lerp(neck[0], hip[0], i / (n - 1))
        dead = i > n * (1 - zap * .7)
        dot(cv, x, y, 6, DRED if dead else WHT, .9)
    nerves = [[J['sh'], J['el1'], J['ha1']], [J['sh'], J['el2'], J['ha2']], [hip, J['kn1'], J['an1']],
              [hip, J['kn2'], J['an2']]]
    for k, pts in enumerate(nerves):
        dead = k >= 2 and zap > .4
        cv.drawPath(poly(pts, False), SP(DRED if dead else HOT, 3, .9))
        if not dead:
            ph = (u * .9 + k * .25) % 1
            seg = 0 if ph < .5 else 1
            q = ph * 2 - seg
            p0, p1 = pts[seg], pts[seg + 1]
            glow_dot(cv, lerp(p0[0], p1[0], q), lerp(p0[1], p1[1], q), 10, WHT, 1)
    # pelvis zaps
    if 0 < zap < 1:
        rnd = random.Random(int(u * 30))
        for k in range(4):
            x, y = hip
            pts = [(x, y)]
            ang = rnd.uniform(0, 6.28)
            for j in range(6):
                x += math.cos(ang) * 26 + rnd.uniform(-18, 18)
                y += math.sin(ang) * 26 + rnd.uniform(-18, 18)
                pts.append((x, y))
            cv.drawPath(poly(pts, False), SP(WHT, 4, 1))
        radial(cv, hip[0], hip[1], 160, RED, .6 * (1 - zap))
    # wilting arrow at pelvis
    bend = eio(prog(u, 3.0, 4.0))
    ax, ay = hip[0] + 40, hip[1] + 10
    pts = []
    for i in range(12):
        t = i / 11
        ang = math.radians(-60 + bend * 140 * t * t)
        if i == 0:
            x, y = ax, ay
        else:
            x += math.cos(ang) * 13
            y += math.sin(ang) * 13
        pts.append((x, y))
    cv.drawPath(poly(pts, False), SP(WHT, 7, 1))
    ex, ey = pts[-1]
    a_ = math.atan2(pts[-1][1] - pts[-2][1], pts[-1][0] - pts[-2][0])
    for s_ in (2.5, -2.5):
        cv.drawLine(ex, ey, ex - math.cos(a_ + s_ * .2 * 2) * 26, ey - math.sin(a_ + s_ * .2 * 2) * 26, SP(WHT, 7))
    # scanline
    sy = 250 + ((u * 520) % 1300)
    sh = skia.GradientShader.MakeLinear([skia.Point(0, sy - 60), skia.Point(0, sy)], [C(RED, 0), C(RED, .35)])
    cv.drawRect(skia.Rect.MakeLTRB(0, sy - 60, W, sy), skia.Paint(Shader=sh))
    cv.drawLine(0, sy, W, sy, SP(HOT, 3, .9))
    med_cross(cv, 180, 330, 1.0, sm(prog(u, .1, .5)))
    lvl = 1 - eio(prog(u, 2.6, 4.8)) * .93
    blink = 1 if lvl > .2 or int(u * 6) % 2 else .2
    battery(cv, 900, 360, .9, lvl, sm(prog(u, .3, .7)), blink)
    wa = bo(prog(u, 3.4, 3.8))
    if wa > 0:
        cv.save()
        cv.translate(900, 720)
        cv.scale(wa, wa)
        warn(cv, 0, 0, 1.0, .6 + .4 * (int(u * 5) % 2))
        cv.restore()
    # ECG
    p = skia.Path()
    flat = prog(u, 3.6, 5.0)
    for i in range(0, W + 1, 6):
        ph = (i / W * 3 + u * 1.6) % 1
        y = 0
        if .45 < ph < .5:
            y = -20
        elif .5 < ph < .54:
            y = 110
        elif .54 < ph < .58:
            y = -150
        elif .58 < ph < .62:
            y = 40
        y *= (1 - flat)
        y += math.sin(i * .2 + u * 30) * 6 * flat
        (p.moveTo if i == 0 else p.lineTo)(i, 1700 - y * .6)
    cv.drawPath(p, SP(RED, 5))
    cv.drawPath(p, SP(HOT, 2))


# ------------------------------------------------------------------ 7 brain over-stimulation
def brain_in_head(cv, cx, cy, s, regions, a=1.0, dim=0.0):
    head_profile(cv, cx, cy, s, a)
    brain(cv, cx - 30 * s, cy - 160 * s, s * .78, a, regions, dim=dim)


def s_brainstim(cv, u, D):
    cx, cy, s = 420, 980, 1.15
    fl = 1.0 if (int(u * 9) % 2 == 0) else .35
    on = 1 - prog(u, 3.6, 3.75) + prog(u, 4.3, 4.4)
    fl *= clamp(on)
    vis = (-210 * .78, -10 * .78)
    regs = [(-200, -20, 95, 70, fl * 1.3, WHT), (-20, 25, 60, 42, fl * 1.1, HOT)]
    brain_in_head(cv, cx, cy, s, regs)
    eye = (cx + 210 * s, cy - 55 * s)
    # phone + arm
    px, py = 930, 880 + math.sin(u * 2) * 10
    limb(cv, [(1150, 1500), (1010, 1180), (px + 20, py + 40)], 24)
    if fl > .2:
        sh = skia.GradientShader.MakeLinear([skia.Point(px, py), skia.Point(*eye)], [C(WHT, .55 * fl), C(RED, .15 * fl)])
        cv.drawPath(poly([(px - 20, py - 110), (px - 20, py + 110), eye]), skia.Paint(AntiAlias=True, Shader=sh))
    phone(cv, px, py, 70, 240, 1, 0, beam=fl * 1.2, flick=fl)
    # signal particles eye -> visual cortex & striatum
    targets = [(cx - 30 * s + -200 * .78 * s, cy - 160 * s + -20 * .78 * s),
               (cx - 30 * s + -20 * .78 * s, cy - 160 * s + 25 * .78 * s)]
    for i in range(16):
        ph = (u * 1.4 + i / 16) % 1
        tx, ty = targets[i % 2]
        x = lerp(eye[0], tx, ph)
        y = lerp(eye[1], ty, ph) - math.sin(ph * math.pi) * 60
        glow_dot(cv, x, y, 9, WHT, (1 - ph) * clamp(on))
    # flash pulses rings around regions
    for (tx, ty) in targets:
        r = (u * 3) % 1
        circ(cv, tx, ty, 30 + r * 120, WHT, 3, (1 - r) * fl, None)


# ------------------------------------------------------------------ 8 dopamine fails
def s_dopamine(cv, u, D):
    floor_line(cv)
    sway = math.sin(u * 2.2) * 4
    wpose = dict(t=-6 + sway * .3, hd=-8, a1=160, f1=268, a2=-38, f2=38, h1=-3, k1=4, h2=15, k2=-7)
    fig(cv, 300, FLOOR, wpose, 1.05, 1, 'woman', 'happy', ground=FLOOR)
    rnd = random.Random(2)
    for i in range(14):
        x, y = 300 + rnd.uniform(-200, 200), FLOOR - rnd.uniform(80, 700)
        tw = .5 + .5 * math.sin(u * 4 + i * 1.3)
        dot(cv, x, y, 3 + 2 * tw, WHT, tw)
    slump = eio(prog(u, 3.7, 4.3))
    hpose = dict(t=lerp(0, 18, slump), hd=lerp(0, 30, slump), a1=6, f1=2, a2=-6, f2=-2)
    J = fig(cv, 800, FLOOR, hpose, 1.05, -1, 'man', 'blank' if slump < .5 else 'sad', ground=FLOOR)
    hx, hy = J['head']
    # gauge
    gx, gy = 960, 560
    neon(cv, rrect(gx - 36, gy - 170, 72, 340, 30), RED, 6)
    for i in range(6):
        cv.drawLine(gx + 40, gy - 150 + i * 60, gx + 58, gy - 150 + i * 60, SP(RED, 3))
    lvl = .06 + .04 * math.sin(u * 13)
    err = .3 + .7 * (int(u * 6) % 2) if u > 3.5 else 1
    cv.drawPath(rrect(gx - 22, gy + 156 - 300 * lvl, 44, 300 * lvl, 14), FP(RED, err))
    # molecules from wife toward husband, breaking midway
    for st in (.3, 1.1, 1.9, 2.7):
        lt = (u - st) / 1.4
        if 0 < lt < 1:
            x = lerp(420, 760, lt)
            y = lerp(1000, hy, lt) - math.sin(lt * math.pi) * 120
            br = prog(lt, .45, .9)
            molecule(cv, x, y, 1.3, 1 - br, ang=lt * 40, broken=br)
            if br > 0:
                for k in range(6):
                    a_ = k * 1.05 + st
                    dot(cv, x + math.cos(a_) * 80 * br, y + math.sin(a_) * 80 * br, 4, HOT, 1 - br)


# ------------------------------------------------------------------ 9 split loyo / beringas
def s_split(cv, u, D):
    # top: limp on bed
    dimtop = .55 * prog(u, 4.0, 4.6)
    cv.saveLayerAlpha(None, int(255 * (1 - dimtop)))
    cv.drawLine(-100, 880, W + 100, 880, SP(RED, 4))
    bed(cv, 150, 930, 700, head_h=180, foot_h=90, floor=880)
    pillow(cv, 230, 672)
    hpose = dict(t=90, hd=8, h1=-90, k1=-90, h2=-86, k2=-92, a1=lerp(30, 0, sm(prog(u, .3, 1.5))),
                 f1=lerp(30, -5, sm(prog(u, .3, 1.5))), a2=150, f2=170)
    J = fig(cv, 540, 668, hpose, .8, -1, 'man', 'tired')
    br = .5 + .5 * math.sin(u * 2)
    brain(cv, 760, 300, .32, 1, dim=sm(prog(u, 0, 2.0)))
    lv = .1
    battery(cv, 300, 330, .6, lv, 1, 1 if int(u * 4) % 2 else .2)
    cv.restore()
    # divider
    dw = eo(prog(u, 0, .5))
    cv.drawLine(540 - 600 * dw, 960, 540 + 600 * dw, 960, SP(RED, 6))
    cv.drawLine(540 - 600 * dw, 960, 540 + 600 * dw, 960, SP(WHT, 2))
    # bottom: savage at screen
    k = eo(prog(u, 3.9, 4.5))
    if k > 0:
        ox = (1 - k) * 900
        cv.save()
        cv.translate(ox, 0)
        cv.drawLine(-100, 1800, W + 100, 1800, SP(RED, 4))
        rnd = random.Random(int(u * 24))
        jit = rnd.uniform(-5, 5)
        J = fig(cv, 520 + jit, 1800, dict(t=28, hd=18, a1=75, f1=150, a2=65, f2=145, h1=20, k1=-20, h2=-10, k2=-30),
                1.0, 1, 'man', 'crazy', ground=1800, eyeglow=.8, phone=dict(glow=1, beam=1.0, w=50, h=84))
        for i in range(7):
            ang = rnd.uniform(0, 6.28)
            x, y = J['head'][0] + math.cos(ang) * 110, J['head'][1] + math.sin(ang) * 110
            pts = [(x, y)]
            for j in range(3):
                x += math.cos(ang) * 30 + rnd.uniform(-15, 15)
                y += math.sin(ang) * 30 + rnd.uniform(-15, 15)
                pts.append((x, y))
            cv.drawPath(poly(pts, False), SP(WHT if i % 2 else RED, 4))
        for i in range(3):
            ph = (u * 1.5 + i / 3) % 1
            dot(cv, J['head'][0] - 30 + i * 25, J['head'][1] - 20 + ph * 90, 5, WHT, 1 - ph)
        cv.restore()


# ------------------------------------------------------------------ 10 prefrontal shrink
def s_pfc(cv, u, D):
    hud(cv, u, .6)
    shrink = eio(prog(u, 1.0, 2.6))
    cx, cy, s = 540, 900, 1.5
    cv.save()
    cv.translate(cx - 270 * s, 0)
    cv.scale(1 - .22 * shrink, 1 - .06 * shrink)
    cv.translate(-(cx - 270 * s), 0)
    pulse = .6 + .4 * math.sin(u * 7)
    regs = [(180, -60, 120, 100, lerp(1.2 * pulse, .25, shrink), mix(WHT, DRED, shrink))]
    brain(cv, cx, cy, s, 1, regs, crack=prog(u, 1.8, 2.8), dim=.5 * shrink)
    cv.restore()
    # ring around region
    rx, ry = cx + 180 * s * (1 - .22 * shrink) - 270 * s * .22 * shrink * 0, cy - 60 * s
    rx = cx - 270 * s + (180 + 270) * s * (1 - .22 * shrink)
    rr = lerp(190, 120, shrink)
    p = skia.Path()
    p.addCircle(rx, ry, rr)
    dash = skia.Paint(AntiAlias=True, Color=C(WHT, .9), Style=skia.Paint.kStroke_Style, StrokeWidth=5,
                      PathEffect=skia.DashPathEffect.Make([30, 18], u * 60))
    cv.drawPath(p, dash)
    # inward chevrons
    for k in range(4):
        a_ = k * math.pi / 2 + math.pi / 4
        d = rr + 70 + 30 * math.sin(u * 8)
        x, y = rx + math.cos(a_) * d, ry + math.sin(a_) * d
        cv.save()
        cv.translate(x, y)
        cv.rotate(math.degrees(a_))
        cv.drawPath(poly([(-20, -30), (10, 0), (-20, 30)], False), SP(RED, 8))
        cv.restore()


# ------------------------------------------------------------------ 11 crown shatters
def s_crown(cv, u, D):
    floor_line(cv)
    back = eio(prog(u, 1.3, 2.4))
    fig(cv, lerp(330, 170, back), FLOOR, dict(walk(u, 6, 12) if 1.3 < u < 2.4 else STAND, t=4, a2=-20, f2=-30),
        1.0, 1, 'woman', 'sad' if u > 1.2 else 'neutral', ground=FLOOR, a=1 - .5 * back)
    fig(cv, lerp(450, 290, back), FLOOR, dict(STAND, a1=-40, f1=-50), .58, 1, 'man', 'fear' if u > 1.2 else 'happy',
        ground=FLOOR, a=1 - .5 * back, child=True)
    slump = eio(prog(u, 1.3, 2.2))
    pose = lerp_pose(dict(t=-4, hd=-6, a1=-25, f1=-10, a2=25, f2=10), dict(t=24, hd=34, a1=8, f1=4, a2=-6, f2=-4),
                     slump)
    J = fig(cv, 720, FLOOR, pose, 1.15, -1, 'man', 'neutral' if u < 1.1 else 'sad', ground=FLOOR)
    hx, hy = J['head']
    cy = hy - 150 + math.sin(u * 3) * 8
    if u < 1.15:
        radial(cv, hx, cy, 220, HOT, .35)
        neon(cv, crown_path(hx, cy, 1.0), WHT, 6, 1, RED, .45)
        ck = prog(u, .75, 1.1)
        if ck > 0:
            r = random.Random(1)
            for k in range(4):
                x, y = hx + r.uniform(-30, 30), cy + r.uniform(-20, 20)
                pts = [(x, y)]
                for j in range(int(1 + 4 * ck)):
                    x += r.uniform(-30, 30)
                    y += r.uniform(-25, 25)
                    pts.append((x, y))
                cv.drawPath(poly(pts, False), SP(WHT, 3.5))
    else:
        lt = u - 1.15
        r = random.Random(8)
        for k in range(16):
            vx, vy = r.uniform(-420, 420), r.uniform(-600, -150)
            x = hx + r.uniform(-80, 80) + vx * lt
            y = cy + r.uniform(-30, 30) + vy * lt + 1400 * lt * lt
            if y > FLOOR:
                continue
            sz = r.uniform(12, 30)
            cv.save()
            cv.translate(x, y)
            cv.rotate(lt * r.uniform(-500, 500))
            neon(cv, poly([(-sz, -sz * .4), (sz * .6, -sz), (sz, sz * .5), (-sz * .3, sz)]), WHT, 3, 1 - lt / 2.2,
                 RED, .5)
            cv.restore()
        radial(cv, hx, cy, 300, WHT, .8 * (1 - prog(lt, 0, .35)))


# ------------------------------------------------------------------ 12 cold heart / rage / no passion
def s_heart(cv, u, D):
    floor_line(cv)
    z = eio(prog(u, 1.55, 2.05))
    cold = eio(prog(u, .3, 1.6)) * (1 - eio(prog(u, 3.5, 3.7)))
    rage = prog(u, 3.55, 3.7) * (1 - eio(prog(u, 4.4, 4.9)))
    if z > 0:
        ang = rage > .2
        shake = math.sin(u * 70) * 9 * rage
        pose = lerp_pose(dict(t=0, hd=0, a1=4, f1=2, a2=-4, f2=-2),
                         dict(t=-6, hd=-14, a1=150, f1=190, a2=-150, f2=-190, h1=14, h2=-14), eio(rage))
        if u > 4.4:
            pose = lerp_pose(pose, dict(t=22, hd=34, a1=6, f1=2, a2=-6, f2=-2), eio(prog(u, 4.4, 5.0)))
        col = mix(RED, ICE, cold * .85)
        ex = 'blank' if rage < .2 else 'crazy'
        if u > 4.6:
            ex = 'sad'
        J = fig(cv, 540 + shake, FLOOR, pose, 1.2, 1, 'man', ex, ground=FLOOR, a=z, c=col, eyeglow=rage)
        chest = add(J['hip'], J['up'], LEN['T'] * 1.2 * .68)
        if rage > 0:
            rnd = random.Random(int(u * 20))
            hx, hy = J['head']
            for k in range(8):
                a_ = -math.pi / 2 + rnd.uniform(-1.4, 1.4)
                d0 = 90
                pts = [(hx + math.cos(a_) * d0, hy + math.sin(a_) * d0)]
                for j in range(3):
                    pts.append((pts[-1][0] + math.cos(a_) * 35 + rnd.uniform(-14, 14),
                                pts[-1][1] + math.sin(a_) * 35 + rnd.uniform(-14, 14)))
                cv.drawPath(poly(pts, False), SP(WHT if k % 2 else RED, 5, rage))
            for k in range(3):
                ph = (u * 2 + k / 3) % 1
                circ(cv, hx + (k - 1) * 50, hy - 90 - ph * 150, 16 + ph * 26, RED, 4, (1 - ph) * rage, None)
        if cold > .2 and z > .5:
            rnd = random.Random(3)
            for k in range(30):
                x = rnd.uniform(0, W)
                y = (rnd.uniform(0, H) + u * 120 * (1 + rnd.random())) % H
                dot(cv, x, y, 3, ICE, .6 * cold)
    else:
        chest = (540, 900)
    # heart: close-up -> chest
    hs = lerp(15, 2.2, z)
    hx = lerp(540, chest[0], z)
    hy = lerp(880, chest[1], z)
    beat_rate = lerp(1.6, .6, cold)
    bt = (u * beat_rate) % 1
    beat = 1 + .08 * math.exp(-bt * 10) * (1 - cold * .7)
    col = mix(RED, ICE, cold)
    if u < 4.5:
        radial(cv, hx, hy, hs * 30, col, .4 * (1 - cold * .5))
        neon(cv, heart_path(hx, hy, hs * beat), col, max(6 * hs / 15 + 2, 3), 1, mix((80, 0, 8), (20, 30, 50), cold),
             .9)
        if cold > 0 and z < 1:
            rnd = random.Random(6)
            for k in range(10):
                a_ = rnd.uniform(0, 6.28)
                x, y = hx + math.cos(a_) * hs * 16, hy + math.sin(a_) * hs * 13
                pts = [(x, y)]
                L = cold * hs * 9
                for j in range(4):
                    a2 = a_ + math.pi + rnd.uniform(-.6, .6)
                    pts.append((pts[-1][0] + math.cos(a2) * L / 4, pts[-1][1] + math.sin(a2) * L / 4))
                cv.drawPath(poly(pts, False), SP(ICE, 4 * (1 - z) + 1, cold))
                mid = pts[2]
                cv.drawLine(mid[0], mid[1], mid[0] + math.cos(a_ + 2) * L / 5, mid[1] + math.sin(a_ + 2) * L / 5,
                            SP(ICE, 3, cold))
    # flame of passion dying
    fa = sm(prog(u, 4.3, 4.55))
    if fa > 0:
        fk = 1 - eio(prog(u, 4.7, 5.4))
        fx, fy = 860, 900
        if fk > .02:
            radial(cv, fx, fy - 60, 200 * fk, RED, .5 * fk)
            neon(cv, flame_path(fx, fy, 1.2 * fk + .05, u, 1), HOT, 6, fa, (90, 0, 6))
            neon(cv, flame_path(fx, fy + 20, .6 * fk + .02, u + 3, 1), WHT, 4, fa, (140, 20, 10))
        sm_ = prog(u, 4.8, 5.5)
        for k in range(4):
            ph = (sm_ * 1.2 + k * .2)
            if 0 < ph < 1:
                p = skia.Path()
                p.moveTo(fx, fy - 40)
                p.cubicTo(fx + 40, fy - 120 - ph * 100, fx - 40, fy - 200 - ph * 150, fx + 10 * k, fy - 300 - ph * 200)
                cv.drawPath(p, SP((150, 120, 120), 6, (1 - ph) * .6))
    # wife flinches during rage
    if rage > 0 or u > 3.6:
        wa = sm(prog(u, 3.55, 3.75))
        fig(cv, 180, FLOOR, dict(t=-18, hd=-10, a1=130, f1=170, a2=110, f2=160, h1=-10, k1=-5, h2=12, k2=4), 1.0, 1,
            'woman', 'fear', ground=FLOOR, a=wa)


# ------------------------------------------------------------------ 13 family + throw phone away
def s_family(cv, u, D):
    floor_line(cv)
    crack = eio(prog(u, .3, 1.6)) * (1 - eio(prog(u, 3.2, 3.9)))
    if crack > 0:
        rnd = random.Random(4)
        pts = [(470, FLOOR)]
        for i in range(7):
            pts.append((470 + rnd.uniform(-35, 35) * crack, FLOOR - (i + 1) * 4 + 0))
        cv.drawLine(470 - 240 * crack, FLOOR, 470 + 240 * crack, FLOOR, SP(BLACK, 10))
        z = [(470 - 240 * crack, FLOOR)]
        for i in range(10):
            z.append((470 - 240 * crack + (i + 1) * 48 * crack, FLOOR + (14 if i % 2 == 0 else -6) * crack))
        cv.drawPath(poly(z, False), SP(WHT, 4, crack))
        radial(cv, 470, FLOOR, 260 * crack, RED, .5 * crack)
    shake = math.sin(u * 50) * 4 * crack * (u < 1.8)
    hap = eio(prog(u, 3.4, 3.9))
    fig(cv, 170 + shake, FLOOR, dict(STAND, a2=lerp(-10, 60, hap), f2=lerp(-4, 70, hap)), 1.0, 1, 'woman',
        'happy' if hap > .5 else 'sad', ground=FLOOR)
    fig(cv, 320 + shake, FLOOR, dict(STAND, a2=lerp(-10, 50, hap), f2=lerp(-4, 60, hap)), .58, 1, 'man',
        'happy' if hap > .5 else 'sad', ground=FLOOR, child=True)
    # bin
    bx = 930
    neon(cv, poly([(bx - 90, 1250), (bx + 90, 1250), (bx + 70, FLOOR), (bx - 70, FLOOR)]), RED, 6)
    for k in (-40, 0, 40):
        cv.drawLine(bx + k, 1280, bx + k * .8, FLOOR - 30, SP(RED, 4))
    lid = eo(prog(u, 3.0, 3.1)) * (1 - eo(prog(u, 3.1, 3.5)))
    cv.save()
    cv.translate(bx - 100, 1240)
    cv.rotate(-lid * 25)
    neon(cv, rrect(0, -12, 200, 22, 8), RED, 6)
    cv.restore()
    turned = u > 2.15 and u < 3.3
    throw = prog(u, 2.3, 2.6)
    if turned:
        pose = lerp_pose(dict(t=4, a2=60, f2=120), dict(t=-4, a2=150, f2=200), eio(throw))
        f = 1
    else:
        pose = dict(t=6 if u < 3 else 0, hd=20 if u < 3 else 0, a2=lerp(55, 60, hap), f2=lerp(110, 70, hap),
                    a1=-8, f1=-4)
        f = -1
    ph = dict(glow=1, beam=.7, hand='2') if u < 2.6 else None
    J = fig(cv, 620, FLOOR, pose, 1.1, f, 'man', 'happy' if u > 3.3 else 'sad', ground=FLOOR, phone=ph)
    lt = prog(u, 2.6, 3.05)
    if 0 < lt < 1:
        x = lerp(J['ha2'][0], bx, lt)
        y = lerp(J['ha2'][1], 1230, lt) - math.sin(lt * math.pi) * 260
        for k in range(6):
            tt = max(lt - k * .04, 0)
            dot(cv, lerp(J['ha2'][0], bx, tt), lerp(J['ha2'][1], 1230, tt) - math.sin(tt * math.pi) * 260, 8 - k,
                RED, .5 - k * .07)
        phone(cv, x, y, 46, 80, 1, lt * 720)
    sp = prog(u, 3.05, 3.6)
    if 0 < sp < 1:
        for k in range(12):
            a_ = -math.pi * (k / 11)
            d = 40 + 160 * eo(sp)
            dot(cv, bx + math.cos(a_) * d, 1240 + math.sin(a_) * d, 5, WHT, 1 - sp)


# ------------------------------------------------------------------ 14 neuroplasticity
_r = random.Random(12)
NODES = []
while len(NODES) < 30:
    x, y = _r.uniform(-1, 1), _r.uniform(-1, 1)
    if x * x + y * y < 1:
        NODES.append((x * 380, y * 260 - 20))
EDGES = []
for i, a in enumerate(NODES):
    ds = sorted(((math.hypot(a[0] - b[0], a[1] - b[1]), j) for j, b in enumerate(NODES) if j != i))
    for d, j in ds[:3]:
        if (j, i) not in EDGES:
            EDGES.append((i, j))


def network(cv, cx, cy, s, u, conn, a=1.0):
    for k, (i, j) in enumerate(EDGES):
        p0 = (cx + NODES[i][0] * s, cy + NODES[i][1] * s)
        p1 = (cx + NODES[j][0] * s, cy + NODES[j][1] * s)
        order = ((NODES[i][0] + NODES[j][0]) / 2 + 380) / 760
        c = clamp((conn - order * .8) / .2)
        mx, my = (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2
        g = .5 * (1 - c)
        q0 = (lerp(p0[0], mx, 1 - g * 1.2 - .4 * (1 - c)), lerp(p0[1], my, 1 - g * 1.2 - .4 * (1 - c)))
        q1 = (lerp(p1[0], mx, 1 - g * 1.2 - .4 * (1 - c)), lerp(p1[1], my, 1 - g * 1.2 - .4 * (1 - c)))
        if c < 1:
            cv.drawLine(*p0, *q0, SP(DRED, 4, a))
            cv.drawLine(*p1, *q1, SP(DRED, 4, a))
        if c > 0:
            cv.drawLine(*p0, *p1, SP(mix(RED, WHT, c), 4 + 2 * c, a * c))
            if c < 1:
                glow_dot(cv, mx, my, 26, WHT, a * (1 - c) * 2 * c)
            ph = (u * .8 + k * .37) % 1
            glow_dot(cv, lerp(p0[0], p1[0], ph), lerp(p0[1], p1[1], ph), 9, WHT, a * c)
    for i, (x, y) in enumerate(NODES):
        order = (x + 380) / 760
        c = clamp((conn - order * .8) / .2)
        circ(cv, cx + x * s, cy + y * s, 12 + 4 * c, mix(RED, WHT, c), 4, a, (60 * c, 0, 0))


def s_neuro(cv, u, D):
    brain(cv, 540, 980, 1.75, .35)
    network(cv, 540, 940, 1.15, u, eio(prog(u, .1, 1.7)) * 1.05)


# ------------------------------------------------------------------ 15 CTA
def s_cta(cv, u, D):
    network(cv, 540, 940, 1.4, u + 2, 1.1, .28)
    k = bo(prog(u, 0, .75))
    py = lerp(2400, 900, k)
    radial(cv, 540, py, 700, RED, .45 * k)
    pulse = .85 + .15 * math.sin(u * 4)
    phone(cv, 540, py, 560, 1020, pulse, img=PMO_IMG)
    # arrow up to bio
    aa = sm(prog(u, 1.0, 1.4))
    if aa > 0:
        bounce = abs(math.sin(u * 5)) * 40
        arrow_up(cv, 540, 240 - bounce, .9, aa)
        for r in range(2):
            ph = (u * .9 + r * .5) % 1
            circ(cv, 540, 200, 60 + ph * 140, WHT, 3, aa * (1 - ph), None)
    # tapping hand
    ta = eio(prog(u, 2.2, 2.8))
    tap = prog(u, 2.9, 3.1)
    if ta > 0:
        press = math.sin(tap * math.pi) * 30
        hx = lerp(1250, 700, ta) - press * .3
        hy = lerp(1950, 1180, ta) + press
        limb(cv, [(1250, 2050), (1000, 1600), (hx, hy)], 30)
        circ(cv, hx, hy, 26, RED, 5)
        tr = prog(u, 3.0, 3.8)
        if 0 < tr < 1:
            for r in range(3):
                q = clamp(tr * 1.3 - r * .15)
                circ(cv, hx, hy, 20 + q * 220, WHT, 5, 1 - q, None)
    # happy stickman pointing up
    ma = sm(prog(u, 1.4, 1.9))
    if ma > 0:
        fig(cv, 140, 1800, dict(t=-4, hd=-12, a1=170, f1=175, a2=-20, f2=-30), .62, 1, 'man', 'happy',
            ground=1800, a=ma)
        cv.drawLine(0, 1800, 330, 1800, SP(RED, 4, ma))


SCENES = [(s_crowd, True), (s_door, True), (s_bed, True), (s_cry, True), (s_toilet, True), (s_medical, False),
          (s_brainstim, False), (s_dopamine, True), (s_split, False), (s_pfc, False), (s_crown, True),
          (s_heart, True), (s_family, True), (s_neuro, False), (s_cta, False)]

# global camera events: (time, strength)
SHAKES = [(B[1] - .05, 0), (B[0] + 2.6, 8), (B[1] + .85, 6), (B[4] + .7, 6), (B[5] + 2.5, 10), (B[8] + 4.0, 16),
          (B[10] + 1.15, 18), (B[11] + 3.58, 22), (B[12] + .4, 12), (B[12] + 3.05, 8), (B[14] + 2.95, 6)]
FLASHES = [(B[5] + 2.45, .35), (B[10] + 1.15, .4), (B[11] + 3.58, .45), (B[13] + 1.6, .3), (B[14] + 3.0, .3)]
GLITCHES = [(B[0] + 2.6, .25), (B[5] + 2.5, .35), (B[8] + 4.0, .3), (B[11] + 3.6, .3)]
