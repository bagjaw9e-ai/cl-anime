// PANEL TEKS NEON 16:9 (pusat x 960, y 120-190, lebar 520-680, tinggi 74) dengan IKON STATIS ±56 px di KIRI teks (jarak 11 px)
// + PROGRESS BAR BATERAI (y 205-240, lebar ±390 termasuk persen) dengan LOGO CHARGE (petir) dinamis: berdenyut + kilau jalan.
// Ganti teks: panel lama flicker mati (SWITCH_OUT), panel baru flicker nyala 2-3x (SWITCH_IN) lalu stabil; ikon ikut ganti.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT} from '../fonts';
import {NEON, NEON_FROM, NeonSeg, SWITCH_IN, SWITCH_OUT, neonAt} from '../neonPanel';
import {TOTAL_FRAMES, progressAt} from '../timeline';
import {rand} from '../theme';
import {NeonIcon} from '../illustrations/h30/partC';

const clamp = (v: number) => Math.max(0, Math.min(1, v));
let ctx: CanvasRenderingContext2D | null = null;
const measure = (txt: string, size: number) => {
  if (typeof document === 'undefined') return txt.length * size * 0.66;
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  ctx!.font = `800 ${size}px Poppins`;
  return ctx!.measureText(txt).width;
};
const ICON = 56, GAP = 11;

const neonLevel = (seg: NeonSeg, f: number) => {
  const k = f - seg.from;
  if (k < SWITCH_IN) return [0.15, 1, 1, 0.1, 0.05, 1, 0.9, 0.2, 1, 1, 0.6, 1, 1, 1][Math.max(0, k)];
  const off = seg.to - f;
  if (seg.to < TOTAL_FRAMES && off <= SWITCH_OUT) return [0, 0.1, 0.7, 0.15, 1, 0.5, 1][Math.max(0, off)];
  const r = rand(Math.floor(f / 3) * 0.71 + 1);
  return r > 0.97 ? 0.55 : 0.94 + 0.06 * Math.sin(f * 0.37);
};

