// FASE 1 (beat 6-16): perpustakaan malam, tone dasar biru tua -> tiap zoom bergeser (libDeep / libIndigo / libPurple).
// PMO SAVIOR (beat 17-20): panggung gelap ala ref_1, aksen amber; berakhir zoom ke pintu 2 (transisi cahaya oranye ke Fase 2).
import React from 'react';
import {FEET, HZ, Library, Stage4} from '../components/Places4';
import {Halo, LitCharacter, Reflect, Rise} from '../components/Lit';
import {Spotlight} from '../components/Spot';
import * as O from '../illustrations/ob';
import * as S from '../illustrations/shared';
import * as PR from '../illustrations/promo';
import {Appear, be, bf, ease, kp, ramp} from '../kit';
import {K, guardCam, track} from '../cameraTrack';
import {setKeyPos} from '../components/UI';
import {ShotDef} from './types';

const seg = (f: number, a: number, b: number, fd = 8) => Math.max(0, Math.min(1, (f - a) / fd + 1, (b - f) / fd + 1, 1));

/* ================= FASE 1 ================= */
setKeyPos({7: [540, 1200], 8: [540, 1210], 9: [540, 1200], 15: [540, 1215], 16: [540, 1215]});
const k1 = [
  K(6, 0, 540, 840, 1.5, 'libBlue'), K(6, 28, 540, 900, 1.0, 'libBlue'),            // keluar dari pintu 1 -> reveal perpustakaan
  K(7, 0, 540, 900, 1.0), K(7, 20, 620, 880, 1.18, 'libDeep'),                      // HP 18+ + kabel ke dahi
  K(7, 56, 620, 880, 1.18), K(7, 76, 440, 800, 1.45, 'libIndigo'),                  // zoom ke dahi (mikro-beat)
  K(8, 0, 440, 800, 1.45), K(8, 18, 740, 800, 1.3, 'libDeep'),                       // kepala samping, PFC meredup
  K(8, 58, 720, 800, 1.3), K(8, 76, 740, 770, 1.42, 'libIndigo'),
  K(9, 0, 740, 770, 1.42), K(9, 16, 850, 740, 1.55, 'libPurple'),                    // tilt ke mesin/gear di dahi
  K(9, 54, 850, 740, 1.55), K(9, 70, 840, 760, 1.66, 'libIndigo'),
  K(10, 0, 840, 760, 1.66), K(10, 16, 740, 820, 1.28, 'libBlue'),                    // benang -> jaringan
  K(11, 0, 740, 820, 1.28), K(11, 12, 740, 880, 1.3, 'libDeep'),                     // catur (tilt)
  K(12, 0, 740, 880, 1.3), K(12, 12, 740, 780, 1.34, 'libIndigo'),                   // papan tulis (zoom)
  K(13, 0, 740, 780, 1.34), K(13, 12, 740, 860, 1.3, 'libDeep'),                     // peta (tilt)
  K(14, 0, 740, 860, 1.3), K(14, 14, 580, 900, 1.12, 'libIndigo'),                   // menahan HP + rem
  K(15, 0, 580, 900, 1.12), K(15, 16, 540, 940, 1.05, 'libPurple'),                  // roda hamster + loop
  K(15, 50, 540, 940, 1.05), K(15, 66, 540, 930, 1.16, 'libIndigo'),
  K(16, 0, 600, 760, 1.16), K(16, 18, 620, 860, 1.14, 'libDeep'),                    // tilt turun: mesin melemah
  K(16, 56, 620, 860, 1.14), K(16, 72, 640, 840, 1.24, 'libPurple'),
];
const DESK_X = 500;
export const shotF1: ShotDef = {
  id: 'f1', from: bf(6), to: bf(17), enter: 'light', trLen: 16, trColor: '#FFE08A',
  cam: (f) => guardCam(track(f, k1).cam, [kp(f, [[bf(14), 400], [bf(15), 400], [bf(15, 12), 540]]), f < bf(14) ? FEET - 520 : FEET - 610]),
  bg: (f) => <Library T={track(f, k1).tone} />,
  bgBlur: () => 8, dim: () => 0.38,
  fg: (f) => {
    const sit = f < bf(14);
    const desk = 1 - ease(f, bf(14, 0), bf(14, 10));
    const pfc = 1 - 0.65 * ease(f, bf(8, 10), bf(8, 60));
    const manX = kp(f, [[bf(14), 400], [bf(15), 400], [bf(15, 12), 540]]);
    return (
      <g>
        <Spotlight x={620} y={880} rx={560} ry={760} dark={0.45} />
        <Reflect floor={FEET} op={0.22}>
          <LitCharacter id="f1m" x={manX} y={FEET} scale={1.0} haloColor="#7FB2FF"
            pose={[[-100, 'sitting_desk_study'], [bf(14), 'blocking_hand'], [bf(15), 'running_hamster_wheel'], [bf(16), 'head_down']]}
            expression={[[-100, 'thinking'], [bf(7, 10), 'hooked'], [bf(7, 60), 'dazed'], [bf(9), 'curious'], [bf(10), 'thinking'], [bf(12), 'curious'],
              [bf(13), 'thinking'], [bf(14), 'determined'], [bf(15), 'struggling'], [bf(16), 'tired']]}
            lookAt={f < bf(8) ? {x: 0.6, y: 0.5} : {x: 0.8, y: -0.2}} />
          <g opacity={desk} transform={`translate(${DESK_X},${FEET - 165})`}>
            <rect x={-330} y={0} width={660} height={22} rx={6} fill="#4A5A7A" /><rect x={-310} y={22} width={620} height={143} fill="#26304A" />
            <path d="M -170 -2 L -40 -2 L -30 -12 L -160 -12 Z" fill="#F2EEE6" />
          </g>
        </Reflect>
        {/* 7: HP 18+ di meja -> kabel merah ke dahi */}
        <g opacity={seg(f, bf(7), be(7))}>
          <Appear f={f} a={bf(7, 2)} b={be(7)} x={820} y={FEET - 250}><g transform="rotate(-12)"><S.Phone18 w={110} /></g></Appear>
          <O.RedCable x1={810} y1={FEET - 215} x2={428} y2={745} k={ease(f, bf(7, 8), bf(7, 30))} t={f} />
          <Halo x={428} y={745} rx={70} color="#FFD166" op={0.6 * (1 - ease(f, bf(7, 30), bf(7, 90)))} />
        </g>
        {/* 8-9: kepala samping, PFC meredup -> mesin gear emas */}
        <Appear f={f} a={bf(8, 2)} b={be(9)} x={780} y={800} s={0.85} kind="glow">
          <O.HeadProfile pfc={f < bf(9) ? pfc : ease(f, bf(9, 0), bf(9, 14), 0.35, 1)} flick={f < bf(9) ? 1 : 0} gears={ease(f, bf(9, 4), bf(9, 16))}
            speed={1 + ease(f, bf(9, 50), bf(9, 70)) * 1.5} t={f} />
        </Appear>
        {f > bf(9, 50) && f < be(9) + 6 && <Rise x={850} y={760} w={160} h={260} n={8} t={f} />}
        {/* 10-13: fungsi PFC */}
        <Appear f={f} a={bf(10, 2)} b={be(10)} x={790} y={820} s={0.78}><O.TangleToNet k={ease(f, bf(10, 10), bf(10, 50))} t={f} /></Appear>
        <Appear f={f} a={bf(11, 1)} b={be(11)} x={790} y={880} s={0.72}><O.ChessBoard move={ease(f, bf(11, 10), bf(11, 30))} /></Appear>
        <Appear f={f} a={bf(12, 1)} b={be(12)} x={790} y={780} s={0.64}><O.Chalkboard k={ease(f, bf(12, 4), be(12))} t={f} /></Appear>
        <Appear f={f} a={bf(13, 1)} b={be(13)} x={790} y={860} s={0.66}><O.MapPath unroll={ease(f, bf(13, 2), bf(13, 16))} path={ease(f, bf(13, 12), be(13))} t={f} /></Appear>
        {/* 14: menahan HP yang mendekat + pedal rem */}
        <g opacity={seg(f, bf(14), be(14))}>
          <g transform={`translate(${kp(f, [[bf(14), 900], [bf(14, 20), 700]])},800) rotate(-10)`}><S.Phone18 w={120} /></g>
          <Appear f={f} a={bf(14, 10)} b={be(14)} x={620} y={1120} s={0.7} kind="rise"><O.BrakeGlow press={ease(f, bf(14, 18), bf(14, 26))} /></Appear>
        </g>
        {/* 15: panah loop siklus mengelilingi roda */}
        <Appear f={f} a={bf(15, 2)} b={be(15)} x={540} y={990} kind="glow"><O.LoopArrows t={f} r={330} /></Appear>
        {/* 16: mesin melambat berasap + speedometer turun */}
        <Appear f={f} a={bf(16, 2)} b={be(16, 4)} x={760} y={800} s={0.75} kind="glow">
          <O.HeadProfile pfc={1 - 0.6 * ease(f, bf(16, 10), be(16))} gears={1} speed={1 - 0.9 * ease(f, bf(16, 0), bf(16, 60))} smoke={ease(f, bf(16, 20), bf(16, 50))} t={f} />
        </Appear>
        <Appear f={f} a={bf(16, 30)} b={be(16, 4)} x={520} y={640} s={0.55}><O.Speedometer v={1 - ease(f, bf(16, 34), bf(16, 74))} /></Appear>
      </g>
    );
  },
};

