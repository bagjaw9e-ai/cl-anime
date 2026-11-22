// SHOT 1: HOOK (beat 1-2) + ONE SHOT slow zoom-in (beat 3-5) — satu shot tanpa cut.
import React from 'react';
import {STAND_Y, WeddingHall, WeddingPhoto} from '../components/Places';
import {LitCharacter, LitFemale, Reflect} from '../components/Lit';
import {Spotlight} from '../components/Spot';
import * as A from '../illustrations/part1';
import {Phone18} from '../illustrations/shared';
import {Appear, be, bf, ease, kp, ramp, sm} from '../kit';
import {lerp} from '../theme';
import {ShotDef} from './types';

const GX = 440, BX = 660, SC = 1.1;
const HEAD = {x: GX, y: STAND_Y - 579};   // pusat kepala pria
const CRACK1 = {x: GX - 150 * 0.32, y: HEAD.y - 60 * 0.32 - 10};
const POCKET = {x: GX - 58, y: STAND_Y - 322};
const dimF = (f: number) => 0.08 + 0.55 * ease(f, bf(2, 16), bf(2, 46));

export const shotHook: ShotDef = {
  id: 'hook', from: 0, to: bf(6), enter: 'cut', trLen: 0, floorY: 1250, free: (f) => f >= bf(2),
  cam: (f) => {
    // beat 1: quick push-in dari wide (frame 0 langsung bergerak); beat 2: snap zoom ke HP lalu balik
    if (f < bf(3)) {
      const base = {x: kp(f, [[0, 560], [30, 545]]), y: kp(f, [[0, 900], [30, 880]]), s: kp(f, [[0, 0.94], [30, 1.0], [bf(3), 1.04]])};
      const snap = ease(f, bf(2, 3), bf(2, 10)) * (1 - ease(f, bf(2, 20), bf(2, 30)));
      return {x: lerp(base.x, POCKET.x, snap), y: lerp(base.y, POCKET.y, snap), s: lerp(base.s, 2.3, snap)};
    }
    // ONE SHOT: zoom konstan ease-in-out 1x -> 4,5x dari badan -> wajah -> kepala -> retakan 1, lalu tembus
    const e = ease(f, bf(3), be(5) - 6);
    const s = Math.exp(lerp(Math.log(1.04), Math.log(4.6), e)) * (1 + 3 * sm(ramp(f, be(5) - 10, be(5))));
    const tgt = e < 0.75 ? {x: GX, y: lerp(880, HEAD.y, e / 0.75)} : {x: lerp(GX, CRACK1.x, (e - 0.75) / 0.25), y: lerp(HEAD.y, CRACK1.y, (e - 0.75) / 0.25)};
    return {x: lerp(545, tgt.x, ease(f, bf(3), bf(3, 40))), y: tgt.y, s};
  },
  bg: (f) => <WeddingHall lights={1 - ease(f, bf(2, 16), bf(2, 46)) * 0.85} />,
  bgBlur: (f) => 1.5 + 2 * ease(f, bf(2, 16), bf(3, 20)),
  dim: dimF,
  fg: (f) => {
    const brideOp = 1 - 0.85 * ease(f, bf(3), bf(3, 40)); // wanita memudar ke gelap di belakang
    const xray = ease(f, bf(4), bf(4, 14));
    return (
      <g>
        <Spotlight x={540} y={900} rx={lerp(900, 430, ease(f, bf(2, 16), bf(2, 46)))} ry={700} dark={dimF(f)} />
        {/* foto pernikahan di easel samping pasangan, retak di "kecanduan" */}
        <g transform="translate(880,860) scale(0.72)" opacity={brideOp}><WeddingPhoto crack={ease(f, bf(2, 22), bf(2, 34))} /></g>
        <Reflect floor={STAND_Y} op={0.14}>
          <g opacity={brideOp}>
            <LitFemale id="h_b" x={BX} y={STAND_Y} scale={1.05} outfit="bride" haloColor="#FFC870" halo={brideOp}
              pose="standing_smile" expression={[[-100, 'happy'], [bf(2, 10), 'suspicious']]} lookAt={f > bf(2, 10) ? {x: -0.8, y: 0} : {x: 0, y: 0}} />
          </g>
          <LitCharacter id="h_g" x={GX} y={STAND_Y} scale={SC} outfit="groom" haloColor="#FFC870" phoneColor="#FF5FA2"
            pose={[[-100, 'groom_standing'], [bf(3), 'holding_phone_smug'], [bf(5), 'whistling_unaware']]}
            expression={[[-100, 'happy'], [bf(2, 12), 'smug'], [bf(4), 'neutral'], [bf(5), 'oblivious']]} />
        </Reflect>
        {/* beat 2: HP di saku jas nyala merah + 18+ */}
        {f < bf(3, 4) && <g transform={`translate(${POCKET.x},${POCKET.y}) scale(0.9)`}><g opacity={ease(f, bf(2, 0), bf(2, 4))}><A.PocketPhone on={ease(f, bf(2, 2), bf(2, 10))} /></g></g>}
        {/* beat 3: HP 18+ di tangan, kotak tisu, piala ironis */}
        <Appear f={f} a={bf(3, 2)} b={be(5)} x={GX + 72} y={STAND_Y - 470} s={0.34}><Phone18 w={110} glow={1} /></Appear>
        <Appear f={f} a={bf(3, 8)} b={be(4)} x={GX - 200} y={STAND_Y - 300}><A.TissueBox pull={ramp(f, bf(3, 14), bf(3, 34))} s={0.8} /></Appear>
        <Appear f={f} a={bf(3, 24)} b={be(4)} x={GX + 210} y={STAND_Y - 380}><A.IronicTrophy s={0.75} /></Appear>
        {/* beat 4-5: kepala jadi X-ray, 3 retakan bernomor nyala satu-satu, lalu melebar + tanda tanya */}
        {xray > 0 && (
          <g opacity={xray}>
            <ellipse cx={HEAD.x} cy={HEAD.y + 4} rx={96} ry={110} fill="#061A24" opacity={0.78} />
            <g transform={`translate(${HEAD.x},${HEAD.y - 10})`}>
              <A.XrayBrain s={0.32} cracks={[ramp(f, bf(4, 14), bf(4, 26)), ramp(f, bf(4, 28), bf(4, 40)), ramp(f, bf(4, 42), bf(4, 54))]} widen={ease(f, bf(5), be(5))} />
              <g transform="scale(0.5)"><A.QuestionMarks on={ease(f, bf(5, 6), bf(5, 18))} t={f} /></g>
            </g>
          </g>
        )}
      </g>
    );
  },
  overlay: (f) => (
    <g>
      <A.CameraFlash k={f - 4} />
      <A.CameraFlash k={f - 22} />
      {/* tembus ke retakan nomor 1: cahaya kuning memenuhi layar */}
      <rect width={1080} height={1920} fill="#FFD23F" opacity={0.9 * sm(ramp(f, be(5) - 8, be(5)))} />
    </g>
  ),
};
