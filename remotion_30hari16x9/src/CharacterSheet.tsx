import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character, Expression, PoseName} from './components/Character';
import {LitCharacter, Reflect} from './components/Lit';
import {Stage} from './Stage';

export const SHEET_W = 2400;
export const SHEET_H = 2860;

// ekspresi yang dibutuhkan video 30 hari 16:9 (★ = baru dibuat untuk video ini)
const NEW_E: Expression[] = ['sneaky', 'anxious', 'sweaty', 'embarrassed', 'peaceful'];
const OLD_E: Expression[] = ['curious', 'determined', 'bored', 'lonely', 'tempted', 'restless', 'proud', 'flat', 'sleepy', 'relieved', 'focused', 'confident'];
type Ctx = 'none' | 'mri' | 'drawer' | 'wall' | 'bench' | 'bed' | 'bin' | 'door' | 'thermo';
// SEMUA pose di bawah BARU (tidak ada di preview/used_assets.md)
const POSES: Array<[PoseName, Expression, Ctx]> = [
  ['sliding_into_mri', 'curious', 'mri'], ['locking_drawer', 'determined', 'drawer'], ['glancing_at_camera', 'sneaky', 'none'],
  ['tally_marks_on_wall', 'focused', 'wall'], ['walking_against_wind', 'sweaty', 'none'], ['bouncing_ball_on_wall', 'bored', 'none'],
  ['catching_sliding_phone', 'tempted', 'none'], ['closing_curtain', 'neutral', 'none'], ['hugging_self_scratching_arm', 'anxious', 'none'],
  ['pacing_shadow_double', 'restless', 'none'], ['lifting_balloon_barbell', 'embarrassed', 'none'], ['adjusting_wall_thermostat', 'relieved', 'thermo'],
  ['slumped_on_bench_with_umbrella', 'sleepy', 'bench'], ['tapping_foot_restless', 'restless', 'bench'], ['tossing_phone_in_bin', 'determined', 'bin'],
  ['jogging_in', 'peaceful', 'none'], ['holding_door_shut', 'determined', 'door'], ['archery_draw', 'focused', 'none'],
  ['flying_kite', 'confident', 'none'], ['grabbing_relay_baton', 'confident', 'none'], ['waking_up_stretching', 'relieved', 'bed'],
  ['following_glowing_footsteps', 'curious', 'none'], ['standing_tall_chest_out', 'proud', 'none'], ['presenting_link_up', 'confident', 'none'],
];
const T = (x: number, y: number, s: string) => <text x={x} y={y} fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#F2EEE6">{s}</text>;
const back = (ctx: Ctx, cx: number, fl: number) => {
  switch (ctx) {
    case 'mri': return <g><rect x={cx - 150} y={fl - 120} width={300} height={22} rx={10} fill="#C9D4E0" /><rect x={cx - 20} y={fl - 98} width={40} height={98} fill="#5A6478" /></g>;
    case 'drawer': return <g><rect x={cx + 40} y={fl - 170} width={160} height={170} rx={8} fill="#5A4636" /><rect x={cx + 54} y={fl - 150} width={132} height={60} rx={6} fill="#6E5844" /></g>;
    case 'wall': return <g><rect x={cx + 60} y={fl - 520} width={120} height={520} fill="#3A3448" />{[0, 1, 2].map((i) => <rect key={i} x={cx + 76 + i * 20} y={fl - 300} width={8} height={64} rx={3} fill="#FFF4E0" />)}</g>;
    case 'bench': return <rect x={cx - 140} y={fl - 150} width={280} height={24} rx={8} fill="#5A6478" />;
    case 'bed': return <g><rect x={cx - 160} y={fl - 150} width={320} height={150} rx={18} fill="#3A4A6A" /><rect x={cx - 150} y={fl - 170} width={300} height={40} rx={18} fill="#7A8AB0" /></g>;
    case 'bin': return <path d={`M ${cx + 90} ${fl - 130} L ${cx + 170} ${fl - 130} L ${cx + 160} ${fl} L ${cx + 100} ${fl} Z`} fill="#5A6170" />;
    case 'door': return <g><rect x={cx + 90} y={fl - 440} width={110} height={440} fill="#5A3A2A" /><circle cx={cx + 104} cy={fl - 220} r={7} fill="#E3C66A" /></g>;
    case 'thermo': return <g><rect x={cx + 150} y={fl - 400} width={40} height={400} fill="#3A3448" /><circle cx={cx + 150} cy={fl - 300} r={22} fill="#E8ECF4" /></g>;
    default: return null;
  }
};
const front = (ctx: Ctx, cx: number, fl: number) => ctx === 'bed' ? <rect x={cx - 170} y={fl - 110} width={340} height={110} rx={20} fill="#5A6A90" opacity={0.92} /> : null;

export const CharacterSheet: React.FC = () => (
  <AbsoluteFill style={{background: '#07090D'}}>
    <svg width={SHEET_W} height={SHEET_H}>
      {T(30, 50, '17 ekspresi video 30 hari 16:9 (★ = baru: sneaky, anxious, sweaty, embarrassed, peaceful) · rim light + halo aktif')}
      {[...NEW_E, ...OLD_E].map((e, i) => (
        <Stage key={e} x={20 + (i % 9) * 264} y={70 + Math.floor(i / 9) * 300} w={250} h={250} floor={250} label={(i < NEW_E.length ? '★ ' : '') + e}>
          <LitCharacter id={`e${i}`} x={125} y={680} scale={1.1} expression={e} blinkSeed={i * 5 + 50} />
        </Stage>
      ))}
      {T(30, 700, '24 POSE BARU (semua belum pernah dipakai, cek preview/used_assets.md) · props otomatis: kapur, barbel balon, payung, busur+panah, tongkat estafet, kunci, benang layangan')}
      {POSES.map(([p, e, ctx], i) => {
        const col = i % 8, row = Math.floor(i / 8), w = 286, h = 560, fl = 500, cx = w / 2;
        const lying = p === 'sliding_into_mri';
        return (
          <Stage key={p} x={20 + col * 296} y={720 + row * 640} w={w} h={h} floor={fl} label={'★ ' + p}>
            <Reflect floor={fl} op={0.15} depth={50}>
              {back(ctx, cx, fl)}
              {lying ? (
                <g transform={`translate(${cx + 110},${fl - 132}) rotate(-90) scale(0.4)`}><LitCharacter id={`p${i}`} x={0} y={0} scale={1} pose={p} expression={e} /></g>
              ) : (
                <LitCharacter id={`p${i}`} x={ctx === 'door' || ctx === 'thermo' ? cx - 30 : ctx === 'wall' ? cx - 40 : cx} y={fl} scale={0.52} pose={p} expression={e} blinkSeed={i * 7 + 300} phoneColor="#FF5FA2" />
              )}
              {front(ctx, cx, fl)}
            </Reflect>
          </Stage>
        );
      })}
      {T(30, 2650, 'Cek kontras di latar gelap kebiruan: tanpa rim (kiri) vs dengan rim + halo · tampak belakang (closing_curtain)')}
      <Stage x={20} y={2670} w={2360} h={170} floor={165} label="">
        <g transform="translate(300,162) scale(0.24)"><Character id="nr" x={0} y={0} expression="curious" /></g>
        <LitCharacter id="wr" x={620} y={162} scale={0.24} expression="curious" />
        <LitCharacter id="wb" x={940} y={162} scale={0.24} pose="closing_curtain" />
      </Stage>
    </svg>
  </AbsoluteFill>
);
