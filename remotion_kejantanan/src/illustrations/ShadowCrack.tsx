import React from 'react';
import {C} from '../theme';
import {IllProps, ramp, smooth} from './common';

// #5 bayangan karakter di lantai retak & layu (karakter tidak sadar)
export const ShadowCrack: React.FC<IllProps> = ({t}) => {
  const c = smooth(ramp(t, 6, 34));
  const wilt = smooth(ramp(t, 14, 44));
  // siluet bayangan rebah ke kanan-depan (rata di lantai), makin layu = makin pendek & melengkung turun
  const sil = 'M 0 0 L 30 -40 L 180 -60 C 210 -58 222 -40 250 -48 C 300 -62 330 -30 300 -4 C 280 14 240 4 220 10 L 40 30 Z';
  return (
    <g>
      <ellipse cx={0} cy={6} rx={300} ry={60} fill={C.coral} opacity={0.18} />
      <g transform={`translate(0,10) rotate(${8 + wilt * 14}) scale(${1 - wilt * 0.2},${1 - wilt * 0.35})`}>
        <path d={sil} fill="#0A0406" opacity={0.85} />
        <g stroke={C.red2} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.95}>
          {['M 40 0 L 90 -26 L 140 -10 L 200 -40 L 260 -22', 'M 140 -10 L 160 20', 'M 200 -40 L 220 -64', 'M 90 -26 L 80 -54'].map((d, i) => (
            <path key={i} d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - c} />
          ))}
        </g>
      </g>
      {/* daun layu kecil di ujung bayangan */}
      <path d="M 290 -10 Q 320 -50 300 -80 Q 270 -50 290 -10 Z" fill="#6E5A3E" opacity={0.8 * c}
        transform={`rotate(${wilt * 70} 290 -10)`} />
    </g>
  );
};
