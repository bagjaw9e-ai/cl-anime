import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease, pop} from '../anim';
import {Stage} from '../components/Stage';
import {Character} from '../components/Character';
import {SceneProps} from './types';

// Atom, grafik, buku terbuka (tanpa tulisan) melayang lalu terserap ke kepala.
const Atom: React.FC = () => (
  <g>
    {[0, 60, 120].map((r) => (
      <ellipse key={r} rx={110} ry={38} fill="none" stroke={C.gold} strokeWidth={9} transform={`rotate(${r})`} />
    ))}
    <circle r={22} fill={C.coral} />
  </g>
);
const Chart: React.FC<{f: number}> = ({f}) => (
  <g>
    <rect x={-120} y={-100} width={240} height={200} rx={20} fill={C.cream} />
    {[0, 1, 2, 3].map((i) => {
      const h = [50, 90, 70, 130][i] * (0.8 + 0.2 * Math.sin(f * 0.2 + i));
      return <rect key={i} x={-88 + i * 46} y={74 - h} width={32} height={h} rx={6} fill={[C.coral, C.amber, C.rose, C.gold][i]} />;
    })}
    <path d="M -96 76 L 100 76" stroke={C.plum} strokeWidth={6} strokeLinecap="round" />
  </g>
);
const Book: React.FC = () => (
  <g>
    <path d="M 0 -60 C -40 -80 -100 -80 -140 -60 L -140 70 C -100 50 -40 50 0 70 Z" fill={C.cream} />
    <path d="M 0 -60 C 40 -80 100 -80 140 -60 L 140 70 C 100 50 40 50 0 70 Z" fill="#EBD7C8" />
    <path d="M -150 -50 L -150 84 C -100 64 -40 64 0 84 C 40 64 100 64 150 84 L 150 -50" stroke={C.coral} strokeWidth={10} fill="none" />
  </g>
);

export const S14: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const head = {x: 540, y: 1020};
  const items = [
    {x: 250, y: 560, d: 2, el: <Atom />},
    {x: 820, y: 620, d: 6, el: <Chart f={f} />},
    {x: 540, y: 420, d: 10, el: <Book />},
  ];
  const absorb = ease(f, 18, 30);
  return (
    <Stage bg={{top: C.plum, bottom: C.base1, glow: C.amber, glowY: 1250, glowOp: 0.3 + absorb * 0.25}}
      particles={{n: 18, color: C.gold, color2: C.coral, opacity: 0.35}}>
      <Character x={540} y={2500} scale={2.3} pose="standing_relaxed" expression={[[0, 'thinking'], [20, 'happy']]} id="s14" lookAt={{x: 0, y: -1}} />
      <ellipse cx={head.x} cy={head.y + 60} rx={200} ry={80} fill={C.gold} opacity={absorb * 0.4} />
      {items.map((it, i) => {
        const p = pop(f, it.d - 2, 12);
        const t = ease(f, 8 + it.d, 22 + it.d);
        const ang = t * 3.2 + i;
        const x = it.x + (head.x - it.x) * t + Math.cos(ang) * 60 * Math.sin(t * Math.PI);
        const y = it.y + (head.y - it.y) * t + Math.sin(ang) * 40 * Math.sin(t * Math.PI) + Math.sin(f * 0.15 + i) * 10;
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${t * 220 + Math.sin(f * 0.1 + i) * 6}) scale(${p * (1 - t * 0.85)})`}
            opacity={1 - ease(f, 20 + it.d, 24 + it.d)}>
            {it.el}
          </g>
        );
      })}
    </Stage>
  );
};
