import React from 'react';
import {C} from '../theme';
import {IllProps, ramp} from './common';

// #39 monitor flatline, cahaya meredup
export const Flatline: React.FC<IllProps> = ({t}) => {
  const dim = ramp(t, 20, 50);
  let d = '';
  for (let i = 0; i <= 60; i++) {
    const x = -110 + i * 3.7, beat = t < 14 && i % 20 === 10 ? -50 : 0;
    d += `${i ? 'L' : 'M'} ${x} ${beat} `;
  }
  return (
    <g>
      <rect x={-140} y={-110} width={280} height={200} rx={20} fill="#6E5A62" />
      <rect x={-124} y={-94} width={248} height={168} rx={12} fill="#1A1014" />
      <path d={d} stroke={C.mint} strokeWidth={5} fill="none" opacity={1 - dim * 0.6} />
      <path d={d} stroke={C.mint} strokeWidth={14} fill="none" opacity={(1 - dim) * 0.25} />
      <rect x={-16} y={90} width={32} height={40} fill="#5A4A50" />
      <rect x={-60} y={126} width={120} height={14} rx={7} fill="#5A4A50" />
    </g>
  );
};
