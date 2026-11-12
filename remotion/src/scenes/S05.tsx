import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, rand} from '../theme';
import {ease} from '../anim';
import {Stage} from '../components/Stage';
import {Brain, CEREBRUM} from '../components/Brain';
import {SceneProps} from './types';

// Otak dari kepingan puzzle, keping copot satu-satu dan jatuh.
const COLS = 4, ROWS = 3, X0 = -215, Y0 = -172, PW = 112.5, PH = 124;
const hs = (c: number, r: number) => ((c * 3 + r * 5) % 2 ? 1 : -1);
const vs = (c: number, r: number) => ((c * 7 + r * 3) % 2 ? 1 : -1);

const edge = (ax: number, ay: number, bx: number, by: number, s: number) => {
  if (!s) return `L ${bx} ${by}`;
  const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
  const nx = -dy / len, ny = dx / len, k = s * len * 0.24;
  const p = (t: number, o: number) => `${ax + dx * t + nx * o} ${ay + dy * t + ny * o}`;
  return `L ${p(0.36, 0)} C ${p(0.22, k * 1.15)} ${p(0.78, k * 1.15)} ${p(0.64, 0)} L ${bx} ${by}`;
};

const piece = (c: number, r: number) => {
  const x0 = X0 + c * PW, y0 = Y0 + r * PH, x1 = x0 + PW, y1 = y0 + PH;
  const top = r === 0 ? 0 : -hs(c, r - 1);
  const right = c === COLS - 1 ? 0 : vs(c, r);
  const bottom = r === ROWS - 1 ? 0 : hs(c, r);
  const left = c === 0 ? 0 : -vs(c - 1, r);
  // perluas tepi luar supaya batang otak ikut
  const yb = r === ROWS - 1 ? y1 + 80 : y1;
  const xl = c === 0 ? x0 - 30 : x0;
  const xr = c === COLS - 1 ? x1 + 40 : x1;
  const yt = r === 0 ? y0 - 30 : y0;
  return `M ${xl} ${yt} ${edge(xl, yt, xr, yt, top)} ${edge(xr, yt, xr, yb, right)} ${edge(xr, yb, xl, yb, bottom)} ${edge(xl, yb, xl, yt, left)} Z`;
};

const ORDER = [4, 9, 1, 7, 11, 2, 5, 10, 0, 6, 3, 8];

export const S05: React.FC<SceneProps> = ({b}) => {
  const f = useCurrentFrame();
  const beat = b[0] ?? 48;
  const zoom = ease(f, 0, 80, 1.0, 1.08);
  return (
    <Stage bg={{top: C.base2, bottom: C.base0, glow: C.plum, glowY: 900, glowOp: 0.9}}
      particles={{n: 20, color: C.rose, color2: C.cream, opacity: 0.35}} cam={{s: zoom, y: 1000}}>
      <defs>
        <clipPath id="s5brain">
          <path d={CEREBRUM} />
          <ellipse cx={130} cy={98} rx={74} ry={44} />
          <path d="M 40 70 C 40 120 54 160 62 196 L 96 196 C 92 150 94 110 100 76 Z" />
        </clipPath>
        {Array.from({length: COLS * ROWS}).map((_, i) => (
          <clipPath key={i} id={`s5p${i}`}><path d={piece(i % COLS, Math.floor(i / COLS))} /></clipPath>
        ))}
      </defs>
      <g transform="translate(540,900) scale(1.75)">
        {Array.from({length: COLS * ROWS}).map((_, i) => {
          const k = ORDER.indexOf(i);
          const t0 = k < 2 ? 14 + k * 14 : beat - 6 + (k - 2) * 6;
          const tt = Math.max(0, f - t0);
          const wig = f > t0 - 8 && f < t0 ? Math.sin(f * 2.2) * 2 : 0;
          const fy = 0.55 * tt * tt;
          const fx = (rand(i) - 0.5) * tt * 3;
          const rot = (rand(i + 3) - 0.5) * tt * 5 + wig;
          const cx = X0 + (i % COLS + 0.5) * PW, cy = Y0 + (Math.floor(i / COLS) + 0.5) * PH;
          return (
            <g key={i} transform={`translate(${fx},${fy}) rotate(${rot} ${cx} ${cy})`} opacity={tt > 40 ? 0 : 1}>
              <g clipPath={`url(#s5p${i})`}>
                <g clipPath="url(#s5brain)">
                  <Brain pfc={0.55} mid={0.45} />
                  <path d={piece(i % COLS, Math.floor(i / COLS))} stroke={C.cream} strokeWidth={4} fill="none" opacity={0.75} />
                </g>
              </g>
            </g>
          );
        })}
      </g>
      {/* bayangan lubang di lantai */}
      <ellipse cx={540} cy={1480} rx={330} ry={34} fill="#000" opacity={0.3} />
    </Stage>
  );
};
