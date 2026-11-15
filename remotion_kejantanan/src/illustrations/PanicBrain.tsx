import React from 'react';
import {C} from '../theme';
import {Brain} from '../components/Brain';
import {IllProps, Glow} from './common';

// #38 otak berkeringat + sirene merah kecil
export const PanicBrain: React.FC<IllProps> = ({t}) => {
  const jit = Math.sin(t * 2.6) * 3;
  const beam = t * 0.35;
  return (
    <g transform={`translate(${jit},0)`}>
      <defs><Glow id="pbr" sd={14} /></defs>
      <path d={`M 0 -120 L ${Math.cos(beam) * 420} ${-120 + Math.sin(beam) * 140} L ${Math.cos(beam + 0.4) * 420} ${-120 + Math.sin(beam + 0.4) * 140} Z`} fill={C.red2} opacity={0.22} />
      <Brain s={0.6} y={20} pfc={0.15} mid={0.9} />
      <g transform="translate(0,-112)">
        <rect x={-34} y={10} width={68} height={16} rx={6} fill="#3A2A30" />
        <path d="M -26 12 C -26 -26 26 -26 26 12 Z" fill={Math.floor(t / 4) % 2 ? C.red2 : C.red1} />
        <circle r={36} cy={-4} fill={C.red2} opacity={0.4} filter="url(#pbr)" />
      </g>
      {[0, 1, 2, 3].map((i) => {
        const ph = ((t * 0.05 + i * 0.25) % 1);
        const x = [-150, 150, -110, 120][i], y0 = [-40, -30, 40, 50][i];
        return <path key={i} d="M 0 -14 C 9 0 9 12 0 14 C -9 12 -9 0 0 -14 Z" fill={C.mint} opacity={1 - ph} transform={`translate(${x + (x > 0 ? ph * 30 : -ph * 30)},${y0 + ph * 60}) scale(1.4)`} />;
      })}
    </g>
  );
};
