import React from 'react';
import {C} from '../theme';
import {IllProps, FONT, ramp, smooth} from './common';

// #37 papan grafik medis "BOREDOM INTOLERANCE", meteran level mentok
export const BoredomChart: React.FC<IllProps> = ({t}) => {
  const lv = Math.min(1, smooth(ramp(t, 8, 46)) * 1.02);
  const shake = lv > 0.97 ? Math.sin(t * 2.2) * 2 : 0;
  let line = '';
  for (let i = 0; i <= 20; i++) {
    const x = -110 + i * 9, y = 70 - i * 4 * Math.min(1, t / 40) + Math.sin(i * 1.3 + t * 0.2) * 8;
    line += `${i ? 'L' : 'M'} ${x} ${y} `;
  }
  return (
    <g transform={`translate(${shake},0)`}>
      <rect x={-140} y={-160} width={280} height={330} rx={22} fill={C.cream} />
      <rect x={-140} y={-160} width={280} height={84} rx={22} fill={C.red1} />
      <rect x={-140} y={-100} width={280} height={24} fill={C.red1} />
      <text x={0} y={-124} textAnchor="middle" fontSize={25} fontWeight={800} fill={C.cream} fontFamily={FONT}>BOREDOM</text>
      <text x={0} y={-94} textAnchor="middle" fontSize={25} fontWeight={800} fill={C.cream} fontFamily={FONT}>INTOLERANCE</text>
      <path d={line} stroke={C.plum} strokeWidth={5} fill="none" strokeLinejoin="round" />
      <rect x={84} y={-56} width={36} height={200} rx={12} fill="#E7D3C6" />
      <rect x={84} y={-56 + 200 * (1 - lv)} width={36} height={200 * lv} rx={12} fill={lv > 0.9 ? C.red2 : C.amber} />
      {lv > 0.97 && <circle cx={102} cy={-70} r={12} fill={C.red2} opacity={Math.floor(t / 5) % 2 ? 1 : 0.4} />}
    </g>
  );
};
