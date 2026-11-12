import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, rand} from '../theme';
import {ease} from '../anim';
import {Stage} from '../components/Stage';
import {SceneProps} from './types';

// Garis kusut berubah jadi jaringan node yang rapi.
const N = 13;
const TARGET = Array.from({length: N}).map((_, i) => {
  const rows = [3, 4, 3, 3];
  let r = 0, k = i;
  while (k >= rows[r]) { k -= rows[r]; r++; }
  const n = rows[r];
  return {x: 540 + (k - (n - 1) / 2) * 230, y: 620 + r * 230};
});
const EDGES: [number, number][] = [];
for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
  const d = Math.hypot(TARGET[i].x - TARGET[j].x, TARGET[i].y - TARGET[j].y);
  if (d < 300) EDGES.push([i, j]);
}

export const S11: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const t = ease(f, 4, 28);
  const pts = TARGET.map((p, i) => {
    const tx = 540 + (rand(i * 3.1) - 0.5) * 520 + Math.sin(f * 0.3 + i) * 18 * (1 - t);
    const ty = 960 + (rand(i * 5.7) - 0.5) * 520 + Math.cos(f * 0.27 + i) * 18 * (1 - t);
    const ti = ease(f, 4 + i * 0.8, 24 + i * 0.8);
    return {x: tx + (p.x - tx) * ti, y: ty + (p.y - ty) * ti};
  });
  let scribble = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < N; i++) {
    const a = pts[i - 1], c = pts[i];
    const mx = (a.x + c.x) / 2 + (rand(i * 9) - 0.5) * 300 * (1 - t);
    const my = (a.y + c.y) / 2 + (rand(i * 11) - 0.5) * 300 * (1 - t);
    scribble += ` Q ${mx} ${my} ${c.x} ${c.y}`;
  }
  return (
    <Stage bg={{top: C.plum, bottom: C.base1, glow: C.gold, glowY: 960, glowOp: 0.15 + t * 0.25}}
      particles={{n: 18, color: C.gold, color2: C.coral, opacity: 0.35}}>
      <path d={scribble} stroke={C.coral} strokeWidth={10} fill="none" strokeLinecap="round" opacity={1 - t * 0.9} />
      {EDGES.map(([i, j], k) => (
        <line key={k} x1={pts[i].x} y1={pts[i].y} x2={pts[j].x} y2={pts[j].y} stroke={C.cream} strokeWidth={6}
          opacity={t * 0.75} strokeLinecap="round" />
      ))}
      {/* impuls berjalan di sepanjang edge */}
      {t > 0.9 && EDGES.filter((_, k) => k % 3 === 0).map(([i, j], k) => {
        const u = ((f * 0.05 + k * 0.3) % 1);
        return <circle key={k} cx={pts[i].x + (pts[j].x - pts[i].x) * u} cy={pts[i].y + (pts[j].y - pts[i].y) * u} r={9} fill={C.gold} />;
      })}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={44 * t} fill={C.gold} opacity={0.25} />
          <circle cx={p.x} cy={p.y} r={12 + 16 * t} fill={t > 0.5 ? C.gold : C.coral} />
          <circle cx={p.x - 6} cy={p.y - 6} r={6 * t} fill="#FFF3C4" />
        </g>
      ))}
    </Stage>
  );
};
