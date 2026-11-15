import React from 'react';
import {C} from '../theme';
import {Ill, SLOT, Slot} from '../illustrationTrack';
import {beatF} from '../timeline';

export type IllProps = {t: number; f: number; slot: Slot; w: number; h: number; il: Ill};
export const FONT = 'Inter, DejaVu Sans, sans-serif';
export const bf = (id: number, off = 0) => beatF(id) + off;
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const ramp = (f: number, a: number, b: number) => clamp01((f - a) / Math.max(1, b - a));
export const smooth = (v: number) => v * v * (3 - 2 * v);
export const backOut = (v: number) => { const c = 1.7; const x = v - 1; return 1 + (c + 1) * x * x * x + c * x * x; };

// Label teks kecil yang MENEMPEL di ilustrasi (badge/pill). 1-3 kata.
export const Pill: React.FC<{x?: number; y?: number; text: string; bg?: string; fg?: string; size?: number; r?: number}> = ({
  x = 0, y = 0, text, bg = C.red1, fg = C.cream, size = 30, r = 0,
}) => {
  const w = text.length * size * 0.66 + size * 1.1;
  const h = size * 1.55;
  return (
    <g transform={`translate(${x},${y}) rotate(${r})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={bg} />
      <text x={0} y={size * 0.36} textAnchor="middle" fontSize={size} fontWeight={800} fill={fg} fontFamily={FONT} letterSpacing={1}>{text}</text>
    </g>
  );
};

// glow blur generik
export const Glow: React.FC<{id: string; sd?: number}> = ({id, sd = 14}) => (
  <filter id={id} x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation={sd} /></filter>
);

// Sparkle 4 sudut
export const Spark: React.FC<{x: number; y: number; s?: number; c?: string; o?: number}> = ({x, y, s = 1, c = C.gold, o = 1}) => (
  <path transform={`translate(${x},${y}) scale(${s})`} opacity={o} fill={c}
    d="M 0 -20 C 3 -5 5 -3 20 0 C 5 3 3 5 0 20 C -3 5 -5 3 -20 0 C -5 -3 -3 -5 0 -20 Z" />
);

/** Wrapper slot: pop-in (back-out) & keluar (mengecil + naik + pudar). Komponen digambar berpusat di (0,0). */
export const IllWrap: React.FC<{il: Ill; f: number; children: (p: IllProps) => React.ReactNode; outStyle?: 'shrink' | 'fly' | 'none'; inStyle?: 'pop' | 'fade' | 'none'}> = ({
  il, f, children, outStyle = 'shrink', inStyle = 'pop',
}) => {
  if (f < il.in || f >= il.out + 12) return null;
  const s = SLOT[il.slot];
  const ip = ramp(f, il.in, il.in + 12);
  const op = ramp(f, il.out, il.out + 12);
  const sc = inStyle === 'pop' ? 0.2 + 0.8 * backOut(ip) : 1;
  const alphaIn = inStyle === 'none' ? 1 : smooth(Math.min(1, ip * 1.6));
  const so = outStyle === 'shrink' ? 1 - 0.7 * smooth(op) : 1;
  const dy = outStyle === 'fly' ? -500 * smooth(op) : outStyle === 'shrink' ? -40 * smooth(op) : 0;
  const alphaOut = outStyle === 'none' ? 1 : 1 - smooth(op);
  return (
    <g transform={`translate(${s.x},${s.y + dy}) scale(${sc * so})`} opacity={alphaIn * alphaOut}>
      {children({t: f - il.in, f, slot: il.slot, w: s.w, h: s.h, il})}
    </g>
  );
};
