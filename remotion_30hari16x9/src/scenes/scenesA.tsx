// SCENE bagian A: HOOK (3 quick cut, tempat beda) -> HARI 1-3 (apartemen studio malam) -> HARI KE-7 (gym malam).
// Kamera: tiap ilustrasi muncul -> zoom/tilt/pan membawa fokusnya ke TENGAH layar (960,545); tiap zoom in tone latar bergeser (tempat tetap).
import React from 'react';
import {DarkBedroom, FEET, MriRoom, NightGym, NightKitchen, StudioApartment} from '../components/Places30';
import {LitCharacter, Reflect} from '../components/Lit';
import {Character} from '../components/Character';
import {Spotlight} from '../components/Spot';
import * as A from '../illustrations/h30/partA';
import * as B from '../illustrations/h30/partB';
import {Appear, be, bf, ease, kp, ramp, shake} from '../kit';
import {K, guardCam, track} from '../cameraTrack';
import {setKeyPos} from '../components/UI';
import {ShotDef} from './types';

export const seg = (f: number, a: number, b: number, fd = 8) => Math.max(0, Math.min(1, (f - a) / fd + 1, (b - f) / fd + 1, 1));
const SC = 0.8; // skala karakter standar 16:9
const HEAD = FEET - 600 * SC; // puncak kepala dunia (berdiri)

/* ================= HOOK ================= */
setKeyPos({1: [960, 800], 3: [960, 805]});
const kh1 = [K(1, 0, 960, 520, 1.0, 'mri'), K(1, 12, 820, 440, 1.32, 'mri')];
export const shotH1: ShotDef = {
  id: 'h1', from: 0, to: bf(2), enter: 'cut', trLen: 0,
  cam: (f) => track(f, kh1).cam, bg: (f) => <MriRoom T={track(f, kh1).tone} />, bgBlur: () => 7, dim: () => 0.28,
  fg: (f) => (
    <g>
      <Spotlight x={960} y={500} rx={760} ry={560} dark={0.45} />
      <g transform="translate(820,440) scale(0.72)"><A.BrainMonitor t={f} /></g>
      <Reflect floor={FEET} op={0.2}>
        <g transform={`translate(${kp(f, [[0, 1560], [30, 1330]])},622) rotate(-90) scale(0.6)`}>
          <LitCharacter id="h1m" x={0} y={0} pose="sliding_into_mri" expression="curious" haloColor="#7FE8F0" />
        </g>
      </Reflect>
    </g>
  ),
};
const kh2 = [K(2, 0, 700, 540, 1.15, 'darkRoom'), K(2, 12, 980, 520, 1.2, 'darkRoom')];
export const shotH2: ShotDef = {
  id: 'h2', from: bf(2), to: bf(3), enter: 'cut', trLen: 0,
  cam: (f) => track(f, kh2).cam, bg: (f) => <DarkBedroom T={track(f, kh2).tone} />, bgBlur: () => 7, dim: () => 0.3,
  fg: (f) => (
    <g>
      <Spotlight x={960} y={520} rx={760} ry={560} dark={0.5} />
      <Reflect floor={FEET} op={0.22}>
        <LitCharacter id="h2m" x={640} y={FEET} scale={SC} pose="locking_drawer" expression="determined" haloColor="#9A8AD8" />
        <g transform="translate(1000,600) scale(0.72)"><A.DrawerLock t={f} close={ramp(f, bf(2, 2), bf(2, 14))} lock={ramp(f, bf(2, 14), bf(2, 26))} /></g>
      </Reflect>
      <g transform="translate(1420,330)"><A.ShockedBrain t={f} shock={0.4 + 0.6 * ramp(f, bf(2, 10), bf(2, 16))} s={0.42} /></g>
    </g>
  ),
};
const kh3 = [K(3, 0, 960, 520, 1.0, 'kitchen'), K(3, 12, 1080, 470, 1.3, 'kitchen')];
export const shotH3: ShotDef = {
  id: 'h3', from: bf(3), to: bf(4), enter: 'cut', trLen: 0,
  cam: (f) => track(f, kh3).cam, bg: (f) => <NightKitchen T={track(f, kh3).tone} />, bgBlur: () => 7, dim: () => 0.3,
  fg: (f) => {
    const p = ease(f, bf(3, 2), bf(3, 30));
    return (
      <g>
        <Spotlight x={1000} y={500} rx={760} ry={560} dark={0.5} />
        <Reflect floor={FEET} op={0.22}><LitCharacter id="h3m" x={560} y={FEET} scale={SC} pose="glancing_at_camera" expression={[[-100, 'sneaky'], [bf(3, 18), 'curious']]} haloColor="#FFC27A" lookAt={{x: -0.6, y: 0}} /></Reflect>
        <g transform="translate(980,460) scale(0.85)"><A.FlipClock t={f} p={p} /></g>
        <g transform="translate(1380,450)"><A.ColorBrain t={f} p={p} s={0.55} /></g>
      </g>
    );
  },
};

