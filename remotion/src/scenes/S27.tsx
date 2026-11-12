import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {Stage} from '../components/Stage';
import {Character} from '../components/Character';
import {SceneProps} from './types';

// Karakter lari di roda hamster.
export const S27: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const rot = -f * 9;
  return (
    <Stage bg={{top: C.base2, bottom: C.base0, glow: C.red1, glowY: 1000, glowOp: 0.4}} particles={{n: 16, color: C.rose, color2: C.amber, opacity: 0.3}}
      cam={{s: 1.02, y: 990}}>
      {/* kaki penyangga */}
      <path d="M 540 1000 L 300 1560 M 540 1000 L 780 1560" stroke="#7A4A32" strokeWidth={30} strokeLinecap="round" />
      <rect x={220} y={1540} width={640} height={36} rx={18} fill="#5C3424" />
      <g transform={`translate(540,1000) rotate(${rot})`}>
        <circle r={420} fill="none" stroke={C.amber} strokeWidth={34} />
        <circle r={420} fill={C.amber} opacity={0.06} />
        {Array.from({length: 24}).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return <line key={i} x1={Math.cos(a) * 404} y1={Math.sin(a) * 404} x2={Math.cos(a) * 380} y2={Math.sin(a) * 380} stroke={C.gold} strokeWidth={14} />;
        })}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return <line key={i} x1={0} y1={0} x2={Math.cos(a) * 404} y2={Math.sin(a) * 404} stroke={C.amber} strokeWidth={10} opacity={0.35} />;
        })}
      </g>
      <circle cx={540} cy={1000} r={30} fill="#7A4A32" />
      <Character x={540} y={1395} scale={1.0} pose="running" expression="worried" id="s27" walkSpeed={1.3} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={140 + ((f * 18 + i * 120) % 300)} y={1200 + i * 60} width={90} height={10} rx={5} fill={C.cream} opacity={0.4} />
      ))}
    </Stage>
  );
};