export const NeonPanelView: React.FC<{frame?: number}> = ({frame}) => {
  const fr = useCurrentFrame();
  const f = frame ?? fr;
  if (f < NEON_FROM) return null;
  const seg = neonAt(f) ?? NEON[NEON.length - 1];
  const lv = neonLevel(seg, f);
  const txt = seg.words.map((w) => w.t).join(' ');
  const fs = Math.min(42, ((640 - ICON - GAP - 60) / measure(txt, 100)) * 100);
  const w = Math.max(520, Math.min(680, ICON + GAP + measure(txt, fs) + 64));
  const appear = clamp((f - NEON_FROM) / 8);
  const g = seg.glow;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 960 - w / 2, top: 118, width: w, height: 74, borderRadius: 22,
        background: 'rgba(6,7,12,0.64)', border: `2px solid ${g}${lv > 0.5 ? '88' : '22'}`,
        boxShadow: `0 0 ${26 * lv}px ${g}${Math.round(lv * 80).toString(16).padStart(2, '0')}, inset 0 0 ${20 * lv}px ${g}33`,
        transform: `scale(${0.92 + 0.08 * appear})`, opacity: appear, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: GAP}}>
        <svg width={ICON} height={ICON} style={{flex: 'none', opacity: 0.35 + 0.65 * lv}}><g transform={`translate(${ICON / 2},${ICON / 2})`}><NeonIcon name={seg.icon} c={g} s={ICON * 0.9} /></g></svg>
        <div style={{display: 'flex', gap: fs * 0.28}}>
          {seg.words.map((wd, i) => {
            const L = wd.bright ? lv : lv * 0.85;
            return (
              <span key={i} style={{fontFamily: FONT, fontWeight: 800, fontSize: fs, letterSpacing: 1.5, whiteSpace: 'nowrap', color: L > 0.3 ? wd.c : '#3A3A44',
                textShadow: L > 0.3 ? `0 0 3px #FFFFFF, 0 0 ${9 * L}px ${g}, 0 0 ${20 * L}px ${g}, 0 0 ${42 * L}px ${g}, 0 0 ${70 * L}px ${g}99` : 'none',
                opacity: 0.35 + 0.65 * L}}>{wd.t}</span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// logo charge (petir) di dalam baterai: berdenyut (glow nyala-redup); di frame terakhir berkedip terang sekali
export const ChargeBolt: React.FC<{x: number; y: number; f: number; full: number}> = ({x, y, f, full}) => {
  const pulse = 0.55 + 0.45 * Math.sin(f * 0.25);
  const b = Math.min(1, pulse + full);
  return (
    <g transform={`translate(${x},${y}) scale(${1.35 + 0.1 * Math.sin(f * 0.25) + full * 0.35})`}>
      <path d="M 3 -15 L -9 2 L -1 2 L -4 15 L 9 -3 L 1 -3 Z" fill="#FFFFFF" opacity={0.65 + 0.35 * b}
        style={{filter: `drop-shadow(0 0 ${3 + 6 * b}px #FFF6B0) drop-shadow(0 0 ${2 + 10 * full}px #FFFFFF)`}} stroke="#1A1A22" strokeWidth={1.6} />
    </g>
  );
};

export const BatteryProgress: React.FC<{frame?: number}> = ({frame}) => {
  const fr = useCurrentFrame();
  const f = frame ?? fr;
  if (f < NEON_FROM) return null;
  const p = progressAt(f);
  const pct = f >= TOTAL_FRAMES - 1 ? 100 : Math.floor(p * 100);
  const col = pct <= 33 ? '#FF3B3B' : pct <= 66 ? '#FFD23F' : '#3FE07A';
  const appear = clamp((f - NEON_FROM - 4) / 8);
  const bw = 290, bh = 34, x0 = 960 - (bw + 12 + 16 + 84) / 2, y0 = 205;
  const fillW = (bw - 10) * p;
  const sh = ((f * 5) % (bw + 120)) - 60;
  const full = f >= TOTAL_FRAMES - 10 ? Math.sin(clamp((f - (TOTAL_FRAMES - 10)) / 9) * Math.PI) : 0;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', opacity: appear}}>
      <defs>
        <clipPath id="batFill16"><rect x={x0 + 5} y={y0 + 5} width={fillW} height={bh - 10} rx={6} /></clipPath>
        <linearGradient id="batShine16" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0} /><stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.55} /><stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={x0} y={y0} width={bw} height={bh} rx={10} fill="rgba(6,7,12,0.72)" stroke="#E8ECF4" strokeWidth={3} />
      <rect x={x0 + bw + 2} y={y0 + bh / 2 - 8} width={9} height={16} rx={3} fill="#E8ECF4" />
      <rect x={x0 + 5} y={y0 + 5} width={fillW} height={bh - 10} rx={6} fill={col} style={{filter: `drop-shadow(0 0 7px ${col})`}} />
      <g clipPath="url(#batFill16)">
        <rect x={x0 + sh} y={y0} width={50} height={bh} fill="url(#batShine16)" transform="skewX(-20)" />
        <rect x={x0 + 5} y={y0 + 7} width={fillW} height={5} rx={3} fill="#FFFFFF" opacity={0.25} />
      </g>
      <ChargeBolt x={x0 + bw / 2} y={y0 + bh / 2} f={f} full={full} />
      <text x={x0 + bw + 26} y={y0 + bh / 2 + 12} fontFamily={FONT} fontWeight={800} fontSize={32} fill="#FFFFFF"
        style={{paintOrder: 'stroke', stroke: 'rgba(10,10,20,0.9)', strokeWidth: 4, filter: `drop-shadow(0 0 5px ${col})`}}>{pct}%</text>
    </svg>
  );
};
