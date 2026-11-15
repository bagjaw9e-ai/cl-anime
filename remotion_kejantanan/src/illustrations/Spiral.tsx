import React from 'react';
import {C} from '../theme';
import {IllProps} from './common';

// #29 spiral hipnotis di belakang kepala ("dan gila")
export const Spiral: React.FC<IllProps> = ({t}) => {
  const arms = 6;
  return (
    <g transform={`translate(0,-30) rotate(${t * 9})`} opacity={0.75}>
      {Array.from({length: arms}).map((_, i) => {
        let d = '';
        for (let k = 0; k <= 60; k++) {
          const a = (k / 60) * Math.PI * 3 + (i / arms) * Math.PI * 2, r = 10 + k * 7.5;
          d += `${k ? 'L' : 'M'} ${Math.cos(a) * r} ${Math.sin(a) * r} `;
        }
        return <path key={i} d={d} stroke={i % 2 ? C.red2 : '#B8A0A8'} strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.85} />;
      })}
    </g>
  );
};
