import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT} from '../fonts';
import {FPS_T, PHASES, WORDS, phaseAt} from '../timeline';
import {Callout, calloutAt, chunkAt} from '../subtitles';

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const backOut = (v: number) => { const c = 1.6, x = clamp(v) - 1; return 1 + (c + 1) * x * x * x + c * x * x; };
const SLOT_COLORS = ['#FFD23F', '#FF8A2B', '#FF3B3B'];

// ikon otak kecil untuk slot fase
const BrainIcon: React.FC<{c: string; on: number; cracked?: number}> = ({c, on, cracked = 0}) => (
  <g>
    <path d="M -16 4 C -20 -10 -10 -20 0 -18 C 10 -22 20 -12 17 0 C 22 8 14 18 4 16 C -4 20 -16 16 -16 4 Z" fill={on > 0.5 ? '#15101A' : '#8A90A0'} opacity={on > 0.5 ? 0.9 : 0.6} />
    <path d="M 0 -18 L 0 16 M -10 -4 Q -4 0 -10 6 M 10 -6 Q 4 -2 10 4" stroke={on > 0.5 ? c : '#5A6170'} strokeWidth={2} fill="none" opacity={0.6} />
    {cracked > 0 && <path d="M -4 -24 L 3 -8 L -5 2 L 4 12 L -2 26" stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={cracked} />}
  </g>
);

/* Zona atas (y 140-260): label chip fase ala ref_2 + 3 slot fase (lingkaran berikon otak) yang nyala satu-satu. */
export const PhaseHeader: React.FC<{frame?: number; crackAll?: number}> = ({frame, crackAll = 0}) => {
  const fr = useCurrentFrame();
  const f = frame ?? fr;
  const ph = phaseAt(f);
  const k = backOut((f - ph.from) / 10);
  const w = ph.label.length * 30 + 150;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute'}}>
      <g transform={`translate(540,178) scale(${0.6 + 0.4 * k})`} opacity={Math.min(1, (f - ph.from + 1) / 4)}>
        <rect x={-w / 2} y={-40} width={w} height={80} rx={24} fill="#15121C" opacity={0.88} />
        <rect x={-w / 2 + 10} y={-30} width={90} height={60} rx={16} fill={ph.color} />
        <text x={-w / 2 + 55} y={16} textAnchor="middle" fontSize={40} fontWeight={800} fill="#15121C" fontFamily={FONT}>{ph.num}</text>
        <text x={-w / 2 + 118} y={14} fontSize={38} fontWeight={800} fill="#FFFFFF" fontFamily={FONT} letterSpacing={1}>{ph.label}</text>
      </g>
      {[0, 1, 2].map((i) => {
        const on = ph.slot > i ? 1 : 0;
        const from = PHASES.find((p) => p.slot === i + 1)?.from ?? 1e9;
        const pop = on ? backOut((f - from) / 10) : 1;
        const c = SLOT_COLORS[i];
        return (
          <g key={i} transform={`translate(${468 + i * 72},246) scale(${pop})`}>
            {on > 0 && <circle r={34} fill={c} opacity={0.3 + 0.1 * Math.sin(f * 0.15 + i)} />}
            <circle r={25} fill={on ? c : '#2A2834'} stroke={on ? '#FFFFFF' : '#5A6170'} strokeWidth={3} strokeDasharray={on ? undefined : '5 5'} />
            <g transform="scale(0.8)"><BrainIcon c={c} on={on} cracked={crackAll} /></g>
          </g>
        );
      })}
    </svg>
  );
};

// lebar teks Poppins 800 (canvas measureText; font dimuat lewat delayRender di fonts.ts)
let ctx: CanvasRenderingContext2D | null = null;
const measure = (txt: string, size: number) => {
  if (typeof document === 'undefined') return txt.length * size * 0.7;
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  ctx!.font = `800 ${size}px Poppins`;
  return ctx!.measureText(txt).width;
};

