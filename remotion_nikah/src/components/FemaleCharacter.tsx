import React from 'react';
import {interpolate as fInterp} from 'flubber';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, clamp, lerp, rand} from '../theme';
import {nkFemaleBody, nkFemaleFront} from './NikahProps';

/* ---------------------------------------------------------------------------
 * Karakter WANITA: perempuan muda Asia Tenggara, gaya & proporsi sama dengan rig pria (kepala besar karikatur,
 * flat vector tanpa outline). Hijab polos dusty rose + gamis mauve muda; outfit 'bride' = busana pengantin putih-krem.
 * Rig: kepala (pivot leher) -> hijab, alis, mata (putih, iris, kelopak, bulu mata), hidung, mulut; badan -> lengan (atas,
 * bawah, tangan), kaki (di balik gamis, hanya sepatu terlihat). (0,0) = tanah di tengah kaki, atas = -y.
 * Sudut lengan: 0 = lurus ke bawah, + = menjauh dari badan. R = kiri layar, L = kanan layar. Tidak lip-sync (tidak bicara).
 * ------------------------------------------------------------------------- */

export type FExpression = 'neutral' | 'happy' | 'hopeful' | 'curious' | 'suspicious' | 'confused' | 'disappointed' | 'sad' | 'hurt'
  | 'uncomfortable' | 'scared' | 'crying' | 'withdrawn'
  // video nikah (BARU)
  | 'loving' | 'exhausted' | 'protective';
export type FPoseName = 'standing_smile' | 'bringing_tea' | 'hugging_husband' | 'talking' | 'stepping_back'
  | 'sitting_bed_edge_hugging_knees' | 'shielding_self' | 'crying_in_corner' | 'standing_still'
  // video nikah dengan pecandu (semua BARU)
  | 'offering_model_house' | 'waving_unnoticed' | 'holding_husband_hand_warm' | 'talking_soundwave' | 'shielding_heart_glow'
  | 'leaning_against_door' | 'lying_awake_in_bed' | 'standing_in_doorway_light' | 'holding_tin_can_phone' | 'holding_torn_umbrella_over_child';
export type FOutfit = 'daily' | 'bride' | 'kebaya';

type Limb = {a: number; b: number};
type Pose = {pelvisY: number; lean: number; headTilt: number; headDY: number; pitch: number; turn: number;
  armR: Limb; armL: Limb; step: number; tray: number; talk: number; sit: number; back: number; shrink: number; tremble: number;
  roll: number; liftY: number; wave: number; tiptoe: number; brace: number};
const P0: Pose = {pelvisY: 205, lean: 0, headTilt: 0, headDY: 0, pitch: 0, turn: 0, armR: {a: 10, b: -8}, armL: {a: 10, b: -8},
  step: 0, tray: 0, talk: 0, sit: 0, back: 0, shrink: 0, tremble: 0, roll: 0, liftY: 0, wave: 0, tiptoe: 0, brace: 0};
