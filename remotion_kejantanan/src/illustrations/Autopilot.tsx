import React from 'react';
import {C} from '../theme';
import {handWorld} from '../components/Character';
import {CHAR_SCALE} from '../characterTrack';
import {SLOT} from '../illustrationTrack';
import {IllProps, Pill, backOut, ramp} from './common';

// #34 tangan kanan bergerak sendiri: tali boneka dari palang + badge "AUTOPILOT"
export const Autopilot: React.FC<IllProps> = ({t}) => {
  const h = handWorld('hand_autopilot', -1, 0, 0, CHAR_SCALE);
  const hx = h.x - SLOT.left.x, hy = h.y - SLOT.left.y;
  const sway = Math.sin(t * 0.25) * 16;
  const bar = {x: hx + sway, y: hy - 360};
  return (
    <g>
      <g transform={`translate(${bar.x},${bar.y}) rotate(${sway * 0.6})`}>
        <rect x={-110} y={-12} width={220} height={24} rx={12} fill={C.amber} />
        <rect x={-12} y={-80} width={24} height={110} rx={12} fill={C.amber} />
      </g>
      {[-90, 0, 90].map((dx, i) => (
        <line key={i} x1={bar.x + dx} y1={bar.y + 10} x2={hx + dx * 0.25} y2={hy - 6 + Math.abs(dx) * 0.1} stroke={C.cream} strokeWidth={3} opacity={0.85} />
      ))}
      <g transform={`translate(${bar.x},${bar.y - 130}) scale(${backOut(ramp(t, 8, 18))})`}>
        <Pill text="AUTOPILOT" bg={C.red1} size={26} />
      </g>
    </g>
  );
};
