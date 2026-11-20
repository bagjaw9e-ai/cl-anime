import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character, Expression, PoseName} from './components/Character';
import {FExpression, FPoseName, FemaleCharacter} from './components/FemaleCharacter';
import {LitCharacter, LitFemale, Reflect} from './components/Lit';
import {Stage} from './Stage';

export const SHEET_W = 2400;
export const SHEET_H = 4560;

const M_EXPR: Expression[] = ['smug', 'lazy', 'empty', 'obsessive', 'irritated', 'smirk_denial', 'cold', 'oblivious', 'confused',
  'hooked', 'dazed', 'bored', 'restless', 'worried', 'angry', 'happy', 'curious', 'relieved', 'shocked', 'thinking', 'lethargic', 'neutral'];
const NEW_M = new Set(['smug', 'lazy', 'empty', 'obsessive', 'irritated', 'smirk_denial', 'cold', 'oblivious', 'confused']);
const F_EXPR: FExpression[] = ['neutral', 'happy', 'hopeful', 'curious', 'suspicious', 'confused', 'disappointed', 'sad', 'hurt', 'uncomfortable', 'scared', 'crying', 'withdrawn'];
type Ctx = 'none' | 'seat' | 'desk' | 'deskSeat' | 'mat' | 'lie' | 'bed' | 'stairs';
const M_POSE: Array<[PoseName, Expression, Ctx, boolean]> = [
  ['groom_standing', 'happy', 'none', true], ['holding_phone_smug', 'smug', 'none', true], ['whistling_unaware', 'oblivious', 'none', false],
  ['lying_on_bed_phone', 'hooked', 'lie', false], ['sitting_bed_bored', 'bored', 'bed', false], ['yawning_at_desk', 'lazy', 'deskSeat', true],
  ['sitting_blank_on_prayer_mat', 'empty', 'mat', true], ['climbing_stairs', 'obsessive', 'stairs', true], ['pointing_up', 'confident', 'none', false],
  ['slamming_desk', 'angry', 'desk', true], ['rolling_dice', 'smirk', 'none', true], ['sunglasses_relax', 'smirk_denial', 'seat', true],
  ['stiff_while_hugged', 'cold', 'none', true], ['comparing_phone', 'irritated', 'none', true], ['looming', 'angry', 'none', true],
  ['sitting_relaxed_phone', 'oblivious', 'seat', true], ['swiping_phone', 'hooked', 'none', true], ['sitting_desk', 'worried', 'deskSeat', false],
  ['running_treadmill', 'obsessive', 'none', false], ['holding_phone', 'hooked', 'none', false], ['standing_relaxed', 'curious', 'none', false],
];
const F_POSE: Array<[FPoseName, FExpression]> = [
  ['standing_smile', 'happy'], ['bringing_tea', 'hopeful'], ['hugging_husband', 'happy'], ['talking', 'hopeful'], ['stepping_back', 'scared'],
  ['sitting_bed_edge_hugging_knees', 'uncomfortable'], ['shielding_self', 'scared'], ['crying_in_corner', 'crying'],
];
const T = (x: number, y: number, s: string, size = 30) => <text x={x} y={y} fontFamily="Poppins" fontWeight={800} fontSize={size} fill="#F2EEE6">{s}</text>;

const ctxEl = (ctx: Ctx, cx: number, floor: number) => {
  switch (ctx) {
    case 'seat': return <rect x={cx - 100} y={floor - 150} width={200} height={150} rx={22} fill="#3A4152" />;
    case 'bed': return <rect x={cx - 150} y={floor - 150} width={300} height={150} rx={26} fill="#4A3F63" />;
    case 'desk': return <g><rect x={cx - 120} y={floor - 132} width={16} height={132} fill="#3E3026" /><rect x={cx + 104} y={floor - 132} width={16} height={132} fill="#3E3026" /></g>;
    case 'deskSeat': return <rect x={cx - 100} y={floor - 150} width={200} height={150} rx={22} fill="#3A4152" />;
    case 'mat': return <rect x={cx - 150} y={floor - 14} width={300} height={22} rx={6} fill="#2E6E5A" />;
    case 'stairs': return <g>{[0, 1, 2].map((k) => <rect key={k} x={cx - 160 + k * 110} y={floor - 40 - k * 40} width={300 - k * 110} height={40 + k * 40} fill="#3A4152" opacity={0.9} />)}</g>;
    default: return null;
  }
};

