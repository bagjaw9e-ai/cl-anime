import React from 'react';
import {C, rand} from '../theme';
import {IllProps} from './common';

// #3 jam pasir, pasir merah mengalir pelan
export const Hourglass: React.FC<IllProps> = ({t}) => {
  const k = Math.min(1, t / 70);
  const top = 1 - 0.55 * k, bot = 0.25 + 0.6 * k;
  return (
    <g transform={`rotate(${Math.sin(t * 0.05) * 3})`}>
      <defs>
        <clipPath id="hgT"><path d="M -78 -112 L 78 -112 C 78 -40 10 -14 6 0 L -6 0 C -10 -14 -78 -40 -78 -112 Z" /></clipPath>
        <clipPath id="hgB"><path d="M -6 0 L 6 0 C 10 14 78 40 78 112 L -78 112 C -78 40 -10 14 -6 0 Z" /></clipPath>
      </defs>
      <path d="M -78 -112 L 78 -112 C 78 -40 10 -14 6 0 C 10 14 78 40 78 112 L -78 112 C -78 40 -10 14 -6 0 C -10 -14 -78 -40 -78 -112 Z"
        fill="#F5E6DA" opacity={0.22} stroke="#F5E6DA" strokeWidth={5} strokeOpacity={0.6} />
      <g clipPath="url(#hgT)"><rect x={-90} y={-112 + (1 - top) * 112} width={180} height={112} fill={C.red2} /></g>
      <g clipPath="url(#hgB)"><path d={`M -90 112 L -90 ${112 - bot * 112 + 30} Q 0 ${112 - bot * 112 - 20} 90 ${112 - bot * 112 + 30} L 90 112 Z`} fill={C.red1} /></g>
      <rect x={-2.5} y={0} width={5} height={112 - bot * 100} fill={C.red2} opacity={0.9} />
      {[0, 1, 2, 3, 4].map((i) => {
        const ph = ((t * 0.06 + i * 0.2) % 1);
        return <circle key={i} cx={(rand(i) - 0.5) * 6} cy={ph * (112 - bot * 100)} r={3} fill={C.coral} />;
      })}
      <rect x={-100} y={-136} width={200} height={26} rx={10} fill="#9C5A3C" />
      <rect x={-100} y={110} width={200} height={26} rx={10} fill="#9C5A3C" />
      <rect x={-92} y={-112} width={12} height={224} rx={6} fill="#7A3E2E" />
      <rect x={80} y={-112} width={12} height={224} rx={6} fill="#7A3E2E" />
    </g>
  );
};
