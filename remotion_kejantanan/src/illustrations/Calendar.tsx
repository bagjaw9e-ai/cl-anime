import React from 'react';
import {C} from '../theme';
import {IllProps, FONT, backOut, ramp} from './common';

// #4 kalender "HARI INI" + centang hijau (santai, belum terasa)
export const Calendar: React.FC<IllProps> = ({t}) => {
  const ck = backOut(ramp(t, 12, 22));
  return (
    <g transform={`rotate(${-4 + Math.sin(t * 0.07) * 2})`}>
      <rect x={-120} y={-120} width={240} height={250} rx={24} fill={C.cream} />
      <path d="M -120 -96 Q -120 -120 -96 -120 L 96 -120 Q 120 -120 120 -96 L 120 -40 L -120 -40 Z" fill={C.red1} />
      <text x={0} y={-68} textAnchor="middle" fontSize={34} fontWeight={800} fill={C.cream} fontFamily={FONT}>HARI INI</text>
      {[-70, 70].map((x) => <rect key={x} x={x - 9} y={-140} width={18} height={40} rx={9} fill="#7A6A70" />)}
      {Array.from({length: 12}).map((_, i) => (
        <rect key={i} x={-96 + (i % 4) * 50} y={-20 + Math.floor(i / 4) * 44} width={36} height={30} rx={8} fill="#E7D3C6" />
      ))}
      <g transform={`translate(60,70) scale(${ck})`}>
        <circle r={56} fill={C.teal} />
        <path d="M -26 0 L -6 22 L 30 -22" stroke={C.cream} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
};
