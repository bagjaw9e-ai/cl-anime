import React from 'react';
import {C} from '../theme';
import {IllProps} from './common';

// #31 ruangan kosong yang sepi + tumbleweed lewat
export const EmptyRoom: React.FC<IllProps> = ({t}) => {
  const tx = -760 + t * 22, rot = t * 14;
  return (
    <g>
      <g stroke="#F5E6DA" strokeWidth={5} fill="none" opacity={0.35}>
        <path d="M -480 -520 L 480 -520 L 480 560 L -480 560 Z" />
        <path d="M -480 560 L -900 900 M 480 560 L 900 900 M -480 -520 L -900 -900 M 480 -520 L 900 -900" />
      </g>
      <rect x={-140} y={-420} width={280} height={220} rx={10} fill="#D9C2C8" opacity={0.35} />
      <path d="M 0 -420 L 0 -200 M -140 -310 L 140 -310" stroke="#F5E6DA" strokeWidth={6} opacity={0.4} />
      {/* angin */}
      {[0, 1, 2].map((i) => {
        const x = ((t * 16 + i * 300) % 1400) - 700;
        return <path key={i} d={`M ${x} ${300 + i * 60} q 40 -16 80 0 t 80 0`} stroke="#F5E6DA" strokeWidth={4} fill="none" opacity={0.5} />;
      })}
      {/* tumbleweed */}
      <g transform={`translate(${tx},${560 - 52 - Math.abs(Math.sin(t * 0.25)) * 26}) rotate(${rot})`}>
        <circle r={50} fill="none" stroke="#9C7A5A" strokeWidth={6} />
        {Array.from({length: 7}).map((_, i) => <ellipse key={i} rx={46} ry={18} fill="none" stroke="#B08A66" strokeWidth={4} transform={`rotate(${i * 26})`} />)}
      </g>
    </g>
  );
};
