import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease, easeIn, pop, shake} from '../anim';
import {Stage} from '../components/Stage';
import {Brain} from '../components/Brain';
import {Pedal} from '../components/Props';
import {SceneProps} from './types';

// Mobil (kaca depan ada otak) meluncur turun bukit, pedal rem patah (decit + snap).
const ANG = 26;
export const S26: React.FC<SceneProps> = ({hit, dur}) => {
  const f = useCurrentFrame();
  const d = easeIn(f, 0, dur, 0, 900);
  const r = (ANG * Math.PI) / 180;
  const cx = 120 + Math.cos(r) * d, cy = 860 + Math.sin(r) * d;
  const press = ease(f, 6, 14);
  const broken = ease(f, hit, hit + 8);
  const [dx, dy] = shake(f, hit, 14, 20);
  const inset = pop(f, 2);
  const wheel = f * (8 + f * 0.6);
  return (
    <Stage bg={{top: C.plum, bottom: C.base1, glow: C.coral, glowY: 1500, glowOp: 0.25}} particles={{n: 14, color: C.coral, color2: C.cream, opacity: 0.3}}
      cam={{dx, dy}}>
      {/* bukit */}
      <path d={`M -100 ${860 + 70 - Math.tan(r) * 220} L 1180 ${930 + Math.tan(r) * 1060} L 1180 2000 L -100 2000 Z`} fill="#6B3A3A" />
      <path d={`M -100 ${860 + 70 - Math.tan(r) * 220} L 1180 ${930 + Math.tan(r) * 1060}`} stroke={C.amber} strokeWidth={14} />
      <g transform={`translate(${cx},${cy}) rotate(${ANG})`}>
        {/* garis kecepatan */}
        {[0, 1, 2].map((i) => (
          <rect key={i} x={-380 - i * 30} y={-110 + i * 40} width={200 * Math.min(1, f / 20)} height={10} rx={5} fill={C.cream} opacity={0.5} />
        ))}
        <path d="M -160 20 L -150 -40 Q -140 -60 -110 -64 L -60 -66 L -20 -120 Q -6 -136 20 -136 L 90 -136 Q 120 -136 136 -110 L 160 -64 Q 190 -60 196 -36 L 200 20 Z" fill={C.coral} />
        <path d="M -48 -70 L -14 -116 Q -6 -126 10 -126 L 52 -126 L 52 -70 Z" fill="#3B1A36" />
        <path d="M 64 -126 L 90 -126 Q 114 -126 126 -104 L 146 -70 L 64 -70 Z" fill="#3B1A36" />
        <g transform="translate(14,-96) scale(0.11)"><Brain pfc={0.3} mid={0.8} /></g>
        <rect x={-150} y={-30} width={340} height={12} rx={6} fill={C.red1} opacity={0.6} />
        {[-100, 130].map((wx) => (
          <g key={wx} transform={`translate(${wx},26) rotate(${wheel})`}>
            <circle r={40} fill="#22161C" />
            <circle r={18} fill={C.cream} />
            <rect x={-4} y={-38} width={8} height={20} fill={C.cream} opacity={0.6} />
          </g>
        ))}
      </g>
      <g transform={`translate(780,480) scale(${inset * 0.9})`}>
        <Pedal press={press} broken={broken} />
        {f >= hit && f < hit + 12 && [0, 1, 2, 3, 4, 5, 6].map((i) => {
          const a = i * 0.9;
          const k = f - hit;
          return <line key={i} x1={Math.cos(a) * (30 + k * 10)} y1={Math.sin(a) * (30 + k * 10)} x2={Math.cos(a) * (60 + k * 14)} y2={Math.sin(a) * (60 + k * 14)}
            stroke={C.gold} strokeWidth={8} strokeLinecap="round" opacity={1 - k / 12} />;
        })}
      </g>
    </Stage>
  );
};