/* ================= PMO SAVIOR ================= */
setKeyPos({18: [540, 1210]});
const k2 = [
  K(17, 0, 540, 900, 1.0, 'stageAmber'), K(17, 14, 560, 860, 1.06, 'stageAmber'),      // link di bio
  K(18, 0, 560, 860, 1.06), K(18, 16, 660, 880, 1.25, 'stageWarm'),                     // zoom ke buku, hangat makin terang
  K(19, 0, 660, 880, 1.25), K(19, 16, 660, 820, 1.3, 'stageAmber'),                     // retakan kepala menyatu
  K(19, 50, 660, 820, 1.3), K(19, 66, 660, 810, 1.42, 'stageWarm'),
  K(20, 0, 600, 860, 1.1), K(20, 30, 560, 900, 1.12, 'stageNavy'),                      // lampu redup, pintu 2 muncul
  K(20, 60, 560, 900, 1.2, 'stageCold'), K(20, 91, 560, 930, 2.6, 'stageCold'),        // zoom masuk pintu 2
];
export const shotPmo: ShotDef = {
  id: 'pmo', from: bf(17), to: bf(21), enter: 'dark', trLen: 18,
  cam: (f) => guardCam(track(f, k2).cam, [270, FEET - 580]),
  bg: (f) => <Stage4 T={track(f, k2).tone} spot={1 - 0.7 * ease(f, bf(20, 0), bf(20, 24))} />,
  bgBlur: () => 6, dim: () => 0.22,
  fg: (f) => {
    const dark = ease(f, bf(20, 0), bf(20, 24));
    return (
      <g>
        <Spotlight x={600} y={880} rx={560} ry={760} dark={0.4 + 0.25 * dark} />
        {/* 20: pintu 2 oranye di belakang */}
        <Reflect floor={HZ} op={0.4} depth={420}>
          <g transform={`translate(560,${HZ})`} opacity={ease(f, bf(20, 20), bf(20, 34))}>
            <O.GlowDoor n={2} color="#FF8A2B" on={ease(f, bf(20, 24), bf(20, 40))} open={ease(f, bf(20, 64), bf(21))} />
          </g>
        </Reflect>
        <Reflect floor={FEET} op={0.25}>
          <LitCharacter id="pm" x={kp(f, [[bf(17), 280], [bf(20), 280], [bf(20, 20), 260]])} y={FEET} scale={0.95}
            pose={[[-100, 'pointing_up'], [bf(18), 'standing_relaxed'], [bf(20), 'standing_still_lookup']]}
            expression={[[-100, 'curious'], [bf(18, 10), 'relieved'], [bf(20, 4), 'worried']]}
            lookAt={f < bf(20) ? {x: 0.7, y: -0.6} : {x: 0.9, y: -0.2}} haloColor={f < bf(20, 10) ? '#FFB23F' : '#7FB7C9'} halo={1 - 0.4 * dark} />
        </Reflect>
        <Appear f={f} a={bf(17, 2)} b={be(17)} x={640} y={720} kind="glow"><PR.LinkIcon t={f} on={ease(f, bf(17, 4), bf(17, 16))} /></Appear>
        <Appear f={f} a={bf(17, 8)} b={be(17)} x={820} y={620} kind="glow"><PR.ArrowUp t={f} on={1} h={170} /></Appear>
        <Appear f={f} a={bf(18, 2)} b={be(18)} x={660} y={900} kind="glow"><O.GuideBook open={ease(f, bf(18, 2), bf(18, 18))} net={ease(f, bf(18, 16), be(18))} t={f} /></Appear>
        {f > bf(18, 14) && f < be(19) && <Rise x={660} y={900} w={380} h={420} n={10} t={f} op={1 - ease(f, be(19) - 10, be(19))} />}
        <Appear f={f} a={bf(19, 2)} b={be(19)} x={660} y={830} s={0.95} kind="glow">
          <O.HeadProfile pfc={1} crack={1} heal={ease(f, bf(19, 20), bf(19, 76))} tint="#FFB23F" t={f} />
        </Appear>
      </g>
    );
  },
};
