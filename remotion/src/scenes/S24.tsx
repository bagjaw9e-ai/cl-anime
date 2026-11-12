import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease} from '../anim';
import {Stage} from '../components/Stage';
import {Brain} from '../components/Brain';
import {MidbrainMascot} from '../components/MidbrainMascot';
import {SceneProps} from './types';

// Inti merah membesar dan makin berotot, mendesak keluar.
export const S24: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const g = ease(f, 0, dur - 10);
  const push = Math.sin(f * 0.5) * g;
  return (
    <Stage bg={{top: C.base2, bottom: C.base0, glow: C.red1, glowOp: 0.3 + g * 0.3}} particles={{n: 18, color: C.red2, color2: C.rose, opacity: 0.35}}
      cam={{s: 1 + g * 0.08, dx: push * 6}}>
      <g transform={`translate(540,900) scale(${2 + g * 0.18 + push * 0.03},${2 + g * 0.12 - push * 0.03})`}>
        <Brain pfc={0.35 - g * 0.25} mid={0.4} showMid={false} opacity={0.92} />
      </g>
      <MidbrainMascot x={584} y={960} s={0.45 + g * 0.75} mood="buff" buff={g} />
      {g > 0.6 && [0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2;
        return <line key={i} x1={584 + Math.cos(a) * 260} y1={960 + Math.sin(a) * 240} x2={584 + Math.cos(a) * 330} y2={960 + Math.sin(a) * 300}
          stroke={C.cream} strokeWidth={10} strokeLinecap="round" opacity={(g - 0.6) * 2} />;
      })}
    </Stage>
  );
};
