// SHOT 1: HOOK (beat 1-2, cepat & kuat) + ONE SHOT slow zoom-in dengan background berubah pelan (beat 3-5) — satu shot.
import React from 'react';
import {STAND_Y} from '../components/Places';
import {BirthdayRoom} from '../components/Places2';
import {LitCharacter, Reflect} from '../components/Lit';
import {Silhouette} from '../components/Silhouette';
import {Spotlight} from '../components/Spot';
import * as A from '../illustrations/part1';
import * as U from '../illustrations/u25';
import {be, bf, ease, kp, ramp, sm} from '../kit';
import {lerp} from '../theme';
import {ShotDef} from './types';
import {setKeyPos} from '../components/UI';
setKeyPos({1: [600, 400], 2: [560, 400], 3: [540, 400]});

const MX = 400, SC = 1.1;
const HEAD = {x: MX, y: STAND_Y - 579};
const CRACK1 = {x: MX - 150 * 0.26, y: HEAD.y - 60 * 0.26 - 72};
const CAKE = {x: 740, y: STAND_Y - 250};                 // dasar kue di atas meja
const CANDLE = {x: CAKE.x, y: CAKE.y - 330};
const lightsAt = (f: number) => 1 - 0.85 * ease(f, bf(2, 6), bf(2, 10));

