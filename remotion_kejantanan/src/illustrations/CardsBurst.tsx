import React from 'react';
import {C, rand} from '../theme';
import {Heart} from '../components/Phone';
import {IllProps, Glow} from './common';

// #20 ledakan kartu-kartu video blur terbang ke kiri, kanan, atas dari HP
export const CardsBurst: React.FC<IllProps> = ({t}) => {
  const o = {x: 12, y: 168}; // posisi HP relatif slot
  return (
    <g>
      <defs><Glow id="cbb" sd={6} /></defs>
      {Array.from({length: 22}).map((_, i) => {
        const a = -Math.PI * (0.05 + 0.9 * rand(i * 3.1)) ;
        const sp = 18 + rand(i) * 22;
        const k = Math.min(t, 40);
        const d = sp * k * (1 - k / 90);
        const x = o.x + Math.cos(a) * d * 1.3, y = o.y + Math.sin(a) * d;
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${(rand(i + 5) - 0.5) * 60 + t * (rand(i) - 0.5) * 6}) scale(${0.5 + Math.min(1, t / 12) * 0.6})`}>
            <rect x={-60} y={-40} width={120} height={80} rx={12} fill={i % 2 ? '#FF6F91' : C.red2} opacity={0.85} filter="url(#cbb)" />
            <Heart x={30} y={18} s={0.4} fill={C.cream} opacity={0.8} />
          </g>
        );
      })}
    </g>
  );
};
