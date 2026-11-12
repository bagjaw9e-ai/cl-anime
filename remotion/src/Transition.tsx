import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {H, W} from './theme';

export type TT = 'cut' | 'whipL' | 'whipR' | 'zoom' | 'circle' | 'diamond' | 'slideUp';
export const TR = 9; // 8-10 frame

const e = (v: number) => interpolate(v, [0, 1], [0, 1], {easing: Easing.inOut(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// Bungkus scene: animasi masuk (enter) di TR frame pertama, keluar (exit = tipe transisi scene berikutnya) di TR frame terakhir.
export const TransitionLayer: React.FC<{enter: TT; exit?: TT; len: number; children: React.ReactNode}> = ({enter, exit, len, children}) => {
  const f = useCurrentFrame();
  let tx = 0, ty = 0, sc = 1, op = 1, blur = 0;
  let clip: string | undefined;
  const ein = e(f / TR);
  if (f < TR) {
    if (enter === 'whipL') { tx = (1 - ein) * W; blur = (1 - ein) * 28; }
    if (enter === 'whipR') { tx = -(1 - ein) * W; blur = (1 - ein) * 28; }
    if (enter === 'slideUp') { ty = (1 - ein) * H; blur = (1 - ein) * 20; }
    if (enter === 'zoom') { sc = 0.55 + 0.45 * ein; op = ein; }
    if (enter === 'circle') clip = `circle(${ein * 120}% at 50% 50%)`;
    if (enter === 'diamond') {
      const k = ein * 110;
      clip = `polygon(50% ${50 - k}%, ${50 + k}% 50%, 50% ${50 + k}%, ${50 - k}% 50%)`;
    }
  }
  if (exit && f >= len - TR) {
    const x = e((f - (len - TR)) / TR);
    if (exit === 'whipL') { tx = -x * W; blur = x * 28; }
    if (exit === 'whipR') { tx = x * W; blur = x * 28; }
    if (exit === 'slideUp') { ty = -x * H; blur = x * 20; }
    if (exit === 'zoom') { sc = 1 + 1.8 * x; op = 1 - x; }
  }
  return (
    <AbsoluteFill style={{
      transform: `translate(${tx}px,${ty}px) scale(${sc})`, opacity: op,
      filter: blur > 0.5 ? `blur(${blur}px)` : undefined, clipPath: clip,
    }}>
      {children}
    </AbsoluteFill>
  );
};
