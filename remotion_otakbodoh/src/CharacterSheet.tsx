import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character, Expression, PoseName} from './components/Character';
import {LitCharacter, Reflect} from './components/Lit';
import {Silhouette, SilPose, SilType} from './components/Silhouette';
import {Stage} from './Stage';

export const SHEET_W = 2400;
export const SHEET_H = 3500;

const NEW_E: Expression[] = ['struggling', 'blank', 'hopeless'];
const OLD_E: Expression[] = ['dazed', 'hooked', 'guilty', 'worried', 'thinking', 'curious', 'relieved', 'confused', 'irritated', 'angry', 'tempted',
  'ashamed', 'empty_stare', 'tired', 'lazy', 'determined', 'unfocused'];
type Ctx = 'none' | 'seat' | 'table' | 'desk' | 'water';
const POSES: Array<[PoseName, Expression, Ctx, boolean]> = [
  ['chained_to_phone', 'struggling', 'none', true], ['standing_still_lookup', 'worried', 'none', true], ['sitting_desk_study', 'thinking', 'desk', true],
  ['running_hamster_wheel', 'struggling', 'none', true], ['puppet_pulled', 'ashamed', 'none', true], ['fist_clenched', 'angry', 'none', true],
  ['sitting_meeting_blank', 'blank', 'table', true], ['procrastinating_slumped', 'lazy', 'seat', true], ['walking_treadmill', 'hopeless', 'none', true],
  ['head_down', 'hopeless', 'none', true],
  ['holding_phone', 'hooked', 'none', false], ['blocking_hand', 'determined', 'none', false], ['scratching_head', 'confused', 'none', false],
  ['pointing_up', 'curious', 'none', false], ['walking', 'tempted', 'none', false], ['being_dragged', 'struggling', 'water', false],
  ['shaking_head', 'ashamed', 'none', false],
];
const SILS: Array<[SilType, SilPose, string]> = [
  ['man', 'talk', 'rekan kerja (ngajak diskusi)'], ['man', 'sit', 'rekan rapat (duduk)'], ['friend', 'look', 'rekan (lihat)'], ['woman', 'talk', 'rekan wanita'],
];
const T = (x: number, y: number, s: string) => <text x={x} y={y} fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#F2EEE6">{s}</text>;
const ctxEl = (ctx: Ctx, cx: number, fl: number) => {
  if (ctx === 'seat' || ctx === 'bench') return <rect x={cx - 120} y={fl - 90} width={240} height={90} rx={ctx === 'bench' ? 8 : 24} fill={ctx === 'bench' ? '#5A4A6E' : '#3A4152'} />;
  if (ctx === 'water') return <path d={`M ${cx - 170} ${fl - 30} Q ${cx} ${fl - 70} ${cx + 170} ${fl - 30} L ${cx + 170} ${fl} L ${cx - 170} ${fl} Z`} fill="#C0262E" opacity={0.6} />;
  return null;
};
const tableFront = (ctx: Ctx, cx: number, fl: number) => ctx === 'desk' ? <g><rect x={cx - 165} y={fl - 140} width={330} height={18} rx={6} fill="#4A5A7A" /><rect x={cx - 150} y={fl - 122} width={300} height={122} fill="#2C3650" /><path d={`M ${cx - 80} ${fl - 142} L ${cx + 50} ${fl - 142} L ${cx + 60} ${fl - 152} L ${cx - 70} ${fl - 152} Z`} fill="#F2EEE6" /></g> : ctx === 'table' ? <g><rect x={cx - 165} y={fl - 140} width={330} height={18} rx={6} fill="#5A6478" /><rect x={cx - 150} y={fl - 122} width={300} height={122} fill="#343C4E" /></g> : null;

export const CharacterSheet: React.FC = () => (
  <AbsoluteFill style={{background: '#07090D'}}>
    <svg width={SHEET_W} height={SHEET_H}>
      {T(30, 50, 'KARAKTER UTAMA — 20 ekspresi video otak bodoh (★ = baru) · rim light + halo aktif · blank = ikon loading')}
      {[...NEW_E, ...OLD_E].map((e, i) => (
        <Stage key={e} x={20 + (i % 10) * 238} y={70 + Math.floor(i / 10) * 300} w={224} h={250} floor={250} label={(i < NEW_E.length ? '★ ' : '') + e}>
          <LitCharacter id={`e${i}`} x={112} y={660} scale={1.05} expression={e} blinkSeed={i * 5 + 50} />
        </Stage>
      ))}
      {T(30, 700, 'KARAKTER UTAMA — 17 pose video otak bodoh (★ = baru) · props otomatis: rantai, roda hamster, tali boneka, treadmill, pensil, ikon loading')}
      {POSES.map(([p, e, ctx, nw], i) => {
        const col = i % 7, row = Math.floor(i / 7), w = 330, h = 560, fl = 500, cx = w / 2;
        return (
          <Stage key={p} x={20 + col * 340} y={720 + row * 620} w={w} h={h} floor={fl} warm={0} label={(nw ? '★ ' : '') + p}>
            <Reflect floor={fl} op={0.15} depth={50}>
              {ctxEl(ctx, cx, fl)}
              <LitCharacter id={`p${i}`} x={cx} y={fl} scale={0.6} pose={p} expression={e} blinkSeed={i * 7 + 300} phoneColor="#FF3B3B" />
              {tableFront(ctx, cx, fl)}
            </Reflect>
          </Stage>
        );
      })}
      {T(30, 2600, 'SILUET ABU-ABU ala ref_1 — karakter sekunder tanpa wajah + rim tipis')}
      {SILS.map(([ty, po, lb], i) => (
        <Stage key={i} x={20 + i * 296} y={2620} w={282} h={520} floor={470} warm={0} label={lb}>
          {po === 'sit' && <rect x={60} y={320} width={170} height={150} rx={20} fill="#3A4152" />}
          <Silhouette x={141} y={470} scale={0.58} type={ty} pose={po} seed={i + 1} rim="#BFD4FF" />
        </Stage>
      ))}
      {T(30, 3230, 'CEK KONTRAS di latar gelap kebiruan: tanpa rim (kiri) vs dengan rim + halo, siluet ber-rim tipis')}
      <Stage x={20} y={3250} w={2360} h={220} floor={220} label="">
        <g transform="translate(300,212) scale(0.3)"><Character id="nr" x={0} y={0} expression="neutral" /></g>
        <LitCharacter id="wr" x={620} y={212} scale={0.3} expression="neutral" />
        <Silhouette x={980} y={212} scale={0.3} type="man" pose="talk" rim="#BFD4FF" />
        <Silhouette x={1240} y={212} scale={0.3} type="friend" pose="look" rim="#BFD4FF" />
        <LitCharacter id="wr2" x={1640} y={212} scale={0.3} expression="blank" haloColor="#BFD4FF" />
      </Stage>
    </svg>
  </AbsoluteFill>
);
