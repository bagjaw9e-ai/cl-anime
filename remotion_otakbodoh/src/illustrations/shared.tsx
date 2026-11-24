// Elemen ilustrasi bersama: HP "18+" (simbolik: siluet blur kepala-bahu ter-pixelate + sensor bar), asap marah,
// bubble bicara bergerigi (#@!%), garis putus-putus penunjuk, kilau. Semua aman TikTok/IG (tanpa ketelanjangan).
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {clamp, rand} from '../theme';
import {useSid} from '../components/Phone';
import {Halo} from '../components/Lit';

export const ramp = (t: number, a: number, b: number) => clamp((t - a) / Math.max(1e-6, b - a));
export const smooth = (v: number) => v * v * (3 - 2 * v);
export const backOut = (v: number) => { const c = 1.7, x = clamp(v) - 1; return 1 + (c + 1) * x * x * x + c * x * x; };
export const PINK = '#FF5FA2';

// siluet kepala-bahu blur ter-pixelate (warna pink) — simbol konten dewasa tanpa detail
export const BlurSilhouette: React.FC<{w: number; h: number; seed?: number; color?: string}> = ({w, h, seed = 1, color = PINK}) => {
  const cells: React.ReactNode[] = [];
  const n = 7, cw = w / n, ch = h / 9;
  for (let r = 0; r < 9; r++) for (let c = 0; c < n; c++) {
    const x = (c + 0.5) / n - 0.5, y = (r + 0.5) / 9;
    const head = Math.hypot(x / 0.2, (y - 0.32) / 0.17) < 1;
    const body = y > 0.52 && Math.abs(x) < 0.12 + (y - 0.52) * 0.9;
    const k = head || body ? 0.75 + rand(seed + r * 9 + c) * 0.25 : 0.15 + rand(seed + r * 7 + c) * 0.15;
    cells.push(<rect key={`${r}-${c}`} x={-w / 2 + c * cw} y={-h / 2 + r * ch} width={cw + 0.5} height={ch + 0.5} fill={color} opacity={k} />);
  }
  return <g>{cells}</g>;
};

// HP dengan badge 18+ + layar siluet blur + sensor bar. glow 0..1, badge 0..1
export const Phone18: React.FC<{w?: number; glow?: number; badge?: number; color?: string; screen?: 'silhouette' | 'plain'; seed?: number}> = ({
  w = 140, glow = 1, badge = 1, color = PINK, screen = 'silhouette', seed = 1,
}) => {
  const f = useCurrentFrame();
  const h = w * 1.9, id = useSid('p18');
  const flick = 0.9 + 0.1 * Math.sin(f * 0.37);
  return (
    <g>
      <Halo rx={w * 1.5} ry={h * 0.9} color={color} op={0.45 * glow * flick} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.16} fill="#15101A" />
      <clipPath id={`${id}c`}><rect x={-w / 2 + w * 0.07} y={-h / 2 + w * 0.09} width={w * 0.86} height={h - w * 0.18} rx={w * 0.1} /></clipPath>
      <g clipPath={`url(#${id}c)`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#2A0E1E" />
        {screen === 'silhouette' && <g opacity={0.4 + 0.6 * glow}><BlurSilhouette w={w * 0.86} h={h * 0.86} seed={seed} color={color} /></g>}
        {screen === 'silhouette' && <rect x={-w / 2} y={-h * 0.06} width={w} height={h * 0.09} fill="#050507" />}
        <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={color} opacity={0.12 * glow} />
      </g>
      {badge > 0 && (
        <g transform={`translate(${w * 0.36},${-h * 0.44}) scale(${backOut(badge)})`}>
          <circle r={w * 0.24} fill="#E0262E" stroke="#FFFFFF" strokeWidth={w * 0.03} />
          <text y={w * 0.08} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={w * 0.2} fill="#FFFFFF">18+</text>
        </g>
      )}
    </g>
  );
};

// garis putus-putus penunjuk (ala ref_2), p = progres gambar
export const DashPointer: React.FC<{x1: number; y1: number; x2: number; y2: number; p?: number; color?: string}> = ({x1, y1, x2, y2, p = 1, color = '#FFFFFF'}) => {
  const L = Math.hypot(x2 - x1, y2 - y1);
  return (
    <g opacity={0.85}>
      <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={color} strokeWidth={4} strokeDasharray="10 10" strokeLinecap="round" />
      {p > 0.98 && <circle cx={x2} cy={y2} r={8} fill={color} />}
      {L < 0 && null}
    </g>
  );
};

// asap marah dari kepala
export const AngerSteam: React.FC<{x?: number; y?: number; s?: number; t?: number; color?: string}> = ({x = 0, y = 0, s = 1, t, color = '#E8E8EE'}) => {
  const f = useCurrentFrame();
  const tt = t ?? f;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {[0, 1, 2, 3].map((i) => {
        const ph = ((tt * 0.04 + i * 0.25) % 1);
        const sd = i % 2 ? 1 : -1;
        return <circle key={i} cx={sd * (30 + ph * 40)} cy={-ph * 120} r={16 + ph * 22} fill={color} opacity={(1 - ph) * 0.8} />;
      })}
    </g>
  );
};

// bubble bicara bergerigi merah berisi simbol (bukan kata kasar)
export const JaggedBubble: React.FC<{text?: string; s?: number; p?: number; tail?: 1 | -1}> = ({text = '#@!%', s = 1, p = 1, tail = 1}) => {
  const f = useCurrentFrame();
  const pts: string[] = [];
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2, r = i % 2 ? 150 : 112 + rand(i) * 18;
    pts.push(`${Math.cos(a) * r * 1.25},${Math.sin(a) * r * 0.78}`);
  }
  const shake = Math.sin(f * 1.7) * 3;
  return (
    <g transform={`translate(${shake},0) scale(${s * backOut(p)})`} opacity={clamp(p * 2)}>
      <path d={`M ${tail * 60} 80 L ${tail * 150} 190 L ${tail * 10} 100 Z`} fill="#E0262E" />
      <polygon points={pts.join(' ')} fill="#E0262E" />
      <polygon points={pts.join(' ')} fill="none" stroke="#FFFFFF" strokeWidth={6} opacity={0.85} />
      <text y={26} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={78} fill="#FFFFFF">{text}</text>
    </g>
  );
};

// kilau kecil
export const Twinkle: React.FC<{x: number; y: number; s?: number; c?: string; o?: number}> = ({x, y, s = 1, c = '#FFF4E0', o = 1}) => (
  <path transform={`translate(${x},${y}) scale(${s})`} opacity={o} d="M 0 -16 C 2 -4 4 -2 16 0 C 4 2 2 4 0 16 C -2 4 -4 2 -16 0 C -4 -2 -2 -4 0 -16 Z" fill={c} />
);