/* ================= HARI 1-3: APARTEMEN STUDIO MALAM ================= */
setKeyPos({4: [960, 790], 5: [960, 800], 7: [960, 800], 13: [960, 800], 14: [960, 805]});
const k13 = [
  K(4, 0, 960, 560, 1.35, 'aptPurple'), K(4, 16, 880, 470, 1.25, 'aptPurple'),           // fade gelap -> reveal, zoom ke tembok turus
  K(5, 0, 880, 500, 1.15), K(5, 14, 900, 490, 1.2, 'aptRed'), K(5, 40, 900, 490, 1.2), K(5, 56, 920, 480, 1.3, 'aptPurple'), // angin (tilt + shake)
  K(6, 0, 960, 500, 1.15), K(6, 14, 1080, 480, 1.35, 'aptViolet'),                        // indikator BBM
  K(7, 0, 1040, 490, 1.25), K(7, 14, 1040, 470, 1.3, 'aptPurple'), K(7, 40, 1040, 470, 1.3), K(7, 56, 1060, 460, 1.42, 'aptRed'), // domino
  K(8, 0, 900, 500, 1.2), K(8, 14, 960, 480, 1.2, 'aptPurple'),                           // bola tenis (pan)
  K(9, 0, 1000, 470, 1.15), K(9, 14, 1300, 380, 1.2, 'aptViolet'),                         // tilt ke jendela tetangga
  K(10, 0, 700, 520, 1.2), K(10, 12, 560, 540, 1.4, 'aptRed'),                            // HP meluncur ke tangan
  K(11, 0, 620, 500, 1.3), K(11, 12, 760, 460, 1.45, 'aptPurple'),                        // HP kotak harta
  K(12, 0, 900, 460, 1.15), K(12, 22, 960, 480, 1.1, 'aptViolet'),                        // tirai ditutup (tilt pelan)
  K(13, 0, 900, 460, 1.15), K(13, 14, 900, 430, 1.3, 'aptViolet'), K(13, 40, 900, 430, 1.3), K(13, 56, 920, 440, 1.38, 'aptRed'), // withdrawal
  K(14, 0, 760, 500, 1.15), K(14, 30, 960, 500, 1.15, 'aptPurple'),                       // sakau (pan ikut langkah)
];
const shadowOf = (x: number, pose: 'pacing_shadow_double', f: number, id: string, dx: number, op: number) => (
  <g opacity={op} style={{filter: 'brightness(0) blur(3px)'}} transform={`translate(${dx + Math.sin(f * 0.9) * 6},${-40}) skewX(-12)`}>
    <Character id={id} x={x} y={FEET} scale={SC * 1.05} pose={pose} expression="anxious" />
  </g>
);
export const shotH13: ShotDef = {
  id: 'h13', from: bf(4), to: bf(15), enter: 'dark', trLen: 14,
  cam: (f) => {
    const c = guardCam(track(f, k13).cam, [manX13(f), f >= bf(4) && f < bf(5) ? FEET - 330 : HEAD]);
    const sh = f >= bf(5) && f < be(5) ? [Math.sin(f * 1.7) * 3, Math.cos(f * 2.1) * 2] : shake(f, bf(13, 4), 10, 4);
    return {...c, x: c.x + sh[0], y: c.y + sh[1]};
  },
  bg: (f) => <StudioApartment T={track(f, k13).tone} t={f} windowsOff={ease(f, bf(9, 2), be(9))} curtain={ease(f, bf(12, 0), bf(12, 18))} />,
  bgBlur: () => 8, dim: () => 0.32,
  fg: (f) => {
    const x = manX13(f);
    return (
      <g>
        <Spotlight x={960} y={500} rx={760} ry={560} dark={0.45} />
        {/* 4 turus di tembok */}
        <g opacity={seg(f, bf(4), be(4) + 6)} transform="translate(1030,430) scale(0.62)"><A.TallyMarks t={f} k={ramp(f, bf(4, 2), bf(4, 22)) * 3} /></g>
        {/* 14 bayangan dobel bergetar di tembok */}
        {f >= bf(14) && f < be(14) + 8 && <g>{shadowOf(x, 'pacing_shadow_double', f, 'sh1', 70, 0.35 * seg(f, bf(14), be(14)))}{shadowOf(x, 'pacing_shadow_double', f + 7, 'sh2', 130, 0.22 * seg(f, bf(14), be(14)))}</g>}
        <Reflect floor={FEET} op={0.22}>
          <LitCharacter id="m13" x={x} y={FEET} scale={SC} haloColor={f >= bf(11) && f < bf(12) ? '#FF5FA2' : '#E05AA8'} phoneColor="#FF5FA2"
            pose={[[-100, 'tally_marks_on_wall'], [bf(5), 'walking_against_wind'], [bf(6), 'standing_relaxed'], [bf(8), 'bouncing_ball_on_wall'], [bf(9), 'standing_relaxed'],
              [bf(10), 'catching_sliding_phone'], [bf(12), 'closing_curtain'], [bf(13), 'hugging_self_scratching_arm'], [bf(14), 'pacing_shadow_double']]}
            expression={[[-100, 'focused'], [bf(5), 'sweaty'], [bf(6), 'relieved'], [bf(7), 'anxious'], [bf(8), 'bored'], [bf(9), 'lonely'], [bf(10), 'tempted'],
              [bf(13), 'anxious'], [bf(14), 'restless']]}
            lookAt={f >= bf(9) && f < bf(10) ? {x: 0.8, y: -0.5} : f >= bf(6) && f < bf(8) ? {x: 0.7, y: -0.2} : {x: 0, y: 0}} />
        </Reflect>
        {/* 5 angin kencang */}
        <g opacity={seg(f, bf(5), be(5))} transform="translate(960,480)"><A.WindGust t={f} w={1400} /></g>
        {/* 6 indikator BBM */}
        <Appear f={f} a={bf(6, 2)} b={be(6)} x={1080} y={480} s={0.6} kind="glow"><A.BodyFuelGauge t={f} up={ramp(f, bf(6, 6), bf(6, 22))} /></Appear>
        {/* 7 otak domino */}
        <Appear f={f} a={bf(7, 2)} b={be(7)} x={1060} y={460} s={0.95} kind="glow"><A.DominoBrain t={f - bf(7)} /></Appear>
        {/* 8 bola tenis (tembok di kanan) */}
        <g opacity={seg(f, bf(8), be(8))} transform="translate(1000,470) scale(-1,1)"><A.TennisBounce t={f} dist={380} /></g>
        {/* 10 HP meluncur di meja ke tangan */}
        <g opacity={seg(f, bf(10), be(10) + 4)} transform="translate(660,560)"><A.PhoneSlide t={f} slide={ramp(f, bf(10), be(10))} dist={400} /></g>
        {/* 11 HP terbuka kayak kotak harta */}
        <Appear f={f} a={bf(11, 0)} b={be(11)} x={760} y={480} s={0.8}><A.TreasurePhone t={f} open={ramp(f, bf(11, 4), bf(11, 18))} /></Appear>
        {/* 12 lampu meja padam + tisu kena cahaya terakhir */}
        <g opacity={seg(f, bf(12), be(12))}>
          <g transform="translate(720,430) scale(0.6)"><A.DeskLamp t={f} on={1 - ease(f, bf(12, 12), bf(12, 20))} /></g>
          <g transform="translate(560,500) scale(0.62)"><A.TissueLastLight t={f} light={1 - 0.6 * ease(f, bf(12, 14), be(12))} /></g>
        </g>
        {/* 13 sinyal 0 bar + jam mundur + keringat */}
        <g opacity={seg(f, bf(13), be(13))}>
          <g transform={`translate(${x + 150},330) scale(0.7)`}><A.SignalDrop t={f} drop={ramp(f, bf(13, 4), bf(13, 30))} /></g>
          <g transform="translate(1180,400) scale(0.6)"><A.ReverseClock t={f} /></g>
          <g transform={`translate(${x},350) scale(0.7)`}><A.SweatDrops t={f} /></g>
        </g>
      </g>
    );
  },
};
const manX13 = (f: number) => kp(f, [[bf(4), 860], [bf(5), 860], [bf(5, 2), 640], [be(5), 780], [bf(6), 640], [bf(8), 640], [bf(8, 1), 660], [bf(9), 700],
  [bf(10), 700], [bf(10, 1), 380], [bf(12), 380], [bf(12, 1), 1160], [bf(13), 1160], [bf(13, 1), 760], [bf(14), 720], [be(14), 1000]]);

