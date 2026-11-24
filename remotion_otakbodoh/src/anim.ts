import {Easing, interpolate, spring} from 'remotion';
import {rand} from './theme';

export const ease = (f: number, a: number, b: number, v0 = 0, v1 = 1, e = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
export const easeOut = (f: number, a: number, b: number, v0 = 0, v1 = 1) => ease(f, a, b, v0, v1, Easing.out(Easing.cubic));
export const easeIn = (f: number, a: number, b: number, v0 = 0, v1 = 1) => ease(f, a, b, v0, v1, Easing.in(Easing.cubic));
export const pop = (f: number, at: number, damping = 11, stiffness = 170) =>
  spring({frame: f - at, fps: 30, config: {damping, stiffness, mass: 0.6}});
export const wob = (f: number, sp = 0.1, amp = 1, ph = 0) => Math.sin(f * sp + ph) * amp;

// guncangan kamera: kembalikan [dx, dy]
export const shake = (f: number, at: number, dur = 12, amp = 18) => {
  const k = f - at;
  if (k < 0 || k > dur) return [0, 0];
  const d = (1 - k / dur) * amp;
  return [(rand(f * 1.7) - 0.5) * 2 * d, (rand(f * 2.3 + 5) - 0.5) * 2 * d];
};

// kamera: titik fokus (x,y) ke tengah frame, zoom s, rotasi r
export type Cam = {x?: number; y?: number; s?: number; r?: number; dx?: number; dy?: number};
export const camT = ({x = 540, y = 960, s = 1, r = 0, dx = 0, dy = 0}: Cam) =>
  `translate(${540 + dx},${960 + dy}) rotate(${r}) scale(${s}) translate(${-x},${-y})`;
