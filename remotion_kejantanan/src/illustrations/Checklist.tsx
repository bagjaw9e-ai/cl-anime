import React from 'react';
import {C} from '../theme';
import {IllProps, Spark, backOut, ramp} from './common';

// #42 checklist berbenah, centang muncul satu-satu (tanpa teks)
export const Checklist: React.FC<IllProps> = ({t}) => (
  <g transform={`rotate(${-3 + Math.sin(t * 0.08) * 2})`}>
    <rect x={-120} y={-150} width={240} height={300} rx={22} fill={C.cream} />
    <rect x={-50} y={-170} width={100} height={36} rx={12} fill="#9C5A3C" />
    {[0, 1, 2].map((i) => {
      const y = -70 + i * 80, ck = backOut(ramp(t, 6 + i * 9, 14 + i * 9));
      return (
        <g key={i}>
          <rect x={-90} y={y - 26} width={52} height={52} rx={12} fill="#E7D3C6" />
          <rect x={-20} y={y - 9} width={110 - i * 18} height={18} rx={9} fill="#D9C2C8" />
          <g transform={`translate(-64,${y}) scale(${ck})`}>
            <path d="M -22 0 L -6 18 L 26 -22" stroke={C.teal} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          {t > 14 + i * 9 && t < 26 + i * 9 && <Spark x={-30} y={y - 30} s={0.6} c={C.gold} o={1 - (t - 14 - i * 9) / 12} />}
        </g>
      );
    })}
  </g>
);
