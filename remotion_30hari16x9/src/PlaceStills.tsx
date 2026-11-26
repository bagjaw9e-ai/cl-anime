// 1 still 16:9 per tempat (frame i = tempat ke-i): background samar (blur DOF kuat + redup) + lantai mengkilap/pantulan,
// kontras karakter vs latar, ilustrasi medium (450-750 px) di tengah, panel neon + ikon + baterai dengan logo charge (mulai Hari 1-3).
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AmberStage, DarkBedroom, DawnBedroom, Dim, FEET, MorningPark, MriRoom, NightGym, NightKitchen, RainStation, StadiumTrack, StudioApartment, TONES} from './components/Places30';
import {Spotlight} from './components/Spot';
import {LitCharacter, Reflect, Rise} from './components/Lit';
import {BatteryProgress, NeonPanelView} from './components/NeonPanel';
import {Grain} from './components/Bg';
import * as A from './illustrations/h30/partA';
import * as B from './illustrations/h30/partB';
import * as C from './illustrations/h30/partC';
import {beatF} from './timeline';

const Layer: React.FC<{blur?: number; children: React.ReactNode}> = ({blur = 0, children}) => (
  <AbsoluteFill style={{filter: blur ? `blur(${blur}px)` : undefined}}><svg width={1920} height={1080}>{children}</svg></AbsoluteFill>
);
const Vig: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 72% at 50% 48%, rgba(0,0,0,0) 52%, rgba(2,3,6,0.74) 100%)'}} />;

export const PLACES = ['hook1_ruang_mri', 'hook2_kamar_gelap', 'hook3_dapur_malam', 'hari1-3_apartemen', 'hari1-3_apartemen_zoom_merah', 'hari7_gym_malam',
  'hari14_peron_hujan', 'hari21-30_taman_pagi', 'hari66_lintasan_stadion', 'hari66_kamar_subuh', 'neuroplasticity_panggung'];
const PF = [-1, -1, -1, beatF(4, 20), beatF(7, 20), beatF(18, 30), beatF(26, 20), beatF(39, 20), beatF(40, 30), beatF(43, 30), beatF(47, 20)];

