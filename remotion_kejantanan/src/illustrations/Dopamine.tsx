import React from 'react';
import {C, rand} from '../theme';
import {Brain} from '../components/Brain';
import {IllProps, Pill, Glow, ramp} from './common';

// #14 otak menyemburkan partikel pink (air mancur) + meter "DOPAMIN" meluap
export const Dopamine: React.FC<IllProps> = ({t}) => {
  const lvl = Math.min(1.12, 0.25 + ramp(t, 4, 40) * 0.9);
  const H = 250;
  return (
    <g>
      <defs><Glow id="dpg" sd={16} /><clipPath id="dpc"><rect x={170} y={-130} width={64} height={H} rx={32} /></clipPath></defs>
      <ellipse cx={-30} cy={0} rx={190} ry={130} fill="#FF6F91" opacity={0.25} filter="url(#dpg)" />
      <Brain s={0.55} x={-30} y={20} pfc={0.2} mid={1} midScale={1.3} />
      {Array.from({length: 46}).map((_, i) => {
        const life = 34, ph = ((t + i * (life / 46)) % life) / life;
        const vx = (rand(i) - 0.5) * 9, vy = -15 - rand(i + 3) * 7;
        const k = ph * life;
        const x = -30 + vx * k, y = -70 + vy * k + 0.5 * 0.9 * k * k;
        return <circle key={i} cx={x} cy={y} r={4 + rand(i * 2) * 6} fill={i % 3 ? '#FF6F91' : '#FFB3C1'} opacity={(1 - ph) * 0.95} />;
      })}
      {/* meter tabung */}
      <rect x={170} y={-130} width={64} height={H} rx={32} fill="#2B0F17" stroke={C.cream} strokeWidth={6} />
      <g clipPath="url(#dpc)">
        <rect x={170} y={-130 + H * (1 - Math.min(1, lvl))} width={64} height={H} fill="#FF4D7A" />
        {Array.from({length: 6}).map((_, i) => <circle key={i} cx={185 + rand(i) * 34} cy={120 - ((t * 3 + i * 40) % H)} r={5} fill="#FFD0DA" opacity={0.7} />)}
      </g>
      {lvl > 1 && Array.from({length: 5}).map((_, i) => {
        const ph = ((t * 0.04 + i * 0.2) % 1);
        return <circle key={i} cx={202 + (i - 2) * 12 + Math.sin(ph * 6 + i) * 8} cy={-136 + ph * 160} r={8} fill="#FF4D7A" opacity={1 - ph} />;
      })}
      <Pill x={202} y={160} text="DOPAMIN" bg="#FF4D7A" size={24} />
    </g>
  );
};
