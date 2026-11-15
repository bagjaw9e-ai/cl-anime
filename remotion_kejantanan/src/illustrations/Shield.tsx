import React from 'react';
import {C} from '../theme';
import {IllProps, Glow, Spark, bf, ramp, smooth} from './common';

// #1 perisai emas berkilau; #2 retak (kaca pecah) saat "pornografi membunuhmu"
export const Shield: React.FC<IllProps> = ({f, t}) => {
  const crack = smooth(ramp(f, bf(2, 6), bf(2, 14)));
  const dim = ramp(f, bf(2, 6), bf(3, 10));
  const shine = ((t * 0.025) % 1.6) - 0.3;
  const body = 'M 0 -150 L 120 -110 C 122 -10 100 80 0 150 C -100 80 -122 -10 -120 -110 Z';
  return (
    <g>
      <defs>
        <Glow id="shg" sd={22} />
        <linearGradient id="shgr" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF0B8" /><stop offset="0.45" stopColor={C.gold} /><stop offset="1" stopColor={C.amber} />
        </linearGradient>
        <clipPath id="shclip"><path d={body} /></clipPath>
      </defs>
      <path d={body} fill={C.gold} opacity={0.55 * (1 - dim * 0.7)} filter="url(#shg)" transform="scale(1.15)" />
      <path d={body} fill="url(#shgr)" />
      <path d={body} fill="#3A2A30" opacity={dim * 0.45} />
      <path d="M 0 -110 L 86 -80 C 86 -8 70 56 0 108 C -70 56 -86 -8 -86 -80 Z" fill="none" stroke="#FFF6D6" strokeWidth={8} opacity={0.6} />
      {/* chevron jantan */}
      <path d="M -50 -20 L 0 -60 L 50 -20 L 50 10 L 0 -30 L -50 10 Z" fill={C.amber} />
      <path d="M -50 30 L 0 -10 L 50 30 L 50 60 L 0 20 L -50 60 Z" fill={C.amber} opacity={0.85} />
      {/* kilau berjalan */}
      <g clipPath="url(#shclip)">
        <rect x={-300 + shine * 400} y={-200} width={50} height={400} fill="#FFFFFF" opacity={0.45 * (1 - dim)} transform="rotate(20)" />
      </g>
      {/* retakan */}
      {crack > 0 && (
        <g stroke="#2B0F17" strokeWidth={7} fill="none" strokeLinejoin="round" strokeLinecap="round" pathLength={1}>
          {['M 6 -150 L -10 -90 L 20 -40 L -14 10 L 12 60 L -6 150', 'M 20 -40 L 80 -60 L 118 -30', 'M -14 10 L -70 -10 L -110 30', 'M 12 60 L 60 80'].map((d, i) => (
            <path key={i} d={d} strokeDasharray="1 1" strokeDashoffset={1 - crack} pathLength={1} />
          ))}
        </g>
      )}
      {crack > 0.5 && [0, 1, 2, 3].map((i) => {
        const k = f - bf(2, 10);
        return <path key={i} d="M 0 -8 L 9 4 L -6 8 Z" fill="#FFE9A8" opacity={Math.max(0, 1 - k / 26)}
          transform={`translate(${(i - 1.5) * 40 + k * (i - 1.5) * 2},${k * k * 0.3}) rotate(${k * 20 * (i % 2 ? 1 : -1)})`} />;
      })}
      {dim < 0.5 && [[-110, -120], [120, -60], [80, 110]].map(([x, y], i) => (
        <Spark key={i} x={x} y={y} s={0.6 + 0.4 * Math.abs(Math.sin(t * 0.12 + i))} c="#FFF3C4" />
      ))}
    </g>
  );
};
