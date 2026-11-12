import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease, pop} from '../anim';
import {Stage} from '../components/Stage';
import {Neuron} from '../components/Props';
import {SceneProps} from './types';

// Neuron nyambung lagi, cabang baru tumbuh kayak tunas tanaman teal.
type P = [number, number];
// tiap cabang: titik awal + segmen kubik [c1, c2, p]
const BR: {p0: P; seg: [P, P, P][]; at: number}[] = [
  {p0: [300, 760], seg: [[[420, 760], [420, 960], [560, 960]], [[680, 960], [700, 1080], [790, 1110]]], at: 4},
  {p0: [300, 760], seg: [[[300, 950], [360, 1150], [440, 1330]]], at: 12},
  {p0: [790, 1110], seg: [[[700, 1240], [560, 1290], [440, 1330]]], at: 20},
  {p0: [790, 1110], seg: [[[860, 940], [860, 760], [760, 620]]], at: 26},
];
const cub = (a: P, b: P, c: P, d: P, t: number): P => {
  const u = 1 - t;
  return [0, 1].map((k) => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * d[k]) as P;
};
const at = (br: (typeof BR)[number], t: number): P => {
  const n = br.seg.length;
  const k = Math.min(n - 1, Math.floor(t * n));
  const lt = t * n - k;
  const a = k === 0 ? br.p0 : br.seg[k - 1][2];
  const s = br.seg[k];
  return cub(a, s[0], s[1], s[2], lt);
};
const pathOf = (br: (typeof BR)[number]) => `M ${br.p0.join(' ')} ` + br.seg.map((s) => `C ${s.map((p) => p.join(' ')).join(', ')}`).join(' ');

export const S35: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  return (
    <Stage bg={{top: '#5E2A4A', bottom: '#1E4F4C', glow: C.teal, glowY: 1000, glowOp: 0.35}} particles={{n: 26, color: C.mint, color2: C.gold, opacity: 0.45}}>
      {BR.map((br, i) => {
        const g = ease(f, br.at, br.at + 18);
        const d = pathOf(br);
        return (
          <g key={i}>
            <path d={d} stroke={C.teal} strokeWidth={14} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - g} />
            <path d={d} stroke={C.mint} strokeWidth={4} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - g} opacity={0.7} />
            {/* daun tunas */}
            {[0.3, 0.55, 0.8].map((lt, j) => {
              const [x, y] = at(br, lt);
              const [x2, y2] = at(br, Math.min(1, lt + 0.02));
              const ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI + (j % 2 ? 50 : -50);
              const s = pop(f, br.at + 18 * lt + 2, 10);
              return (
                <g key={j} transform={`translate(${x},${y}) rotate(${ang}) scale(${g >= lt ? s : 0})`}>
                  <path d="M 0 0 C 10 -18 34 -20 46 0 C 34 20 10 18 0 0 Z" fill={j % 2 ? C.mint : C.teal} />
                  <path d="M 4 0 L 40 0" stroke="#1E4F4C" strokeWidth={3} opacity={0.5} />
                </g>
              );
            })}
            {/* percikan emas berjalan setelah tersambung */}
            {g >= 1 && (() => {
              const u = ((f - br.at - 18) * 0.04) % 1;
              const [x, y] = at(br, u);
              return <circle cx={x} cy={y} r={12} fill={C.gold} />;
            })()}
          </g>
        );
      })}
      <Neuron x={300} y={760} s={1.1} color={C.teal} glow={0.8} />
      <Neuron x={790} y={1110} s={1.1} color={C.teal} glow={0.8} />
      <Neuron x={440} y={1330} s={0.9} color={C.mint} glow={0.6} />
      <Neuron x={760} y={620} s={0.8} color={C.mint} glow={0.6} />
    </Stage>
  );
};
