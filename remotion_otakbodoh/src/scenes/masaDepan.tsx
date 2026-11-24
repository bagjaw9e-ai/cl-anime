// HANCURNYA MASA DEPAN: ruang meeting kosong (beat 46-53, tone abu dingin) -> jalan panjang ke cakrawala senja (beat 54-57,
// tone merah redup) -> PENUTUP (beat 58, sisa durasi BGM): lampu padam pelan, hanya pantulan karakter di lantai yang samar.
import React from 'react';
import {FEET, HorizonRoad, OfficeMeeting} from '../components/Places4';
import {LitCharacter, Reflect} from '../components/Lit';
import {Spotlight} from '../components/Spot';
import {Silhouette} from '../components/Silhouette';
import * as O from '../illustrations/ob';
import * as S from '../illustrations/shared';
import * as A from '../illustrations/part1';
import * as U from '../illustrations/u25';
import {Appear, CY, be, bf, ease, kp, ramp, sm} from '../kit';
import {K, guardCam, track} from '../cameraTrack';
import {setKeyPos} from '../components/UI';
import {TOTAL_FRAMES, VO_FRAMES} from '../timeline';
import {ShotDef} from './types';

const seg = (f: number, a: number, b: number, fd = 8) => Math.max(0, Math.min(1, (f - a) / fd + 1, (b - f) / fd + 1, 1));

