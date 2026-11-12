import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, mix} from '../theme';
import {ease} from '../anim';
import {Stage} from '../components/Stage';
import {Character} from '../components/Character';
import {Sparkle} from '../components/Props';
import {SceneProps} from './types';

// Cahaya keemasan hangat membanjiri layar, palet pindah ke hangat + teal (shimmer).
export const S33: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const w = ease(f, 0, 22);
  const flash = Math.max(0, 0.55 - f / 14);
  return (
    <Stage bg={{top: mix(C.plum, C.amber, w), bottom: mix(C.base1, '#2E5E5A', w), glow: C.gold, glowY: 420, glowR: 900, glowOp: 0.3 + w * 0.45}}
      particles={{n: 40, color: C.gold, color2: C.mint, opacity: 0.6, speed: 1.4}} flash={flash} flashColor="#FFE9A8">
      {/* sinar dari atas */}
      <g transform={`translate(540,260) rotate(${f * 0.4})`} opacity={w * 0.5}>
        {Array.from({length: 12}).map((_, i) => (
          <path key={i} d="M 0 0 L -60 1600 L 60 1600 Z" fill={i % 2 ? C.gold : C.cream} opacity={0.35} transform={`rotate(${i * 30})`} />
        ))}
      </g>
      <circle cx={540} cy={260} r={110 + w * 40} fill="#FFF3C4" opacity={w * 0.9} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Sparkle key={i} x={200 + i * 170} y={700 + (i % 2) * 180 - f * 2} s={0.6 + 0.3 * Math.sin(f * 0.3 + i)} color={i % 2 ? C.mint : C.cream} opacity={w} />
      ))}
      <rect x={-100} y={1640} width={1300} height={400} fill={mix(C.base1, '#2E5E5A', w)} />
      <Character x={540} y={1640} scale={1.2} pose="standing_relaxed" expression={[[0, 'sad'], [12, 'happy']]} id="s33" lookAt={{x: 0, y: -1}} />
    </Stage>
  );
};
