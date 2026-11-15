import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, mix} from '../theme';
import {useSid} from './Phone';

type XY = {x?: number; y?: number; s?: number; r?: number; opacity?: number};
const tf = ({x = 0, y = 0, s = 1, r = 0}: XY) => `translate(${x},${y}) rotate(${r}) scale(${s})`;

/* gear: n gigi, radius R */
export const Gear: React.FC<XY & {R?: number; n?: number; color?: string; hole?: string; rot?: number; rust?: number}> = ({
  R = 100, n = 10, color = C.gold, hole = C.plum, rot = 0, rust = 0, opacity = 1, ...p
}) => {
  const pts: string[] = [];
  const r1 = R * 0.8;
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const w = (Math.PI * 2) / n;
    const seq = [[a0, r1], [a0 + w * 0.12, R], [a0 + w * 0.42, R], [a0 + w * 0.54, r1]];
    for (const [a, r] of seq) pts.push(`${Math.cos(a) * r},${Math.sin(a) * r}`);
  }
  const col = mix(color, '#7A4A32', rust);
  return (
    <g transform={tf(p)} opacity={opacity}>
      <g transform={`rotate(${rot})`}>
        <polygon points={pts.join(' ')} fill={col} strokeLinejoin="round" stroke={col} strokeWidth={R * 0.06} />
        <circle r={R * 0.58} fill={mix(color, '#5C3424', rust)} opacity={0.35} />
        <circle r={R * 0.24} fill={hole} />
        {rust > 0 && [0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={Math.cos(i * 1.7) * R * 0.6} cy={Math.sin(i * 1.7) * R * 0.6} r={R * (0.08 + (i % 2) * 0.05)}
            fill="#5C2E1E" opacity={rust * 0.8} />
        ))}
      </g>
    </g>
  );
};

/* bohlam */
export const Bulb: React.FC<XY & {on?: number}> = ({on = 1, opacity = 1, ...p}) => {
  const id = useSid('bl');
  return (
    <g transform={tf(p)} opacity={opacity}>
      <defs>
        <filter id={`${id}f`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation={30} /></filter>
      </defs>
      <circle cx={0} cy={-10} r={130} fill={C.gold} opacity={on * 0.6} filter={`url(#${id}f)`} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        return (
          <line key={i} x1={Math.cos(a) * 95} y1={-10 + Math.sin(a) * 95} x2={Math.cos(a) * (115 + on * 30)}
            y2={-10 + Math.sin(a) * (115 + on * 30)} stroke={C.gold} strokeWidth={10} strokeLinecap="round" opacity={on} />
        );
      })}
      <path d="M -50 -20 C -50 -80 50 -80 50 -20 C 50 10 26 24 24 50 L -24 50 C -26 24 -50 10 -50 -20 Z"
        fill={mix('#6E5A4E', '#FFF1B8', on)} />
      <path d="M -12 44 L -12 14 M 12 44 L 12 14 M -12 14 C -12 4 -4 4 -4 14 C -4 24 4 24 4 14 C 4 4 12 4 12 14" stroke={mix('#4A3A30', C.amber, on)} strokeWidth={5} fill="none" strokeLinecap="round" />
      <rect x={-26} y={50} width={52} height={14} rx={5} fill={C.cream} opacity={0.85} />
      <rect x={-22} y={66} width={44} height={12} rx={5} fill="#B9A89A" />
      <ellipse cx={-22} cy={-36} rx={10} ry={18} fill="#FFFFFF" opacity={0.5} transform="rotate(25 -22 -36)" />
    </g>
  );
};

