"""Neon stickman drawing engine (skia based)."""
import math, random
import numpy as np
import skia

W, H, FPS = 1080, 1920, 30
FLOOR = 1480

RED = (255, 34, 44)
HOT = (255, 150, 140)
WHT = (255, 238, 236)
DRED = (140, 8, 16)
ICE = (215, 232, 255)
BLACK = (0, 0, 0)


# ---------------------------------------------------------------- easing
def clamp(x, a=0.0, b=1.0):
    return a if x < a else b if x > b else x


def sm(x):
    x = clamp(x)
    return x * x * (3 - 2 * x)


def eo(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def ei(x):
    x = clamp(x)
    return x ** 3


def eio(x):
    x = clamp(x)
    return 4 * x ** 3 if x < .5 else 1 - (-2 * x + 2) ** 3 / 2


def bo(x):
    x = clamp(x)
    c1 = 1.70158
    c3 = c1 + 1
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2


def lerp(a, b, t):
    return a + (b - a) * t


def prog(u, a, b):
    return clamp((u - a) / (b - a))


def mix(c1, c2, t):
    return tuple(lerp(c1[i], c2[i], t) for i in range(3))


def noise1(x, seed=0):
    """cheap smooth 1d noise in [-1,1]"""
    return (math.sin(x * 1.7 + seed * 3.1) * .5 + math.sin(x * 3.13 + seed * 1.3) * .3
            + math.sin(x * 7.7 + seed * 5.7) * .2)


# ---------------------------------------------------------------- paints
def C(c, a=1.0):
    return skia.Color(int(c[0]), int(c[1]), int(c[2]), int(clamp(a) * 255))


def SP(c=RED, w=5, a=1.0, butt=False):
    return skia.Paint(AntiAlias=True, Color=C(c, a), Style=skia.Paint.kStroke_Style, StrokeWidth=w,
                      StrokeCap=skia.Paint.kButt_Cap if butt else skia.Paint.kRound_Cap,
                      StrokeJoin=skia.Paint.kRound_Join)


def FP(c=BLACK, a=1.0):
    return skia.Paint(AntiAlias=True, Color=C(c, a), Style=skia.Paint.kFill_Style)


def neon(cv, path, c=RED, w=5, a=1.0, fill=BLACK, fa=1.0):
    if fill is not None and fa > 0:
        cv.drawPath(path, FP(fill, fa * a))
    if w > 0:
        cv.drawPath(path, SP(c, w, a))


def line(cv, x1, y1, x2, y2, c=RED, w=5, a=1.0):
    cv.drawLine(x1, y1, x2, y2, SP(c, w, a))


def circ(cv, x, y, r, c=RED, w=5, a=1.0, fill=BLACK, fa=1.0):
    p = skia.Path()
    p.addCircle(x, y, max(r, .1))
    neon(cv, p, c, w, a, fill, fa)


def dot(cv, x, y, r, c=RED, a=1.0):
    cv.drawCircle(x, y, max(r, .1), FP(c, a))


def rrect(x, y, w, h, r):
    p = skia.Path()
    p.addRRect(skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(x, y, w, h), r, r))
    return p


def poly(pts, close=True):
    p = skia.Path()
    p.moveTo(*pts[0])
    for q in pts[1:]:
        p.lineTo(*q)
    if close:
        p.close()
    return p


def spline(pts, closed=True, tension=1.0):
    """Catmull-Rom through pts -> cubic path"""
    p = skia.Path()
    n = len(pts)
    p.moveTo(*pts[0])
    rng = range(n) if closed else range(n - 1)
    for i in rng:
        p0 = pts[(i - 1) % n] if closed or i > 0 else pts[i]
        p1 = pts[i]
        p2 = pts[(i + 1) % n]
        p3 = pts[(i + 2) % n] if closed or i + 2 < n else p2
        k = tension / 6
        c1 = (p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k)
        c2 = (p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k)
        p.cubicTo(*c1, *c2, *p2)
    if closed:
        p.close()
    return p


