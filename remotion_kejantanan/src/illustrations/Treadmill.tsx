import React from 'react';
import {C} from '../theme';
import {Heart} from '../components/Phone';
import {IllProps, Glow} from './common';

// #30 treadmill + hati bercahaya digantung di tongkat (dikejar, nggak pernah kena)
export const Treadmill: React.FC<IllProps> = ({t}) => {
  const off = (t * 12) % 40;
  const bob = Math.sin(t * 0.35) * 14;
  return (
    <g>
      <defs><Glow id="tmg" sd={18} /><clipPath id="tmc"><rect x={-280} y={-46} width={560} height={30} rx={10} /></clipPath></defs>
      {/* tongkat dari punggung + tali + hati */}
      <path d="M -70 -600 Q 120 -980 360 -880" stroke="#9C5A3C" strokeWidth={10} fill="none" strokeLinecap="round" />
      <line x1={360} y1={-880} x2={360 + Math.sin(t * 0.2) * 10} y2={-720 + bob} stroke={C.cream} strokeWidth={3} />
      <g transform={`translate(${360 + Math.sin(t * 0.2) * 10},${-690 + bob})`}>
        <circle r={70} fill="#FF6F91" opacity={0.5} filter="url(#tmg)" />
        <Heart s={2.2} fill="#FF6F91" />
      </g>
      {/* treadmill */}
      <rect x={-300} y={-52} width={600} height={50} rx={18} fill="#4A3A40" />
      <g clipPath="url(#tmc)">
        <rect x={-280} y={-46} width={560} height={30} fill="#2A2226" />
        {Array.from({length: 18}).map((_, i) => <rect key={i} x={-300 + i * 40 - off} y={-46} width={8} height={30} fill="#5A4A50" />)}
      </g>
      <rect x={260} y={-260} width={20} height={220} rx={10} fill="#6E6068" />
      <rect x={200} y={-270} width={110} height={26} rx={12} fill="#8A7A82" />
    </g>
  );
};
