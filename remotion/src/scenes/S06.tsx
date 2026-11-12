import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {ease, pop} from '../anim';
import {Stage} from '../components/Stage';
import {Character} from '../components/Character';
import {Brain} from '../components/Brain';
import {Monitor} from '../components/Props';
import {SceneProps} from './types';

// Mesin MRI, karakter rebahan masuk, monitor menampilkan otak.
export const S06: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const slide = ease(f, 0, dur - 10, 0, 330);
  const mon = pop(f, 6);
  const scan = ((f * 6) % 300) - 150;
  return (
    <Stage bg={{top: '#4A2338', bottom: C.base0, glow: C.cream, glowY: 1150, glowOp: 0.15}}
      particles={{n: 14, color: C.cream, color2: C.mint, opacity: 0.25}}>
      {/* monitor */}
      <g transform={`translate(540,560) scale(${mon})`}>
        <Monitor w={460} h={300} frame={C.cream} screen="#1E0D16" stand={false}>
          <Brain s={0.62} y={10} pfc={0.6} mid={0.5} />
          <rect x={-230} y={scan} width={460} height={6} fill={C.mint} opacity={0.7} />
          <rect x={-230} y={scan - 30} width={460} height={30} fill={C.mint} opacity={0.12} />
        </Monitor>
      </g>
      {/* ranjang */}
      <rect x={60} y={1290} width={760} height={40} rx={18} fill={C.cream} opacity={0.9} />
      <rect x={160} y={1330} width={50} height={240} fill="#8D7F88" />
      {/* karakter rebahan */}
      <g transform={`translate(${130 + slide},1250)`}>
        <g transform="rotate(90)">
          <Character x={0} y={0} scale={0.82} pose="lying" expression="worried" id="s6" lookAt={{x: 0, y: -1}} />
        </g>
      </g>
      {/* badan mesin (menutupi bagian di dalam terowongan) */}
      <g>
        <rect x={600} y={900} width={460} height={680} rx={90} fill={C.cream} />
        <rect x={588} y={1160} width={40} height={220} rx={20} fill={C.plum} />
        <rect x={640} y={960} width={380} height={30} rx={15} fill={C.rose} opacity={0.6} />
        <circle cx={900} cy={1460} r={22} fill={C.mint} opacity={0.6 + 0.4 * Math.sin(f * 0.4)} />
        <circle cx={960} cy={1460} r={22} fill={C.coral} />
      </g>
      <rect x={0} y={1570} width={1080} height={400} fill={C.base1} />
    </Stage>
  );
};
