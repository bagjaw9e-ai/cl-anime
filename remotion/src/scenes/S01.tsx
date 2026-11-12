import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease} from '../anim';
import {Stage} from '../components/Stage';
import {Character} from '../components/Character';
import {Floor} from '../components/Props';
import {SceneProps} from './types';

// Kamar gelap maroon, karakter pegang HP, glow merah ke wajah, bengong.
export const S01: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const s = ease(f, 0, dur, 1.25, 1.42);
  return (
    <Stage bg={{top: C.base2, bottom: C.base0, glow: C.red1, glowY: 900, glowOp: 0.5}}
      particles={{n: 26, color: C.rose, color2: C.coral, opacity: 0.45}} cam={{x: 540, y: 1180, s}}>
      {/* jendela dengan cahaya bulan plum */}
      <g transform="translate(250,700)">
        <rect x={-130} y={-170} width={260} height={320} rx={18} fill={C.plum} />
        <rect x={-112} y={-152} width={224} height={284} rx={10} fill="#3B1A36" />
        <circle cx={40} cy={-70} r={46} fill={C.rose} opacity={0.75} />
        <circle cx={58} cy={-82} r={40} fill="#3B1A36" />
        <rect x={-4} y={-152} width={8} height={284} fill={C.plum} />
        <rect x={-112} y={-14} width={224} height={8} fill={C.plum} />
      </g>
      {/* rak / meja samping */}
      <rect x={760} y={1330} width={220} height={230} rx={14} fill={C.base2} />
      <rect x={780} y={1350} width={180} height={70} rx={10} fill={C.base1} />
      <Floor y={1560} glow={C.red2} />
      <Character x={540} y={1560} scale={1.45} pose="holding_phone" expression="dazed" rim id="s1" />
    </Stage>
  );
};
