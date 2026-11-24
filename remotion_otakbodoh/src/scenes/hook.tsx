// HOOK: quick cut 4 tempat berbeda (hard cut tiap 0,5-1,4 dtk, tiap cut snap zoom / whip / push + shake, animasi overshoot),
// frame 0 langsung bergerak. ONE SHOT: ruang kosong mengkilap, slow zoom konstan 1x -> 2,8x tanpa cut, 3 pintu nyala satu-satu,
// tone navy -> ungu gelap, zoom berakhir masuk pintu 1 (transisi cahaya ke Fase 1). Tanpa ilustrasi otak.
import React from 'react';
import {BedroomNight, ChainRoom, Classroom, DoorHall, EmptyRoom, FEET, HZ, TONES, mixTone} from '../components/Places4';
import {LitCharacter, Reflect} from '../components/Lit';
import {Spotlight} from '../components/Spot';
import * as O from '../illustrations/ob';
import * as S from '../illustrations/shared';
import * as A from '../illustrations/part1';
import * as U from '../illustrations/u25';
import {Appear, backOut, be, bf, ease, kp, ramp, shake} from '../kit';
import {K, track} from '../cameraTrack';
import {setKeyPos} from '../components/UI';
import {ShotDef} from './types';

setKeyPos({1: [540, 1200], 4: [540, 1215], 5: [540, 1215]});

/* 1. RUANG KELAS — "Otak jadi bodoh" */
const k1 = [K(1, 0, 540, 900, 1.0, 'classroom'), K(1, 12, 680, 870, 1.32, 'classroom')];
export const shotH1: ShotDef = {
  id: 'h1', from: 0, to: bf(2), enter: 'cut', trLen: 0,
  cam: (f) => track(f, k1).cam,
  bg: (f) => <Classroom T={track(f, k1).tone} />,
  bgBlur: () => 7, dim: () => 0.25,
  fg: (f) => (
    <g>
      <Spotlight x={600} y={860} rx={520} ry={700} dark={0.45} />
      <Reflect floor={FEET} op={0.22}><LitCharacter id="h1m" x={380} y={FEET} scale={1.05} expression="dazed" haloColor="#BFE6E0" lookAt={{x: 0.5, y: 0.2}} /></Reflect>
      <Appear f={f} a={2} x={380} y={600} s={0.55}><U.BigQuestion p={ramp(f, 2, 10)} t={f} /></Appear>
      <g transform={`translate(680,860) scale(${0.95 * backOut(ramp(f, 0, 8))})`}><O.ExamPaper stamp={ramp(f, 5, 16)} /></g>
    </g>
  ),
};

/* 2. KAMAR MALAM — "akibat pornografi" (whip cepat ke HP) */
const k2 = [K(2, 0, 300, 880, 1.12, 'bedroom'), K(2, 12, 650, 860, 1.22, 'bedroom')];
export const shotH2: ShotDef = {
  id: 'h2', from: bf(2), to: bf(3), enter: 'cut', trLen: 0,
  cam: (f) => track(f, k2).cam,
  bg: (f) => <BedroomNight T={track(f, k2).tone} />,
  bgBlur: () => 7, dim: () => 0.3,
  fg: (f) => (
    <g>
      <Spotlight x={600} y={860} rx={520} ry={700} dark={0.5} />
      <Reflect floor={FEET} op={0.22}>
        <LitCharacter id="h2m" x={430} y={FEET} scale={1.1} pose="holding_phone" expression="hooked" haloColor="#FF8FC0" phoneColor="#FF5FA2" lookAt={{x: 0.3, y: 0.4}} />
      </Reflect>
      <g transform={`translate(780,840) scale(${backOut(ramp(f, bf(2, 2), bf(2, 11)))}) rotate(${-6 + Math.sin(f * 0.3) * 1.5})`}><S.Phone18 w={190} badge={ramp(f, bf(2, 8), bf(2, 12))} /></g>
    </g>
  ),
};

