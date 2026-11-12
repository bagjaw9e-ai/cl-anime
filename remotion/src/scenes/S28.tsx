import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, rand} from '../theme';
import {Stage} from '../components/Stage';
import {Character, PoseName} from '../components/Character';
import {PhoneBody} from '../components/Phone';
import {SceneProps} from './types';

// Adegan ambil HP diulang 3x cepat dengan efek rewind.
export const S28: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const L = Math.floor((dur - 6) / 3);
  const k = Math.min(2, Math.floor(f / L));
  const p = (f - k * L) / L;
  const rewinding = p > 0.68 && k < 2;
  const poses: Array<[number, PoseName]> = [];
  for (let i = 0; i < 3; i++) {
    poses.push([i * L, 'reaching'], [i * L + Math.round(L * 0.32), 'holding_phone']);
    if (i < 2) poses.push([i * L + Math.round(L * 0.68), 'standing_relaxed']);
  }
  const holding = p > 0.38 && (p < 0.68 || k === 2);
  return (
    <AbsoluteFill>
      <Stage bg={{top: C.base2, bottom: C.base0, glow: C.red1, glowX: 680, glowY: 1200, glowOp: 0.4}} particles={{n: 12, color: C.rose, color2: C.cream, opacity: 0.3}}
        cam={{dx: rewinding ? (rand(f) - 0.5) * 20 : 0}}>
        <rect x={-100} y={1600} width={1300} height={400} fill={C.base1} />
        {/* meja */}
        <rect x={600} y={1360} width={380} height={34} rx={14} fill={C.rose} />
        <rect x={630} y={1394} width={26} height={210} fill={C.plum} />
        <rect x={920} y={1394} width={26} height={210} fill={C.plum} />
        {!holding && (
          <g transform="translate(790,1330) rotate(90)"><PhoneBody w={64} h={120} glow={0.9} /></g>
        )}
        <Character x={420} y={1600} scale={1.3} pose={poses} expression="guilty" id="s28" lookAt={{x: 0.6, y: 0.3}} />
      </Stage>
      {rewinding && (
        <AbsoluteFill>
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} style={{position: 'absolute', left: 0, right: 0, top: rand(f * 3 + i) * 1920, height: 6 + rand(i + f) * 20,
              background: 'rgba(245,230,218,0.18)'}} />
          ))}
          <svg width={1080} height={1920} style={{position: 'absolute'}}>
            <g transform="translate(200,330)" opacity={0.9}>
              <path d="M 0 0 L 60 -40 L 60 40 Z" fill={C.cream} />
              <path d="M 60 0 L 120 -40 L 120 40 Z" fill={C.cream} />
            </g>
          </svg>
          <AbsoluteFill style={{background: 'rgba(79,179,169,0.08)'}} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
