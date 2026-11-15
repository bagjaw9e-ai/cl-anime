import React from 'react';
import {C} from '../theme';
import {IllProps, ramp, smooth} from './common';

// #23 kenop volume diputar ke nol, bar sinyal turun (mati rasa)
export const VolumeKnob: React.FC<IllProps> = ({t}) => {
  const p = smooth(ramp(t, 4, 34));
  const ang = 130 - 260 * p;
  return (
    <g>
      <circle r={112} fill="#3A2E33" />
      {Array.from({length: 11}).map((_, i) => {
        const a = ((-130 + i * 26) * Math.PI) / 180;
        return <line key={i} x1={Math.sin(a) * 92} y1={-Math.cos(a) * 92} x2={Math.sin(a) * 104} y2={-Math.cos(a) * 104} stroke={C.cream} strokeWidth={5} opacity={0.5} />;
      })}
      <g transform={`rotate(${ang})`}>
        <circle r={78} fill="#8A7A82" />
        <circle r={64} fill="#6E6068" />
        <rect x={-7} y={-74} width={14} height={36} rx={7} fill={C.cream} />
      </g>
      <g transform="translate(-60,170)">
        {Array.from({length: 5}).map((_, i) => {
          const on = (1 - p) * 5 > i;
          return <rect key={i} x={i * 26} y={-20 - i * 12} width={18} height={20 + i * 12} rx={5} fill={on ? C.mint : '#5A4E54'} />;
        })}
      </g>
    </g>
  );
};
