import React from 'react';
import {C} from '../theme';
import {IllProps} from './common';

// #27 jam dinding, jarum berputar makin cepat (butuh durasi makin lama)
export const WallClock: React.FC<IllProps> = ({t}) => {
  const ang = 0.9 * t + 0.06 * t * t; // makin cepat
  return (
    <g transform={`rotate(${Math.sin(t * 0.9) * (t > 30 ? 3 : 1)})`}>
      <circle r={118} fill="#6E5A62" />
      <circle r={102} fill={C.cream} />
      {Array.from({length: 12}).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <rect key={i} x={-3} y={-96} width={6} height={i % 3 ? 10 : 18} rx={3} fill="#5A4A50" transform={`rotate(${i * 30})`} />;
        void a;
      })}
      <rect x={-5} y={-62} width={10} height={66} rx={5} fill="#3A2E33" transform={`rotate(${ang / 12})`} />
      <rect x={-3} y={-86} width={6} height={90} rx={3} fill={C.red1} transform={`rotate(${ang})`} />
      <circle r={10} fill="#3A2E33" />
      {t > 20 && [0, 1].map((i) => (
        <path key={i} d={`M ${-140 - i * 16} -40 Q ${-150 - i * 16} 0 ${-140 - i * 16} 40`} stroke={C.cream} strokeWidth={5} fill="none" opacity={0.5} />
      ))}
    </g>
  );
};
