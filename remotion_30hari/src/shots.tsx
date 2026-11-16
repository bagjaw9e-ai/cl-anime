/* Storyboard sebagai data. Frame di dalam shot RELATIF terhadap shot.from. R(beat, off) = frame relatif awal beat.
 * Zona: label fase y140-260 (overlay global), karakter & ilustrasi y420-1250, subtitle y≈1380, 260px bawah kosong.
 * Karakter default: x 540, kaki y 1250, skala 1.1 (kepala ±y 674, puncak ±y 530). */
import React from 'react';
import {Bedroom, CtaStage, Lab, RoadScene} from './components/Rooms';
import {Shot, kf} from './shot';
import {beatF, BEATS, TOTAL_FRAMES} from './timeline';
import * as H from './illustrations/hook';
import * as P1 from './illustrations/phase1';
import * as P2 from './illustrations/phase2';
import * as P3 from './illustrations/phase3';
import * as P4 from './illustrations/phase4';
import * as P5 from './illustrations/phase5';
import * as CT from './illustrations/cta';

const bf = beatF;
const L = {cam: {x: 0, y: 0}, up: {x: 0, y: -1}, left: {x: -1, y: 0}, right: {x: 1, y: 0}, down: {x: 0, y: 1}, upL: {x: -0.7, y: -0.7}, upR: {x: 0.7, y: -0.7}, downR: {x: 0.6, y: 0.7}, downL: {x: -0.6, y: 0.7}};
const HEAD = (y: number, s: number) => y - 524 * s; // pusat kepala

/* =============================== HOOK (cut cepat 0,5-0,8 dtk) =============================== */
const night = (f: number, o: Partial<React.ComponentProps<typeof Bedroom>> = {}) => <Bedroom mood="night" dim={0.35} lampOn={0.7} {...o} />;
const hook: Shot[] = [
  { // 1a: wide -> snap zoom ke wajah, kepala jadi X-ray
    id: 'h1', from: 0, to: 21, enter: 'cut', bg: (f) => night(f), cam0: {x: 540, y: 900, z: 0.92},
    cam: [[2, 12, {x: 540, y: 640, z: 2.0}]],
    char: {x: [[0, 540]], pose: [[0, 'standing_relaxed']], expr: [[0, 'curious']], look: [[0, L.cam]], talk: [[0, true]]},
    ills: [{c: (t) => <H.XrayHead t={t} />, x: 540, y: HEAD(1250, 1.1), s: 1.1, i: 9, o: 999, e: 'fade'}],
  },
  { // 1b: close-up X-ray, otak berdenyut
    id: 'h1b', from: 21, to: 41, enter: 'cut', bg: (f) => night(f, {dim: 0.55}), cam0: {x: 540, y: 690, z: 1.75}, cam: [[0, 20, {z: 1.95}]],
    char: {x: [[0, 540]], pose: [[0, 'standing_relaxed']], expr: [[0, 'curious']], look: [[0, L.cam]], talk: [[0, true]]},
    ills: [{c: (t) => <H.XrayHead t={t + 12} />, x: 540, y: HEAD(1250, 1.1), s: 1.1, i: 0, o: 999, e: 'none'}],
  },
  { // 2a: whip -> HP 18+ digembok + tisu dicoret
    id: 'h2', from: 41, to: 60, enter: 'whip', bg: (f) => night(f, {dim: 0.4}), cam0: {x: 540, y: 820, z: 1.15}, cam: [[0, 19, {z: 1.22}]],
    char: {x: [[0, 540]], pose: [[0, 'grabbing_phone']], expr: [[0, 'tempted']], look: [[0, L.left]], talk: [[0, true]]},
    ills: [
      {c: (t) => <H.PhoneLocked t={t} />, x: 250, y: 760, s: 0.75, i: 1, o: 999},
      {c: (t) => <H.TissueBoxX t={t} />, x: 830, y: 820, s: 0.7, i: 4, o: 999},
    ],
  },
  { // 2b: geleng kepala
    id: 'h2b', from: 60, to: 73, enter: 'cut', bg: (f) => night(f, {dim: 0.3}), cam0: {x: 540, y: 760, z: 1.45}, cam: [[0, 13, {z: 1.55}]],
    char: {x: [[0, 540]], pose: [[0, 'shaking_head']], expr: [[0, 'guilty']], look: [[0, L.cam]], talk: [[0, true]]},
    ills: [{c: (t) => <H.TissueBoxX t={t + 20} />, x: 830, y: 840, s: 0.6, i: 0, o: 999, e: 'none'}],
  },
  { // 3a: kalender sobek cepat 1 -> 30 + stempel
    id: 'h3', from: 73, to: 92, enter: 'cut', bg: (f) => night(f, {dim: 0.6}), cam0: {x: 540, y: 820, z: 1.0}, cam: [[0, 19, {z: 1.08}]],
    char: {x: [[0, 760]], pose: [[0, 'nervous_stand']], expr: [[0, 'shocked']], look: [[0, L.left]], talk: [[0, true]]},
    ills: [{c: (t) => <H.CalendarFlip t={t * 1.0 + 2} />, x: 380, y: 760, s: 1.0, i: 0, o: 999, e: 'pop'}],
    shake: [[14, 8, 8]],
  },
  { // 3b: push-in + shake, smirk ke kamera, teaser otak hari-30 (blur + gembok)
    id: 'h3b', from: 92, to: 109, enter: 'cut', bg: (f) => night(f, {dim: 0.45}), cam0: {x: 600, y: 820, z: 1.05}, cam: [[0, 16, {x: 620, y: 780, z: 1.3}]],
    char: {x: [[0, 760]], pose: [[0, 'arms_crossed']], expr: [[0, 'shocked'], [6, 'smirk']], look: [[0, L.cam]], talk: [[0, true]]},
    ills: [
      {c: (t) => <H.CalendarFlip t={40} />, x: 380, y: 820, s: 0.8, i: -20, o: 999, e: 'none'},
      {c: (t) => <H.BrainTeaser t={t} />, x: 760, y: 470, s: 0.62, i: 1, o: 999},
    ],
    shake: [[0, 10, 10]],
  },
];

