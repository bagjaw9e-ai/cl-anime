import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from './theme';
import {Character, Expression, PoseName} from './components/Character';

export const SHEET_W = 2400;
export const SHEET_H = 3700;

export const EXPRS: Expression[] = ['neutral', 'happy', 'smirk', 'sad', 'guilty', 'shocked', 'worried', 'angry',
  'thinking', 'determined', 'dazed', 'crying', 'bored', 'curious', 'hooked', 'panicked', 'hypnotized'];
// pose lama (8) + pose baru (10)
export const POSE_LIST: Array<[PoseName, Expression]> = [
  ['arms_crossed', 'determined'], ['standing_relaxed', 'neutral'], ['holding_phone', 'dazed'], ['head_in_hands', 'sad'],
  ['sitting_desk', 'thinking'], ['pointing_up', 'happy'], ['shaking_head', 'worried'], ['walking', 'neutral'],
  ['shrug', 'smirk'], ['whistling_unaware', 'neutral'], ['tapping_phone', 'hooked'], ['pulled_by_collar', 'shocked'],
  ['running_treadmill', 'worried'], ['sitting_floor_bored', 'bored'], ['yawning', 'bored'], ['hand_autopilot', 'shocked'],
  ['tossing_phone', 'determined'], ['fixing_collar', 'smirk'],
];

// Tanpa teks di sheet. Urutan = urutan daftar di atas.
export const CharacterSheet: React.FC = () => (
  <AbsoluteFill style={{background: `linear-gradient(${C.base2}, ${C.base0})`}}>
    <svg width={SHEET_W} height={SHEET_H}>
      {EXPRS.map((e, i) => {
        const cx = 200 + (i % 6) * 400;
        const cy = 30 + Math.floor(i / 6) * 440;
        return (
          <g key={e}>
            <rect x={cx - 185} y={cy} width={370} height={420} rx={30} fill={i >= 12 ? '#3A1A30' : C.base1} />
            <clipPath id={`cl${i}`}><rect x={cx - 185} y={cy} width={370} height={420} rx={30} /></clipPath>
            <g clipPath={`url(#cl${i})`}>
              <Character id={`e${i}`} x={cx} y={cy + 820} scale={1.05} expression={e} blinkSeed={i * 3 + 100} />
            </g>
          </g>
        );
      })}
      {POSE_LIST.map(([p, e], i) => {
        const cx = 200 + (i % 6) * 400;
        const cy = 1370 + Math.floor(i / 6) * 770;
        return (
          <g key={p}>
            <rect x={cx - 190} y={cy} width={380} height={750} rx={30} fill={i >= 8 ? '#3A1A30' : C.base1} />
            {p === 'running_treadmill' && <rect x={cx - 170} y={cy + 690} width={340} height={26} rx={13} fill="#5A4A55" />}
            <Character id={`p${i}`} x={cx} y={cy + 690} scale={0.82} pose={p} expression={e} blinkSeed={i * 7 + 300} />
          </g>
        );
      })}
    </svg>
  </AbsoluteFill>
);
