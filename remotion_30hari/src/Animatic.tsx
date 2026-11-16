import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Main} from './Main';

// Animatic 540x960 (dunia 1080x1920 diskalakan 0.5), VO saja (belum ada SFX/BGM).
export const Animatic: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <div style={{width: 1080, height: 1920, transform: 'scale(0.5)', transformOrigin: 'top left', position: 'absolute'}}>
      <Main mode="animatic" />
    </div>
  </AbsoluteFill>
);
