// Palet: mood dari public/color_ref.jpg (gelap, maroon, glow merah) — diperkaya.
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

// Safe area: 200px atas/bawah, 80px kiri/kanan
export const SAFE = {top: 200, bottom: H - 200, left: 80, right: W - 80};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

export const hexToRgb = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export const mix = (a: string, b: string, t: number) => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const r = A.map((v, i) => Math.round(lerp(v, B[i], clamp(t))));
  return `rgb(${r[0]},${r[1]},${r[2]})`;
};

// deterministic pseudo-random
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
