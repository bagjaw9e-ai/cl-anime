import React, {useContext, useMemo} from 'react';
import {interpolate as fInterp} from 'flubber';
import {spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useAudioData, visualizeAudio} from '@remotion/media-utils';
import {C, clamp, lerp, rand} from '../theme';
import {OffsetContext} from '../SceneContext';
import {PhoneBody} from './Phone';

/* ---------------------------------------------------------------------------
 * Karakter: pria muda Asia Tenggara, gaya karikatur flat vector.
 * Rig: head (pivot leher) -> hair, brows L/R, eyes L/R (white, iris, eyelid),
 * nose, mouth; torso -> arms L/R (upper, lower, hand), legs L/R.
 * Koordinat lokal: (0,0) = tanah di antara kedua kaki, atas = -y.
 * Konvensi sudut lengan/kaki: 0 = lurus ke bawah, positif = menjauh dari badan.
 * "R" = tangan kanan karakter (sisi kiri layar), "L" = kiri karakter (kanan layar).
 * ------------------------------------------------------------------------- */

export type Expression =
  | 'neutral' | 'happy' | 'smirk' | 'sad' | 'guilty' | 'shocked' | 'worried'
  | 'angry' | 'thinking' | 'determined' | 'dazed' | 'crying';

export type PoseName =
  | 'standing_relaxed' | 'arms_crossed' | 'holding_phone' | 'head_in_hands'
  | 'sitting_desk' | 'pointing_up' | 'shaking_head' | 'walking'
  | 'running' | 'hand_chin' | 'stop_hand' | 'reaching' | 'arms_up' | 'lying';

type Limb = {a: number; b: number}; // a = sendi pangkal, b = sendi tengah (relatif)
type Pose = {
  pelvisY: number; lean: number; torsoSY: number; headTilt: number; headDY: number;
  pitch: number; turn: number; armR: Limb; armL: Limb; legR: Limb; legL: Limb;
  thighS: number; shinS: number; faceGlow: number; walk: number; run: number;
  shake: number; handFront: number; pointL: number; holdPhoneL: number;
};

const P0: Pose = {
  pelvisY: 228, lean: 0, torsoSY: 1, headTilt: 0, headDY: 0, pitch: 0, turn: 0,
  armR: {a: 9, b: -6}, armL: {a: 9, b: -6}, legR: {a: 4, b: -3}, legL: {a: 4, b: -3},
  thighS: 1, shinS: 1, faceGlow: 0, walk: 0, run: 0, shake: 0, handFront: 1,
  pointL: 0, holdPhoneL: 0,
};

const mk = (o: Partial<Pose>): Pose => ({...P0, ...o});

export const POSES: Record<PoseName, Pose> = {
  standing_relaxed: P0,
  arms_crossed: mk({armR: {a: 14, b: -118}, armL: {a: 14, b: -112}, headTilt: -3}),
  holding_phone: mk({
    armL: {a: 22, b: -128}, armR: {a: 8, b: -4}, headTilt: 6, headDY: 6, pitch: 0.35,
    faceGlow: 1, holdPhoneL: 1, lean: 2,
  }),
  head_in_hands: mk({
    pelvisY: 104, torsoSY: 0.84, lean: 0, headDY: 30, pitch: 0.9, headTilt: 0,
    armR: {a: 114, b: 114}, armL: {a: 114, b: 114},
    legR: {a: 102, b: -122}, legL: {a: 102, b: -122}, thighS: 0.5, shinS: 1.03,
  }),
  sitting_desk: mk({
    pelvisY: 150, legR: {a: 32, b: -40}, legL: {a: 32, b: -40}, thighS: 0.45, shinS: 1.0,
    armR: {a: 26, b: -70}, armL: {a: 26, b: -70}, pitch: 0.2, headDY: 4,
  }),
  pointing_up: mk({armL: {a: 158, b: 8}, armR: {a: 12, b: -10}, pointL: 1, headTilt: -4}),
  shaking_head: mk({shake: 1, armR: {a: 6, b: -4}, armL: {a: 6, b: -4}, pitch: 0.1}),
  walking: mk({walk: 1}),
  running: mk({run: 1, lean: 4}),
  hand_chin: mk({armL: {a: 30, b: -148}, armR: {a: 10, b: -100}, headTilt: -6}),
  stop_hand: mk({armL: {a: 62, b: 62}, armR: {a: 10, b: -6}, lean: -4, headTilt: -6}),
  reaching: mk({armL: {a: 70, b: -10}, lean: 5, headTilt: 4}),
  arms_up: mk({armR: {a: 150, b: 18}, armL: {a: 150, b: 18}, headTilt: 0}),
  lying: mk({armR: {a: 6, b: 0}, armL: {a: 6, b: 0}, legR: {a: 2, b: 0}, legL: {a: 2, b: 0}}),
};

