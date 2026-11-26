// Still 9:16 (1080x1920) karakter utama di green screen polos: pose gelisah + ekspresi sedikit marah.
// Tanpa rim light / halo / bayangan lantai (noShadow) supaya bersih saat di-key (chroma key).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character} from './components/Character';

export const GreenScreen: React.FC = () => (
  <AbsoluteFill style={{background: '#00FF00'}}>
    <svg width={1080} height={1920}>
      <Character id="gs" x={540} y={1560} scale={1.75} pose="hugging_self_scratching_arm" expression="irritated" blinkSeed={7} noShadow />
    </svg>
  </AbsoluteFill>
);
