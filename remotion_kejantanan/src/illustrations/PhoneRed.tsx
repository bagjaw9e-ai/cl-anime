import React from 'react';
import {PhoneBody} from '../components/Phone';
import {IllProps} from './common';

// #2 HP glow merah (layar cuma glow blur)
export const PhoneRed: React.FC<IllProps> = ({t}) => (
  <g transform={`translate(0,${Math.sin(t * 0.12) * 10}) rotate(${-8 + Math.sin(t * 0.08) * 4})`}>
    <PhoneBody w={140} h={260} glow={1} />
  </g>
);