export const shotHook: ShotDef = {
  id: 'hook', from: 0, to: bf(6), enter: 'cut', trLen: 0, floorY: STAND_Y, free: () => true,
  cam: (f) => {
    if (f < bf(2)) {               // beat 1: frame 0 bergerak, snap zoom-in ke lilin (6 frame) + overshoot
      const z = sm(ramp(f, 4, 11));
      const ov = Math.sin(ramp(f, 11, 19) * Math.PI) * 0.06;
      return {x: lerp(560, CANDLE.x, z), y: lerp(860, CANDLE.y + 80, z), s: lerp(1.02, 1.9, z) + ov};
    }
    if (f < bf(3)) {               // beat 2: lilin ditiup -> gelap, whip cepat ke pria (6 frame)
      const w = sm(ramp(f, bf(2, 8), bf(2, 14)));
      return {x: lerp(CANDLE.x, MX + 60, w), y: lerp(CANDLE.y + 80, 880, w), s: lerp(1.9, 1.1, w)};
    }
    // ONE SHOT: zoom konstan ease-in-out 1,2x -> 3,5x ke kepala -> masuk otak -> tembus retakan 1
    // zoom pelan & konstan: 1,1x (beat 3) -> 1,35x (beat 4, bayangan di dinding masih terlihat) -> 3,6x (beat 5) -> tembus retakan
    const e = ease(f, bf(3), be(5) - 4);
    const s = Math.exp(lerp(Math.log(1.1), Math.log(3.6), e * e)) * (1 + 3 * sm(ramp(f, be(5) - 8, be(5))));
    const wallX = 560;
    const tx = e < 0.6 ? lerp(MX + 60, wallX, Math.sin((e / 0.6) * Math.PI) * 0.6) + (e / 0.6) * 0 : e < 0.85 ? lerp(MX + 60, HEAD.x, (e - 0.6) / 0.25) : lerp(HEAD.x, CRACK1.x, (e - 0.85) / 0.15);
    const ty = e < 0.6 ? lerp(880, 800, e / 0.6) : e < 0.85 ? lerp(800, HEAD.y, (e - 0.6) / 0.25) : lerp(HEAD.y, CRACK1.y, (e - 0.85) / 0.15);
    return {x: tx, y: ty, s};
  },
  bg: (f) => (
    <BirthdayRoom lights={lightsAt(f)} decay={ease(f, bf(3, 10), bf(5, 10))} maroon={ease(f, bf(3, 20), bf(5, 20))} shadowWall={ease(f, bf(4) - 10, bf(4, 20))} />
  ),
  bgBlur: (f) => 1.5 + 1.5 * ease(f, bf(3), bf(4)),
  dim: (f) => 0.1 + 0.4 * (1 - lightsAt(f)) * 0.8,
  fg: (f) => {
    const xray = ease(f, bf(3, 18), bf(3, 32));
    return (
      <g>
        <Spotlight x={kp(f, [[0, 600], [bf(2, 10), MX + 40]])} y={860} rx={lerp(900, 460, 1 - lightsAt(f))} ry={720} dark={0.25 + 0.45 * (1 - lightsAt(f))} />
        {/* beat 4-5: 3 bayangan "versi lain" di dinding belakang (layar bayangan) */}
        <g transform={`translate(720,${STAND_Y - 330})`}>
          <U.ShadowSelves show={[ramp(f, bf(4, 2), bf(4, 12)), ramp(f, bf(4, 14), bf(4, 24)), ramp(f, bf(4, 26), bf(4, 36))]} dark={ease(f, bf(5), be(5))} t={f} />
        </g>
        {/* teman-teman tepuk tangan (hook), lalu memudar */}
        <g opacity={lightsAt(f)}>
          <Silhouette x={120} y={STAND_Y} scale={0.85} type="friend" pose="clap" rim="#FFC870" seed={2} />
          <Silhouette x={980} y={STAND_Y} scale={0.8} type="woman" pose="clap" rim="#FFC870" seed={5} />
        </g>
        <Reflect floor={STAND_Y} op={0.14}>
          <LitCharacter id="h_m" x={MX} y={STAND_Y} scale={SC} haloColor={f < bf(2, 8) ? '#FFC870' : '#FF6A6A'}
            pose={[[-100, 'blowing_candle'], [bf(2, 10), 'holding_phone_hidden'], [bf(3, 4), 'standing_relaxed']]}
            expression={[[-100, 'excited'], [bf(2, 10), 'guilty'], [bf(3, 4), 'neutral'], [bf(3, 50), 'worried'], [bf(4), 'dazed'], [bf(5), 'oblivious']]} />
        </Reflect>
        {/* kue + meja */}
        <g opacity={1 - 0.75 * ease(f, bf(3), bf(3, 30))}>
          <rect x={CAKE.x - 210} y={CAKE.y} width={420} height={STAND_Y - CAKE.y} rx={10} fill="#5A4636" />
          <g transform={`translate(${CAKE.x},${CAKE.y})`}><U.BirthdayCake t={f} lit={1} blown={ease(f, bf(2, 4), bf(2, 30))} /></g>
        </g>
        <g transform={`translate(${CANDLE.x},${CANDLE.y})`}><U.Confetti k={f - 6} spread={600} /></g>
        {/* beat 3-5: kepala jadi X-ray, 3 retakan bernomor nyala satu-satu, lalu melebar */}
        {xray > 0 && (
          <g opacity={xray}>
            <path d={`M ${HEAD.x - 84} ${HEAD.y - 30} C ${HEAD.x - 84} ${HEAD.y - 110} ${HEAD.x - 44} ${HEAD.y - 130} ${HEAD.x} ${HEAD.y - 130} C ${HEAD.x + 44} ${HEAD.y - 130} ${HEAD.x + 84} ${HEAD.y - 110} ${HEAD.x + 84} ${HEAD.y - 30} Q ${HEAD.x} ${HEAD.y - 14} ${HEAD.x - 84} ${HEAD.y - 30} Z`} fill="#1A0408" opacity={0.82} />
            <g transform={`translate(${HEAD.x},${HEAD.y - 72})`}>
              <A.XrayBrain s={0.26} cracks={[ramp(f, bf(3, 34), bf(3, 46)), ramp(f, bf(3, 48), bf(3, 60)), ramp(f, bf(3, 62), bf(3, 74))]} widen={ease(f, bf(5), be(5))} />
            </g>
          </g>
        )}
      </g>
    );
  },
  overlay: (f) => (
    <g>
      {/* kilat saat lilin ditiup -> gelap */}
      <rect width={1080} height={1920} fill="#FFF4E0" opacity={0.85 * Math.max(0, 1 - Math.abs(f - bf(2, 7)) / 4)} />
      {/* tembus retakan 1: cahaya merah memenuhi layar */}
      <rect width={1080} height={1920} fill="#FF3B3B" opacity={0.85 * sm(ramp(f, be(5) - 8, be(5)))} />
    </g>
  ),
};
