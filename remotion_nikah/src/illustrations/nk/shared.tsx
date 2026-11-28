// Ilustrasi BARU video "nikah dengan pecandu" — elemen bersama yang dipakai rig (props pose) DAN scene.
// Semua dinamis (pakai t = frame). (0,0) = pusat elemen.
import React from 'react';
import {rand} from '../../theme';
import {useSid} from '../../components/Phone';

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

/* ---------- HP desain baru: bodi tipis, pulau kamera bulat, badge pill "18+" melayang, mosaik pink + sensor bar ---------- */
export const HandsetNk: React.FC<{t: number; w?: number; h?: number; on?: number; back?: boolean; badge?: number; color?: string; tilt?: number}> = ({
  t, w = 120, h = 230, on = 1, back = false, badge = 1, color = '#FF4FA8', tilt = 0,
}) => {
  const id = useSid('hs');
  const r = w * 0.16, sw = w * 0.86, sh = h * 0.88;
  const flick = 0.85 + 0.15 * Math.sin(t * 0.9) * Math.sin(t * 0.37);
  const cols = 5, rows = 8, cw = sw / cols, ch = sh * 0.62 / rows;
  return (
    <g transform={`rotate(${tilt})`}>
      {on > 0 && <ellipse cx={0} cy={0} rx={w * 1.25} ry={h * 0.85} fill={color} opacity={0.18 * on * flick} />}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={r} fill="#14151B" stroke="#454857" strokeWidth={w * 0.035} />
      {back ? (
        <g>
          <circle cx={-w * 0.2} cy={-h * 0.33} r={w * 0.17} fill="#22242C" stroke="#55596A" strokeWidth={w * 0.025} />
          <circle cx={-w * 0.2} cy={-h * 0.33} r={w * 0.08} fill="#0A0B10" />
          <circle cx={-w * 0.18} cy={-h * 0.35} r={w * 0.025} fill="#8A90A0" />
          <circle cx={0} cy={h * 0.08} r={w * 0.07} fill="#2A2C36" />
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={r} fill="none" stroke={color} strokeWidth={w * 0.04} opacity={0.55 * on * flick} />
        </g>
      ) : (
        <g>
          <defs>
            <clipPath id={`${id}c`}><rect x={-sw / 2} y={-sh / 2} width={sw} height={sh} rx={r * 0.7} /></clipPath>
            <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3A0F2E" /><stop offset="1" stopColor="#1A0716" />
            </linearGradient>
          </defs>
          <rect x={-sw / 2} y={-sh / 2} width={sw} height={sh} rx={r * 0.7} fill={`url(#${id}g)`} />
          <g clipPath={`url(#${id}c)`} opacity={on}>
            {/* mosaik siluet kepala-bahu (blur ter-pixelate) */}
            {Array.from({length: rows}).map((_, j) => Array.from({length: cols}).map((__, i) => {
              const cx = -sw / 2 + (i + 0.5) * cw, cy = -sh * 0.28 + j * ch;
              const head = Math.hypot((cx) / (sw * 0.22), (cy + sh * 0.1) / (sh * 0.13)) < 1;
              const sh2 = cy > sh * 0.02 && Math.abs(cx) < sw * (0.18 + (cy - sh * 0.02) / sh * 0.9);
              const a = head || sh2 ? 0.55 + 0.4 * rand(i * 7 + j * 13 + Math.floor(t / 6)) : 0.12 + 0.1 * rand(i + j * 3);
              return <rect key={`${i}-${j}`} x={cx - cw / 2 + 0.5} y={cy - ch / 2 + 0.5} width={cw - 1} height={ch - 1} fill={head || sh2 ? '#FF7BC0' : '#7A2A5E'} opacity={a * flick} />;
            }))}
            {/* sensor bar */}
            <rect x={-sw / 2} y={-sh * 0.13} width={sw} height={sh * 0.1} fill="#050507" />
            <rect x={-sw / 2} y={sh * 0.16} width={sw} height={sh * 0.07} fill="#050507" opacity={0.85} />
            {/* garis kilau scan */}
            <rect x={-sw / 2} y={((t * 3) % (sh * 1.4)) - sh * 0.7} width={sw} height={sh * 0.05} fill="#FFFFFF" opacity={0.12} />
          </g>
          <rect x={-w * 0.12} y={-h / 2 + h * 0.035} width={w * 0.24} height={h * 0.03} rx={h * 0.015} fill="#0A0A0E" />
        </g>
      )}
      {badge > 0 && (
        <g transform={`translate(${w * 0.36},${-h * 0.5 - w * 0.08 + Math.sin(t * 0.2) * w * 0.04}) scale(${badge * (1 + 0.06 * Math.sin(t * 0.3))})`}>
          <rect x={-w * 0.3} y={-w * 0.15} width={w * 0.6} height={w * 0.3} rx={w * 0.15} fill="#E8203A" stroke="#FFFFFF" strokeWidth={w * 0.025} />
          <text x={0} y={w * 0.075} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={w * 0.21} fill="#FFFFFF">18+</text>
        </g>
      )}
    </g>
  );
};

