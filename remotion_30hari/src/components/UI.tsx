import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONT} from '../fonts';
import {FPS_T, PHASES, WORDS, phaseAt} from '../timeline';
import {CALLOUTS, Callout, calloutAt, chunkAt} from '../subtitles';

const backOut = (v: number) => { const c = 1.7, x = Math.min(1, Math.max(0, v)) - 1; return 1 + (c + 1) * x * x * x + c * x * x; };

/* Label fase (chip atas, y 140-260): kotak warna kecil + pill gelap, ala label tier referensi. */
export const PhaseLabel: React.FC<{phase?: number}> = ({phase}) => {
  const f = useCurrentFrame();
  const ph = phase !== undefined ? {...PHASES[phase], from: -100} : phaseAt(f);
  const k = backOut((f - ph.from) / 10);
  const w = ph.label.length * 30 + 150;
  return (
    <g transform={`translate(540,200) scale(${0.6 + 0.4 * k})`} opacity={Math.min(1, (f - ph.from + 1) / 4)}>
      <rect x={-w / 2} y={-44} width={w} height={88} rx={26} fill="#1A1220" opacity={0.86} />
      <rect x={-w / 2 + 12} y={-32} width={96} height={64} rx={16} fill={ph.color} />
      <text x={-w / 2 + 60} y={ph.num.length > 1 ? 15 : 18} textAnchor="middle" fontSize={ph.num.length > 1 ? 40 : 48} fontWeight={800} fill="#1A1220" fontFamily={FONT}>{ph.num}</text>
      <text x={-w / 2 + 128} y={14} fontSize={40} fontWeight={800} fill="#FFFFFF" fontFamily={FONT} letterSpacing={1}>{ph.label}</text>
    </g>
  );
};

/* Subtitle karaoke 3 kata (pusat y 1380). Kata aktif kuning neon #F5FF3B + glow + scale 1.08. */
export const Subtitle: React.FC = () => {
  const f = useCurrentFrame();
  if (calloutAt(f)) return null; // callout tampil -> subtitle disembunyikan
  const ch = chunkAt(f);
  if (!ch) return null;
  const t = f / FPS_T;
  if (t > ch.e + 0.9) return null;
  const k = Math.min(1, (f - Math.round(ch.s * FPS_T)) / 4);
  const sc = 0.9 + 0.1 * k;
  const words = ch.words.map((i) => WORDS[i]);
  return (
    <g transform={`translate(540,1380) scale(${sc})`}>
      <text textAnchor="middle" y={26} fontSize={76} fontWeight={800} fontFamily={FONT}>
        {words.map((w, i) => {
          const active = t >= w.s - 0.03 && t < w.e + 0.05;
          return (
            <tspan key={i} dx={i ? 22 : 0} fill={active ? '#F5FF3B' : '#FFFFFF'} stroke="#140A18" strokeWidth={6} paintOrder="stroke"
              style={{filter: active ? 'drop-shadow(0 0 14px rgba(245,255,59,0.75))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.55))',
                fontSize: active ? 82 : 76}}>{w.w}</tspan>
          );
        })}
      </text>
    </g>
  );
};

