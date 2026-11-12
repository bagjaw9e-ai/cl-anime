import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease, pop} from '../anim';
import {Stage} from '../components/Stage';
import {Character} from '../components/Character';
import {Brain} from '../components/Brain';
import {SceneProps} from './types';

// Zoom ke dahi karakter, area otak depan menyala emas.
export const S09: React.FC<SceneProps> = ({b}) => {
  const f = useCurrentFrame();
  const beat = b[0] ?? 26;
  const z = ease(f, beat - 4, beat + 10);
  const glow = pop(f, beat - 2, 14);
  return (
    <Stage bg={{top: C.plum, bottom: C.base1, glow: C.amber, glowY: 1000, glowOp: 0.3 + glow * 0.2}}
      particles={{n: 22, color: C.gold, color2: C.amber, opacity: 0.4}}
      cam={{x: 540, y: 1000 - z * 140, s: 1 + z * 0.9}}>
      <Character x={540} y={1980} scale={2} pose="standing_relaxed" expression={[[0, 'neutral'], [beat, 'thinking']]}
        talking id="s9" lookAt={{x: 0, y: -z * 0.6}} />
      {/* otak di dalam kepala, bagian depan menyala */}
      <g opacity={0.35 + glow * 0.55}>
        <Brain x={540} y={845} s={0.3} pfc={glow} mid={0.2} opacity={0.75} />
      </g>
      <ellipse cx={540} cy={860} rx={120} ry={60} fill={C.gold} opacity={glow * 0.35} />
    </Stage>
  );
};
