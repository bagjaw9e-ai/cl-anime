import React from 'react';
import {interpolate as fInterp} from 'flubber';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, clamp, lerp, rand} from '../theme';

/* ---------------------------------------------------------------------------
 * ANAK (rig BARU video "nikah dengan pecandu"): anak laki-laki ±6 tahun, gaya & proporsi sama dengan rig pria/wanita
 * (flat vector tanpa outline, kepala besar karikatur), kulit langsat, rambut hitam poni, piyama kuning pucat bermotif
 * bintang kecil, sandal biru muda, selalu membawa boneka beruang kecil.
 * (0,0) = tanah di tengah kaki, atas = -y. Tinggi ±410 px (skala 1). Sudut lengan: 0 = ke bawah, + = menjauh dari badan.
 * R = kiri layar, L = kanan layar. Selalu hidup: napas, weight shift, kedip, lirikan, gemetar saat takut.
 * ------------------------------------------------------------------------- */

export type CExpression = 'neutral' | 'happy' | 'curious' | 'scared' | 'sad' | 'crying' | 'hiding';
export type CPoseName = 'standing' | 'hugging_teddy' | 'peeking_from_door' | 'covering_ears' | 'hiding_behind_mother';
type Teddy = 'dangle' | 'hug' | 'tuck' | 'floor';

type Limb = {a: number; b: number};
type Pose = {lean: number; headTilt: number; headDY: number; pitch: number; turn: number; armR: Limb; armL: Limb; legR: number; legL: number;
  shrink: number; tremble: number; crouch: number};
const P0: Pose = {lean: 0, headTilt: 0, headDY: 0, pitch: 0, turn: 0, armR: {a: 10, b: -10}, armL: {a: 10, b: -10}, legR: 5, legL: 5,
  shrink: 0, tremble: 0, crouch: 0};
const mk = (o: Partial<Pose>): Pose => ({...P0, ...o});
export const CPOSES: Record<CPoseName, Pose> = {
  // berdiri, boneka beruang menjuntai di tangan kanan
  standing: mk({armR: {a: 12, b: -16}, armL: {a: 10, b: -12}, headTilt: 4}),
  // memeluk boneka beruang erat di dada, bahu menutup
  hugging_teddy: mk({armR: {a: 32, b: -118}, armL: {a: 32, b: -118}, shrink: 0.4, headTilt: 5, pitch: 0.12, headDY: 4}),
  // mengintip dari balik pintu (pintu di kanan layar): badan condong, tangan kiri mencengkeram tepi pintu, kepala miring keluar
  peeking_from_door: mk({lean: 12, armL: {a: 96, b: -84}, armR: {a: 22, b: -96}, headTilt: 15, turn: 0.45, legR: 3, legL: 9, shrink: 0.3}),
  // menutup kedua telinga, siku terbuka, bahu naik, badan merunduk
  covering_ears: mk({armR: {a: 120, b: 62}, armL: {a: 120, b: 62}, shrink: 1, crouch: 1, pitch: 0.25, headDY: 10, tremble: 0.8, legR: 8, legL: 8}),
  // bersembunyi di balik ibu (ibu di kanan layar): dua tangan mencengkeram gamis ibu, mengintip dari samping
  hiding_behind_mother: mk({lean: 7, armL: {a: 64, b: -46}, armR: {a: 26, b: -112}, headTilt: 10, turn: 0.4, shrink: 0.6, tremble: 0.4, crouch: 0.3}),
};
const TEDDY: Record<CPoseName, Teddy> = {standing: 'dangle', hugging_teddy: 'hug', peeking_from_door: 'tuck', covering_ears: 'floor', hiding_behind_mother: 'tuck'};