const Icon: React.FC<{k?: Callout['icon']; c: string}> = ({k, c}) => {
  if (!k) return null;
  const sw = {stroke: '#1A1220', strokeWidth: 9, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <g>
      <circle r={46} fill={c} />
      {k === 'cal' && <g><rect x={-24} y={-20} width={48} height={44} rx={8} {...sw} /><path d="M -24 -6 L 24 -6 M -12 -30 L -12 -16 M 12 -30 L 12 -16" {...sw} /></g>}
      {k === 'warn' && <g><path d="M 0 -28 L 28 22 L -28 22 Z" {...sw} /><path d="M 0 -8 L 0 6" {...sw} /><circle cy={15} r={3} fill="#1A1220" /></g>}
      {k === 'up' && <path d="M -22 18 L 0 -22 L 22 18 M 0 -22 L 0 26" {...sw} />}
      {k === 'flat' && <path d="M -30 0 L -12 0 L -4 -18 L 4 18 L 12 0 L 30 0" {...sw} />}
      {k === 'drop' && <path d="M 0 -28 C 18 -4 22 8 22 14 C 22 28 -22 28 -22 14 C -22 8 -18 -4 0 -28 Z" {...sw} />}
      {k === 'brain' && <path d="M -24 8 C -34 -14 -10 -30 0 -18 C 10 -30 34 -14 24 8 C 22 24 -22 24 -24 8 Z M 0 -18 L 0 22" {...sw} />}
      {k === 'flag' && <path d="M -16 28 L -16 -28 L 22 -18 L -16 -6" {...sw} />}
      {k === 'check' && <path d="M -22 0 L -6 16 L 24 -16" {...sw} />}
      {k === 'link' && <g transform="rotate(-45)"><rect x={-30} y={-12} width={34} height={24} rx={12} {...sw} /><rect x={-4} y={-12} width={34} height={24} rx={12} {...sw} /></g>}
    </g>
  );
};

/* CALLOUT: teks besar ala poster/badge, slam + shake kecil. Posisi: ruang kosong atas (y≈360) atau zona subtitle. */
export const CalloutView: React.FC = () => {
  const f = useCurrentFrame();
  const c = calloutAt(f);
  if (!c) return null;
  const f0 = Math.round(c.s * FPS_T), f1 = Math.round(c.e * FPS_T);
  const k = f - f0;
  const slam = k < 8 ? 1.5 - 0.5 * backOut(k / 8) : 1;
  const out = Math.max(0, 1 - (f1 - f) / 5);
  const sh = k > 4 && k < 14 ? Math.sin(k * 3.3) * (14 - k) * 0.9 : 0;
  const y = c.pos === 'top' ? 360 : 1380;
  const fs = c.text.length > 14 ? 74 : c.text.length > 9 ? 88 : 104;
  const w = c.text.length * fs * 0.66 + (c.icon ? 150 : 70);
  return (
    <g transform={`translate(${540 + sh},${y}) rotate(-3) scale(${slam * (1 - out * 0.4)})`} opacity={Math.min(1, (k + 1) / 3) * (1 - out)}>
      <rect x={-w / 2} y={-fs * 0.85} width={w} height={fs * 1.7} rx={fs * 0.42} fill="#1A1220" opacity={0.9} />
      <rect x={-w / 2} y={-fs * 0.85} width={w} height={fs * 1.7} rx={fs * 0.42} fill="none" stroke={c.color} strokeWidth={6} />
      {c.icon && <g transform={`translate(${-w / 2 + 70},0) scale(${fs / 100})`}><Icon k={c.icon} c={c.color} /></g>}
      <text x={c.icon ? 48 : 0} y={fs * 0.35} textAnchor="middle" fontSize={fs} fontWeight={800} fill={c.color} fontFamily={FONT}
        stroke="#140A18" strokeWidth={4} paintOrder="stroke" style={{filter: `drop-shadow(0 0 16px ${c.color}88)`}}>{c.text}</text>
    </g>
  );
};
export {CALLOUTS};

/* Subtitle statis (untuk still/preview): kata ke-active disorot kuning. */
export const SubtitleStatic: React.FC<{words: string[]; active: number}> = ({words, active}) => (
  <g transform="translate(540,1380)">
    <text textAnchor="middle" y={26} fontSize={76} fontWeight={800} fontFamily={FONT}>
      {words.map((w, i) => (
        <tspan key={i} dx={i ? 22 : 0} fill={i === active ? '#F5FF3B' : '#FFFFFF'} stroke="#140A18" strokeWidth={6} paintOrder="stroke"
          style={{filter: i === active ? 'drop-shadow(0 0 14px rgba(245,255,59,0.75))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.55))', fontSize: i === active ? 82 : 76}}>{w}</tspan>
      ))}
    </text>
  </g>
);
