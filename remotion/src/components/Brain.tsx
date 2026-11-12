import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, mix} from '../theme';
import {useSid} from './Phone';

// Otak tampak samping, bagian depan (prefrontal) di KIRI.
export const CEREBRUM =
  'M -205 18 C -220 -62 -162 -146 -60 -156 C 22 -170 124 -154 184 -92 C 230 -46 226 30 180 62 ' +
  'C 154 80 124 82 98 80 C 72 98 30 96 8 82 C -22 108 -92 104 -134 84 C -178 72 -200 50 -205 18 Z';
export const PFC_CLIP_X = -78; // batas belakang area prefrontal
export const MID = {x: 22, y: 34};

const GYRI = [
  'M -170 -40 C -150 -70 -120 -60 -110 -90 C -100 -115 -70 -110 -60 -130',
  'M -185 10 C -160 0 -150 -30 -125 -25 C -100 -20 -100 -50 -80 -60',
  'M -150 60 C -130 40 -100 55 -90 30 C -80 5 -50 20 -40 -5',
  'M -30 -140 C -20 -110 10 -120 15 -90 C 20 -60 -10 -50 0 -20',
  'M 40 -150 C 50 -120 80 -125 75 -95 C 70 -70 100 -60 110 -40',
  'M 120 -130 C 120 -100 150 -100 160 -70 C 170 -45 150 -20 175 0',
  'M 30 -60 C 55 -50 70 -20 100 -20 C 130 -20 140 20 165 30',
  'M -60 70 C -40 50 -10 60 0 40 C 10 20 40 30 55 10',
  'M 60 60 C 80 45 100 55 120 40',
  'M -120 -110 C -100 -130 -80 -140 -50 -140',
];

export type BrainProps = {
  pfc?: number; // 0 = redup, 1 = emas menyala
  mid?: number; // 0..1 nyala merah otak tengah
  midScale?: number;
  gray?: number; // 0..1 abu-abu
  crack?: number; // 0..1 retakan muncul
  heal?: number; // 0..1 retakan jadi emas & menyatu
  opacity?: number;
  showMid?: boolean;
  pfcFlicker?: boolean;
  x?: number; y?: number; s?: number;
  baseTone?: string;
};

export const CRACKS = [
  'M -40 -160 L -30 -110 L -55 -70 L -35 -30 L -60 10 L -40 60 L -55 100',
  'M -35 -30 L 10 -40 L 40 -10 L 90 -20',
  'M -60 10 L -110 0 L -150 30',
  'M 120 -130 L 100 -80 L 130 -40',
];

export const Brain: React.FC<BrainProps> = ({
  pfc = 0.5, mid = 0.5, midScale = 1, gray = 0, crack = 0, heal = 0, opacity = 1,
  showMid = true, pfcFlicker = false, x = 0, y = 0, s = 1, baseTone,
}) => {
  const f = useCurrentFrame();
  const id = useSid('br');
  const base = baseTone ?? C.rose;
  const b0 = mix(base, '#8D8790', gray);
  const b1 = mix(C.plum, '#55505A', gray);
  const hl = mix(C.coral, '#B9B3B8', gray);
  let p = pfc * (1 - gray);
  if (pfcFlicker) p *= 0.75 + 0.25 * Math.sin(f * 0.9) * Math.sin(f * 0.31);
  const pulse = 1 + 0.06 * Math.sin(f * 0.25);
  const ms = midScale * pulse;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={opacity}>
      <defs>
        <clipPath id={`${id}c`}><path d={CEREBRUM} /></clipPath>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor={hl} />
          <stop offset="0.45" stopColor={b0} />
          <stop offset="1" stopColor={b1} />
        </linearGradient>
        <radialGradient id={`${id}pf`} cx="0.25" cy="0.45" r="0.75">
          <stop offset="0" stopColor="#FFF3C4" />
          <stop offset="0.4" stopColor={C.gold} />
          <stop offset="1" stopColor={C.amber} />
        </radialGradient>
        <radialGradient id={`${id}m`} cx="0.45" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#FF9AA2" />
          <stop offset="0.45" stopColor={C.red2} />
          <stop offset="1" stopColor={C.red0} />
        </radialGradient>
        <filter id={`${id}blur`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={22} />
        </filter>
        <filter id={`${id}blur2`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={8} />
        </filter>
      </defs>
      {/* glow emas depan */}
      <ellipse cx={-150} cy={-30} rx={120} ry={110} fill={C.gold} opacity={p * 0.55} filter={`url(#${id}blur)`} />
      {/* batang otak & cerebellum */}
      <path d="M 40 70 C 40 120 54 160 62 196 L 96 196 C 92 150 94 110 100 76 Z" fill={b1} />
      <g>
        <ellipse cx={130} cy={98} rx={74} ry={44} fill={mix(base, '#8D8790', gray)} />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M ${70 + i * 4} ${82 + i * 11} Q 130 ${70 + i * 15} 196 ${86 + i * 8}`}
            stroke={b1} strokeWidth={4} fill="none" opacity={0.55} />
        ))}
      </g>
      {/* cerebrum */}
      <path d={CEREBRUM} fill={`url(#${id}g)`} />
      <g clipPath={`url(#${id}c)`}>
        {/* area prefrontal */}
        <rect x={-260} y={-200} width={260 + PFC_CLIP_X} height={400} fill={`url(#${id}pf)`} opacity={0.15 + p * 0.85} />
        <rect x={-260} y={-200} width={260 + PFC_CLIP_X} height={400} fill="#3B2A35" opacity={(1 - pfc) * 0.55} />
        <path d={`M ${PFC_CLIP_X} -200 C ${PFC_CLIP_X + 14} -60 ${PFC_CLIP_X - 10} 40 ${PFC_CLIP_X + 6} 200`}
          stroke={b1} strokeWidth={5} fill="none" opacity={0.6} />
        {GYRI.map((d, i) => (
          <path key={i} d={d} stroke={b1} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.42} />
        ))}
        {GYRI.map((d, i) => (
          <path key={'h' + i} d={d} stroke="#FFFFFF" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.12}
            transform="translate(-3,-4)" />
        ))}
        {/* highlight atas */}
        <ellipse cx={-40} cy={-130} rx={150} ry={30} fill="#FFFFFF" opacity={0.1} />
      </g>
      {/* otak tengah */}
      {showMid && (
        <g transform={`translate(${MID.x},${MID.y}) scale(${ms})`}>
          <ellipse cx={0} cy={0} rx={70} ry={58} fill={C.red2} opacity={mid * 0.6} filter={`url(#${id}blur)`} />
          <path d="M -38 -6 C -40 -34 -8 -42 12 -34 C 38 -26 46 0 34 18 C 22 36 -12 38 -28 26 C -38 18 -37 8 -38 -6 Z"
            fill={`url(#${id}m)`} opacity={0.35 + mid * 0.65} />
          <ellipse cx={-6} cy={-14} rx={14} ry={7} fill="#FFFFFF" opacity={0.25 + mid * 0.2} />
        </g>
      )}
      {/* retakan */}
      {crack > 0 && (
        <g>
          {CRACKS.map((d, i) => (
            <g key={i}>
              <path d={d} stroke={mix('#1A0B10', C.gold, heal)} strokeWidth={9 - heal * 2} fill="none"
                strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray="1 1"
                strokeDashoffset={1 - crack} />
              {heal > 0 && (
                <path d={d} stroke={C.gold} strokeWidth={16} fill="none" opacity={heal * 0.6}
                  filter={`url(#${id}blur2)`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - crack} />
              )}
            </g>
          ))}
        </g>
      )}
    </g>
  );
};
