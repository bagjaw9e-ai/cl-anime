import React from 'react';
import {C} from '../theme';
import {IllProps} from './common';

// #16 panah loop mengorbit karakter (mengulang terus)
export const LoopArrows: React.FC<IllProps> = ({t}) => {
  const rot = t * 4;
  return (
    <g transform="translate(0,120)">
      {[0, 120, 240].map((a, i) => {
        const a0 = ((a + rot) * Math.PI) / 180, a1 = a0 + 1.5;
        const pt = (q: number) => [Math.cos(q) * 340, Math.sin(q) * 80];
        const [x0, y0] = pt(a0), [x1, y1] = pt(a1), [xm, ym] = pt((a0 + a1) / 2);
        const [xh, yh] = pt(a1 + 0.12);
        const ang = (Math.atan2(yh - y1, xh - x1) * 180) / Math.PI;
        return (
          <g key={i}>
            <path d={`M ${x0} ${y0} Q ${xm * 1.08} ${ym * 1.3} ${x1} ${y1}`} stroke={i % 2 ? C.red2 : '#FF8AA6'} strokeWidth={16} fill="none" strokeLinecap="round" />
            <path d="M 0 -20 L 30 0 L 0 20 Z" fill={i % 2 ? C.red2 : '#FF8AA6'} transform={`translate(${x1},${y1}) rotate(${ang})`} />
          </g>
        );
      })}
    </g>
  );
};