/* ---------- RUMAH KARTU (house of cards): 2 tingkat kartu remi bersandar. wob = goyang, collapse 0..1 = runtuh -> debu ---------- */
type Card = {x: number; y: number; r: number; flat?: boolean};
const CARDS: Card[] = [
  // tingkat bawah: 3 pasang kartu bersandar (segitiga)
  {x: -78, y: 0, r: 18}, {x: -52, y: 0, r: -18}, {x: -13, y: 0, r: 18}, {x: 13, y: 0, r: -18}, {x: 52, y: 0, r: 18}, {x: 78, y: 0, r: -18},
  // kartu mendatar
  {x: -46, y: -34, r: 90, flat: true}, {x: 46, y: -34, r: 90, flat: true},
  // tingkat atas: 2 pasang
  {x: -46, y: -70, r: 18}, {x: -20, y: -70, r: -18}, {x: 20, y: -70, r: 18}, {x: 46, y: -70, r: -18},
  {x: 0, y: -104, r: 90, flat: true},
  // puncak: 1 pasang
  {x: -13, y: -140, r: 18}, {x: 13, y: -140, r: -18},
];
export const CardHouse: React.FC<{t: number; s?: number; wob?: number; collapse?: number; glow?: number}> = ({t, s = 1, wob = 0, collapse = 0, glow = 0.6}) => {
  const k = clamp(collapse);
  return (
    <g transform={`scale(${s})`}>
      {glow > 0 && <ellipse cx={0} cy={-70} rx={170} ry={150} fill="#FFD9A0" opacity={0.16 * glow * (1 - k)} />}
      {CARDS.map((c, i) => {
        const lvl = c.y < -100 ? 2 : c.y < -50 ? 1 : 0;
        const sway = wob * Math.sin(t * 0.32 + lvl * 0.7) * (lvl + 1) * 2.2;
        const dir = c.x < 0 ? -1 : 1;
        const kk = clamp((k - lvl * 0.08) / 0.75);
        const fall = kk * kk;
        const x = c.x + sway * 1.6 + dir * fall * (50 + rand(i) * 70) + Math.sin(i) * fall * 20;
        const y = c.y + fall * (-c.y + 6 + rand(i * 3) * 10);
        const rot = c.r + sway + dir * fall * (70 + rand(i * 5) * 50);
        const op = 1 - clamp((k - 0.78) / 0.22);
        return (
          <g key={i} transform={`translate(${x},${y - 32}) rotate(${rot})`} opacity={op}>
            <rect x={-20} y={-32} width={40} height={64} rx={5} fill={c.flat ? '#F3EEE4' : '#FBF8F1'} stroke="#C9BFAE" strokeWidth={2} />
            <rect x={-15} y={-27} width={30} height={54} rx={3} fill="none" stroke={i % 2 ? '#C62F3E' : '#2A2830'} strokeWidth={1.5} opacity={0.6} />
            {i % 3 === 0 ? (
              <path d="M 0 -9 C -9 -18 -16 -4 0 8 C 16 -4 9 -18 0 -9 Z" fill="#C62F3E" />
            ) : i % 3 === 1 ? (
              <path d="M 0 -11 L 8 0 L 0 11 L -8 0 Z" fill="#C62F3E" />
            ) : (
              <path d="M 0 -11 C 10 -2 10 6 0 4 C -10 6 -10 -2 0 -11 Z M -3 4 L 3 4 L 4 11 L -4 11 Z" fill="#2A2830" />
            )}
          </g>
        );
      })}
      {/* debu saat runtuh */}
      {k > 0.55 && Array.from({length: 26}).map((_, i) => {
        const d = clamp((k - 0.55) / 0.45);
        const a = rand(i * 2.3) * Math.PI * 2, rr = 30 + rand(i * 1.7) * 140;
        return <circle key={`d${i}`} cx={Math.cos(a) * rr * d} cy={-30 - rand(i) * 80 * d - d * 40} r={2 + rand(i * 9) * 4}
          fill="#E8DCC6" opacity={(1 - d) * 0.8} />;
      })}
    </g>
  );
};

/* ---------- cahaya hati di dada (bola cahaya berbentuk hati, utuh, berdenyut) ---------- */
export const HeartOrb: React.FC<{t: number; s?: number; op?: number}> = ({t, s = 1, op = 1}) => {
  const p = 1 + 0.08 * Math.sin(t * 0.25);
  return (
    <g transform={`scale(${s * p})`} opacity={op}>
      <circle r={70} fill="#FF7A9A" opacity={0.18} />
      <circle r={44} fill="#FFB3C4" opacity={0.25} />
      <path d="M 0 -8 C -12 -30 -44 -24 -40 2 C -38 20 -14 34 0 46 C 14 34 38 20 40 2 C 44 -24 12 -30 0 -8 Z" transform="translate(0,-14) scale(0.62)"
        fill="#FFD6DE" stroke="#FF6F91" strokeWidth={4} />
      <path d="M -14 -22 Q -20 -16 -18 -8" stroke="#FFFFFF" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.8} />
    </g>
  );
};

/* ---------- kerikil (kata-kata kasar dalam bentuk batu) ---------- */
export const Pebble: React.FC<{s?: number; seed?: number}> = ({s = 1, seed = 1}) => {
  const pts = Array.from({length: 7}).map((_, i) => {
    const a = (i / 7) * Math.PI * 2, r = 12 * (0.75 + rand(seed * 7 + i) * 0.4);
    return `${Math.cos(a) * r * 1.2},${Math.sin(a) * r}`;
  }).join(' ');
  return (
    <g transform={`scale(${s})`}>
      <polygon points={pts} fill="#7C7884" stroke="#4E4A56" strokeWidth={2} strokeLinejoin="round" />
      <path d="M -6 -4 L 2 -6" stroke="#B9B4C2" strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
};
