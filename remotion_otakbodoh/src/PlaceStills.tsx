// 1 still per tempat (frame i = tempat ke-i): background samar (blur DOF kuat + redup) + lantai mengkilap/pantulan,
// kontras karakter vs latar, ilustrasi medium di zona tengah, panel neon + baterai (mulai Fase 1).
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Dim} from './components/Places';
import {BedroomNight, ChainRoom, CityWet, Classroom, DoorHall, EmptyRoom, FEET, ForestNight, HorizonRoad, Library, OfficeMeeting, Stage4, TONES} from './components/Places4';
import {Spotlight} from './components/Spot';
import {Halo, LitCharacter, Reflect, Rise} from './components/Lit';
import {Silhouette} from './components/Silhouette';
import {MidbrainMascot} from './components/MidbrainMascot';
import {BatteryProgress, NeonPanelView} from './components/NeonPanel';
import {Grain} from './components/Bg';
import * as O from './illustrations/ob';
import * as S from './illustrations/shared';
import * as U from './illustrations/u25';
import * as A from './illustrations/part1';
import {beatF} from './timeline';

const Layer: React.FC<{blur?: number; children: React.ReactNode}> = ({blur = 0, children}) => (
  <AbsoluteFill style={{filter: blur ? `blur(${blur}px)` : undefined}}><svg width={1080} height={1920}>{children}</svg></AbsoluteFill>
);
const Vig: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse 82% 64% at 50% 47%, rgba(0,0,0,0) 52%, rgba(2,3,6,0.72) 100%)'}} />;

export const PLACES = ['hook1_kelas', 'hook2_kamar_malam', 'hook3_pintu_kamar', 'hook4_ruang_rantai', 'oneshot_ruang_kosong', 'fase1_perpustakaan',
  'fase1_perpustakaan_zoom_ungu', 'pmo_savior_panggung', 'fase2_hutan_kabut', 'fase3_jalan_basah', 'masa_depan_kantor', 'masa_depan_cakrawala'];
// frame contoh untuk panel neon + baterai (-1 = tidak tampil: hook & one shot)
const PF = [-1, -1, -1, -1, -1, beatF(7, 30), beatF(15, 20), beatF(18, 20), beatF(22, 20), beatF(38, 20), beatF(48, 20), beatF(57, 20)];

