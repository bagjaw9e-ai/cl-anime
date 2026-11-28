// CHARACTER SHEET video "nikah dengan pecandu": semua pose/ekspresi BARU (★) + rig anak baru + siluet keluarga + cek kontras rim.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Character, Expression, Outfit, PoseName} from './components/Character';
import {FExpression, FOutfit, FPoseName, FemaleCharacter} from './components/FemaleCharacter';
import {CExpression, CPoseName} from './components/ChildCharacter';
import {LitCharacter, LitChild, LitFemale, Reflect} from './components/Lit';
import {Silhouette} from './components/Silhouette';
import {Stage} from './Stage';

export const SHEET_W = 2400;
export const SHEET_H = 6340;

const T = (x: number, y: number, s: string, size = 34) => <text x={x} y={y} fontFamily="Poppins" fontWeight={800} fontSize={size} fill="#F2EEE6">{s}</text>;

type Ctx = 'none' | 'akad' | 'sofa' | 'bedEdge' | 'bed' | 'fridge' | 'dash' | 'lift' | 'door' | 'doorway' | 'window' | 'lamps';
// konteks properti ruangan sederhana (hanya untuk sheet), b = di belakang karakter, f = di depan
const ctxBack = (c: Ctx, w: number, fl: number, f: number) => {
  switch (c) {
    case 'sofa': return <g><rect x={30} y={fl - 150} width={w - 60} height={150} rx={26} fill="#5A3F5E" /><rect x={20} y={fl - 230} width={90} height={230} rx={30} fill="#6E4C72" /></g>;
    case 'bedEdge': return <g><rect x={20} y={fl - 120} width={w - 40} height={120} rx={18} fill="#4A5578" /><rect x={20} y={fl - 140} width={w - 40} height={34} rx={14} fill="#E8E2D6" /></g>;
    case 'bed': return <g><rect x={14} y={fl - 150} width={w - 28} height={150} rx={18} fill="#3A4462" /><rect x={14} y={fl - 170} width={w - 28} height={40} rx={16} fill="#E8E2D6" /><rect x={10} y={fl - 300} width={36} height={300} rx={10} fill="#5A4A3A" /><ellipse cx={80} cy={fl - 196} rx={56} ry={26} fill="#F4EFE6" /></g>;
    case 'fridge': return <g><rect x={w - 140} y={fl - 420} width={130} height={420} rx={14} fill="#C9D2E0" /><rect x={w - 132} y={fl - 330} width={10} height={90} rx={5} fill="#8A94A6" /><rect x={w - 116} y={fl - 300} width={90} height={120} rx={6} fill="#FFF8E6" />{[0, 1, 2].map((i) => <g key={i}><rect x={w - 108} y={fl - 288 + i * 36} width={18} height={18} rx={3} fill="none" stroke="#5A6170" strokeWidth={2.5} />{i === 1 && <path d={`M ${w - 105} ${fl - 244} l 6 7 l 12 -16`} stroke="#E8203A" strokeWidth={3.5} fill="none" />}<rect x={w - 84} y={fl - 282 + i * 36} width={50} height={6} rx={3} fill="#5A6170" /></g>)}</g>;
    case 'dash': return <g><rect x={w - 200} y={fl - 230} width={190} height={60} rx={14} fill="#2A2E3A" /><circle cx={w - 110} cy={fl - 200} r={16} fill="#FF3B3B" opacity={0.6 + 0.4 * Math.sin(f * 0.4)} /></g>;
    case 'lift': return <g><rect x={w - 90} y={fl - 380} width={60} height={120} rx={10} fill="#3A3F4E" /><circle cx={w - 60} cy={fl - 340} r={16} fill="#FFC23F" /><path d={`M ${w - 68} ${fl - 336} l 8 -10 l 8 10 Z`} fill="#3A2A10" /><circle cx={w - 60} cy={fl - 296} r={16} fill="#5A6070" /></g>;
    case 'door': case 'doorway': return <g><rect x={w - 150} y={fl - 470} width={140} height={470} fill={c === 'doorway' ? '#FFD9A0' : '#6A4A36'} opacity={c === 'doorway' ? 0.55 : 1} /><rect x={w - 160} y={fl - 480} width={14} height={480} fill="#4A3426" />{c === 'door' && <circle cx={w - 134} cy={fl - 230} r={9} fill="#D9B46A" />}</g>;
    case 'window': return <g><rect x={w - 150} y={fl - 470} width={130} height={200} fill="#22304A" stroke="#8A94A6" strokeWidth={8} /><path d={`M ${w - 110} ${fl - 400} l 20 30 l -26 22 l 34 18`} stroke="#DDEBFF" strokeWidth={3} fill="none" /></g>;
    case 'lamps': return <g><rect x={30} y={fl - 150} width={60} height={150} fill="#3A3040" /><circle cx={60} cy={fl - 180} r={26} fill="#FFD9A0" opacity={0.35} /><g transform={`translate(${w - 60},${fl - 170})`}><rect x={-16} y={-30} width={32} height={58} rx={6} fill="#14151B" /><rect x={-12} y={-25} width={24} height={46} rx={4} fill="#FF4FA8" opacity={0.9} /><circle r={60} fill="#FF4FA8" opacity={0.18} /></g></g>;
    default: return null;
  }
};
const ctxFront = (c: Ctx, w: number, fl: number) => c === 'akad' ? (
  <g><rect x={40} y={fl - 52} width={w - 80} height={16} rx={6} fill="#8A5A3A" /><rect x={56} y={fl - 38} width={w - 112} height={38} fill="#6E4630" /><rect x={40} y={fl - 58} width={w - 80} height={12} rx={6} fill="#F4EEE0" />
    <g transform={`translate(${w / 2 - 40},${fl - 64}) rotate(-6)`}><rect x={-30} y={-10} width={60} height={14} rx={3} fill="#2E6B4E" /><rect x={-26} y={-8} width={52} height={9} fill="#E8D9A8" /></g></g>
) : null;

