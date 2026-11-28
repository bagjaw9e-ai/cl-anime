// 1 STILL PER TEMPAT (cek: latar samar + blur DOF + lantai mengkilap & pantulan, kontras karakter vs latar, tone, panel neon + ikon +
// baterai dengan logo charge). Satu frame komposisi = satu tempat.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Cam} from './kit';
import {FLOOR_Y, Tone} from './theme';
import {ScreenVignette, ShotLayers} from './ShotLayers';
import {Grain} from './components/Bg';
import {Halo, LitCharacter, LitChild, LitFemale, Reflect, Rise} from './components/Lit';
import {APT, GAR, HALL, PlaceAkad, PlaceApartment, PlaceDarkRoom, PlaceGarage, PlaceHallKid, PlaceInviteDesk, PlaceNewlywed, PlaceStage, TONES} from './components/PlacesNikah';
import {BatteryProgress, NeonPanelView} from './components/NeonPanel';
import {AkadTable, FantasySwirl, InviteInk} from './illustrations/nk/hook';
import {SofaFg} from './illustrations/nk/furniture';
import {ForcedDoor, KettleBoil, TissueCube} from './illustrations/nk/fase1';
import {FireflySwarm, WeekBeakers} from './illustrations/nk/fase2';
import {HeartHouse, MonsterShadow, StitchedHead, StormCloud} from './illustrations/nk/fase3';
import {beatF} from './timeline';

type Still = {name: string; tone: Tone; cam: Cam; blur: number; dim: number; panel?: number; bg: (t: number, tone: Tone) => React.ReactNode; fg: (t: number) => React.ReactNode};
const T = 70; // frame contoh untuk animasi ilustrasi
const L = (x: number, s = 1, y = FLOOR_Y) => ({x, y, scale: s});

