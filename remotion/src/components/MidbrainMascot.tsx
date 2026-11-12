import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {Heart, useSid} from './Phone';

export type MascotMood = 'derp' | 'love' | 'dizzy' | 'happy' | 'buff';

// Maskot otak tengah: blob merah lucu, mata besar, wajah polos/bego.
export const MidbrainMascot: React.FC<{
  x?: number; y?: number; s?: number; mood?: MascotMood; walk?: number; squash?: number;
  look?: number; armsHug?: number; flip?: boolean; buff?: number;
}> = ({x = 0, y = 0, s = 1, mood = 'derp', walk = 0, squash = 0, look = 0, armsHug = 0, flip = false, buff = 0}) => {
  const f = useCurrentFrame();
  const id = useSid('mm');
  const ph = f * 0.45;
  const step = walk * Math.sin(ph);
  const bounce = walk * Math.abs(Math.sin(ph)) * -10 + Math.sin(f * 0.12) * 3;
  const sq = 1 + squash * 0.25;
  const blob = `M -95 20 C -104 -50 -60 -100 0 -100 C 64 -100 104 -56 98 14 C 94 70 50 92 0 92 C -54 92 -90 66 -95 20 Z`;
  const eyeY = -18;
  const muscle = buff;
  return (
    <g transform={`translate(${x},${y + bounce}) scale(${(flip ? -1 : 1) * s * sq},${s / sq})`}>
      <defs>
        <radialGradient id={`${id}b`} cx="0.38" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#FF8A92" />
          <stop offset="0.45" stopColor={C.red2} />
          <stop offset="1" stopColor={C.red0} />
        </radialGradient>
        <filter id={`${id}gl`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={18} />
        </filter>
      </defs>
      <ellipse cx={0} cy={0} rx={120} ry={110} fill={C.red2} opacity={0.35} filter={`url(#${id}gl)`} />
      {/* kaki */}
      <ellipse cx={-34 + step * 16} cy={100} rx={24} ry={13} fill={C.red0} />
      <ellipse cx={34 - step * 16} cy={100} rx={24} ry={13} fill={C.red0} />
      {/* lengan */}
      {armsHug > 0.5 ? (
        <>
          <path d="M -88 10 Q -60 50 -10 40" stroke={C.red1} strokeWidth={22} strokeLinecap="round" fill="none" />
          <path d="M 88 10 Q 60 50 10 40" stroke={C.red1} strokeWidth={22} strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <ellipse cx={-98 - muscle * 18} cy={20 + step * 6} rx={18 + muscle * 18} ry={30 + muscle * 10} fill={C.red1}
            transform={`rotate(${20 + step * 20} ${-98} ${20})`} />
          <ellipse cx={98 + muscle * 18} cy={20 - step * 6} rx={18 + muscle * 18} ry={30 + muscle * 10} fill={C.red1}
            transform={`rotate(${-20 - step * 20} ${98} ${20})`} />
        </>
      )}
      {/* badan */}
      <path d={blob} fill={`url(#${id}b)`} />
      {/* lipatan otak lucu */}
      <path d="M -60 -60 C -40 -80 -20 -60 0 -78 C 20 -92 40 -70 62 -80" stroke={C.red0} strokeWidth={6} fill="none"
        strokeLinecap="round" opacity={0.5} />
      <ellipse cx={-38} cy={-62} rx={24} ry={10} fill="#FFFFFF" opacity={0.28} transform="rotate(-20 -38 -62)" />
      {/* mata */}
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`translate(${sd * 34},${eyeY})`}>
          {mood === 'love' ? (
            <Heart s={1.25 + 0.1 * Math.sin(f * 0.5)} fill={C.cream} />
          ) : mood === 'dizzy' ? (
            <g transform={`rotate(${f * 18 * sd})`}>
              <circle r={27} fill={C.white} />
              <path d="M 0 0 m -4 0 a 4 4 0 1 1 8 0 a 9 9 0 1 1 -18 0 a 14 14 0 1 1 28 0" stroke={C.ink}
                strokeWidth={3.5} fill="none" />
            </g>
          ) : mood === 'happy' ? (
            <path d="M -18 4 Q 0 -18 18 4" stroke={C.ink} strokeWidth={7} fill="none" strokeLinecap="round" />
          ) : (
            <>
              <circle r={28} fill={C.white} />
              {/* pupil kecil juling = polos/bego */}
              <circle cx={sd * -7 + look * 8} cy={4} r={9} fill={C.ink} />
              <circle cx={sd * -7 + look * 8 + 3} cy={1} r={3} fill={C.white} />
            </>
          )}
        </g>
      ))}
      {/* mulut */}
      {mood === 'happy' || mood === 'love' ? (
        <path d="M -24 28 Q 0 52 24 28 Q 0 38 -24 28 Z" fill="#5A1726" />
      ) : mood === 'buff' ? (
        <path d="M -26 30 Q 0 22 26 30 L 24 40 Q 0 34 -24 40 Z" fill="#5A1726" />
      ) : (
        <g>
          <path d="M -16 30 Q 0 46 18 30 Q 4 34 -16 30 Z" fill="#5A1726" />
          {/* lidah melet */}
          <ellipse cx={8} cy={40} rx={8} ry={7} fill={C.coral} opacity={mood === 'derp' ? 1 : 0} />
        </g>
      )}
      {buff > 0.1 && (
        <g opacity={buff}>
          <path d="M -40 -2 L -10 6 M 40 -2 L 10 6" stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};
