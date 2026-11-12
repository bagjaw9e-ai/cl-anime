import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease, pop} from '../anim';
import {Stage} from '../components/Stage';
import {Brain} from '../components/Brain';
import {Arrow} from '../components/Props';
import {SceneProps} from './types';

// Close-up otak depan, cahaya emas meredup seperti lampu mau mati + panah turun.
export const S08: React.FC<SceneProps> = ({b, dur}) => {
  const f = useCurrentFrame();
  const beat = b[0] ?? 34;
  const dim = ease(f, 0, dur - 12, 1, 0.08);
  // flicker turun
  const fl = f % 9 < 2 || (f > beat && f % 5 === 0) ? 0.35 : 1;
  const pfc = dim * fl;
  const arrowP = pop(f, 6);
  const arrow2 = pop(f, beat);
  const ay = ((f * 4) % 120);
  return (
    <Stage bg={{top: C.base2, bottom: C.base0, glow: C.gold, glowX: 520, glowY: 940, glowOp: 0.35 * pfc}}
      particles={{n: 14, color: C.gold, color2: C.rose, opacity: 0.3 * pfc + 0.1}} cam={{s: ease(f, 0, dur, 1, 1.1)}}>
      <Brain x={860} y={960} s={2.5} pfc={pfc} mid={0.3} />
      <g transform={`translate(190,${760 + ay * 0.5}) scale(${arrowP * 0.9})`}>
        <Arrow color={C.red2} len={240} />
      </g>
      <g transform={`translate(890,${1450 + ay * 0.4}) scale(${arrow2 * 0.75})`}>
        <Arrow color={C.coral} len={200} />
      </g>
    </Stage>
  );
};
