import React from 'react';
import {C, rand} from '../theme';
import {IllProps, ramp, smooth} from './common';

// #15 kail pancing dari partikel dopamin nyangkut di kerah jaket, tali menarik ke atas-kanan
export const Hook: React.FC<IllProps> = ({t}) => {
  const drop = smooth(ramp(t, 0, 10));
  const tug = Math.max(0, Math.sin(t * 0.5)) * 8;
  const top = {x: 300, y: -900};
  const hk = {x: -6, y: 40 - (1 - drop) * 300 - tug};
  return (
    <g>
      <path d={`M ${top.x} ${top.y} Q ${150} ${-420} ${hk.x + 4} ${hk.y - 40}`} stroke="#FFB3C1" strokeWidth={4} fill="none" />
      {Array.from({length: 14}).map((_, i) => {
        const u = ((t * 0.03 + i / 14) % 1);
        const x = top.x + (hk.x - top.x) * u + Math.sin(u * 3) * 40, y = top.y + (hk.y - top.y) * u;
        return <circle key={i} cx={x} cy={y} r={4 + rand(i) * 4} fill="#FF6F91" opacity={0.8} />;
      })}
      <g transform={`translate(${hk.x},${hk.y})`}>
        <path d="M 4 -40 L 4 10 C 4 34 -28 34 -28 12 L -20 18" stroke="#D9D2DA" strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M -28 12 L -36 0 L -18 6 Z" fill="#D9D2DA" />
        <circle cx={4} cy={-42} r={7} fill={C.gold} />
      </g>
    </g>
  );
};
