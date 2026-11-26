// SCENE bagian B: HARI KE-14 (peron hujan) -> HARI 21-30 (taman pagi) -> BUTUH 66 HARI (lintasan stadion -> kamar subuh)
// -> NEUROPLASTICITY (panggung amber) + PENUTUP (baterai 100%, lampu panggung redup pelan).
import React from 'react';
import {AmberStage, DawnBedroom, FEET, MorningPark, RainStation, StadiumTrack} from '../components/Places30';
import {LitCharacter, Reflect, Rise} from '../components/Lit';
import {Spotlight} from '../components/Spot';
import * as B from '../illustrations/h30/partB';
import * as C from '../illustrations/h30/partC';
import {Appear, be, bf, ease, kp, ramp} from '../kit';
import {K, guardCam, track} from '../cameraTrack';
import {setKeyPos} from '../components/UI';
import {TOTAL_FRAMES, VO_FRAMES} from '../timeline';
import {ShotDef} from './types';
import {seg} from './scenesA';

const SC = 0.8, HEAD = FEET - 600 * SC, SEAT_HEAD = FEET - 460 * SC;

/* ================= HARI KE-14: PERON STASIUN HUJAN ================= */
setKeyPos({26: [960, 805], 28: [960, 800], 31: [960, 800]});
const k14 = [
  K(22, 0, 960, 560, 1.0, 'stationGray'), K(22, 70, 960, 520, 1.08, 'stationGray'),       // fade gelap -> reveal peron + rel
  K(23, 0, 900, 520, 1.1), K(23, 14, 760, 520, 1.3, 'stationBlue'),                       // lesu di bangku
  K(24, 0, 900, 500, 1.2), K(24, 12, 1040, 480, 1.3, 'stationCold'),                      // kembang api basah
  K(25, 0, 1000, 460, 1.2), K(25, 12, 1000, 380, 1.2, 'stationGray'),                     // tilt ke papan split-flap
  K(26, 0, 700, 540, 1.05, 'stationBlue'), K(26, 62, 1200, 540, 1.05, 'stationCold'),     // pan ikut kereta (light trail)
  K(27, 0, 800, 440, 1.2), K(27, 12, 800, 400, 1.35, 'stationBlue'),                      // amigdala di atas kepala
  K(28, 0, 980, 470, 1.2), K(28, 14, 1060, 470, 1.35, 'stationGray'), K(28, 54, 1060, 470, 1.35), K(28, 70, 1100, 490, 1.45, 'stationBlue'), // mixer
  K(29, 0, 800, 560, 1.2), K(29, 14, 790, 640, 1.4, 'stationCold'),                       // tilt turun ke kaki
  K(30, 0, 960, 500, 1.2), K(30, 14, 1040, 470, 1.35, 'stationBlue'), K(30, 54, 1040, 470, 1.35), K(30, 70, 1060, 480, 1.45, 'stationGray'), // slot
  K(31, 0, 900, 460, 1.3, 'stationCold'), K(31, 44, 1000, 500, 1.05, 'stationBlue'),     // pull-out: infus + buang HP
];
const manX14 = (f: number) => kp(f, [[bf(23), 760], [bf(31), 760], [bf(31, 1), 1150]]);
const seated14 = (f: number) => f >= bf(23) && f < bf(31);
export const shotH14: ShotDef = {
  id: 'h14', from: bf(22), to: bf(32), enter: 'dark', trLen: 16,
  cam: (f) => guardCam(track(f, k14).cam, f < bf(23) ? null : [manX14(f), seated14(f) ? SEAT_HEAD : HEAD]),
  bg: (f) => <RainStation T={track(f, k14).tone} t={f} />, bgBlur: () => 8, dim: () => 0.3,
  fg: (f) => {
    const onBench = seated14(f);
    return (
      <g>
        <Spotlight x={960} y={500} rx={760} ry={560} dark={0.45} />
        <g opacity={seg(f, bf(26), be(26) + 6)} transform="translate(960,560)"><B.TrainTrail t={f} p={ramp(f, bf(26, 4), bf(26, 56))} w={2200} /></g>
        <Reflect floor={FEET} op={0.26}>
          {f >= bf(23) && <g opacity={onBench ? 1 : 1 - ramp(f, bf(31), bf(31, 10))}><rect x={600} y={FEET - 120} width={320} height={18} rx={6} fill="#5A6478" /><rect x={620} y={FEET - 102} width={12} height={102} fill="#3A4452" /><rect x={888} y={FEET - 102} width={12} height={102} fill="#3A4452" /></g>}
          {f >= bf(23) && (
            <LitCharacter id="m14" x={manX14(f)} y={FEET} scale={SC} haloColor="#B8C8D8" phoneColor="#FF5FA2"
              pose={[[-100, 'slumped_on_bench_with_umbrella'], [bf(29), 'tapping_foot_restless'], [bf(30), 'slumped_on_bench_with_umbrella'], [bf(31), 'tossing_phone_in_bin']]}
              expression={[[-100, 'sleepy'], [bf(24), 'flat'], [bf(27), 'curious'], [bf(28), 'focused'], [bf(29), 'restless'], [bf(30), 'tempted'], [bf(31), 'determined']]}
              lookAt={f >= bf(27) && f < bf(28) ? {x: 0.1, y: -0.9} : {x: 0.6, y: -0.1}} />
          )}
          <Appear f={f} a={bf(31, 2)} b={be(31)} x={1340} y={680} s={0.6}><B.BinDrop t={f} fall={ramp(f, bf(31, 16), bf(31, 40))} /></Appear>
        </Reflect>
        <Appear f={f} a={bf(24, 1)} b={be(24)} x={1060} y={500} s={0.62}><B.WetFirework t={f} k={ramp(f, bf(24, 2), be(24))} /></Appear>
        <Appear f={f} a={bf(25, 1)} b={be(25)} x={1000} y={360} s={0.6} kind="glow"><B.SplitFlap t={f} stop={ramp(f, bf(25, 8), be(25))} /></Appear>
        <Appear f={f} a={bf(27, 2)} b={be(27)} x={800} y={370} s={0.5} kind="glow"><B.AmygdalaBrain t={f} /></Appear>
        <Appear f={f} a={bf(28, 2)} b={be(28)} x={1100} y={480} s={0.66} kind="glow"><B.DopaMixer t={f} down={ramp(f, bf(28, 20), bf(28, 80))} /></Appear>
        {f >= bf(29) && f < be(29) && <g transform="translate(830,805) scale(0.8)"><B.SplashRipples t={f} /></g>}
        <Appear f={f} a={bf(30, 2)} b={be(30)} x={1060} y={470} s={0.62}><B.SlotPhone t={f} spin={ramp(f, bf(30, 4), bf(30, 12))} /></Appear>
        <Appear f={f} a={bf(31, 2)} b={be(31)} x={760} y={410} s={0.6} kind="glow"><B.IVBrain t={f} /></Appear>
      </g>
    );
  },
};