const mk = (o: Partial<Pose>): Pose => ({...P0, ...o});
export const FPOSES: Record<FPoseName, Pose> = {
  standing_still: P0,
  standing_smile: mk({armR: {a: 18, b: -58}, armL: {a: 18, b: -62}, headTilt: 4}),
  bringing_tea: mk({armR: {a: 22, b: -84}, armL: {a: 22, b: -84}, tray: 1, headTilt: 5, pitch: 0.1}),
  hugging_husband: mk({armR: {a: 64, b: -70}, armL: {a: 88, b: -30}, lean: -9, headTilt: -10, turn: -0.4}),
  talking: mk({armL: {a: 42, b: -96}, armR: {a: 14, b: -30}, talk: 1, headTilt: 5}),
  stepping_back: mk({armR: {a: 30, b: -118}, armL: {a: 30, b: -118}, lean: -8, step: 1, headTilt: -6, pitch: -0.05, tremble: 0.4}),
  sitting_bed_edge_hugging_knees: mk({sit: 1, back: 1, pelvisY: 150, headTilt: 6, pitch: 0.3, shrink: 1}),
  shielding_self: mk({armR: {a: 46, b: -150}, armL: {a: 50, b: -146}, lean: -5, headTilt: 8, pitch: 0.25, shrink: 0.6, tremble: 1}),
  crying_in_corner: mk({sit: 1, pelvisY: 46, headTilt: 8, pitch: 0.5, headDY: 10, shrink: 1, tremble: 0.6}),
  // ---- pose video NIKAH (BARU) ----
  // menyodorkan miniatur rumah kartu dengan dua tangan setinggi dada, condong ke depan
  offering_model_house: mk({armR: {a: 34, b: -92}, armL: {a: 34, b: -92}, lean: -4, headTilt: -6, pitch: 0.12, turn: -0.3}),
  // melambai tinggi (berjinjit memantul), tangan lain di dada; tak dihiraukan
  waving_unnoticed: mk({armL: {a: 105, b: 45}, armR: {a: 24, b: -112}, wave: 1, tiptoe: 1, headTilt: 6, turn: -0.3}),
  // dua tangan menggenggam satu tangan suami di depan-kiri (tangan bercahaya hangat)
  holding_husband_hand_warm: mk({armR: {a: 64, b: -50}, armL: {a: 22, b: -120}, lean: -5, headTilt: -7, turn: -0.4, pitch: 0.08}),
  // bicara: telapak kiri terbuka di dekat mulut, condong ke suami, gelombang suara keluar (props)
  talking_soundwave: mk({armL: {a: 40, b: -128}, armR: {a: 16, b: -40}, talk: 0.5, lean: -4, turn: -0.45, headTilt: -4}),
  // dua telapak menangkup cahaya hati di dada, bahu menutup
  shielding_heart_glow: mk({armR: {a: 26, b: -132}, armL: {a: 26, b: -132}, shrink: 0.5, pitch: 0.28, headDY: 6, headTilt: 5, tremble: 0.3}),
  // bersandar menahan pintu (di kanan layar): punggung & telapak menekan daun pintu, menoleh ke pintu, gemetar
  leaning_against_door: mk({lean: 9, armL: {a: 74, b: 12}, armR: {a: 40, b: 26}, turn: 0.55, headTilt: 9, tremble: 0.9, brace: 1}),
  // berbaring telentang terjaga (badan diputar -90°), lengan di atas selimut, mata terbuka menatap langit-langit
  lying_awake_in_bed: mk({roll: -90, liftY: 130, armR: {a: 18, b: -64}, armL: {a: 18, b: -64}, headTilt: -4}),
  // berdiri di ambang pintu: tangan kiri bertumpu ke kusen, tangan kanan di dada, sedikit condong masuk
  standing_in_doorway_light: mk({armL: {a: 78, b: -36}, armR: {a: 22, b: -116}, lean: -3, headTilt: 5, turn: -0.2}),
  // telepon kaleng: tangan kanan menempelkan kaleng ke mulut/telinga, tangan kiri memegang tali
  holding_tin_can_phone: mk({armR: {a: 144, b: 88}, armL: {a: 30, b: -70}, turn: -0.35, headTilt: -8, lean: -2}),
  // tangan kiri mengangkat payung (sobek) tinggi, tangan kanan merangkul anak di depan-bawah, kuda-kuda melindungi
  holding_torn_umbrella_over_child: mk({armL: {a: 158, b: 12}, armR: {a: 44, b: -24}, lean: 4, headTilt: -6, pitch: -0.1, turn: 0.3, step: 1}),
};

