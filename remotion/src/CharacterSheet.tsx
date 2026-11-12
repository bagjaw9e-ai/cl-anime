import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from './theme';
import {Character, Expression, PoseName} from './components/Character';
import {Brain} from './components/Brain';
import {MidbrainMascot} from './components/MidbrainMascot';
import {PhoneBody} from './components/Phone';

export const SHEET_W = 2400;
export const SHEET_H = 3360;

const EXPRS: Expression[] = ['neutral', 'happy', 'smirk', 'sad', 'guilty', 'shocked', 'worried', 'angry',
  'thinking', 'determined', 'dazed', 'crying'];
const POSES: PoseName[] = ['standing_relaxed', 'arms_crossed', 'holding_phone', 'head_in_hands', 'sitting_desk',
  'pointing_up', 'shaking_head', 'walking'];

// Tidak ada teks di sheet (konsisten aturan tanpa teks); urutan = urutan daftar di atas.
export const CharacterSheet: React.FC = () => (
  <AbsoluteFill style={{background: `linear-gradient(${C.base2}, ${C.base0})`}}>
    <svg width={SHEET_W} height={SHEET_H}>
      {EXPRS.map((e, i) => {
        const cx = 200 + (i % 6) * 400;
        const cy = 40 + Math.floor(i / 6) * 440;
        return (
          <g key={e}>
            <rect x={cx - 185} y={cy} width={370} height={420} rx={30} fill={C.base1} />
            <clipPath id={`cl${i}`}><rect x={cx - 185} y={cy} width={370} height={420} rx={30} /></clipPath>
            <g clipPath={`url(#cl${i})`}>
              <Character id={`e${i}`} x={cx} y={cy + 820} scale={1.05} expression={e} rim={i % 2 === 0} />
            </g>
          </g>
        );
      })}
      {POSES.map((p, i) => {
        const cx = 300 + (i % 4) * 600;
        const cy = 960 + Math.floor(i / 4) * 760;
        return (
          <g key={p}>
            <rect x={cx - 285} y={cy} width={570} height={740} rx={30} fill={C.base1} />
            <Character id={`p${i}`} x={cx} y={cy + 690} scale={0.88} pose={p}
              expression={p === 'head_in_hands' ? 'sad' : p === 'holding_phone' ? 'dazed' : p === 'pointing_up' ? 'happy' : p === 'shaking_head' ? 'worried' : p === 'arms_crossed' ? 'determined' : 'neutral'} />
          </g>
        );
      })}
      {/* otak */}
      <g>
        <rect x={15} y={2500} width={2370} height={420} rx={30} fill={C.base1} />
        <Brain x={260} y={2700} s={0.85} pfc={0.6} mid={0.4} />
        <Brain x={740} y={2700} s={0.85} pfc={1} mid={0.2} />
        <Brain x={1220} y={2700} s={0.85} pfc={0.05} mid={1} midScale={1.6} />
        <Brain x={1680} y={2700} s={0.6} gray={1} pfc={0.2} mid={0.2} />
        <Brain x={2130} y={2700} s={0.85} pfc={0.9} mid={0.3} crack={1} heal={1} />
      </g>
      {/* maskot + HP */}
      <g>
        <rect x={15} y={2940} width={2370} height={400} rx={30} fill={C.base1} />
        <MidbrainMascot x={220} y={3120} s={1.05} mood="derp" />
        <MidbrainMascot x={560} y={3120} s={1.05} mood="love" />
        <MidbrainMascot x={900} y={3120} s={1.05} mood="dizzy" />
        <MidbrainMascot x={1240} y={3120} s={1.05} mood="happy" />
        <MidbrainMascot x={1600} y={3120} s={1.05} mood="buff" buff={1} />
        <g transform="translate(1960,3140)"><PhoneBody w={150} h={290} heart={1} /></g>
        <g transform="translate(2230,3140)"><PhoneBody w={150} h={290} thin={0.0} cardboard={1} /></g>
      </g>
    </svg>
  </AbsoluteFill>
);
