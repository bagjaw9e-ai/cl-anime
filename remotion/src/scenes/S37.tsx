import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, mix} from '../theme';
import {ease} from '../anim';
import {Stage} from '../components/Stage';
import {Character} from '../components/Character';
import {NeonLogo, neonLevel} from '../components/NeonLogo';
import {SceneProps} from './types';

export const CTA_BG = {top: '#2B0F17', bottom: '#10282A'}; // gelap hangat: maroon + sedikit teal
export const CTA_CHAR = {x: 540, y: 1690, s: 1.2};

// CTA: latar meredup, karakter pointing_up, logo PMO SAVIOR nyala ala neon (flicker 3x lalu stabil).
export const S37: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const dim = ease(f, 0, 12);
  const lv = neonLevel(f);
  return (
    <Stage bg={{top: mix('#6E3350', CTA_BG.top, dim), bottom: mix('#2E5E5A', CTA_BG.bottom, dim), glow: C.red2, glowY: 520, glowR: 800, glowOp: 0.08 + lv * 0.28}}
      particles={{n: 18, color: C.red2, color2: C.mint, opacity: 0.3}}
      over={<NeonLogo cy={470} level={lv} />}>
      {/* lantai + pantulan merah logo */}
      <rect x={-200} y={CTA_CHAR.y} width={1480} height={400} fill="#1A1416" />
      <ellipse cx={540} cy={CTA_CHAR.y + 10} rx={460} ry={34} fill={C.red2} opacity={0.08 + lv * 0.3} />
      <ellipse cx={540} cy={CTA_CHAR.y + 10} rx={200} ry={14} fill="#FF8A92" opacity={lv * 0.25} />
      <Character x={CTA_CHAR.x} y={CTA_CHAR.y} scale={CTA_CHAR.s} pose={[[0, 'standing_relaxed'], [4, 'pointing_up']]}
        expression="happy" talking rim={lv > 0.5} id="s37" lookAt={{x: 0.2, y: -0.8}} />
    </Stage>
  );
};
