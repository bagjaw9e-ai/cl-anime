import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT} from '../fonts';
import {FPS_T, WORDS, beatAt} from '../timeline';
import {Callout, calloutAt, chunkAt} from '../subtitles';

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const backOut = (v: number) => { const c = 1.6, x = clamp(v) - 1; return 1 + (c + 1) * x * x * x + c * x * x; };

// lebar teks Poppins 800 (canvas measureText; font sudah dimuat lewat delayRender di fonts.ts)
let ctx: CanvasRenderingContext2D | null = null;
const measure = (txt: string, size: number, ls = 0) => {
  if (typeof document === 'undefined') return txt.length * size * 0.7;
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  ctx!.font = `800 ${size}px Poppins`;
  return ctx!.measureText(txt).width + ls * txt.length;
};

/* Subtitle karaoke maks 3 kata, pusat y = subY (default 1330, boleh turun maks 1450 bila ada objek). */
// posisi subtitle per beat: default 1330, turun bila ada objek di area itu (maks 1450)
const SUB_Y: Record<number, number> = {5: 1370};
export const Subtitle: React.FC = () => {
  const f = useCurrentFrame();
  const subY = SUB_Y[beatAt(f).id] ?? 1330;
  if (calloutAt(f)) return null; // subtitle poin penting tampil -> subtitle 3 kata disembunyikan
  const ch = chunkAt(f);
  if (!ch) return null;
  const t = f / FPS_T;
  const k = (f - ch.s * FPS_T) / 5;
  const sc = 0.82 + 0.18 * backOut(k);
  let active = -1;
  ch.words.forEach((wi) => { if (WORDS[wi].s <= t + 0.02) active = wi; });
  if (t > WORDS[ch.words[ch.words.length - 1]].e + 0.15) active = -1;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 80, right: 80, top: subY - 60, height: 120, display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: 22, transform: `scale(${sc})`, opacity: clamp(k * 2), fontFamily: FONT, fontWeight: 800, fontSize: 72, letterSpacing: -0.5}}>
        {ch.words.map((wi) => {
          const on = wi === active;
          return (
            <span key={wi} style={{color: on ? '#F5FF3B' : '#FFFFFF', transform: `scale(${on ? 1.08 : 1})`, display: 'inline-block',
              textShadow: on ? '0 0 18px rgba(245,255,59,0.75), 0 0 42px rgba(245,255,59,0.35), 0 4px 10px rgba(0,0,0,0.6)' : '0 4px 14px rgba(0,0,0,0.65), 0 0 2px rgba(0,0,0,0.5)'}}>
              {WORDS[wi].w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* Subtitle POIN PENTING: teks besar (110-140px) bagian komposisi, putih + kata aksen bercahaya, nyala/slam pelan. */
export const CalloutText: React.FC<{c: Callout; y: number; maxSize?: number}> = ({c, y, maxSize = 120}) => {
  const f = useCurrentFrame();
  const f0 = Math.round(c.s * FPS_T), f1 = Math.round(c.e * FPS_T);
  const kin = (f - f0) / 9;
  const out = clamp((f1 - f) / 5);
  const size = Math.min(maxSize, ...c.lines.map((l) => (860 / measure(l, 100)) * 100));
  const lh = size * 1.02;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 80, right: 80, top: y, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: `${lh}px`,
        letterSpacing: -1, transform: `scale(${1.12 - 0.12 * clamp(kin)})`, opacity: clamp(kin * 1.6) * out}}>
        {c.lines.map((l, li) => {
          const dl = li * 4;
          const kk = clamp((f - f0 - dl) / 8);
          return (
            <div key={li} style={{whiteSpace: 'nowrap', opacity: kk, transform: `translateY(${(1 - kk) * 18}px)`}}>
              {l.split(' ').map((w, wi) => {
                const acc = c.accent.includes(w);
                const flick = acc ? (f - f0 < 12 ? (Math.floor((f - f0) / 2) % 2 ? 0.55 : 1) : 0.93 + 0.07 * Math.sin(f * 0.4)) : 1;
                const col = acc ? c.accentColor : '#FFFFFF';
                return (
                  <span key={wi} style={{color: col, opacity: flick, marginRight: wi < l.split(' ').length - 1 ? size * 0.25 : 0,
                    textShadow: acc ? `0 0 ${size * 0.18}px ${col}, 0 0 ${size * 0.45}px ${col}88, 0 6px 16px rgba(0,0,0,0.6)` : `0 0 ${size * 0.12}px rgba(255,244,224,0.45), 0 6px 18px rgba(0,0,0,0.7)`}}>
                    {w}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// callout aktif, posisi y (atas blok) per beat — di ruang kosong atas, tidak menutupi objek
const CALLOUT_Y: Record<number, number> = {1: 200, 4: 200, 7: 200, 9: 200};
export const CalloutView: React.FC = () => {
  const f = useCurrentFrame();
  const c = calloutAt(f);
  return c ? <CalloutText c={c} y={CALLOUT_Y[c.beat] ?? 230} /> : null;
};