/* ================= HARI 21-30: TAMAN KOTA PAGI ================= */
setKeyPos({34: [960, 805], 36: [960, 800], 37: [960, 805], 39: [960, 805]});
const k21 = [
  K(32, 0, 1200, 480, 1.4, 'parkGreen'), K(32, 30, 960, 520, 1.0, 'parkGold'),            // light reveal taman
  K(33, 0, 960, 520, 1.05), K(33, 14, 1000, 480, 1.25, 'parkWarm'),                       // menahan pintu
  K(34, 0, 900, 520, 1.15), K(34, 30, 1080, 500, 1.25, 'parkGold'),                       // pan ke jalan terang
  K(35, 0, 1000, 470, 1.2), K(35, 14, 1040, 450, 1.35, 'parkWarm'), K(35, 50, 1040, 450, 1.35), K(35, 66, 1060, 420, 1.45, 'parkGold'), // jam saku
  K(36, 0, 1250, 480, 1.2), K(36, 40, 700, 480, 1.2, 'parkGold'),                         // pan ikut panah
  K(37, 0, 800, 520, 1.1), K(37, 30, 1000, 420, 1.2, 'parkGreen'), K(37, 70, 1000, 420, 1.2), K(37, 86, 1050, 400, 1.3, 'parkGold'), // tilt ke layangan
  K(38, 0, 980, 540, 1.15), K(38, 12, 980, 560, 1.4, 'parkWarm'),                         // maskot tidur di keranjang
  K(39, 0, 1100, 480, 1.3), K(39, 40, 960, 520, 1.0, 'parkGold'),                         // pull-out mercusuar PFC
];
const manX21 = (f: number) => kp(f, [[bf(32), 260], [bf(32, 40), 640], [bf(33), 640], [bf(33, 1), 840], [bf(34), 840], [bf(34, 1), 520], [bf(36), 520], [bf(36, 1), 1400],
  [bf(37), 1400], [bf(37, 1), 600], [bf(39), 600], [bf(39, 1), 640]]);