/* =============================== FASE 1: HARI 1-3 (kamar malam) =============================== */
const F1 = bf(4);
const R1 = (id: number, off = 0) => bf(id) + off - F1;
const f1: Shot = {
  id: 'f1', from: F1, to: bf(15), enter: 'light',
  bg: (f) => <Bedroom mood="night" lampOn={kf(f, [[0, 1], [R1(9), 1], [R1(9, 14), 0.35], [R1(12, 10), 0.35], [R1(12, 18), 0.08]])}
    doorClosed={kf(f, [[0, 0], [R1(9, 4), 0], [R1(9, 16), 1]])} hanger={kf(f, [[0, 0], [R1(12, 2), 0], [R1(12, 8), 1]])}
    lightsOn={kf(f, [[0, 1], [R1(12, 12), 1], [R1(12, 16), 0.15]])} dim={kf(f, [[0, 0], [R1(13), 0], [R1(13, 10), 0.15]])} />,
  cam0: {x: 540, y: 900, z: 1.0},
  cam: [
    [R1(5), 30, {x: 560, y: 960, z: 1.06}], // tilt turun dikit (beban)
    [R1(6), 20, {x: 430, y: 880, z: 1.12}], // pan kiri ke badan OK
    [R1(7), 22, {x: 540, y: 720, z: 1.25}], // push ke otak
    [R1(8), 16, {x: 640, y: 900, z: 1.05}], // medium (kasur)
    [R1(9), 24, {x: 600, y: 920, z: 0.94}], // pull-out pelan (sendirian)
    [R1(10), 14, {x: 680, y: 900, z: 1.45}], // zoom ke tangan (HP)
    [R1(11), 18, {x: 560, y: 820, z: 1.3}], // push ke layar
    [R1(12), 16, {x: 640, y: 920, z: 1.0}],
    [R1(13), 20, {x: 560, y: 880, z: 1.1}],
    [R1(14), 22, {x: 600, y: 860, z: 1.3}], // push-in (sakau)
  ],
  char: {
    x: [[0, 540], [R1(8, -10), 540], [R1(8, 4), 760], [R1(10, -4), 760], [R1(10, 8), 640], [R1(13), 640], [R1(13, 1), 600]],
    y: [[0, 1250], [R1(8, -10), 1250], [R1(8, 4), 1170], [R1(10, -4), 1170], [R1(10, 8), 1250]],
    pose: [[0, 'nervous_stand'], [R1(5, -3), 'crouch_anticip'], [R1(5, 2), 'carrying_weight'], [R1(6), 'standing_relaxed'], [R1(7), 'hand_chin'],
      [R1(8, -10), 'walking'], [R1(8, 4), 'sitting_bed_bored'], [R1(8, 14), 'yawning'], [R1(9), 'sitting_bed_bored'], [R1(10, -4), 'crouch_anticip'],
      [R1(10, 4), 'grabbing_phone'], [R1(12), 'slouch'], [R1(13), 'shaking_cold']],
    expr: [[0, 'nervous'], [R1(5), 'sweaty_stressed'], [R1(6), 'relieved'], [R1(7), 'thinking'], [R1(8), 'bored'], [R1(8, 14), 'sleepy'],
      [R1(9), 'lonely'], [R1(10), 'tempted'], [R1(12), 'guilty'], [R1(13), 'jittery']],
    look: [[0, L.left], [R1(4, 20), L.cam], [R1(6), L.left], [R1(7), L.up], [R1(8), L.upL], [R1(9), L.right], [R1(10), L.downR], [R1(11), L.left],
      [R1(12), {x: 1, y: 0.2}], [R1(13), L.right], [R1(14), L.cam]],
    talk: [[0, true], [R1(8, 12), false], [R1(9), true], [R1(10), false], [R1(13), true]],
  },
  ills: [
    {c: (t) => <P1.Calendar13 t={t} />, x: 250, y: 640, s: 0.62, i: R1(4, 4), o: R1(6), ptr: true},
    {c: (t) => <P1.BodyOK t={t} />, x: 260, y: 760, s: 0.75, i: R1(6, 4), o: R1(7, 6)},
    {c: (t) => <P1.BrainTrack t={t} />, x: 540, y: 470, s: 0.6, i: R1(7, 4), o: R1(8, 4)},
    {c: (t) => <P1.ClockTick t={t} />, x: 300, y: 560, s: 0.55, i: R1(8, 2), o: R1(10)},
    {c: (t) => <P1.PhoneScreen18 t={t} />, x: 330, y: 760, s: 0.6, i: R1(11, 2), o: R1(12, 4), e: 'slide'},
    {c: (t) => <P1.TissueSmall t={t} />, x: 160, y: 950, s: 0.8, i: R1(12, 2), o: R1(13)},
    {c: (t) => <P1.LightSwitch t={t} />, x: 330, y: 700, s: 0.7, i: R1(12, 4), o: R1(13, 4)},
    {c: (t) => <P1.Thermometer t={t} />, x: 300, y: 720, s: 0.6, i: R1(13, 4), o: 9999},
  ],
  shake: [[R1(13, 20), 40, 4], [R1(14), 30, 5]],
};

