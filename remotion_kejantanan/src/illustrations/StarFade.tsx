import React from 'react';
import {C, mix} from '../theme';
import {IllProps, Spark, Glow, bf, ramp, smooth} from './common';

// #25 bintang/hati berkilau cerah; #26 bintang yang sama jadi abu-abu datar & kempis (hambar)
export const StarFade: React.FC<IllProps> = ({t, f}) => {
  const g = smooth(ramp(f, bf(26, 4), bf(26, 22)));
  const pulse = 1 + 0.06 * Math.sin(t * 0.3) * (1 - g);
  const col = mix(C.gold, '#8E8488', g);
  return (
    <g transform={`scale(${pulse * (1 - g * 0.18)},${pulse * (1 - g * 0.3)}) translate(0,${g * 30})`}>
      <defs><Glow id="sfg" sd={24} /></defs>
      <circle r={150} fill={C.gold} opacity={0.45 * (1 - g)} filter="url(#sfg)" />
      <path d="M 0 -120 L 32 -38 L 120 -36 L 50 18 L 76 106 L 0 56 L -76 106 L -50 18 L -120 -36 L -32 -38 Z" fill={col}
        stroke={col} strokeWidth={14} strokeLinejoin="round" />
      <path d="M 0 -18 C -26 -42 -46 -22 -36 -2 C -28 14 -10 22 0 32 C 10 22 28 14 36 -2 C 46 -22 26 -42 0 -18 Z" fill={mix(C.red2, '#6E6468', g)} />
      {g < 0.6 && [[-110, -100], [120, -80], [100, 110], [-120, 90]].map(([x, y], i) => (
        <Spark key={i} x={x} y={y} s={0.7 + 0.4 * Math.abs(Math.sin(t * 0.2 + i))} c={C.cream} o={1 - g * 1.6} />
      ))}
    </g>
  );
};
