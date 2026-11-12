import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {pop} from '../anim';
import {Stage} from '../components/Stage';
import {CaveWall, MidCore} from './common';
import {SceneProps} from './types';

// Siluet kadal & monyet dengan inti merah yang sama di kepalanya.
const Lizard: React.FC = () => (
  <g>
    <path d="M 0 -170 C 24 -170 32 -140 26 -116 C 42 -60 46 0 34 60 C 28 100 18 140 12 200 C 8 270 -16 310 -40 340 C -14 290 -14 240 -14 200 C -22 140 -32 100 -34 60 C -46 0 -42 -60 -26 -116 C -32 -140 -24 -170 0 -170 Z"
      fill={C.rose} />
    {[[-1, -60], [1, -60], [-1, 70], [1, 70]].map(([s, y], i) => (
      <path key={i} d={`M ${s * 30} ${y} Q ${s * 90} ${y - 10} ${s * 96} ${y + (y < 0 ? -50 : 50)}`} stroke={C.rose} strokeWidth={22} fill="none" strokeLinecap="round" />
    ))}
    <circle cx={-14} cy={-150} r={6} fill={C.plum} />
    <circle cx={14} cy={-150} r={6} fill={C.plum} />
  </g>
);
const Monkey: React.FC = () => (
  <g>
    <path d="M 70 120 C 170 130 180 30 130 30 C 100 30 110 70 130 70" stroke={C.coral} strokeWidth={18} fill="none" strokeLinecap="round" />
    <ellipse cx={0} cy={40} rx={95} ry={120} fill={C.coral} />
    <ellipse cx={0} cy={60} rx={55} ry={70} fill={C.amber} opacity={0.7} />
    <circle cx={-72} cy={-112} r={28} fill={C.coral} />
    <circle cx={72} cy={-112} r={28} fill={C.coral} />
    <circle cx={0} cy={-110} r={72} fill={C.coral} />
    <ellipse cx={0} cy={-88} rx={46} ry={36} fill={C.cream} opacity={0.85} />
    <circle cx={-18} cy={-100} r={7} fill={C.plum} />
    <circle cx={18} cy={-100} r={7} fill={C.plum} />
    <path d="M -14 -70 Q 0 -62 14 -70" stroke={C.plum} strokeWidth={5} fill="none" strokeLinecap="round" />
    <ellipse cx={-70} cy={150} rx={40} ry={22} fill={C.coral} />
    <ellipse cx={70} cy={150} rx={40} ry={22} fill={C.coral} />
  </g>
);

export const S18: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const a = pop(f, 0, 12), m = pop(f, 6, 12);
  return (
    <Stage bg={{top: '#3A1C14', bottom: '#1E0C08', glowOp: 0}} under={<CaveWall />} particles={{n: 30, color: C.cream, color2: C.amber, opacity: 0.4, speed: 0.4, size: 0.8}}>
      <g transform={`translate(300,1020) scale(${a * 1.25}) rotate(-12)`}>
        <Lizard />
        <MidCore x={0} y={-118} s={0.28} />
      </g>
      <g transform={`translate(770,1040) scale(${m * 1.3})`}>
        <Monkey />
        <MidCore x={0} y={-130} s={0.3} />
      </g>
      {/* garis penghubung inti */}
      <path d="M 330 870 Q 540 720 770 870" stroke={C.red2} strokeWidth={6} strokeDasharray="6 18" strokeLinecap="round" fill="none" opacity={m * 0.8} />
    </Stage>
  );
};
