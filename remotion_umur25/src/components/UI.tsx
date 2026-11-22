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
            <g transform="scale(0.8)"><BrainIcon c={c} on={on} cracked={Math.max(on, crackAll)} /></g>
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

/* SUBTITLE POIN PENTING (KeyPointTitle): 110-150 px, maks 2 baris, kata aksen kuning/merah, selalu menempel ke ilustrasinya
   (posisi layar per beat: KEY_POS). Masuk KUAT & variatif sesuai gaya, keluar cepat 7 frame. */
const KEY_POS: Record<number, [number, number]> = {}; // beat -> [pusat x, pusat y] di layar; diisi lewat setKeyPos()
export const setKeyPos = (m: Record<number, [number, number]>) => Object.assign(KEY_POS, m);
const OUT_F = 7;
export const KeyPointTitle: React.FC<{c: Callout; cx: number; cy: number}> = ({c, cx, cy: cy0}) => {
  let cy = cy0;
  const f = useCurrentFrame();
  const f0 = Math.round(c.s * FPS_T), f1 = Math.round(c.e * FPS_T);
  const k = f - f0;
  const out = clamp((f1 - f) / OUT_F);
  const size = Math.min(148, ...c.lines.map((l) => (880 / measure(l, 100)) * 100));
  const lh = size * 1.0, H = lh * c.lines.length;
  cy = Math.max(cy, 290 + H / 2); // jangan menabrak zona header (y 140-260)
  let tr = '', op = clamp(k / 3), clip: string | undefined, extra: React.ReactNode = null, rot = 0;
  const outS = 0.85 + 0.15 * out;
  switch (c.style) {
    case 'slam': { const d = clamp(k / 7); tr = `translateY(${(1 - d * d) * -520}px)`; const sh = k >= 7 && k < 18 ? Math.sin(k * 2.6) * (18 - k) * 1.4 : 0; tr += ` translateX(${sh}px)`; op = clamp(k / 2); break; }
    case 'punch': { const p = clamp(k / 10); const sc = p < 0.6 ? (p / 0.6) * 1.25 : 1.25 - 0.25 * ((p - 0.6) / 0.4); tr = `scale(${sc})`; const sh = k >= 6 && k < 14 ? Math.sin(k * 3) * (14 - k) : 0; tr += ` translateX(${sh}px)`; op = clamp(k / 2); break; }
    case 'wipe': { const p = clamp(k / 14); clip = `inset(0 ${(1 - p * p * (3 - 2 * p)) * 100}% 0 0)`; op = 1; break; }
    case 'stamp': { const p = clamp(k / 6); tr = `scale(${2.4 - 1.4 * p * p})`; rot = -7; op = clamp(k / 2); const sh = k >= 6 && k < 14 ? Math.sin(k * 3.2) * (14 - k) * 1.2 : 0; tr += ` translate(${sh}px, ${sh * 0.4}px)`; break; }
    case 'ink': { const p = clamp(k / 12); op = clamp((k - 4) / 6); extra = <InkSplash p={p} w={900} h={H + 80} />; break; }
    case 'tear': { const p = clamp(k / 12); op = 1; extra = <PaperTear p={p} w={940} h={H + 60} />; break; }
    case 'neon': { op = k < 16 ? (Math.floor(k / 2) % 3 === 1 ? 0.25 : 1) * clamp(k / 2) : 0.94 + 0.06 * Math.sin(f * 0.4); break; }
    case 'sand': { op = clamp(k / 6); break; }
  }
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: cx - 500, width: 1000, top: cy - H / 2, height: H, transform: `scale(${outS})`, opacity: out}}>
        {extra && <div style={{position: 'absolute', left: 0, right: 0, top: -40, bottom: -40}}>{extra}</div>}
        <div style={{position: 'absolute', inset: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: `${lh}px`, letterSpacing: -1,
          transform: `${tr} rotate(${rot}deg)`, opacity: op, clipPath: clip, whiteSpace: 'nowrap'}}>
          {c.lines.map((l, li) => (
            <div key={li}>
              {l.split(' ').map((w, wi, arr) => {
                const acc = c.accent.includes(w);
                const col = acc ? c.color : '#FFFFFF';
                const isLastWord = li === c.lines.length - 1 && wi === arr.length - 1;
                const sandFade = c.style === 'sand' && isLastWord ? clamp(1 - (k - 30) / 50) : 1;
                return (
                  <span key={wi} style={{color: col, opacity: sandFade, marginRight: wi < arr.length - 1 ? size * 0.24 : 0, WebkitTextStroke: '3px rgba(10,10,20,0.9)', paintOrder: 'stroke fill',
                    textShadow: acc ? `0 0 ${size * 0.16}px ${col}, 0 0 ${size * 0.4}px ${col}88, 0 6px 16px rgba(0,0,0,0.7)` : '0 6px 18px rgba(0,0,0,0.75)'}}>{w}</span>
                );
              })}
            </div>
          ))}
        </div>
        {c.style === 'sand' && k > 26 && <SandGrains k={k - 26} cx={700} cy={H - lh / 2} />}
      </div>
    </AbsoluteFill>
  );
};
// cipratan tinta merah di belakang teks
const InkSplash: React.FC<{p: number; w: number; h: number}> = ({p, w, h}) => (
  <svg width={w + 100} height={h + 80} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <g transform={`translate(${(w + 100) / 2},${(h + 80) / 2})`}>
      {Array.from({length: 14}).map((_, i) => {
        const a = (i / 14) * Math.PI * 2 + i, r = (120 + (i % 4) * 70) * p;
        return <circle key={i} cx={Math.cos(a) * r * 1.6} cy={Math.sin(a) * r * 0.5} r={(30 + (i % 3) * 22) * Math.min(1, p * 1.6)} fill="#B0141E" opacity={0.85} />;
      })}
      <ellipse rx={w * 0.42 * Math.min(1, p * 1.4)} ry={h * 0.42 * Math.min(1, p * 1.4)} fill="#B0141E" opacity={0.9} />
    </g>
  </svg>
);
// kertas krem yang sobek & tergeser mengungkap teks
const PaperTear: React.FC<{p: number; w: number; h: number}> = ({p, w, h}) => {
  const jag = Array.from({length: 18}).map((_, i) => `${(w / 2) + (i % 2 ? 18 : -18)},${(i / 17) * h}`).join(' L ');
  const e = p * p * (3 - 2 * p);
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 30, top: 10, overflow: 'visible'}}>
      <rect x={0} y={0} width={w} height={h} rx={10} fill="#1A2A36" opacity={0.75 * Math.min(1, p * 3)} />
      <path d={`M 0 0 L ${jag} L 0 ${h} Z`} fill="#F2E8D4" transform={`translate(${-e * 620},${e * 40}) rotate(${-e * 10})`} opacity={1 - e * 0.8} />
      <path d={`M ${w} 0 L ${jag} L ${w} ${h} Z`} fill="#E8DCC4" transform={`translate(${e * 620},${-e * 30}) rotate(${e * 8})`} opacity={1 - e * 0.8} />
    </svg>
  );
};
// butiran pasir berjatuhan dari ujung teks (gaya sand)
const SandGrains: React.FC<{k: number; cx: number; cy: number}> = ({k, cx, cy}) => (
  <svg width={1000} height={600} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    {Array.from({length: 40}).map((_, i) => {
      const ph = ((k * 0.03 + (i * 0.618) % 1) % 1);
      return <circle key={i} cx={cx + ((i * 37) % 260) - 60 + ph * 20} cy={cy + ph * 300} r={3.5} fill="#E8C878" opacity={(1 - ph) * Math.min(1, k / 10)} />;
    })}
  </svg>
);
export const CalloutView: React.FC = () => {
  const f = useCurrentFrame();
  const c = calloutAt(f);
  if (!c) return null;
  const [cx, cy] = KEY_POS[c.beat] ?? [540, 380];
  return <KeyPointTitle c={c} cx={cx} cy={cy} />;
};
