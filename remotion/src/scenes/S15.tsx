import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease, pop} from '../anim';
import {Stage} from '../components/Stage';
import {Character} from '../components/Character';
import {PhoneBody} from '../components/Phone';
import {Floor, Pedal} from '../components/Props';
import {SceneProps} from './types';

// Tangan karakter nahan HP yang mendekat + ikon pedal rem ditekan.
export const S15: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const approach = ease(f, 0, 14, 1200, 830);
  const jit = f > 14 ? Math.sin(f * 2.1) * 6 : 0;
  const press = ease(f, 12, 18);
  const ring = Math.max(0, f - 15);
  const pedalIn = pop(f, 2);
  return (
    <Stage bg={{top: C.plum, bottom: C.base1, glow: C.gold, glowX: 760, glowY: 520, glowOp: 0.3}}
      particles={{n: 16, color: C.gold, color2: C.coral, opacity: 0.3}}>
      <Floor y={1640} glow={C.amber} />
      <Character x={400} y={1640} scale={1.3} pose="stop_hand" expression="determined" id="s15" lookAt={{x: 0.8, y: 0}} />
      <g transform={`translate(${approach + jit},1100) rotate(${-10 + jit})`}>
        <PhoneBody w={130} h={240} glow={0.9} />
      </g>
      <g transform={`translate(790,480) scale(${pedalIn * 0.85})`}>
        <circle r={150 + ring * 9} fill="none" stroke={C.gold} strokeWidth={10} opacity={Math.max(0, 1 - ring / 16)} />
        <Pedal press={press} />
      </g>
    </Stage>
  );
};