/* ---------------- ekspresi ---------------- */
type Brow = {y: number; rot: number};
type Eye = {lid: number; lidB: number; iris: number; dx: number; dy: number; squeeze: number};
type ExprDef = {mouth: string; browR: Brow; browL: Brow; eye: Eye; tears: number; blush: number; sweat: number; pale: number; quiver: number};
const E = (o: Partial<Eye>): Eye => ({lid: 0.08, lidB: 0, iris: 1, dx: 0, dy: 0, squeeze: 0, ...o});
const D = (o: Partial<ExprDef> & {mouth: string}): ExprDef => ({browR: {y: 0, rot: 0}, browL: {y: 0, rot: 0}, eye: E({}), tears: 0, blush: 0.4, sweat: 0, pale: 0, quiver: 0, ...o});
const M = {
  neutral: 'M -10 0 Q 0 4 10 0 Q 0 6 -10 0 Z',
  happy: 'M -16 -3 Q 0 2 16 -3 Q 13 14 0 16 Q -13 14 -16 -3 Z',
  o: 'M -6 2 C -6 -5 6 -5 6 2 C 6 8 -6 8 -6 2 Z',
  gasp: 'M -8 0 C -8 -10 8 -10 8 0 C 8 12 -8 12 -8 0 Z',
  frown: 'M -12 7 Q 0 -3 12 7 Q 0 2 -12 7 Z',
  wobble: 'M -13 4 Q -6 0 0 4 Q 6 0 13 4 Q 6 8 0 6 Q -6 8 -13 4 Z',
  tight: 'M -9 3 L 9 3 L 9 6 L -9 6 Z',
};
export const CEXPR: Record<CExpression, ExprDef> = {
  neutral: D({mouth: M.neutral}),
  happy: D({mouth: M.happy, browR: {y: -5, rot: -4}, browL: {y: -5, rot: 4}, eye: E({lid: 0.06, lidB: 0.38}), blush: 1}),
  curious: D({mouth: M.o, browR: {y: -2, rot: 2}, browL: {y: -10, rot: 6}, eye: E({lid: 0, iris: 1.08, dx: 0.45, dy: -0.2})}),
  scared: D({mouth: M.gasp, browR: {y: -9, rot: -16}, browL: {y: -9, rot: 16}, eye: E({lid: 0, iris: 0.6}), sweat: 0.7, pale: 0.6, blush: 0}),
  sad: D({mouth: M.frown, browR: {y: -3, rot: -16}, browL: {y: -3, rot: 16}, eye: E({lid: 0.34, dy: 0.5, iris: 0.95}), blush: 0.2}),
  crying: D({mouth: M.wobble, browR: {y: -5, rot: -22}, browL: {y: -5, rot: 22}, eye: E({lid: 0.55, lidB: 0.25, dy: 0.3}), tears: 1, quiver: 1, blush: 0.8}),
  hiding: D({mouth: M.tight, browR: {y: 3, rot: -14}, browL: {y: 3, rot: 14}, eye: E({lid: 1, squeeze: 1}), pale: 0.3, blush: 0.2}),
};

const cache = new Map<string, (t: number) => string>();
const morph = (a: string, b: string, t: number) => {
  if (a === b || t >= 1) return b;
  if (t <= 0) return a;
  const k = a + '|' + b;
  if (!cache.has(k)) cache.set(k, fInterp(a, b, {maxSegmentLength: 3}));
  return cache.get(k)!(t);
};
type KF<T> = T | Array<[number, T]>;
const activeKF = <T,>(v: KF<T>, f: number) => {
  const l = Array.isArray(v) ? (v as Array<[number, T]>) : [[-1000, v as T] as [number, T]];
  let i = 0;
  for (let k = 0; k < l.length; k++) if (f >= l[k][0]) i = k;
  return {cur: l[i][1], prev: l[Math.max(0, i - 1)][1], at: l[i][0], first: i === 0};
};
const lerpPose = (a: Pose, b: Pose, t: number): Pose => {
  const o = {} as Record<string, unknown>;
  for (const k of Object.keys(a) as (keyof Pose)[]) {
    const va = a[k], vb = b[k];
    o[k] = typeof va === 'number' ? lerp(va, vb as number, t) : {a: lerp((va as Limb).a, (vb as Limb).a, t), b: lerp((va as Limb).b, (vb as Limb).b, t)};
  }
  return o as Pose;
};
const rad = (d: number) => (d * Math.PI) / 180;
const dir = (deg: number) => [Math.sin(rad(deg)), Math.cos(rad(deg))];

const PJ = {top: '#F6E7A2', topD: '#E3CC7C', topL: '#FFF6CF', star: '#F2B84B', pants: '#EEDC92', slip: '#9FC3E8', hair: C.hair};

