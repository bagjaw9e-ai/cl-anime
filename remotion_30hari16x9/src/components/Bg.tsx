import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, H, W, rand} from '../theme';
import {useSid} from './Phone';

// Latar gradasi + glow lembut. tones = [atas, bawah], glow = warna sumber cahaya
export const Backdrop: React.FC<{
  top?: string; bottom?: string; glow?: string; glowX?: number; glowY?: number; glowR?: number; glowOp?: number;
  floor?: number; floorColor?: string;
}> = ({
  top = C.base2, bottom = C.base0, glow = C.red1, glowX = 540, glowY = 820, glowR = 700, glowOp = 0.45,
  floor, floorColor = C.base1,
}) => {
  const id = useSid('bd');
  return (
    <svg width={W} height={H} style={{position: 'absolute'}}>
      <defs>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
        <radialGradient id={`${id}r`} cx={glowX} cy={glowY} r={glowR} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={glow} stopOpacity={glowOp} />
          <stop offset="1" stopColor={glow} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={floorColor} />
          <stop offset="1" stopColor={C.base0} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}l)`} />
      <rect width={W} height={H} fill={`url(#${id}r)`} />
      {floor !== undefined && (
        <>
          <rect x={0} y={floor} width={W} height={H - floor} fill={`url(#${id}f)`} />
          <ellipse cx={glowX} cy={floor} rx={420} ry={34} fill={glow} opacity={glowOp * 0.4} />
        </>
      )}
    </svg>
  );
};

// Partikel melayang
export const Particles: React.FC<{n?: number; color?: string; color2?: string; seed?: number; speed?: number; size?: number; opacity?: number}> = ({
  n = 40, color = C.coral, color2 = C.gold, seed = 3, speed = 1, size = 1, opacity = 0.7,
}) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{position: 'absolute'}}>
      {Array.from({length: n}).map((_, i) => {
        const x0 = rand(seed + i) * W;
        const y0 = rand(seed + i * 3.3) * H;
        const sp = (0.4 + rand(seed + i * 7.7)) * speed;
        const yy = ((y0 - f * sp * 1.6) % H + H) % H;
        const xx = x0 + Math.sin(f * 0.03 * sp + i) * 22;
        const r = (1.5 + rand(seed + i * 1.9) * 4) * size;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(f * 0.05 + i));
        return <circle key={i} cx={xx} cy={yy} r={r} fill={i % 3 ? color : color2} opacity={opacity * tw} />;
      })}
    </svg>
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.75}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 75% 60% at 50% 48%, rgba(0,0,0,0) 45%, rgba(10,2,5,${strength}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

// grain halus 3%
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.03}) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{position: 'absolute', opacity, mixBlendMode: 'overlay'}}>
      <filter id="grainF">
        <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} seed={f % 30} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={W} height={H} filter="url(#grainF)" />
    </svg>
  );
};
