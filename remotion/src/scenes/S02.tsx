import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease, pop, shake} from '../anim';
import {Stage} from '../components/Stage';
import {Character} from '../components/Character';
import {Brain} from '../components/Brain';
import {SceneProps} from './types';

// Zoom ke kepala; otak transparan muncul, lalu mengecil + abu-abu (bass hit).
export const S02: React.FC<SceneProps> = ({hit}) => {
  const f = useCurrentFrame();
  const appear = pop(f, 4, 13);
  const shrink = ease(f, hit - 2, hit + 6);
  const [dx, dy] = shake(f, hit, 12, 22);
  const s = ease(f, 0, 30, 1.25, 1.05);
  return (
    <Stage bg={{top: C.plum, bottom: C.base0, glow: C.rose, glowY: 760, glowOp: 0.45 - shrink * 0.25}}
      particles={{n: 22, color: C.rose, color2: C.cream, opacity: 0.4}} cam={{x: 540, y: 1000, s, dx, dy}}>
      {/* garis putus-putus dari kepala ke otak */}
      <path d="M 540 1300 L 540 1000" stroke={C.cream} strokeWidth={6} strokeDasharray="4 16" strokeLinecap="round"
        opacity={appear * 0.6} />
      <Character x={540} y={2700} scale={2.1} pose="standing_relaxed" expression={[[0, 'neutral'], [hit - 6, 'dazed']]} id="s2" />
      <g transform={`translate(540,${760 + shrink * 60}) scale(${appear * (1 - shrink * 0.45)})`}>
        <Brain s={1.25} opacity={0.88} gray={shrink} pfc={0.6 - shrink * 0.5} mid={0.4} />
      </g>
      {/* partikel abu jatuh saat mengecil */}
      {shrink > 0 && [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const k = Math.max(0, f - hit);
        return <circle key={i} cx={420 + i * 34} cy={900 + k * (4 + (i % 3) * 2)} r={6} fill="#9A929A" opacity={Math.max(0, 1 - k / 30)} />;
      })}
    </Stage>
  );
};
