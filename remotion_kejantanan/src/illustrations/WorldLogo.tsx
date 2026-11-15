import React from 'react';
import {Img, staticFile} from 'remotion';
import {neonLevel} from '../components/NeonLogo';
import {IllProps, Glow, bf} from './common';

const LW = 498, LH = 339;
// #44 logo PMO SAVIOR (di world) nyala ala neon: flicker 3x lalu stabil, glow pulse pelan. End card: kamera push ke sini.
export const WorldLogo: React.FC<IllProps> = ({f, w}) => {
  const lv = neonLevel(f - bf(44));
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.16);
  const h = (w * LH) / LW;
  return (
    <g>
      <defs><Glow id="wlg" sd={40} /></defs>
      <ellipse rx={w * 0.55} ry={h * 0.55} fill="#FF2D37" opacity={(0.22 + 0.1 * pulse) * lv} filter="url(#wlg)" />
      <foreignObject x={-w / 2} y={-h / 2} width={w} height={h}>
        <Img src={staticFile('pmo_savior.png')} style={{width: w, height: h, opacity: Math.min(1, 0.1 + lv),
          filter: `brightness(${Math.min(1, 0.2 + lv * 0.8)}) drop-shadow(0 0 ${10 + 10 * pulse * lv}px rgba(255,40,50,${0.45 * lv}))`}} />
      </foreignObject>
    </g>
  );
};