export const shotH21: ShotDef = {
  id: 'h21', from: bf(32), to: bf(40), enter: 'light', trLen: 14, trColor: '#FFE3A0',
  cam: (f) => guardCam(track(f, k21).cam, [manX21(f), HEAD]),
  bg: (f) => <MorningPark T={track(f, k21).tone} t={f} sun={0.5 + 0.5 * ease(f, bf(32), bf(32, 40))} />, bgBlur: () => 8, dim: () => 0.22,
  fg: (f) => (
    <g>
      <Spotlight x={980} y={500} rx={760} ry={560} dark={0.4} />
      <Appear f={f} a={bf(32, 0)} b={be(32)} x={1300} y={420} s={0.8} kind="glow"><C.SunRays t={f} up={ramp(f, bf(32), bf(32, 30))} /></Appear>
      <Appear f={f} a={bf(33, 2)} b={be(33)} x={1060} y={480} s={0.55}><C.ShadowDoor t={f} lock={ramp(f, bf(33, 30), bf(33, 60))} /></Appear>
      <Appear f={f} a={bf(34, 2)} b={be(34)} x={980} y={520} s={0.6}><C.BrainCrossroad t={f} choose={ramp(f, bf(34, 10), be(34))} /></Appear>
      <Appear f={f} a={bf(35, 2)} b={be(35)} x={1040} y={450} s={0.7} kind="glow"><C.PocketWatchActivities t={f} open={ramp(f, bf(35, 6), bf(35, 22))} /></Appear>
      <g opacity={seg(f, bf(36), be(36))} transform="translate(800,470) scale(-1,1)"><C.ArrowTarget t={f} fly={ramp(f, bf(36, 12), bf(36, 40))} dist={700} /></g>
      <Appear f={f} a={bf(37, 2)} b={be(37)} x={1120} y={330} s={0.6} kind="glow"><C.KiteFree t={f} fade={ramp(f, bf(37, 30), bf(37, 80))} /></Appear>
      <Appear f={f} a={bf(38, 1)} b={be(38)} x={1000} y={620} s={0.6}><C.SleepyMidbrain t={f} /></Appear>
      <Appear f={f} a={bf(39, 1)} b={be(39)} x={1200} y={560} s={0.56} kind="glow"><C.PfcLighthouse t={f} on={ramp(f, bf(39, 4), bf(39, 20))} /></Appear>
      <Reflect floor={FEET} op={0.26}>
        <LitCharacter id="m21" x={manX21(f)} y={FEET} scale={SC} haloColor="#FFD26A"
          pose={[[-100, 'jogging_in'], [bf(32, 40), 'standing_relaxed'], [bf(33), 'holding_door_shut'], [bf(34), 'standing_relaxed'], [bf(36), 'archery_draw'],
            [bf(37), 'flying_kite'], [bf(38), 'standing_relaxed'], [bf(39), 'standing_tall_chest_out']]}
          expression={[[-100, 'peaceful'], [bf(33), 'determined'], [bf(34), 'focused'], [bf(35), 'relieved'], [bf(36), 'focused'], [bf(37), 'confident'], [bf(38), 'peaceful'], [bf(39), 'proud']]}
          lookAt={{x: 0.6, y: -0.2}} />
      </Reflect>
    </g>
  ),
};