// boneka beruang kecil (dinamis: telinga & kepala bergoyang)
export const TeddyBear: React.FC<{t: number; s?: number; rot?: number}> = ({t, s = 1, rot = 0}) => (
  <g transform={`scale(${s}) rotate(${rot})`}>
    <ellipse cx={0} cy={16} rx={24} ry={28} fill="#A0714F" />
    <ellipse cx={0} cy={20} rx={14} ry={16} fill="#C99A72" />
    {[-1, 1].map((sd) => <ellipse key={sd} cx={sd * 22} cy={8} rx={9} ry={14} fill="#946645" transform={`rotate(${sd * -30} ${sd * 22} 8)`} />)}
    {[-1, 1].map((sd) => <ellipse key={`f${sd}`} cx={sd * 13} cy={42} rx={10} ry={8} fill="#946645" />)}
    <g transform={`rotate(${Math.sin(t * 0.12) * 4} 0 -10)`}>
      {[-1, 1].map((sd) => <circle key={sd} cx={sd * 15} cy={-30} r={8} fill="#946645" />)}
      {[-1, 1].map((sd) => <circle key={`i${sd}`} cx={sd * 15} cy={-30} r={4} fill="#C99A72" />)}
      <circle cx={0} cy={-14} r={19} fill="#A0714F" />
      <ellipse cx={0} cy={-8} rx={9} ry={7} fill="#D7B08A" />
      <circle cx={0} cy={-11} r={3} fill="#2A1A14" />
      {[-1, 1].map((sd) => <circle key={`e${sd}`} cx={sd * 7} cy={-19} r={2.6} fill="#1A1012" />)}
      <path d="M -6 2 L 0 -2 L 6 2 L 0 6 Z M -6 2 L -14 -2 L -12 6 Z M 6 2 L 14 -2 L 12 6 Z" fill="#D94A5A" transform="translate(0,6)" />
    </g>
  </g>
);

export type ChildProps = {
  x?: number; y?: number; scale?: number; expression?: KF<CExpression>; pose?: KF<CPoseName>; lookAt?: {x: number; y: number};
  blinkSeed?: number; rim?: boolean; rimColor?: string; rimColor2?: string; id?: string; noTeddy?: boolean;
};

