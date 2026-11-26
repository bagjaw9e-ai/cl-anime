// PANEL TEKS NEON (y 300-420) + PROGRESS BAR BATERAI (y 440-500). Tampil mulai Fase 1 sampai akhir.
// Ganti teks: panel lama flicker mati (SWITCH_OUT frame), panel baru flicker nyala 2-3x (SWITCH_IN frame) lalu stabil.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT} from '../fonts';
import {NEON, NEON_FROM, NeonSeg, SWITCH_IN, SWITCH_OUT, neonAt} from '../neonPanel';
import {TOTAL_FRAMES, progressAt} from '../timeline';
import {rand} from '../theme';

const clamp = (v: number) => Math.max(0, Math.min(1, v));
let ctx: CanvasRenderingContext2D | null = null;
const measure = (txt: string, size: number) => {
  if (typeof document === 'undefined') return txt.length * size * 0.66;
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  ctx!.font = `800 ${size}px Poppins`;
  return ctx!.measureText(txt).width;
};

// pola nyala 0..1 untuk frame f
const neonLevel = (seg: NeonSeg, f: number) => {
  const k = f - seg.from;
  // nyala: 3 kedipan (on-off-on-off-on) lalu stabil
  if (k < SWITCH_IN) {
    const pat = [0.15, 1, 1, 0.1, 0.05, 1, 0.9, 0.2, 1, 1, 0.6, 1, 1, 1];
    return pat[Math.max(0, k)];
  }
  // mati menjelang segmen berikutnya (kecuali segmen terakhir: mati di frame-frame akhir)
  const off = seg.to - f;
  if (off <= SWITCH_OUT) { const pat = [0, 0.1, 0.7, 0.15, 1, 0.5, 1]; return pat[Math.max(0, off)]; }
  if ((seg as {flicker?: string}).flicker === 'broken') {
    // lampu mau rusak: sering dip singkat
    const r = rand(Math.floor(f / 2) * 1.37 + 3);
    return r > 0.86 ? 0.15 : r > 0.78 ? 0.55 : 0.92 + 0.08 * Math.sin(f * 0.9);
  }
  const r = rand(Math.floor(f / 3) * 0.71 + 1);
  return r > 0.97 ? 0.55 : 0.94 + 0.06 * Math.sin(f * 0.37);
};

export const NeonPanelView: React.FC<{frame?: number; finalOff?: number}> = ({frame, finalOff = 0}) => {
  const fr = useCurrentFrame();
  const f = frame ?? fr;
  if (f < NEON_FROM) return null;
  const seg = neonAt(f) ?? NEON[NEON.length - 1];
  let lv = neonLevel(seg, f);
  // penutup: flicker terakhir lalu mati
  if (finalOff > 0) lv *= finalOff > 0.95 ? 0 : (Math.floor(f / 2) % 2 ? 0.2 : 1) * (1 - finalOff);
  const txt = seg.words.map((w) => w.t).join(' ');
  const fs = Math.min(60, (640 / measure(txt, 100)) * 100);
  const w = Math.max(620, Math.min(760, measure(txt, fs) + 110));
  const appear = clamp((f - NEON_FROM) / 8);
  const g = seg.glow;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 540 - w / 2, top: 300, width: w, height: 120, borderRadius: 30,
        background: 'rgba(6,7,12,0.62)', border: `2px solid ${g}${lv > 0.5 ? '88' : '22'}`,
        boxShadow: `0 0 ${30 * lv}px ${g}${Math.round(lv * 80).toString(16).padStart(2, '0')}, inset 0 0 ${24 * lv}px ${g}33`,
        transform: `scale(${0.92 + 0.08 * appear})`, opacity: appear,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: fs * 0.3}}>
        {seg.words.map((wd, i) => {
          const L = wd.bright ? lv : lv * 0.85;
          return (
            <span key={i} style={{fontFamily: FONT, fontWeight: 800, fontSize: fs, letterSpacing: 2, whiteSpace: 'nowrap',
              color: L > 0.3 ? wd.c : '#3A3A44',
              textShadow: L > 0.3 ? `0 0 4px #FFFFFF, 0 0 ${10 * L}px ${g}, 0 0 ${22 * L}px ${g}, 0 0 ${46 * L}px ${g}, 0 0 ${80 * L}px ${g}99` : 'none',
              opacity: 0.35 + 0.65 * L}}>{wd.t}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// baterai horizontal + persen. isi = frame / frame terakhir; merah 0-33, kuning 34-66, hijau 67-100; kilau berjalan.
export const BatteryProgress: React.FC<{frame?: number}> = ({frame}) => {
  const fr = useCurrentFrame();
  const f = frame ?? fr;
  if (f < NEON_FROM) return null;
  const p = progressAt(f);
  const pct = f >= TOTAL_FRAMES - 1 ? 100 : Math.floor(p * 100);
  const col = pct <= 33 ? '#FF3B3B' : pct <= 66 ? '#FFD23F' : '#3FE07A';
  const appear = clamp((f - NEON_FROM - 4) / 8);
  const bw = 270, bh = 54, x0 = 540 - (bw + 14 + 18 + 120) / 2, y0 = 443;
  const fillW = (bw - 12) * p;
  const sh = ((f * 4) % (bw + 120)) - 60;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', opacity: appear}}>
      <defs>
        <clipPath id="batFill"><rect x={x0 + 6} y={y0 + 6} width={fillW} height={bh - 12} rx={8} /></clipPath>
        <linearGradient id="batShine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0} /><stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.55} /><stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={x0} y={y0} width={bw} height={bh} rx={14} fill="rgba(6,7,12,0.7)" stroke="#E8ECF4" strokeWidth={4} />
      <rect x={x0 + bw + 2} y={y0 + bh / 2 - 12} width={12} height={24} rx={4} fill="#E8ECF4" />
      <rect x={x0 + 6} y={y0 + 6} width={fillW} height={bh - 12} rx={8} fill={col} style={{filter: `drop-shadow(0 0 8px ${col})`}} />
      <g clipPath="url(#batFill)">
        <rect x={x0 + sh} y={y0} width={60} height={bh} fill="url(#batShine)" transform={`skewX(-20)`} />
        <rect x={x0 + 6} y={y0 + 8} width={fillW} height={8} rx={4} fill="#FFFFFF" opacity={0.25} />
      </g>
      <text x={x0 + bw + 32} y={y0 + bh / 2 + 16} fontFamily={FONT} fontWeight={800} fontSize={46} fill="#FFFFFF"
        style={{paintOrder: 'stroke', stroke: 'rgba(10,10,20,0.9)', strokeWidth: 4, filter: `drop-shadow(0 0 6px ${col})`}}>{pct}%</text>
    </svg>
  );
};
