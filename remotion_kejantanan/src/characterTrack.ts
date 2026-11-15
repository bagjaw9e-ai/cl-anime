// Keyframe karakter per beat: posisi di world, pose, ekspresi, lookAt, lip-sync, rim light.
// Prinsip animasi: anticipation (crouch_anticip / toss_windup sebelum gerak besar), follow-through & overlap
// (di rig: badan -> lengan +2f -> kepala +3f, rambut telat), secondary motion (napas, weight shift, kedip,
// mikro-gerak tangan selalu aktif di rig). Tidak ada momen diam total > 1 detik.
import {Expression, PoseName} from './components/Character';
import {beatF} from './timeline';

export type Look = {x: number; y: number};
export type CK = {f: number; pose?: PoseName; expr?: Expression; look?: Look; talk?: boolean; rim?: boolean};

const B = (id: number, off = 0) => beatF(id) + off;
const L = {cam: {x: 0, y: 0}, up: {x: 0, y: -1}, upL: {x: -0.7, y: -0.8}, upR: {x: 0.7, y: -0.8}, left: {x: -1, y: -0.1},
  right: {x: 1, y: -0.1}, down: {x: 0, y: 1}, downL: {x: -0.6, y: 0.6}, downR: {x: 0.6, y: 0.7}};

export const KEYS: CK[] = [
  // ---------- A ----------
  {f: 0, pose: 'walking', expr: 'neutral', look: L.cam, talk: true},
  {f: B(1, 22), pose: 'crouch_anticip'},
  {f: B(1, 27), pose: 'arms_crossed', expr: 'smirk', look: L.up},
  {f: B(1, 34), expr: 'determined', look: L.cam},
  {f: B(2, -3), pose: 'crouch_anticip'},
  {f: B(2, 2), pose: 'stop_hand', expr: 'shocked', look: L.left},
  {f: B(2, 16), look: L.up},
  {f: B(3), pose: 'crouch_anticip', expr: 'worried', look: L.right},
  {f: B(3, 14), pose: 'slouch', expr: 'sad'},
  {f: B(4, -3), pose: 'crouch_anticip'},
  {f: B(4, 2), pose: 'shrug', expr: 'smirk', look: L.left},
  {f: B(4, 26), look: L.cam},
  {f: B(5), pose: 'whistling_unaware', expr: 'neutral', look: L.upR, talk: false},
  {f: B(5, 30), look: L.upL},
  // ---------- B ----------
  {f: B(6), pose: 'hand_chin', expr: 'thinking', look: L.up, talk: true},
  {f: B(6, 30), look: L.upR},
  {f: B(7), pose: 'counting', expr: 'curious', look: L.up},
  {f: B(7, 30), look: L.cam},
  {f: B(7, 52), expr: 'thinking', look: L.upL}, // mikro-beat
  {f: B(7, 72), expr: 'curious', look: L.up},
  {f: B(8), pose: 'pointing_up', expr: 'curious', look: L.upL},
  {f: B(9), pose: 'standing_relaxed', expr: 'happy', look: L.up},
  {f: B(9, 22), look: L.cam},
  {f: B(10), expr: 'neutral', look: L.upR},
  {f: B(10, 6), pose: 'slouch'}, // angguk
  {f: B(10, 14), pose: 'standing_relaxed'},
  {f: B(10, 22), pose: 'slouch'},
  {f: B(10, 30), pose: 'standing_relaxed', look: L.cam},
  {f: B(11), pose: 'crouch_anticip', expr: 'worried', look: L.right},
  {f: B(11, 8), pose: 'standing_relaxed'},
  {f: B(11, 34), look: L.cam},
  {f: B(12, -3), pose: 'crouch_anticip'},
  {f: B(12, 3), pose: 'stop_hand', expr: 'shocked', look: L.right},
  {f: B(13, -4), pose: 'crouch_anticip'},
  {f: B(13, 1), pose: 'holding_phone', expr: 'hooked', look: L.down, talk: false},
  // ---------- C ----------
  {f: B(14), pose: 'arms_up', expr: 'hooked', look: L.up},
  {f: B(14, 30), pose: 'holding_phone', look: L.down},
  {f: B(15, -3), pose: 'crouch_anticip', expr: 'shocked', look: L.up, talk: true},
  {f: B(15, 4), pose: 'pulled_by_collar'},
  {f: B(16), pose: 'tapping_phone', expr: 'hooked', look: L.down, talk: false},
  {f: B(17), pose: 'standing_relaxed', expr: 'curious', look: L.up, talk: true},
  {f: B(17, 44), expr: 'dazed', look: L.upR}, // mikro-beat
  {f: B(18), pose: 'holding_phone', expr: 'dazed', look: L.right, talk: false},
  {f: B(19), pose: 'tapping_phone', expr: 'hooked', look: L.down},
  {f: B(20, -3), pose: 'crouch_anticip'},
  {f: B(20, 2), pose: 'stop_hand', expr: 'shocked', look: L.upL, talk: true},
  {f: B(20, 20), look: L.upR},
  {f: B(21), pose: 'overwhelmed', expr: 'panicked', look: L.up},
  {f: B(21, 22), look: L.left},
  // ---------- D ----------
  {f: B(22), pose: 'standing_relaxed', expr: 'dazed', look: L.up},
  {f: B(22, 40), look: L.cam, expr: 'bored'}, // mikro-beat
  {f: B(23), pose: 'slouch', expr: 'bored', look: L.left},
  {f: B(24), expr: 'sad', look: L.right},
  {f: B(24, 42), look: L.downR}, // mikro-beat
  {f: B(25), pose: 'standing_relaxed', expr: 'curious', look: L.upR},
  {f: B(26), expr: 'bored', look: L.cam},
  {f: B(26, 14), pose: 'yawning', talk: false},
  {f: B(26, 52), pose: 'slouch', talk: true},
  {f: B(27), pose: 'walking', expr: 'worried', look: L.left}, // mondar-mandir (lihat CHAR_X)
  {f: B(27, 44), look: L.right},
  {f: B(27, 80), pose: 'standing_relaxed'},
  {f: B(28), expr: 'worried', look: L.up},
  {f: B(29, -3), pose: 'crouch_anticip'},
  {f: B(29, 1), pose: 'shaking_head', expr: 'hypnotized', look: L.cam, talk: false},
  {f: B(30), pose: 'running_treadmill', expr: 'worried', look: L.right, talk: true},
  {f: B(30, 40), expr: 'panicked'}, // mikro-beat
  // ---------- E ----------
  {f: B(31, -2), pose: 'crouch_anticip', expr: 'bored', look: L.cam},
  {f: B(31, 8), pose: 'sitting_floor_bored'},
  {f: B(32), look: L.left},
  {f: B(32, 14), look: L.right},
  {f: B(33), expr: 'thinking', look: L.up, talk: false},
  {f: B(33, 40), expr: 'dazed', look: L.upR}, // mikro-beat: melamun ngikutin bubble
  {f: B(34, -8), pose: 'crouch_anticip', expr: 'neutral', look: L.cam},
  {f: B(34), pose: 'hand_autopilot', expr: 'shocked', look: L.left, talk: true},
  {f: B(34, 34), expr: 'worried'},
  {f: B(35), pose: 'shaking_head', expr: 'worried', look: L.left},
  {f: B(35, 32), look: L.cam},
  {f: B(36), pose: 'slouch', expr: 'guilty', look: L.downL},
  {f: B(37), pose: 'hand_chin', expr: 'worried', look: L.right},
  {f: B(37, 52), look: L.cam, expr: 'guilty'}, // mikro-beat
  {f: B(37, 80), look: L.right, expr: 'worried'},
  {f: B(38, -3), pose: 'crouch_anticip'},
  {f: B(38, 2), pose: 'overwhelmed', expr: 'panicked', look: L.up},
  {f: B(39), pose: 'head_in_hands', expr: 'sad', look: L.down, talk: false},
  // ---------- F ----------
  {f: B(40, -4), pose: 'crouch_anticip', expr: 'determined', look: L.cam},
  {f: B(40, 6), pose: 'stand_tall', talk: true},
  {f: B(41), pose: 'toss_windup', expr: 'determined', look: L.upR},
  {f: B(41, 12), pose: 'tossing_phone'},
  {f: B(41, 30), pose: 'standing_relaxed', expr: 'smirk', look: L.cam},
  {f: B(42), pose: 'fixing_collar', expr: 'smirk', look: L.left},
  {f: B(42, 22), look: L.cam},
  {f: B(43), pose: 'hand_chin', expr: 'smirk', look: L.up},
  {f: B(44), pose: 'pointing_up', expr: 'happy', look: L.up, rim: true},
  {f: B(44, 34), look: L.cam},
  {f: B(45), pose: 'arms_crossed', expr: 'happy', look: L.right, rim: true},
  {f: B(45, 40), look: L.cam, expr: 'determined'}, // mikro-beat
  {f: B(45, 75), expr: 'happy'},
  {f: B(46), talk: false},
];

