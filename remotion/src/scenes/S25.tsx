import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {easeIn, ease, pop, shake} from '../anim';
import {Stage} from '../components/Stage';
import {MidbrainMascot} from '../components/MidbrainMascot';
import {Floor} from '../components/Props';
import {SceneProps} from './types';

// Jungkat-jungkit: merah berat turun, emas kecil terangkat dan meredup (thud).
export const S25: React.FC<SceneProps> = ({hit}) => {
  const f = useCurrentFrame();
  const drop = easeIn(f, hit - 10, hit, -700, 0);
  const tilt = f < hit ? 8 : 8 - 26 * pop(f, hit, 9, 200);
  const dim = ease(f, hit, hit + 25);
  const [dx, dy] = shake(f, hit, 14, 26);
  const L = 360;
  const r = (tilt * Math.PI) / 180;
  const end = (side: number) => ({x: 540 + Math.cos(r) * L * side, y: 1300 + Math.sin(r) * L * side});
  const left = end(-1), right = end(1);
  return (
    <Stage bg={{top: C.base2, bottom: C.base0, glow: C.gold, glowX: right.x, glowY: right.y - 100, glowOp: 0.35 * (1 - dim) + 0.05}}
      particles={{n: 16, color: C.gold, color2: C.rose, opacity: 0.3}} cam={{dx, dy}}>
      <Floor y={1460} glow={C.red1} />
      <path d="M 540 1300 L 430 1462 L 650 1462 Z" fill={C.cream} strokeLinejoin="round" stroke={C.cream} strokeWidth={20} />
      <g transform={`rotate(${tilt} 540 1300)`}>
        <rect x={540 - L - 40} y={1280} width={2 * L + 80} height={34} rx={17} fill={C.amber} />
      </g>
      {/* emas: otak depan kecil */}
      <g transform={`translate(${right.x},${right.y - 70})`}>
        <circle r={110} fill={C.gold} opacity={0.3 * (1 - dim)} />
        <circle r={56} fill={C.gold} opacity={1 - dim * 0.6} />
        <circle r={56} fill="#5A4A50" opacity={dim * 0.55} />
        <circle cx={-16} cy={-18} r={16} fill="#FFF3C4" opacity={0.8 - dim * 0.6} />
      </g>
      <MidbrainMascot x={left.x} y={left.y - 130 + Math.min(0, drop)} s={1.25} mood="buff" buff={1} />
      {f >= hit && f < hit + 10 && [0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={left.x + (i - 2.5) * 50 * (1 + (f - hit) * 0.15)} cy={left.y + 20 - (f - hit) * 3} r={14} fill={C.cream} opacity={1 - (f - hit) / 10} />
      ))}
    </Stage>
  );
};
