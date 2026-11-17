import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Character, Expression, PoseName} from './components/Character';
import {LitCharacter, Reflect} from './components/Lit';
import {ChainLine} from './components/Chain';
import {AddictPhone, TreasureChest, TangledRibbon} from './illustrations';
import {Stage} from './Stage';

export const SHEET_W = 2400;
export const SHEET_H = 2560;

const EXPRS: Expression[] = ['determined', 'relieved', 'thinking', 'curious', 'smirk', 'confident', 'happy'];
type Extra = 'chains' | 'chest' | 'chestOpen' | 'ribbon' | 'none';
const POSE_LIST: Array<[PoseName, Expression, Extra, string, number]> = [
  ['struggling_chains', 'determined', 'chains', '1 struggling_chains', 0],
  ['breaking_free', 'determined', 'none', '1 breaking_free', 0],
  ['thinking', 'thinking', 'none', '3 thinking', 1],
  ['standing_relaxed', 'curious', 'none', '4 curious (lirik atas)', 1],
  ['opening_chest', 'smirk', 'chest', '5 opening_chest', 1],
  ['lifting_lid', 'smirk', 'chestOpen', '5 lifting_lid', 1],
  ['holding_scissors', 'confident', 'ribbon', '6 holding_scissors', 1],
  ['pointing_side', 'happy', 'none', '7 pointing_side', 1],
  ['walking', 'happy', 'none', '8 walking', 0],
  ['pointing_up', 'confident', 'none', '9 pointing_up', 0],
  ['arms_crossed', 'confident', 'none', 'END arms_crossed', 0],
];

export const CharacterSheet: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#07090D'}}>
      <svg width={SHEET_W} height={SHEET_H}>
        <text x={40} y={56} fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#F2EEE6">EKSPRESI (rim light + backlight aktif)</text>
        {EXPRS.map((e, i) => (
          <Stage key={e} x={20 + i * 340} y={80} w={320} h={360} floor={360} label={e}>
            <LitCharacter id={`e${i}`} x={160} y={880} scale={1.25} expression={e} blinkSeed={i * 5 + 50} lookAt={e === 'curious' ? {x: 0.2, y: -1} : undefined} />
          </Stage>
        ))}
        <text x={40} y={540} fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#F2EEE6">POSE (panggung navy/cokelat ala ref.mp4, pantulan lantai)</text>
        {POSE_LIST.map(([p, e, ex, label, warm], i) => {
          const col = i % 6, row = Math.floor(i / 6);
          const w = 380, h = 860, floor = 760, cx = w / 2;
          return (
            <Stage key={label} x={20 + col * 396} y={570 + row * 920} w={w} h={h} floor={floor} warm={warm} label={label}>
              <Reflect floor={floor} op={0.2} depth={110}>
                {ex === 'chains' && <g transform={`translate(${cx + 150},${floor})`}><AddictPhone glow={0.6} s={0.55} /></g>}
                {ex === 'chains' && <ChainLine x1={cx + 70} y1={floor - 215} x2={cx + 150} y2={floor - 80} sag={30} s={0.8} />}
                {ex === 'ribbon' && <g transform={`translate(${cx + 180},${floor - 330})`}><TangledRibbon t={f} cut={0} len={300} /></g>}
                <LitCharacter id={`p${i}`} x={ex === 'chains' ? cx - 30 : cx} y={floor} scale={0.88} pose={p} expression={e} blinkSeed={i * 7 + 300}
                  chains={ex === 'chains' ? 3 : 0} lookAt={p === 'standing_relaxed' ? {x: 0.2, y: -1} : undefined} />
                {(ex === 'chest' || ex === 'chestOpen') && (
                  <g transform={`translate(${cx},${floor}) scale(0.78)`}><TreasureChest t={f} unlock={ex === 'chestOpen' ? 1 : 0} open={ex === 'chestOpen' ? 0.9 : 0} lockFall={ex === 'chestOpen' ? 1 : 0} /></g>
                )}
              </Reflect>
            </Stage>
          );
        })}
        {/* cek kontras: rim OFF vs ON */}
        <Stage x={20 + 5 * 396} y={570 + 920} w={380} h={860} floor={760} label="kiri: rim OFF · kanan: rim ON">
          <g transform="translate(100,760) scale(0.62)"><Character id="noRim" x={0} y={0} expression="neutral" blinkSeed={2} /></g>
          <LitCharacter id="withRim" x={280} y={760} scale={0.62} expression="neutral" blinkSeed={9} />
        </Stage>
      </svg>
    </AbsoluteFill>
  );
};