type MP = [PoseName, Expression, Ctx, Outfit?];
const MALE_POSES: MP[] = [
  ['shaking_hands_akad', 'happy', 'akad', 'koko'], ['slipping_ring', 'happy', 'akad', 'koko'], ['standing_in_fantasy_swirl', 'overwhelmed', 'none'],
  ['holding_house_of_cards', 'distant', 'none'], ['lounging_on_armrest_phone', 'hooked', 'sofa'], ['wearing_thick_gloves', 'bored', 'none'],
  ['earphones_ignoring', 'bored', 'none'], ['ticking_checklist_blindly', 'cold', 'fridge'], ['comparing_two_lights', 'irritated', 'lamps'],
  ['back_turned_frosty', 'cold', 'none'], ['throwing_pebbles', 'angry', 'window'], ['sleeping_soundly_back_turned', 'flat', 'bed'],
  ['sticking_sticker_on_warning_light', 'denial', 'dash'], ['peering_through_binoculars', 'hooked', 'none'], ['chasing_fireflies', 'hooked', 'none'],
  ['pressing_elevator_button_up', 'determined', 'lift'], ['raising_huge_shield', 'defensive', 'none'], ['slamming_door_shut', 'explosive', 'door'],
  ['head_full_of_tangled_wires', 'overwhelmed', 'none'], ['storm_cloud_head', 'irritated', 'none'],
];
type FP = [FPoseName, FExpression, Ctx, FOutfit?];
const FEMALE_POSES: FP[] = [
  ['offering_model_house', 'hopeful', 'none'], ['waving_unnoticed', 'hurt', 'none'], ['holding_husband_hand_warm', 'loving', 'none'],
  ['talking_soundwave', 'hopeful', 'none'], ['shielding_heart_glow', 'hurt', 'none'], ['leaning_against_door', 'scared', 'door'],
  ['lying_awake_in_bed', 'exhausted', 'bed'], ['standing_in_doorway_light', 'hopeful', 'doorway'], ['holding_tin_can_phone', 'confused', 'none'],
  ['holding_torn_umbrella_over_child', 'protective', 'none'],
];
const M_EXPR: Array<[Expression, boolean]> = [['distant', true], ['defensive', true], ['denial', true], ['overwhelmed', true], ['smug', false], ['hooked', false],
  ['bored', false], ['cold', false], ['irritated', false], ['explosive', false], ['flat', false]];
const F_EXPR: Array<[FExpression, boolean]> = [['loving', true], ['exhausted', true], ['protective', true], ['hopeful', false], ['confused', false], ['hurt', false],
  ['uncomfortable', false], ['scared', false]];
const C_EXPR: CExpression[] = ['neutral', 'happy', 'curious', 'scared', 'sad', 'crying', 'hiding'];
const C_POSE: Array<[CPoseName, CExpression]> = [['standing', 'curious'], ['hugging_teddy', 'scared'], ['peeking_from_door', 'scared'], ['covering_ears', 'crying'], ['hiding_behind_mother', 'scared']];

