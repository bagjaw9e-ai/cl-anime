import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character, Expression, PoseName} from './components/Character';
import {LitCharacter, Reflect} from './components/Lit';
import {Silhouette, SilPose, SilType} from './components/Silhouette';
import {Stage} from './Stage';

export const SHEET_W = 2400;
export const SHEET_H = 3800;

const NEW_E: Expression[] = ['excited', 'explosive', 'daydreaming', 'ashamed', 'lost', 'tired', 'unfocused', 'empty_stare', 'avoiding_eye_contact'];
const OLD_E: Expression[] = ['guilty', 'hooked', 'oblivious', 'irritated', 'angry', 'cold', 'dazed', 'worried', 'relieved', 'thinking', 'neutral'];
type Ctx = 'none' | 'seat' | 'table' | 'bench' | 'cake' | 'water';
const POSES: Array<[PoseName, Expression, Ctx, boolean]> = [
  ['blowing_candle', 'excited', 'cake', true], ['holding_phone_hidden', 'guilty', 'none', true], ['sitting_dinner_table', 'irritated', 'table', true],
  ['slamming_table', 'explosive', 'table', true], ['pointing_angry', 'angry', 'none', true], ['standing_tense', 'irritated', 'none', true],
  ['walking_street', 'daydreaming', 'none', true], ['sitting_bus_stop', 'ashamed', 'bench', true], ['being_dragged', 'dazed', 'water', true],
  ['sitting_meeting', 'lost', 'table', true], ['scratching_head', 'lost', 'none', true], ['looking_down', 'ashamed', 'none', true],
  ['slumped', 'tired', 'seat', false], ['pointing_up', 'excited', 'none', false], ['arms_crossed', 'cold', 'none', false],
  ['holding_phone', 'hooked', 'none', false], ['standing_relaxed', 'avoiding_eye_contact', 'none', false],
];
const SILS: Array<[SilType, SilPose, string]> = [
  ['mother', 'step_back', 'ibu (mundur)'], ['child', 'spill', 'adik (numpahin air)'], ['woman_hijab', 'walk_away', 'pasangan (menjauh)'],
  ['woman_hijab', 'hug_bag', 'perempuan di halte (sopan, peluk tas)'], ['man', 'talk', 'lawan bicara (ngobrol)'], ['friend', 'clap', 'teman pesta (tepuk tangan)'],
  ['woman', 'clap', 'teman pesta'], ['man', 'sit', 'lawan bicara duduk'],
];
const T = (x: number, y: number, s: string) => <text x={x} y={y} fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#F2EEE6">{s}</text>;
const ctxEl = (ctx: Ctx, cx: number, fl: number) => {
  if (ctx === 'seat' || ctx === 'bench') return <rect x={cx - 120} y={fl - 150} width={240} height={150} rx={ctx === 'bench' ? 8 : 24} fill={ctx === 'bench' ? '#5A4A6E' : '#3A4152'} />;
  if (ctx === 'cake') return (
    <g transform={`translate(${cx},${fl})`}>
      <rect x={-130} y={-230} width={260} height={230} rx={10} fill="#5A4636" />
      <rect x={-90} y={-330} width={180} height={100} rx={14} fill="#F6D9E4" /><rect x={-90} y={-330} width={180} height={24} rx={12} fill="#FFFFFF" />
      <text x={0} y={-350} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={60} fill="#F2C94C">25</text>
      <circle cx={-18} cy={-410} r={12} fill="#FFC870" opacity={0.9} /><circle cx={18} cy={-410} r={12} fill="#FFC870" opacity={0.9} />
    </g>
  );
  if (ctx === 'water') return <path d={`M ${cx - 170} ${fl - 30} Q ${cx} ${fl - 70} ${cx + 170} ${fl - 30} L ${cx + 170} ${fl} L ${cx - 170} ${fl} Z`} fill="#C0262E" opacity={0.6} />;
  return null;
};
const tableFront = (ctx: Ctx, cx: number, fl: number) => ctx === 'table' ? <g><rect x={cx - 165} y={fl - 200} width={330} height={20} rx={6} fill="#6E5A46" /><rect x={cx - 150} y={fl - 180} width={300} height={180} fill="#4A3C30" /></g> : null;

export const CharacterSheet: React.FC = () => (
  <AbsoluteFill style={{background: '#07090D'}}>
    <svg width={SHEET_W} height={SHEET_H}>
      {T(30, 50, 'KARAKTER UTAMA — ekspresi baru (★) + yang dipakai ulang · rim light + halo aktif')}
      {[...NEW_E, ...OLD_E].map((e, i) => (
        <Stage key={e} x={20 + (i % 10) * 238} y={70 + Math.floor(i / 10) * 300} w={224} h={250} floor={250} label={(i < NEW_E.length ? '★ ' : '') + e}>
          <LitCharacter id={`e${i}`} x={112} y={660} scale={1.05} expression={e} blinkSeed={i * 5 + 50} />
        </Stage>
      ))}
      {T(30, 1010, 'KARAKTER UTAMA — pose baru (★) + yang dipakai ulang · props otomatis (HP di balik punggung, pipi tiup lilin)')}
      {POSES.map(([p, e, ctx, nw], i) => {
        const col = i % 7, row = Math.floor(i / 7), w = 330, h = 560, fl = 500, cx = w / 2;
        return (
          <Stage key={p} x={20 + col * 340} y={1030 + row * 620} w={w} h={h} floor={fl} warm={i < 6 ? 0.6 : 0} label={(nw ? '★ ' : '') + p}>
            <Reflect floor={fl} op={0.15} depth={50}>
              {ctxEl(ctx, p === 'blowing_candle' ? cx + 70 : cx, fl)}
              <LitCharacter id={`p${i}`} x={p === 'blowing_candle' ? cx - 60 : cx} y={fl} scale={0.6} pose={p} expression={e} blinkSeed={i * 7 + 300} phoneColor="#FF3B3B" />
              {tableFront(ctx, cx, fl)}
            </Reflect>
          </Stage>
        );
      })}
      {T(30, 2900, 'SILUET SAMPINGAN — polos gelap + rim light tipis, tanpa wajah (ibu, adik, pasangan, perempuan halte, lawan bicara, teman)')}
      {SILS.map(([ty, po, lb], i) => (
        <Stage key={i} x={20 + i * 296} y={2920} w={282} h={520} floor={470} warm={i < 3 ? 0.5 : 0} label={lb}>
          {po === 'sit' && <rect x={60} y={320} width={170} height={150} rx={20} fill="#3A4152" />}
          <Silhouette x={141} y={470} scale={0.58} type={ty} pose={po} seed={i + 1} rim={i < 3 ? '#FFC870' : '#BFD4FF'} />
        </Stage>
      ))}
      {T(30, 3530, 'CEK KONTRAS di latar gelap kebiruan: tanpa rim (kiri) vs dengan rim + halo, siluet ber-rim tipis')}
      <Stage x={20} y={3550} w={2360} h={220} floor={220} label="">
        <g transform="translate(300,212) scale(0.3)"><Character id="nr" x={0} y={0} expression="neutral" /></g>
        <LitCharacter id="wr" x={620} y={212} scale={0.3} expression="neutral" />
        <Silhouette x={980} y={212} scale={0.3} type="man" pose="talk" rim="#BFD4FF" />
        <Silhouette x={1240} y={212} scale={0.3} type="woman_hijab" pose="stand" rim="#FFC870" />
        <LitCharacter id="wr2" x={1640} y={212} scale={0.3} expression="avoiding_eye_contact" haloColor="#BFD4FF" />
      </Stage>
    </svg>
  </AbsoluteFill>
);