def glow_dot(cv, x, y, r, c=RED, a=1.0):
    p = skia.Paint(AntiAlias=True, Color=C(c, a))
    p.setMaskFilter(skia.MaskFilter.MakeBlur(skia.kNormal_BlurStyle, r * .6))
    cv.drawCircle(x, y, r, p)


def radial(cv, x, y, r, c=RED, a=1.0):
    sh = skia.GradientShader.MakeRadial(skia.Point(x, y), max(r, 1), [C(c, a), C(c, 0)])
    cv.drawCircle(x, y, r, skia.Paint(AntiAlias=True, Shader=sh))


def blobs(cv, circles, c=RED, w=5, a=1.0):
    """union outline of circles: red expanded pass then black pass"""
    for (x, y, r) in circles:
        dot(cv, x, y, r + w * .6, c, a)
    for (x, y, r) in circles:
        dot(cv, x, y, r - w * .4, BLACK, 1)


# ---------------------------------------------------------------- figure
LEN = dict(T=185, N=16, R=50, UA=100, FA=95, TH=128, SH=128)
STAND = dict(t=0, hd=0, a1=10, f1=4, a2=-10, f2=-4, h1=6, k1=3, h2=-6, k2=-3)


def dirv(a, f):
    r = math.radians(a)
    return (f * math.sin(r), math.cos(r))


def add(p, v, k=1.0):
    return (p[0] + v[0] * k, p[1] + v[1] * k)


def lerp_pose(p1, p2, t):
    a = dict(STAND)
    a.update(p1)
    b = dict(STAND)
    b.update(p2)
    return {k: lerp(a[k], b[k], t) for k in a}


def keyed(u, keys, ease=eio):
    """keys: list of (time, pose dict). returns interpolated pose"""
    if u <= keys[0][0]:
        return lerp_pose(keys[0][1], keys[0][1], 0)
    for i in range(len(keys) - 1):
        t0, p0 = keys[i]
        t1, p1 = keys[i + 1]
        if u <= t1:
            return lerp_pose(p0, p1, ease((u - t0) / max(t1 - t0, 1e-6)))
    return lerp_pose(keys[-1][1], keys[-1][1], 0)


def joints(x, y, pose, s=1.0, f=1):
    P = dict(STAND)
    P.update(pose)
    L = {k: v * s for k, v in LEN.items()}
    hip = (x, y)
    t = math.radians(P['t'])
    up = (f * math.sin(t), -math.cos(t))
    neck = add(hip, up, L['T'])
    sh = add(hip, up, L['T'] * .86)
    th = math.radians(P['t'] + P['hd'])
    hu = (f * math.sin(th), -math.cos(th))
    head = add(neck, hu, L['N'] + L['R'])
    fwd = (-hu[1] * f, hu[0] * f)
    J = dict(hip=hip, neck=neck, sh=sh, head=head, hu=hu, fwd=fwd, R=L['R'], s=s, f=f, up=up)
    for i in ('1', '2'):
        e = add(sh, dirv(P['a' + i], f), L['UA'])
        h = add(e, dirv(P['f' + i], f), L['FA'])
        k = add(hip, dirv(P['h' + i], f), L['TH'])
        an = add(k, dirv(P['k' + i], f), L['SH'])
        ft = add(an, dirv(P['k' + i] + 90, f), 24 * s)
        J['el' + i], J['ha' + i], J['kn' + i], J['an' + i], J['ft' + i] = e, h, k, an, ft
    return J


def hp(J, fx, uy):
    """point in head frame (units of R)"""
    R = J['R']
    return (J['head'][0] + J['fwd'][0] * fx * R + J['hu'][0] * uy * R,
            J['head'][1] + J['fwd'][1] * fx * R + J['hu'][1] * uy * R)


