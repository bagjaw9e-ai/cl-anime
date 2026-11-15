import React from 'react';
import {AbsoluteFill} from 'remotion';
import {World} from './World';

// Animatic 540x960: dunia penuh 1080x1920 diskalakan 0.5. Placeholder kotak di slot ilustrasi.
export const Animatic: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <div style={{width: 1080, height: 1920, transform: 'scale(0.5)', transformOrigin: 'top left', position: 'absolute'}}>
      <World mode="animatic" />
    </div>
  </AbsoluteFill>
);
