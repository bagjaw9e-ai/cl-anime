import React from 'react';
import {C} from '../theme';
import {Brain} from '../components/Brain';
import {IllProps, Glow} from './common';

// #6 hologram otak (nuansa lab) + ikon mikroskop
export const HoloBrain: React.FC<IllProps> = ({t}) => {
  const scan = ((t * 4) % 300) - 150;
  const flick = 0.85 + 0.15 * Math.sin(t * 1.3) * Math.sin(t * 0.37);
  return (
    <g>
      <defs><Glow id="hbg" sd={18} /><clipPath id="hbc"><rect x={-220} y={-150} width={440} height={300} /></clipPath></defs>
      {/* sinar proyektor */}
      <path d="M -40 175 L 40 175 L 210 -120 L -210 -120 Z" fill="#B9A6F0" opacity={0.1} />
      <ellipse cx={0} cy={178} rx={70} ry={14} fill="#B9A6F0" opacity={0.7} />
      <g opacity={0.82 * flick}>
        <ellipse cx={0} cy={0} rx={200} ry={140} fill="#8C74D0" opacity={0.25} filter="url(#hbg)" />
        <Brain s={0.62} y={-10} pfc={0.5} mid={0.4} baseTone="#9C8AD8" />
        <g clipPath="url(#hbc)">
          {Array.from({length: 22}).map((_, i) => <rect key={i} x={-220} y={-150 + i * 14} width={440} height={3} fill="#E6DCFF" opacity={0.12} />)}
          <rect x={-220} y={scan} width={440} height={8} fill="#E6DCFF" opacity={0.5} />
        </g>
      </g>
      {/* mikroskop */}
      <g transform={`translate(235,-95) rotate(${Math.sin(t * 0.1) * 3}) scale(0.8)`}>
        <rect x={-50} y={50} width={100} height={18} rx={8} fill={C.cream} />
        <path d="M -20 50 Q -40 0 -10 -30" stroke={C.cream} strokeWidth={14} fill="none" strokeLinecap="round" />
        <rect x={-14} y={-90} width={28} height={80} rx={10} fill="#B9A6F0" transform="rotate(-25 0 -50)" />
        <rect x={-30} y={10} width={60} height={10} rx={5} fill="#B9A6F0" />
        <circle cx={22} cy={-104} r={10} fill={C.cream} />
      </g>
    </g>
  );
};
