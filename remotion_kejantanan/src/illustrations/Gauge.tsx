import React from 'react';
import {C} from '../theme';
import {IllProps, ramp, smooth} from './common';

// #28 gauge, jarum naik masuk zona merah + api kecil
export const Gauge: React.FC<IllProps> = ({t}) => {
  const p = smooth(ramp(t, 4, 30)) + Math.sin(t * 1.4) * 0.015 * (t > 30 ? 1 : 0);
  const ang = -90 + 178 * Math.min(1.02, p);
  const arc = (a0: number, a1: number, col: string) => {
    const r = 150, p0 = [Math.cos(((a0 - 180) * Math.PI) / 180) * r, Math.sin(((a0 - 180) * Math.PI) / 180) * r];
    const p1 = [Math.cos(((a1 - 180) * Math.PI) / 180) * r, Math.sin(((a1 - 180) * Math.PI) / 180) * r];
    return <path d={`M ${p0[0]} ${p0[1]} A ${r} ${r} 0 0 1 ${p1[0]} ${p1[1]}`} stroke={col} strokeWidth={34} fill="none" />;
  };
  return (
    <g transform="translate(0,70)">
      <path d="M -190 0 A 190 190 0 0 1 190 0 Z" fill="#3A2E33" />
      {arc(0, 70, C.teal)}{arc(72, 125, C.amber)}{arc(127, 180, C.red2)}
      <g transform={`rotate(${ang})`}>
        <path d="M -8 0 L 0 -138 L 8 0 Z" fill={C.cream} />
      </g>
      <circle r={18} fill={C.cream} />
      {p > 0.85 && [0, 1, 2].map((i) => {
        const fl = 0.8 + 0.3 * Math.sin(t * 0.9 + i * 2);
        return <path key={i} d="M 0 0 C -14 -16 -6 -30 0 -44 C 6 -30 14 -16 0 0 Z" fill={i === 1 ? C.gold : C.coral}
          transform={`translate(${150 + (i - 1) * 22},${-40 - i * 4}) scale(${fl * (i === 1 ? 1.3 : 1)})`} />;
      })}
    </g>
  );
};
