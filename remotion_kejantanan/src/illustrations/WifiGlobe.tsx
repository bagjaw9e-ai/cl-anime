import React from 'react';
import {C} from '../theme';
import {IllProps, Glow} from './common';

// #17 globe internet + wifi memancarkan sinar stimulus
export const WifiGlobe: React.FC<IllProps> = ({t}) => (
  <g>
    <defs><Glow id="wgg" sd={20} /><clipPath id="wgc"><circle cx={0} cy={40} r={95} /></clipPath></defs>
    {Array.from({length: 12}).map((_, i) => {
      const a = (i / 12) * Math.PI * 2 + t * 0.01;
      const pulse = ((t * 0.05 + i * 0.13) % 1);
      return <line key={i} x1={Math.cos(a) * 110} y1={40 + Math.sin(a) * 110} x2={Math.cos(a) * (150 + pulse * 70)} y2={40 + Math.sin(a) * (150 + pulse * 70)}
        stroke="#FF8AA6" strokeWidth={8} strokeLinecap="round" opacity={1 - pulse} />;
    })}
    <circle cx={0} cy={40} r={110} fill="#FF4D7A" opacity={0.35} filter="url(#wgg)" />
    <circle cx={0} cy={40} r={95} fill={C.coral} />
    <g clipPath="url(#wgc)" stroke={C.cream} strokeWidth={5} fill="none" opacity={0.75}>
      <ellipse cx={0} cy={40} rx={95} ry={34} />
      <line x1={-100} y1={40} x2={100} y2={40} />
      <ellipse cx={0} cy={40} rx={(Math.cos(t * 0.05) * 0.5 + 0.5) * 70 + 10} ry={95} />
      <ellipse cx={0} cy={40} rx={(Math.sin(t * 0.05) * 0.5 + 0.5) * 70 + 10} ry={95} />
    </g>
    {[0, 1, 2].map((i) => {
      const on = Math.floor(t / 6) % 4 > i;
      const r = 50 + i * 36;
      return <path key={i} d={`M ${-r * 0.7} ${-70 - i * 10 + r * 0.0} A ${r} ${r} 0 0 1 ${r * 0.7} ${-70 - i * 10}`} transform={`translate(0,${-i * 22})`}
        stroke={on ? C.cream : '#8E5A6A'} strokeWidth={14} fill="none" strokeLinecap="round" />;
    })}
    <circle cx={0} cy={-58} r={11} fill={C.cream} />
  </g>
);
