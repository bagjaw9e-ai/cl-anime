import React, {useId} from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';

export const useSid = (p: string) => p + useId().replace(/[^a-zA-Z0-9]/g, '');

export const Heart: React.FC<{x?: number; y?: number; s?: number; fill?: string; opacity?: number}> = ({
  x = 0, y = 0, s = 1, fill = C.red2, opacity = 1,
}) => (
  <path transform={`translate(${x},${y}) scale(${s})`} opacity={opacity} fill={fill}
    d="M 0 14 C -26 -4 -24 -24 -12 -26 C -5 -27 -1 -22 0 -18 C 1 -22 5 -27 12 -26 C 24 -24 26 -4 0 14 Z" />
);

/**
 * HP: layar hanya glow merah/pink yang di-blur, TANPA konten apa pun.
 * back=true -> HP dilihat dari depan tapi kecil (dipegang). thin -> 0..1 dilihat dari samping (lembaran tipis).
 */
export const PhoneBody: React.FC<{
  w?: number; h?: number; glow?: number; color?: string; heart?: number; back?: boolean;
  thin?: number; cardboard?: number;
}> = ({w = 220, h = 420, glow = 1, color = C.red2, heart = 0, thin = 0, cardboard = 0}) => {
  const f = useCurrentFrame();
  const id = useSid('ph');
  const flick = 0.85 + 0.1 * Math.sin(f * 0.37) + 0.05 * Math.sin(f * 1.3);
  const r = Math.min(w, h) * 0.16;
  const sx = 1 - thin * 0.94;
  return (
    <g transform={`scale(${sx},1)`}>
      <defs>
        <filter id={`${id}b`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation={Math.max(w, h) * 0.08} />
        </filter>
        <radialGradient id={`${id}g`} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#FFB3C1" />
          <stop offset="0.45" stopColor={color} />
          <stop offset="1" stopColor={C.red0} />
        </radialGradient>
      </defs>
      {/* glow luar */}
      <rect x={-w * 0.62} y={-h * 0.6} width={w * 1.24} height={h * 1.2} rx={r * 2} fill={color}
        opacity={0.55 * glow * flick} filter={`url(#${id}b)`} />
      {/* bodi */}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={r} fill={cardboard > 0 ? '#9C6B45' : '#1B1218'} />
      {/* layar glow blur */}
      <rect x={-w / 2 + w * 0.07} y={-h / 2 + w * 0.07} width={w * 0.86} height={h - w * 0.14} rx={r * 0.7}
        fill={`url(#${id}g)`} opacity={(0.25 + 0.75 * glow * flick) * (1 - cardboard)} />
      <rect x={-w * 0.25} y={-h * 0.25} width={w * 0.5} height={h * 0.5} rx={w * 0.2} fill="#FFD0DA"
        opacity={0.55 * glow * flick * (1 - cardboard)} filter={`url(#${id}b)`} />
      {heart > 0 && <Heart s={(w / 120) * (0.9 + 0.1 * Math.sin(f * 0.3))} fill={C.cream} opacity={heart * 0.95} />}
      {/* notch */}
      <rect x={-w * 0.12} y={-h / 2 + w * 0.03} width={w * 0.24} height={w * 0.03} rx={w * 0.015} fill="#0D080B"
        opacity={1 - cardboard} />
      {cardboard > 0 && (
        <g opacity={cardboard}>
          <path d={`M ${-w * 0.35} ${-h * 0.3} L ${w * 0.3} ${-h * 0.1} M ${-w * 0.3} ${h * 0.1} L ${w * 0.35} ${h * 0.28}`}
            stroke="#7A5033" strokeWidth={w * 0.02} />
        </g>
      )}
    </g>
  );
};
