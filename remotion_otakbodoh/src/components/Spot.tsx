import React from 'react';
import {useSid} from './Phone';

// Spotlight ala ref_1: seluruh frame digelapkan kecuali lingkaran lembut di sekitar subjek (x,y,r). dark 0..1
export const Spotlight: React.FC<{x: number; y: number; rx: number; ry?: number; dark?: number; color?: string}> = ({x, y, rx, ry, dark = 0.6, color = '#04050A'}) => {
  const id = useSid('sp');
  return (
    <g>
      <defs>
        <radialGradient id={id} cx={x} cy={y} r={rx} gradientUnits="userSpaceOnUse" gradientTransform={`translate(${x},${y}) scale(1,${(ry ?? rx) / rx}) translate(${-x},${-y})`}>
          <stop offset="0" stopColor={color} stopOpacity={0} />
          <stop offset="0.55" stopColor={color} stopOpacity={0} />
          <stop offset="1" stopColor={color} stopOpacity={dark} />
        </radialGradient>
      </defs>
      <rect x={-200} y={-200} width={1480} height={2320} fill={`url(#${id})`} />
      <rect x={-200} y={-200} width={1480} height={2320} fill={color} opacity={0} />
    </g>
  );
};