/* bidak catur sederhana (tanpa huruf) */
export const ChessPiece: React.FC<XY & {kind?: 'pawn' | 'king' | 'knight' | 'rook'; color?: string; shade?: string}> = ({
  kind = 'pawn', color = C.gold, shade = C.amber, opacity = 1, ...p
}) => (
  <g transform={tf(p)} opacity={opacity}>
    <ellipse cx={0} cy={0} rx={42} ry={12} fill={shade} />
    <path d="M -40 0 L -34 -18 L 34 -18 L 40 0 Z" fill={shade} />
    {kind === 'pawn' && (
      <>
        <path d="M -24 -18 C -20 -50 -12 -60 -10 -70 L 10 -70 C 12 -60 20 -50 24 -18 Z" fill={color} />
        <circle cx={0} cy={-84} r={22} fill={color} />
      </>
    )}
    {kind === 'rook' && (
      <>
        <path d="M -24 -18 L -20 -86 L 20 -86 L 24 -18 Z" fill={color} />
        <path d="M -30 -86 L -30 -110 L -18 -110 L -18 -100 L -6 -100 L -6 -110 L 6 -110 L 6 -100 L 18 -100 L 18 -110 L 30 -110 L 30 -86 Z" fill={color} />
      </>
    )}
    {kind === 'king' && (
      <>
        <path d="M -26 -18 C -20 -70 -16 -90 -24 -110 L 24 -110 C 16 -90 20 -70 26 -18 Z" fill={color} />
        <ellipse cx={0} cy={-114} rx={28} ry={10} fill={shade} />
        <rect x={-6} y={-152} width={12} height={36} rx={4} fill={color} />
        <rect x={-17} y={-142} width={34} height={11} rx={4} fill={color} />
      </>
    )}
    {kind === 'knight' && (
      <path d="M -26 -18 C -24 -50 -30 -62 -18 -86 C -8 -108 18 -118 30 -104 L 36 -84 C 30 -78 20 -80 12 -76 C 18 -60 26 -40 26 -18 Z"
        fill={color} />
    )}
    <ellipse cx={-10} cy={-60} rx={5} ry={20} fill="#FFFFFF" opacity={0.25} />
  </g>
);

