import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, rand} from '../theme';
import {easeOut, shake} from '../anim';
import {Stage} from '../components/Stage';
import {Brain} from '../components/Brain';
import {Monitor} from '../components/Props';
import {SceneProps} from './types';

// Dua scan berdampingan: kiri depan emas, kanan depan gelap. Lampu alert + glitch (SFX).
const Beacon: React.FC<{on: number; f: number}> = ({on, f}) => (
  <g transform="translate(540,330)">
    <rect x={-70} y={40} width={140} height={34} rx={10} fill="#3A2A30" />
    <path d="M -56 40 C -56 -40 56 -40 56 40 Z" fill={on > 0.5 ? C.red2 : C.red0} />
    {on > 0.5 && (
      <>
        <circle cx={0} cy={10} r={150} fill={C.red2} opacity={0.25} />
        <path d={`M 0 10 L ${Math.cos(f * 0.5) * 520} ${10 + Math.sin(f * 0.5) * 120} L ${Math.cos(f * 0.5 + 0.35) * 520} ${10 + Math.sin(f * 0.5 + 0.35) * 120} Z`}
          fill={C.red2} opacity={0.25} />
      </>
    )}
    <ellipse cx={-18} cy={0} rx={10} ry={18} fill="#FFFFFF" opacity={0.4} />
  </g>
);

export const S07: React.FC<SceneProps> = ({b, hit}) => {
  const f = useCurrentFrame();
  const b1 = b[0] ?? 40;
  const inL = easeOut(f, 0, 12);
  const inR = easeOut(f, b1 - 6, b1 + 6);
  const alert = f >= hit;
  const blink = alert && Math.floor((f - hit) / 5) % 2 === 0 ? 1 : 0;
  const [dx, dy] = shake(f, hit, 14, 16);
  const glitch = f >= hit && f < hit + 14;
  const rightPanel = (ox = 0, oy = 0, tint?: string) => (
    <g transform={`translate(${ox},${oy})`}>
      <Monitor x={0} y={0} w={400} h={320} frame={tint ?? C.rose} screen="#1A0B10" stand={false}>
        <Brain s={0.8} y={20} pfc={0.02} mid={0.75} gray={0.25} />
      </Monitor>
    </g>
  );
  return (
    <Stage bg={{top: C.base2, bottom: C.base0, glow: alert ? C.red1 : C.plum, glowY: 900, glowOp: alert ? 0.35 + blink * 0.25 : 0.6}}
      particles={{n: 16, color: C.rose, color2: C.gold, opacity: 0.35}} cam={{dx, dy}}>
      <Beacon on={blink} f={f} />
      {/* kiri: sehat */}
      <g transform={`translate(${-500 + inL * 790},800)`}>
        <Monitor w={400} h={320} frame={C.cream} screen="#1A0B10" stand={false}>
          <Brain s={0.8} y={20} pfc={1} mid={0.3} />
        </Monitor>
        <circle cx={0} cy={260} r={36} fill={C.mint} />
        <path d="M -16 260 L -4 274 L 18 248" stroke={C.base1} strokeWidth={9} fill="none" strokeLinecap="round" />
      </g>
      {/* kanan: hypofrontality */}
      <g transform={`translate(${1580 - inR * 790},1310)`}>
        {glitch ? (
          <>
            <g opacity={0.6} style={{mixBlendMode: 'screen'}}>{rightPanel(-14, 0, C.red2)}</g>
            <g opacity={0.6} style={{mixBlendMode: 'screen'}}>{rightPanel(14, 0, C.teal)}</g>
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <g transform={`translate(${(rand(f * 3 + i) - 0.5) * 60},0)`}>
                  <clipPath id={`s7g${i}`}><rect x={-260} y={-180 + i * 90 + rand(f + i) * 30} width={520} height={26} /></clipPath>
                  <g clipPath={`url(#s7g${i})`}>{rightPanel()}</g>
                </g>
              </g>
            ))}
            {rightPanel()}
          </>
        ) : (
          rightPanel()
        )}
        <circle cx={0} cy={260} r={36} fill={C.red2} opacity={alert ? 1 : 0.4} />
        <path d="M -14 246 L 14 274 M 14 246 L -14 274" stroke={C.base1} strokeWidth={9} strokeLinecap="round" />
      </g>
    </Stage>
  );
};