/* ================= BUTUH 66 HARI (a): LINTASAN STADION ================= */
setKeyPos({40: [960, 805]});
const k66 = [
  K(40, 0, 960, 540, 1.1, 'trackMorning'), K(40, 14, 1000, 480, 1.3, 'trackMorning'), K(40, 64, 1000, 480, 1.3), K(40, 80, 1000, 520, 1.42, 'trackBright'), // bibit 30->66
  K(41, 0, 700, 540, 1.1), K(41, 70, 1300, 540, 1.1, 'trackBright'),                      // pan panjang lintasan
  K(42, 0, 1300, 520, 1.15), K(42, 44, 1700, 520, 1.2, 'trackMorning'),                   // tracking estafet
];
const manX66 = (f: number) => kp(f, [[bf(40), 600], [bf(41), 600], [bf(41, 1), 300], [be(41), 1500], [bf(42), 1350], [be(42), 1750]]);
export const shotH66a: ShotDef = {
  id: 'h66a', from: bf(40), to: bf(43), enter: 'whip', trLen: 12,
  cam: (f) => guardCam(track(f, k66).cam, [manX66(f), HEAD]),
  bg: (f) => <StadiumTrack T={track(f, k66).tone} scroll={f >= bf(41) ? (f - bf(41)) * 14 : 0} />, bgBlur: () => 8, dim: () => 0.24,
  fg: (f) => (
    <g>
      <Spotlight x={980} y={500} rx={760} ry={560} dark={0.4} />
      <Appear f={f} a={bf(40, 2)} b={be(40)} x={1000} y={500} s={0.7}><C.SproutRoots t={f} grow={ease(f, bf(40, 14), bf(40, 110))} /></Appear>
      <g opacity={seg(f, bf(41), be(41))} transform="translate(900,700) scale(0.8)"><C.Checkpoint30 t={f} /></g>
      {f >= bf(42) && f < be(42) && [0, 1, 2].map((i) => <line key={i} x1={manX66(f) - 120 - i * 40} y1={560 + i * 40} x2={manX66(f) - 300 - i * 60} y2={560 + i * 40} stroke="#FFF0C8" strokeWidth={4} opacity={0.4} />)}
      <Reflect floor={FEET} op={0.28}>
        <LitCharacter id="m66" x={manX66(f)} y={FEET} scale={SC} haloColor="#FFD6A0" walkSpeed={1.3}
          pose={[[-100, 'standing_relaxed'], [bf(41), 'jogging_in'], [bf(42), 'grabbing_relay_baton']]}
          expression={[[-100, 'curious'], [bf(41), 'determined'], [bf(42), 'confident']]} lookAt={{x: 0.6, y: -0.2}} />
      </Reflect>
    </g>
  ),
};

/* ================= BUTUH 66 HARI (b): KAMAR SUBUH ================= */
setKeyPos({43: [960, 815]});
const k66b = [
  K(43, 0, 960, 540, 1.2, 'dawnBlue'), K(43, 40, 1020, 470, 1.3, 'dawnSoft'), K(43, 80, 1020, 470, 1.3), K(43, 96, 1080, 430, 1.4, 'dawnBlue'), // bangun + awan mimpi
  K(44, 0, 1060, 480, 1.2), K(44, 14, 1180, 470, 1.32, 'dawnSoft'),                       // bendungan
  K(45, 0, 1120, 480, 1.2), K(45, 14, 1180, 470, 1.32, 'dawnBlue'),                       // engkol dicoret
];
export const shotH66b: ShotDef = {
  id: 'h66b', from: bf(43), to: bf(46), enter: 'dissolve', trLen: 14,
  cam: (f) => guardCam(track(f, k66b).cam, [880, FEET - 420 * SC]),
  bg: (f) => <DawnBedroom T={track(f, k66b).tone} />, bgBlur: () => 8, dim: () => 0.26,
  fg: (f) => (
    <g>
      <Spotlight x={960} y={500} rx={760} ry={560} dark={0.42} />
      <Reflect floor={FEET} op={0.2}>
        <rect x={660} y={FEET - 130} width={440} height={130} rx={20} fill="#3A4A6A" />
        <LitCharacter id="m66b" x={880} y={FEET} scale={SC} haloColor="#A8C8FF"
          pose={[[-100, 'waking_up_stretching'], [bf(43, 60), 'waking_up_stretching'], [bf(44), 'waking_up_stretching']]}
          expression={[[-100, 'sleepy'], [bf(43, 50), 'relieved'], [bf(44), 'curious'], [bf(45), 'flat']]} lookAt={{x: 0.7, y: -0.4}} />
        <rect x={650} y={FEET - 96} width={460} height={96} rx={20} fill="#5A6A90" opacity={0.94} />
      </Reflect>
      <Appear f={f} a={bf(43, 20)} b={be(43)} x={1140} y={340} s={0.75} kind="glow"><C.DreamToCheck t={f} k={ramp(f, bf(43, 50), bf(43, 96))} /></Appear>
      <Appear f={f} a={bf(44, 2)} b={be(44)} x={1230} y={470} s={0.58} kind="glow"><C.MiniDam t={f} open={ramp(f, bf(44, 20), bf(44, 50))} /></Appear>
      <Appear f={f} a={bf(45, 2)} b={be(45)} x={1230} y={470} s={0.58}><C.ForcedCrank t={f} cross={ramp(f, bf(45, 40), bf(45, 70))} /></Appear>
    </g>
  ),
};

