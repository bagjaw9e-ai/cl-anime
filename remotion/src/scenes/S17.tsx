import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, rand} from '../theme';
import {ease} from '../anim';
import {Stage} from '../components/Stage';
import {CaveWall, MidCore} from './common';
import {SceneProps} from './types';

// Inti merah dikelilingi batu/gua, debu, gaya lukisan gua.
const Hand: React.FC<{x: number; y: number; r: number; c: string}> = ({x, y, r, c}) => (
  <g transform={`translate(${x},${y}) rotate(${r})`} opacity={0.55}>
    <ellipse cx={0} cy={20} rx={42} ry={48} fill={c} />
    {[-30, -12, 6, 24].map((dx, i) => <rect key={i} x={dx - 8} y={-70 + Math.abs(i - 1.5) * 10} width={16} height={70} rx={8} fill={c} />)}
    <rect x={34} y={-6} width={16} height={50} rx={8} fill={c} transform="rotate(-40 40 20)" />
  </g>
);

export const S17: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  return (
    <Stage bg={{top: '#3A1C14', bottom: '#1E0C08', glowOp: 0}} under={<CaveWall />} particles={{n: 40, color: C.cream, color2: C.amber, opacity: 0.45, speed: 0.4, size: 0.8}}
      cam={{s: ease(f, 0, dur, 1.08, 1), r: ease(f, 0, dur, -2, 1)}}>
      <Hand x={220} y={620} r={-20} c={C.amber} />
      <Hand x={860} y={1380} r={160} c={C.coral} />
      <Hand x={870} y={560} r={25} c={C.cream} />
      {/* cincin batu */}
      {Array.from({length: 16}).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const r = 300 + rand(i) * 30;
        return <ellipse key={i} cx={540 + Math.cos(a) * r} cy={960 + Math.sin(a) * r} rx={64 + rand(i + 2) * 20} ry={48 + rand(i + 5) * 16}
          fill={i % 2 ? '#6B3A26' : '#83503A'} transform={`rotate(${i * 30} ${540 + Math.cos(a) * r} ${960 + Math.sin(a) * r})`} />;
      })}
      <circle cx={540} cy={960} r={250} fill="#2A120C" opacity={0.7} />
      {/* goresan lukisan gua */}
      <path d="M 300 1260 Q 540 1320 780 1260 M 320 1300 Q 540 1370 760 1300" stroke={C.amber} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.6} />
      <MidCore s={1.4} rough />
    </Stage>
  );
};
