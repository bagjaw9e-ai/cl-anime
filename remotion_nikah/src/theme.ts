// C = palet rig karakter (dipakai Character.tsx, jangan diubah). P = palet video promo (ref.mp4: navy/charcoal + glow amber).
export const C = {
  // base gelap (maroon, bukan hitam)
  base0: '#1A0B10',
  base1: '#2B0F17',
  base2: '#3D1420',
  // merah
  red0: '#8E1B2C',
  red1: '#C62F3E',
  red2: '#FF4D5A',
  // warm
  coral: '#E8735A',
  amber: '#F2A65A',
  gold: '#FFD166',
  // lembut
  rose: '#B85C7A',
  plum: '#5E2A4A',
  cream: '#F5E6DA',
  // harapan
  teal: '#4FB3A9',
  mint: '#8FD3C8',
  // karakter
  skin: '#F1C9A5',
  skinShade: '#D9A882',
  hair: '#17141C',
  navy: '#1F2747',
  navyLight: '#2E3963',
  navyDark: '#151B33',
  chino: '#253055',
  wood: '#9A6440',
  woodLight: '#C08458',
  white: '#FFFFFF',
  ink: '#2A1620',
};

export const W = 1080;
export const H = 1920;
export const FPS = 30;

// Safe area: 260px bawah & 80px kiri/kanan kosong (UI TikTok/Reels). Zona objek y 450-1200, lantai (horizon) y 1200.
export const SAFE = {top: 200, bottom: H - 260, left: 80, right: W - 80};
export const FLOOR = 1200;

export const P = {
  navyTop: '#0E1320', navyMid: '#1B2233', navyFloor: '#0A0E16',
  brownTop: '#17120E', brownMid: '#2A2018', brownFloor: '#110D0A',
  amber: '#FFB23F', yellow: '#FFD166', warm: '#FFF4E0', gray: '#5A6170', grayLight: '#8A90A0', grayDark: '#3A404C',
  red: '#FF3B3B', subYellow: '#F5FF3B', dimRed: '#B3262E',
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

export const hexToRgb = (h: string): number[] => {
  const m = /^rgba?\(([^)]+)\)/.exec(h.trim());
  if (m) return m[1].split(',').slice(0, 3).map((v) => parseFloat(v));
  const n = parseInt(h.trim().slice(1, 7), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const hex2 = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
// campur dua warna (hex atau rgb()) -> selalu hex #rrggbb (aman dicampur ulang & diberi alpha hex)
export const mix = (a: string, b: string, t: number) => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const r = A.map((v, i) => lerp(v, B[i], clamp(t)));
  return `#${hex2(r[0])}${hex2(r[1])}${hex2(r[2])}`;
};

// deterministic pseudo-random
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// ---- video nikah: garis lantai dunia (kaki karakter) + sistem TONE background (berubah halus tiap zoom, tempat tetap) ----
export const FLOOR_Y = 1250;
export type Tone = {top: string; mid: string; floor: string; furn: string; furnHi: string; glow: string; accent: string};
export const mixTone = (a: Tone, b: Tone, t: number): Tone => ({
  top: mix(a.top, b.top, t), mid: mix(a.mid, b.mid, t), floor: mix(a.floor, b.floor, t), furn: mix(a.furn, b.furn, t),
  furnHi: mix(a.furnHi, b.furnHi, t), glow: mix(a.glow, b.glow, t), accent: mix(a.accent, b.accent, t),
});
