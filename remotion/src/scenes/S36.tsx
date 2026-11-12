import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease, pop} from '../anim';
import {Stage} from '../components/Stage';
import {Character} from '../components/Character';
import {Brain} from '../components/Brain';
import {Floor} from '../components/Props';
import {SceneProps} from './types';

// Bagian depan otak nyala emas lagi; karakter berdiri tegak, arms_crossed, determined.
export const S36: React.FC<SceneProps> = ({b, dur}) => {
  const f = useCurrentFrame();
  const beat = b[0] ?? 33;
  const pfc = ease(f, 2, 24, 0.15, 1);
  const bIn = pop(f, 0, 12);
  const z = ease(f, beat - 4, dur, 1.25, 1);
  return (
    <Stage bg={{top: '#6E3350', bottom: '#2E5E5A', glow: C.gold, glowY: 640, glowOp: 0.25 + pfc * 0.3}} particles={{n: 30, color: C.gold, color2: C.mint, opacity: 0.5}}
      cam={{x: 540, y: f < beat ? 860 : 960, s: f < beat ? 1.3 : z}}>
      <Floor y={1660} color="#24434A" glow={C.teal} />
      <g transform={`translate(540,${620 + Math.sin(f * 0.12) * 10}) scale(${bIn * 0.95})`}>
        {pfc > 0.9 && Array.from({length: 10}).map((_, i) => (
          <line key={i} x1={-150} y1={-30} x2={-150 + Math.cos(i * 0.63) * 300} y2={-30 + Math.sin(i * 0.63) * 300} stroke={C.gold} strokeWidth={8}
            strokeLinecap="round" opacity={0.25} />
        ))}
        <Brain pfc={pfc} mid={0.25} />
      </g>
      <Character x={540} y={1660} scale={1.15} pose={[[0, 'standing_relaxed'], [beat, 'arms_crossed']]}
        expression={[[0, 'neutral'], [beat, 'determined']]} talking={f >= beat} id="s36" lookAt={f < beat ? {x: 0, y: -1} : {x: 0, y: 0}} />
    </Stage>
  );
};