/* ---------------- ekspresi ---------------- */
type Brow = {y: number; rot: number};
type Eye = {lid: number; lidB: number; iris: number; dx: number; dy: number; div: number};
type ExprDef = {
  mouth: string; browR: Brow; browL: Brow; eye: Eye;
  tears: number; sweat: number; blush: number; angry: number; dazed: number; teeth: number;
};

const M = {
  neutral: 'M -17 0 Q 0 5 17 0 Q 0 9 -17 0 Z',
  happy: 'M -27 -4 Q 0 2 27 -4 Q 22 24 0 26 Q -22 24 -27 -4 Z',
  smirk: 'M -18 3 Q 4 5 23 -9 Q 8 12 -18 6 Z',
  sad: 'M -19 10 Q 0 -7 19 10 Q 0 0 -19 10 Z',
  guilty: 'M -17 5 Q -8 0 0 5 Q 8 9 17 3 Q 8 12 0 9 Q -8 4 -17 8 Z',
  shocked: 'M -13 2 C -13 -18 13 -18 13 2 C 13 26 -13 26 -13 2 Z',
  worried: 'M -21 6 Q -10 -3 0 4 Q 10 11 21 2 Q 10 14 0 9 Q -10 2 -21 10 Z',
  angry: 'M -24 -2 Q 0 -9 24 -2 L 21 13 Q 0 8 -21 13 Z',
  thinking: 'M -6 5 Q 8 1 19 -3 Q 12 7 -6 8 Z',
  determined: 'M -21 1 Q 0 -1 21 -3 Q 1 8 -21 1 Z',
  dazed: 'M -14 0 Q 0 -3 14 2 Q 7 17 -3 15 Q -14 11 -14 0 Z',
  crying: 'M -26 14 Q 0 -16 26 14 Q 0 6 -26 14 Z',
};

const E = (o: Partial<Eye>): Eye => ({lid: 0.12, lidB: 0, iris: 1, dx: 0, dy: 0, div: 0, ...o});
const D = (o: Partial<ExprDef> & {mouth: string}): ExprDef => ({
  browR: {y: 0, rot: 0}, browL: {y: 0, rot: 0}, eye: E({}),
  tears: 0, sweat: 0, blush: 0, angry: 0, dazed: 0, teeth: 0, ...o,
});

export const EXPR: Record<Expression, ExprDef> = {
  neutral: D({mouth: M.neutral}),
  happy: D({mouth: M.happy, browR: {y: -7, rot: -4}, browL: {y: -7, rot: 4}, eye: E({lid: 0.05, lidB: 0.35}), blush: 0.7, teeth: 1}),
  smirk: D({mouth: M.smirk, browR: {y: 0, rot: 6}, browL: {y: -9, rot: 6}, eye: E({lid: 0.35, dx: 0.3})}),
  sad: D({mouth: M.sad, browR: {y: -3, rot: -16}, browL: {y: -3, rot: 16}, eye: E({lid: 0.38, dy: 0.4})}),
  guilty: D({mouth: M.guilty, browR: {y: -2, rot: -14}, browL: {y: -2, rot: 14}, eye: E({lid: 0.32, dx: -0.6, dy: 0.5}), blush: 0.5, sweat: 0.6}),
  shocked: D({mouth: M.shocked, browR: {y: -16, rot: -4}, browL: {y: -16, rot: 4}, eye: E({lid: 0, iris: 0.62})}),
  worried: D({mouth: M.worried, browR: {y: -8, rot: -18}, browL: {y: -8, rot: 18}, eye: E({lid: 0.12, iris: 0.85}), sweat: 1}),
  angry: D({mouth: M.angry, browR: {y: 6, rot: 22}, browL: {y: 6, rot: -22}, eye: E({lid: 0.36, iris: 0.8}), angry: 1, teeth: 1}),
  thinking: D({mouth: M.thinking, browR: {y: 2, rot: 4}, browL: {y: -12, rot: 8}, eye: E({lid: 0.2, dx: 0.55, dy: -0.6})}),
  determined: D({mouth: M.determined, browR: {y: 4, rot: 12}, browL: {y: 4, rot: -12}, eye: E({lid: 0.28})}),
  dazed: D({mouth: M.dazed, browR: {y: -10, rot: -6}, browL: {y: -6, rot: 2}, eye: E({lid: 0.3, iris: 0.42, div: 1, dy: 0.3}), dazed: 1}),
  crying: D({mouth: M.crying, browR: {y: -6, rot: -22}, browL: {y: -6, rot: 22}, eye: E({lid: 0.55, lidB: 0.25, dy: 0.3}), tears: 1}),
};