// Posisi X karakter di world: [frame, x]; di antara dua keyframe di-ease (ease-in-out).
export const CHAR_X: Array<[number, number]> = [
  [0, -420], [B(1, 24), 0], // masuk jalan dari kiri
  [B(27), 0], [B(27, 40), -170], [B(27, 78), 20], [B(28), 0], // mondar-mandir gelisah
];

// pose/ekspresi dalam format KF rig: [[frame, value], ...]
export const POSE_KF = KEYS.filter((k) => k.pose).map((k) => [k.f, k.pose!] as [number, PoseName]);
export const EXPR_KF = KEYS.filter((k) => k.expr).map((k) => [k.f, k.expr!] as [number, Expression]);

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const last = <T,>(f: number, pick: (k: CK) => T | undefined, def: T) => {
  let v = def, at = -1e9, prev = def;
  for (const k of KEYS) {
    const p = pick(k);
    if (p !== undefined && k.f <= f) { prev = v; v = p; at = k.f; }
  }
  return {v, at, prev};
};

export const lookAt = (f: number): Look => {
  const {v, at, prev} = last(f, (k) => k.look, L.cam);
  const t = ease(Math.min(1, Math.max(0, (f - at) / 7)));
  return {x: prev.x + (v.x - prev.x) * t, y: prev.y + (v.y - prev.y) * t};
};
export const talking = (f: number) => last(f, (k) => k.talk, true).v;
export const rimOn = (f: number) => last(f, (k) => k.rim, false).v;

export const charX = (f: number) => {
  for (let i = 0; i < CHAR_X.length - 1; i++) {
    const [f0, x0] = CHAR_X[i], [f1, x1] = CHAR_X[i + 1];
    if (f >= f0 && f <= f1) return x0 + (x1 - x0) * ease((f - f0) / Math.max(1, f1 - f0));
  }
  return f < CHAR_X[0][0] ? CHAR_X[0][1] : CHAR_X[CHAR_X.length - 1][1];
};
// arah hadap saat jalan (1 = kanan)
export const CHAR_SCALE = 1.25;
