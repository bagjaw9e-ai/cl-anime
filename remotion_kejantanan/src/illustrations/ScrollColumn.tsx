import React from 'react';
import {C, rand} from '../theme';
import {Heart} from '../components/Phone';
import {IllProps, Glow} from './common';

// #18 kolom thumbnail (hanya glow pink blur + hati) scroll tanpa henti + simbol ∞
export const ScrollColumn: React.FC<IllProps> = ({t}) => {
  const off = (t * 14) % 110;
  return (
    <g>
      <defs><Glow id="scb" sd={7} /><clipPath id="scc"><rect x={-105} y={-150} width={210} height={300} rx={22} /></clipPath></defs>
      <rect x={-115} y={-160} width={230} height={320} rx={28} fill="#1B1218" />
      <g clipPath="url(#scc)">
        {Array.from({length: 6}).map((_, i) => {
          const y = -150 + i * 110 - off;
          return (
            <g key={i} transform={`translate(0,${y + 50})`}>
              <rect x={-90} y={-46} width={180} height={92} rx={14} fill={i % 2 ? '#FF6F91' : C.red2} opacity={0.75} filter="url(#scb)" />
              <rect x={-40 + rand(i) * 30} y={-20} width={50} height={40} rx={18} fill="#FFD0DA" opacity={0.5} filter="url(#scb)" />
              <Heart x={60} y={26} s={0.5} fill={C.cream} opacity={0.85} />
            </g>
          );
        })}
      </g>
      <rect x={-115} y={-160} width={230} height={320} rx={28} fill="none" stroke="#3A2A30" strokeWidth={10} />
      {/* ∞ */}
      <g transform="translate(0,-205)">
        <rect x={-62} y={-30} width={124} height={60} rx={30} fill={C.red2} />
        <path d="M 0 0 C -12 -18 -40 -18 -40 0 C -40 18 -12 18 0 0 C 12 -18 40 -18 40 0 C 40 18 12 18 0 0 Z" fill="none" stroke={C.cream} strokeWidth={8} />
      </g>
    </g>
  );
};
