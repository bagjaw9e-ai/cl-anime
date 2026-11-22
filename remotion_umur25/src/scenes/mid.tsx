// SHOT 3: MID-CTA — panggung gelap minimalis ala ref_1, objek menyala amber (beat 18-21).
import React from 'react';
import {DarkStage} from '../components/Places';
import {LitCharacter, Reflect, Rise} from '../components/Lit';
import * as B from '../illustrations/part2';
import * as PR from '../illustrations/promo';
import {Appear, be, bf, camKeys, ease, kp} from '../kit';
import {ShotDef} from './types';

const FL = 1152;
export const shotMid: ShotDef = {
  id: 'mid', from: bf(18), to: bf(22), enter: 'dark', trLen: 20, floorY: FL,
  cam: (f) => camKeys(f, [
    [bf(18), 540, 820, 1.0], [be(18), 560, 800, 1.06],     // push pelan
    [bf(19, 10), 560, 820, 1.14], [be(19), 560, 820, 1.18], // push-in ke saraf
    [bf(20, 12), 560, 760, 1.08], [be(20), 560, 740, 1.1],  // tilt naik (link di bio)
    [bf(21, 10), 540, 800, 1.0], [be(21), 540, 800, 1.04],
  ]),
  bg: (f) => <DarkStage warm={0.6 * ease(f, bf(18), bf(18, 30)) * (1 - ease(f, bf(21, 4), bf(21, 10)))} />,
  bgBlur: () => 0,
  dim: (f) => 0.55 * ease(f, bf(21, 4), bf(21, 8)) - 0.2 * ease(f, bf(21, 14), bf(21, 30)),
  fg: (f) => {
    const amberOff = 1 - ease(f, bf(21, 2), bf(21, 8)); // lampu amber mati (flicker)
    const flick = f > bf(21) && f < bf(21, 10) ? (Math.floor(f / 2) % 2 ? 0.3 : 1) : 1;
    return (
      <g>
        <g opacity={amberOff * flick}>
          <Appear f={f} a={bf(18, 4)} b={be(18)} x={580} y={600} kind="glow"><B.AmberBrain glow={ease(f, bf(18, 6), bf(18, 40))} t={f} s={0.95} /></Appear>
          <Appear f={f} a={bf(18, 30)} b={be(18)} x={580} y={600} kind="glow"><PR.NeuronNet t={f} grow={ease(f, bf(18, 34), be(18) - 10)} s={0.55} /></Appear>
          <Appear f={f} a={bf(19, 2)} b={be(19)} x={600} y={660} s={0.9} kind="glow"><B.NerveReconnect join={ease(f, bf(19, 10), bf(19, 52))} t={f} /></Appear>
          <Appear f={f} a={bf(20, 2)} b={be(20, 6)} x={640} y={660} kind="glow"><PR.EbookTablet t={f} on={ease(f, bf(20, 4), bf(20, 18))} s={0.62} /></Appear>
          <Appear f={f} a={bf(20, 22)} b={be(20, 6)} x={880} y={540} s={0.5}><PR.LinkIcon t={f} on={ease(f, bf(20, 22), bf(20, 32))} /></Appear>
          <Appear f={f} a={bf(20, 26)} b={be(20, 6)} x={880} y={430} kind="glow"><PR.ArrowUp t={f} on={1} h={170} /></Appear>
          <Rise x={560} y={FL - 200} w={600} h={600} n={12} seed={81} op={ease(f, bf(18, 20), bf(18, 50))} t={f} />
        </g>
        <Appear f={f} a={bf(21, 6)} b={be(21) + 10} x={540} y={420} kind="glow" out={10}><B.SirenLight on={ease(f, bf(21, 10), bf(21, 18))} t={f} /></Appear>
        <Reflect floor={FL} op={0.2}>
          <LitCharacter id="m_m" x={kp(f, [[bf(18), 280], [bf(20), 280], [bf(20, 10), 300]])} y={FL} scale={0.9}
            pose={[[-100, 'standing_relaxed'], [bf(20, 6), 'pointing_up'], [bf(21, 4), 'nervous_stand']]}
            expression={[[-100, 'curious'], [bf(19, 4), 'relieved'], [bf(20, 4), 'confident'], [bf(21, 6), 'worried']]}
            lookAt={f < bf(19) ? {x: 0.6, y: -1} : {x: 0.4, y: -0.3}} haloColor={f > bf(21, 8) ? '#FF4A3A' : '#FFB23F'} halo={1 - 0.4 * ease(f, bf(21, 4), bf(21, 8))} />
        </Reflect>
      </g>
    );
  },
};