/* =============================== FASE 2: HARI 7 (lab) =============================== */
const F2 = bf(15);
const R2 = (id: number, off = 0) => bf(id) + off - F2;
const barLevel = (f: number) => kf(f, [[0, 1], [R2(18, 4), 1], [R2(18, 34), 1.45], [R2(19, 4), 1.45], [R2(19, 30), 1]]);
const f2: Shot = {
  id: 'f2', from: F2, to: bf(22), enter: 'whip', bg: (f) => <Lab dim={kf(f, [[0, 0], [R2(16), 0], [R2(16, 10), 0.25], [R2(17), 0.1], [R2(18, 2), 0.3], [R2(20), 0]])} />,
  cam0: {x: 540, y: 900, z: 1.0},
  cam: [
    [R2(16), 22, {x: 420, y: 820, z: 1.25}], // push ke jurnal
    [R2(17), 20, {x: 640, y: 860, z: 1.15}], // pan ke tabung
    [R2(18), 26, {x: 440, y: 760, z: 1.15}], // tilt naik ikut batang
    [R2(19), 20, {x: 460, y: 880, z: 1.1}], // tilt turun
    [R2(20), 24, {x: 560, y: 920, z: 0.95}], // pull-out (jubah)
    [R2(21), 30, {x: 580, y: 820, z: 1.2}], // push-in halus
  ],
  char: {
    x: [[0, 640], [R2(20), 640], [R2(20, 2), 600]],
    pose: [[0, 'standing_relaxed'], [R2(16), 'reading_focused'], [R2(17), 'standing_relaxed'], [R2(18), 'stand_tall'], [R2(19), 'standing_relaxed'],
      [R2(20, -3), 'crouch_anticip'], [R2(20, 3), 'hero_pose_cape'], [R2(20, 26), 'cape_falls'], [R2(21), 'standing_relaxed']],
    expr: [[0, 'curious'], [R2(16), 'focused'], [R2(17), 'curious'], [R2(18), 'shocked'], [R2(18, 60), 'curious'], [R2(19), 'neutral'],
      [R2(20), 'proud'], [R2(20, 26), 'laughing'], [R2(21), 'relieved']],
    look: [[0, L.left], [R2(16), L.downL], [R2(17), L.right], [R2(18), L.upL], [R2(19), L.left], [R2(20), L.cam], [R2(21), L.down]],
    talk: [[0, true], [R2(16), false], [R2(17), true]],
  },
  ills: [
    {c: (t) => <P2.Calendar7 t={t} />, x: 280, y: 660, s: 0.6, i: 3, o: R2(16), ptr: true},
    {c: (t) => <P2.JournalPaper t={t} />, x: 310, y: 780, s: 0.72, i: R2(16, 4), o: R2(17, 6), e: 'slide'},
    {c: (t) => <P2.TestTube t={t} />, x: 860, y: 760, s: 0.62, i: R2(17, 4), o: R2(18, 4)},
    {c: (t, f) => <P2.BarChart145 t={t} level={barLevel(f)} />, x: 330, y: 760, s: 0.7, i: R2(18, 2), o: R2(20)},
    {c: (t) => <P2.DialChest t={t} />, x: 330, y: 760, s: 0.62, i: R2(21, 4), o: 9999},
  ],
  shake: [[R2(18, 34), 10, 6]],
};

