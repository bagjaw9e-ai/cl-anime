import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, H, W} from '../theme';
import {useSid} from '../components/Phone';

// Inti merah otak tengah (berdenyut)
export const MidCore: React.FC<{x?: number; y?: number; s?: number; rough?: boolean; intensity?: number}> = ({
  x = 540, y = 960, s = 1, rough = false, intensity = 1,
}) => {
  const f = useCurrentFrame();
  const id = useSid('core');
  const p = 1 + 0.08 * Math.sin(f * 0.35) + 0.04 * Math.sin(f * 0.9);
  return (
    <g transform={`translate(${x},${y}) scale(${s * p})`}>
      <defs>
        <radialGradient id={`${id}g`} cx="0.42" cy="0.38" r="0.65">
          <stop offset="0" stopColor="#FFB0B5" />
          <stop offset="0.4" stopColor={C.red2} />
          <stop offset="1" stopColor={C.red0} />
        </radialGradient>
        <filter id={`${id}b`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation={30} /></filter>
        <filter id={`${id}r`}>
          <feTurbulence type="fractalNoise" baseFrequency={0.04} numOctaves={2} seed={4} />
          <feDisplacementMap in="SourceGraphic" scale={18} />
        </filter>
      </defs>
      <circle r={170} fill={C.red2} opacity={0.45 * intensity} filter={`url(#${id}b)`} />
      <g filter={rough ? `url(#${id}r)` : undefined}>
        <path d="M -100 -10 C -104 -80 -30 -110 30 -96 C 96 -80 118 -10 96 46 C 72 104 -20 112 -70 76 C -96 56 -98 30 -100 -10 Z"
          fill={`url(#${id}g)`} />
      </g>
      <ellipse cx={-30} cy={-50} rx={34} ry={16} fill="#FFFFFF" opacity={0.3} transform="rotate(-20 -30 -50)" />
    </g>
  );
};

// Tekstur dinding batu/gua
export const CaveWall: React.FC = () => {
  const id = useSid('cave');
  return (
    <svg width={W} height={H} style={{position: 'absolute'}}>
      <defs>
        <filter id={`${id}n`}>
          <feTurbulence type="fractalNoise" baseFrequency={0.012} numOctaves={4} seed={7} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.3  0 0 0 0 0.18  0 0 0 1.1 -0.35" />
        </filter>
        <radialGradient id={`${id}v`} cx="0.5" cy="0.5" r="0.7">
          <stop offset="0" stopColor="#8A4E2E" />
          <stop offset="1" stopColor="#2A120C" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}v)`} />
      <rect width={W} height={H} filter={`url(#${id}n)`} opacity={0.8} />
    </svg>
  );
};