/* ================= KANTOR ================= */
setKeyPos({48: [540, 1250], 49: [540, 1235]});
const k1 = [
  K(46, 0, 540, 860, 1.35, 'officeGray'), K(46, 32, 540, 900, 1.0, 'officeGray'),     // reveal kantor kosong (pull-out)
  K(46, 60, 540, 900, 1.0), K(46, 80, 480, 840, 1.15, 'officeCold'),
  K(47, 0, 500, 880, 1.12), K(47, 14, 620, 1000, 1.3, 'officeGray'),                   // buku teori ditutup (tilt turun)
  K(47, 50, 620, 1000, 1.3), K(47, 66, 460, 960, 1.2, 'officeCold'),                   // pindah ke meja nyata
  K(48, 0, 500, 820, 1.1), K(48, 16, 540, 700, 1.3, 'officeCold'),                     // grafik di layar presentasi
  K(48, 60, 540, 700, 1.3), K(48, 78, 560, 700, 1.4, 'officeDim'),
  K(49, 0, 520, 760, 1.15), K(49, 14, 460, 790, 1.5, 'officeGray'),                    // zoom ke wajah blank
  K(50, 0, 460, 790, 1.5), K(50, 14, 430, 770, 2.8, 'officeCold'),                     // extreme zoom ke mata
  K(51, 0, 560, 1040, 1.1, 'officeGray'), K(51, 40, 680, 760, 1.18, 'officeDim'),      // tilt naik ikut tumpukan berkas
  K(52, 0, 600, 860, 1.1), K(52, 14, 540, 860, 1.22, 'officeCold'),                    // lensa rack focus
  K(53, 0, 540, 860, 1.22), K(53, 14, 640, 820, 1.32, 'officeDim'),                    // gear berkarat
];
export const shotOffice: ShotDef = {
  id: 'office', from: bf(46), to: bf(54), enter: 'dark', trLen: 18,
  cam: (f) => guardCam(track(f, k1).cam, f >= bf(50) && f < bf(51) ? null : [420, FEET - 520]),
  bg: (f) => <OfficeMeeting T={track(f, k1).tone} screen={f > bf(48) && f < be(48) ? 0.4 : 1} />,
  // beat 52: rack focus (latar blur-tajam-blur)
  bgBlur: (f) => 8 + (f > bf(52) && f < be(52) ? 5 * Math.sin((f - bf(52)) * 0.18) : 0),
  dim: () => 0.36,
  fg: (f) => {
    const seated = f < bf(51) || f >= bf(52);
    const slump = f >= bf(51) && f < bf(52);
    return (
      <g>
        <Spotlight x={560} y={880} rx={560} ry={760} dark={0.45} />
        <Appear f={f} a={bf(49, 2)} b={be(49)} x={820} y={FEET} s={0.9} kind="rise"><Silhouette type="man" pose="talk" t={f} rim="#BFD4FF" /></Appear>
        <Reflect floor={FEET} op={0.22}>
          {slump && <rect x={300} y={FEET - 100} width={260} height={100} rx={22} fill="#3A4152" />}
          <LitCharacter id="odm" x={kp(f, [[bf(51), 430], [bf(51, 1), 400], [bf(52), 400], [bf(52, 1), 430]])} y={FEET} scale={1.0} haloColor="#BFD4FF"
            pose={[[-100, 'sitting_meeting_blank'], [bf(51), 'procrastinating_slumped'], [bf(52), 'sitting_meeting_blank']]}
            expression={[[-100, 'blank'], [bf(47), 'empty_stare'], [bf(48), 'worried'], [bf(49), 'blank'], [bf(50), 'empty_stare'], [bf(51), 'lazy'],
              [bf(52), 'unfocused'], [bf(53), 'tired']]}
            lookAt={f >= bf(48) && f < bf(49) ? {x: 0.4, y: -0.9} : {x: 0, y: 0}} />
          {seated && (
            <g transform={`translate(560,${FEET - 140})`}>
              <rect x={-360} y={0} width={720} height={18} rx={6} fill="#5A6478" /><rect x={-340} y={18} width={680} height={122} fill="#2E3644" />
            </g>
          )}
        </Reflect>
        {/* 47: buku teori medis ditutup di meja */}
        <Appear f={f} a={bf(47, 2)} b={be(47)} x={640} y={FEET - 190} s={0.75}><O.MedBook close={ease(f, bf(47, 30), bf(47, 40))} /></Appear>
        {/* 48: grafik performa turun */}
        <Appear f={f} a={bf(48, 2)} b={be(48)} x={540} y={620} s={0.82} kind="glow"><O.ChartDrop k={ease(f, bf(48, 14), bf(48, 70))} /></Appear>
        {/* 51: tumpukan berkas makin tinggi + kalender dicoret */}
        <Appear f={f} a={bf(51, 2)} b={be(51)} x={720} y={FEET - 40} s={0.85} kind="rise"><O.FileStack h={ease(f, bf(51, 4), bf(51, 44))} t={f} /></Appear>
        <Appear f={f} a={bf(51, 16)} b={be(51)} x={760} y={600} s={0.6}><O.CalendarCrossed cross={ease(f, bf(51, 20), be(51))} /></Appear>
        {/* 52: lensa kamera tidak bisa fokus */}
        <Appear f={f} a={bf(52, 2)} b={be(52)} x={560} y={800} s={0.85} kind="glow"><U.CameraLens t={f} /></Appear>
        {/* 53: gear berkarat di kepala */}
        <Appear f={f} a={bf(53, 2)} b={be(53, 4)} x={660} y={820} s={0.85} kind="glow"><O.HeadProfile pfc={0.4} gears={1} speed={0.12} rust={1} tint="#8A90A0" t={f} /></Appear>
      </g>
    );
  },
  // beat 50: close-up mata kosong (koordinat layar, di tengah frame)
  overlay: (f) => (
    <g opacity={seg(f, bf(50, 6), be(50), 6)}>
      <rect width={1080} height={1920} fill="#05070C" opacity={0.88} />
      <g transform={`translate(540,${CY}) scale(1.05)`}><U.EyeCloseup t={f} /></g>
    </g>
  ),
};

