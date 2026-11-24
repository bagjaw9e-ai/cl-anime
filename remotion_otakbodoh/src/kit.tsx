// Toolkit animasi: tween keyframe, kemunculan elemen (pop overshoot ala ref_2 / glow fade ala ref_1), kamera.
import React from 'react';
import {Easing, interpolate} from 'remotion';
import {clamp, rand} from './theme';
import {BEATS} from './timeline';

export const bf = (id: number, off = 0) => BEATS[id - 1].f0 + off; // frame awal beat
export const be = (id: number, off = 0) => BEATS[id - 1].f1 + off; // frame akhir beat
const EIO = Easing.inOut(Easing.cubic);
export const ease = (f: number, a: number, b: number, v0 = 0, v1 = 1, e = EIO) =>
  interpolate(f, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
// keyframe angka: [[frame, nilai], ...] dengan ease in-out antar key
export const kp = (f: number, keys: Array<[number, number]>) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (f <= keys[i][0]) return ease(f, keys[i - 1][0], keys[i][0], keys[i - 1][1], keys[i][1]);
  return keys[keys.length - 1][1];
};
export const backOut = (v: number) => { const c = 1.7, x = clamp(v) - 1; return 1 + (c + 1) * x * x * x + c * x * x; };
export const ramp = (f: number, a: number, b: number) => clamp((f - a) / Math.max(1e-6, b - a));
export const sm = (v: number) => v * v * (3 - 2 * v);

// elemen muncul di frame a, hilang di frame b. kind: pop (overshoot 0→1.1→1), glow (fade + skala halus), slide
export const Appear: React.FC<{f: number; a: number; b?: number; x?: number; y?: number; s?: number; kind?: 'pop' | 'glow' | 'rise'; out?: number; children: React.ReactNode}> = ({
  f, a, b = 1e9, x = 0, y = 0, s = 1, kind = 'pop', out = 6, children,
}) => {
  if (f < a - 1 || f > b + out) return null;
  const kin = kind === 'pop' ? backOut((f - a) / 9) : sm(ramp(f, a, a + 16));
  const kout = 1 - sm(ramp(f, b, b + out));
  const sc = kind === 'pop' ? 0.2 + 0.8 * kin : kind === 'glow' ? 0.94 + 0.06 * kin : 1;
  const dy = kind === 'rise' ? (1 - kin) * 60 : 0;
  return (
    <g transform={`translate(${x},${y + dy}) scale(${s * sc * (0.9 + 0.1 * kout)})`} opacity={clamp(kind === 'pop' ? (f - a + 1) / 4 : kin) * kout}>{children}</g>
  );
};

// kamera: titik (x,y) dunia ke tengah frame (540, cy) dengan zoom s, rotasi r, shake
export type Cam = {x: number; y: number; s: number; r?: number};
export const camT = (c: Cam, cy = 860) => `translate(540,${cy}) rotate(${c.r ?? 0}) scale(${c.s}) translate(${-c.x},${-c.y})`;
export const camKeys = (f: number, keys: Array<[number, number, number, number]>): Cam => ({
  x: kp(f, keys.map((k) => [k[0], k[1]] as [number, number])),
  y: kp(f, keys.map((k) => [k[0], k[2]] as [number, number])),
  s: kp(f, keys.map((k) => [k[0], k[3]] as [number, number])),
});
export const shake = (f: number, at: number, dur = 12, amp = 14) => {
  const k = f - at;
  if (k < 0 || k > dur) return [0, 0];
  const d = (1 - k / dur) * amp;
  return [(rand(f * 1.7) - 0.5) * 2 * d, (rand(f * 2.3 + 5) - 0.5) * 2 * d];
};