/* =============================== FASE 3: MINGGU 2 (kamar sore hujan) =============================== */
const F3 = bf(22);
const R3 = (id: number, off = 0) => bf(id) + off - F3;
const f3: Shot = {
  id: 'f3', from: F3, to: bf(32), enter: 'blur',
  bg: (f) => <Bedroom mood="rain" lampOn={0.45} dim={kf(f, [[0, 0.05], [R3(26), 0.05], [R3(26, 10), 0.3], [R3(27), 0.2], [R3(29), 0.05], [R3(31), 0], [R3(31, 30), 0]])} />,
  cam0: {x: 540, y: 900, z: 1.0},
  cam: [
    [R3(22, 40), 40, {x: 480, y: 880, z: 1.08}], // mikro: lirik ke jendela
    [R3(23), 22, {x: 680, y: 960, z: 1.12}], // tilt turun (kasur)
    [R3(24), 20, {x: 700, y: 900, z: 1.1}], // pan kanan (gauge)
    [R3(25), 16, {x: 560, y: 860, z: 1.1}],
    [R3(26), 22, {x: 420, y: 840, z: 1.3}], // push ke monitor
    [R3(27), 20, {x: 560, y: 700, z: 1.25}], // push ke otak
    [R3(28), 24, {x: 640, y: 780, z: 1.1}], // tilt
    [R3(29), 20, {x: 540, y: 920, z: 0.98}], // tracking (mondar-mandir)
    [R3(30), 20, {x: 660, y: 860, z: 1.12}], // pan ke HP
    [R3(31), 26, {x: 540, y: 820, z: 1.15}],
  ],
  char: {
    x: [[0, 560], [R3(23, -6), 560], [R3(23, 6), 760], [R3(24, -4), 760], [R3(24, 8), 560], [R3(29), 560], [R3(29, 20), 380], [R3(29, 46), 700], [R3(29, 68), 520], [R3(30), 520]],
    y: [[0, 1250], [R3(23, -6), 1250], [R3(23, 6), 1170], [R3(24, -4), 1170], [R3(24, 8), 1250]],
    pose: [[0, 'slouch'], [R3(23, -6), 'walking'], [R3(23, 6), 'slumped'], [R3(24, -4), 'crouch_anticip'], [R3(24, 6), 'slouch'], [R3(26), 'slouch'],
      [R3(27), 'hand_chin'], [R3(28), 'standing_relaxed'], [R3(29), 'pacing'], [R3(29, 72), 'standing_relaxed'], [R3(30), 'grabbing_phone'], [R3(31), 'standing_relaxed']],
    expr: [[0, 'lethargic'], [R3(25), 'flat'], [R3(26), 'lethargic'], [R3(27), 'thinking'], [R3(28), 'curious'], [R3(29), 'restless'], [R3(30), 'tempted'], [R3(31), 'relieved']],
    look: [[0, L.left], [R3(22, 40), {x: -1, y: -0.4}], [R3(23), L.up], [R3(24), L.right], [R3(25), L.upL], [R3(26), L.left], [R3(27), L.up], [R3(28), L.right],
      [R3(29), L.down], [R3(30), L.right], [R3(31), L.up]],
    talk: [[0, true], [R3(23), false], [R3(24, 8), true]],
  },
  ills: [
    {c: (t) => <P3.Calendar14 t={t} />, x: 270, y: 660, s: 0.6, i: 6, o: R3(23)},
    {c: (t) => <P3.BatteryLow t={t} />, x: 760, y: 820, s: 0.55, i: R3(23, 8), o: R3(25)},
    {c: (t) => <P3.LibidoGauge t={t} />, x: 860, y: 640, s: 0.6, i: R3(24, 3), o: R3(26)},
    {c: (t) => <P3.MoodMeter t={t} />, x: 540, y: 480, s: 0.62, i: R3(25, 2), o: R3(26, 10)},
    {c: (t) => <P3.EkgFlat t={t} />, x: 280, y: 760, s: 0.6, i: R3(26, 2), o: R3(27, 6)},
    {c: (t) => <P3.AmygdalaBrain t={t} />, x: 560, y: 480, s: 0.62, i: R3(27, 3), o: R3(28, 8)},
    {c: (t) => <P3.DopamineTank t={t} />, x: 850, y: 720, s: 0.6, i: R3(28, 4), o: R3(29, 4)},
    {c: (t) => <P3.Footprints t={t} />, x: 540, y: 1290, s: 0.8, i: R3(29, 4), o: R3(30, 10), back: true, e: 'fade'},
    {c: (t) => <P3.PhoneSpike t={t} />, x: 830, y: 760, s: 0.62, i: R3(30, 6), o: R3(31, 4)},
    {c: (t) => <P3.BrainWash t={t} />, x: 540, y: 520, s: 0.6, i: R3(31, 6), o: 9999},
  ],
};

