import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Main} from './Main';

// Cek audio: mix final (VO + BGM + SFX) + visual kasar 540x960.
export const AudioCheck: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <div style={{width: 1080, height: 1920, transform: 'scale(0.5)', transformOrigin: 'top left', position: 'absolute'}}>
      <Main mode="final" />
    </div>
  </AbsoluteFill>
);
