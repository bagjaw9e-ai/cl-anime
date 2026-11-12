import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {pop} from '../anim';
import {Stage} from '../components/Stage';
import {MidCore} from './common';
import {SceneProps} from './types';

// Insting dasar: paha ayam + sarang burung dengan telur.
const Drumstick: React.FC = () => (
  <g>
    <path d="M 40 40 L 120 120" stroke={C.cream} strokeWidth={30} strokeLinecap="round" />
    <circle cx={120} cy={138} r={22} fill={C.cream} />
    <circle cx={138} cy={120} r={22} fill={C.cream} />
    <path d="M -110 -40 C -120 -130 -20 -170 50 -110 C 110 -60 90 30 40 60 C -10 90 -100 40 -110 -40 Z" fill={C.amber} />
    <path d="M -80 -60 C -70 -110 -20 -130 20 -110" stroke="#FFE2A8" strokeWidth={16} fill="none" strokeLinecap="round" opacity={0.7} />
    <path d="M 0 40 C 40 40 70 10 70 -30" stroke="#B5652E" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.6} />
  </g>
);
const Nest: React.FC<{f: number}> = ({f}) => (
  <g>
    {[0, 1, 2].map((i) => (
      <ellipse key={i} cx={-60 + i * 60} cy={-40} rx={46} ry={60} fill={C.cream}
        transform={`rotate(${Math.sin(f * 0.6 + i * 2) * 8} ${-60 + i * 60} 10)`} />
    ))}
    <path d="M -10 -80 L 4 -66 L -6 -56 L 8 -44" stroke={C.amber} strokeWidth={4} fill="none" />
    <path d="M -190 -10 C -170 90 170 90 190 -10 C 120 20 -120 20 -190 -10 Z" fill="#7A4A2E" />
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M ${-180 + i * 10} ${-4 + i * 14} Q 0 ${30 + i * 16} ${180 - i * 10} ${-4 + i * 14}`} stroke={i % 2 ? '#A86A3E' : '#5C3420'} strokeWidth={9} fill="none" />
    ))}
  </g>
);

export const S19: React.FC<SceneProps> = ({b}) => {
  const f = useCurrentFrame();
  const b0 = b[0] ?? 48, b1 = b[1] ?? 66;
  const d = pop(f, b0 - 2), n = pop(f, b1 + 4);
  return (
    <Stage bg={{top: C.base2, bottom: C.base0, glow: C.amber, glowY: 960, glowOp: 0.25}} particles={{n: 18, color: C.amber, color2: C.cream, opacity: 0.35}}>
      {/* gelombang insting */}
      {[0, 1, 2, 3].map((i) => {
        const u = ((f * 0.03 + i / 4) % 1);
        return <circle key={i} cx={540} cy={960} r={120 + u * 420} fill="none" stroke={C.coral} strokeWidth={8} opacity={(1 - u) * 0.45} />;
      })}
      <path d="M 540 960 L 300 600" stroke={C.cream} strokeWidth={6} strokeDasharray="4 18" strokeLinecap="round" opacity={d * 0.7} />
      <path d="M 540 960 L 780 1340" stroke={C.cream} strokeWidth={6} strokeDasharray="4 18" strokeLinecap="round" opacity={n * 0.7} />
      <MidCore s={1.1} />
      <g transform={`translate(300,590) scale(${d * 1.15}) rotate(${Math.sin(f * 0.2) * 6})`}><Drumstick /></g>
      <g transform={`translate(780,1380) scale(${n * 1.05})`}><Nest f={f} /></g>
    </Stage>
  );
};
