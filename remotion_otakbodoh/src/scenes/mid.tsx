// SHOT 3: MID-CTA — panggung gelap minimalis, objek menyala amber (beat 23-26).
import React from 'react';
import {DarkStage} from '../components/Places';
import {LitCharacter, Reflect, Rise} from '../components/Lit';
import * as B from '../illustrations/part2';
import * as PR from '../illustrations/promo';
import * as U from '../illustrations/u25';
import {Appear, be, bf, camKeys, ease, kp} from '../kit';
import {setKeyPos} from '../components/UI';
import {ShotDef} from './types';

const FL = 1152;
setKeyPos({23: [600, 400], 26: [540, 420]});

export const shotMid: ShotDef = {
  id: 'mid', from: bf(23), to: bf(27), enter: 'dark', trLen: 18, floorY: FL,
  cam: (f) => camKeys(f, [
    [bf(23), 540, 820, 1.0], [be(23), 560, 810, 1.04],
    [bf(24, 6), 560, 760, 1.04], [be(24), 560, 740, 1.06],   // tilt naik (link di bio)
    [bf(25, 10), 580, 820, 1.12], [be(25), 580, 820, 1.16],  // push-in amigdala pulih
    [bf(26, 6), 540, 820, 1.0], [be(26), 540, 820, 1.02],
  ]),
  bg: (f) => <DarkStage warm={0.6 * ease(f, bf(23, 6), bf(23, 30)) * (1 - ease(f, bf(26, 4), bf(26, 10)))} />,
  bgBlur: () => 0,
  dim: (f) => 0.5 * ease(f, bf(23), bf(23, 1)) * (1 - ease(f, bf(23, 2), bf(23, 20))) + 0.55 * ease(f, bf(26, 4), bf(26, 8)) - 0.2 * ease(f, bf(26, 16), bf(26, 34)),
  fg: (f) => {
    const off = 1 - ease(f, bf(26, 2), bf(26, 8));
    const flick = f > bf(26) && f < bf(26, 12) ? (Math.floor(f / 2) % 2 ? 0.25 : 1) : 1;
    return (
      <g>
        <g opacity={off * flick}>
          <Appear f={f} a={bf(23, 4)} b={be(23)} x={600} y={640} kind="glow"><B.AmberBrain glow={ease(f, bf(23, 6), bf(23, 30))} t={f} s={1.0} /></Appear>
          <Appear f={f} a={bf(23, 20)} b={be(23)} x={600} y={640} kind="glow"><PR.NeuronNet t={f} grow={ease(f, bf(23, 22), be(23))} s={0.58} /></Appear>
          <Appear f={f} a={bf(24, 2)} b={be(24, 4)} x={620} y={680} kind="glow"><PR.EbookTablet t={f} on={ease(f, bf(24, 2), bf(24, 14))} s={1.15} /></Appear>
          <Appear f={f} a={bf(24, 8)} b={be(24, 4)} x={890} y={520} s={0.6}><PR.LinkIcon t={f} on={ease(f, bf(24, 8), bf(24, 16))} /></Appear>
          <Appear f={f} a={bf(24, 10)} b={be(24, 4)} x={890} y={400} kind="glow"><PR.ArrowUp t={f} on={1} h={180} /></Appear>
          <Appear f={f} a={bf(25, 2)} b={be(25)} x={640} y={680} s={1.0}><U.AmygdalaMonster mood="calm" t={f} calm={ease(f, bf(25, 30), bf(25, 80))} bandage={ease(f, bf(25, 50), bf(25, 90))} /></Appear>
          <Rise x={560} y={FL - 200} w={600} h={600} n={12} seed={81} op={ease(f, bf(23, 20), bf(23, 50))} t={f} />
        </g>
        <Reflect floor={FL} op={0.2}>
          <LitCharacter id="m_m" x={kp(f, [[bf(23), 260], [bf(24), 260], [bf(24, 8), 280]])} y={FL} scale={0.95}
            pose={[[-100, 'standing_relaxed'], [bf(24, 4), 'pointing_up'], [bf(25, 4), 'standing_relaxed'], [bf(26, 4), 'standing_tense']]}
            expression={[[-100, 'curious'], [bf(24, 4), 'excited'], [bf(25, 30), 'relieved'], [bf(26, 6), 'worried']]}
            lookAt={f < bf(24) ? {x: 0.6, y: -1} : {x: 0.4, y: -0.3}} haloColor={f > bf(26, 8) ? '#FF4A3A' : '#FFB23F'} halo={1 - 0.4 * ease(f, bf(26, 4), bf(26, 8))} />
        </Reflect>
      </g>
    );
  },
};
