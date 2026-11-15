import React from 'react';
import {rand} from '../theme';
import {Brain} from '../components/Brain';
import {IllProps, Glow, ramp, smooth} from './common';

// #22 otak tertutup lapisan es/frost abu-biru (desensitisasi)
export const FrozenBrain: React.FC<IllProps> = ({t}) => {
  const fz = smooth(ramp(t, 4, 50));
  return (
    <g>
      <defs><Glow id="fzg" sd={16} /></defs>
      <ellipse rx={200} ry={140} fill="#B8D4E6" opacity={0.25 * fz} filter="url(#fzg)" />
      <Brain s={0.62} y={-6} opacity={0.95} pfc={0.3 * (1 - fz)} mid={0.6 * (1 - fz)} gray={fz * 0.8} baseTone="#B85C7A" />
      <ellipse cx={0} cy={-10} rx={175} ry={120} fill="#BFE0F2" opacity={0.28 * fz} />
      <ellipse cx={-40} cy={-80} rx={90} ry={22} fill="#FFFFFF" opacity={0.35 * fz} transform="rotate(-12)" />
      <g opacity={fz}>
        {Array.from({length: 18}).map((_, i) => {
          const x = -150 + rand(i) * 290, y = -110 + rand(i + 7) * 190, s = 0.6 + rand(i + 3) * 0.9;
          return <path key={i} d="M 0 -26 L 18 -6 L 10 22 L -14 20 L -20 -4 Z" fill="#E4F2FA" opacity={0.32}
            transform={`translate(${x},${y}) rotate(${rand(i + 2) * 180}) scale(${s * fz})`} />;
        })}
        {Array.from({length: 8}).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <g key={i} transform={`translate(${Math.cos(a) * 190},${Math.sin(a) * 120}) rotate(${t * 2})`} opacity={0.8}>
            {[0, 60, 120].map((r) => <rect key={r} x={-1.5} y={-11} width={3} height={22} fill="#EAF4FA" transform={`rotate(${r})`} />)}
          </g>;
        })}
      </g>
    </g>
  );
};
