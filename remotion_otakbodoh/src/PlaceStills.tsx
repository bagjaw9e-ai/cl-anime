// 1 still per tempat (frame i = tempat ke-i): cek kontras karakter vs background + ukuran ilustrasi medium.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useCurrentFrame} from 'remotion';
import {DarkStage, Dim, STAND_Y} from './components/Places';
import {BirthdayRoom, Cafe, CityStreet, FamilyDining} from './components/Places2';
import {Spotlight} from './components/Spot';
import {LitCharacter, Reflect} from './components/Lit';
import {Silhouette} from './components/Silhouette';
import {PhaseHeader} from './components/UI';
import {Grain} from './components/Bg';
import * as U from './illustrations/u25';
import * as B from './illustrations/part2';
import {beatF} from './timeline';

const Layer: React.FC<{blur?: number; children: React.ReactNode}> = ({blur = 0, children}) => (
  <AbsoluteFill style={{filter: blur ? `blur(${blur}px)` : undefined}}><svg width={1080} height={1920}>{children}</svg></AbsoluteFill>
);
const Vig: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 62% at 50% 46%, rgba(0,0,0,0) 50%, rgba(2,3,6,0.7) 100%)'}} />;

export const PLACES = ['kamar_ultah', 'kamar_oneshot_maroon', 'ruang_makan_efek1', 'panggung_mid_cta', 'jalan_halte_efek2', 'kafe_efek3', 'penutup'];
const PH_F = [beatF(1, 14), beatF(4, 14), beatF(8, 14), beatF(23, 14), beatF(28, 14), beatF(43, 14), beatF(51, 14)];

export const PlaceStills: React.FC = () => {
  const i = useCurrentFrame() % PLACES.length;
  const t = 40;
  const bg = [<BirthdayRoom lights={1} />, <BirthdayRoom lights={0.2} decay={1} maroon={1} shadowWall={1} />, <FamilyDining heat={0.45} />, <DarkStage />,
    <CityStreet dusk={0.45} carX={-60} />, <Cafe />, <rect width={1080} height={1920} fill="#05060A" />][i];
  const dim = [0.15, 0.3, 0.28, 0, 0.25, 0.25, 0][i];
  const spot: Array<[number, number, number, number]> = [[540, 860, 560, 0.45], [540, 820, 480, 0.6], [540, 880, 540, 0.55], [540, 800, 560, 0.4], [520, 880, 560, 0.5], [540, 880, 540, 0.5], [540, 900, 500, 0.8]];
  const [sx, sy, sr, sd] = spot[i];
  const fg = [
    <g key="0">
      <Silhouette x={140} y={STAND_Y} scale={0.85} type="friend" pose="clap" t={t} rim="#FFC870" />
      <Silhouette x={950} y={STAND_Y} scale={0.8} type="woman" pose="clap" seed={3} t={t} rim="#FFC870" />
      <Reflect floor={STAND_Y} op={0.14}><LitCharacter id="m0" x={400} y={STAND_Y} scale={1.1} pose="blowing_candle" expression="excited" haloColor="#FFC870" /></Reflect>
      <g transform={`translate(700,${STAND_Y - 270})`}><rect x={-200} y={0} width={400} height={270} rx={10} fill="#5A4636" /><U.BirthdayCake t={t} /></g>
      <g transform="translate(700,700)"><U.Confetti k={16} /></g>
    </g>,
    <g key="1">
      <g transform={`translate(700,${STAND_Y - 340})`}><U.ShadowSelves show={[1, 1, 0.8]} dark={0.5} t={t} /></g>
      <Reflect floor={STAND_Y} op={0.14}><LitCharacter id="m1" x={380} y={STAND_Y} scale={1.1} expression="oblivious" haloColor="#FF6A6A" /></Reflect>
    </g>,
    <g key="2">
      <Silhouette x={860} y={STAND_Y} scale={0.82} type="mother" pose="step_back" t={t} rim="#FFC870" />
      <Silhouette x={980} y={STAND_Y} scale={0.62} type="child" pose="step_back" seed={4} t={t} rim="#FFC870" />
      <Reflect floor={STAND_Y} op={0.12}><LitCharacter id="m2" x={430} y={STAND_Y} scale={1.1} pose="slamming_table" expression="angry" haloColor="#FF8A4A" /></Reflect>
      <g transform="translate(400,1090)"><rect x={-260} y={0} width={560} height={22} rx={6} fill="#8A4A30" /><rect x={-240} y={22} width={520} height={140} fill="#5A2A18" /></g>
      <g transform="translate(780,1088) scale(1.05)"><U.GlassCrack crack={1} /></g>
    </g>,
    <g key="3">
      <g transform="translate(580,640)"><B.AmberBrain glow={1} t={t} s={1.05} /></g>
      <Reflect floor={1152} op={0.2}><LitCharacter id="m3" x={260} y={1152} scale={0.9} expression="curious" lookAt={{x: 0.6, y: -1}} /></Reflect>
    </g>,
    <g key="4">
      <Silhouette x={820} y={STAND_Y - 40} scale={0.8} type="woman_hijab" pose="hug_bag" t={t} rim="#FFC870" />
      <Reflect floor={STAND_Y} op={0.12}><LitCharacter id="m4" x={360} y={STAND_Y} scale={1.1} pose="walking_street" expression="daydreaming" haloColor="#FF8FC0" /></Reflect>
      <g transform="translate(640,470)"><U.PinkCloud t={t} s={0.8} /></g>
    </g>,
    <g key="5">
      <Silhouette x={850} y={STAND_Y} scale={0.85} type="man" pose="sit" t={t} rim="#BFD4FF" />
      <Reflect floor={STAND_Y} op={0.12}><LitCharacter id="m5" x={380} y={STAND_Y} scale={1.1} pose="sitting_meeting" expression="lost" haloColor="#BFD4FF" /></Reflect>
      <g transform="translate(600,1090)"><rect x={-360} y={0} width={720} height={22} rx={6} fill="#4A5462" /><rect x={-340} y={22} width={680} height={140} fill="#3A424E" />
        <path d="M 120 -50 L 126 0 L 170 0 L 176 -50 Z" fill="#FBF7EE" /></g>
      <g transform="translate(680,560)"><U.JammedGears t={t} jam={1} /></g>
    </g>,
    <g key="6">
      <g transform="translate(540,820)"><U.ClosingBrains k={0.35} off={0} /></g>
      <Silhouette x={540} y={1250} scale={0.5} type="man" pose="look" t={t} rim="#FF6A6A" />
    </g>,
  ][i];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Layer blur={2.5}>{bg}<Dim dim={dim} /></Layer>
      <Layer><Spotlight x={sx} y={sy} rx={sr} ry={sr * 1.35} dark={sd} />{fg}</Layer>
      <Vig />
      <Grain opacity={0.04} />
      {i < 6 && <PhaseHeader frame={PH_F[i]} />}
    </AbsoluteFill>
  );
};