const interpCache = new Map<string, (t: number) => string>();
const morph = (a: string, b: string, t: number) => {
  if (a === b || t >= 1) return b;
  if (t <= 0) return a;
  const k = a + '|' + b;
  let f = interpCache.get(k);
  if (!f) {
    f = fInterp(a, b, {maxSegmentLength: 3});
    interpCache.set(k, f);
  }
  return f(t);
};

/* -------- keyframe helpers: prop bisa string atau [[frame, value], ...] -------- */
export type KF<T> = T | Array<[number, T]>;
const toList = <T,>(v: KF<T>): Array<[number, T]> =>
  Array.isArray(v) ? (v as Array<[number, T]>) : [[-1000, v as T]];
const activeKF = <T,>(v: KF<T>, f: number) => {
  const l = toList(v);
  let i = 0;
  for (let k = 0; k < l.length; k++) if (f >= l[k][0]) i = k;
  return {cur: l[i][1], prev: l[Math.max(0, i - 1)][1], at: l[i][0], first: i === 0};
};

const lerpLimb = (a: Limb, b: Limb, t: number): Limb => ({a: lerp(a.a, b.a, t), b: lerp(a.b, b.b, t)});
const lerpPose = (a: Pose, b: Pose, t: number): Pose => {
  const o = {} as Record<string, unknown>;
  for (const k of Object.keys(a) as (keyof Pose)[]) {
    const va = a[k];
    const vb = b[k];
    o[k] = typeof va === 'number' ? lerp(va, vb as number, t) : lerpLimb(va as Limb, vb as Limb, t);
  }
  return o as Pose;
};
const lerpExpr = (a: ExprDef, b: ExprDef, t: number): ExprDef => ({
  mouth: morph(a.mouth, b.mouth, t),
  browR: {y: lerp(a.browR.y, b.browR.y, t), rot: lerp(a.browR.rot, b.browR.rot, t)},
  browL: {y: lerp(a.browL.y, b.browL.y, t), rot: lerp(a.browL.rot, b.browL.rot, t)},
  eye: {
    lid: lerp(a.eye.lid, b.eye.lid, t), lidB: lerp(a.eye.lidB, b.eye.lidB, t),
    iris: lerp(a.eye.iris, b.eye.iris, t), dx: lerp(a.eye.dx, b.eye.dx, t),
    dy: lerp(a.eye.dy, b.eye.dy, t), div: lerp(a.eye.div, b.eye.div, t),
  },
  tears: lerp(a.tears, b.tears, t), sweat: lerp(a.sweat, b.sweat, t), blush: lerp(a.blush, b.blush, t),
  angry: lerp(a.angry, b.angry, t), dazed: lerp(a.dazed, b.dazed, t), teeth: lerp(a.teeth, b.teeth, t),
});

const rad = (d: number) => (d * Math.PI) / 180;
// arah dari sudut: 0 = ke bawah, +90 = ke kanan layar
const dir = (deg: number) => [Math.sin(rad(deg)), Math.cos(rad(deg))];

/* ---------------- lip-sync ---------------- */
const TALK = [
  'M -12 0 C -12 -5 12 -5 12 0 C 12 6 -12 6 -12 0 Z',
  'M -15 -1 C -15 -9 15 -9 15 -1 C 15 12 -15 12 -15 -1 Z',
  'M -17 -2 C -17 -13 17 -13 17 -2 C 17 20 -17 20 -17 -2 Z',
];

const useMouthOpen = (talking: boolean) => {
  const frame = useCurrentFrame();
  const off = useContext(OffsetContext);
  const {fps} = useVideoConfig();
  const audio = useAudioData(staticFile('voiceover.m4a'));
  if (!talking || !audio) return 0;
  const abs = frame + off;
  const v = visualizeAudio({fps, frame: abs, audioData: audio, numberOfSamples: 32});
  const amp = (v[1] + v[2] + v[3] + v[4] + v[5] + v[6]) / 6;
  return amp; // 0..~1
};

