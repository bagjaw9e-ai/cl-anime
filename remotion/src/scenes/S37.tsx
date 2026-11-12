import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {pop} from '../anim';
import {Stage} from '../components/Stage';
import {Character} from '../components/Character';
import {Floor, Sparkle} from '../components/Props';
import {SceneProps} from './types';

// Karakter pointing_up ke atas layar, ikon rantai/link teal berkilau muncul di atas.
export const LinkIcon: React.FC<{x: number; y: number; s: number; f: number}> = ({x, y, s, f}) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(-45)`}>
    <circle r={190} fill={C.teal} opacity={0.18} />
    <rect x={-150} y={-42} width={170} height={84} rx={42} fill="none" stroke={C.teal} strokeWidth={30} />
    <rect x={-20} y={-42} width={170} height={84} rx={42} fill="none" stroke={C.mint} strokeWidth={30} />
    <rect x={-150} y={-42} width={170} height={84} rx={42} fill="none" stroke="#FFFFFF" strokeWidth={6} opacity={0.35 + 0.35 * Math.sin(f * 0.3)}
      strokeDasharray="60 400" strokeDashoffset={-f * 12} />
  </g>
);

export const S37: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const li = pop(f, 6, 10);
  return (
    <Stage bg={{top: '#6E3350', bottom: '#2E5E5A', glow: C.teal, glowY: 430, glowOp: 0.4}} particles={{n: 30, color: C.mint, color2: C.gold, opacity: 0.5}}>
      <Floor y={1700} color="#24434A" glow={C.teal} />
      <LinkIcon x={600} y={430 + Math.sin(f * 0.15) * 10} s={li * 0.95} f={f} />
      {[0, 1, 2, 3].map((i) => (
        <Sparkle key={i} x={600 + Math.cos(i * 1.6 + f * 0.05) * 220} y={430 + Math.sin(i * 1.6 + f * 0.05) * 160} s={li * (0.5 + 0.4 * Math.abs(Math.sin(f * 0.25 + i)))}
          color={i % 2 ? C.gold : C.cream} />
      ))}
      <Character x={470} y={1700} scale={1.2} pose={[[0, 'standing_relaxed'], [4, 'pointing_up']]} expression="happy" talking id="s37" />
    </Stage>
  );
};
