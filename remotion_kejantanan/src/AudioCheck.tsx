import React from 'react';
import {AbsoluteFill} from 'remotion';
import {World} from './World';
import {renderIllustrations} from './illustrations';

// Cek audio: mix final (voice + SFX) + visual kasar 540x960.
export const AudioCheck: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <div style={{width: 1080, height: 1920, transform: 'scale(0.5)', transformOrigin: 'top left', position: 'absolute'}}>
      <World mode="final" renderIll={renderIllustrations} />
    </div>
  </AbsoluteFill>
);