/* matahari */
export const Sun: React.FC<XY & {color?: string; glow?: number}> = ({color = C.gold, glow = 1, opacity = 1, ...p}) => {
  const id = useSid('sun');
  return (
    <g transform={tf(p)} opacity={opacity}>
      <defs><filter id={`${id}f`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation={40} /></filter></defs>
      <circle r={190} fill={color} opacity={0.55 * glow} filter={`url(#${id}f)`} />
      <circle r={95} fill={color} />
      <circle r={70} fill="#FFF3C4" opacity={0.6} />
    </g>
  );
};

/* bendera tanpa tulisan */
export const Flag: React.FC<XY & {color?: string}> = ({color = C.gold, ...p}) => {
  const f = useCurrentFrame();
  const w = Math.sin(f * 0.25) * 8;
  return (
    <g transform={tf(p)}>
      <rect x={-4} y={-150} width={8} height={150} rx={3} fill={C.cream} />
      <path d={`M 4 -148 Q 40 ${-160 + w} 80 ${-140 + w * 0.5} Q 60 -120 80 ${-96 - w * 0.5} Q 40 ${-110 - w} 4 -100 Z`} fill={color} />
    </g>
  );
};

/* mata rantai */
export const ChainLink: React.FC<XY & {color?: string; w?: number; h?: number; sw?: number}> = ({
  color = '#8A7A86', w = 70, h = 40, sw = 14, opacity = 1, ...p
}) => (
  <g transform={tf(p)} opacity={opacity}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill="none" stroke={color} strokeWidth={sw} />
    <rect x={-w / 2 + 4} y={-h / 2 - 2} width={w * 0.5} height={sw * 0.35} rx={3} fill="#FFFFFF" opacity={0.3} />
  </g>
);

/* petir */
export const Bolt: React.FC<XY & {color?: string}> = ({color = C.gold, opacity = 1, ...p}) => {
  const id = useSid('bo');
  return (
    <g transform={tf(p)} opacity={opacity}>
      <defs><filter id={`${id}f`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation={18} /></filter></defs>
      <path d="M 20 -200 L -60 10 L 0 10 L -30 200 L 80 -40 L 14 -40 L 60 -200 Z" fill={color} filter={`url(#${id}f)`} opacity={0.8} />
      <path d="M 20 -200 L -60 10 L 0 10 L -30 200 L 80 -40 L 14 -40 L 60 -200 Z" fill={color} />
      <path d="M 26 -180 L -40 0 L 6 0" stroke="#FFFBEA" strokeWidth={8} fill="none" strokeLinejoin="round" />
    </g>
  );
};

/* pedal rem (ikon) */
export const Pedal: React.FC<XY & {press?: number; broken?: number}> = ({press = 0, broken = 0, opacity = 1, ...p}) => (
  <g transform={tf(p)} opacity={opacity}>
    <circle r={150} fill={C.base1} stroke={C.amber} strokeWidth={10} />
    {/* tuas */}
    <g transform={`rotate(${press * 22 + broken * 50} 0 -110)`}>
      <rect x={-10} y={-110} width={20} height={110} rx={8} fill="#9A8C96" />
      <g transform={`translate(${broken * 40},${broken * 60}) rotate(${broken * 70})`}>
        <rect x={-62} y={-4} width={124} height={66} rx={16} fill={C.coral} />
        {[0, 1, 2].map((i) => <rect key={i} x={-46} y={8 + i * 18} width={92} height={7} rx={3} fill={C.red0} opacity={0.6} />)}
      </g>
    </g>
  </g>
);

/* asap/uap */
export const Puff: React.FC<XY & {color?: string}> = ({color = C.cream, opacity = 1, ...p}) => (
  <g transform={tf(p)} opacity={opacity}>
    <circle cx={-22} cy={4} r={26} fill={color} />
    <circle cx={10} cy={-12} r={32} fill={color} />
    <circle cx={34} cy={8} r={22} fill={color} />
    <ellipse cx={4} cy={14} rx={44} ry={16} fill={color} />
  </g>
);

/* panah */
export const Arrow: React.FC<XY & {color?: string; len?: number}> = ({color = C.red2, len = 160, opacity = 1, ...p}) => (
  <g transform={tf(p)} opacity={opacity}>
    <rect x={-22} y={-len / 2} width={44} height={len - 40} rx={14} fill={color} />
    <path d={`M -62 ${len / 2 - 70} L 0 ${len / 2 + 10} L 62 ${len / 2 - 70} Z`} fill={color} strokeLinejoin="round" stroke={color} strokeWidth={14} />
  </g>
);

/* bintang */
export const Star: React.FC<XY & {color?: string}> = ({color = C.gold, opacity = 1, ...p}) => (
  <path transform={tf(p)} opacity={opacity} fill={color} stroke={color} strokeWidth={6} strokeLinejoin="round"
    d="M 0 -30 L 9 -10 L 30 -8 L 14 7 L 19 28 L 0 17 L -19 28 L -14 7 L -30 -8 L -9 -10 Z" />
);

/* sparkle 4 sudut */
export const Sparkle: React.FC<XY & {color?: string}> = ({color = C.gold, opacity = 1, ...p}) => (
  <path transform={tf(p)} opacity={opacity} fill={color}
    d="M 0 -30 C 4 -8 8 -4 30 0 C 8 4 4 8 0 30 C -4 8 -8 4 -30 0 C -8 -4 -4 -8 0 -30 Z" />
);

/* monitor kosong (tanpa teks) */
export const Monitor: React.FC<XY & {w?: number; h?: number; screen?: string; children?: React.ReactNode; frame?: string; stand?: boolean}> = ({
  w = 420, h = 300, screen = '#1E0D16', frame = C.cream, children, stand = true, opacity = 1, ...p
}) => {
  const id = useSid('mon');
  return (
    <g transform={tf(p)} opacity={opacity}>
      {stand && <rect x={-20} y={h / 2} width={40} height={60} fill={mix(frame, '#000000', 0.3)} />}
      {stand && <rect x={-80} y={h / 2 + 56} width={160} height={16} rx={8} fill={mix(frame, '#000000', 0.3)} />}
      <rect x={-w / 2 - 18} y={-h / 2 - 18} width={w + 36} height={h + 36} rx={26} fill={frame} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill={screen} />
      <clipPath id={`${id}c`}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} /></clipPath>
      <g clipPath={`url(#${id}c)`}>{children}</g>
    </g>
  );
};

/* lantai sederhana */
export const Floor: React.FC<{y?: number; color?: string; glow?: string}> = ({y = 1560, color = C.base1, glow = C.red1}) => (
  <g>
    <rect x={-400} y={y} width={1880} height={900} fill={color} />
    <ellipse cx={540} cy={y} rx={520} ry={26} fill={glow} opacity={0.25} />
  </g>
);

/* neuron: badan sel + dendrit */
export const Neuron: React.FC<XY & {color?: string; glow?: number}> = ({color = C.teal, glow = 0.5, opacity = 1, ...p}) => {
  const id = useSid('nr');
  return (
    <g transform={tf(p)} opacity={opacity}>
      <defs><filter id={`${id}f`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation={16} /></filter></defs>
      <circle r={80} fill={color} opacity={glow * 0.5} filter={`url(#${id}f)`} />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2 + 0.4;
        const L = 70 + (i % 2) * 20;
        return (
          <path key={i} d={`M 0 0 Q ${Math.cos(a + 0.3) * L * 0.6} ${Math.sin(a + 0.3) * L * 0.6} ${Math.cos(a) * L} ${Math.sin(a) * L}`}
            stroke={color} strokeWidth={10} strokeLinecap="round" fill="none" />
        );
      })}
      <circle r={36} fill={color} />
      <circle r={16} fill={C.cream} opacity={0.75} />
    </g>
  );
};