/* ---------------- ekspresi ---------------- */
type Brow = {y: number; rot: number};
type Eye = {lid: number; lidB: number; iris: number; dx: number; dy: number};
type ExprDef = {mouth: string; browR: Brow; browL: Brow; eye: Eye; tears: number; blush: number; sweat: number; pale: number; bags: number};
const E = (o: Partial<Eye>): Eye => ({lid: 0.1, lidB: 0, iris: 1, dx: 0, dy: 0, ...o});
const D = (o: Partial<ExprDef> & {mouth: string}): ExprDef => ({browR: {y: 0, rot: 0}, browL: {y: 0, rot: 0}, eye: E({}), tears: 0, blush: 0, sweat: 0, pale: 0, bags: 0, ...o});
const M = {
  neutral: 'M -14 0 Q 0 4 14 0 Q 0 7 -14 0 Z',
  smile: 'M -22 -3 Q 0 3 22 -3 Q 18 18 0 20 Q -18 18 -22 -3 Z',
  soft: 'M -16 0 Q 0 8 16 0 Q 0 12 -16 0 Z',
  o: 'M -7 2 C -7 -6 7 -6 7 2 C 7 9 -7 9 -7 2 Z',
  flatSide: 'M -14 3 Q 2 5 16 -1 Q 2 8 -14 6 Z',
  wavy: 'M -15 3 Q -8 -2 0 3 Q 8 8 15 2 Q 8 10 0 7 Q -8 2 -15 7 Z',
  frown: 'M -16 8 Q 0 -4 16 8 Q 0 1 -16 8 Z',
  tremble: 'M -16 5 Q -8 0 0 4 Q 8 0 16 5 Q 8 9 0 7 Q -8 9 -16 5 Z',
  gasp: 'M -10 0 C -10 -12 10 -12 10 0 C 10 16 -10 16 -10 0 Z',
  cry: 'M -20 10 Q 0 -10 20 10 Q 0 4 -20 10 Z',
  tight: 'M -12 4 L 12 4 L 12 7 L -12 7 Z',
};
export const FEXPR: Record<FExpression, ExprDef> = {
  neutral: D({mouth: M.neutral}),
  happy: D({mouth: M.smile, browR: {y: -6, rot: -4}, browL: {y: -6, rot: 4}, eye: E({lid: 0.08, lidB: 0.35}), blush: 0.8}),
  hopeful: D({mouth: M.soft, browR: {y: -8, rot: -10}, browL: {y: -8, rot: 10}, eye: E({lid: 0.02, iris: 1.08, dy: -0.2}), blush: 0.5}),
  curious: D({mouth: M.o, browR: {y: -2, rot: 2}, browL: {y: -12, rot: 6}, eye: E({lid: 0.02, iris: 1.05, dx: 0.3})}),
  suspicious: D({mouth: M.flatSide, browR: {y: 4, rot: 10}, browL: {y: -2, rot: -4}, eye: E({lid: 0.45, dx: 0.75})}),
  confused: D({mouth: M.wavy, browR: {y: 3, rot: 6}, browL: {y: -12, rot: 8}, eye: E({lid: 0.1, dx: -0.3})}),
  disappointed: D({mouth: M.frown, browR: {y: -2, rot: -10}, browL: {y: -2, rot: 10}, eye: E({lid: 0.42, dy: 0.5})}),
  sad: D({mouth: M.frown, browR: {y: -4, rot: -16}, browL: {y: -4, rot: 16}, eye: E({lid: 0.36, dy: 0.45, iris: 0.95})}),
  hurt: D({mouth: M.tremble, browR: {y: -6, rot: -20}, browL: {y: -6, rot: 20}, eye: E({lid: 0.22, dy: 0.3}), tears: 0.45}),
  uncomfortable: D({mouth: M.tight, browR: {y: -3, rot: -12}, browL: {y: -3, rot: 12}, eye: E({lid: 0.3, dx: -0.7, dy: 0.4}), sweat: 0.5}),
  scared: D({mouth: M.gasp, browR: {y: -12, rot: -16}, browL: {y: -12, rot: 16}, eye: E({lid: 0, iris: 0.6}), sweat: 0.8, pale: 0.5}),
  crying: D({mouth: M.cry, browR: {y: -5, rot: -22}, browL: {y: -5, rot: 22}, eye: E({lid: 0.55, lidB: 0.25, dy: 0.3}), tears: 1}),
  // ---- ekspresi BARU video nikah ----
  loving: D({mouth: 'M -18 0 Q 0 10 18 0 Q 0 14 -18 0 Z', browR: {y: -6, rot: -6}, browL: {y: -6, rot: 6}, eye: E({lid: 0.38, lidB: 0.32, dy: 0.1}), blush: 1}),
  exhausted: D({mouth: 'M -12 4 Q 0 2 12 4 Q 0 9 -12 7 Z', browR: {y: 2, rot: -8}, browL: {y: 2, rot: 8}, eye: E({lid: 0.5, lidB: 0.08, iris: 0.85, dy: -0.4}), pale: 0.35, bags: 1}),
  protective: D({mouth: 'M -14 4 L 14 4 L 13 8 L -13 8 Z', browR: {y: 4, rot: 12}, browL: {y: 4, rot: -12}, eye: E({lid: 0.12, iris: 0.85, dx: -0.4}), sweat: 0.3}),
  withdrawn: D({mouth: M.tight, browR: {y: 2, rot: -6}, browL: {y: 2, rot: 6}, eye: E({lid: 0.5, dx: -0.4, dy: 0.6}), pale: 0.3}),
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

const OUT = {
  daily: {hijab: '#C98A9B', hijabD: '#A86E7F', hijabL: '#E0A9B7', gamis: '#C7A2C2', gamisD: '#A783A2', gamisL: '#DDBDD8', shoe: '#6E4A5E', trim: '#A783A2'},
  kebaya: {hijab: '#FFFFFF', hijabD: '#E2DCD0', hijabL: '#FFFFFF', gamis: '#FBF7EF', gamisD: '#E0D6C4', gamisL: '#FFFFFF', shoe: '#D9C8A6', trim: '#C9A24A'},
  bride: {hijab: '#FBF6EE', hijabD: '#DCD3C4', hijabL: '#FFFFFF', gamis: '#F6EFE4', gamisD: '#D9CFBF', gamisL: '#FFFFFF', shoe: '#E8DCC6', trim: '#D9B46A'},
};

export type FemaleProps = {
  x?: number; y?: number; scale?: number; expression?: KF<FExpression>; pose?: KF<FPoseName>; outfit?: FOutfit;
  lookAt?: {x: number; y: number}; blinkSeed?: number; rim?: boolean; rimColor?: string; rimColor2?: string; id?: string; gray?: number;
  noProps?: boolean;
};

export const FemaleCharacter: React.FC<FemaleProps> = ({
  x = 540, y = 1250, scale = 1, expression = 'neutral', pose = 'standing_still', outfit = 'daily', lookAt = {x: 0, y: 0},
  blinkSeed = 5, rim = false, rimColor = '#FFF4E0', rimColor2 = '#FFB23F', id = 'w', gray = 0, noProps = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const O = OUT[outfit];
  const t = frame / fps;

  // pose tween (badan -> lengan -> kepala, overlap) + anticipation kecil
  const pk = activeKF(pose, frame);
  const k0 = frame - pk.at;
  const antic = pk.first ? 0 : k0 >= 0 && k0 < 6 ? Math.sin((k0 / 6) * Math.PI) * 0.1 : 0;
  const sp = (d: number, st: number, dm: number) => (pk.first ? 1 : spring({frame: frame - pk.at - d, fps, config: {damping: dm, stiffness: st, mass: 0.7}}) - antic);
  const A = FPOSES[pk.prev], B = FPOSES[pk.cur];
  const Pb = lerpPose(A, B, sp(0, 170, 15)), Pa = lerpPose(A, B, sp(2, 120, 11)), Ph = lerpPose(A, B, sp(3, 105, 10));
  const P: Pose = {...Pb, armR: Pa.armR, armL: Pa.armL, tray: Pa.tray, talk: Pa.talk, wave: Pa.wave, headTilt: Ph.headTilt, headDY: Ph.headDY, pitch: Ph.pitch, turn: Ph.turn};
  const sit = B.sit > 0.5 ? 1 : A.sit > 0.5 ? 1 - sp(0, 170, 15) : 0;
  const isBack = B.back > 0.5;

  // ekspresi (morph 7 frame)
  const ek = activeKF(expression, frame);
  const et0 = ek.first ? 1 : clamp((frame - ek.at) / 7);
  const et = et0 * et0 * (3 - 2 * et0);
  const Xa = FEXPR[ek.prev], Xb = FEXPR[ek.cur];
  const L = (a: number, b: number) => lerp(a, b, et);
  const X = {
    mouth: morph(Xa.mouth, Xb.mouth, et), browR: {y: L(Xa.browR.y, Xb.browR.y), rot: L(Xa.browR.rot, Xb.browR.rot)},
    browL: {y: L(Xa.browL.y, Xb.browL.y), rot: L(Xa.browL.rot, Xb.browL.rot)},
    eye: {lid: L(Xa.eye.lid, Xb.eye.lid), lidB: L(Xa.eye.lidB, Xb.eye.lidB), iris: L(Xa.eye.iris, Xb.eye.iris), dx: L(Xa.eye.dx, Xb.eye.dx), dy: L(Xa.eye.dy, Xb.eye.dy)},
    tears: L(Xa.tears, Xb.tears), blush: L(Xa.blush, Xb.blush), sweat: L(Xa.sweat, Xb.sweat), pale: L(Xa.pale, Xb.pale), bags: L(Xa.bags, Xb.bags),
  };

  // idle: napas, weight shift, gestur kecil, gemetar
  const breathe = Math.sin(t * 2 * Math.PI * 0.3 + blinkSeed);
  const wsh = Math.sin(t * 2 * Math.PI * 0.21 + blinkSeed) * (1 - sit);
  const micro = (k: number) => Math.sin(t * (1.2 + k * 0.33) + k * 2.3) + 0.4 * Math.sin(t * (2.1 + k * 0.4) + k);
  const trem = P.tremble * Math.sin(t * 34) * 1.2;
  const talkW = P.talk * Math.sin(t * 2 * Math.PI * 1.3);
  const armR = {a: P.armR.a + micro(1) * 2 + trem, b: P.armR.b + micro(2) * 3};
  const wv = P.wave * Math.sin(t * 2 * Math.PI * 2.1);
  const armL = {a: P.armL.a + micro(3) * 2 + talkW * 14 + trem + wv * 14, b: P.armL.b + micro(4) * 3 + talkW * 18 + wv * 22};
  const brc = P.brace * Math.max(0, Math.sin(t * 2 * Math.PI * 0.9)) ** 3; // dorongan dari balik pintu
  const lean = P.lean + wsh * 1.2 + trem * 0.6 + brc * 5;
  const hop = P.tiptoe * Math.abs(Math.sin(t * 2 * Math.PI * 1.05)) * 10;

  // kedip + lirikan
  let blink = 0;
  {
    const per = 2.2 + rand(blinkSeed) * 1.8, kk = Math.floor(t / per), tb = t - kk * per - rand(blinkSeed + kk * 7.1) * 0.6;
    if (tb >= 0 && tb < 0.17) blink = Math.sin((tb / 0.17) * Math.PI);
  }
  let glance = 0;
  {
    const gp = 1.9 + rand(blinkSeed * 3.3) * 0.6, gk = Math.floor(t / gp), gt = t - gk * gp;
    if (rand(gk * 4.1 + blinkSeed) > 0.45 && gt > 0.3 && gt < 1.0) glance = (rand(gk * 7.7 + blinkSeed) > 0.5 ? 1 : -1) * 0.4;
  }

  // geometri
  const shrink = P.shrink;
  const pelvisY = P.pelvisY * (1 - 0.02 * shrink);
  const torsoH = 160 * (1 + breathe * 0.008) * (1 - 0.05 * shrink);
  const pelvis = {x: wsh * 4, y: -pelvisY - hop};
  const armPts = (side: -1 | 1, l: Limb) => {
    const sh = {x: side * 54, y: -torsoH + 26 + shrink * 6};
    const a1 = side * l.a, d1 = dir(a1);
    const el = {x: sh.x + d1[0] * 74, y: sh.y + d1[1] * 74};
    const a2 = a1 + side * l.b, d2 = dir(a2);
    return {sh, el, hand: {x: el.x + d2[0] * 68, y: el.y + d2[1] * 68}, a2};
  };
  const AR = armPts(-1, armR), AL = armPts(1, armL);
  const skin = gray > 0 ? '#9A9AA4' : C.skin, skinS = gray > 0 ? '#80808A' : C.skinShade;

  const arm = (pts: ReturnType<typeof armPts>, side: -1 | 1) => {
    const d = dir(pts.a2);
    return (
      <g>
        <path d={`M ${pts.el.x} ${pts.el.y} L ${pts.hand.x - d[0] * 12} ${pts.hand.y - d[1] * 12}`} stroke={O.gamis}
          strokeWidth={34} strokeLinecap="round" fill="none" />
        <path d={`M ${pts.sh.x} ${pts.sh.y} L ${pts.el.x} ${pts.el.y}`} stroke={O.hijab} strokeWidth={42} strokeLinecap="round" fill="none" />
        <path d={`M ${pts.sh.x} ${pts.sh.y} L ${pts.el.x} ${pts.el.y}`} stroke={O.hijabD} strokeWidth={6} strokeLinecap="round" opacity={0.35}
          transform={`translate(${side * 12},2)`} />
        <circle cx={pts.hand.x - d[0] * 14} cy={pts.hand.y - d[1] * 14} r={17} fill={O.trim} opacity={outfit === 'bride' ? 0.9 : 0.35} />
        <g transform={`translate(${pts.hand.x},${pts.hand.y}) rotate(${-pts.a2})`}>
          <ellipse cx={0} cy={2} rx={14} ry={16} fill={skin} />
          <ellipse cx={-side * 11} cy={-3} rx={6} ry={9} fill={skin} transform={`rotate(${side * 30})`} />
          <path d="M -9 10 Q 0 18 9 10" stroke={skinS} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        </g>
      </g>
    );
  };

  // ---------- kepala (hijab membingkai wajah) ----------
  const tx = P.turn * 12, pDY = P.pitch * 22;
  const eye = (cx: number, side: -1 | 1) => {
    const lid = clamp(Math.max(X.eye.lid, blink));
    const ix = (X.eye.dx + glance + lookAt.x * 0.8) * 6, iy = (X.eye.dy + lookAt.y * 0.8) * 3.6;
    const W2 = 19;
    const almond = `M ${-W2} 0 Q 0 -16 ${W2} 0 Q 0 12 ${-W2} 0 Z`;
    const lidY = lerp(-12, 7, lid), botY = lerp(9, -2, X.eye.lidB);
    const cid = `${id}-fe${side}`;
    return (
      <g transform={`translate(${cx + tx},${pDY})`}>
        <clipPath id={cid}><path d={almond} /></clipPath>
        <path d={almond} fill="#FFFFFF" />
        <g clipPath={`url(#${cid})`}>
          <circle cx={ix} cy={iy + 1} r={10 * X.eye.iris} fill="#4A2B1C" />
          <circle cx={ix} cy={iy + 1} r={5.4 * X.eye.iris} fill="#120A0A" />
          <circle cx={ix + 3.5} cy={iy - 3} r={2.8} fill="#FFFFFF" opacity={0.9} />
          <rect x={-30} y={-30} width={60} height={lidY + 30} fill={skin} />
          <rect x={-30} y={botY} width={60} height={30} fill={skin} />
        </g>
        <path d={`M ${-W2 - 2} ${Math.min(lidY, 0) + 1} Q 0 ${lidY - 4} ${W2 + 2} ${Math.min(lidY, 0) + 1}`} stroke="#241418" strokeWidth={4} fill="none" strokeLinecap="round" />
        {/* bulu mata */}
        <path d={`M ${side * (W2 - 1)} ${Math.min(lidY, 0)} l ${side * 7} -5 M ${side * (W2 - 6)} ${Math.min(lidY, 0) - 3} l ${side * 6} -6`} stroke="#241418" strokeWidth={3} strokeLinecap="round" />
      </g>
    );
  };
  const brow = (cx: number, b: Brow) => (
    <rect x={-17} y={-3.5} width={34} height={7} rx={3.5} fill="#3A2420" transform={`translate(${cx + tx * 1.1},${-30 + b.y + pDY}) rotate(${b.rot})`} />
  );
  const headY = -torsoH - 20 - 92 + P.headDY + Math.sin(t * Math.PI) * 0.8;
  const FACE = 'M 0 -84 C 48 -84 72 -52 72 -8 C 72 40 44 78 0 86 C -44 78 -72 40 -72 -8 C -72 -52 -48 -84 0 -84 Z';
  const HIJAB = 'M 0 -126 C 76 -126 108 -78 106 -12 C 104 40 96 74 84 96 C 60 112 -60 112 -84 96 C -96 74 -104 40 -106 -12 C -108 -78 -76 -126 0 -126 Z';
  const head = isBack ? (
    <g transform={`translate(0,${-torsoH}) rotate(${P.headTilt}) translate(0,${headY + torsoH})`}>
      <path d={HIJAB} fill={O.hijab} />
      <path d="M -60 -90 C -20 -110 30 -110 66 -84" stroke={O.hijabL} strokeWidth={8} fill="none" opacity={0.5} strokeLinecap="round" />
      <path d="M -10 -120 C -20 -60 -18 20 -8 100 M 30 -116 C 40 -50 44 30 38 100" stroke={O.hijabD} strokeWidth={5} fill="none" opacity={0.6} />
    </g>
  ) : (
    <g transform={`translate(0,${-torsoH}) rotate(${P.headTilt + Math.sin(t * 1.6) * 0.8}) translate(0,${headY + torsoH})`}>
      <path d={HIJAB} fill={O.hijab} />
      <g transform={`translate(${tx * 0.3},${pDY * 0.3})`}><path d={FACE} fill={`url(#${id}-fskin)`} /></g>
      {/* lipatan hijab di sekitar wajah */}
      <path d={`M ${-74 + tx * 0.3} -30 C -80 -80 -40 -100 0 -100 C 40 -100 80 -80 ${74 + tx * 0.3} -30`} stroke={O.hijabL} strokeWidth={9} fill="none" opacity={0.55} strokeLinecap="round" />
      <path d={`M ${-76 + tx * 0.3} -10 C -74 50 -40 84 0 92 C 40 84 74 50 ${76 + tx * 0.3} -10`} stroke={O.hijabD} strokeWidth={8} fill="none" opacity={0.55} strokeLinecap="round" />
      {outfit === 'bride' && (
        <g transform="translate(0,-112)">
          {[-56, -28, 0, 28, 56].map((xx, i) => (
            <g key={i} transform={`translate(${xx},${Math.abs(xx) * 0.28})`}>
              {[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx={0} cy={-6} rx={5} ry={7} fill="#FFFFFF" transform={`rotate(${r})`} />)}
              <circle r={4} fill={O.trim} />
            </g>
          ))}
        </g>
      )}
      <ellipse cx={-40 + tx} cy={30 + pDY} rx={14} ry={7} fill="#FF7A8A" opacity={X.blush * 0.35} />
      <ellipse cx={40 + tx} cy={30 + pDY} rx={14} ry={7} fill="#FF7A8A" opacity={X.blush * 0.35} />
      <path d={FACE} fill="#B9C4E0" opacity={X.pale * 0.25} transform={`translate(${tx * 0.3},${pDY * 0.3})`} />
      {X.bags > 0.05 && [-30, 30].map((cx) => <path key={cx} d={`M ${cx + tx - 16} ${14 + pDY} Q ${cx + tx} ${24 + pDY} ${cx + tx + 16} ${14 + pDY}`} stroke="#9A7A8E" strokeWidth={4} fill="none" strokeLinecap="round" opacity={X.bags * 0.7} />)}
      {eye(-30, -1)}
      {eye(30, 1)}
      {brow(-30, X.browR)}
      {brow(30, X.browL)}
      <path d={`M ${3 + tx * 1.2} ${8 + pDY} Q ${9 + tx * 1.2} ${22 + pDY} ${tx * 1.2} ${26 + pDY}`} stroke={skinS} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <g transform={`translate(${tx * 1.1},${50 + pDY * 0.9})`}><path d={X.mouth} fill="#9A3A4E" /></g>
      <path d="M 60 -34 q 7 12 0 17 q -7 -5 0 -17 Z" fill={C.mint} opacity={X.sweat * 0.9} />
      {X.tears > 0.05 && [-1, 1].map((sd) => {
        const ph = (t * 1.3 + (sd > 0 ? 0.5 : 0)) % 1;
        return (
          <g key={sd} opacity={X.tears}>
            <path d={`M ${sd * 30 + tx - 6} ${10 + pDY} Q ${sd * 35 + tx} ${36 + pDY} ${sd * 32 + tx} ${62 + pDY}`} stroke={C.mint} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.85} />
            <circle cx={sd * 33 + tx} cy={18 + pDY + ph * 60} r={5} fill={C.mint} opacity={1 - ph} />
          </g>
        );
      })}
    </g>
  );

  // ---------- badan ----------
  const hemY = -8, hemW = 112 + P.step * 8;
  const sway = Math.sin(t * 2 * Math.PI * 0.21 + blinkSeed) * 3;
  const standingBody = (
    <g>
      {/* sepatu */}
      {[-1, 1].map((sd) => (
        <ellipse key={sd} cx={sd * 30 - (sd < 0 ? P.step * 26 : 0)} cy={-2} rx={30} ry={13} fill={O.shoe} />
      ))}
      {/* gamis panjang (A-line) */}
      <path d={`M -58 ${-torsoH - pelvisY + 22} Q -76 ${-pelvisY * 0.6} ${-hemW + sway} ${hemY} Q 0 ${hemY + 14} ${hemW + sway} ${hemY} Q 76 ${-pelvisY * 0.6} 58 ${-torsoH - pelvisY + 22} Z`}
        fill={`url(#${id}-gamis)`} />
      {[-40, 0, 40].map((xx) => <path key={xx} d={`M ${xx * 0.5} ${-pelvisY + 10} Q ${xx * 0.9 + sway * 0.5} ${-pelvisY * 0.5} ${xx * 1.6 + sway} ${hemY + 4}`}
        stroke={O.gamisD} strokeWidth={4} fill="none" opacity={0.55} />)}
      {outfit === 'bride' && <path d={`M ${-hemW + sway} ${hemY - 8} Q 0 ${hemY + 6} ${hemW + sway} ${hemY - 8}`} stroke={O.trim} strokeWidth={6} fill="none" />}
      {outfit === 'kebaya' && (
        <g>
          <path d={`M ${-86 + sway * 0.5} ${-pelvisY * 0.55} Q 0 ${-pelvisY * 0.5} ${86 + sway * 0.5} ${-pelvisY * 0.55} L ${hemW + sway} ${hemY} Q 0 ${hemY + 14} ${-hemW + sway} ${hemY} Z`} fill="#8A5A3A" />
          {Array.from({length: 7}).map((_, i) => <path key={i} d={`M ${-80 + i * 27 + sway * 0.7} ${-pelvisY * 0.4} l 8 14 l -8 14 l -8 -14 Z`} fill="#D9B46A" opacity={0.85} />)}
          {Array.from({length: 8}).map((_, i) => <path key={`b${i}`} d={`M ${-100 + i * 28 + sway} ${-50} l 6 10 l -6 10 l -6 -10 Z`} fill="#E8C76A" opacity={0.7} />)}
        </g>
      )}
    </g>
  );
  // duduk memeluk lutut (depan atau membelakangi)
  const sittingBody = (
    <g>
      <path d={`M -70 ${-pelvisY - torsoH + 30} Q -100 ${-pelvisY + 10} -110 -6 L 110 -6 Q 100 ${-pelvisY + 10} 70 ${-pelvisY - torsoH + 30} Z`} fill={`url(#${id}-gamis)`} />
      {!isBack && <ellipse cx={0} cy={-pelvisY + 4} rx={78} ry={64} fill={O.gamisD} />}
      {!isBack && <ellipse cx={0} cy={-pelvisY - 2} rx={70} ry={54} fill={O.gamis} />}
      {[-1, 1].map((sd) => <ellipse key={sd} cx={sd * 34} cy={-4} rx={26} ry={11} fill={O.shoe} />)}
    </g>
  );

  const torsoG = (
    <g transform={`translate(${pelvis.x},${pelvis.y}) rotate(${lean})`}>
      {/* leher + hijab menjuntai menutup dada (khimar) */}
      {/* khimar: kain hijab menjuntai melengkung menutup bahu & dada */}
      <path d={`M -88 ${-torsoH - 34} C -118 ${-torsoH + 30} -116 ${-torsoH + 96} -70 ${-torsoH + 128} Q 0 ${-torsoH + 168} 70 ${-torsoH + 128} C 116 ${-torsoH + 96} 118 ${-torsoH + 30} 88 ${-torsoH - 34} Z`} fill={O.hijab} />
      <path d={`M -62 ${-torsoH + 112} Q 0 ${-torsoH + 150} 62 ${-torsoH + 112}`} stroke={O.hijabD} strokeWidth={5} fill="none" opacity={0.45} />
      <path d={`M -96 ${-torsoH + 10} C -104 ${-torsoH + 60} -96 ${-torsoH + 96} -72 ${-torsoH + 118}`} stroke={O.hijabL} strokeWidth={6} fill="none" opacity={0.4} strokeLinecap="round" />
      {outfit === 'kebaya' && (
        <g>
          {Array.from({length: 14}).map((_, i) => <circle key={i} cx={-64 + (i % 7) * 21} cy={-torsoH + 112 + Math.floor(i / 7) * 16 + (i % 2) * 5} r={4} fill="none" stroke="#E2D3B0" strokeWidth={2} />)}
          <g transform={`translate(0,${-torsoH + 96})`}><circle r={9} fill="#E8C76A" /><circle r={4} fill="#FFFFFF" /></g>
        </g>
      )}
      {head}
      {sit > 0.5 && !isBack && (
        <g>
          {/* lengan memeluk lutut */}
          <path d={`M -70 ${-torsoH + 60} Q -96 ${-torsoH + 150} -20 ${-torsoH + 190 - (pelvisY < 100 ? 0 : 0)}`} stroke={O.gamis} strokeWidth={34} fill="none" strokeLinecap="round" />
          <path d={`M 70 ${-torsoH + 60} Q 96 ${-torsoH + 150} 20 ${-torsoH + 190}`} stroke={O.gamis} strokeWidth={34} fill="none" strokeLinecap="round" />
          <ellipse cx={-14} cy={-torsoH + 190} rx={15} ry={13} fill={skin} />
          <ellipse cx={14} cy={-torsoH + 192} rx={15} ry={13} fill={skin} />
        </g>
      )}
      {sit > 0.5 && isBack && (
        <g>
          <path d={`M -90 ${-torsoH + 70} Q -110 ${-torsoH + 130} -76 ${-torsoH + 170}`} stroke={O.gamis} strokeWidth={30} fill="none" strokeLinecap="round" />
          <path d={`M 90 ${-torsoH + 70} Q 110 ${-torsoH + 130} 76 ${-torsoH + 170}`} stroke={O.gamis} strokeWidth={30} fill="none" strokeLinecap="round" />
        </g>
      )}
      {!isBack && sit < 0.5 && arm(AR, -1)}
      {!isBack && sit < 0.5 && arm(AL, 1)}
      {nkFemaleFront({cur: pk.cur as string, t: frame, AR, AL, torsoH, headY, pelvisY, noProps})}
      {P.tray > 0.5 && (
        <g transform={`translate(${(AR.hand.x + AL.hand.x) / 2},${(AR.hand.y + AL.hand.y) / 2 - 14})`}>
          <rect x={-74} y={-6} width={148} height={12} rx={6} fill="#B07A4E" />
          <path d="M -20 -6 L -16 -40 L 16 -40 L 20 -6 Z" fill="#FFF4E0" />
          <path d="M 18 -32 q 16 4 2 18" stroke="#FFF4E0" strokeWidth={5} fill="none" />
          {[0, 1].map((i) => {
            const ph = (t * 0.7 + i * 0.5) % 1;
            return <path key={i} d={`M ${-6 + i * 10} ${-46 - ph * 40} q 8 -10 0 -20`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={Math.sin(ph * Math.PI) * 0.6} strokeLinecap="round" />;
          })}
        </g>
      )}
    </g>
  );

  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={1}>
      <defs>
        <linearGradient id={`${id}-fskin`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={skin} /><stop offset="0.65" stopColor={skin} /><stop offset="1" stopColor={skinS} />
        </linearGradient>
        <linearGradient id={`${id}-gamis`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={O.gamisL} /><stop offset="0.45" stopColor={O.gamis} /><stop offset="1" stopColor={O.gamisD} />
        </linearGradient>
        <filter id={`${id}-rim`} x="-35%" y="-25%" width="170%" height="150%" colorInterpolationFilters="sRGB">
          <feOffset in="SourceAlpha" dx={5} dy={4} result="o1" />
          <feComposite in="SourceAlpha" in2="o1" operator="out" result="e1" />
          <feGaussianBlur in="e1" stdDeviation={1.5} result="e1b" />
          <feFlood floodColor={rimColor} />
          <feComposite in2="e1b" operator="in" result="r1" />
          <feOffset in="SourceAlpha" dx={-5} dy={2} result="o2" />
          <feComposite in="SourceAlpha" in2="o2" operator="out" result="e2" />
          <feGaussianBlur in="e2" stdDeviation={1.5} result="e2b" />
          <feFlood floodColor={rimColor2} />
          <feComposite in2="e2b" operator="in" result="r2" />
          <feMerge result="rims"><feMergeNode in="r1" /><feMergeNode in="r2" /></feMerge>
          <feGaussianBlur in="rims" stdDeviation={6} result="rimGlow" />
          <feMorphology in="SourceAlpha" operator="dilate" radius={4} result="dil" />
          <feGaussianBlur in="dil" stdDeviation={16} result="dilB" />
          <feFlood floodColor={rimColor2} floodOpacity={0.35} />
          <feComposite in2="dilB" operator="in" result="back" />
          <feMerge><feMergeNode in="back" /><feMergeNode in="rimGlow" /><feMergeNode in="SourceGraphic" /><feMergeNode in="rims" /></feMerge>
        </filter>
        {gray > 0 && <filter id={`${id}-gray`}><feColorMatrix type="saturate" values={`${1 - gray}`} /></filter>}
      </defs>
      <ellipse cx={P.roll < -40 ? -150 : 0} cy={6} rx={sit > 0.5 ? 130 : 100 + Math.abs(P.roll) * 2.2} ry={14} fill="#000" opacity={0.28} />
      <g filter={rim ? `url(#${id}-rim)` : gray > 0 ? `url(#${id}-gray)` : undefined}>
        <g transform={`translate(0,${P.liftY}) rotate(${P.roll},0,${-pelvisY})`}>
          {sit > 0.5 ? sittingBody : standingBody}
          {torsoG}
          {nkFemaleBody({cur: pk.cur as string, t: frame, AR, AL, torsoH, headY, pelvisY, noProps})}
        </g>
      </g>
    </g>
  );
};