/* =============================== FASE 4: MINGGU 3-4 (kamar pagi) =============================== */
const F4 = bf(32);
const R4 = (id: number, off = 0) => bf(id) + off - F4;
const strCut = (f: number) => kf(f, [[0, 0], [R4(37, 20), 0], [R4(37, 40), 1], [R4(37, 62), 1], [R4(37, 80), 2], [R4(37, 96), 2], [R4(37, 112), 3]]);
const f4: Shot = {
  id: 'f4', from: F4, to: bf(40), enter: 'light',
  bg: (f) => <Bedroom mood="morning" lampOn={kf(f, [[0, 0], [R4(36), 0], [R4(36, 10), 1], [R4(37), 0]])} curtainOpen={kf(f, [[0, 0.05], [4, 0.05], [30, 1]])}
    dim={kf(f, [[0, 0], [R4(39), 0], [R4(39, 8), 0.3]])} />,
  cam0: {x: 540, y: 880, z: 1.0},
  cam: [
    [R4(33), 26, {x: 600, y: 860, z: 1.18}], // push-in (nahan dorongan)
    [R4(34), 20, {x: 480, y: 800, z: 1.1}], // pan (otak memilih)
    [R4(35), 12, {x: 380, y: 860, z: 1.1}], // whip pan antar kegiatan
    [R4(35, 34), 12, {x: 700, y: 860, z: 1.1}],
    [R4(35, 66), 12, {x: 540, y: 880, z: 1.05}],
    [R4(36), 30, {x: 480, y: 860, z: 1.2}], // push-in pelan (fokus)
    [R4(37), 30, {x: 540, y: 700, z: 1.15}], // push ke tali
    [R4(38), 20, {x: 440, y: 880, z: 1.05}], // pan ke maskot
    [R4(39), 22, {x: 540, y: 700, z: 1.2}], // push-in + flare
  ],
  char: {
    x: [[0, 560]],
    pose: [[0, 'waking_up'], [R4(32, 30), 'standing_relaxed'], [R4(33), 'pushing_phone_away'], [R4(33, 42), 'blocking_hand'], [R4(34), 'stand_tall'],
      [R4(35), 'standing_relaxed'], [R4(35, 30), 'playing_guitar'], [R4(35, 64), 'workout'], [R4(36), 'reading_focused'], [R4(37), 'holding_scissors'],
      [R4(38), 'arms_crossed'], [R4(39), 'arms_crossed']],
    expr: [[0, 'relieved'], [R4(32, 30), 'happy'], [R4(33), 'determined'], [R4(34), 'determined'], [R4(35), 'happy'], [R4(36), 'focused'],
      [R4(37), 'relieved'], [R4(38), 'confident'], [R4(39), 'proud']],
    look: [[0, L.left], [R4(33), L.right], [R4(34), L.upL], [R4(35), L.left], [R4(36), L.down], [R4(37), L.up], [R4(38), L.left], [R4(39), L.up], [R4(39, 40), L.cam]],
    talk: [[0, true], [R4(36), false], [R4(37), true]],
    rim: [[0, false], [R4(39), true]],
  },
  ills: [
    {c: (t) => <P4.Calendar34 t={t} />, x: 270, y: 660, s: 0.6, i: 8, o: R4(33)},
    {c: (t) => <P4.SmokeHand t={t} />, x: 820, y: 800, s: 0.62, i: R4(33, 4), o: R4(34, 4)},
    {c: (t) => <P4.BrainDoors t={t} />, x: 300, y: 720, s: 0.6, i: R4(34, 2), o: R4(35)},
    {c: (t) => <P4.ClockBonus t={t} />, x: 540, y: 470, s: 0.58, i: R4(35, 2), o: R4(36)},
    {c: (t) => <P4.ActivityIcon t={t} k="guitar" />, x: 250, y: 720, s: 0.75, i: R4(35, 30), o: R4(36)},
    {c: (t) => <P4.ActivityIcon t={t} k="dumbbell" />, x: 830, y: 720, s: 0.75, i: R4(35, 64), o: R4(36)},
    {c: (t) => <P4.ActivityIcon t={t} k="book" />, x: 260, y: 900, s: 0.75, i: R4(35, 80), o: R4(36, 6)},
    {c: (t) => <P4.FocusBar t={t} />, x: 540, y: 470, s: 0.7, i: R4(36, 4), o: R4(37)},
    {c: (t, f) => <P4.PuppetStrings t={t} cut={strCut(f)} targets={[[-150, 560], [0, 380], [150, 560]]} />, x: 540, y: 460, s: 0.75, i: R4(37, 2), o: R4(38, 6)},
    {c: (t) => <P4.MascotCalm t={t} />, x: 230, y: 1050, s: 0.6, i: R4(38, 4), o: R4(39, 10)},
    {c: (t) => <P4.BrainUnlock t={t} />, x: 540, y: 470, s: 0.62, i: R4(39, 2), o: 9999},
  ],
};