/* ================= JALAN KE CAKRAWALA + PENUTUP ================= */
setKeyPos({54: [540, 1240], 56: [540, 1225], 57: [540, 1240]});
const k2 = [
  K(54, 0, 540, 860, 1.3, 'duskRed'), K(54, 30, 560, 900, 1.05, 'duskRed'),              // reveal jalan senja
  K(54, 70, 560, 900, 1.05), K(54, 90, 780, 1040, 1.2, 'duskDark'),                      // tilt ke rambu jalan pintas
  K(55, 0, 600, 880, 1.1), K(55, 14, 680, 860, 1.25, 'duskRed'),                          // jam pasir
  K(56, 0, 640, 880, 1.15), K(56, 14, 660, 900, 1.25, 'duskRed'),                         // lilin & tanaman POTENSI padam
  K(56, 60, 660, 900, 1.25), K(56, 80, 660, 890, 1.36, 'duskDark'),
  K(57, 0, 540, 880, 1.36, 'duskDark'), K(57, 50, 540, 900, 1.0, 'duskRed'),             // pull-out pelan ke wide
];
export const shotRoad: ShotDef = {
  id: 'road', from: bf(54), to: TOTAL_FRAMES, enter: 'dissolve', trLen: 14,
  cam: (f) => guardCam(track(f, k2).cam, [kp(f, [[bf(54), 340], [bf(54, 90), 520], [bf(55), 500], [bf(57), 540]]), FEET - 580]),
  bg: (f) => <HorizonRoad T={track(f, k2).tone} sun={1 - 0.6 * ease(f, bf(56, 20), bf(56, 80)) - 0.4 * ease(f, VO_FRAMES, TOTAL_FRAMES - 6)} />,
  bgBlur: () => 6,
  dim: (f) => 0.28 + 0.6 * ease(f, VO_FRAMES + 2, TOTAL_FRAMES - 4),
  fg: (f) => {
    const manX = kp(f, [[bf(54), 340], [bf(54, 90), 520], [bf(55), 500], [bf(57), 540]]);
    return (
      <g>
        <Spotlight x={600} y={900} rx={560} ry={760} dark={0.42} />
        <Reflect floor={FEET} op={0.32}>
          <LitCharacter id="rdm" x={manX} y={FEET} scale={0.95} haloColor="#FF6A3A" halo={1 - 0.8 * ease(f, VO_FRAMES, TOTAL_FRAMES - 10)}
            walkSpeed={f >= bf(57) ? 0.8 : 1}
            pose={[[-100, 'walking'], [bf(54, 90), 'standing_relaxed'], [bf(55), 'head_down'], [bf(56), 'head_down'], [bf(57), 'walking_treadmill']]}
            expression={[[-100, 'tempted'], [bf(55), 'hopeless'], [bf(56), 'hopeless'], [bf(57), 'hopeless']]} />
          {/* 54: rambu JALAN PINTAS -> HP 18+ + kotak tisu */}
          <Appear f={f} a={bf(54, 40)} b={be(54)} x={720} y={FEET - 40} s={0.8} kind="rise"><O.ShortcutSign p={ease(f, bf(54, 46), bf(54, 60))} t={f} /></Appear>
          <Appear f={f} a={bf(54, 70)} b={be(54)} x={920} y={FEET - 160} s={0.9}>
            <S.Phone18 w={100} /><g transform="translate(0,140) scale(0.6)"><A.TissueBox pull={0.5} /></g>
          </Appear>
        </Reflect>
        <Appear f={f} a={bf(55, 2)} b={be(55)} x={700} y={850} s={0.8} kind="glow"><O.Hourglass k={ramp(f, bf(55), be(55) + 60)} t={f} /></Appear>
        <Appear f={f} a={bf(56, 2)} b={be(56)} x={680} y={920} s={0.85} kind="glow"><O.PotentialCandle die={ease(f, bf(56, 30), bf(56, 90))} t={f - bf(56)} /></Appear>
      </g>
    );
  },
  // PENUTUP: lampu padam dari atas; hanya pantulan karakter di lantai (di bawah kaki) yang masih samar
  overlay: (f) => {
    const k = sm(ramp(f, VO_FRAMES, TOTAL_FRAMES - 4));
    if (k <= 0) return null;
    const floorScr = CY + (FEET - 900);
    return (
      <g>
        <defs>
          <linearGradient id="closeFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#020204" stopOpacity={k} />
            <stop offset={(floorScr - 10) / 1920} stopColor="#020204" stopOpacity={k} />
            <stop offset={(floorScr + 30) / 1920} stopColor="#020204" stopOpacity={k * 0.55} />
            <stop offset="1" stopColor="#020204" stopOpacity={k * 0.9} />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#closeFade)" />
      </g>
    );
  },
};