export const CharacterSheet: React.FC = () => (
  <AbsoluteFill style={{background: '#07090D'}}>
    <svg width={SHEET_W} height={SHEET_H}>
      {T(30, 50, 'PRIA — ekspresi (★ = baru), rim light hangat + halo')}
      {M_EXPR.map((e, i) => (
        <Stage key={e} x={20 + (i % 11) * 216} y={70 + Math.floor(i / 11) * 290} w={200} h={240} floor={240} label={(NEW_M.has(e) ? '★ ' : '') + e}>
          <LitCharacter id={`me${i}`} x={100} y={640} scale={0.95} expression={e} blinkSeed={i * 5 + 50} />
        </Stage>
      ))}
      {T(30, 668, 'WANITA (baru) — ekspresi')}
      {F_EXPR.map((e, i) => (
        <Stage key={e} x={20 + i * 182} y={680} w={170} h={220} floor={220} warm={0.3} label={e}>
          <LitFemale id={`fe${i}`} x={85} y={570} scale={0.9} expression={e} blinkSeed={i * 3 + 9} />
        </Stage>
      ))}
      {T(30, 990, 'PRIA — pose (★ = baru) + properti otomatis')}
      {M_POSE.map(([p, e, ctx, nw], i) => {
        const col = i % 7, row = Math.floor(i / 7);
        const w = 330, h = 600, floor = 540, cx = w / 2;
        return (
          <Stage key={p} x={20 + col * 340} y={1010 + row * 660} w={w} h={h} floor={floor} label={(nw ? '★ ' : '') + p}>
            <Reflect floor={floor} op={0.16} depth={60}>
              {ctxEl(ctx, cx, floor)}
              {ctx === 'lie' ? (
                <g>
                  <rect x={10} y={floor - 170} width={310} height={110} rx={26} fill="#4A3F63" />
                  <g transform={`translate(20,${floor - 170}) rotate(90)`}><LitCharacter id={`mp${i}`} x={0} y={0} scale={0.42} pose={p} expression={e} blinkSeed={i * 7} phoneColor="#FF5FA2" /></g>
                </g>
              ) : (
                <LitCharacter id={`mp${i}`} x={cx} y={ctx === 'stairs' ? floor - 60 : floor} scale={0.62} pose={p} expression={e} blinkSeed={i * 7 + 300} phoneColor="#FF5FA2"
                  outfit={p === 'groom_standing' ? 'groom' : 'bomber'} />
              )}
              {ctx === 'desk' && <rect x={cx - 150} y={floor - 150} width={300} height={22} rx={6} fill="#5A4636" />}
            </Reflect>
          </Stage>
        );
      })}
      {T(30, 3010, 'WANITA — pose (sitting_bed_edge = membelakangi kamera)')}
      {F_POSE.map(([p, e], i) => {
        const w = 280, h = 560, floor = 500, cx = w / 2;
        return (
          <Stage key={p} x={20 + i * 296} y={3030} w={w} h={h} floor={floor} warm={0.3} label={p}>
            <Reflect floor={floor} op={0.16} depth={60}>
              {p === 'sitting_bed_edge_hugging_knees' && <rect x={cx - 130} y={floor - 150} width={260} height={150} rx={24} fill="#4A3F63" />}
              <LitFemale id={`fp${i}`} x={cx} y={floor} scale={0.66} pose={p} expression={e} blinkSeed={i * 5 + 3} />
            </Reflect>
          </Stage>
        );
      })}
      {T(30, 3700, 'BERDAMPINGAN — HOOK (jas pengantin + busana pengantin) · harian · cek kontras di ruangan gelap kebiruan')}
      <Stage x={20} y={3720} w={760} h={780} floor={720} warm={0.6} label="HOOK: groom_standing + bride standing_smile">
        <LitCharacter id="gr" x={260} y={720} scale={0.95} pose="groom_standing" expression="happy" outfit="groom" />
        <LitFemale id="br" x={500} y={720} scale={0.9} pose="standing_smile" expression="happy" outfit="bride" />
      </Stage>
      <Stage x={800} y={3720} w={760} h={780} floor={720} label="harian: bomber navy + hijab dusty rose (rim + halo)">
        <LitCharacter id="dm" x={260} y={720} scale={0.95} expression="neutral" />
        <LitFemale id="df" x={500} y={720} scale={0.9} pose="standing_smile" expression="hopeful" />
      </Stage>
      <Stage x={1580} y={3720} w={800} h={780} floor={720} label="tanpa rim (kiri) vs dengan rim (kanan) — background navy">
        <g><Character id="nr" x={150} y={720} scale={0.72} expression="neutral" /><FemaleCharacter id="nf" x={300} y={720} scale={0.68} pose="standing_still" /></g>
        <LitCharacter id="wr" x={500} y={720} scale={0.72} expression="neutral" />
        <LitFemale id="wf" x={660} y={720} scale={0.68} pose="standing_still" />
      </Stage>
    </svg>
  </AbsoluteFill>
);