export const PlaceStills: React.FC = () => {
  const i = useCurrentFrame() % PLACES.length;
  const t = 40;
  const bg = [<Classroom />, <BedroomNight />, <DoorHall lockGlow={1} />, <ChainRoom t={t} />, <EmptyRoom T={TONES.emptyPurple} />, <Library T={TONES.libBlue} />,
    <Library T={TONES.libPurple} />, <Stage4 T={TONES.stageAmber} />, <ForestNight t={t} />, <CityWet t={t} />, <OfficeMeeting />, <HorizonRoad T={TONES.duskRed} />][i];
  const blur = [8, 8, 7, 8, 5, 8, 8, 6, 8, 8, 8, 6][i];
  const dim = [0.22, 0.28, 0.3, 0.32, 0.3, 0.4, 0.4, 0.25, 0.34, 0.36, 0.4, 0.3][i];
  const spot: Array<[number, number, number, number]> = [[540, 880, 520, 0.55], [540, 880, 520, 0.55], [540, 860, 520, 0.5], [540, 880, 500, 0.6], [540, 860, 520, 0.5],
    [540, 900, 520, 0.55], [540, 880, 500, 0.6], [540, 860, 520, 0.45], [540, 900, 520, 0.5], [540, 900, 520, 0.5], [540, 900, 520, 0.55], [540, 900, 540, 0.45]];
  const [sx, sy, sr, sd] = spot[i];
  const fg = [
    // hook 1: kertas ujian + karakter bengong, tanda tanya
    <g key="0">
      <Reflect floor={FEET} op={0.22}><LitCharacter id="m0" x={300} y={FEET} scale={1.05} expression="dazed" haloColor="#BFE6E0" /></Reflect>
      <g transform="translate(300,610) scale(0.6)"><U.BigQuestion p={1} t={t} /></g>
      <g transform="translate(730,870) scale(0.95)"><O.ExamPaper stamp={1} /></g>
    </g>,
    // hook 2: HP 18+ glow pink ke muka
    <g key="1">
      <Reflect floor={FEET} op={0.22}><LitCharacter id="m1" x={420} y={FEET} scale={1.1} pose="holding_phone" expression="hooked" haloColor="#FF8FC0" phoneColor="#FF5FA2" /></Reflect>
      <g transform="translate(790,820)"><S.Phone18 w={190} /></g>
    </g>,
    // hook 3: gagang pintu + kunci + tisu (tanpa karakter)
    <g key="2">
      <g transform="translate(560,860)"><O.DoorKnobLock turn={1} t={t} /></g>
      <Reflect floor={FEET} op={0.25}><g transform={`translate(820,${FEET})`}><g transform="translate(0,-90)"><Halo rx={150} color="#FFF4E0" op={0.3} /></g><g transform="translate(0,-60) scale(0.9)"><A.TissueBox pull={0.6} /></g></g></Reflect>
    </g>,
    // hook 4: tangan dirantai ke HP
    <g key="3">
      <Reflect floor={FEET} op={0.22}><LitCharacter id="m3" x={540} y={FEET} scale={1.25} pose="chained_to_phone" expression="struggling" haloColor="#FF6A5A" /></Reflect>
    </g>,
    // one shot: 3 pintu nyala di belakang karakter, pantulan di lantai
    <g key="4">
      <Reflect floor={1110} op={0.35} depth={400}>
        <g transform="translate(260,1110) scale(0.95)"><O.GlowDoor n={1} color="#FFD23F" on={1} /></g>
        <g transform="translate(540,1110) scale(0.95)"><O.GlowDoor n={2} color="#FF8A2B" on={1} /></g>
        <g transform="translate(820,1110) scale(0.95)"><O.GlowDoor n={3} color="#FF3B3B" on={0.8} /></g>
      </Reflect>
      <Reflect floor={FEET} op={0.22}><LitCharacter id="m4" x={540} y={FEET} scale={0.95} pose="standing_still_lookup" expression="worried" haloColor="#B88AFF" lookAt={{x: 0.6, y: -0.6}} /></Reflect>
    </g>,
    // fase 1: belajar di meja, kabel HP ke dahi
    <g key="5">
      <Reflect floor={FEET} op={0.22}>
        <LitCharacter id="m5" x={420} y={FEET} scale={1.1} pose="sitting_desk_study" expression="hooked" haloColor="#7FB2FF" />
        <g transform={`translate(560,${FEET - 165})`}><rect x={-340} y={0} width={680} height={22} rx={6} fill="#4A5A7A" /><rect x={-320} y={22} width={640} height={143} fill="#26304A" /></g>
      </Reflect>
      <g transform={`translate(790,${FEET - 250}) rotate(-12)`}><S.Phone18 w={110} /></g>
      <O.RedCable x1={790} y1={FEET - 220} x2={470} y2={720} k={1} t={t} />
    </g>,
    // fase 1 setelah zoom (tone geser ke ungu, tempat sama): mesin kecerdasan di dahi
    <g key="6">
      <g transform="translate(540,880) scale(1.2)"><O.HeadProfile pfc={1} gears={1} t={t} tint="#C77CFF" /></g>
    </g>,
    // PMO SAVIOR: buku panduan amber + jaringan neuron, karakter menunjuk
    <g key="7">
      <g transform="translate(640,880)"><O.GuideBook open={1} net={1} t={t} /></g>
      <Rise x={640} y={900} w={400} h={400} n={10} t={t} />
      <Reflect floor={FEET} op={0.25}><LitCharacter id="m7" x={260} y={FEET} scale={0.95} pose="pointing_up" expression="relieved" /></Reflect>
    </g>,
    // fase 2: maskot otak tengah di hutan + kadal/monyet
    <g key="8">
      <Reflect floor={FEET} op={0.3}>
        <MidbrainMascot x={540} y={FEET - 110} s={1.5} mood="derp" />
        <g transform={`translate(230,${FEET - 40}) scale(0.75)`}><O.AnimalSil kind="lizard" t={t} /></g>
        <g transform={`translate(850,${FEET - 90}) scale(0.8)`}><O.AnimalSil kind="monkey" t={t} /></g>
      </Reflect>
    </g>,
    // fase 3: diseret arus merah di aspal basah
    <g key="9">
      <g transform={`translate(540,${FEET - 30})`}><U.RedCurrent t={t} /></g>
      <Reflect floor={FEET} op={0.3}><LitCharacter id="m9" x={540} y={FEET} scale={1.15} pose="being_dragged" expression="struggling" haloColor="#FF5FA2" /></Reflect>
    </g>,
    // kantor: grafik turun di layar + rapat blank
    <g key="10">
      <g transform="translate(540,720) scale(0.9)"><O.ChartDrop k={1} /></g>
      <Silhouette x={860} y={FEET} scale={0.85} type="man" pose="talk" t={t} rim="#BFD4FF" />
      <Reflect floor={FEET} op={0.2}><LitCharacter id="m10" x={360} y={FEET} scale={1.05} pose="sitting_meeting_blank" expression="blank" haloColor="#BFD4FF" />
        <g transform={`translate(420,${FEET - 140})`}><rect x={-260} y={0} width={520} height={18} rx={6} fill="#5A6478" /><rect x={-240} y={18} width={480} height={122} fill="#2E3644" /></g></Reflect>
    </g>,
    // cakrawala senja: treadmill tidak maju-maju
    <g key="11">
      <Reflect floor={FEET} op={0.25}><LitCharacter id="m11" x={540} y={FEET} scale={1.05} pose="walking_treadmill" expression="hopeless" haloColor="#FF6A3A" /></Reflect>
    </g>,
  ][i];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Layer blur={blur}>{bg}<Dim dim={dim} /></Layer>
      <Layer><Spotlight x={sx} y={sy} rx={sr} ry={sr * 1.35} dark={sd} />{fg}</Layer>
      <Vig />
      <Grain opacity={0.04} />
      {PF[i] >= 0 && <NeonPanelView frame={PF[i]} />}
      {PF[i] >= 0 && <BatteryProgress frame={PF[i]} />}
    </AbsoluteFill>
  );
};
