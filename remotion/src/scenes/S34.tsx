import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, rand} from '../theme';
import {ease} from '../anim';
import {Stage} from '../components/Stage';
import {Brain} from '../components/Brain';
import {Sparkle} from '../components/Props';
import {SceneProps} from './types';

// Otak retak, retakan nyala emas lalu menyatu (kintsugi).
export const S34: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const crack = ease(f, 0, 10);
  const heal = ease(f, 14, 34);
  const glow = ease(f, 34, dur - 8);
  const split = (1 - heal) * 14 * crack;
  return (
    <Stage bg={{top: '#7A3550', bottom: '#2E4E52', glow: C.gold, glowY: 940, glowOp: 0.3 + heal * 0.3}} particles={{n: 30, color: C.gold, color2: C.mint, opacity: 0.5}}
      cam={{s: ease(f, 0, dur, 1, 1.07)}}>
      <g transform={`translate(${540 - split},960)`}>
        <Brain s={1.9} pfc={0.4 + glow * 0.6} mid={0.3} crack={crack} heal={heal} />
      </g>
      {heal > 0.2 && heal < 1 && Array.from({length: 8}).map((_, i) => (
        <Sparkle key={i} x={400 + rand(i) * 300} y={720 + rand(i + 4) * 400} s={0.5 + 0.4 * Math.sin(f * 0.4 + i)} color={C.gold} />
      ))}
    </Stage>
  );
};