def fig(cv, x, y, pose, s=1.0, f=1, kind='man', expr='neutral', ground=None, a=1.0, c=RED,
        u=0.0, eyeglow=0.0, fill=BLACK, phone=None, child=False):
    J = joints(x, y, pose, s, f)
    tw = (30 if kind == 'man' else 22) * s
    lw = (18 if kind == 'man' else 15) * s
    if child:
        tw *= .9
    ol = max(4.5 * s, 2.6)
    if ground is not None:
        ys = [J['an1'][1] + lw * .5, J['an2'][1] + lw * .5, J['kn1'][1] + lw * .5, J['kn2'][1] + lw * .5,
              J['hip'][1] + tw * .5, J['ha1'][1] + 12 * s, J['ha2'][1] + 12 * s, J['head'][1] + J['R'],
              J['ft1'][1] + lw * .4, J['ft2'][1] + lw * .4]
        dy = ground - max(ys)
        J = joints(x, y + dy, pose, s, f)
    if a < 1:
        cv.saveLayerAlpha(None, int(clamp(a) * 255))
    pieces = []  # (kind, data, width)
    # back limbs first ... order irrelevant due to two-pass
    for i in ('1', '2'):
        pieces.append(('pl', [J['hip'], J['kn' + i], J['an' + i], J['ft' + i]], lw))
        pieces.append(('pl', [J['sh'], J['el' + i], J['ha' + i]], lw * .92))
        pieces.append(('c', J['ha' + i], 11 * s))
    pieces.append(('pl', [J['hip'], J['neck']], tw))
    pieces.append(('c', J['head'], J['R']))
    if kind == 'woman':
        # hair
        hair = [hp(J, .55, .62), hp(J, .1, 1.05), hp(J, -.6, .9), hp(J, -1.05, .1), hp(J, -1.12, -1.0),
                hp(J, -.95, -1.75), hp(J, -.45, -1.6), hp(J, -.15, -.9), hp(J, .25, -.1)]
        pieces.append(('path', spline(hair), 0))
        # dress
        hip = J['hip']
        mk = add(J['kn1'], J['kn2'])
        mk = (mk[0] / 2, mk[1] / 2)
        dv = (mk[0] - hip[0], mk[1] - hip[1])
        dl = math.hypot(*dv) + 1e-6
        dv = (dv[0] / dl, dv[1] / dl)
        nv = (-dv[1], dv[0])
        up = J['up']
        un = (-up[1], up[0])
        ch = add(hip, up, LEN['T'] * s * .72)
        bot = add(hip, dv, LEN['TH'] * s * .78)
        sw = 62 * s
        dress = [add(ch, un, 13 * s), add(add(hip, un, 30 * s), up, 10 * s), add(bot, nv, sw),
                 add(bot, nv, -sw), add(add(hip, un, -30 * s), up, 10 * s), add(ch, un, -13 * s)]
        pieces.append(('path', poly(dress), 0))
    for pas in (0, 1):
        col = c if pas == 0 else fill
        for k, d, wd in pieces:
            if k == 'pl':
                pth = poly(d, close=False)
                cv.drawPath(pth, SP(col, wd + (2 * ol if pas == 0 else 0)))
            elif k == 'c':
                dot(cv, d[0], d[1], wd + (ol if pas == 0 else 0), col)
            else:
                if pas == 0:
                    cv.drawPath(d, SP(col, 2 * ol))
                    cv.drawPath(d, FP(col))
                else:
                    cv.drawPath(d, FP(col))
    if kind == 'woman':
        fr = skia.Path()
        a1 = hp(J, .62, .55)
        fr.moveTo(*a1)
        fr.quadTo(*hp(J, .1, .2), *hp(J, -.35, .55))
        cv.drawPath(fr, SP(c, 3.2 * s))
    face(cv, J, expr, u, c, eyeglow)
    if phone is not None:
        draw_phone_hand(cv, J, phone, s)
    if a < 1:
        cv.restore()
    return J


