import React from 'react';
import {PhoneBody} from '../components/Phone';
import {handWorld} from '../components/Character';
import {CHAR_SCALE} from '../characterTrack';
import {SLOT} from '../illustrationTrack';
import {IllProps, ramp} from './common';

// #41 HP dilempar keluar frame (berputar, mengecil di kejauhan)
export const TossPhone: React.FC<IllProps> = ({t}) => {
  const h = handWorld('tossing_phone', 1, 0, 0, CHAR_SCALE);
  const p = ramp(t, 0, 28);
  const x0 = h.x - SLOT.offR.x, y0 = h.y - SLOT.offR.y;
  const x = x0 + (900 - x0) * p, y = y0 + (-900 - y0) * p - Math.sin(p * Math.PI) * 260;
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <line key={i} x1={x - 60 - i * 30} y1={y + 40 + i * 12} x2={x - 140 - i * 30} y2={y + 80 + i * 12} stroke="#FFFFFF" strokeWidth={6}
          strokeLinecap="round" opacity={0.5 * (1 - p)} />
      ))}
      <g transform={`translate(${x},${y}) rotate(${t * 40}) scale(${1 - p * 0.6})`}><PhoneBody w={60} h={110} glow={0.8} /></g>
    </g>
  );
};
