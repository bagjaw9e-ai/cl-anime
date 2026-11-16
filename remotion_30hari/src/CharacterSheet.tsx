import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from './theme';
import {Character, Expression, PoseName} from './components/Character';

export const SHEET_W = 2400;
export const SHEET_H = 4480;

// ekspresi baru untuk video 30 hari (+ nervous, flat)
export const EXPRS: Expression[] = ['sweaty_stressed', 'jittery', 'bored', 'lonely', 'tempted', 'guilty', 'curious', 'proud',
  'laughing', 'lethargic', 'restless', 'focused', 'relieved', 'sleepy', 'confused_morning', 'confident', 'nervous', 'flat'];
// pose baru + yang dipakai ulang; [pose, ekspresi, konteks]
type Ctx = 'none' | 'bed' | 'lie' | 'seat';
export const POSE_LIST: Array<[PoseName, Expression, Ctx]> = [
  ['carrying_weight', 'sweaty_stressed', 'none'], ['lying_on_bed_phone', 'tempted', 'lie'], ['sitting_bed_bored', 'bored', 'bed'],
  ['grabbing_phone', 'tempted', 'none'], ['shaking_cold', 'jittery', 'none'], ['hero_pose_cape', 'proud', 'none'],
  ['cape_falls', 'laughing', 'none'], ['slumped', 'lethargic', 'bed'], ['pacing', 'restless', 'none'],
  ['pushing_phone_away', 'confident', 'none'], ['blocking_hand', 'focused', 'none'], ['reading_focused', 'focused', 'none'],
  ['playing_guitar', 'happy', 'none'], ['workout', 'confident', 'none'], ['holding_scissors', 'relieved', 'none'],
  ['steering_wheel', 'confident', 'seat'], ['sleeping', 'sleepy', 'lie'], ['waking_up', 'confused_morning', 'none'],
  ['pointing_up', 'happy', 'none'], ['arms_crossed', 'confident', 'none'], ['nervous_stand', 'nervous', 'none'],
];

export const CharacterSheet: React.FC = () => (
  <AbsoluteFill style={{background: `linear-gradient(${C.base2}, ${C.base0})`}}>
    <svg width={SHEET_W} height={SHEET_H}>
      {EXPRS.map((e, i) => {
        const cx = 200 + (i % 6) * 400, cy = 30 + Math.floor(i / 6) * 440;
        return (
          <g key={e}>
            <rect x={cx - 185} y={cy} width={370} height={420} rx={30} fill="#3A1A30" />
            <clipPath id={`cl${i}`}><rect x={cx - 185} y={cy} width={370} height={420} rx={30} /></clipPath>
            <g clipPath={`url(#cl${i})`}>
              <Character id={`e${i}`} x={cx} y={cy + 820} scale={1.05} expression={e} blinkSeed={i * 3 + 100} />
            </g>
          </g>
        );
      })}
      {POSE_LIST.map(([p, e, ctx], i) => {
        const cx = 200 + (i % 6) * 400, cy = 1380 + Math.floor(i / 6) * 770;
        return (
          <g key={p}>
            <rect x={cx - 190} y={cy} width={380} height={750} rx={30} fill={C.base1} />
            <clipPath id={`pc${i}`}><rect x={cx - 190} y={cy} width={380} height={750} rx={30} /></clipPath>
            <g clipPath={`url(#pc${i})`}>
              {ctx === 'bed' && <rect x={cx - 180} y={cy + 560} width={360} height={140} rx={30} fill="#5E2A4A" />}
              {ctx === 'seat' && <rect x={cx - 120} y={cy + 560} width={240} height={140} rx={30} fill="#3A3238" />}
              {ctx === 'lie' ? (
                <g>
                  <rect x={cx - 180} y={cy + 470} width={360} height={110} rx={30} fill="#5E2A4A" />
                  <rect x={cx + 90} y={cy + 430} width={90} height={60} rx={24} fill={C.cream} />
                  <g transform={`translate(${cx - 175},${cy + 470}) rotate(90)`}>
                    <Character id={`p${i}`} x={0} y={0} scale={0.52} pose={p} expression={e} blinkSeed={i * 7 + 300} />
                  </g>
                </g>
              ) : (
                <Character id={`p${i}`} x={cx} y={cy + (ctx === 'none' ? 700 : 700)} scale={0.8} pose={p} expression={e} blinkSeed={i * 7 + 300} />
              )}
            </g>
          </g>
        );
      })}
    </svg>
  </AbsoluteFill>
);