/* Subtitle karaoke maks 3 kata, pusat y 1380. Putih + shadow + stroke tipis gelap; kata aktif kuning neon + glow + scale 1.08; pop kecil. */
export const Subtitle: React.FC = () => {
  const f = useCurrentFrame();
  if (calloutAt(f)) return null;
  const ch = chunkAt(f);
  if (!ch) return null;
  const t = f / FPS_T;
  const k = (f - ch.s * FPS_T) / 5;
  const sc = 0.82 + 0.18 * backOut(k);
  const txt = ch.words.map((wi) => WORDS[wi].w).join(' ');
  const fs = Math.min(76, (900 / (measure(txt, 100) + 22 * (ch.words.length - 1) * 1.3)) * 100);
  let active = -1;
  ch.words.forEach((wi) => { if (WORDS[wi].s <= t + 0.02) active = wi; });
  if (t > WORDS[ch.words[ch.words.length - 1]].e + 0.15) active = -1;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 80, right: 80, top: 1380 - 60, height: 120, display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: 22 * fs / 76, transform: `scale(${sc})`, opacity: clamp(k * 2), fontFamily: FONT, fontWeight: 800, fontSize: fs, letterSpacing: -0.5, whiteSpace: 'nowrap'}}>
        {ch.words.map((wi) => {
          const on = wi === active;
          return (
            <span key={wi} style={{color: on ? '#F5FF3B' : '#FFFFFF', transform: `scale(${on ? 1.08 : 1})`, display: 'inline-block', WebkitTextStroke: '2px rgba(10,10,20,0.85)', paintOrder: 'stroke fill',
              textShadow: on ? '0 0 18px rgba(245,255,59,0.75), 0 0 40px rgba(245,255,59,0.35), 0 4px 10px rgba(0,0,0,0.6)' : '0 4px 14px rgba(0,0,0,0.7)'}}>
              {WORDS[wi].w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* CALLOUT poster (110-140px, maks 2 baris, 1-2 kata aksen). slam = masuk besar menghantam + shake kecil; neon = nyala berkedip.
   Default di zona bawah (y ±1290-1560, ruang lantai kosong; subtitle disembunyikan) supaya tidak menutupi karakter/ilustrasi. */
export const CalloutText: React.FC<{c: Callout; top: number}> = ({c, top}) => {
  const f = useCurrentFrame();
  const f0 = Math.round(c.s * FPS_T), f1 = Math.round(c.e * FPS_T);
  const kin = (f - f0) / 8;
  const out = clamp((f1 - f) / 5);
  const size = Math.min(132, ...c.lines.map((l) => (900 / measure(l, 100)) * 100));
  const slam = c.style === 'slam';
  const sc = slam ? 1 + 0.6 * (1 - clamp(kin)) ** 2 : 1;
  const sh = slam && f - f0 > 7 && f - f0 < 16 ? Math.sin((f - f0) * 2.4) * (16 - (f - f0)) * 1.2 : 0;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 60, right: 60, top, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: `${size * 1.02}px`,
        letterSpacing: -1, transform: `translate(${sh}px,0) scale(${sc})`, opacity: clamp(kin * 2) * out, whiteSpace: 'nowrap'}}>
        {c.lines.map((l, li) => (
          <div key={li}>
            {l.split(' ').map((w, wi, arr) => {
              const acc = c.accent.includes(w);
              const flick = !slam && acc ? (f - f0 < 14 ? (Math.floor((f - f0) / 2) % 2 ? 0.45 : 1) : 0.93 + 0.07 * Math.sin(f * 0.4)) : 1;
              const col = acc ? c.color : '#FFFFFF';
              return (
                <span key={wi} style={{color: col, opacity: flick, marginRight: wi < arr.length - 1 ? size * 0.24 : 0, WebkitTextStroke: '3px rgba(10,10,20,0.9)', paintOrder: 'stroke fill',
                  textShadow: acc ? `0 0 ${size * 0.16}px ${col}, 0 0 ${size * 0.4}px ${col}88, 0 6px 16px rgba(0,0,0,0.7)` : '0 6px 18px rgba(0,0,0,0.75)'}}>{w}</span>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
// posisi atas blok callout per beat (default zona lantai bawah; beat yg objeknya rendah dipindah ke atas di bawah chip)
const CALLOUT_TOP: Record<number, number> = {23: 300, 31: 300};
export const CalloutView: React.FC = () => {
  const f = useCurrentFrame();
  const c = calloutAt(f);
  return c ? <CalloutText c={c} top={CALLOUT_TOP[c.beat] ?? 1290} /> : null;
};
