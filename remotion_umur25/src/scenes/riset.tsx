// SHOT 5: RISET — lab/ruang riset gelap, monitor & papan tulis menyala ala ref_1 (beat 32-36).
import React from 'react';
import {LabDark} from '../components/Places';
import {LitCharacter, Reflect, Rise} from '../components/Lit';
import {Spotlight} from '../components/Spot';
import * as C from '../illustrations/part3';
import {Appear, be, bf, camKeys, ease} from '../kit';
import {ShotDef} from './types';

const FL = 1250;
export const shotRiset: ShotDef = {
  id: 'riset', from: bf(32), to: bf(37), enter: 'dark', trLen: 20, floorY: FL,
  cam: (f) => camKeys(f, [
    [bf(32), 540, 860, 1.0], [be(32), 540, 860, 1.06],
    [bf(33, 10), 480, 860, 1.04], [be(33), 600, 860, 1.04],   // pan
    [bf(34, 10), 540, 820, 1.15], [be(34), 540, 800, 1.2],    // push ke otak
    [bf(35, 10), 600, 860, 1.0], [be(35), 480, 860, 1.0],     // pan
    [bf(36, 4), 540, 880, 1.05], [be(36), 600, 880, 1.05],    // tracking samping
  ]),
  bg: (f) => <LabDark boardOn={ease(f, bf(32), bf(32, 20))} />,
  bgBlur: () => 3,
  dim: () => 0.35,
  fg: (f) => (
    <g>
      <Spotlight x={540} y={820} rx={560} ry={760} dark={0.5} />
      <Appear f={f} a={bf(32, 4)} b={be(32)} x={540} y={760} s={0.95} kind="glow"><C.JournalGlow on={ease(f, bf(32, 4), bf(32, 20))} mag={ease(f, bf(32, 16), be(32) - 6)} /></Appear>
      <Appear f={f} a={bf(33, 2)} b={be(33)} x={540} y={760} s={0.8}><C.WeekHours stack={ease(f, bf(33, 8), bf(33, 60))} bars={ease(f, bf(33, 50), be(33) - 6)} /></Appear>
      <Appear f={f} a={bf(34, 2)} b={be(34)} x={540} y={720} s={0.95} kind="glow"><C.StriatumBrain shrink={ease(f, bf(34, 10), be(34) - 4)} t={f} /></Appear>
      <Appear f={f} a={bf(35, 2)} b={be(35)} x={560} y={FL} kind="rise"><C.ResearcherBoard arrows={ease(f, bf(35, 12), be(35) - 10)} point={ease(f, bf(35, 8), bf(35, 20))} /></Appear>
      {/* beat 36: treadmill ngejar hati di tongkat */}
      <Appear f={f} a={bf(36, 2)} b={be(36) + 30} x={500} y={FL} kind="glow">
        <Reflect floor={0} op={0.15}>
          <C.TreadmillHeart t={f} />
          <LitCharacter id="r_m" x={-20} y={-40} scale={0.95} pose="running_treadmill" expression="obsessive" haloColor="#FF8FC0" />
        </Reflect>
      </Appear>
      <Rise x={540} y={900} w={700} h={600} n={10} seed={91} op={0.6} t={f} color="#9FE0F0" />
    </g>
  ),
};
