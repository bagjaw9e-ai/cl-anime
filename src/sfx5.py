#!/usr/bin/env python3
"""Video 5 SFX: only on animations (none on transitions), matched to each beat's action, -6 dB LUFS under voice."""
import sys
import numpy as np
import scenes5 as S5
import b3d_sfx as X
import sfx as O
import sfx3 as G
import sfx4 as F4

SR = 44100
B = S5.B


def build():
    total = int((S5.AUDIO_LEN + .5) * SR)
    L = np.zeros(total)
    R = np.zeros(total)

    def put(beat, t, x, g=.5, pan=0.0):
        i = int(max(B[beat - 1] + t, 0) * SR)
        x = np.asarray(x, float)[:max(total - i, 0)]
        L[i:i + len(x)] += x * g * min(1, 1 - pan)
        R[i:i + len(x)] += x * g * min(1, 1 + pan)

    put(1, .15, O.chime((880, 1320, 1760), 1.6), .35)                 # diamond ring sparkles
    put(1, 1.6, F4.buzz(1.2), .3, .3)                                 # hidden phone buzzes
    for k in range(3):
        put(2, .1 + k * .77, O.heartbeat(), .45)                      # heart beats...
    put(2, .5, X.metal_crack(), .3)                                   # ...and cracks
    put(2, .6, O.crackle(1.8, 25), .25)
    put(3, .1, X.shimmer(2.6, 1400), .3)                              # proud halo
    put(4, .3, O.powerdown(.9), .3)                                   # spotlight reveals the weak shadow
    put(4, .5, X.wobble(1.8), .2, .3)                                 # trembling
    put(5, .0, O.whoosh(.5, 2500, 400), .25)                          # phone descends
    for k, f in enumerate((196, 247, 294)):
        put(5, .3 + k * .1, X.pluck(f, .9), .35, (k - 1) * .4)        # strings attach
    for k in range(4):
        put(5, .11 + k * .449, X.knock_wood(), .3, .3 if k % 2 else -.3)
    put(6, .2, X.shimmer(1.4, 900), .2, -.3)                          # wife reaches out
    for k in range(6):
        put(6, .3 + k * .37, X.knock_wood() * .4, .25, .5)            # his footsteps walking away
    put(7, .4, X.typing(1.6), .35, .2)                                # laptop
    for t0 in (1.2, 2.4, 3.6, 4.6):
        put(7, t0 + .45, X.flick(), .4, .3)                           # tissues drop
    put(7, .5, X.deflate(4.5) * .7, .2)                               # energy drained
    put(8, .1, O.glitch(.5), .4)                                      # illusion glitches
    put(8, .5, X.tinkles(.9, 30, 3000, 8000), .2)                     # and dissolves
    put(9, .2, O.whoosh(.4, 400, 2500), .3, .3)                       # fist raised
    put(9, .45, O.boom(1.2, 110, 40), .45)
    for k in range(4):
        put(9, .4 + k * .8, X.sub_thump(55, .4), .4, -.2)             # shockwaves
    put(10, .1, X.clank(), .35)                                       # chained brain
    put(10, .15, X.rattle(1.6), .22)
    put(11, .4, X.wobble(2.6), .3, .2)                                # grumbling on the sofa
    for k in range(5):
        put(12, .2 + k * .55 + .25, X.stone(), .35, .3)               # boxes thud onto her
    put(12, .9, X.glide(220, 180, .35, 'square') * X.adsr(int(.35 * SR), .005, .15), .3, -.3)   # rejected
    for k in range(5):
        put(13, .15 + k * .22, X.knock_wood() * .5, .3, -.5)          # child footsteps
    put(13, 1.2, G.roar(.9) * .5, .2, -.2)                            # ball rolling
    put(13, 2.2, X.knock_wood(), .45)                                 # bump
    put(13, 2.25, O.glitch(.35), .35)                                 # screen glitch
    put(14, .0, O.boom(1.3, 130, 35), .5)                             # rage explodes
    put(14, .05, G.roar(3.3), .35)
    put(14, .1, O.zap(.4), .25, .3)
    put(15, .05, X.stutter(.6, 180), .25, .3)
    for k in range(5):
        put(15, .5 + k * .7, O.whoosh(.3, 600, 3500), .25, .4)       # insults hurled
        put(15, .8 + k * .7, X.stone() * .8, .4, -.2)                 # punching bag hit
    put(16, .1, X.wobble(3.6) * .7, .25)                              # dread / trembling
    put(16, .2, O.hiss(2.5) * .3, .2)
    put(17, .0, X.deflate(1.0), .3)                                   # heart turns to stone
    put(17, .7, X.metal_crack(), .35)
    put(17, 1.1, X.crumble(.8), .35)
    put(18, .1, X.bass_pulse(2.2, 3.5), .4)                           # prefrontal pulses
    put(19, .0, X.deflate(1.3), .35)                                  # shrinks
    put(20, .1, O.crackle(2.4, 70), .25)                              # freezing
    put(20, .1, X.shimmer(2.6, 2400), .2)
    put(21, .5, O.whoosh(.5, 1500, 400), .25, .2)                     # crown falls
    put(21, 1.1, X.glass_burst(1.0), .4, .2)                          # and shatters
    for k in range(7):
        put(21, 1.25 + k * .28, X.knock_wood() * .4, .3, -.5)         # family walks away
    put(22, .1, X.crumble(2.6) * .8, .3)                              # decay cracks
    put(23, .0, O.hiss(.8), .3)
    put(23, .05, G.roar(2.4), .55)                                    # house burns
    put(23, 1.3, O.rumble(1.2), .5)                                   # and collapses
    for k in range(4):
        put(24, .05 + k * .25, X.knock_wood() * .6, .3, -.4)          # he runs in
    put(24, 0.1, X.metal_crack() * .7, .3, .3)                        # house cracks
    put(24, 1.05, X.stone(), .45)                                     # props it up
    for k, f in enumerate((392, 440, 523, 587, 659, 784)):
        put(25, .1 + k * .28, X.pluck(f, .8), .25, (k % 3 - 1) * .4)  # neurons reconnect
    put(25, .1, X.tinkles(1.8, 30), .15)
    put(26, .0, O.whoosh(.5, 300, 3000), .3)                          # PMO Savior phone
    put(26, .4, X.marimba(784), .4)
    put(26, .52, X.marimba(1175), .3)
    put(26, .7, X.bubble(1000), .3)                                   # arrow to bio
    put(26, 2.25, O.click(.04, 2000), .35, .3)                        # tap
    put(26, 2.3, X.marimba(1568, 1.2), .35, .3)
    return np.stack([L, R], 1)


if __name__ == '__main__':
    F4.build = build
    F4.S4 = S5
    F4.mix(sys.argv[1], sys.argv[2])
