// PANEL TEKS NEON 9:16 (overlay layar, TIDAK ikut kamera): pusat x 540, y 296-382 (tinggi 86), lebar 560-700, font 40-46 px,
// IKON ±60 px di KIRI teks DI DALAM panel (jarak 11 px), ikon berdenyut. Ganti teks: panel lama flicker mati (SWITCH_OUT),
// panel baru flicker nyala 2-3x (SWITCH_IN) lalu stabil. Segmen 'often' (Fase 3) = flicker lebih sering.
// PROGRESS BAR BATERAI tepat di bawah panel (y 404-444, total lebar ±420 termasuk persen) dengan LOGO CHARGE (petir) dinamis:
// berdenyut nyala-redup + kilau berjalan di isi baterai. Isi = frame / frame terakhir (tepat 100% di frame terakhir).
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT} from '../fonts';
import {NEON, NEON_FROM, NeonSeg, SWITCH_IN, SWITCH_OUT, neonAt} from '../neonPanel';
import {TOTAL_FRAMES, progressAt} from '../timeline';
import {rand} from '../theme';
import {NeonIcon} from '../illustrations/nk/fase3';

const clamp = (v: number) => Math.max(0, Math.min(1, v));
let ctx: CanvasRenderingContext2D | null = null;
const measure = (txt: string, size: number) => {
  if (typeof document === 'undefined') return txt.length * size * 0.66;
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  ctx!.font = `800 ${size}px Poppins`;
  return ctx!.measureText(txt).width;
};
export const PANEL_TOP = 296, PANEL_H = 86;
const ICON = 60, GAP = 11;

const neonLevel = (seg: NeonSeg, f: number) => {
  const k = f - seg.from;
  if (k < SWITCH_IN) return [0.15, 1, 1, 0.1, 0.05, 1, 0.9, 0.2, 1, 1, 0.6, 1, 1, 1][Math.max(0, k)];
  const off = seg.to - f;
  if (seg.to < TOTAL_FRAMES && off <= SWITCH_OUT) return [0, 0.1, 0.7, 0.15, 1, 0.5, 1][Math.max(0, off)];
  if (seg.flicker === 'often') {
    const r = rand(Math.floor(f / 2) * 1.37 + 3);
    return r > 0.9 ? 0.2 : r > 0.83 ? 0.6 : 0.93 + 0.07 * Math.sin(f * 0.9);
  }
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
  const fs = Math.min(46, ((700 - ICON - GAP - 72) / (measure(txt, 100) + 0.6 * txt.length)) * 100);
  const tw = measure(txt, fs) + 0.6 * txt.length + fs * 0.22 * (seg.words.length - 1);
  const w = Math.max(560, Math.min(700, ICON + GAP + tw + 64));
  const appear = clamp((f - NEON_FROM) / 8);
  const g = seg.glow;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 540 - w / 2, top: PANEL_TOP, width: w, height: PANEL_H, borderRadius: 24,
        background: 'rgba(6,7,12,0.62)', border: `2px solid ${g}${lv > 0.5 ? '88' : '22'}`,
        boxShadow: `0 0 ${28 * lv}px ${g}${Math.round(lv * 80).toString(16).padStart(2, '0')}, inset 0 0 ${22 * lv}px ${g}33`,
        transform: `scale(${0.92 + 0.08 * appear})`, opacity: appear, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: GAP}}>
        <svg width={ICON} height={ICON} style={{flex: 'none', opacity: 0.3 + 0.7 * lv, overflow: 'visible'}}>
          <g transform={`translate(${ICON / 2},${ICON / 2})`}><NeonIcon name={seg.icon} c={g} s={ICON * 0.92} t={f} /></g>
        </svg>
        <div style={{display: 'flex', gap: fs * 0.22}}>
          {seg.words.map((wd, i) => {
            const L = wd.bright ? lv : lv * 0.85;
            const wg = seg.id === 3 && i === 0 ? '#BFD8FF' : g; // logo PMO SAVIOR: "PMO" neon putih, "SAVIOR" neon merah
            return (
              <span key={i} style={{fontFamily: FONT, fontWeight: 800, fontSize: fs, letterSpacing: 0.6, whiteSpace: 'nowrap', color: L > 0.3 ? wd.c : '#3A3A44',
                textShadow: L > 0.3 ? `0 0 3px #FFFFFF, 0 0 ${9 * L}px ${wg}, 0 0 ${20 * L}px ${wg}, 0 0 ${42 * L}px ${wg}, 0 0 ${70 * L}px ${wg}99` : 'none',
                opacity: 0.35 + 0.65 * L}}>{wd.t}</span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// logo charge (petir) di dalam baterai: berdenyut glow nyala-redup; frame-frame terakhir berkedip terang
export const ChargeBolt: React.FC<{x: number; y: number; f: number; full: number}> = ({x, y, f, full}) => {
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.25);
  const b = Math.min(1, pulse + full);
  return (
    <g transform={`translate(${x},${y}) scale(${1.45 + 0.12 * Math.sin(f * 0.25) + full * 0.35})`}>
      <path d="M 3 -15 L -9 2 L -1 2 L -4 15 L 9 -3 L 1 -3 Z" fill="#FFFFFF" opacity={0.6 + 0.4 * b}
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
  const k = clamp((f - NEON_FROM - 4) / 10);
  const bw = 300, bh = 40, x0 = 540 - (bw + 12 + 18 + 92) / 2, y0 = 404 - (1 - k) * 30; // slide down saat muncul
  const fillW = (bw - 12) * p;
  const sh = ((f * 5) % (bw + 120)) - 60;
  const full = f >= TOTAL_FRAMES - 10 ? Math.sin(clamp((f - (TOTAL_FRAMES - 10)) / 9) * Math.PI) : 0;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', opacity: k}}>
      <defs>
        <clipPath id="batFill9"><rect x={x0 + 6} y={y0 + 6} width={fillW} height={bh - 12} rx={7} /></clipPath>
        <linearGradient id="batShine9" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0} /><stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.6} /><stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={x0} y={y0} width={bw} height={bh} rx={12} fill="rgba(6,7,12,0.72)" stroke="#E8ECF4" strokeWidth={3.5} />
      <rect x={x0 + bw + 2} y={y0 + bh / 2 - 9} width={10} height={18} rx={3} fill="#E8ECF4" />
      <rect x={x0 + 6} y={y0 + 6} width={fillW} height={bh - 12} rx={7} fill={col} style={{filter: `drop-shadow(0 0 8px ${col})`}} />
      <g clipPath="url(#batFill9)">
        <rect x={x0 + sh} y={y0} width={56} height={bh} fill="url(#batShine9)" transform="skewX(-20)" />
        <rect x={x0 + 6} y={y0 + 8} width={fillW} height={6} rx={3} fill="#FFFFFF" opacity={0.25} />
      </g>
      <ChargeBolt x={x0 + bw / 2} y={y0 + bh / 2} f={f} full={full} />
      <text x={x0 + bw + 30} y={y0 + bh / 2 + 13} fontFamily={FONT} fontWeight={800} fontSize={36} fill="#FFFFFF"
        style={{paintOrder: 'stroke', stroke: 'rgba(10,10,20,0.9)', strokeWidth: 4, filter: `drop-shadow(0 0 5px ${col})`}}>{pct}%</text>
    </svg>
  );
};