def face(cv, J, expr, u, c=RED, eyeglow=0.0):
    s = J['s']
    w = max(3.4 * s, 1.8)
    e1, e2 = hp(J, .02, .12), hp(J, .55, .12)
    eyes, brows, mouth, tears = 'dot', None, 'flat', False
    if expr == 'sad':
        brows, mouth = 'sad', 'frown'
    elif expr == 'cry':
        eyes, brows, mouth, tears = 'closed', 'sad', 'frown', True
    elif expr == 'angry':
        brows, mouth = 'angry', 'grit'
    elif expr == 'crazy':
        eyes, brows, mouth = 'glow', 'angry', 'grin'
    elif expr == 'blank':
        eyes, mouth = 'dot', 'flat'
    elif expr == 'tired':
        eyes, brows, mouth = 'half', 'sad', 'flat'
    elif expr == 'happy':
        eyes, mouth = 'dot', 'smile'
    elif expr == 'fear':
        eyes, brows, mouth = 'wide', 'sad', 'open'
    elif expr == 'none':
        return
    for i, e in enumerate((e1, e2)):
        if eyes == 'dot':
            dot(cv, e[0], e[1], 5 * s, c)
        elif eyes == 'wide':
            circ(cv, e[0], e[1], 8 * s, c, w * .8, 1, BLACK)
            dot(cv, e[0], e[1], 3 * s, c)
        elif eyes == 'glow':
            dot(cv, e[0], e[1], 8 * s, WHT)
            glow_dot(cv, e[0], e[1], 22 * s, RED, .9)
            dot(cv, e[0], e[1], 6 * s, WHT)
        elif eyes == 'closed':
            p = skia.Path()
            p.moveTo(*hp(J, (.02 if i == 0 else .55) - .14, .14))
            p.quadTo(*hp(J, (.02 if i == 0 else .55), .02), *hp(J, (.02 if i == 0 else .55) + .14, .14))
            cv.drawPath(p, SP(c, w))
        elif eyes == 'half':
            ex = .02 if i == 0 else .55
            cv.drawPath(poly([hp(J, ex - .13, .12), hp(J, ex + .13, .12)], False), SP(c, w))
            dot(cv, *hp(J, ex, .07), 3.4 * s, c)
        if eyeglow > 0:
            glow_dot(cv, e[0], e[1], 16 * s, WHT, eyeglow)
    if brows:
        for ex, inner in ((.02, 1), (.55, -1)):
            o = hp(J, ex - .17 * inner, .38)
            i_ = hp(J, ex + .17 * inner, .38 + (.16 if brows == 'sad' else -.14))
            cv.drawPath(poly([o, i_], False), SP(c, w))
    mx = .3
    if mouth == 'flat':
        cv.drawPath(poly([hp(J, mx - .17, -.42), hp(J, mx + .17, -.42)], False), SP(c, w))
    elif mouth == 'frown':
        p = skia.Path()
        p.moveTo(*hp(J, mx - .2, -.5))
        p.quadTo(*hp(J, mx, -.3), *hp(J, mx + .2, -.5))
        cv.drawPath(p, SP(c, w))
    elif mouth == 'smile':
        p = skia.Path()
        p.moveTo(*hp(J, mx - .22, -.36))
        p.quadTo(*hp(J, mx, -.58), *hp(J, mx + .22, -.36))
        cv.drawPath(p, SP(c, w))
    elif mouth == 'grit':
        pts = [hp(J, mx - .25, -.36), hp(J, mx + .25, -.36), hp(J, mx + .25, -.56), hp(J, mx - .25, -.56)]
        neon(cv, poly(pts), c, w * .8)
        for k in (-.08, .08):
            cv.drawPath(poly([hp(J, mx + k, -.36), hp(J, mx + k, -.56)], False), SP(c, w * .6))
    elif mouth == 'grin':
        p = skia.Path()
        p.moveTo(*hp(J, mx - .3, -.3))
        p.quadTo(*hp(J, mx, -.75), *hp(J, mx + .3, -.3))
        p.close()
        neon(cv, p, WHT, w * .8, 1, (60, 0, 0))
    elif mouth == 'open':
        q = hp(J, mx, -.5)
        circ(cv, q[0], q[1], 9 * s, c, w * .8)
    if tears:
        for k, ex in enumerate((.02, .55)):
            for j in range(2):
                ph = (u * 1.3 + k * .37 + j * .5) % 1.0
                q = hp(J, ex, .0)
                ty = q[1] + ph * 160 * s
                dot(cv, q[0] + (k - .5) * 4, ty, (5 - 2 * ph) * s, WHT, 1 - ph)


