import React from 'react';
import {Heart} from '../components/Phone';
import {IllProps, Glow, ramp, smooth} from './common';

// #33 thought bubble awan pink blur, isinya kabur, lalu "kabur lari" ke atas
export const ThoughtBubble: React.FC<IllProps> = ({t}) => {
  const run = smooth(ramp(t, 30, 64));
  const dy = -run * 520, sway = Math.sin(t * 0.3) * 12 * (1 + run * 2);
  return (
    <g>
      <defs><Glow id="tbg" sd={12} /></defs>
      {[{x: -20, y: 300, r: 16}, {x: -40, y: 250, r: 24}, {x: -50, y: 190, r: 32}].map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y + dy * (0.3 + i * 0.2)} r={c.r} fill="#F5E6DA" opacity={0.85 * (1 - run * 0.7)} />
      ))}
      <g transform={`translate(${sway},${dy})`}>
        <path d="M -150 30 C -200 30 -200 -50 -140 -56 C -140 -120 -60 -130 -30 -96 C 0 -150 100 -140 110 -84 C 180 -96 210 -10 160 20 C 190 70 120 110 80 84 C 50 120 -40 120 -60 84 C -110 110 -170 80 -150 30 Z"
          fill="#F5E6DA" />
        <ellipse cx={0} cy={-10} rx={120} ry={60} fill="#FF6F91" opacity={0.7} filter="url(#tbg)" />
        <Heart x={0} y={-6} s={1.3} fill="#FFFFFF" opacity={0.75} />
        {run > 0.05 && [0, 1, 2].map((i) => <rect key={i} x={-100 + i * 80} y={130 + i * 10} width={8} height={60 * run} rx={4} fill="#F5E6DA" opacity={0.6} />)}
      </g>
    </g>
  );
};