export const PLACES: Still[] = [
  {name: '00_hook1_meja_akad', tone: TONES.akad, cam: {x: 520, y: 960, s: 1.12}, blur: 6, dim: 0.3, bg: (t, tn) => <PlaceAkad tone={tn} t={t} />, fg: (t) => (
    <g>
      <Halo x={540} y={980} rx={520} ry={420} color="#FFD9A0" op={0.22} />
      <LitFemale id="sa1" {...L(360, 0.95, FLOOR_Y + 170)} outfit="kebaya" expression="hopeful" haloColor="#FFD9A0" />
      <LitCharacter id="sa2" {...L(660, 0.95)} pose="slipping_ring" outfit="koko" expression="happy" haloColor="#FFD9A0" />
      <g transform={`translate(540,${FLOOR_Y - 66})`}><AkadTable t={t} /></g>
    </g>
  )},
  {name: '01_hook2_kamar_gelap', tone: TONES.darkRoom, cam: {x: 600, y: 900, s: 1.12}, blur: 7, dim: 0.35, bg: (t, tn) => <PlaceDarkRoom tone={tn} t={t} />, fg: () => (
    <g>
      <Halo x={740} y={1180} rx={300} ry={160} color="#FF2A3A" op={0.25} />
      <LitCharacter id="sb1" {...L(470, 0.95)} expression="smug" pose="flaunting_ring_hand" haloColor="#FF3B4A" rimColor2="#FF8A90" />
    </g>
  )},
  {name: '02_hook3_meja_undangan', tone: TONES.inviteDesk, cam: {x: 540, y: 940, s: 1.1}, blur: 6, dim: 0.25, bg: (t, tn) => <PlaceInviteDesk tone={tn} t={t} />, fg: (t) => (
    <g><Halo x={540} y={980} rx={420} ry={300} color="#FFF1D6" op={0.2} /><g transform="translate(540,1000)"><InviteInk t={t} k={0.72} /></g></g>
  )},
  {name: '03_oneshot_kamar_pengantin_krem', tone: TONES.osCream, cam: {x: 540, y: 880, s: 1}, blur: 7, dim: 0.3, bg: (t, tn) => <PlaceNewlywed tone={tn} t={t} />, fg: (t) => (
    <g>
      <LitCharacter id="sc1" {...L(400, 0.95)} pose="standing_in_fantasy_swirl" expression="overwhelmed" haloColor="#FFE6C0" />
      <g transform="translate(400,470)"><FantasySwirl t={t} k={1} /></g>
      <LitFemale id="sc2" {...L(760, 0.95)} pose="offering_model_house" expression="hopeful" haloColor="#FFE6C0" />
    </g>
  )},
  {name: '04_oneshot_zoom_merah_gelap', tone: TONES.osRed, cam: {x: 560, y: 800, s: 1.9}, blur: 9, dim: 0.4, bg: (t, tn) => <PlaceNewlywed tone={tn} t={t} />, fg: () => (
    <g>
      <LitCharacter id="sd1" {...L(420, 0.95)} pose="holding_house_of_cards" expression="distant" haloColor="#FF4A5A" rimColor2="#FF8A90" />
      <LitFemale id="sd2" {...L(720, 0.95)} pose="standing_still" expression="confused" haloColor="#FF4A5A" rimColor2="#FF8A90" />
    </g>
  )},
  {name: '05_fase1_apartemen_ruang_tengah', tone: TONES.f1Base, cam: {x: 540, y: 900, s: 1}, blur: 7, dim: 0.35, panel: beatF(7, 30), bg: (t, tn) => <PlaceApartment tone={tn} t={t} />, fg: (t) => (
    <g>
      <Halo x={460} y={1000} rx={420} ry={320} color="#FF7AC8" op={0.2} />
      <g transform={`translate(${APT.sofaX},${FLOOR_Y})`}><SofaFg tone={TONES.f1Base} /></g>
      <LitCharacter id="se1" {...L(620, 0.95, FLOOR_Y - 40)} pose="lounging_on_armrest_phone" expression="hooked" phoneColor="#FF4FA8" haloColor="#FF7AC8" rimColor2="#FFB3E0" />
      <g transform="translate(212,880)"><TissueCube t={t} s={0.9} /></g>
    </g>
  )},
  {name: '06_fase1_dapur_zoom_hangat', tone: TONES.f1Warm, cam: {x: APT.stoveX + 60, y: 860, s: 1.35}, blur: 8, dim: 0.35, panel: beatF(19, 10), bg: (t, tn) => <PlaceApartment tone={tn} t={t} />, fg: (t) => (
    <g>
      <g transform={`translate(${APT.stoveX},770)`}><KettleBoil t={t} k={0.8} /></g>
      <LitCharacter id="sf1" {...L(APT.stoveX + 360, 0.95)} pose="storm_cloud_head" noProps expression="explosive" haloColor="#FFB060" />
    </g>
  )},
  {name: '07_fase1_kamar_pintu_merah', tone: TONES.f1Red, cam: {x: APT.doorX - 160, y: 860, s: 1.2}, blur: 8, dim: 0.4, panel: beatF(21, 20), bg: (t, tn) => <PlaceApartment tone={tn} t={t} doorRed={1} />, fg: (t) => (
    <g>
      <g transform={`translate(${APT.doorX},${FLOOR_Y - 460})`}><ForcedDoor t={t} k={1} /></g>
      <LitFemale id="sg1" {...L(APT.doorX - 300, 0.95)} pose="leaning_against_door" expression="scared" haloColor="#FF4A5A" rimColor2="#FF8A90" />
    </g>
  )},
  {name: '08_fase2_garasi', tone: TONES.f2Base, cam: {x: 900, y: 880, s: 0.92}, blur: 7, dim: 0.35, panel: beatF(32, 20), bg: (t, tn) => <PlaceGarage tone={tn} t={t} />, fg: (t) => (
    <g>
      <LitCharacter id="sh1" {...L(780, 0.95)} pose="chasing_fireflies" expression="hooked" haloColor="#4FD8FF" rimColor2="#9FE8FF" />
      <g transform="translate(1050,600)"><FireflySwarm t={t} spread={200} /></g>
      <LitFemale id="sh2" {...L(GAR.door, 0.92)} pose="standing_in_doorway_light" expression="hopeful" haloColor="#FFC46A" />
    </g>
  )},
  {name: '09_fase2_zoom_tone_teal', tone: TONES.f2Teal, cam: {x: GAR.shelf + 100, y: 760, s: 1.5}, blur: 9, dim: 0.4, panel: beatF(36, 20), bg: (t, tn) => <PlaceGarage tone={tn} t={t} />, fg: (t) => (
    <g><Halo x={GAR.shelf + 100} y={740} rx={420} ry={260} color="#FF6AC0" op={0.18} /><g transform={`translate(${GAR.shelf + 100},760)`}><WeekBeakers t={t} k={0.85} /></g></g>
  )},
  {name: '10_midcta_panggung', tone: TONES.ctaAmber, cam: {x: 540, y: 880, s: 1}, blur: 6, dim: 0.3, panel: beatF(43, 10), bg: (t, tn) => <PlaceStage tone={tn} t={t} lights={1} />, fg: (t) => (
    <g>
      <Halo x={420} y={800} rx={380} ry={360} color="#FFC46A" op={0.25} />
      <g transform="translate(420,780) scale(0.95)"><StitchedHead t={t} k={0.7} /></g>
      <Rise x={420} y={980} w={300} h={400} n={10} color="#FFD166" t={t} />
      <LitCharacter id="si1" {...L(810, 0.9)} pose="pressing_elevator_button_up" noProps expression="curious" haloColor="#FFC46A" />
    </g>
  )},
  {name: '11_fase3_lorong', tone: TONES.f3Maroon, cam: {x: 540, y: 880, s: 1}, blur: 7, dim: 0.38, panel: beatF(45, 40), bg: (t, tn) => <PlaceHallKid tone={tn} t={t} />, fg: (t) => (
    <g>
      <g transform="translate(250,880)"><MonsterShadow t={t} k={0.85} /></g>
      <LitCharacter id="sj1" {...L(420, 0.95)} expression="cold" pose="back_turned_frosty" noProps haloColor="#FF7A5A" rimColor2="#FFB0A0" />
      <LitChild id="sj2" {...L(900, 0.7, FLOOR_Y - 30)} pose="hugging_teddy" expression="scared" haloColor="#FFC56A" />
    </g>
  )},
  {name: '12_fase3_kamar_anak', tone: TONES.f3Red, cam: {x: HALL.lamp + 140, y: 860, s: 1}, blur: 7, dim: 0.38, panel: beatF(53, 20), bg: (t, tn) => <PlaceHallKid tone={tn} t={t} />, fg: (t) => (
    <g>
      <g transform={`translate(${HALL.lamp + 140},360)`}><StormCloud t={t} s={0.9} /></g>
      <LitFemale id="sk1" {...L(HALL.lamp + 260, 0.95)} pose="holding_torn_umbrella_over_child" expression="protective" haloColor="#FFC56A" />
      <LitChild id="sk2" {...L(HALL.lamp + 30, 0.72)} pose="hiding_behind_mother" expression="scared" haloColor="#FFC56A" />
    </g>
  )},
  {name: '13_fase3_rumah_miniatur_penutup', tone: TONES.f3Dark, cam: {x: 540, y: 860, s: 1}, blur: 9, dim: 0.55, panel: beatF(57, 40), bg: (t, tn) => <PlaceHallKid tone={tn} t={t} nightLamp={0.3} />, fg: (t) => (
    <g><g transform="translate(540,880)"><HeartHouse t={t} off={0.75} clouds={0.8} /></g></g>
  )},
];

export const PlaceStills: React.FC = () => {
  const i = useCurrentFrame();
  const P = PLACES[Math.min(PLACES.length - 1, i)];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <ShotLayers cam={P.cam} blur={P.blur} dim={P.dim} bg={P.bg(T, P.tone)} fg={<Reflect floor={FLOOR_Y} op={0.22} depth={420}>{P.fg(T)}</Reflect>} />
      <ScreenVignette />
      <Grain opacity={0.04} />
      {P.panel !== undefined && <NeonPanelView frame={P.panel} />}
      {P.panel !== undefined && <BatteryProgress frame={P.panel} />}
    </AbsoluteFill>
  );
};
