import React from 'react';
import {C} from '../theme';
import {FONT} from '../fonts';

export type IP = {t: number};
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const ramp = (t: number, a: number, b: number) => clamp01((t - a) / Math.max(1, b - a));
export const smooth = (v: number) => v * v * (3 - 2 * v);
export const backOut = (v: number) => { const c = 1.7, x = clamp01(v) - 1; return 1 + (c + 1) * x * x * x + c * x * x; };

export const Spark: React.FC<{x: number; y: number; s?: number; c?: string; o?: number}> = ({x, y, s = 1, c = C.gold, o = 1}) => (
  <path transform={`translate(${x},${y}) scale(${s})`} opacity={o} fill={c}
    d="M 0 -20 C 3 -5 5 -3 20 0 C 5 3 3 5 0 20 C -3 5 -5 3 -20 0 C -5 -3 -3 -5 0 -20 Z" />
);
// label teks yang MENEMPEL di ilustrasi
export const Pill: React.FC<{x?: number; y?: number; text: string; bg?: string; fg?: string; size?: number; r?: number}> = ({x = 0, y = 0, text, bg = C.red1, fg = '#FFFFFF', size = 28, r = 0}) => {
  const w = text.length * size * 0.68 + size * 1.2, h = size * 1.6;
  return (
    <g transform={`translate(${x},${y}) rotate(${r})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={bg} />
      <text x={0} y={size * 0.36} textAnchor="middle" fontSize={size} fontWeight={800} fill={fg} fontFamily={FONT}>{text}</text>
    </g>
  );
};
// coretan X merah (digambar progresif)
export const CrossX: React.FC<{p: number; s?: number}> = ({p, s = 1}) => (
  <g transform={`scale(${s})`} stroke="#E0263A" strokeWidth={22} strokeLinecap="round" fill="none">
    <path d="M -90 -90 L 90 90" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01(p * 2)} />
    <path d="M 90 -90 L -90 90" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01(p * 2 - 1)} />
  </g>
);
export const Check: React.FC<{p: number; s?: number; c?: string}> = ({p, s = 1, c = '#3CC27A'}) => (
  <g transform={`scale(${s * backOut(p)})`}>
    <circle r={50} fill={c} />
    <path d="M -24 0 L -6 20 L 28 -20" stroke="#FFFFFF" strokeWidth={13} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
export const Padlock: React.FC<{open?: number; s?: number; c?: string}> = ({open = 0, s = 1, c = C.gold}) => (
  <g transform={`scale(${s})`}>
    <path d={`M -30 -10 L -30 -44 C -30 -78 30 -78 30 -44 L 30 ${-10 - open * 40}`} transform={`translate(0,${-open * 20})`} stroke="#D9D2DA" strokeWidth={14} fill="none" strokeLinecap="round" />
    <rect x={-46} y={-14} width={92} height={78} rx={16} fill={c} />
    <circle cx={0} cy={18} r={10} fill="#3A2A30" /><rect x={-4} y={20} width={8} height={22} rx={4} fill="#3A2A30" />
  </g>
);
// garis putus-putus penunjuk dari ilustrasi ke karakter (ala referensi)
export const Pointer: React.FC<{x1: number; y1: number; x2: number; y2: number; p?: number; c?: string}> = ({x1, y1, x2, y2, p = 1, c = '#FFFFFF'}) => (
  <path d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 60} ${x2} ${y2}`} stroke={c} strokeWidth={4} strokeDasharray="10 12" fill="none" opacity={0.7 * p}
    strokeLinecap="round" />
);
export {FONT};
