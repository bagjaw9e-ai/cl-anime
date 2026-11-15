import React from 'react';
import {C, rand} from '../theme';
import {IllProps, Pill, Glow, backOut, ramp} from './common';

// #21 kartu berlipat jadi dinding grid raksasa + tag "1000+"
export const GridWall: React.FC<IllProps> = ({t}) => {
  const cols = 9, rows = 13, cw = 118, ch = 84;
  return (
    <g>
      <defs><Glow id="gwb" sd={5} /></defs>
      {Array.from({length: cols * rows}).map((_, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const d = Math.hypot(c - (cols - 1) / 2, r - (rows - 1) / 2);
        const p = ramp(t, d * 2.2, d * 2.2 + 8);
        if (p <= 0) return null;
        const x = (c - (cols - 1) / 2) * (cw + 10), y = (r - (rows - 1) / 2) * (ch + 10) - 40;
        return (
          <g key={i} transform={`translate(${x},${y}) scale(1,${p})`}>
            <rect x={-cw / 2} y={-ch / 2} width={cw} height={ch} rx={10} fill={rand(i) > 0.5 ? '#FF6F91' : C.red1}
              opacity={0.35 + 0.35 * Math.abs(Math.sin(t * 0.2 + i))} filter="url(#gwb)" />
          </g>
        );
      })}
      <g transform={`translate(330,-640) scale(${backOut(ramp(t, 14, 26))}) rotate(-6)`}>
        <Pill text="1000+" bg={C.gold} fg={C.ink} size={56} />
      </g>
    </g>
  );
};
