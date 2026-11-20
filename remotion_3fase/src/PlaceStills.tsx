// 1 still per tempat (frame i = tempat ke-i) untuk cek kontras karakter vs background.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BedroomNight, CoupleBedroom, DarkStage, Dim, LabDark, LivingDining, Office, STAND_Y, WeddingHall, WeddingPhoto} from './components/Places';
import {Spotlight} from './components/Spot';
import {LitCharacter, LitFemale, Reflect, Halo} from './components/Lit';
import {PhaseHeader} from './components/UI';
import {Grain} from './components/Bg';
import * as A from './illustrations/part1';
import * as B from './illustrations/part2';
import * as C from './illustrations/part3';
import * as PR from './illustrations/promo';
import {beatF} from './timeline';

const Layer: React.FC<{blur?: number; children: React.ReactNode}> = ({blur = 0, children}) => (
  <AbsoluteFill style={{filter: blur ? `blur(${blur}px)` : undefined}}><svg width={1080} height={1920}>{children}</svg></AbsoluteFill>
);
const Vig: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 62% at 50% 46%, rgba(0,0,0,0) 50%, rgba(2,3,6,0.7) 100%)'}} />;

export const PLACES = ['pelaminan', 'kamar_pria', 'panggung_mid_cta', 'kantor', 'lab_riset', 'ruang_tamu_hangat', 'ruang_tamu_dingin', 'kamar_pasangan'];
const PHASE_F = [beatF(1), beatF(9), beatF(18), beatF(25), beatF(33), beatF(42), beatF(44), beatF(50)];

export const PlaceStills: React.FC = () => {
  const i = useCurrentFrame() % PLACES.length;
  const t = 40;
  const bg = [
    <WeddingHall lights={1} />, <BedroomNight />, <DarkStage />, <Office />, <LabDark />, <LivingDining cold={0} />, <LivingDining cold={0.9} photoTilt={-8} />, <CoupleBedroom />,
  ][i];
  const dim = [0.15, 0.3, 0, 0.3, 0.2, 0.2, 0.32, 0.25][i];
  const spot: Array<[number, number, number, number]> = [[540, 900, 520, 0.55], [600, 880, 460, 0.65], [540, 800, 560, 0.4], [520, 880, 480, 0.6], [540, 760, 520, 0.6], [560, 900, 520, 0.5], [560, 900, 480, 0.7], [560, 960, 460, 0.7]];
  const [sx, sy, sr, sd] = spot[i];
  const fg = [
    // 0 pelaminan
    <g key="0">
      <Reflect floor={STAND_Y} op={0.15}>
        <LitCharacter id="g0" x={430} y={STAND_Y} scale={1.1} pose="groom_standing" expression="happy" outfit="groom" haloColor="#FFC870" />
        <LitFemale id="b0" x={660} y={STAND_Y} scale={1.05} pose="standing_smile" expression="happy" outfit="bride" haloColor="#FFC870" />
      </Reflect>
      <g transform="translate(860,820) scale(0.8)"><WeddingPhoto /></g>
    </g>,
    // 1 kamar pria
    <g key="1">
      <Reflect floor={STAND_Y} op={0.15}>
        <LitCharacter id="m1" x={560} y={STAND_Y} scale={1.1} pose="holding_phone" expression="hooked" phoneColor="#FF5FA2" haloColor="#FF8FC0" />
      </Reflect>
      <A.PinkFlood x1={630} y1={760} x2={560} y2={560} t={t} on={1} />
    </g>,
    // 2 panggung mid-CTA
    <g key="2">
      <g transform="translate(560,640)"><B.AmberBrain glow={1} t={t} s={0.95} /></g>
      <Reflect floor={1152} op={0.2}><LitCharacter id="m2" x={300} y={1152} scale={0.85} expression="curious" lookAt={{x: 0.6, y: -1}} /></Reflect>
    </g>,
    // 3 kantor
    <g key="3">
      <Reflect floor={STAND_Y} op={0.12}><LitCharacter id="m3" x={540} y={STAND_Y} scale={1.1} pose="standing_relaxed" expression="irritated" haloColor="#FF9A3C" /></Reflect>
      <g transform="translate(560,470)"><B.MatchFuse burn={0.4} t={t} /></g>
    </g>,
    // 4 lab
    <g key="4"><g transform="translate(540,780)"><C.JournalGlow on={1} mag={0.5} /></g></g>,
    // 5 ruang tamu hangat
    <g key="5">
      <Reflect floor={STAND_Y} op={0.12}>
        <LitCharacter id="m5" x={400} y={STAND_Y} scale={1.1} pose="holding_phone" expression="hooked" phoneColor="#FF5FA2" />
        <LitFemale id="f5" x={700} y={STAND_Y} scale={1.05} pose="bringing_tea" expression="hopeful" />
      </Reflect>
    </g>,
    // 6 ruang tamu dingin
    <g key="6">
      <Reflect floor={STAND_Y} op={0.12}>
        <LitFemale id="f6" x={680} y={STAND_Y} scale={1.05} pose="talking" expression="sad" haloColor="#9FC8FF" />
        <LitCharacter id="m6" x={420} y={STAND_Y} scale={1.1} pose="stiff_while_hugged" expression="cold" phoneColor="#FF5FA2" haloColor="#BFD4FF" />
      </Reflect>
      <g transform="translate(420,905)"><C.IceChest ice={0.8} /></g>
    </g>,
    // 7 kamar pasangan (simbolik)
    <g key="7">
      <path d="M 700 1110 L 1000 1110 L 1040 300 L 820 300 Z" fill="#05060A" opacity={0.0} />
      <Halo x={850} y={700} rx={300} ry={420} color="#FF3B3B" op={0.22} />
      <g transform="translate(860,1110) scale(1.9,2.1)" opacity={0.92}><path d="M -40 0 L -46 -110 Q -50 -170 0 -176 Q 50 -170 46 -110 L 40 0 Z M -22 -196 a 26 26 0 1 0 44 0 a 26 26 0 1 0 -44 0" fill="#05060A" /></g>
      <LitFemale id="f7" x={560} y={1060} scale={1.0} pose="sitting_bed_edge_hugging_knees" expression="uncomfortable" haloColor="#9FC8FF" />
    </g>,
  ][i];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Layer blur={2.5}>{bg}<Dim dim={dim} /></Layer>
      <Layer><Spotlight x={sx} y={sy} rx={sr} ry={sr * 1.35} dark={sd} />{fg}</Layer>
      <Vig />
      <Grain opacity={0.04} />
      <PhaseHeader frame={PHASE_F[i] + 14} />
    </AbsoluteFill>
  );
};
