import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease} from '../anim';
import {Stage} from '../components/Stage';
import {MidbrainMascot} from '../components/MidbrainMascot';
import {Heart, PhoneBody} from '../components/Phone';
import {SceneProps} from './types';

// Maskot meluk HP dengan mata hati; kamera muter ke samping -> cuma lembaran kardus tipis.
export const S22: React.FC<SceneProps> = ({b}) => {
  const f = useCurrentFrame();
  const beat = b[0] ?? 45;
  const rot = ease(f, beat - 4, beat + 8) * 0.82;
  const card = ease(f, beat, beat + 10);
  return (
    <Stage bg={{top: C.plum, bottom: C.base1, glow: '#FF7A9C', glowY: 950, glowOp: 0.35 * (1 - card) + 0.1}}
      particles={{n: 18, color: '#FF9AB3', color2: C.amber, opacity: 0.3}} cam={{x: 540 - rot * 60, y: 1000, s: 1.05 + rot * 0.08, r: rot * -4}}>
      <rect x={-200} y={1450} width={1480} height={600} fill={C.base1} />
      {/* penyangga kardus (kelihatan setelah diputar) */}
      <path d="M 560 1460 L 640 1000" stroke="#7A5033" strokeWidth={14} opacity={card} strokeLinecap="round" />
      <g transform={`translate(${540 - rot * 10},1060)`}>
        <PhoneBody w={300} h={560} color="#FF6F91" heart={1 - card} thin={rot} cardboard={card} />
      </g>
      {card < 0.9 && [0, 1, 2].map((i) => {
        const u = ((f * 0.03 + i / 3) % 1);
        return <Heart key={i} x={420 + i * 120} y={820 - u * 260} s={0.9} fill={C.cream} opacity={(1 - u) * (1 - card)} />;
      })}
      <MidbrainMascot x={540 + rot * 150} y={1330} s={1.2} mood={card > 0.5 ? 'derp' : 'love'} armsHug={card > 0.5 ? 0 : 1} look={-1} />
      {card > 0.5 && <path d="M 760 1130 q 10 18 0 26 q -10 -8 0 -26 Z" fill={C.mint} transform="scale(1.6) translate(-300,-430)" />}
    </Stage>
  );
};