export const CharacterSheet: React.FC = () => {
  const f = useCurrentFrame();
  const TW = 460, TH = 620, FL = 560;
  return (
    <AbsoluteFill style={{background: '#07090D'}}>
      <svg width={SHEET_W} height={SHEET_H}>
        {T(30, 52, 'SUAMI (rig lama) — ekspresi: ★ = BARU (distant, defensive, denial, overwhelmed) + ekspresi rig lama yang dipakai · rim + halo')}
        {M_EXPR.map(([e, nw], i) => (
          <Stage key={e} x={20 + i * 214} y={76} w={204} h={250} floor={250} label={(nw ? '★ ' : '') + e}>
            <LitCharacter id={`me${i}`} x={102} y={640} scale={0.95} expression={e} blinkSeed={i * 5 + 40} />
          </Stage>
        ))}
        {T(30, 400, 'SUAMI — 20 POSE BARU ★ (props otomatis: tangan wali, cincin, rumah kartu, HP baru 18+, sarung tangan karet, headphone, spidol, embun beku, kerikil, selimut, stiker AMAN, teropong, perisai, kabel kusut, awan badai, koko+peci)')}
        {MALE_POSES.map(([p, e, c, o], i) => {
          const col = i % 5, row = Math.floor(i / 5), X0 = 20 + col * (TW + 14), Y0 = 424 + row * (TH + 54);
          const cx = c === 'akad' ? TW / 2 + 60 : c === 'sofa' ? TW / 2 + 40 : c === 'bed' ? TW / 2 + 40 : c === 'fridge' || c === 'dash' || c === 'lift' || c === 'door' || c === 'window' ? TW / 2 - 50 : TW / 2;
          return (
            <Stage key={p} x={X0} y={Y0} w={TW} h={TH} floor={FL} warm={c === 'akad' ? 0.8 : 0} label={'★ ' + p}>
              <Reflect floor={FL} op={0.15} depth={60}>
                {ctxBack(c, TW, FL, f)}
                <LitCharacter id={`mp${i}`} x={cx} y={c === 'bed' ? FL - 150 : c === 'sofa' ? FL - 30 : FL} scale={0.6} pose={p} expression={e} outfit={o} blinkSeed={i * 7 + 300} phoneColor="#FF4FA8" />
                {ctxFront(c, TW, FL)}
              </Reflect>
            </Stage>
          );
        })}
        {T(30, 3130, 'ISTRI (rig lama, hijab dusty rose) — ekspresi ★ BARU (loving, exhausted, protective) + lama · outfit kebaya putih akad BARU')}
        {F_EXPR.map(([e, nw], i) => (
          <Stage key={e} x={20 + i * 214} y={3154} w={204} h={250} floor={250} label={(nw ? '★ ' : '') + e}>
            <LitFemale id={`fe${i}`} x={102} y={610} scale={0.95} expression={e} blinkSeed={i * 3 + 11} />
          </Stage>
        ))}
        {T(30, 3478, 'ISTRI — 10 POSE BARU ★ (props: rumah kartu, gelombang suara, cahaya hati, cahaya tangan hangat, selimut, kaleng telepon, payung sobek)')}
        {FEMALE_POSES.map(([p, e, c, o], i) => {
          const col = i % 5, row = Math.floor(i / 5), X0 = 20 + col * (TW + 14), Y0 = 3502 + row * (TH + 54);
          const cx = c === 'door' || c === 'doorway' ? TW / 2 - 40 : c === 'bed' ? TW / 2 + 60 : p === 'holding_torn_umbrella_over_child' ? TW / 2 + 70 : p === 'talking_soundwave' || p === 'holding_tin_can_phone' ? TW / 2 + 70 : TW / 2;
          return (
            <Stage key={p} x={X0} y={Y0} w={TW} h={TH} floor={FL} label={'★ ' + p}>
              <Reflect floor={FL} op={0.15} depth={60}>
                {ctxBack(c, TW, FL, f)}
                <LitFemale id={`fp${i}`} x={cx} y={c === 'bed' ? FL - 150 : FL} scale={0.6} pose={p} expression={e} outfit={o} blinkSeed={i * 5 + 70} haloColor="#FFB3C8" />
                {p === 'holding_torn_umbrella_over_child' && <LitChild id="uc" x={cx - 150} y={FL} scale={0.6} pose="hiding_behind_mother" expression="scared" />}
              </Reflect>
            </Stage>
          );
        })}
        {T(30, 4888, 'OUTFIT AKAD (HOOK) ★ BARU: suami baju koko putih + peci · istri kebaya putih brokat + rok songket  |  SILUET KELUARGA (opsional Fase 3, pose ★ BARU)')}
        <Stage x={20} y={4912} w={940} h={480} floor={440} warm={0.8} label="★ outfit koko + peci (suami) & kebaya (istri)">
          <Reflect floor={440} op={0.15} depth={40}>
            <LitFemale id="kb" x={300} y={440} scale={0.62} outfit="kebaya" expression="hopeful" pose="standing_still" />
            <LitCharacter id="kk" x={640} y={440} scale={0.6} outfit="koko" expression="happy" />
          </Reflect>
        </Stage>
        <Stage x={980} y={4912} w={700} h={480} floor={440} label="★ ibu mertua tersentak (flinch) · adik tutup mulut (cover_mouth)">
          <Silhouette x={230} y={440} scale={0.62} type="mother" pose="flinch" rim="#FFB3B8" fill="#3A3440" />
          <Silhouette x={480} y={440} scale={0.62} type="teen" pose="cover_mouth" rim="#FFB3B8" fill="#3A3440" />
        </Stage>
        <Stage x={1700} y={4912} w={680} h={480} floor={440} label="★ flaunting_ring_hand (pose tambahan BARU, beat 2: cincin -> kabel -> HP 18+)">
          <Reflect floor={440} op={0.15} depth={40}><LitCharacter id="fr" x={280} y={440} scale={0.6} pose="flaunting_ring_hand" expression="smug" haloColor="#FF3B4A" /></Reflect>
        </Stage>
        {T(30, 5458, 'ANAK (rig BARU ★): laki-laki ±6 th, kepala besar, piyama kuning pucat bermotif bintang, boneka beruang — 7 ekspresi + 4 pose brief (+ berdiri)')}
        {C_EXPR.map((e, i) => (
          <Stage key={e} x={20 + i * 170} y={5482} w={160} h={220} floor={220} label={'★ ' + e}>
            <LitChild id={`ce${i}`} x={80} y={405} scale={0.95} expression={e} blinkSeed={i * 3 + 21} />
          </Stage>
        ))}
        {C_POSE.map(([p, e], i) => (
          <Stage key={p} x={1230 + i * 232} y={5482} w={222} h={420} floor={390} label={'★ ' + p}>
            <Reflect floor={390} op={0.15} depth={40}>
              {p === 'peeking_from_door' && <g><rect x={150} y={20} width={80} height={370} fill="#6A4A36" /><rect x={142} y={14} width={12} height={376} fill="#4A3426" /></g>}
              <LitChild id={`cp${i}`} x={p === 'peeking_from_door' ? 96 : p === 'hiding_behind_mother' ? 80 : 111} y={390} scale={0.82} pose={p} expression={e} blinkSeed={i * 5 + 3} />
              {p === 'hiding_behind_mother' && <FemaleCharacter id="hm" x={230} y={390} scale={0.62} expression="protective" pose="standing_still" />}
            </Reflect>
          </Stage>
        ))}
        {T(30, 5988, 'CEK KONTRAS di latar senada (garasi biru / apartemen pink / kuning hangat): tanpa rim (kiri) vs rim light 2 sisi + halo (kanan)', 28)}
        <Stage x={20} y={6012} w={2360} h={300} floor={290} label="">
          <rect x={0} y={0} width={780} height={300} fill="#16324A" opacity={0.8} />
          <rect x={780} y={0} width={800} height={300} fill="#3A1636" opacity={0.8} />
          <rect x={1580} y={0} width={780} height={300} fill="#3A3016" opacity={0.8} />
          <g transform="translate(220,290) scale(0.42)"><Character id="nr" x={0} y={0} expression="cold" /></g>
          <LitCharacter id="wr" x={520} y={290} scale={0.42} expression="cold" haloColor="#8FD0FF" rimColor2="#8FD0FF" />
          <g transform="translate(1000,290) scale(0.44)"><FemaleCharacter id="nf" x={0} y={0} expression="hurt" /></g>
          <LitFemale id="wf" x={1320} y={290} scale={0.44} expression="hurt" haloColor="#FF9FC0" rimColor2="#FF9FC0" />
          <g transform="translate(1800,290) scale(0.62)"><LitChild id="nc0" x={0} y={0} expression="sad" rim={false} halo={0} /></g>
          <LitChild id="wc" x={2100} y={290} scale={0.62} expression="sad" haloColor="#FFC56A" />
        </Stage>
      </svg>
    </AbsoluteFill>
  );
};