def draw_phone_hand(cv, J, ph, s):
    """ph: dict(w,h,glow,ang,hand='1'|'2'|'mid')"""
    hand = ph.get('hand', 'mid')
    if hand == 'mid':
        p = ((J['ha1'][0] + J['ha2'][0]) / 2, (J['ha1'][1] + J['ha2'][1]) / 2)
    else:
        p = J['ha' + hand]
    phone(cv, p[0], p[1] - 8 * s, ph.get('w', 46) * s, ph.get('h', 80) * s, ph.get('glow', 1.0), ph.get('ang', 0),
          ph.get('beam', 0), J['f'])


def phone(cv, x, y, w, h, glow=1.0, ang=0.0, beam=0.0, f=1, img=None, flick=0):
    cv.save()
    cv.translate(x, y)
    cv.rotate(ang)
    if beam > 0:
        sh = skia.GradientShader.MakeRadial(skia.Point(0, 0), h * 2.0, [C(WHT, .4 * beam), C(RED, .25 * beam), C(RED, 0)])
        cv.drawCircle(0, 0, h * 2.0, skia.Paint(AntiAlias=True, Shader=sh))
    body = rrect(-w / 2, -h / 2, w, h, w * .18)
    neon(cv, body, RED, max(w * .07, 2.5))
    scr = rrect(-w / 2 + w * .1, -h / 2 + h * .08, w * .8, h * .84, w * .1)
    if isinstance(img, str):
        cv.drawPath(scr, FP((0, 0, 0), 1))
    elif img is not None:
        cv.save()
        cv.clipPath(scr, doAntiAlias=True)
        iw, ih = img.width(), img.height()
        sw, sh2 = w * .8, h * .84
        sc = sw * .9 / (iw * .37)
        cv.drawImageRect(img, skia.Rect.MakeXYWH(-iw * sc / 2, -ih * sc / 2, iw * sc, ih * sc),
                         skia.SamplingOptions(skia.FilterMode.kLinear), skia.Paint(Color=C(WHT, glow)))
        cv.restore()
    else:
        cv.drawPath(scr, FP(mix(RED, WHT, .55 + .3 * flick), glow))
    cv.restore()


# ---------------------------------------------------------------- props
def floor_line(cv, y=FLOOR, a=1.0, x0=-300, x1=W + 300):
    sh = skia.GradientShader.MakeLinear([skia.Point(0, y), skia.Point(0, y + 90)], [C(RED, .35 * a), C(RED, 0)])
    cv.drawRect(skia.Rect.MakeLTRB(x0, y, x1, y + 90), skia.Paint(Shader=sh))
    cv.drawLine(x0, y, x1, y, SP(RED, 5, a))
    cv.drawLine(x0, y, x1, y, SP(HOT, 2, a))


def bed(cv, x0, x1, top, a=1.0, head_h=260, foot_h=120, floor=FLOOR):
    neon(cv, rrect(x0, top, x1 - x0, 70, 18), RED, 5, a)          # mattress
    neon(cv, rrect(x0 - 10, top + 70, x1 - x0 + 20, 36, 8), RED, 5, a)  # frame
    neon(cv, rrect(x0 - 40, top - head_h, 34, floor - top + head_h, 12), RED, 5, a)
    neon(cv, rrect(x1 + 6, top - foot_h, 30, floor - top + foot_h, 12), RED, 5, a)