export const PlaceStills: React.FC = () => {
  const i = useCurrentFrame() % PLACES.length;
  const t = 40;
  const bg = [<MriRoom />, <DarkBedroom />, <NightKitchen />, <StudioApartment t={t} />, <StudioApartment T={TONES.aptRed} t={t} />, <NightGym />,
    <RainStation t={t} />, <MorningPark t={t} />, <StadiumTrack />, <DawnBedroom />, <AmberStage />][i];
  const dim = [0.3, 0.32, 0.3, 0.32, 0.36, 0.3, 0.3, 0.22, 0.24, 0.26, 0.2][i];
  const fg = [
    <g key="0">
      <g transform="translate(640,440) scale(0.72)"><A.BrainMonitor t={t} /></g>
      <Reflect floor={FEET} op={0.2}><g transform="translate(1370,622) rotate(-90) scale(0.6)"><LitCharacter id="s0" x={0} y={0} pose="sliding_into_mri" expression="curious" haloColor="#7FE8F0" /></g></Reflect>
    </g>,
    <g key="1">
      <Reflect floor={FEET} op={0.22}>
        <LitCharacter id="s1" x={600} y={FEET} scale={0.8} pose="locking_drawer" expression="determined" haloColor="#9A8AD8" />
        <g transform="translate(1000,600) scale(0.72)"><A.DrawerLock t={t} close={0.9} lock={0.8} /></g>
      </Reflect>
      <g transform="translate(1440,330)"><A.ShockedBrain t={t} shock={1} s={0.42} /></g>
    </g>,
    <g key="2">
      <Reflect floor={FEET} op={0.22}><LitCharacter id="s2" x={520} y={FEET} scale={0.8} pose="glancing_at_camera" expression="sneaky" haloColor="#FFC27A" /></Reflect>
      <g transform="translate(980,460) scale(0.85)"><A.FlipClock t={t} p={0.6} /></g>
      <g transform="translate(1380,450)"><A.ColorBrain t={t} p={0.6} s={0.55} /></g>
    </g>,
    <g key="3">
      <g transform="translate(1140,440) scale(0.75)"><A.TallyMarks t={t} k={3} /></g>
      <Reflect floor={FEET} op={0.22}><LitCharacter id="s3" x={900} y={FEET} scale={0.85} pose="tally_marks_on_wall" expression="focused" haloColor="#E05AA8" /></Reflect>
    </g>,
    <g key="4">
      <Reflect floor={FEET} op={0.22}><LitCharacter id="s4" x={500} y={FEET} scale={0.8} expression="anxious" haloColor="#FF4A5A" /></Reflect>
      <g transform="translate(980,470) scale(1.3)"><A.DominoBrain t={t} /></g>
    </g>,
    <g key="5">
      <g transform="translate(1060,540) scale(0.56)"><B.HighStriker t={t} level={145} hit={1} /></g>
      <Reflect floor={FEET} op={0.24}><LitCharacter id="s5" x={640} y={FEET} scale={0.8} pose="standing_tall_chest_out" expression="proud" haloColor="#4FA8FF" /></Reflect>
    </g>,
    <g key="6">
      <g transform="translate(960,560) scale(0.85)"><B.TrainTrail t={t} p={0.55} w={1500} /></g>
      <Reflect floor={FEET} op={0.26}>
        <rect x={360} y={FEET - 120} width={300} height={18} rx={6} fill="#5A6478" />
        <LitCharacter id="s6" x={510} y={FEET} scale={0.8} pose="slumped_on_bench_with_umbrella" expression="flat" haloColor="#B8C8D8" />
      </Reflect>
    </g>,
    <g key="7">
      <g transform="translate(1180,560) scale(0.56)"><C.PfcLighthouse t={t} on={1} /></g>
      <Reflect floor={FEET} op={0.26}><LitCharacter id="s7" x={640} y={FEET} scale={0.8} pose="standing_tall_chest_out" expression="proud" haloColor="#FFD26A" /></Reflect>
    </g>,
    <g key="8">
      <g transform="translate(1000,520) scale(0.8)"><C.SproutRoots t={t} grow={0.8} /></g>
      <Reflect floor={FEET} op={0.26}><LitCharacter id="s8" x={560} y={FEET} scale={0.8} expression="curious" haloColor="#FFD6A0" /></Reflect>
    </g>,
    <g key="9">
      <Reflect floor={FEET} op={0.2}>
        <rect x={700} y={FEET - 130} width={420} height={130} rx={20} fill="#3A4A6A" />
        <LitCharacter id="s9" x={910} y={FEET} scale={0.8} pose="waking_up_stretching" expression="relieved" haloColor="#A8C8FF" />
        <rect x={690} y={FEET - 96} width={440} height={96} rx={20} fill="#5A6A90" opacity={0.92} />
      </Reflect>
      <g transform="translate(1260,360)"><C.DreamToCheck t={t} k={0.5} /></g>
    </g>,
    <g key="10">
      <g transform="translate(1000,860)"><C.GlowFootsteps t={t} k={0.7} len={900} /></g>
      <g transform="translate(1120,420) scale(0.8)"><C.NeuronTree t={t} grow={1} /></g>
      <Rise x={1120} y={600} w={500} h={400} n={12} t={t} />
      <Reflect floor={FEET} op={0.26}><LitCharacter id="s10" x={600} y={FEET} scale={0.8} pose="following_glowing_footsteps" expression="curious" /></Reflect>
    </g>,
  ][i];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Layer blur={8}>{bg}<Dim dim={dim} /></Layer>
      <Layer><Spotlight x={960} y={520} rx={760} ry={560} dark={0.5} />{fg}</Layer>
      <Vig />
      <Grain opacity={0.04} />
      {PF[i] >= 0 && <NeonPanelView frame={PF[i]} />}
      {PF[i] >= 0 && <BatteryProgress frame={PF[i]} />}
    </AbsoluteFill>
  );
};
