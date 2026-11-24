// Karakter sampingan SILUET: polos warna gelap/abu + rim light tipis, TANPA detail wajah.
// Proporsi mengikuti rig utama (kepala agak besar). (0,0) = tanah di tengah kaki. Selalu hidup: napas, sway, gestur.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {useSid} from './Phone';

export type SilType = 'man' | 'woman' | 'woman_hijab' | 'mother' | 'child' | 'friend';
export type SilPose = 'stand' | 'clap' | 'step_back' | 'hug_bag' | 'sit' | 'talk' | 'walk_away' | 'spill' | 'look';

const DIM: Record<SilType, {h: number; head: number; w: number; skirt: boolean; hijab: boolean; hair: boolean}> = {
  man: {h: 1, head: 1, w: 1, skirt: false, hijab: false, hair: false},
  friend: {h: 0.97, head: 1, w: 0.95, skirt: false, hijab: false, hair: false},
  woman: {h: 0.93, head: 0.95, w: 0.88, skirt: true, hijab: false, hair: true},
  woman_hijab: {h: 0.93, head: 0.98, w: 0.9, skirt: true, hijab: true, hair: false},
  mother: {h: 0.9, head: 0.98, w: 1.0, skirt: true, hijab: true, hair: false},
  child: {h: 0.68, head: 1.05, w: 0.8, skirt: false, hijab: false, hair: false},
};

