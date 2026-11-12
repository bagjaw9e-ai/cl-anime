import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease, pop} from '../anim';
import {Stage} from '../components/Stage';
import {Character} from '../components/Character';
import {Bulb, Gear} from '../components/Props';
import {SceneProps} from './types';

// Di dalam dahi: gear emas berputar + bohlam menyala.
export const S10: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const open = pop(f, 0, 14);
  const on = ease(f, 20, 28);
  const R = 260 * open;
  return (
    <Stage bg={{top: C.plum, bottom: C.base1, glow: C.gold, glowY: 820, glowOp: 0.25 + on * 0.2}}
      particles={{n: 20, color: C.gold, color2: C.cream, opacity: 0.35}} cam={{s: ease(f, 0, 60, 1, 1.06), y: 820}}>
      <Character x={540} y={3350} scale={4.4} pose="standing_relaxed" expression="determined" id="s10" />
      <defs><clipPath id="s10w"><circle cx={540} cy={640} r={R} /></clipPath></defs>
      <circle cx={540} cy={640} r={R + 26} fill={C.gold} opacity={0.9} />
      <circle cx={540} cy={640} r={R + 12} fill={C.amber} />
      <g clipPath="url(#s10w)">
        <rect x={0} y={200} width={1080} height={1000} fill="#3B1A36" />
        <circle cx={540} cy={640} r={300} fill={C.plum} opacity={0.6} />
        <Gear x={420} y={760} R={130} n={12} rot={f * 3} />
        <Gear x={660} y={770} R={110} n={9} rot={-f * 4 + 10} color={C.amber} />
        <Gear x={690} y={540} R={80} n={8} rot={f * 5.5} color={C.gold} />
        <Gear x={380} y={520} R={70} n={8} rot={-f * 6} color={C.amber} />
        <Bulb x={540} y={590} s={0.8} on={on} />
      </g>
    </Stage>
  );
};
