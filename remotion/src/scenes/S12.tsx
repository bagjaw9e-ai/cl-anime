import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease} from '../anim';
import {Stage} from '../components/Stage';
import {Character} from '../components/Character';
import {ChessPiece} from '../components/Props';
import {SceneProps} from './types';

// Papan catur, karakter thinking, bidak bergerak.
const iso = (i: number, j: number) => ({x: 540 + (i - j) * 70, y: 1200 + (i + j) * 36});

export const S12: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const t = ease(f, 6, 22);
  const a = iso(1.5, 4.5), bb = iso(2.5, 2.5);
  const kx = a.x + (bb.x - a.x) * t;
  const ky = a.y + (bb.y - a.y) * t - Math.sin(t * Math.PI) * 140;
  const t2 = ease(f, 20, 32);
  const p1 = iso(4.5, 1.5), p2 = iso(4.5, 2.5);
  return (
    <Stage bg={{top: C.plum, bottom: C.base1, glow: C.amber, glowY: 1000, glowOp: 0.35}}
      particles={{n: 16, color: C.gold, color2: C.cream, opacity: 0.3}} cam={{s: ease(f, 0, 40, 1.05, 1.12), y: 1050}}>
      <Character x={540} y={1260} scale={1.05} pose="hand_chin" expression="thinking" id="s12" lookAt={{x: 0.2, y: 0.8}} />
      {/* papan isometrik */}
      <path d={`M ${iso(0, 0).x} ${iso(0, 0).y - 10} L ${iso(6, 0).x + 10} ${iso(6, 0).y} L ${iso(6, 6).x} ${iso(6, 6).y + 10} L ${iso(0, 6).x - 10} ${iso(0, 6).y} Z`}
        fill="#5A2E22" transform="translate(0,26)" />
      {Array.from({length: 36}).map((_, k) => {
        const i = k % 6, j = Math.floor(k / 6);
        const p0 = iso(i, j), p1b = iso(i + 1, j), p2b = iso(i + 1, j + 1), p3 = iso(i, j + 1);
        return <path key={k} d={`M ${p0.x} ${p0.y} L ${p1b.x} ${p1b.y} L ${p2b.x} ${p2b.y} L ${p3.x} ${p3.y} Z`}
          fill={(i + j) % 2 ? C.plum : C.cream} />;
      })}
      <ChessPiece kind="rook" x={iso(0.5, 1.5).x} y={iso(0.5, 1.5).y} s={0.7} color={C.red1} shade={C.red0} />
      <ChessPiece kind="king" x={iso(3.5, 0.5).x} y={iso(3.5, 0.5).y} s={0.75} color={C.red1} shade={C.red0} />
      <ChessPiece kind="pawn" x={p1.x + (p2.x - p1.x) * t2} y={p1.y + (p2.y - p1.y) * t2} s={0.7} color={C.red1} shade={C.red0} />
      <ChessPiece kind="pawn" x={iso(1.5, 3.5).x} y={iso(1.5, 3.5).y} s={0.7} />
      <ChessPiece kind="king" x={iso(3.5, 5.5).x} y={iso(3.5, 5.5).y} s={0.75} />
      <ChessPiece kind="knight" x={kx} y={ky} s={0.8} />
      <ellipse cx={bb.x} cy={bb.y} rx={60 * t} ry={22 * t} fill={C.gold} opacity={0.4 * (1 - Math.abs(t - 1))} />
    </Stage>
  );
};