/* 3. PINTU KAMAR — "dan onani" (tanpa karakter, snap zoom ke gagang, kunci diputar) */
const k3 = [K(3, 0, 560, 900, 1.0, 'door'), K(3, 12, 560, 860, 1.42, 'door')];
export const shotH3: ShotDef = {
  id: 'h3', from: bf(3), to: bf(4), enter: 'cut', trLen: 0,
  cam: (f) => track(f, k3).cam,
  bg: (f) => <DoorHall T={track(f, k3).tone} lockGlow={ramp(f, bf(3, 8), bf(3, 14))} />,
  bgBlur: () => 6, dim: () => 0.3,
  fg: (f) => (
    <g>
      <Spotlight x={560} y={860} rx={480} ry={640} dark={0.5} />
      <g transform="translate(560,860)"><O.DoorKnobLock turn={ease(f, bf(3, 3), bf(3, 12))} t={f} /></g>
      <g transform={`translate(760,1040) scale(${0.75 * backOut(ramp(f, bf(3, 4), bf(3, 12)))})`}><A.TissueBox pull={0.6} /></g>
    </g>
  ),
};

/* 4. RUANG GELAP RANTAI — "atau adiksi PMO," (push cepat + shake kecil) */
const k4 = [K(4, 0, 540, 920, 1.0, 'chain'), K(4, 12, 560, 860, 1.22, 'chain')];
export const shotH4: ShotDef = {
  id: 'h4', from: bf(4), to: bf(5), enter: 'cut', trLen: 0,
  cam: (f) => { const c = track(f, k4).cam; const [sx, sy] = shake(f, bf(4, 12), 12, 10); return {...c, x: c.x + sx, y: c.y + sy}; },
  bg: (f) => <ChainRoom T={track(f, k4).tone} t={f} />,
  bgBlur: () => 7, dim: () => 0.3,
  fg: () => (
    <g>
      <Spotlight x={560} y={860} rx={500} ry={700} dark={0.5} />
      <Reflect floor={FEET} op={0.22}><LitCharacter id="h4m" x={540} y={FEET} scale={1.2} pose="chained_to_phone" expression="struggling" haloColor="#FF6A5A" phoneColor="#FF3B3B" /></Reflect>
    </g>
  ),
};

/* 5. ONE SHOT — "dan terjadi tiga fase perubahan yang terjadi pada otak." */
const OS0 = bf(5), OS1 = bf(6);
const DOORS: Array<[number, string, number]> = [[200, '#FFD23F', 14], [540, '#FF8A2B', 36], [880, '#FF3B3B', 58]];
const osK = (f: number) => {
  const k = ramp(f, OS0, OS1);
  const kk = k < 0.08 ? (k * k) / 0.16 : k - 0.04; // mulai halus lalu konstan
  return Math.min(1, kk / 0.96);
};
export const shotOneShot: ShotDef = {
  id: 'oneshot', from: OS0, to: OS1, enter: 'dark', trLen: 8,
  free: () => true,
  // zoom eksponensial konstan 1x -> 2,8x: dari wide, melewati karakter, berakhir masuk ke pintu 1
  cam: (f) => {
    const k = osK(f);
    return {x: 540 + (200 - 540) * ease(k, 0.15, 1), y: 880 + (915 - 880) * k, s: Math.pow(2.8, k)};
  },
  bg: (f) => <EmptyRoom T={mixTone(TONES.emptyNavy, TONES.emptyPurple, osK(f))} />,
  bgBlur: () => 4, dim: () => 0.25,
  fg: (f) => {
    const look = kp(f, [[OS0, 0], [bf(5, 16), -0.85], [bf(5, 40), 0.1], [bf(5, 60), 0.85], [bf(5, 80), -0.7]]);
    return (
      <g>
        <Spotlight x={540} y={900} rx={560} ry={760} dark={0.5} />
        <Reflect floor={HZ} op={0.4} depth={420}>
          {DOORS.map(([x, c, d], i) => (
            <g key={i} transform={`translate(${x},${HZ})`}>
              <O.GlowDoor n={i + 1} color={c} on={ease(f, bf(5, d), bf(5, d + 8))} open={i === 0 ? ease(f, OS1 - 22, OS1) : 0} />
            </g>
          ))}
        </Reflect>
        <Reflect floor={FEET} op={0.25}>
          <LitCharacter id="osm" x={390} y={FEET} scale={0.85} pose="standing_still_lookup" expression={[[-100, 'worried'], [bf(5, 60), 'worried']]}
            lookAt={{x: look, y: -0.5}} haloColor="#B88AFF" />
        </Reflect>
      </g>
    );
  },
};

export const HOOK_SHOTS = [shotH1, shotH2, shotH3, shotH4, shotOneShot];
export {be};
