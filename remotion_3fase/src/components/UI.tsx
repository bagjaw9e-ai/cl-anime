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
