import React from 'react';
import {C} from '../theme';
import {Neuron} from '../components/Props';
import {IllProps, Glow, ramp, smooth} from './common';

// #43 buku panduan bercahaya teal dengan ikon neuron, terbuka pelan
export const GuideBook: React.FC<IllProps> = ({t}) => {
  const open = smooth(ramp(t, 6, 24));
  return (
    <g transform={`translate(0,${Math.sin(t * 0.1) * 8})`}>
      <defs><Glow id="gbg" sd={26} /></defs>
      <ellipse rx={230} ry={170} fill={C.teal} opacity={0.35 + open * 0.2} filter="url(#gbg)" />
      {open > 0.1 && Array.from({length: 7}).map((_, i) => (
        <path key={i} d="M 0 -20 L -16 -260 L 16 -260 Z" fill={C.mint} opacity={0.18 * open} transform={`rotate(${(i - 3) * 16})`} />
      ))}
      {/* halaman terbuka di belakang sampul */}
      <path d={`M 0 -110 C ${-60 - open * 60} -130 ${-140 - open * 20} -120 ${-150 - open * 20} -110 L ${-150 - open * 20} 110 C -110 100 -50 100 0 120 Z`} fill={C.cream} opacity={open} />
      <g transform={`scale(${1 - open * 0.15},1)`}>
        <rect x={-10} y={-120} width={170} height={240} rx={16} fill={C.teal} />
        <rect x={-10} y={-120} width={22} height={240} rx={8} fill="#3F8C85" />
        <g transform="translate(78,-10) scale(0.7)"><Neuron color={C.cream} glow={0.6} /></g>
        <rect x={30} y={70} width={100} height={12} rx={6} fill={C.mint} opacity={0.7} />
      </g>
    </g>
  );
};
