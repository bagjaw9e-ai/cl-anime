import React from 'react';
import {Img, staticFile} from 'remotion';
import {C} from '../theme';
import {Brain} from '../components/Brain';
import {Neuron} from '../components/Props';
import {neonLevel} from '../components/NeonLogo';
import {IP, Pill, Spark, ramp, smooth} from './common';

// #46 buku panduan neuroplasticity bercahaya teal dengan ikon neuron
export const GuideBook: React.FC<IP> = ({t}) => {
  const open = smooth(ramp(t, 4, 20));
  return (
    <g>
      <defs><filter id="gbk"><feGaussianBlur stdDeviation={26} /></filter></defs>
      <ellipse rx={220} ry={160} fill={C.teal} opacity={0.3 + open * 0.25} filter="url(#gbk)" />
      {open > 0.2 && Array.from({length: 7}).map((_, i) => <path key={i} d="M 0 -20 L -16 -250 L 16 -250 Z" fill={C.mint} opacity={0.2 * open} transform={`rotate(${(i - 3) * 16})`} />)}
      <path d={`M 0 -110 C ${-60 - open * 60} -130 ${-140 - open * 20} -120 ${-150 - open * 20} -110 L ${-150 - open * 20} 110 C -110 100 -50 100 0 120 Z`} fill={C.cream} opacity={open} />
      <g transform={`scale(${1 - open * 0.15},1)`}>
        <rect x={-10} y={-120} width={170} height={240} rx={16} fill={C.teal} />
        <rect x={-10} y={-120} width={22} height={240} rx={8} fill="#3F8C85" />
        <g transform="translate(78,-10) scale(0.7)"><Neuron color={C.cream} glow={0.6} /></g>
      </g>
    </g>
  );
};

// #47 jejak kaki nyasar di labirin vs peta yang jelas
export const MazeVsMap: React.FC<IP> = ({t}) => (
  <g>
    <g transform="translate(-140,0)">
      <rect x={-110} y={-110} width={220} height={220} rx={16} fill="#3A2A30" />
      <path d="M -90 -90 L -90 40 L -30 40 M -50 -90 L -50 0 L 30 0 L 30 -60 M 70 -90 L 70 90 M -90 90 L 30 90 L 30 50" stroke="#C9B8AC" strokeWidth={10} fill="none" strokeLinecap="round" />
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={-70 + ((i * 37 + t * 2) % 120)} cy={-60 + Math.sin(i * 2 + t * 0.1) * 60} r={7} fill="#FF4D5A" opacity={0.7} />)}
      <circle cx={0} cy={0} r={130} fill="none" stroke="#E0263A" strokeWidth={8} opacity={0.0} />
    </g>
    <g transform="translate(140,0)">
      <rect x={-110} y={-110} width={220} height={220} rx={16} fill="#F5E6DA" />
      <path d="M -80 80 C -40 20 0 60 20 0 S 60 -60 80 -80" stroke={C.teal} strokeWidth={10} fill="none" strokeDasharray="16 10" strokeLinecap="round" />
      <path d="M 80 -80 L 80 -40 M 80 -80 L 50 -66" stroke={C.teal} strokeWidth={10} strokeLinecap="round" />
      <circle cx={-80} cy={80} r={12} fill="#3CC27A" />
    </g>
    <Pill x={140} y={150} text="PETA" bg={C.teal} size={24} />
  </g>
);

// #48 otak retak, retakan nyala emas lalu menyatu (kintsugi)
export const BrainKintsugi: React.FC<IP> = ({t}) => {
  const heal = smooth(ramp(t, 8, 44));
  return (
    <g>
      <defs><filter id="bkg"><feGaussianBlur stdDeviation={22} /></filter></defs>
      <ellipse rx={210} ry={150} fill={C.gold} opacity={0.15 + heal * 0.25} filter="url(#bkg)" />
      <Brain s={0.66} pfc={0.4 + heal * 0.6} mid={0.25} crack={1} heal={heal} />
      {heal > 0.3 && heal < 0.95 && [[-80, -60], [40, -20], [-30, 40]].map(([x, y], i) => <Spark key={i} x={x} y={y} s={0.6} c="#FFF3C4" />)}
    </g>
  );
};

// #49 logo PMO SAVIOR neon nyala (flicker 3x lalu stabil) — gambar sudah di-key (hitam -> transparan)
export const LogoNeon: React.FC<IP & {w?: number; f0?: number}> = ({t, w = 640}) => {
  const lv = neonLevel(t);
  const pulse = 0.5 + 0.5 * Math.sin(t * 0.16);
  const h = (w * 339) / 498;
  return (
    <g>
      <defs><filter id="lng"><feGaussianBlur stdDeviation={40} /></filter></defs>
      <ellipse rx={w * 0.55} ry={h * 0.55} fill="#FF2D37" opacity={(0.2 + 0.1 * pulse) * lv} filter="url(#lng)" />
      <foreignObject x={-w / 2} y={-h / 2} width={w} height={h}>
        <Img src={staticFile('pmo_savior.png')} style={{width: w, height: h, opacity: Math.min(1, 0.1 + lv),
          filter: `brightness(${Math.min(1, 0.2 + lv * 0.8)}) drop-shadow(0 0 ${10 + 10 * pulse * lv}px rgba(255,40,50,${0.45 * lv}))`}} />
      </foreignObject>
    </g>
  );
};
