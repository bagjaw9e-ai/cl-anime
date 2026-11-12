import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease} from '../anim';
import {Stage} from '../components/Stage';
import {Character} from '../components/Character';
import {Bolt, Floor} from '../components/Props';
import {SceneProps} from './types';

// Kilat menyambar, karakter shocked, zoom cepat.
export const S30: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const strike = (f >= 2 && f < 7) || (f >= 15 && f < 19);
  const flash = f >= 2 && f < 5 ? 0.7 : f >= 15 && f < 17 ? 0.5 : 0;
  const z = ease(f, 3, 9, 1, 1.5);
  return (
    <Stage bg={{top: strike ? '#5E2A4A' : C.base2, bottom: C.base0, glow: C.gold, glowX: 760, glowY: 700, glowOp: strike ? 0.5 : 0.1}}
      particles={{n: 14, color: C.gold, color2: C.cream, opacity: 0.35}} flash={flash} flashColor="#FFF6D8"
      cam={{x: 500, y: 1050, s: z}}>
      {/* awan */}
      <g fill="#4A2340">
        <ellipse cx={720} cy={380} rx={240} ry={90} />
        <ellipse cx={560} cy={420} rx={180} ry={70} />
        <ellipse cx={880} cy={430} rx={170} ry={70} />
      </g>
      {strike && <Bolt x={720} y={640} s={1.1} />}
      <Floor y={1650} glow={C.gold} />
      <Character x={460} y={1650} scale={1.3} pose="standing_relaxed" expression={[[0, 'neutral'], [3, 'shocked']]} id="s30" lookAt={{x: 0.7, y: -0.6}} />
    </Stage>
  );
};