/* =============================== FASE 5: 66 HARI =============================== */
const F5 = bf(40);
const R5 = (id: number, off = 0) => bf(id) + off - F5;
const f5a: Shot = {
  id: 'f5a', from: F5, to: bf(41), enter: 'whip', bg: () => <Bedroom mood="morning" lampOn={0} />, cam0: {x: 540, y: 880, z: 1.0},
  cam: [[R5(40, 30), 40, {x: 460, y: 820, z: 1.15}], [R5(40, 90), 40, {x: 520, y: 880, z: 1.05}]],
  char: {x: [[0, 680]], pose: [[0, 'hand_chin'], [R5(40, 80), 'standing_relaxed']], expr: [[0, 'thinking'], [R5(40, 70), 'curious']], look: [[0, L.left], [R5(40, 90), L.cam]], talk: [[0, true]]},
  ills: [{c: (t) => <P5.Calendar66 t={t} />, x: 300, y: 720, s: 0.7, i: 4, o: 9999, ptr: true}],
};
const F5B = bf(41);
const R5b = (id: number, off = 0) => bf(id) + off - F5B;
const f5b: Shot = {
  id: 'f5b', from: F5B, to: bf(43), enter: 'push', bg: () => <RoadScene />, cam0: {x: 540, y: 820, z: 1.15},
  cam: [[0, 30, {x: 540, y: 880, z: 0.95}], [R5b(42), 24, {x: 540, y: 840, z: 1.3}]],
  char: {x: [[0, 540]], pose: [[0, 'standing_relaxed'], [R5b(42, -3), 'crouch_anticip'], [R5b(42, 3), 'steering_wheel']], expr: [[0, 'curious'], [R5b(42), 'confident']],
    look: [[0, L.up], [R5b(42), L.cam]], talk: [[0, true]]},
  ills: [{c: (t) => <P5.FinishRibbon t={t} />, x: 540, y: 980, s: 0.9, i: 2, o: R5b(42, 6), back: true}],
};
const F5C = bf(43);
const R5c = (id: number, off = 0) => bf(id) + off - F5C;
const f5c: Shot = {
  id: 'f5c', from: F5C, to: bf(46), enter: 'blur',
  bg: (f) => <Bedroom mood={f < 64 ? 'night' : 'morning'} lampOn={0} curtainOpen={f < 64 ? 0.1 : 1} dim={f < 64 ? 0.2 : 0} />,
  cam0: {x: 760, y: 980, z: 1.1}, cam: [[60, 20, {x: 640, y: 900, z: 1.0}], [R5c(44), 22, {x: 540, y: 760, z: 1.1}], [R5c(45), 20, {x: 620, y: 860, z: 1.08}]],
  char: {
    x: [[0, 610], [58, 610], [76, 760], [R5c(44, -6), 760], [R5c(44, 6), 560]], y: [[0, 1050], [58, 1050], [76, 1170], [R5c(44, -6), 1170], [R5c(44, 6), 1250]],
    s: [[0, 0.68], [58, 0.68], [76, 1.0], [R5c(44, -6), 1.0], [R5c(44, 6), 1.1]], rot: [[0, 90], [58, 90], [74, 0]],
    pose: [[0, 'sleeping'], [62, 'waking_up'], [76, 'sitting_bed_bored'], [R5c(44, -6), 'walking'], [R5c(44, 6), 'standing_relaxed'], [R5c(45), 'shaking_head']],
    expr: [[0, 'sleepy'], [62, 'confused_morning'], [92, 'relieved'], [R5c(44), 'curious'], [R5c(45), 'neutral']],
    look: [[0, L.cam], [62, L.left], [92, L.cam], [R5c(44), L.up], [R5c(45), L.right]], talk: [[0, false], [92, true]],
  },
  ills: [
    {c: (t) => <P5.DreamBubble t={t} />, x: 760, y: 740, s: 0.62, i: 6, o: 58},
    {c: (t) => <P5.AlarmClock t={t} />, x: 300, y: 820, s: 0.55, i: 60, o: R5c(44)},
    {c: (t) => <P5.NormalCheck t={t} />, x: 540, y: 520, s: 0.75, i: 92, o: R5c(44)},
    {c: (t) => <P5.SpermDiagram t={t} />, x: 540, y: 520, s: 0.72, i: R5c(44, 4), o: R5c(45, 6)},
    {c: (t) => <P5.FactoryX t={t} />, x: 830, y: 720, s: 0.6, i: R5c(45, 4), o: 9999},
  ],
};

