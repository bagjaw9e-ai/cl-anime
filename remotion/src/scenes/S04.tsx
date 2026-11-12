import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease, pop} from '../anim';
import {Stage} from '../components/Stage';
import {Monitor} from '../components/Props';
import {SceneProps} from './types';

// Match cut ke ruang klinik: stetoskop, palang medis, monitor menyala.
export const S04: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const p1 = pop(f, 0), p2 = pop(f, 4), p3 = pop(f, 8);
  const pan = ease(f, 0, dur, 20, -20);
  // garis detak jantung tanpa angka
  const ecg = Array.from({length: 60}).map((_, i) => {
    const x = -190 + i * 6.5;
    const ph = (i + f * 1.5) % 20;
    const y = ph === 8 ? -70 : ph === 9 ? 60 : ph === 10 ? -20 : 0;
    return `${i ? 'L' : 'M'} ${x} ${y}`;
  }).join(' ');
  return (
    <Stage bg={{top: '#4A2338', bottom: C.base1, glow: C.cream, glowY: 700, glowOp: 0.18}}
      particles={{n: 14, color: C.cream, color2: C.rose, opacity: 0.3}} cam={{dx: pan}}>
      {/* dinding panel */}
      <rect x={80} y={300} width={920} height={1160} rx={40} fill={C.plum} opacity={0.5} />
      {/* palang medis */}
      <g transform={`translate(540,560) scale(${p1})`}>
        <circle r={150} fill={C.cream} />
        <rect x={-38} y={-110} width={76} height={220} rx={16} fill={C.red1} />
        <rect x={-110} y={-38} width={220} height={76} rx={16} fill={C.red1} />
      </g>
      {/* monitor */}
      <g transform={`translate(330,1080) scale(${p2})`}>
        <Monitor w={380} h={260} frame={C.rose} screen="#1A0B10">
          <path d={ecg} stroke={C.coral} strokeWidth={7} fill="none" strokeLinejoin="round" />
          <path d={ecg} stroke={C.coral} strokeWidth={18} fill="none" opacity={0.25} />
        </Monitor>
      </g>
      {/* stetoskop */}
      <g transform={`translate(770,1050) scale(${p3}) rotate(${Math.sin(f * 0.15) * 4})`}>
        <path d="M -70 -200 Q -90 0 0 60 Q 90 0 70 -200" stroke="#3A2A36" strokeWidth={18} fill="none" strokeLinecap="round" />
        <circle cx={-70} cy={-208} r={14} fill={C.cream} />
        <circle cx={70} cy={-208} r={14} fill={C.cream} />
        <path d="M 0 60 Q 10 180 110 200" stroke="#3A2A36" strokeWidth={16} fill="none" strokeLinecap="round" />
        <circle cx={130} cy={205} r={46} fill="#C9C1C6" />
        <circle cx={130} cy={205} r={28} fill="#8D8790" />
      </g>
      {/* meja */}
      <rect x={120} y={1360} width={840} height={40} rx={14} fill={C.cream} opacity={0.85} />
      <rect x={160} y={1400} width={30} height={220} fill={C.cream} opacity={0.6} />
      <rect x={890} y={1400} width={30} height={220} fill={C.cream} opacity={0.6} />
    </Stage>
  );
};
