import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease, easeIn, pop} from '../anim';
import {Stage} from '../components/Stage';
import {SceneProps} from './types';

// Mimbar + jari telunjuk menggoyang, lalu ke-swipe keluar frame.
export const S03: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const out = easeIn(f, dur - 22, dur - 10);
  const inP = pop(f, 0, 12);
  const wag = Math.sin(f * 0.75) * 16;
  return (
    <Stage bg={{top: C.plum, bottom: C.base1, glow: C.amber, glowY: 700, glowR: 650, glowOp: 0.35}}
      particles={{n: 18, color: C.amber, color2: C.cream, opacity: 0.35}}>
      {/* lampu sorot */}
      <path d="M 470 200 L 610 200 L 900 1600 L 180 1600 Z" fill={C.amber} opacity={0.1} />
      <g transform={`translate(${540 - out * 1500},${0}) rotate(${-out * 35} 540 1300)`}>
        {/* garis kecepatan */}
        {out > 0.05 && [0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={700 + i * 40} y={900 + i * 120} width={400 * out} height={14} rx={7} fill={C.cream} opacity={0.5 * out} />
        ))}
        <g transform={`translate(0,${(1 - inP) * 300})`}>
          {/* mimbar */}
          <path d="M -230 1080 L 230 1080 L 190 1600 L -190 1600 Z" fill="#7A3E2E" />
          <path d="M -260 1040 L 260 1040 L 240 1100 L -240 1100 Z" fill="#9C5A3C" />
          <path d="M -150 1180 L 150 1180 L 135 1480 L -135 1480 Z" fill={C.plum} />
          <circle cx={0} cy={1320} r={52} fill={C.amber} opacity={0.8} />
          <circle cx={0} cy={1320} r={30} fill={C.plum} />
          {/* mikrofon */}
          <path d="M 120 1040 Q 140 960 90 900" stroke="#3A2A30" strokeWidth={10} fill="none" />
          <ellipse cx={86} cy={890} rx={22} ry={30} fill="#3A2A30" />
          {/* tangan telunjuk menggoyang */}
          <g transform={`translate(-40,960) rotate(${wag})`}>
            <path d="M -40 120 L -40 20 L 40 20 L 40 120 Z" fill={C.rose} />
            <rect x={-48} y={0} width={96} height={30} rx={12} fill={C.cream} />
            <rect x={-44} y={-90} width={88} height={96} rx={36} fill={C.skin} />
            <rect x={-12} y={-210} width={34} height={140} rx={17} fill={C.skin} />
            <ellipse cx={-38} cy={-50} rx={16} ry={26} fill={C.skin} />
            <path d="M -30 -40 L 30 -40 M -30 -14 L 30 -14" stroke={C.skinShade} strokeWidth={5} strokeLinecap="round" />
          </g>
        </g>
      </g>
    </Stage>
  );
};
