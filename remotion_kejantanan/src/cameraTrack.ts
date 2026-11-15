// Kamera virtual one-shot. Cam = titik world di tengah layar (x, y), zoom z, rotasi r (derajat, dutch tilt).
// Tiap gerakan: mulai frame f, durasi d (>= 12 frame), ease-in-out bezier. Di antara gerakan kamera diam
// (karakter & ilustrasi tetap hidup). Shake = guncangan kecil di momen dramatis.
import {Easing} from 'remotion';
import {beatF} from './timeline';

export type Cam = {x: number; y: number; z: number; r: number};
export type Move = {f: number; d: number; to: Partial<Cam>; kind: string; e?: (t: number) => number};

const B = (id: number, off = 0) => beatF(id) + off;
const IO = Easing.bezier(0.45, 0, 0.55, 1); // ease-in-out
const FAST = Easing.bezier(0.7, 0, 0.3, 1); // whip / punch
const M = {x: 0, y: -560, z: 1.0, r: 0}; // medium shot

export const CAM0: Cam = {x: 0, y: -500, z: 0.78, r: 0}; // wide shot pembuka

export const MOVES: Move[] = [
  // A
  {f: B(1, 4), d: 34, to: {x: 0, y: -640, z: 1.05}, kind: 'push-in'},
  {f: B(2, 2), d: 13, to: {x: 0, y: -1120, z: 1.65}, kind: 'quick zoom', e: FAST},
  {f: B(3), d: 30, to: {x: 270, y: -700, z: 1.3}, kind: 'pan'},
  {f: B(4), d: 22, to: M, kind: 'pull-out'},
  {f: B(5), d: 22, to: {x: 0, y: -160, z: 1.25}, kind: 'tilt-down'},
  // B
  {f: B(6), d: 24, to: {x: 0, y: -980, z: 1.25}, kind: 'tilt-up'},
  {f: B(7), d: 22, to: {x: 0, y: -820, z: 1.0}, kind: 'zoom-out'},
  {f: B(7, 50), d: 40, to: {x: 30, y: -860, z: 1.06}, kind: 'drift'},
  {f: B(8), d: 15, to: {x: -210, y: -1020, z: 1.45}, kind: 'push'},
  {f: B(9), d: 14, to: {x: 0, y: -1020, z: 1.45}, kind: 'pan'},
  {f: B(10), d: 14, to: {x: 210, y: -1020, z: 1.45}, kind: 'pan'},
  {f: B(11), d: 26, to: {x: 70, y: -660, z: 0.85}, kind: 'pull-out'},
  {f: B(12), d: 12, to: {x: 300, y: -650, z: 1.35}, kind: 'whip', e: FAST},
  {f: B(13), d: 12, to: {x: 240, y: -660, z: 1.7}, kind: 'punch-in', e: FAST},
  // C
  {f: B(14), d: 16, to: {x: 0, y: -800, z: 1.45}, kind: 'zoom'},
  {f: B(15), d: 16, to: {x: 40, y: -600, z: 1.6}, kind: 'tracking'},
  {f: B(15, 20), d: 30, to: {x: 70, y: -620, z: 1.6}, kind: 'drift'},
  {f: B(16), d: 26, to: {x: 0, y: -580, z: 1.0, r: -4}, kind: 'orbit'},
  {f: B(16, 30), d: 36, to: {r: 4}, kind: 'orbit'},
  {f: B(17), d: 20, to: {x: 0, y: -1020, z: 1.15, r: 0}, kind: 'tilt-up'},
  {f: B(17, 42), d: 30, to: {x: 40, y: -1060, z: 1.22}, kind: 'drift'},
  {f: B(18), d: 15, to: {x: 310, y: -640, z: 1.2}, kind: 'pan'},
  {f: B(19), d: 16, to: {x: 50, y: -500, z: 2.6}, kind: 'extreme zoom', e: FAST},
  {f: B(20), d: 14, to: {x: 0, y: -620, z: 0.95}, kind: 'pull-out', e: FAST},
  {f: B(21), d: 30, to: {x: 0, y: -720, z: 0.55}, kind: 'pull-out jauh'},
  // D
  {f: B(22), d: 22, to: {x: 0, y: -1100, z: 1.4}, kind: 'push-in'},
  {f: B(22, 40), d: 34, to: {x: 0, y: -1060, z: 1.5}, kind: 'drift'},
  {f: B(23), d: 16, to: {x: -300, y: -640, z: 1.25}, kind: 'pan'},
  {f: B(24), d: 36, to: {x: 300, y: -640, z: 1.25}, kind: 'pan lambat'},
  {f: B(24, 40), d: 36, to: {x: 300, y: -580, z: 1.32}, kind: 'drift'},
  {f: B(25), d: 16, to: {x: 300, y: -800, z: 1.25}, kind: 'tilt-up'},
  {f: B(26), d: 18, to: {x: 0, y: -580, z: 1.1}, kind: 'pan'},
  {f: B(27), d: 20, to: {x: -260, y: -620, z: 1.15}, kind: 'pan'},
  {f: B(27, 42), d: 36, to: {x: -80, y: -620, z: 1.1}, kind: 'pan'},
  {f: B(28), d: 16, to: {x: 0, y: -1060, z: 1.25}, kind: 'tilt-up'},
  {f: B(29), d: 12, to: {x: 0, y: -680, z: 1.3, r: -9}, kind: 'dutch tilt', e: FAST},
  {f: B(30), d: 16, to: {x: 90, y: -540, z: 1.05, r: 0}, kind: 'tracking'},
  {f: B(30, 30), d: 46, to: {x: -60, y: -560, z: 1.05}, kind: 'tracking'},
  // E
  {f: B(31), d: 24, to: {x: 0, y: -460, z: 0.74}, kind: 'pull-out'},
  {f: B(32), d: 26, to: {x: -110, y: -480, z: 0.88}, kind: 'pan'},
  {f: B(33), d: 34, to: {x: 0, y: -1060, z: 1.1}, kind: 'tilt-up'},
  {f: B(33, 36), d: 38, to: {x: 0, y: -1260, z: 1.1}, kind: 'tilt-up'},
  {f: B(34), d: 18, to: {x: -200, y: -540, z: 1.35}, kind: 'tracking'},
  {f: B(35), d: 18, to: {x: -60, y: -600, z: 1.1}, kind: 'pan'},
  {f: B(36), d: 14, to: {x: -300, y: -640, z: 1.4}, kind: 'zoom'},
  {f: B(37), d: 20, to: {x: 300, y: -640, z: 1.2}, kind: 'pan'},
  {f: B(37, 50), d: 50, to: {x: 260, y: -660, z: 1.3}, kind: 'drift'},
  {f: B(38), d: 14, to: {x: 0, y: -1060, z: 1.45}, kind: 'push-in', e: FAST},
  {f: B(39), d: 40, to: {x: 0, y: -480, z: 0.6}, kind: 'pull-out jauh'},
  // F
  {f: B(40), d: 22, to: {x: 0, y: -420, z: 1.2}, kind: 'hero low angle'},
  {f: B(41, 10), d: 14, to: {x: 380, y: -1000, z: 1.0}, kind: 'follow lemparan', e: FAST},
  {f: B(41, 26), d: 16, to: M, kind: 'balik'},
  {f: B(42, 4), d: 16, to: {x: -120, y: -600, z: 1.05}, kind: 'medium'},
  {f: B(43), d: 16, to: {x: 0, y: -1000, z: 1.15}, kind: 'tilt-up'},
  {f: B(44), d: 18, to: {x: 0, y: -1120, z: 1.05}, kind: 'tilt-up ke logo'},
  {f: B(45), d: 26, to: {x: 110, y: -760, z: 0.78}, kind: 'pull-out lebar'},
  {f: B(45, 50), d: 50, to: {x: 110, y: -790, z: 0.82}, kind: 'drift'},
  // END
  {f: B(46), d: 58, to: {x: 0, y: -1180, z: 1.25}, kind: 'push ke logo'},
];