def pillow(cv, x, y, w=150, h=56, a=1.0, ang=0):
    cv.save()
    cv.translate(x, y)
    cv.rotate(ang)
    p = spline([(-w / 2, 0), (-w * .3, -h / 2), (w * .3, -h / 2), (w / 2, 0), (w * .3, h / 2), (-w * .3, h / 2)])
    neon(cv, p, RED, 5, a)
    cv.restore()


def chain(cv, p0, p1, link=34, a=1.0, w=4.5, phase=0.0, sag=0.0):
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]
    L = math.hypot(dx, dy)
    n = max(int(L / (link * .78)), 1)
    for i in range(n):
        t = (i + .5) / n
        x = p0[0] + dx * t
        y = p0[1] + dy * t + math.sin(math.pi * t) * sag
        ang = math.degrees(math.atan2(dy, dx))
        cv.save()
        cv.translate(x, y)
        cv.rotate(ang)
        if i % 2 == 0:
            neon(cv, rrect(-link / 2, -link * .28, link, link * .56, link * .28), RED, w, a, None)
        else:
            cv.drawLine(-link / 2, 0, link / 2, 0, SP(RED, w + 2, a))
        cv.restore()


def heart_path(cx, cy, s):
    pts = []
    for i in range(64):
        t = 2 * math.pi * i / 64
        x = 16 * math.sin(t) ** 3
        y = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
        pts.append((cx + x * s, cy - y * s))
    return poly(pts)


def flame_path(cx, cy, s, u, k=1.0):
    base = [(0, .45), (.42, .32), (.56, -.02), (.42, -.42), (.5, -.78), (.2, -.62), (.06, -1.25), (-.14, -.7),
            (-.38, -.95), (-.42, -.5), (-.56, -.06), (-.42, .32)]
    pts = []
    for i, (x, y) in enumerate(base):
        w = noise1(u * 7 + i * 1.7, i) * (.1 if y < -.5 else .04)
        pts.append((cx + (x + w) * 100 * s, cy + (y * k + (w * .5 if y < -.5 else 0)) * 100 * s))
    return spline(pts)


def crown_path(cx, cy, s):
    pts = [(-1, .5), (-1, -.35), (-.55, .05), (-.3, -.6), (0, 0), (.3, -.6), (.55, .05), (1, -.35), (1, .5)]
    return poly([(cx + x * 90 * s, cy + y * 90 * s) for x, y in pts])


def battery(cv, x, y, s, level, a=1.0, blink=1.0):
    neon(cv, rrect(x - 55 * s, y - 100 * s, 110 * s, 200 * s, 16 * s), RED, 6 * s, a)
    neon(cv, rrect(x - 22 * s, y - 118 * s, 44 * s, 18 * s, 5 * s), RED, 5 * s, a)
    lv = clamp(level)
    if lv > 0:
        hgt = 172 * s * lv
        cv.drawPath(rrect(x - 41 * s, y + 86 * s - hgt, 82 * s, hgt, 8 * s), FP(RED if lv < .3 else HOT, a * blink))


def warn(cv, x, y, s, a=1.0):
    p = poly([(x, y - 80 * s), (x + 80 * s, y + 60 * s), (x - 80 * s, y + 60 * s)])
    neon(cv, p, RED, 7 * s, a)
    line(cv, x, y - 30 * s, x, y + 15 * s, WHT, 9 * s, a)
    dot(cv, x, y + 38 * s, 6 * s, WHT, a)


def med_cross(cv, x, y, s, a=1.0):
    circ(cv, x, y, 70 * s, RED, 6 * s, a)
    p = poly([(x - 15 * s, y - 45 * s), (x + 15 * s, y - 45 * s), (x + 15 * s, y - 15 * s), (x + 45 * s, y - 15 * s),
              (x + 45 * s, y + 15 * s), (x + 15 * s, y + 15 * s), (x + 15 * s, y + 45 * s), (x - 15 * s, y + 45 * s),
              (x - 15 * s, y + 15 * s), (x - 45 * s, y + 15 * s), (x - 45 * s, y - 15 * s), (x - 15 * s, y - 15 * s)])
    neon(cv, p, WHT, 4 * s, a, RED, .5)


