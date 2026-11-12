import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, mix} from '../theme';
import {Stage} from '../components/Stage';
import {Character} from '../components/Character';
import {Floor} from '../components/Props';
import {SceneProps} from './types';

// Time-lapse: matahari-bulan gantian cepat, HP glow berulang di kamar.
export const S23: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const P = 22;
  const ph = (f % P) / P;
  const day = Math.sin(ph * Math.PI * 2) * 0.5 + 0.5;
  const arc = (f % (P / 2)) / (P / 2);
  const isSun = ph < 0.5;
  const sky = mix(C.plum, C.coral, day);
  return (
    <Stage bg={{top: mix(C.base2, '#6A2E3A', day), bottom: C.base0, glow: C.red2, glowX: 700, glowY: 1050, glowOp: 0.45 * (1 - day) + 0.1}}
      particles={{n: 14, color: C.rose, color2: C.amber, opacity: 0.3}}>
      <g transform="translate(290,700)">
        <rect x={-170} y={-210} width={340} height={400} rx={20} fill={C.plum} />
        <clipPath id="s23w"><rect x={-150} y={-190} width={300} height={360} rx={10} /></clipPath>
        <g clipPath="url(#s23w)">
          <rect x={-150} y={-190} width={300} height={360} fill={sky} />
          <circle cx={-150 + arc * 300} cy={60 - Math.sin(arc * Math.PI) * 200} r={44} fill={isSun ? C.gold : C.cream} />
          {!isSun && <circle cx={-132 + arc * 300} cy={46 - Math.sin(arc * Math.PI) * 200} r={38} fill={sky} />}
          <path d="M -150 130 Q -60 70 20 120 Q 90 80 150 110 L 150 170 L -150 170 Z" fill="#3B1A36" />
        </g>
        <rect x={-4} y={-190} width={8} height={360} fill={C.plum} />
      </g>
      {/* jam dinding tanpa angka */}
      <g transform="translate(800,520)">
        <circle r={90} fill={C.cream} />
        <circle r={74} fill="#F7EDE4" />
        <line x1={0} y1={0} x2={Math.sin(f * 0.6) * 60} y2={-Math.cos(f * 0.6) * 60} stroke={C.plum} strokeWidth={8} strokeLinecap="round" />
        <line x1={0} y1={0} x2={Math.sin(f * 0.05) * 40} y2={-Math.cos(f * 0.05) * 40} stroke={C.red1} strokeWidth={12} strokeLinecap="round" />
        <circle r={10} fill={C.plum} />
      </g>
      <Floor y={1600} glow={C.red2} />
      <Character x={680} y={1600} scale={1.3} pose="holding_phone" expression="dazed" rim id="s23" />
    </Stage>
  );
};