export const Silhouette: React.FC<{
  x?: number; y?: number; scale?: number; type?: SilType; pose?: SilPose; fill?: string; rim?: string; rimOp?: number;
  dir?: 1 | -1; seed?: number; opacity?: number; t?: number;
}> = ({x = 0, y = 0, scale = 1, type = 'man', pose = 'stand', fill = '#2B3040', rim = '#FFD9A0', rimOp = 0.9, dir = 1, seed = 1, opacity = 1, t}) => {
  const fr = useCurrentFrame();
  const tt = (t ?? fr) / 30;
  const id = useSid('sil');
  const D = DIM[type];
  const breathe = Math.sin(tt * 2 * Math.PI * 0.3 + seed) * 2;
  const sway = Math.sin(tt * 2 * Math.PI * 0.2 + seed * 2) * 1.5;
  const H = 600 * D.h;                       // tinggi total (kaki -> ubun-ubun)
  const legH = H * 0.42, torsoH = H * 0.3, headR = 66 * D.head;
  const hipY = -legH, shY = hipY - torsoH + breathe, headY = shY - headR - 12;
  const W = 72 * D.w;
  let lean = sway;
  let armL = 12, armR = 12, forL = -10, forR = -10; // sudut lengan (0 = bawah), lengan bawah relatif
  if (pose === 'clap') { const c = Math.sin(tt * 2 * Math.PI * 3 + seed); armL = 40 + c * 6; armR = 40 + c * 6; forL = -110 - c * 14; forR = -110 - c * 14; }
  if (pose === 'step_back') { lean = -10 + sway; armL = 40; armR = 34; forL = -120; forR = -120; }
  if (pose === 'hug_bag') { lean = -6 + sway; armL = 24; armR = 24; forL = -130; forR = -126; }
  if (pose === 'talk') { const g = Math.sin(tt * 2 * Math.PI * 1.1 + seed); armL = 34 + g * 10; forL = -80 - g * 20; armR = 14; forR = -20; }
  if (pose === 'walk_away') { lean = 4 + sway; armL = 16 + Math.sin(tt * 6) * 14; armR = 16 - Math.sin(tt * 6) * 14; }
  if (pose === 'spill') { armL = 70; forL = -30; lean = 4; }
  if (pose === 'look') { armL = 10; armR = 10; forL = -20; forR = -20; }
  const sit = pose === 'sit';
  const step = pose === 'walk_away' ? Math.sin(tt * 6) * 16 : pose === 'step_back' ? 18 : 0;
  const rad = (d: number) => (d * Math.PI) / 180;
  const arm = (side: -1 | 1, a: number, b: number) => {
    const sx = side * (W - 6), sy = shY + 14;
    const a1 = rad(side * a), ex = sx + Math.sin(a1) * 92, ey = sy + Math.cos(a1) * 92;
    const a2 = rad(side * (a + b)), hx = ex + Math.sin(a2) * 84, hy = ey + Math.cos(a2) * 84;
    return <path d={`M ${sx} ${sy} L ${ex} ${ey} L ${hx} ${hy}`} stroke={fill} strokeWidth={34 * D.w} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
  };
  const legs = sit ? (
    <g>
      <rect x={-W + 4} y={hipY + legH * 0.35} width={W * 2 + 60} height={36} rx={18} fill={fill} />
      <rect x={W + 28} y={hipY + legH * 0.35} width={32} height={legH * 0.62} rx={16} fill={fill} />
      <rect x={-W + 10} y={hipY + legH * 0.35} width={32} height={legH * 0.62} rx={16} fill={fill} />
    </g>
  ) : D.skirt ? (
    <path d={`M ${-W + 4} ${shY + torsoH * 0.6} Q ${-W - 30} ${-legH * 0.4} ${-W - 30 - step * 0.3} -6 L ${W + 30} -6 Q ${W + 30} ${-legH * 0.4} ${W - 4} ${shY + torsoH * 0.6} Z`} fill={fill} />
  ) : (
    <g>
      <rect x={-W * 0.62 - 20 - step} y={hipY} width={42} height={legH} rx={20} fill={fill} />
      <rect x={W * 0.62 - 22 + step} y={hipY} width={42} height={legH} rx={20} fill={fill} />
    </g>
  );
  const sitDY = sit ? legH * 0.35 : 0;
  const body = (
    <g transform={`rotate(${lean} 0 ${hipY})`}>
      <g transform={`translate(0,${sitDY})`}>
        <path d={`M ${-W} ${shY + 10} Q ${-W - 8} ${shY + torsoH * 0.6} ${-W * 0.8} ${hipY + 10} L ${W * 0.8} ${hipY + 10} Q ${W + 8} ${shY + torsoH * 0.6} ${W} ${shY + 10} Q 0 ${shY - 14} ${-W} ${shY + 10} Z`} fill={fill} />
        {arm(-1, armR, forR)}
        {arm(1, armL, forL)}
        {pose === 'hug_bag' && <rect x={-46} y={shY + torsoH * 0.35} width={92} height={74} rx={18} fill={fill} stroke={rim} strokeOpacity={0.25} strokeWidth={3} />}
        <circle cx={0} cy={headY} r={headR} fill={fill} />
        {D.hijab && <path d={`M ${-headR - 10} ${headY - 6} Q ${-headR - 18} ${shY + torsoH * 0.5} ${-W * 0.9} ${shY + torsoH * 0.55} L ${W * 0.9} ${shY + torsoH * 0.55} Q ${headR + 18} ${shY + torsoH * 0.5} ${headR + 10} ${headY - 6} Q 0 ${headY - headR * 1.3} ${-headR - 10} ${headY - 6} Z`} fill={fill} />}
        {D.hair && <path d={`M ${-headR} ${headY} Q ${-headR - 16} ${headY + headR * 1.6} ${-headR * 0.4} ${shY + 30} L ${headR * 0.4} ${shY + 30} Q ${headR + 16} ${headY + headR * 1.6} ${headR} ${headY} Z`} fill={fill} />}
      </g>
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${scale * dir},${scale})`} opacity={opacity}>
      <defs>
        <filter id={`${id}r`} x="-30%" y="-20%" width="160%" height="140%" colorInterpolationFilters="sRGB">
          <feOffset in="SourceAlpha" dx={-5} dy={3} result="o" />
          <feComposite in="SourceAlpha" in2="o" operator="out" result="e" />
          <feGaussianBlur in="e" stdDeviation={1.4} result="eb" />
          <feFlood floodColor={rim} floodOpacity={rimOp} />
          <feComposite in2="eb" operator="in" result="r" />
          <feGaussianBlur in="r" stdDeviation={5} result="rg" />
          <feMerge><feMergeNode in="rg" /><feMergeNode in="SourceGraphic" /><feMergeNode in="r" /></feMerge>
        </filter>
      </defs>
      <ellipse cx={0} cy={4} rx={W + 30} ry={12} fill="#000" opacity={0.3} />
      <g filter={`url(#${id}r)`}>{legs}{body}</g>
    </g>
  );
};