/* =============================== CTA =============================== */
const F6 = bf(46);
const R6 = (id: number, off = 0) => bf(id) + off - F6;
const cta: Shot = {
  id: 'cta', from: F6, to: bf(51), enter: 'light', bg: (f) => <CtaStage dim={kf(f, [[0, 0], [R6(49), 0], [R6(49, 10), 0.2]])} />, cam0: {x: 540, y: 900, z: 1.05},
  cam: [[R6(47), 18, {x: 540, y: 800, z: 1.05}], [R6(48), 26, {x: 540, y: 760, z: 1.2}], [R6(49), 22, {x: 520, y: 760, z: 1.0}], [R6(50), 30, {x: 540, y: 900, z: 0.92}]],
  char: {
    x: [[0, 560], [R6(49, -4), 560], [R6(49, 10), 800]],
    pose: [[0, 'standing_relaxed'], [R6(47), 'hand_chin'], [R6(48), 'standing_relaxed'], [R6(49), 'pointing_up'], [R6(50), 'arms_crossed']],
    expr: [[0, 'curious'], [R6(47), 'thinking'], [R6(48), 'relieved'], [R6(49), 'happy'], [R6(50), 'confident'], [R6(50, 40), 'happy']],
    look: [[0, L.left], [R6(47), L.up], [R6(48), L.up], [R6(49), L.upL], [R6(50), L.cam]], talk: [[0, true]], rim: [[0, false], [R6(49, 16), true]],
  },
  ills: [
    {c: (t) => <CT.GuideBook t={t} />, x: 280, y: 700, s: 0.62, i: 4, o: R6(47)},
    {c: (t) => <CT.MazeVsMap t={t} />, x: 540, y: 480, s: 0.65, i: R6(47, 3), o: R6(48)},
    {c: (t) => <CT.BrainKintsugi t={t} />, x: 540, y: 480, s: 0.62, i: R6(48, 3), o: R6(49)},
    {c: (t) => <CT.LogoNeon t={t} w={520} />, x: 380, y: 560, s: 1, i: R6(49), o: 9999, e: 'none'},
  ],
};

/* =============================== END CARD (2,5 dtk) =============================== */
const FE = bf(51);
const endCard: Shot = {
  id: 'end', from: FE, to: TOTAL_FRAMES, enter: 'blur', bg: () => <CtaStage dim={0.45} />, cam0: {x: 540, y: 900, z: 1.0}, cam: [[0, 70, {z: 1.06}]],
  char: {x: [[0, 540]], y: [[0, 1330]], s: [[0, 0.74]], pose: [[0, 'arms_crossed']], expr: [[0, 'happy']], look: [[0, L.up]], rim: [[0, true]]},
  ills: [{c: (t) => <CT.LogoNeon t={t + 40} w={640} />, x: 540, y: 640, s: 1, i: 0, o: 9999, e: 'pop'}],
};

export const SHOTS: Shot[] = [...hook, f1, f2, f3, f4, f5a, f5b, f5c, cta, endCard];
export {BEATS};
