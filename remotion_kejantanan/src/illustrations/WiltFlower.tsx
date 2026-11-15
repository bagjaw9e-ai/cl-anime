import React from 'react';
import {C, mix} from '../theme';
import {IllProps, ramp, smooth} from './common';

// #24 bunga di pot layu, warnanya memudar
export const WiltFlower: React.FC<IllProps> = ({t}) => {
  const w = smooth(ramp(t, 6, 60));
  const bend = w * 70;
  const head = {x: Math.sin((bend * Math.PI) / 180) * 120, y: -60 - Math.cos((bend * Math.PI) / 180) * 120};
  const petal = mix('#FF8AA6', '#8A7A82', w), center = mix(C.gold, '#7A6E72', w), stem = mix('#4FB3A9', '#6E6A5E', w);
  const fall = ramp(t, 40, 80);
  return (
    <g>
      <path d={`M 0 -60 Q ${head.x * 0.2} ${-140} ${head.x} ${head.y}`} stroke={stem} strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d="M 0 -90 Q -40 -110 -50 -80 Q -20 -80 0 -90" fill={stem} />
      <g transform={`translate(${head.x},${head.y}) rotate(${bend * 1.6})`}>
        {Array.from({length: 6}).map((_, i) => (
          <ellipse key={i} cx={0} cy={-30} rx={16} ry={30 - w * 6} fill={petal} transform={`rotate(${i * 60 + w * 20})`} />
        ))}
        <circle r={18} fill={center} />
      </g>
      {fall > 0 && <ellipse cx={head.x + 30 + fall * 30} cy={head.y + fall * 160} rx={14} ry={24} fill={petal} transform={`rotate(${fall * 200} ${head.x + 30} ${head.y})`} opacity={1 - fall * 0.6} />}
      <path d="M -70 -60 L 70 -60 L 54 60 L -54 60 Z" fill={mix(C.coral, '#7A6A6E', w * 0.6)} />
      <rect x={-80} y={-76} width={160} height={24} rx={8} fill={mix('#C9604A', '#6A5A5E', w * 0.6)} />
    </g>
  );
};
