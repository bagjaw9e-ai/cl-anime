import React from 'react';
import {C} from '../theme';
import {IllProps, Pill, FONT, Spark, backOut, bf, ramp, smooth} from './common';

const XS = [-210, 0, 210];
const Gift: React.FC = () => (
  <g>
    <rect x={-40} y={-26} width={80} height={62} rx={8} fill={C.coral} />
    <rect x={-46} y={-40} width={92} height={22} rx={6} fill={C.red1} />
    <rect x={-7} y={-40} width={14} height={76} fill={C.gold} />
    <path d="M 0 -40 C -30 -70 -40 -40 0 -40 C 40 -40 30 -70 0 -40 Z" fill={C.gold} />
    <Pill x={30} y={-58} text="NEW" bg={C.teal} size={18} r={12} />
  </g>
);
const SmileHeart: React.FC = () => (
  <g>
    <path d="M 0 40 C -60 0 -52 -42 -26 -46 C -10 -48 -2 -38 0 -30 C 2 -38 10 -48 26 -46 C 52 -42 60 0 0 40 Z" fill={C.red2} />
    <circle cx={-14} cy={-12} r={5} fill={C.ink} /><circle cx={14} cy={-12} r={5} fill={C.ink} />
    <path d="M -14 4 Q 0 18 14 4" stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" />
  </g>
);
const Dna: React.FC<{t: number}> = ({t}) => (
  <g>
    {Array.from({length: 9}).map((_, i) => {
      const y = -44 + i * 11, ph = t * 0.15 + i * 0.7;
      const x1 = Math.sin(ph) * 30, x2 = -x1, front = Math.cos(ph) > 0;
      return (
        <g key={i}>
          <line x1={x1} y1={y} x2={x2} y2={y} stroke={C.cream} strokeWidth={3} opacity={0.6} />
          <circle cx={x1} cy={y} r={6} fill={front ? C.teal : '#3F8C85'} />
          <circle cx={x2} cy={y} r={6} fill={front ? C.mint : '#6FA9A0'} />
        </g>
      );
    })}
  </g>
);

// #7 tiga slot kosong + badge "3"; #8 kado NEW, #9 hati senyum, #10 DNA; #12 tersedot ke HP (kanan)
export const ThreeSlots: React.FC<IllProps> = ({t, f}) => {
  const fills = [bf(8, 4), bf(9, 4), bf(10, 4)];
  const suck = (i: number) => smooth(ramp(f, bf(12, 2 + i * 4), bf(12, 20 + i * 4)));
  const toPhone = {x: 340, y: 370}; // posisi HP relatif ke slot ini
  return (
    <g>
      {XS.map((x, i) => {
        const ap = backOut(ramp(t, i * 6, i * 6 + 10));
        return (
          <g key={i} transform={`translate(${x},0) scale(${ap})`} opacity={1 - suck(i)}>
            <circle r={66} fill="#2A1830" opacity={0.6} />
            <circle r={66} fill="none" stroke="#B9A6F0" strokeWidth={5} strokeDasharray="14 10" transform={`rotate(${t * 0.6})`} />
          </g>
        );
      })}
      <g transform={`translate(-275,-80) scale(${backOut(ramp(t, 18, 28))})`}>
        <circle r={36} fill={C.gold} />
        <text x={0} y={14} textAnchor="middle" fontSize={42} fontWeight={900} fill={C.ink} fontFamily={FONT}>3</text>
      </g>
      {[<Gift key="g" />, <SmileHeart key="h" />, <Dna key="d" t={t} />].map((el, i) => {
        if (f < fills[i]) return null;
        const p = backOut(ramp(f, fills[i], fills[i] + 10));
        const s = suck(i);
        const x = XS[i] + (toPhone.x - XS[i]) * s, y = toPhone.y * s - Math.sin(s * Math.PI) * 120;
        return (
          <g key={i} transform={`translate(${x},${y}) scale(${p * (1 - s * 0.75)}) rotate(${s * 360})`}>
            <circle r={58} fill={['#5A2E3A', '#5A2238', '#1F4A4A'][i]} opacity={0.85} />
            {el}
            {f - fills[i] < 14 && <Spark x={46} y={-46} s={0.9} c={C.cream} o={1 - (f - fills[i]) / 14} />}
          </g>
        );
      })}
    </g>
  );
};
