import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease, easeOut} from '../anim';
import {Stage} from '../components/Stage';
import {ChessPiece, Gear} from '../components/Props';
import {Landscape} from './Landscape';
import {SceneProps} from './types';

// 3 beat: bidak catur roboh -> jalan masa depan ketutup kabut -> gear emas berkarat dan macet.
const iso = (i: number, j: number) => ({x: 540 + (i - j) * 80, y: 1050 + (i + j) * 40});

export const S32: React.FC<SceneProps> = ({b, dur}) => {
  const f = useCurrentFrame();
  const b1 = b[0] ?? 46, b2 = b[1] ?? 86;
  if (f < b1) {
    const fall = (d: number) => easeOut(f, d, d + 10);
    return (
      <Stage bg={{top: C.plum, bottom: C.base0, glow: C.amber, glowY: 1100, glowOp: 0.25}} particles={{n: 12, color: C.rose, color2: C.amber, opacity: 0.25}}
        cam={{s: 1.45, y: 1200}}>
        {Array.from({length: 25}).map((_, k) => {
          const i = k % 5, j = Math.floor(k / 5);
          const p = [iso(i, j), iso(i + 1, j), iso(i + 1, j + 1), iso(i, j + 1)];
          return <path key={k} d={`M ${p[0].x} ${p[0].y} L ${p[1].x} ${p[1].y} L ${p[2].x} ${p[2].y} L ${p[3].x} ${p[3].y} Z`} fill={(i + j) % 2 ? '#4A2340' : '#B8A39A'} />;
        })}
        {[[1.5, 1.5, 'pawn', 4], [3.5, 1.5, 'rook', 12], [2.5, 2.5, 'king', 20], [1.5, 3.5, 'knight', 28], [3.5, 3.5, 'pawn', 34]].map(([i, j, kd, d], n) => {
          const p = iso(i as number, j as number);
          return <g key={n} transform={`rotate(${fall(d as number) * (n % 2 ? 84 : -84)} ${p.x} ${p.y})`}>
            <ChessPiece kind={kd as 'pawn'} x={p.x} y={p.y} s={0.9} color={kd === 'king' ? C.gold : '#C9A86A'} shade={C.amber} />
          </g>;
        })}
      </Stage>
    );
  }
  if (f < b2) {
    const fog = ease(f, b1, b1 + 26);
    return (
      <Stage bg={{top: C.plum, bottom: '#8A6E78', glow: C.gold, glowY: 900, glowOp: 0.3 * (1 - fog)}} particles={{n: 10, color: C.cream, color2: C.rose, opacity: 0.25}}
        cam={{x: 560, y: 1000, s: 1.05}}>
        <Landscape sun={0.6} fog={fog} dim={fog} />
      </Stage>
    );
  }
  const rust = ease(f, b2, b2 + 18);
  const spd = Math.max(0, 1 - rust * 1.2);
  const t = f - b2;
  const ang = t * 4 * spd + (rust > 0.8 ? Math.sin(f * 2) * 1.5 : 0);
  return (
    <Stage bg={{top: C.plum, bottom: C.base1, glow: C.amber, glowOp: 0.3 * (1 - rust) + 0.08}} particles={{n: 12, color: '#A0705A', color2: C.rose, opacity: 0.3}}
      cam={{s: ease(f, b2, dur, 1, 1.08)}}>
      <Gear x={400} y={980} R={210} n={12} rot={ang} rust={rust} />
      <Gear x={720} y={760} R={140} n={9} rot={-ang * 1.4 + 12} rust={rust} color={C.amber} />
      <Gear x={730} y={1220} R={110} n={8} rot={-ang * 1.8} rust={rust} />
      {rust > 0.7 && [0, 1, 2, 3].map((i) => (
        <circle key={i} cx={560 + i * 30} cy={900 + ((f * 3 + i * 20) % 200)} r={6} fill="#7A4A32" opacity={0.7} />
      ))}
    </Stage>
  );
};