/* ================= HARI KE-7: GYM MALAM ================= */
setKeyPos({16: [960, 800], 18: [960, 805], 20: [960, 800]});
const k7 = [
  K(15, 0, 960, 540, 1.0, 'gymBlue'), K(15, 20, 960, 500, 1.08, 'gymBlue'),                // whip -> gym, papan skor
  K(16, 0, 960, 520, 1.1), K(16, 14, 1000, 520, 1.35, 'gymCyan'), K(16, 50, 1000, 520, 1.35), K(16, 66, 1020, 500, 1.45, 'gymBlue'), // jurnal
  K(17, 0, 1000, 480, 1.2), K(17, 14, 1000, 460, 1.3, 'gymCyan'),                          // molekul
  K(18, 0, 1060, 560, 1.2), K(18, 30, 1060, 430, 1.25, 'gymDeep'), K(18, 60, 1060, 430, 1.25), K(18, 76, 1000, 470, 1.15, 'gymBlue'), // tilt naik ikut bandul
  K(19, 0, 1060, 440, 1.2), K(19, 20, 1060, 520, 1.2, 'gymBlue'),                          // tilt turun
  K(20, 0, 900, 440, 1.3, 'gymCyan'), K(20, 40, 960, 500, 1.0, 'gymBlue'),                 // pull-out barbel balon
  K(21, 0, 1040, 470, 1.1), K(21, 14, 1120, 440, 1.35, 'gymDeep'),                         // termostat
];
const manX7 = (f: number) => kp(f, [[bf(15), 260], [bf(15, 30), 640], [bf(18), 640], [bf(20), 640], [bf(20, 1), 900], [bf(21), 900], [bf(21, 1), 1000]]);
export const shotH7: ShotDef = {
  id: 'h7', from: bf(15), to: bf(22), enter: 'whip', trLen: 12,
  cam: (f) => guardCam(track(f, k7).cam, [manX7(f), f >= bf(20) && f < bf(21) ? HEAD - 120 : HEAD]),
  bg: (f) => <NightGym T={track(f, k7).tone} />, bgBlur: () => 8, dim: () => 0.3,
  fg: (f) => {
    const lvl = f < bf(19) ? 145 * ease(f, bf(18, 10), bf(18, 24)) : 145 - 45 * ease(f, bf(19, 4), bf(19, 34));
    const released = f >= bf(20, 32);
    return (
      <g>
        <Spotlight x={980} y={500} rx={760} ry={560} dark={0.45} />
        <Appear f={f} a={bf(15, 4)} b={be(15)} x={1060} y={380} s={0.6} kind="glow"><B.Scoreboard t={f} on={ramp(f, bf(15, 6), bf(15, 14))} /></Appear>
        <g opacity={seg(f, bf(16), be(16))}>
          <rect x={820} y={600} width={360} height={22} rx={8} fill="#2E3A4A" /><rect x={840} y={622} width={14} height={178} fill="#1E2632" /><rect x={1146} y={622} width={14} height={178} fill="#1E2632" />
          <g transform="translate(1000,560) scale(0.62)"><B.FlippingJournal t={f} /></g>
        </g>
        <Appear f={f} a={bf(17, 2)} b={be(17)} x={1000} y={460} s={0.78} kind="glow"><B.TestoMolecule t={f} /></Appear>
        <g opacity={seg(f, bf(18), be(19))} transform="translate(1060,520) scale(0.6)"><B.HighStriker t={f} level={lvl} hit={ramp(f, bf(18, 2), bf(18, 10))} /></g>
        {f >= bf(20) && released && f < be(20) + 8 && <g opacity={seg(f, bf(20), be(20))} transform="translate(900,350)"><B.FloatingBarbell t={f} up={ramp(f, bf(20, 32), be(20))} /></g>}
        <Appear f={f} a={bf(21, 2)} b={be(21)} x={1170} y={430} s={0.5} kind="glow"><B.Thermostat t={f} turn={ramp(f, bf(21, 10), bf(21, 50))} /></Appear>
        <Reflect floor={FEET} op={0.26}>
          <LitCharacter id="m7" x={manX7(f)} y={FEET} scale={SC} haloColor="#4FA8FF"
            pose={[[-100, 'jogging_in'], [bf(15, 30), 'standing_relaxed'], [bf(18), 'standing_tall_chest_out'], [bf(19), 'standing_relaxed'],
              [bf(20), 'lifting_balloon_barbell'], [bf(20, 32), 'standing_relaxed'], [bf(21), 'adjusting_wall_thermostat']]}
            expression={[[-100, 'determined'], [bf(16), 'curious'], [bf(18), 'proud'], [bf(19), 'flat'], [bf(20), 'proud'], [bf(20, 26), 'embarrassed'], [bf(21), 'relieved']]}
            lookAt={f >= bf(20, 32) && f < bf(21) ? {x: 0, y: -0.9} : {x: 0.6, y: -0.2}} />
        </Reflect>
      </g>
    );
  },
};
export const SHOTS_A = [shotH1, shotH2, shotH3, shotH13, shotH7];