/* ================= NEUROPLASTICITY + PENUTUP ================= */
setKeyPos({46: [960, 800], 48: [960, 805], 49: [960, 800]});
const kN = [
  K(46, 0, 960, 520, 1.2, 'stageAmber'), K(46, 20, 1000, 480, 1.25, 'stageWarm'),         // neuron pohon cahaya
  K(47, 0, 700, 560, 1.15), K(47, 56, 1100, 560, 1.15, 'stageAmber'),                     // pan ikut jejak kaki
  K(48, 0, 1000, 480, 1.2), K(48, 14, 1000, 470, 1.3, 'stageWarm'), K(48, 54, 1000, 470, 1.3), K(48, 70, 1000, 450, 1.4, 'stageAmber'), // otak-kota
  K(49, 0, 1000, 480, 1.15), K(49, 14, 1000, 430, 1.2, 'stageWarm'),                       // tilt naik ke link
  K(50, 0, 960, 480, 1.35), K(50, 90, 960, 520, 1.05, 'stageAmber'),                       // pull-out pelan, spotlight
];
const manXN = (f: number) => kp(f, [[bf(46), 560], [bf(47), 560], [bf(47, 1), 460], [be(47), 1000], [bf(48), 600], [bf(49), 680], [bf(50), 960]]);
export const shotNeuro: ShotDef = {
  id: 'neuro', from: bf(46), to: TOTAL_FRAMES, enter: 'dark', trLen: 16,
  cam: (f) => guardCam(track(f, kN).cam, [manXN(f), HEAD]),
  bg: (f) => <AmberStage T={track(f, kN).tone} spot={1 - 0.6 * ease(f, VO_FRAMES, TOTAL_FRAMES - 4)} />, bgBlur: () => 6,
  dim: (f) => 0.2 + 0.35 * ease(f, VO_FRAMES, TOTAL_FRAMES - 4),
  fg: (f) => (
    <g>
      <Spotlight x={960} y={500} rx={700} ry={520} dark={0.45} />
      <Appear f={f} a={bf(46, 2)} b={be(46)} x={1000} y={470} s={0.7} kind="glow"><C.NeuronTree t={f} grow={ease(f, bf(46, 4), bf(46, 50))} /></Appear>
      <g opacity={seg(f, bf(47), be(47))} transform="translate(900,790)"><C.GlowFootsteps t={f} k={ramp(f, bf(47, 4), be(47))} len={1100} /></g>
      <Appear f={f} a={bf(48, 2)} b={be(48)} x={1000} y={460} s={0.72} kind="glow"><C.BrainCity t={f} on={ramp(f, bf(48, 10), bf(48, 80))} /></Appear>
      <Appear f={f} a={bf(49, 2)} b={be(49)} x={1080} y={400} s={0.62} kind="glow"><C.LinkRings t={f} /></Appear>
      {f >= bf(50) && <Rise x={960} y={760} w={700} h={600} n={18} t={f} op={1 - 0.6 * ease(f, VO_FRAMES, TOTAL_FRAMES - 4)} />}
      <Reflect floor={FEET} op={0.3}>
        <LitCharacter id="mN" x={manXN(f)} y={FEET} scale={SC} halo={1 - 0.5 * ease(f, VO_FRAMES, TOTAL_FRAMES - 4)}
          pose={[[-100, 'standing_relaxed'], [bf(47), 'following_glowing_footsteps'], [bf(48), 'standing_relaxed'], [bf(49), 'presenting_link_up'], [bf(50), 'standing_tall_chest_out']]}
          expression={[[-100, 'curious'], [bf(48), 'relieved'], [bf(49), 'confident'], [bf(50), 'confident']]} lookAt={{x: 0.5, y: -0.3}} />
      </Reflect>
    </g>
  ),
};
export const SHOTS_B = [shotH14, shotH21, shotH66a, shotH66b, shotNeuro];
