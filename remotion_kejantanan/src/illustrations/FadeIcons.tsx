import React from 'react';
import {C} from '../theme';
import {IllProps, ramp, smooth} from './common';

const Pad: React.FC = () => (
  <g>
    <path d="M -80 -20 Q -80 -50 -50 -50 L 50 -50 Q 80 -50 80 -20 L 92 40 Q 96 66 70 60 L 40 30 L -40 30 L -70 60 Q -96 66 -92 40 Z" fill="#6E5A8A" />
    <rect x={-56} y={-26} width={10} height={34} rx={3} fill={C.cream} /><rect x={-68} y={-14} width={34} height={10} rx={3} fill={C.cream} />
    <circle cx={46} cy={-20} r={8} fill={C.coral} /><circle cx={62} cy={-4} r={8} fill={C.teal} />
  </g>
);
const BookIcon: React.FC = () => (
  <g>
    <path d="M 0 -50 C -30 -66 -70 -66 -86 -54 L -86 52 C -70 40 -30 40 0 56 Z" fill={C.cream} />
    <path d="M 0 -50 C 30 -66 70 -66 86 -54 L 86 52 C 70 40 30 40 0 56 Z" fill="#E7D3C6" />
    <path d="M -94 -46 L -94 64 C -60 50 -20 54 0 66 C 20 54 60 50 94 64 L 94 -46" stroke={C.teal} strokeWidth={9} fill="none" />
  </g>
);
const Chat: React.FC = () => (
  <g>
    <path d="M -80 -50 Q -80 -70 -60 -70 L 60 -70 Q 80 -70 80 -50 L 80 20 Q 80 40 60 40 L -10 40 L -40 70 L -36 40 L -60 40 Q -80 40 -80 20 Z" fill={C.teal} />
    {[-30, 0, 30].map((x) => <circle key={x} cx={x} cy={-14} r={10} fill={C.cream} />)}
  </g>
);

// #32 distraksi (stik game, buku, chat teman) pudar satu-satu
export const FadeIcons: React.FC<IllProps> = ({t}) => {
  const items = [{el: <Pad />, x: 0, y: 0, at: 10}, {el: <BookIcon />, x: 680, y: 0, at: 17}, {el: <Chat />, x: 170, y: -330, at: 24}];
  return (
    <g>
      {items.map((it, i) => {
        const fd = smooth(ramp(t, it.at, it.at + 8));
        return (
          <g key={i} transform={`translate(${it.x},${it.y - fd * 40}) scale(${1 - fd * 0.5})`} opacity={(1 - fd) * 0.9}>
            {it.el}
          </g>
        );
      })}
    </g>
  );
};