def molecule(cv, x, y, s, a=1.0, ang=0, broken=0.0):
    cv.save()
    cv.translate(x, y)
    cv.rotate(ang)
    hexp = poly([(math.cos(math.radians(60 * i + 30)) * 34 * s, math.sin(math.radians(60 * i + 30)) * 34 * s)
                 for i in range(6)])
    neon(cv, hexp, HOT, 4.5 * s, a, None)
    pts = [(29 * s, -17 * s), (60 * s, -34 * s), (90 * s, -17 * s), (120 * s, -34 * s)]
    if broken > 0:
        pts = [(px + broken * 40 * (i % 2 - .5), py + broken * 60 * i / 3) for i, (px, py) in enumerate(pts)]
    cv.drawPath(poly(pts, False), SP(HOT, 4.5 * s, a))
    dot(cv, -29 * s, 17 * s, 5 * s, HOT, a)
    dot(cv, -29 * s, -17 * s, 5 * s, HOT, a)
    cv.restore()


def arrow_up(cv, x, y, s, a=1.0, c=WHT):
    p = poly([(x, y - 90 * s), (x + 70 * s, y - 15 * s), (x + 25 * s, y - 15 * s), (x + 25 * s, y + 80 * s),
              (x - 25 * s, y + 80 * s), (x - 25 * s, y - 15 * s), (x - 70 * s, y - 15 * s)])
    neon(cv, p, c, 6 * s, a, RED, .35)


# ---------------------------------------------------------------- brain / head
_rng = random.Random(7)


def _brain_geom():
    pts = []
    for i in range(48):
        th = 2 * math.pi * i / 48
        rx, ry = 270, 195
        x = math.cos(th) * rx
        y = math.sin(th) * ry
        if y > 0:
            y *= .62
        bump = 1 + .035 * math.sin(th * 11) + .02 * math.sin(th * 5 + 1)
        pts.append((x * bump, y * bump - 20))
    outline = spline(pts)
    gyri = []
    r = random.Random(3)
    for i in range(20):
        x, y = r.uniform(-250, 250), r.uniform(-200, 90)
        g = [(x, y)]
        ang = r.uniform(0, 2 * math.pi)
        for k in range(5):
            ang += r.uniform(-1.6, 1.6)
            x += math.cos(ang) * 55
            y += math.sin(ang) * 40
            g.append((x, y))
        gyri.append(spline(g, closed=False))
    cereb = spline([(-235, 60), (-160, 70), (-110, 120), (-150, 170), (-240, 160), (-275, 110)])
    stem = poly([(-60, 95), (-10, 95), (-5, 250), (-55, 250)])
    return outline, gyri, cereb, stem


BRAIN = _brain_geom()


