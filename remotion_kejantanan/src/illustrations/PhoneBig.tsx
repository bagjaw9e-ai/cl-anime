import React from 'react';
import {C} from '../theme';
import {PhoneBody} from '../components/Phone';
import {IllProps, Pill, Glow, backOut, bf, ramp} from './common';

// #11 HP glow merah besar; #12 pusaran sedot 3 bola; #13 flash + badge "3 IN 1"
export const PhoneBig: React.FC<IllProps> = ({t, f}) => {
  const suckOn = f >= bf(12) && f < bf(13, 4);
  const flash = Math.max(0, 1 - Math.max(0, f - bf(13, 2)) / 12) * (f >= bf(13, 2) ? 1 : 0);
  const badge = backOut(ramp(f, bf(13, 4), bf(13, 14)));
  return (
    <g transform={`translate(0,${Math.sin(t * 0.1) * 6})`}>
      <defs><Glow id="pbg" sd={30} /></defs>
      {suckOn && [0, 1, 2].map((i) => {
        const u = 1 - (((f - bf(12)) * 0.05 + i / 3) % 1);
        return <ellipse key={i} rx={60 + u * 200} ry={40 + u * 130} fill="none" stroke={C.red2} strokeWidth={6} opacity={(1 - u) * 0.7}
          transform={`rotate(${(f - bf(12)) * 8 + i * 40})`} />;
      })}
      <PhoneBody w={200} h={370} glow={1 + flash * 0.5} />
      {flash > 0 && <circle r={260 * (1.2 - flash * 0.4)} fill="#FFE3E8" opacity={flash * 0.8} filter="url(#pbg)" />}
      {f >= bf(13, 4) && <g transform={`translate(0,-230) scale(${badge})`}><Pill text="3 IN 1" bg={C.red2} size={40} /></g>}
    </g>
  );
};
