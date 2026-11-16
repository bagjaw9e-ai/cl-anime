import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Bedroom, CtaStage, Lab, RoadScene} from './components/Rooms';
import {Character} from './components/Character';
import {PhaseLabel, SubtitleStatic} from './components/UI';
import {Grain, Vignette} from './components/Bg';
import * as H from './illustrations/hook';
import * as P1 from './illustrations/phase1';
import * as P2 from './illustrations/phase2';
import * as P3 from './illustrations/phase3';
import * as P4 from './illustrations/phase4';
import * as P5 from './illustrations/phase5';
import * as CT from './illustrations/cta';
import {Pointer} from './illustrations/common';

// 7 still (tiap 60 frame satu fase) untuk cek gaya, warna, & zona layout.
export const PhaseStills: React.FC = () => {
  const f = useCurrentFrame();
  const which = Math.floor(f / 60), t = f % 60;
  const S = 1.1, FY = 1250;
  const scene = [
    <g key="h">
      <Bedroom mood="night" dim={0.5} lampOn={0.6} />
      <circle cx={540} cy={760} r={420} fill="#8FD3C8" opacity={0.08} />
      <Character x={540} y={FY} scale={1.35} expression="curious" pose="standing_relaxed" id="h" blinkSeed={3} />
      <g transform={`translate(540,${FY - 524 * 1.35}) scale(1.35)`}><H.XrayHead t={t} /></g>
      <g transform="translate(860,560) scale(0.55)"><H.BrainTeaser t={t} /></g>
      <PhaseLabel phase={0} /><SubtitleStatic words={['Apa', 'yang', 'terjadi']} active={2} />
    </g>,
    <g key="1">
      <Bedroom mood="night" lampOn={0.8} />
      <Character x={600} y={FY} scale={S} expression="sweaty_stressed" pose="carrying_weight" id="p1" />
      <g transform="translate(250,640) scale(0.62)"><P1.Calendar13 t={t} /></g>
      <Pointer x1={330} y1={760} x2={520} y2={820} />
      <PhaseLabel phase={1} /><SubtitleStatic words={['yang', 'paling', 'berat.']} active={1} />
    </g>,
    <g key="2">
      <Lab />
      <Character x={720} y={FY} scale={S} expression="shocked" pose="standing_relaxed" id="p2" lookAt={{x: -0.8, y: -0.3}} />
      <g transform="translate(320,760) scale(0.72)"><P2.BarChart145 t={t} level={1.45} /></g>
      <PhaseLabel phase={2} /><SubtitleStatic words={['naik', 'sampai', 'sekitar']} active={0} />
    </g>,
    <g key="3">
      <Bedroom mood="rain" lampOn={0.4} dim={0.1} />
      <Character x={640} y={FY} scale={S} expression="lethargic" pose="slouch" id="p3" />
      <g transform={`translate(640,${FY - 690 * S - 70}) scale(0.55)`}><P3.BatteryLow t={t} /></g>
      <g transform="translate(270,720) scale(0.6)"><P3.EkgFlat t={t} /></g>
      <PhaseLabel phase={3} /><SubtitleStatic words={['Banyak', 'yang']} active={1} />
    </g>,
    <g key="4">
      <Bedroom mood="morning" lampOn={0} curtainOpen={1} />
      <Character x={540} y={FY} scale={S} expression="relieved" pose="holding_scissors" id="p4" />
      <g transform="translate(540,470) scale(0.75)"><P4.PuppetStrings t={t} cut={1.6} targets={[[-150, 560], [0, 420], [150, 560]]} /></g>
      <g transform="translate(220,1060) scale(0.6)"><P4.MascotCalm t={t} /></g>
      <PhaseLabel phase={4} /><SubtitleStatic words={['dikendalikan']} active={0} />
    </g>,
    <g key="5">
      <RoadScene />
      <g transform="translate(540,1010) scale(0.9)"><P5.FinishRibbon t={t} /></g>
      <Character x={540} y={FY} scale={S} expression="curious" pose="standing_relaxed" id="p5" lookAt={{x: 0, y: -0.6}} />
      <PhaseLabel phase={5} /><SubtitleStatic words={['bukan', 'garis', 'finish.']} active={2} />
    </g>,
    <g key="c">
      <CtaStage />
      <g transform="translate(470,600)"><CT.LogoNeon t={t + 30} w={520} /></g>
      <Character x={800} y={FY} scale={0.98} expression="happy" pose="pointing_up" id="pc" rim rimColor="#FF4D5A" />
      <PhaseLabel phase={5} /><SubtitleStatic words={['link', 'di', 'bio,']} active={0} />
    </g>,
  ][Math.min(6, which)];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={1080} height={1920}>{scene}</svg>
      <Vignette strength={0.55} />
      <Grain opacity={0.03} />
    </AbsoluteFill>
  );
};