def brain(cv, cx, cy, s, a=1.0, regions=None, crack=0.0, dim=0.0):
    """regions: list of (rx, ry, rw, rh, intensity, color)"""
    outline, gyri, cereb, stem = BRAIN
    cv.save()
    cv.translate(cx, cy)
    cv.scale(s, s)
    c = mix(RED, DRED, dim)
    neon(cv, stem, c, 5, a)
    neon(cv, cereb, c, 5, a)
    for k in range(4):
        cv.drawPath(spline([(-260 + k * 8, 75 + k * 22), (-190, 85 + k * 22), (-130, 110 + k * 14)], False),
                    SP(c, 3, a * .8))
    neon(cv, outline, c, 6, a)
    cv.save()
    cv.clipPath(outline, doAntiAlias=True)
    if regions:
        for (rx, ry, rw, rh, inten, col) in regions:
            if inten <= 0:
                continue
            sh = skia.GradientShader.MakeRadial(skia.Point(rx, ry), max(rw, rh),
                                                [C(col, .95 * min(inten, 1)), C(col, .4 * min(inten, 1)), C(col, 0)],
                                                [0, .5, 1])
            p = skia.Paint(AntiAlias=True, Shader=sh)
            cv.save()
            cv.translate(rx, ry)
            cv.scale(1, rh / rw)
            cv.translate(-rx, -ry)
            cv.drawCircle(rx, ry, rw, p)
            cv.restore()
    for g in gyri:
        cv.drawPath(g, SP(c, 4, a * .85))
    cv.drawPath(spline([(-200, -40), (-60, -70), (80, -40), (200, -60)], False), SP(c, 4, a))
    if crack > 0:
        r = random.Random(11)
        for k in range(5):
            x, y = 120 + r.uniform(-30, 30), -60 + r.uniform(-80, 60)
            pts = [(x, y)]
            for j in range(int(2 + 4 * crack)):
                x += r.uniform(-40, 40)
                y += r.uniform(-35, 35)
                pts.append((x, y))
            cv.drawPath(poly(pts, False), SP(WHT, 3.5, a * crack))
    cv.restore()
    cv.restore()


HEAD_PTS = [(-250, -150), (-200, -300), (-40, -380), (130, -340), (225, -220), (240, -80), (300, 10), (262, 45),
            (275, 85), (255, 110), (270, 140), (235, 205), (150, 240), (140, 420), (-120, 420), (-150, 260),
            (-260, 120), (-290, -10)]
HEAD_PATH = spline(HEAD_PTS)


def head_profile(cv, cx, cy, s, a=1.0):
    cv.save()
    cv.translate(cx, cy)
    cv.scale(s, s)
    neon(cv, HEAD_PATH, RED, 6, a, (6, 0, 2))
    # eye
    cv.drawPath(spline([(170, -60), (205, -78), (232, -58)], False), SP(RED, 5, a))
    dot(cv, 210, -55, 7, WHT, a)
    cv.restore()


# ---------------------------------------------------------------- background
def make_smoke(seed, w=270, h=480):
    from scipy.ndimage import gaussian_filter
    r = np.random.default_rng(seed)
    n = r.random((h, w))
    n = gaussian_filter(n, 18) + .5 * gaussian_filter(r.random((h, w)), 7)
    n = (n - n.min()) / (n.max() - n.min())
    n = np.clip((n - .45) * 2.2, 0, 1) ** 1.5
    a = (n * 255).astype(np.uint8)
    rgba = np.zeros((h, w, 4), np.uint8)
    # premultiplied grey-red smoke
    rgba[..., 0] = (a * .55).astype(np.uint8)
    rgba[..., 1] = (a * .40).astype(np.uint8)
    rgba[..., 2] = (a * .42).astype(np.uint8)
    rgba[..., 3] = a
    return skia.Image.fromarray(rgba, colorType=skia.ColorType.kRGBA_8888_ColorType,
                                alphaType=skia.AlphaType.kPremul_AlphaType)


SMOKE = None


def background(cv, t, a=1.0):
    global SMOKE
    if SMOKE is None:
        SMOKE = [make_smoke(1), make_smoke(2)]
    cv.clear(C((4, 1, 2)))
    for i, img in enumerate(SMOKE):
        dx = math.sin(t * .07 + i * 2) * 120 - 120
        dy = math.cos(t * .05 + i) * 80 - 80
        cv.drawImageRect(img, skia.Rect.MakeXYWH(dx, dy, W + 240, H + 160),
                         skia.SamplingOptions(skia.FilterMode.kLinear),
                         skia.Paint(Color=C(WHT, .11 * a)))
    sh = skia.GradientShader.MakeRadial(skia.Point(W / 2, H * .55), H * .75, [C(BLACK, 0), C(BLACK, .85)])
    cv.drawRect(skia.Rect(0, 0, W, H), skia.Paint(Shader=sh))