export const SHAKES: Array<{f: number; d: number; amp: number}> = [
  {f: B(2, 6), d: 10, amp: 10},
  {f: B(13, 2), d: 12, amp: 14},
  {f: B(21, 4), d: 10, amp: 8},
  {f: B(29, 2), d: 22, amp: 12},
  {f: B(38, 2), d: 20, amp: 12},
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const camAt = (f: number): Cam => {
  let cur = {...CAM0};
  for (const m of MOVES) {
    if (f < m.f) break;
    const to = {...cur, ...m.to};
    const t = Math.min(1, (f - m.f) / m.d);
    const e = (m.e ?? IO)(t);
    cur = {x: lerp(cur.x, to.x, e), y: lerp(cur.y, to.y, e), z: lerp(cur.z, to.z, e), r: lerp(cur.r, to.r, e)};
    if (t < 1) break;
  }
  return cur;
};

const rnd = (s: number) => { const x = Math.sin(s * 12.9898) * 43758.5453; return x - Math.floor(x); };
export const shakeAt = (f: number) => {
  let dx = 0, dy = 0, dr = 0;
  for (const s of SHAKES) {
    const k = f - s.f;
    if (k >= 0 && k < s.d) {
      const a = s.amp * (1 - k / s.d);
      dx += (rnd(f * 1.7) - 0.5) * 2 * a; dy += (rnd(f * 2.3 + 4) - 0.5) * 2 * a; dr += (rnd(f * 3.1) - 0.5) * a * 0.12;
    }
  }
  return {dx, dy, dr};
};

// kecepatan kamera (px layar / frame) -> motion blur
export const camSpeed = (f: number) => {
  const a = camAt(f), b = camAt(f - 1);
  return Math.hypot((a.x - b.x) * a.z, (a.y - b.y) * a.z) + Math.abs(a.z - b.z) * 900 + Math.abs(a.r - b.r) * 20;
};
