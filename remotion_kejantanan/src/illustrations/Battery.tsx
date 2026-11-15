import React from 'react';
import {C, mix} from '../theme';
import {IllProps, bf, ramp, smooth} from './common';

// #35 baterai badan terisi hijau tenang; #36 terkuras jadi merah
export const Battery: React.FC<IllProps> = ({t, f}) => {
  const drain = smooth(ramp(f, bf(36, 2), bf(36, 26)));
  const lvl = 0.92 - 0.82 * drain;
  const col = mix(C.teal, C.red2, Math.min(1, drain * 1.4));
  const flick = drain > 0.7 && Math.floor(t / 4) % 2 ? 0.55 : 1;
  return (
    <g transform={`rotate(${Math.sin(t * 0.08) * 2})`}>
      <rect x={-34} y={-150} width={68} height={26} rx={8} fill="#D9C2C8" />
      <rect x={-80} y={-128} width={160} height={270} rx={26} fill="#3A2E33" stroke="#F5E6DA" strokeWidth={8} />
      <rect x={-64} y={-112 + 238 * (1 - lvl)} width={128} height={238 * lvl} rx={14} fill={col} opacity={flick} />
      {drain < 0.3 && <path d="M -26 0 C -26 -40 26 -40 26 0 C 26 30 0 46 0 46 C 0 46 -26 30 -26 0 Z" fill={C.mint} opacity={0.5 + 0.2 * Math.sin(t * 0.15)} transform="scale(0.8) rotate(25)" />}
      {drain > 0.2 && <path d="M 10 -60 L -20 10 L 4 10 L -10 70 L 26 -6 L 2 -6 Z" fill={C.cream} opacity={drain} />}
    </g>
  );
};
