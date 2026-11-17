import React from 'react';
import {P, mix} from './theme';
import {useSid} from './components/Phone';

// Panggung mini untuk sheet: gradasi navy/cokelat (ala ref), lantai gelap + garis horizon, vignette.
export const Stage: React.FC<{x: number; y: number; w: number; h: number; floor: number; warm?: number; children: React.ReactNode; label?: string}> = ({
  x, y, w, h, floor, warm = 0, children, label,
}) => {
  const id = useSid('st');
  const top = mix(P.navyTop, P.brownTop, warm), mid = mix(P.navyMid, P.brownMid, warm), fl = mix(P.navyFloor, P.brownFloor, warm);
  return (
    <g transform={`translate(${x},${y})`}>
      <defs>
        <clipPath id={`${id}c`}><rect width={w} height={h} rx={26} /></clipPath>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset={floor / h} stopColor={mid} />
          <stop offset={floor / h + 0.001} stopColor={fl} />
          <stop offset="1" stopColor="#05070A" />
        </linearGradient>
        <radialGradient id={`${id}v`} cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.6} />
        </radialGradient>
      </defs>
      <g clipPath={`url(#${id}c)`}>
        <rect width={w} height={h} fill={`url(#${id}g)`} />
        <rect y={floor} width={w} height={2} fill="#FFFFFF" opacity={0.05} />
        {children}
        <rect width={w} height={h} fill={`url(#${id}v)`} />
      </g>
      {label && <text x={w / 2} y={h + 34} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={24} fill="#C9CED8">{label}</text>}
    </g>
  );
};