/* ---------------- komponen ---------------- */
export type CharacterProps = {
  x?: number; y?: number; scale?: number;
  expression?: KF<Expression>;
  pose?: KF<PoseName>;
  lookAt?: {x: number; y: number};
  talking?: boolean;
  rim?: boolean;
  rimColor?: string;
  blinkSeed?: number;
  walkSpeed?: number;
  phoneColor?: string;
  hideHead?: boolean;
  id?: string;
};

export const Character: React.FC<CharacterProps> = ({
  x = 540, y = 1500, scale = 1, expression = 'neutral', pose = 'standing_relaxed',
  lookAt = {x: 0, y: 0}, talking = false, rim = false, rimColor = C.red2, blinkSeed = 1,
  walkSpeed = 1, phoneColor = C.red2, id = 'c',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const amp = useMouthOpen(talking);

  // ----- pose tween (spring) -----
  const pk = activeKF(pose, frame);
  const pt = pk.first ? 1 : spring({frame: frame - pk.at, fps, config: {damping: 15, stiffness: 150, mass: 0.7}});
  const P = lerpPose(POSES[pk.prev], POSES[pk.cur], pt);

  // ----- expression morph 7 frame -----
  const ek = activeKF(expression, frame);
  const et0 = ek.first ? 1 : clamp((frame - ek.at) / 7);
  const et = et0 * et0 * (3 - 2 * et0);
  const X = lerpExpr(EXPR[ek.prev], EXPR[ek.cur], et);

  // ----- idle -----
  const t = frame / fps;
  const breathe = Math.sin(t * 2 * Math.PI * 0.28);
  const bob = Math.sin(t * 2 * Math.PI * 0.5 + 1) * 2;

  // walking / running cycle
  const cyc = t * 2 * Math.PI * (1.6 + P.run * 1.6) * walkSpeed;
  const sw = Math.sin(cyc);
  const wAmp = P.walk * 26 + P.run * 48;
  const legR = {a: P.legR.a + sw * wAmp, b: P.legR.b - Math.max(0, -sw) * (P.walk * 30 + P.run * 70)};
  const legL = {a: P.legL.a - sw * wAmp, b: P.legL.b - Math.max(0, sw) * (P.walk * 30 + P.run * 70)};
  const armSw = P.walk * 22 + P.run * 40;
  const armR = {a: P.armR.a - sw * armSw, b: P.armR.b - P.run * 70};
  const armL = {a: P.armL.a + sw * armSw, b: P.armL.b - P.run * 70};
  const stepBob = -(Math.abs(Math.cos(cyc)) * (P.walk * 6 + P.run * 14));

  // head shake
  const shakeTurn = P.shake * Math.sin(t * 2 * Math.PI * 2.4) * 0.9;
  const turn = clamp(P.turn + shakeTurn + lookAt.x * 0.15, -1, 1);

  // blink
  let blink = 0;
  {
    const period = 2 + rand(blinkSeed) * 2; // 2-4 s
    const k = Math.floor(t / period);
    const tb = t - k * period - rand(blinkSeed + k * 7.1) * 0.6;
    if (tb >= 0 && tb < 0.17) blink = Math.sin((tb / 0.17) * Math.PI);
  }

  // ----- geometry -----
  const pelvis = {x: 0, y: -P.pelvisY + stepBob};
  const thighL = 108 * P.thighS;
  const shinL = 100 * P.shinS;
  const legPts = (side: -1 | 1, l: Limb) => {
    const hip = {x: pelvis.x + side * 30, y: pelvis.y + 6};
    const a1 = side * l.a;
    const d1 = dir(a1);
    const knee = {x: hip.x + d1[0] * thighL, y: hip.y + d1[1] * thighL};
    const a2 = a1 + side * l.b;
    const d2 = dir(a2);
    const foot = {x: knee.x + d2[0] * shinL, y: knee.y + d2[1] * shinL};
    return {hip, knee, foot, a2};
  };
  const LR = legPts(-1, legR);
  const LL = legPts(1, legL);

  const torsoH = 178 * P.torsoSY * (1 + breathe * 0.008);
  const neck = {x: 0, y: -torsoH};
  const armPts = (side: -1 | 1, l: Limb) => {
    const sh = {x: side * 66, y: -torsoH + 22};
    const a1 = side * l.a;
    const d1 = dir(a1);
    const el = {x: sh.x + d1[0] * 84, y: sh.y + d1[1] * 84};
    const a2 = a1 + side * l.b;
    const d2 = dir(a2);
    const hand = {x: el.x + d2[0] * 78, y: el.y + d2[1] * 78};
    return {sh, el, hand, a2};
  };
  const AR = armPts(-1, armR);
  const AL = armPts(1, armL);

  const fid = `${id}`;
  const shoe = (f: {x: number; y: number}, a2: number, side: number) => (
    <g transform={`translate(${f.x},${f.y}) rotate(${-a2 * 0.25 + side * 6})`}>
      <rect x={-30 + side * 6} y={-8} width={60} height={30} rx={14} fill={C.navyDark} />
      <rect x={-31 + side * 6} y={12} width={62} height={11} rx={5} fill={C.cream} />
      <rect x={-20 + side * 6} y={-4} width={26} height={6} rx={3} fill={C.navyLight} opacity={0.7} />
    </g>
  );

  const limbPath = (a: {x: number; y: number}, b: {x: number; y: number}, c: {x: number; y: number}) =>
    `M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y}`;

  const hand = (pts: {el: {x: number; y: number}; hand: {x: number; y: number}; a2: number}, side: -1 | 1, point = 0, bracelet = false) => {
    const d = dir(pts.a2);
    const cuff = {x: pts.hand.x - d[0] * 20, y: pts.hand.y - d[1] * 20};
    return (
      <g>
        <line x1={cuff.x - d[0] * 6} y1={cuff.y - d[1] * 6} x2={cuff.x + d[0] * 4} y2={cuff.y + d[1] * 4}
          stroke={C.navyLight} strokeWidth={36} strokeLinecap="round" />
        {bracelet && [0, 1, 2, 3, 4, 5, 6].map((i) => {
          const px = -d[1];
          const py = d[0];
          const s = (i - 3) * 5.2;
          return (
            <circle key={i} cx={cuff.x + d[0] * 12 + px * s} cy={cuff.y + d[1] * 12 + py * s} r={4.4}
              fill={i % 2 ? C.wood : C.woodLight} />
          );
        })}
        <g transform={`translate(${pts.hand.x},${pts.hand.y}) rotate(${-pts.a2})`}>
          <ellipse cx={0} cy={2} rx={17} ry={19} fill={C.skin} />
          <ellipse cx={-side * 14} cy={-4} rx={7} ry={10} fill={C.skin} transform={`rotate(${side * 30})`} />
          {point > 0.5 ? (
            <rect x={-5} y={10} width={11} height={34} rx={5.5} fill={C.skin} />
          ) : (
            <path d="M -12 12 Q 0 22 12 12" stroke={C.skinShade} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          )}
        </g>
      </g>
    );
  };

  const arm = (pts: ReturnType<typeof armPts>, side: -1 | 1, point = 0, bracelet = false) => (
    <g>
      <path d={limbPath(pts.sh, pts.el, pts.hand)} stroke={C.navy} strokeWidth={40} strokeLinecap="round"
        strokeLinejoin="round" fill="none" />
      <path d={limbPath(pts.sh, pts.el, pts.hand)} stroke={C.navyLight} strokeWidth={8} strokeLinecap="round"
        strokeLinejoin="round" fill="none" opacity={0.35} transform={`translate(${side * -9},-4)`} />
      {hand(pts, side, point, bracelet)}
    </g>
  );

  // ---------- kepala ----------
  const tx = turn * 14; // geser fitur wajah (3/4 view)
  const pitchDY = P.pitch * 26;
  const eyeW = 22;
  const eye = (cx: number, side: -1 | 1) => {
    const lid = clamp(Math.max(X.eye.lid, blink));
    const lidB = X.eye.lidB;
    const div = X.eye.div * side * 0.6;
    const ix = (X.eye.dx + lookAt.x * 0.8 + div) * 7;
    const iy = (X.eye.dy + lookAt.y * 0.8) * 4;
    const almond = `M ${-eyeW} 0 Q 0 -17 ${eyeW} 0 Q 0 13 ${-eyeW} 0 Z`;
    const top = -13;
    const lidY = lerp(top, 8, lid);
    const botY = lerp(10, -2, lidB);
    const cid = `${fid}-eye${side}`;
    return (
      <g transform={`translate(${cx + tx},${pitchDY})`}>
        <clipPath id={cid}><path d={almond} /></clipPath>
        <path d={almond} fill={C.white} />
        <g clipPath={`url(#${cid})`}>
          <circle cx={ix} cy={iy + 1} r={11 * X.eye.iris} fill="#4A2B1C" />
          <circle cx={ix} cy={iy + 1} r={6 * X.eye.iris} fill="#120A0A" />
          <circle cx={ix + 4} cy={iy - 3} r={3 * X.eye.iris} fill={C.white} opacity={0.9} />
          <rect x={-30} y={-30} width={60} height={lidY + 30} fill={C.skin} />
          <rect x={-30} y={botY} width={60} height={30} fill={C.skin} />
        </g>
        <path d={`M ${-eyeW - 2} ${Math.min(lidY, 0) + 1} Q 0 ${lidY - 4 - (1 - lid) * 2} ${eyeW + 2} ${Math.min(lidY, 0) + 1}`}
          stroke={C.ink} strokeWidth={4.5} fill="none" strokeLinecap="round" />
      </g>
    );
  };
  const brow = (cx: number, side: -1 | 1, b: Brow) => (
    <rect x={-22} y={-6} width={44} height={12} rx={6} fill={C.hair}
      transform={`translate(${cx + tx * 1.1},${-34 + b.y + pitchDY}) rotate(${b.rot})`} />
  );

  const mouthShape = (() => {
    if (!talking || amp < 0.06) return X.mouth;
    if (amp < 0.14) return TALK[0];
    if (amp < 0.26) return TALK[1];
    return TALK[2];
  })();

  const headY = -torsoH - 22 - 96 + P.headDY + bob * 0.5;
  const faceGlowOp = P.faceGlow * (0.55 + 0.1 * Math.sin(t * 9) + 0.05 * Math.sin(t * 23));

  const head = (
    <g transform={`translate(0,${-torsoH}) rotate(${P.headTilt + Math.sin(t * 1.7) * 0.8}) translate(0,${headY + torsoH})`}>
      {/* telinga */}
      <ellipse cx={-80 + tx * 0.3} cy={8 + pitchDY * 0.5} rx={14} ry={22} fill={C.skinShade} />
      <ellipse cx={80 + tx * 0.3} cy={8 + pitchDY * 0.5} rx={14} ry={22} fill={C.skinShade} />
      {/* wajah oval tirus */}
      <path d="M 0 -96 C 54 -96 82 -60 82 -8 C 82 44 50 88 0 98 C -50 88 -82 44 -82 -8 C -82 -60 -54 -96 0 -96 Z"
        fill={`url(#${fid}-skin)`} />
      {/* blush */}
      <ellipse cx={-48 + tx} cy={34 + pitchDY} rx={16} ry={8} fill={C.red2} opacity={X.blush * 0.32} />
      <ellipse cx={48 + tx} cy={34 + pitchDY} rx={16} ry={8} fill={C.red2} opacity={X.blush * 0.32} />
      {/* marah: rona merah */}
      <path d="M 0 -96 C 54 -96 82 -60 82 -8 C 82 44 50 88 0 98 C -50 88 -82 44 -82 -8 C -82 -60 -54 -96 0 -96 Z"
        fill={C.red1} opacity={X.angry * 0.18} />
      {eye(-34, -1)}
      {eye(34, 1)}
      {brow(-35, -1, X.browR)}
      {brow(35, 1, X.browL)}
      {/* hidung */}
      <path d={`M ${4 + tx * 1.2} ${6 + pitchDY} Q ${12 + tx * 1.2} ${26 + pitchDY} ${0 + tx * 1.2} ${31 + pitchDY} Q ${-6 + tx * 1.2} ${32 + pitchDY} ${-9 + tx * 1.2} ${29 + pitchDY}`}
        stroke={C.skinShade} strokeWidth={4.5} fill="none" strokeLinecap="round" />
      {/* mulut */}
      <g transform={`translate(${tx * 1.1},${56 + pitchDY * 0.9})`}>
        <path d={mouthShape} fill="#5A1726" />
        {X.teeth > 0.3 && mouthShape === X.mouth && (
          <clipPath id={`${fid}-m`}><path d={mouthShape} /></clipPath>
        )}
        {X.teeth > 0.3 && mouthShape === X.mouth && (
          <rect x={-30} y={-14} width={60} height={11} fill={C.white} opacity={X.teeth} clipPath={`url(#${fid}-m)`} />
        )}
      </g>
      {/* keringat */}
      <path d={`M ${70} ${-40} q 8 14 0 20 q -8 -6 0 -20 Z`} fill={C.mint} opacity={X.sweat * 0.95} />
      {/* air mata */}
      {X.tears > 0.05 && [-1, 1].map((s) => {
        const ph = ((t * 1.4 + (s > 0 ? 0.5 : 0)) % 1);
        return (
          <g key={s} opacity={X.tears}>
            <path d={`M ${s * 34 + tx - 8} ${12 + pitchDY} Q ${s * 40 + tx} ${40 + pitchDY} ${s * 36 + tx} ${70 + pitchDY}`}
              stroke={C.mint} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.85} />
            <circle cx={s * 37 + tx} cy={20 + pitchDY + ph * 70} r={6} fill={C.mint} opacity={1 - ph} />
          </g>
        );
      })}
      {/* rambut hitam belah samping bervolume */}
      <path d={`M -86 -6 C -98 -78 -58 -132 6 -130 C 70 -130 104 -88 90 -14
          C 86 -36 80 -52 70 -60 C 64 -46 58 -44 52 -50 C 30 -34 -4 -44 -24 -70
          C -34 -52 -54 -42 -70 -40 C -76 -32 -82 -20 -86 -6 Z`}
        fill={C.hair} transform={`translate(${tx * 0.25},${pitchDY * 0.55}) scale(1,${1 + P.pitch * 0.12})`} />
      <path d="M -20 -118 C 10 -126 50 -114 70 -88" stroke="#3A3446" strokeWidth={7} fill="none" strokeLinecap="round"
        opacity={0.8} transform={`translate(${tx * 0.25},${pitchDY * 0.55})`} />
      <path d="M -24 -70 C -14 -96 -6 -110 4 -124" stroke="#2C2734" strokeWidth={4} fill="none" strokeLinecap="round"
        transform={`translate(${tx * 0.25},${pitchDY * 0.55})`} />
      {/* glow HP ke muka */}
      <ellipse cx={0} cy={30} rx={92} ry={90} fill={`url(#${fid}-fglow)`} opacity={faceGlowOp} />
      {/* bengong: spiral kecil */}
      {X.dazed > 0.1 && (
        <g opacity={X.dazed} transform={`translate(${70},${-120}) rotate(${t * 140})`}>
          <path d="M 0 0 m -3 0 a 3 3 0 1 1 6 0 a 6 6 0 1 1 -12 0 a 9 9 0 1 1 18 0" stroke={C.cream}
            strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.85} />
        </g>
      )}
      {/* urat marah */}
      {X.angry > 0.1 && (
        <g opacity={X.angry} transform="translate(-58,-92)">
          <path d="M -10 -2 L -3 -2 L -3 -9 M 3 -9 L 3 -2 L 10 -2 M 10 4 L 3 4 L 3 11 M -3 11 L -3 4 L -10 4"
            stroke={C.red2} strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
      )}
    </g>
  );

  const torso = (
    <g>
      {/* leher */}
      <rect x={-21} y={-torsoH - 34} width={42} height={44} rx={12} fill={C.skinShade} />
      {/* jaket bomber */}
      <path d={`M -68 ${-torsoH + 4} Q -86 ${-torsoH + 10} -86 ${-torsoH + 40} L -78 -18 Q -76 -2 -60 -2 L 60 -2
          Q 76 -2 78 -18 L 86 ${-torsoH + 40} Q 86 ${-torsoH + 10} 68 ${-torsoH + 4} Q 0 ${-torsoH - 8} -68 ${-torsoH + 4} Z`}
        fill={`url(#${fid}-jacket)`} />
      {/* kaos dalam */}
      <path d={`M -24 ${-torsoH + 2} Q 0 ${-torsoH + 36} 24 ${-torsoH + 2} Z`} fill={C.plum} />
      {/* kerah rib */}
      <path d={`M -34 ${-torsoH + 2} Q 0 ${-torsoH + 44} 34 ${-torsoH + 2}`} stroke={C.navyLight} strokeWidth={10}
        fill="none" strokeLinecap="round" />
      {/* resleting */}
      <line x1={3} y1={-torsoH + 30} x2={3} y2={-26} stroke={C.navyDark} strokeWidth={4} />
      <rect x={-1} y={-torsoH + 60} width={9} height={16} rx={3} fill={C.cream} opacity={0.8} />
      {/* kantong */}
      <path d={`M -58 ${-torsoH * 0.38} l 22 -22`} stroke={C.navyDark} strokeWidth={5} strokeLinecap="round" />
      <path d={`M 58 ${-torsoH * 0.38} l -22 -22`} stroke={C.navyDark} strokeWidth={5} strokeLinecap="round" />
      {/* rib pinggang */}
      <rect x={-78} y={-30} width={156} height={30} rx={12} fill={C.navyLight} />
      {Array.from({length: 15}).map((_, i) => (
        <line key={i} x1={-68 + i * 9.7} y1={-26} x2={-68 + i * 9.7} y2={-4} stroke={C.navy} strokeWidth={2.5} opacity={0.7} />
      ))}
    </g>
  );

  const legsSvg = (
    <g>
      {[LR, LL].map((L, i) => (
        <g key={i}>
          <path d={limbPath(L.hip, L.knee, L.foot)} stroke={C.chino} strokeWidth={46} strokeLinecap="round"
            strokeLinejoin="round" fill="none" />
          <path d={limbPath(L.hip, L.knee, L.foot)} stroke={C.navyDark} strokeWidth={6} strokeLinecap="round"
            strokeLinejoin="round" fill="none" opacity={0.4} transform={`translate(${i ? -12 : 12},0)`} />
        </g>
      ))}
      <rect x={-62} y={pelvis.y - 22} width={124} height={44} rx={18} fill={C.chino} />
      {shoe(LR.foot, LR.a2, -1)}
      {shoe(LL.foot, LL.a2, 1)}
    </g>
  );

  const phoneInHand = P.holdPhoneL > 0.5 && (
    <g transform={`translate(${AL.hand.x - 8},${AL.hand.y - 34}) rotate(-8)`}>
      <PhoneBody w={46} h={86} glow={1} color={phoneColor} back />
    </g>
  );

  const crossed = POSES[pk.cur] === POSES.arms_crossed;

  const body = (
    <g>
      {legsSvg}
      <g transform={`translate(${pelvis.x},${pelvis.y}) rotate(${P.lean})`}>
        {!crossed && P.handFront < 0.5 && arm(AR, -1, 0, true)}
        {torso}
        {head}
        {crossed ? (
          <>
            {arm(AL, 1)}
            {arm(AR, -1, 0, true)}
          </>
        ) : (
          <>
            {arm(AR, -1, 0, true)}
            {arm(AL, 1, P.pointL)}
          </>
        )}
        {phoneInHand}
      </g>
    </g>
  );

  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <defs>
        <linearGradient id={`${fid}-skin`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.skin} />
          <stop offset="0.65" stopColor={C.skin} />
          <stop offset="1" stopColor={C.skinShade} />
        </linearGradient>
        <linearGradient id={`${fid}-jacket`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.navyLight} />
          <stop offset="0.45" stopColor={C.navy} />
          <stop offset="1" stopColor={C.navyDark} />
        </linearGradient>
        <radialGradient id={`${fid}-fglow`} cx="0.5" cy="0.75" r="0.7">
          <stop offset="0" stopColor={phoneColor} stopOpacity={0.75} />
          <stop offset="1" stopColor={phoneColor} stopOpacity={0} />
        </radialGradient>
        <filter id={`${fid}-rim`} x="-30%" y="-30%" width="160%" height="160%">
          <feOffset in="SourceAlpha" dx={-5} dy={4} result="off" />
          <feComposite in="SourceAlpha" in2="off" operator="out" result="edge" />
          <feGaussianBlur in="edge" stdDeviation={1.6} result="edgeB" />
          <feFlood floodColor={rimColor} />
          <feComposite in2="edgeB" operator="in" result="rimc" />
          <feGaussianBlur in="rimc" stdDeviation={9} result="rimGlow" />
          <feMerge>
            <feMergeNode in="rimGlow" />
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="rimc" />
          </feMerge>
        </filter>
      </defs>
      {/* bayangan di lantai */}
      <ellipse cx={0} cy={6} rx={110} ry={16} fill="#000" opacity={0.28} />
      <g filter={rim ? `url(#${fid}-rim)` : undefined}>{body}</g>
    </g>
  );
};