export const ChildCharacter: React.FC<ChildProps> = ({
  x = 540, y = 1250, scale = 1, expression = 'neutral', pose = 'standing', lookAt = {x: 0, y: 0}, blinkSeed = 9,
  rim = false, rimColor = '#FFF4E0', rimColor2 = '#FFB23F', id = 'k', noTeddy = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  // pose tween (badan -> lengan -> kepala) + anticipation
  const pk = activeKF(pose, frame);
  const k0 = frame - pk.at;
  const antic = pk.first ? 0 : k0 >= 0 && k0 < 6 ? Math.sin((k0 / 6) * Math.PI) * 0.1 : 0;
  const sp = (d: number, st: number, dm: number) => (pk.first ? 1 : spring({frame: frame - pk.at - d, fps, config: {damping: dm, stiffness: st, mass: 0.6}}) - antic);
  const A = CPOSES[pk.prev], B = CPOSES[pk.cur];
  const Pb = lerpPose(A, B, sp(0, 180, 15)), Pa = lerpPose(A, B, sp(2, 130, 11)), Ph = lerpPose(A, B, sp(3, 110, 10));
  const P: Pose = {...Pb, armR: Pa.armR, armL: Pa.armL, headTilt: Ph.headTilt, headDY: Ph.headDY, pitch: Ph.pitch, turn: Ph.turn};
  const teddy = TEDDY[pk.cur];

  // ekspresi (morph 6 frame)
  const ek = activeKF(expression, frame);
  const et0 = ek.first ? 1 : clamp((frame - ek.at) / 6);
  const et = et0 * et0 * (3 - 2 * et0);
  const Xa = CEXPR[ek.prev], Xb = CEXPR[ek.cur];
  const L = (a: number, b: number) => lerp(a, b, et);
  const X = {
    mouth: morph(Xa.mouth, Xb.mouth, et), browR: {y: L(Xa.browR.y, Xb.browR.y), rot: L(Xa.browR.rot, Xb.browR.rot)},
    browL: {y: L(Xa.browL.y, Xb.browL.y), rot: L(Xa.browL.rot, Xb.browL.rot)},
    eye: {lid: L(Xa.eye.lid, Xb.eye.lid), lidB: L(Xa.eye.lidB, Xb.eye.lidB), iris: L(Xa.eye.iris, Xb.eye.iris), dx: L(Xa.eye.dx, Xb.eye.dx),
      dy: L(Xa.eye.dy, Xb.eye.dy), squeeze: L(Xa.eye.squeeze, Xb.eye.squeeze)},
    tears: L(Xa.tears, Xb.tears), blush: L(Xa.blush, Xb.blush), sweat: L(Xa.sweat, Xb.sweat), pale: L(Xa.pale, Xb.pale), quiver: L(Xa.quiver, Xb.quiver),
  };

  // idle: napas cepat (anak), weight shift, gemetar, isak (crying tanpa suara: bahu naik-turun)
  const breathe = Math.sin(t * 2 * Math.PI * 0.42 + blinkSeed);
  const wsh = Math.sin(t * 2 * Math.PI * 0.27 + blinkSeed) * (1 - P.crouch * 0.6);
  const trem = (P.tremble + X.quiver * 0.4) * Math.sin(t * 38) * 1.4;
  const sob = X.quiver * Math.max(0, Math.sin(t * 2 * Math.PI * 1.4)) * 4;
  const micro = (k: number) => Math.sin(t * (1.3 + k * 0.31) + k * 2.1) + 0.4 * Math.sin(t * (2.2 + k * 0.4) + k);
  const armR = {a: P.armR.a + micro(1) * 2 + trem, b: P.armR.b + micro(2) * 3};
  const armL = {a: P.armL.a + micro(3) * 2 + trem, b: P.armL.b + micro(4) * 3};
  const lean = P.lean + wsh * 1.4 + trem * 0.5;

  // kedip + lirikan
  let blink = 0;
  {
    const per = 2.0 + rand(blinkSeed) * 1.6, kk = Math.floor(t / per), tb = t - kk * per - rand(blinkSeed + kk * 7.1) * 0.6;
    if (tb >= 0 && tb < 0.16) blink = Math.sin((tb / 0.16) * Math.PI);
  }
  let glance = 0;
  {
    const gp = 1.6 + rand(blinkSeed * 3.3) * 0.6, gk = Math.floor(t / gp), gt = t - gk * gp;
    if (rand(gk * 4.1 + blinkSeed) > 0.4 && gt > 0.3 && gt < 0.9) glance = (rand(gk * 7.7 + blinkSeed) > 0.5 ? 1 : -1) * 0.45;
  }

  // geometri
  const crouch = P.crouch * 22;
  const hipY = -118 + crouch;
  const torsoH = 110 * (1 + breathe * 0.012) * (1 - 0.05 * P.shrink);
  const pelvis = {x: wsh * 3, y: hipY};
  const shY = -torsoH + 14 + P.shrink * 8 - sob;
  const armPts = (side: -1 | 1, l: Limb) => {
    const sh = {x: side * 44, y: shY};
    const a1 = side * l.a, d1 = dir(a1);
    const el = {x: sh.x + d1[0] * 46, y: sh.y + d1[1] * 46};
    const a2 = a1 + side * l.b, d2 = dir(a2);
    return {sh, el, hand: {x: el.x + d2[0] * 44, y: el.y + d2[1] * 44}, a2};
  };
  const AR = armPts(-1, armR), AL = armPts(1, armL);
  const legs = [-1, 1].map((sd) => {
    const a = (sd < 0 ? P.legR : P.legL) - wsh * 2 * sd;
    const hip = {x: pelvis.x + sd * 22, y: hipY + 4};
    const knee = {x: hip.x + Math.sin(rad(sd * a)) * 60 - sd * P.crouch * 10, y: hip.y + 60 - crouch * 0.4};
    const foot = {x: knee.x + sd * P.crouch * 8, y: -8};
    return {hip, knee, foot, sd};
  });

  const arm = (pts: ReturnType<typeof armPts>, side: -1 | 1) => {
    const d = dir(pts.a2);
    return (
      <g>
        <path d={`M ${pts.sh.x} ${pts.sh.y} L ${pts.el.x} ${pts.el.y} L ${pts.hand.x - d[0] * 8} ${pts.hand.y - d[1] * 8}`} stroke={PJ.top} strokeWidth={26}
          strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={`M ${pts.sh.x} ${pts.sh.y} L ${pts.el.x} ${pts.el.y}`} stroke={PJ.topD} strokeWidth={5} strokeLinecap="round" opacity={0.4}
          transform={`translate(${side * 8},2)`} />
        <circle cx={pts.hand.x - d[0] * 9} cy={pts.hand.y - d[1] * 9} r={13} fill={PJ.topL} />
        <g transform={`translate(${pts.hand.x},${pts.hand.y}) rotate(${-pts.a2})`}>
          <ellipse cx={0} cy={2} rx={11} ry={12} fill={C.skin} />
          <ellipse cx={-side * 9} cy={-2} rx={4.5} ry={7} fill={C.skin} transform={`rotate(${side * 30})`} />
        </g>
      </g>
    );
  };

  // ---------- kepala ----------
  const tx = P.turn * 10, pDY = P.pitch * 18;
  const eye = (cx: number, side: -1 | 1) => {
    const lid = clamp(Math.max(X.eye.lid, blink));
    const ix = (X.eye.dx + glance * (1 - X.eye.squeeze) + lookAt.x * 0.8) * 5, iy = (X.eye.dy + lookAt.y * 0.8) * 3.5;
    const cid = `${id}-ke${side}`;
    const sq = X.eye.squeeze;
    if (sq > 0.6) {
      return (
        <path transform={`translate(${cx + tx},${pDY})`} d={`M ${-14 * side} -8 L ${6 * side} 0 L ${-14 * side} 8`} stroke="#241418" strokeWidth={4.5}
          fill="none" strokeLinecap="round" strokeLinejoin="round" />
      );
    }
    const lidY = lerp(-18, 15, lid), botY = lerp(16, -2, X.eye.lidB);
    return (
      <g transform={`translate(${cx + tx},${pDY})`}>
        <clipPath id={cid}><ellipse cx={0} cy={0} rx={15} ry={17} /></clipPath>
        <ellipse cx={0} cy={0} rx={15} ry={17} fill="#FFFFFF" />
        <g clipPath={`url(#${cid})`}>
          <circle cx={ix} cy={iy + 2} r={10 * X.eye.iris} fill="#4A2B1C" />
          <circle cx={ix} cy={iy + 2} r={5.6 * X.eye.iris} fill="#120A0A" />
          <circle cx={ix + 3.5} cy={iy - 2} r={3.2} fill="#FFFFFF" />
          <circle cx={ix - 3} cy={iy + 6} r={1.6} fill="#FFFFFF" opacity={0.8} />
          <rect x={-20} y={-24} width={40} height={lidY + 24} fill={C.skin} />
          <rect x={-20} y={botY} width={40} height={24} fill={C.skin} />
        </g>
        <path d={`M -16 ${Math.min(lidY, -2)} Q 0 ${lidY - 5} 16 ${Math.min(lidY, -2)}`} stroke="#241418" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      </g>
    );
  };
  const brow = (cx: number, b: Brow) => (
    <rect x={-12} y={-3} width={24} height={6} rx={3} fill="#2A1C1A" transform={`translate(${cx + tx * 1.1},${-30 + b.y + pDY}) rotate(${b.rot})`} />
  );
  const FACE = 'M 0 -78 C 50 -78 76 -46 76 0 C 76 46 46 74 0 76 C -46 74 -76 46 -76 0 C -76 -46 -50 -78 0 -78 Z';
  const headY = shY - 12 - 70 + P.headDY;
  const head = (
    <g transform={`translate(0,${shY}) rotate(${P.headTilt + Math.sin(t * 1.9) * 1}) translate(0,${headY - shY})`}>
      {/* telinga */}
      {[-1, 1].map((sd) => <ellipse key={sd} cx={sd * 74 + tx * 0.3} cy={8 + pDY * 0.4} rx={12} ry={17} fill={C.skinShade} />)}
      <path d={FACE} fill={`url(#${id}-kskin)`} />
      <path d={FACE} fill="#B9C4E0" opacity={X.pale * 0.28} />
      {[-1, 1].map((sd) => <ellipse key={sd} cx={sd * 42 + tx} cy={28 + pDY} rx={13} ry={7} fill="#FF7A8A" opacity={X.blush * 0.35} />)}
      {eye(-30, -1)}
      {eye(30, 1)}
      {brow(-30, X.browR)}
      {brow(30, X.browL)}
      <path d={`M ${2 + tx * 1.2} ${12 + pDY} Q ${7 + tx * 1.2} ${22 + pDY} ${tx * 1.2 - 2} ${24 + pDY}`} stroke={C.skinShade} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <g transform={`translate(${tx * 1.1 + X.quiver * Math.sin(t * 40) * 0.8},${44 + pDY * 0.9})`}><path d={X.mouth} fill="#9A3A4E" /></g>
      <path d="M 60 -30 q 6 11 0 16 q -6 -5 0 -16 Z" fill={C.mint} opacity={X.sweat * 0.9} />
      {X.tears > 0.05 && [-1, 1].map((sd) => {
        const ph = (t * 1.2 + (sd > 0 ? 0.5 : 0)) % 1;
        return (
          <g key={sd} opacity={X.tears}>
            <path d={`M ${sd * 30 + tx - 5} ${14 + pDY} Q ${sd * 34 + tx} ${34 + pDY} ${sd * 31 + tx} ${56 + pDY}`} stroke={C.mint} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.85} />
            <circle cx={sd * 32 + tx} cy={20 + pDY + ph * 50} r={4.5} fill={C.mint} opacity={1 - ph} />
          </g>
        );
      })}
      {/* rambut hitam: mangkuk bervolume + poni jatuh ke dahi */}
      <path d={`M -82 -2 C -92 -70 -50 -106 4 -104 C 60 -104 94 -66 82 -4 C 76 -30 66 -44 56 -48 C 50 -36 40 -34 34 -40 C 22 -28 6 -30 -2 -42
          C -12 -30 -26 -30 -34 -40 C -44 -32 -60 -32 -66 -42 C -74 -30 -78 -18 -82 -2 Z`} fill={PJ.hair} transform={`translate(${tx * 0.25},${pDY * 0.5})`} />
      <path d="M -30 -96 C -4 -104 30 -98 52 -80" stroke="#3A3446" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} transform={`translate(${tx * 0.25},${pDY * 0.5})`} />
      <path d="M 8 -104 q 10 -14 22 -10" stroke={PJ.hair} strokeWidth={7} fill="none" strokeLinecap="round" />
    </g>
  );

  // ---------- badan (piyama) ----------
  const teddyEl = !noTeddy && (() => {
    if (teddy === 'hug') return <g transform={`translate(0,${shY + 62})`}><TeddyBear t={frame} s={0.95} /></g>;
    if (teddy === 'dangle') return <g transform={`translate(${AR.hand.x - 4},${AR.hand.y + 40}) rotate(${Math.sin(t * 2.1) * 8})`}><TeddyBear t={frame} s={0.75} rot={180 + 10} /></g>;
    if (teddy === 'tuck') return <g transform={`translate(${-48},${shY + 64}) rotate(-20)`}><TeddyBear t={frame} s={0.72} /></g>;
    return null;
  })();
  const floorTeddy = !noTeddy && teddy === 'floor' && (
    <g transform={`translate(${70},${-26}) rotate(${78 + Math.sin(t * 0.6) * 2})`}><TeddyBear t={frame} s={0.7} /></g>
  );
  const torsoG = (
    <g transform={`translate(${pelvis.x},${pelvis.y}) rotate(${lean})`}>
      {teddy === 'tuck' && teddyEl}
      {/* atasan piyama */}
      <path d={`M -48 ${shY - 6} Q -62 ${shY} -60 ${shY + 30} L -56 10 Q 0 22 56 10 L 60 ${shY + 30} Q 62 ${shY} 48 ${shY - 6} Q 0 ${shY - 16} -48 ${shY - 6} Z`}
        fill={`url(#${id}-pj)`} />
      {Array.from({length: 6}).map((_, i) => (
        <path key={i} transform={`translate(${-34 + (i % 3) * 32 + (Math.floor(i / 3) % 2) * 14},${shY + 26 + Math.floor(i / 3) * 34}) scale(0.5)`}
          d="M 0 -10 L 3 -3 L 10 -3 L 4 2 L 6 10 L 0 5 L -6 10 L -4 2 L -10 -3 L -3 -3 Z" fill={PJ.star} opacity={0.8} />
      ))}
      {/* kerah piyama + kancing */}
      <path d={`M -26 ${shY - 8} L -4 ${shY + 18} L -30 ${shY + 14} Z M 26 ${shY - 8} L 4 ${shY + 18} L 30 ${shY + 14} Z`} fill={PJ.topL} />
      {[0, 1, 2].map((k) => <circle key={k} cx={0} cy={shY + 30 + k * 26} r={3.5} fill={PJ.topD} />)}
      {head}
      {teddy === 'hug' && teddyEl}
      {arm(AR, -1)}
      {arm(AL, 1)}
      {teddy === 'dangle' && teddyEl}
    </g>
  );
  const legsG = (
    <g>
      {legs.map((L2) => (
        <g key={L2.sd}>
          <path d={`M ${L2.hip.x} ${L2.hip.y} L ${L2.knee.x} ${L2.knee.y} L ${L2.foot.x} ${L2.foot.y}`} stroke={PJ.pants} strokeWidth={32} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d={`M ${L2.foot.x - 6} ${L2.foot.y - 14} l 12 0`} stroke={PJ.topD} strokeWidth={4} strokeLinecap="round" />
          <ellipse cx={L2.foot.x + L2.sd * 6} cy={-4} rx={22} ry={10} fill={PJ.slip} />
          <rect x={L2.foot.x + L2.sd * 6 - 12} y={-14} width={24} height={8} rx={4} fill="#7FA8D6" />
        </g>
      ))}
      <rect x={-46} y={hipY - 14} width={92} height={34} rx={14} fill={PJ.pants} />
    </g>
  );

  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <defs>
        <linearGradient id={`${id}-kskin`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.skin} /><stop offset="0.66" stopColor={C.skin} /><stop offset="1" stopColor={C.skinShade} />
        </linearGradient>
        <linearGradient id={`${id}-pj`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={PJ.topL} /><stop offset="0.45" stopColor={PJ.top} /><stop offset="1" stopColor={PJ.topD} />
        </linearGradient>
        <filter id={`${id}-rim`} x="-35%" y="-25%" width="170%" height="150%" colorInterpolationFilters="sRGB">
          <feOffset in="SourceAlpha" dx={4} dy={3} result="o1" />
          <feComposite in="SourceAlpha" in2="o1" operator="out" result="e1" />
          <feGaussianBlur in="e1" stdDeviation={1.3} result="e1b" />
          <feFlood floodColor={rimColor} />
          <feComposite in2="e1b" operator="in" result="r1" />
          <feOffset in="SourceAlpha" dx={-4} dy={2} result="o2" />
          <feComposite in="SourceAlpha" in2="o2" operator="out" result="e2" />
          <feGaussianBlur in="e2" stdDeviation={1.3} result="e2b" />
          <feFlood floodColor={rimColor2} />
          <feComposite in2="e2b" operator="in" result="r2" />
          <feMerge result="rims"><feMergeNode in="r1" /><feMergeNode in="r2" /></feMerge>
          <feGaussianBlur in="rims" stdDeviation={5} result="rimGlow" />
          <feMorphology in="SourceAlpha" operator="dilate" radius={3} result="dil" />
          <feGaussianBlur in="dil" stdDeviation={12} result="dilB" />
          <feFlood floodColor={rimColor2} floodOpacity={0.35} />
          <feComposite in2="dilB" operator="in" result="back" />
          <feMerge><feMergeNode in="back" /><feMergeNode in="rimGlow" /><feMergeNode in="SourceGraphic" /><feMergeNode in="rims" /></feMerge>
        </filter>
      </defs>
      <ellipse cx={0} cy={4} rx={70} ry={11} fill="#000" opacity={0.28} />
      <g filter={rim ? `url(#${id}-rim)` : undefined}>
        {floorTeddy}
        {legsG}
        {torsoG}
      </g>
    </g>
  );
};
