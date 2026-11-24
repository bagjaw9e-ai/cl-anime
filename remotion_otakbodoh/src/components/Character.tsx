import React, {useContext, useMemo} from 'react';
import {interpolate as fInterp} from 'flubber';
import {spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useAudioData, visualizeAudio} from '@remotion/media-utils';
import {C, clamp, lerp, rand} from '../theme';
import {OffsetContext} from '../SceneContext';
import {PhoneBody} from './Phone';
import {ChainBand} from './Chain';

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
  | 'angry' | 'thinking' | 'determined' | 'dazed' | 'crying'
  | 'bored' | 'curious' | 'hooked' | 'panicked' | 'hypnotized'
  | 'sweaty_stressed' | 'jittery' | 'lonely' | 'tempted' | 'proud' | 'laughing' | 'lethargic' | 'restless'
  | 'focused' | 'relieved' | 'sleepy' | 'confused_morning' | 'confident' | 'nervous' | 'flat'
  // video 3 fase
  | 'smug' | 'lazy' | 'empty' | 'obsessive' | 'irritated' | 'smirk_denial' | 'cold' | 'oblivious' | 'confused'
  // video umur25
  | 'excited' | 'explosive' | 'daydreaming' | 'ashamed' | 'lost' | 'tired' | 'unfocused' | 'empty_stare' | 'avoiding_eye_contact'
  // video otak bodoh
  | 'struggling' | 'blank' | 'hopeless'
  // thumbnail
  | 'bulging';

export type PoseName =
  | 'standing_relaxed' | 'arms_crossed' | 'holding_phone' | 'head_in_hands'
  | 'sitting_desk' | 'pointing_up' | 'shaking_head' | 'walking'
  | 'running' | 'hand_chin' | 'stop_hand' | 'reaching' | 'arms_up' | 'lying'
  | 'puppet' | 'puppet2' | 'reins'
  | 'shrug' | 'whistling_unaware' | 'tapping_phone' | 'pulled_by_collar' | 'running_treadmill'
  | 'sitting_floor_bored' | 'yawning' | 'hand_autopilot' | 'toss_windup' | 'tossing_phone' | 'fixing_collar'
  | 'counting' | 'overwhelmed' | 'slouch' | 'crouch_anticip' | 'stand_tall'
  | 'carrying_weight' | 'lying_on_bed_phone' | 'sitting_bed_bored' | 'grabbing_phone' | 'shaking_cold' | 'hero_pose_cape'
  | 'cape_falls' | 'slumped' | 'pacing' | 'pushing_phone_away' | 'blocking_hand' | 'reading_focused' | 'playing_guitar'
  | 'workout' | 'holding_scissors' | 'steering_wheel' | 'sleeping' | 'waking_up' | 'nervous_stand'
  // video promo
  | 'struggling_chains' | 'breaking_free' | 'thinking' | 'opening_chest' | 'lifting_lid' | 'pointing_side'
  // video 3 fase
  | 'groom_standing' | 'holding_phone_smug' | 'yawning_at_desk' | 'sitting_blank_on_prayer_mat' | 'climbing_stairs'
  | 'slamming_desk' | 'rolling_dice' | 'sunglasses_relax' | 'stiff_while_hugged' | 'comparing_phone' | 'looming' | 'sitting_relaxed_phone'
  | 'swiping_phone'
  // video umur25
  | 'blowing_candle' | 'holding_phone_hidden' | 'sitting_dinner_table' | 'slamming_table' | 'pointing_angry' | 'standing_tense'
  | 'walking_street' | 'sitting_bus_stop' | 'being_dragged' | 'sitting_meeting' | 'scratching_head' | 'looking_down'
  // video otak bodoh
  | 'chained_to_phone' | 'standing_still_lookup' | 'sitting_desk_study' | 'running_hamster_wheel' | 'puppet_pulled' | 'fist_clenched'
  | 'sitting_meeting_blank' | 'procrastinating_slumped' | 'walking_treadmill' | 'head_down'
  // thumbnail
  | 'holding_text_edges';

type Limb = {a: number; b: number}; // a = sendi pangkal, b = sendi tengah (relatif)
type Pose = {
  pelvisY: number; lean: number; torsoSY: number; headTilt: number; headDY: number;
  pitch: number; turn: number; armR: Limb; armL: Limb; legR: Limb; legL: Limb;
  thighS: number; shinS: number; faceGlow: number; walk: number; run: number;
  shake: number; handFront: number; pointL: number; holdPhoneL: number;
  shoulder: number; whistle: number; tap: number; tremble: number; yawn: number; jitter: number;
  cape: number; capeFall: number; sleep: number; strum: number; curl: number; snip: number; struggle: number;
  dice: number; shades: number; behind: number; puff: number;
};

const P0: Pose = {
  pelvisY: 228, lean: 0, torsoSY: 1, headTilt: 0, headDY: 0, pitch: 0, turn: 0,
  armR: {a: 9, b: -6}, armL: {a: 9, b: -6}, legR: {a: 4, b: -3}, legL: {a: 4, b: -3},
  thighS: 1, shinS: 1, faceGlow: 0, walk: 0, run: 0, shake: 0, handFront: 1,
  pointL: 0, holdPhoneL: 0, shoulder: 0, whistle: 0, tap: 0, tremble: 0, yawn: 0, jitter: 0,
  cape: 0, capeFall: 0, sleep: 0, strum: 0, curl: 0, snip: 0, struggle: 0, dice: 0, shades: 0, behind: 0, puff: 0,
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
  puppet: mk({shake: 1, armR: {a: 128, b: 22}, armL: {a: 118, b: 30}, pitch: 0.15, headTilt: 4}),
  puppet2: mk({shake: 1, armR: {a: 112, b: 30}, armL: {a: 134, b: 18}, pitch: 0.15, headTilt: -4}),
  reins: mk({armR: {a: 34, b: -70}, armL: {a: 44, b: -48}, lean: -5, headTilt: -4}),
  // ---- pose baru ----
  shrug: mk({armR: {a: 26, b: 78}, armL: {a: 26, b: 78}, shoulder: 1, headTilt: 7, headDY: 4}),
  whistling_unaware: mk({armR: {a: 5, b: -18}, armL: {a: 5, b: -18}, headTilt: -9, turn: 0.45, whistle: 1, lean: -2}),
  tapping_phone: mk({armL: {a: 18, b: -126}, armR: {a: 22, b: -112}, holdPhoneL: 1, faceGlow: 0.8, pitch: 0.4, headTilt: 4, headDY: 6, tap: 1}),
  pulled_by_collar: mk({lean: 13, headTilt: -12, armR: {a: 62, b: 34}, armL: {a: 30, b: 40}, legR: {a: 14, b: -18}, legL: {a: -6, b: 10}, pelvisY: 236, jitter: 1}),
  running_treadmill: mk({run: 1, lean: 7, headTilt: 3, pelvisY: 214}),
  sitting_floor_bored: mk({pelvisY: 44, torsoSY: 0.93, legR: {a: 96, b: -150}, legL: {a: 96, b: -150}, thighS: 0.62, shinS: 0.9,
    armL: {a: 32, b: -150}, armR: {a: 34, b: -40}, pitch: 0.18, headTilt: 9}),
  yawning: mk({armR: {a: 152, b: 34}, armL: {a: 152, b: 34}, yawn: 1, headTilt: -6, lean: -2}),
  hand_autopilot: mk({armR: {a: 78, b: -8}, armL: {a: 36, b: -128}, lean: 7, headTilt: 8, tremble: 1, turn: -0.4}),
  toss_windup: mk({armL: {a: 150, b: 44}, armR: {a: 30, b: -20}, lean: -7, holdPhoneL: 1, headTilt: 5, pelvisY: 220}),
  tossing_phone: mk({armL: {a: 112, b: -14}, armR: {a: 22, b: 10}, lean: 7, headTilt: -8}),
  fixing_collar: mk({armR: {a: 40, b: -158}, armL: {a: 40, b: -158}, headTilt: -5, shoulder: 0.3}),
  counting: mk({armL: {a: 52, b: -92}, armR: {a: 10, b: -8}, pointL: 1, headTilt: -5}),
  overwhelmed: mk({armR: {a: 118, b: -104}, armL: {a: 118, b: -104}, pelvisY: 210, lean: -3, headDY: 8, jitter: 0.6}),
  slouch: mk({torsoSY: 0.94, pitch: 0.45, headDY: 12, headTilt: 5, armR: {a: 3, b: -2}, armL: {a: 3, b: -2}, pelvisY: 222, lean: 3}),
  crouch_anticip: mk({pelvisY: 205, torsoSY: 0.96, armR: {a: 18, b: -30}, armL: {a: 18, b: -30}, headDY: 6, pitch: 0.15}),
  stand_tall: mk({pelvisY: 232, armR: {a: 12, b: -4}, armL: {a: 12, b: -4}, headTilt: -3, shoulder: -0.4}),
  // ---- pose video 30 hari ----
  carrying_weight: mk({pelvisY: 206, torsoSY: 0.9, armR: {a: 152, b: 26}, armL: {a: 152, b: 26}, legR: {a: 12, b: -22}, legL: {a: 12, b: -22},
    headDY: 16, pitch: 0.35, headTilt: 4, jitter: 0.5}),
  lying_on_bed_phone: mk({armL: {a: 150, b: -30}, armR: {a: 30, b: -20}, holdPhoneL: 1, faceGlow: 0.9, legR: {a: 2, b: 0}, legL: {a: 2, b: 0}}),
  sitting_bed_bored: mk({pelvisY: 150, legR: {a: 26, b: -30}, legL: {a: 26, b: -30}, thighS: 0.45, torsoSY: 0.95, lean: 3,
    armR: {a: 20, b: -40}, armL: {a: 30, b: -150}, pitch: 0.25, headTilt: 10, headDY: 6}),
  grabbing_phone: mk({armL: {a: 34, b: -112}, armR: {a: 10, b: -8}, holdPhoneL: 1, faceGlow: 0.8, pitch: 0.3, headTilt: 5, lean: 3}),
  shaking_cold: mk({armR: {a: 26, b: -132}, armL: {a: 26, b: -128}, shoulder: 0.8, pelvisY: 220, legR: {a: -3, b: 4}, legL: {a: -3, b: 4},
    jitter: 1.4, headDY: 8, pitch: 0.2}),
  hero_pose_cape: mk({armR: {a: 42, b: -112}, armL: {a: 42, b: -112}, lean: 0, headTilt: -7, legR: {a: 10, b: -4}, legL: {a: 10, b: -4},
    cape: 1, shoulder: -0.3}),
  cape_falls: mk({armR: {a: 22, b: 60}, armL: {a: 22, b: 60}, shoulder: 0.8, headTilt: 6, cape: 1, capeFall: 1}),
  slumped: mk({pelvisY: 140, legR: {a: 30, b: -24}, legL: {a: 34, b: -20}, thighS: 0.45, torsoSY: 0.9, lean: 12,
    armR: {a: 8, b: 0}, armL: {a: 14, b: 4}, pitch: 0.6, headTilt: 14, headDY: 14}),
  pacing: mk({walk: 1, armR: {a: 30, b: -130}, armL: {a: 10, b: -14}, headTilt: 4}),
  pushing_phone_away: mk({armL: {a: 74, b: 22}, armR: {a: 10, b: -8}, lean: -6, headTilt: -8, turn: -0.4}),
  blocking_hand: mk({armR: {a: 76, b: 58}, armL: {a: 12, b: -10}, lean: 5, headTilt: 8, turn: 0.45}),
  reading_focused: mk({armR: {a: 24, b: -118}, armL: {a: 24, b: -118}, pitch: 0.38, headDY: 6, headTilt: 3}),
  playing_guitar: mk({armL: {a: 30, b: -104}, armR: {a: 72, b: -34}, headTilt: 8, strum: 1, lean: 2}),
  workout: mk({armR: {a: 14, b: -150}, armL: {a: 12, b: -10}, curl: 1, pelvisY: 222, legR: {a: 12, b: -6}, legL: {a: 12, b: -6}}),
  holding_scissors: mk({armL: {a: 64, b: -58}, armR: {a: 10, b: -8}, headTilt: 4, snip: 1}),
  steering_wheel: mk({armR: {a: 30, b: -92}, armL: {a: 30, b: -92}, pelvisY: 150, legR: {a: 24, b: -30}, legL: {a: 24, b: -30}, thighS: 0.45}),
  sleeping: mk({armR: {a: 6, b: -20}, armL: {a: 30, b: -140}, sleep: 1, legR: {a: 4, b: -6}, legL: {a: 2, b: 0}}),
  waking_up: mk({armR: {a: 150, b: 30}, armL: {a: 150, b: 30}, headTilt: -5, lean: -2}),
  nervous_stand: mk({armR: {a: 18, b: -60}, armL: {a: 18, b: -60}, shoulder: 0.4, jitter: 0.4, headTilt: 3}),
  lying: mk({armR: {a: 6, b: 0}, armL: {a: 6, b: 0}, legR: {a: 2, b: 0}, legL: {a: 2, b: 0}}),
  // ---- pose video promo ----
  // meronta di dalam lilitan rantai: lengan terkunci di badan, badan menggeliat kiri-kanan
  struggling_chains: mk({armR: {a: 14, b: 12}, armL: {a: 14, b: 12}, pelvisY: 220, shoulder: 0.5, headTilt: -6, struggle: 1, jitter: 0.5,
    legR: {a: 9, b: -6}, legL: {a: 9, b: -6}}),
  // lepas: kedua lengan terentang ke atas-samping, dada membusung
  breaking_free: mk({armR: {a: 132, b: 18}, armL: {a: 132, b: 18}, pelvisY: 232, headTilt: -8, shoulder: -0.4,
    legR: {a: 12, b: -6}, legL: {a: 12, b: -6}}),
  // berpikir: tangan di dagu, tangan satunya menyangga siku
  thinking: mk({armL: {a: -58, b: -140}, armR: {a: 14, b: -112}, headTilt: -7, pitch: 0.08, headDY: 6}),
  // membuka peti (peti di depan badan): badan condong, kedua tangan memegang tepi tutup
  opening_chest: mk({armR: {a: 50, b: -28}, armL: {a: 50, b: -28}, pelvisY: 210, torsoSY: 0.97, lean: 0, pitch: 0.3, headDY: 6,
    legR: {a: 10, b: -8}, legL: {a: 10, b: -8}}),
  // mengangkat tutup peti ke atas
  lifting_lid: mk({armR: {a: 58, b: 52}, armL: {a: 58, b: 52}, pelvisY: 226, pitch: 0.1, headTilt: -3, shoulder: 0.2,
    legR: {a: 10, b: -6}, legL: {a: 10, b: -6}}),
  // menunjuk ke samping (kanan layar)
  pointing_side: mk({armL: {a: 86, b: 6}, armR: {a: 10, b: -12}, pointL: 1, headTilt: 4, turn: 0.35, lean: -2}),
  // ---- pose video 3 fase ----
  groom_standing: mk({armR: {a: 16, b: -58}, armL: {a: 16, b: -62}, headTilt: -2, shoulder: -0.2, pelvisY: 230}),
  holding_phone_smug: mk({armL: {a: 22, b: -128}, armR: {a: 26, b: -96}, holdPhoneL: 1, faceGlow: 0.7, lean: -3, headTilt: -6, pitch: 0.2}),
  yawning_at_desk: mk({pelvisY: 150, legR: {a: 32, b: -40}, legL: {a: 32, b: -40}, thighS: 0.45, armR: {a: 150, b: 34}, armL: {a: 26, b: -70},
    yawn: 1, headTilt: -8, lean: -3}),
  sitting_blank_on_prayer_mat: mk({pelvisY: 46, torsoSY: 0.95, legR: {a: 98, b: -150}, legL: {a: 98, b: -150}, thighS: 0.62, shinS: 0.9,
    armR: {a: 26, b: -38}, armL: {a: 26, b: -38}, pitch: 0.12, headDY: 4}),
  climbing_stairs: mk({walk: 1, lean: 7, headTilt: 3, pitch: -0.1}),
  slamming_desk: mk({armR: {a: 34, b: -56}, armL: {a: 34, b: -56}, lean: 9, pelvisY: 216, headTilt: 0, shoulder: 0.6, pitch: 0.15}),
  rolling_dice: mk({armL: {a: 74, b: -58}, armR: {a: 12, b: -10}, headTilt: 4, lean: 2, dice: 1}),
  sunglasses_relax: mk({pelvisY: 150, legR: {a: 40, b: -30}, legL: {a: 22, b: -48}, thighS: 0.45, armR: {a: 152, b: 128}, armL: {a: 152, b: 128},
    lean: -6, headTilt: -4, shades: 1}),
  stiff_while_hugged: mk({armR: {a: 3, b: 0}, armL: {a: 30, b: -112}, holdPhoneL: 1, faceGlow: 0.5, shoulder: 0.6, pitch: 0.25, headTilt: 2}),
  comparing_phone: mk({armL: {a: 46, b: -96}, armR: {a: 10, b: -14}, holdPhoneL: 1, faceGlow: 0.6, turn: 0.4, headTilt: 5, pitch: 0.1}),
  looming: mk({pelvisY: 236, lean: 7, shoulder: -0.3, pitch: 0.3, headDY: -4, armR: {a: 20, b: -16}, armL: {a: 20, b: -16},
    legR: {a: 8, b: -4}, legL: {a: 8, b: -4}}),
  sitting_relaxed_phone: mk({pelvisY: 150, legR: {a: 34, b: -40}, legL: {a: 30, b: -44}, thighS: 0.45, lean: -6, armL: {a: 22, b: -126},
    armR: {a: 30, b: -26}, holdPhoneL: 1, faceGlow: 1, pitch: 0.3, headTilt: 4}),
  // ---- pose video umur25 ----
  blowing_candle: mk({lean: 9, pitch: 0.35, headDY: 10, armR: {a: 16, b: -40}, armL: {a: 16, b: -40}, puff: 1, pelvisY: 220}),
  holding_phone_hidden: mk({armL: {a: -16, b: 34}, behind: 1, armR: {a: 10, b: -14}, shoulder: 0.4, headTilt: 6, turn: -0.3, pitch: 0.1}),
  sitting_dinner_table: mk({pelvisY: 150, legR: {a: 32, b: -40}, legL: {a: 32, b: -40}, thighS: 0.45, armR: {a: 32, b: -78}, armL: {a: 32, b: -78}, pitch: 0.1}),
  slamming_table: mk({pelvisY: 150, legR: {a: 32, b: -40}, legL: {a: 32, b: -40}, thighS: 0.45, armR: {a: 40, b: -50}, armL: {a: 40, b: -50},
    lean: 8, shoulder: 0.6, pitch: 0.15}),
  pointing_angry: mk({armL: {a: 82, b: 2}, pointL: 1, armR: {a: 14, b: -40}, lean: 6, headTilt: -4, shoulder: 0.3}),
  standing_tense: mk({armR: {a: 10, b: -24}, armL: {a: 10, b: -24}, shoulder: 0.55, jitter: 0.35, pelvisY: 226, headDY: 4}),
  walking_street: mk({walk: 1, armR: {a: 6, b: -30}, armL: {a: 6, b: -30}, headTilt: 3}),
  sitting_bus_stop: mk({pelvisY: 150, legR: {a: 26, b: -30}, legL: {a: 26, b: -30}, thighS: 0.45, armR: {a: 22, b: -46}, armL: {a: 22, b: -46}, pitch: 0.12, lean: 2}),
  being_dragged: mk({lean: -16, armR: {a: 70, b: -20}, armL: {a: 96, b: -10}, legR: {a: 26, b: -10}, legL: {a: -10, b: 8}, pelvisY: 214, headTilt: 10, struggle: 0.4}),
  sitting_meeting: mk({pelvisY: 150, legR: {a: 30, b: -40}, legL: {a: 30, b: -40}, thighS: 0.45, armR: {a: 30, b: -84}, armL: {a: 30, b: -84}, pitch: 0.05}),
  scratching_head: mk({armL: {a: 130, b: 120}, armR: {a: 10, b: -14}, headTilt: 8, turn: 0.2}),
  looking_down: mk({pitch: 0.6, headDY: 12, headTilt: 6, armR: {a: 4, b: -6}, armL: {a: 4, b: -6}, shoulder: 0.3}),
  swiping_phone: mk({armL: {a: 18, b: -126}, armR: {a: 24, b: -110}, holdPhoneL: 1, faceGlow: 0.9, pitch: 0.4, headTilt: 4, headDY: 6, tap: 1}),
  // ---- pose video otak bodoh ----
  // tangan kanan dirantai ke HP di tangan kiri; badan menarik mundur, meronta
  chained_to_phone: mk({armL: {a: 56, b: -40}, armR: {a: 40, b: -30}, holdPhoneL: 1, faceGlow: 0.7, lean: -7, pitch: 0.15, headTilt: -6,
    struggle: 0.55, legR: {a: 12, b: -8}, legL: {a: 4, b: -2}, pelvisY: 222}),
  // berdiri diam, menengadah (one shot): lengan lemas, dagu naik
  standing_still_lookup: mk({armR: {a: 5, b: -4}, armL: {a: 5, b: -4}, pitch: -0.22, headTilt: -2, headDY: -2}),
  // duduk belajar di meja: tangan kiri memegang pensil di atas buku, tangan kanan menahan buku
  sitting_desk_study: mk({pelvisY: 150, legR: {a: 32, b: -40}, legL: {a: 32, b: -40}, thighS: 0.45, shinS: 1.0,
    armR: {a: 30, b: -82}, armL: {a: 36, b: -96}, pitch: 0.35, headDY: 8, headTilt: 3, lean: 4}),
  // lari di roda hamster (roda digambar di belakang badan)
  running_hamster_wheel: mk({run: 1, lean: 8, headTilt: 4, pelvisY: 214}),
  // tangan ditarik tali boneka ke depan-atas (ke HP), badan menolak ke belakang
  puppet_pulled: mk({armL: {a: 104, b: 14}, armR: {a: 64, b: 30}, lean: -8, headTilt: 8, turn: -0.35, pelvisY: 222, jitter: 0.5,
    legR: {a: 14, b: -10}, legL: {a: 2, b: 0}}),
  // tinju mengepal di samping badan, bahu naik, gemetar menahan marah
  fist_clenched: mk({armR: {a: 22, b: -62}, armL: {a: 22, b: -62}, shoulder: 0.65, tremble: 1, jitter: 0.45, pelvisY: 224, headDY: 4, pitch: 0.08,
    legR: {a: 10, b: -6}, legL: {a: 10, b: -6}}),
  // duduk rapat, kosong: tangan diam di meja, kepala lurus tak bergerak
  sitting_meeting_blank: mk({pelvisY: 150, legR: {a: 30, b: -40}, legL: {a: 30, b: -40}, thighS: 0.45, armR: {a: 26, b: -80}, armL: {a: 26, b: -80},
    pitch: 0.02, headTilt: 1}),
  // rebahan nunda kerja: bersandar jauh ke belakang di kursi, lengan menjuntai, kaki selonjor
  procrastinating_slumped: mk({pelvisY: 118, legR: {a: 40, b: -20}, legL: {a: 46, b: -16}, thighS: 0.45, torsoSY: 0.86, lean: 5,
    armR: {a: 16, b: 4}, armL: {a: 20, b: 6}, pitch: -0.12, headTilt: -16, headDY: 14, shoulder: 0.45}),
  // jalan di treadmill (treadmill digambar di bawah kaki)
  walking_treadmill: mk({walk: 1, pelvisY: 252, lean: 3, armR: {a: 8, b: -24}, armL: {a: 8, b: -24}, headTilt: 3, pitch: 0.15}),
  // kepala tertunduk dalam, bahu jatuh
  // thumbnail: kedua tangan terentang ke samping-bawah memegang ujung teks judul
  holding_text_edges: mk({armR: {a: 38, b: 6}, armL: {a: 38, b: 6}, shoulder: 0.3, headTilt: 0, pitch: -0.04, headDY: -2}),
  head_down: mk({pitch: 0.9, headDY: 20, headTilt: 4, armR: {a: 2, b: -2}, armL: {a: 2, b: -2}, shoulder: 0.55, torsoSY: 0.96, pelvisY: 224}),
};

// Posisi tangan di koordinat dunia (tanpa gerak idle) untuk menyambung tali/tali kekang.
export const handWorld = (pose: PoseName, side: -1 | 1, x: number, y: number, scale: number) => {
  const P = POSES[pose];
  const l = side === -1 ? P.armR : P.armL;
  const th = 178 * P.torsoSY;
  const rot = (P.lean * Math.PI) / 180;
  const a1 = side * l.a, a2 = a1 + side * l.b;
  const d = (g: number) => [Math.sin((g * Math.PI) / 180), Math.cos((g * Math.PI) / 180)];
  const hx = side * 66 + d(a1)[0] * 84 + d(a2)[0] * 78;
  const hy = -th + 22 + d(a1)[1] * 84 + d(a2)[1] * 78;
  const rx = hx * Math.cos(rot) - hy * Math.sin(rot);
  const ry = hx * Math.sin(rot) + hy * Math.cos(rot);
  return {x: x + rx * scale, y: y + (ry - P.pelvisY) * scale};
};

/* ---------------- ekspresi ---------------- */
type Brow = {y: number; rot: number};
type Eye = {lid: number; lidB: number; iris: number; dx: number; dy: number; div: number};
type ExprDef = {
  mouth: string; browR: Brow; browL: Brow; eye: Eye;
  tears: number; sweat: number; blush: number; angry: number; dazed: number; teeth: number;
  sparkle: number; panic: number; spiral: number; jit: number; dart: number; messy: number; load: number;
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
  bored: 'M -18 4 Q 2 6 20 1 Q 2 10 -18 7 Z',
  curious: 'M -9 2 C -9 -9 9 -9 9 2 C 9 12 -9 12 -9 2 Z',
  hooked: 'M -22 -2 Q 0 4 22 -2 Q 18 16 0 18 Q -18 16 -22 -2 Z',
  panicked: 'M -24 -4 Q -12 -12 0 -6 Q 12 -12 24 -4 Q 22 26 0 28 Q -22 26 -24 -4 Z',
  hypnotized: 'M -14 2 Q 0 -4 14 4 Q 8 18 -2 16 Q -14 12 -14 2 Z',
  stressed: 'M -22 0 Q 0 -6 22 0 L 20 10 Q 0 6 -20 10 Z',
  jittery: 'M -20 4 Q -14 -2 -7 4 Q 0 10 7 4 Q 14 -2 20 4 Q 14 10 7 8 Q 0 14 -7 8 Q -14 2 -20 8 Z',
  lonely: 'M -14 8 Q 0 0 14 8 Q 0 3 -14 8 Z',
  tempted: 'M -18 2 Q 2 8 22 -6 Q 10 12 -18 6 Z',
  proud: 'M -24 -2 Q 0 4 24 -2 Q 18 16 0 18 Q -18 16 -24 -2 Z',
  laughing: 'M -28 -6 Q 0 0 28 -6 Q 24 30 0 32 Q -24 30 -28 -6 Z',
  lethargic: 'M -16 4 Q 0 6 16 4 Q 6 12 -8 10 Q -16 8 -16 4 Z',
  flat: 'M -18 2 L 18 2 L 18 7 L -18 7 Z',
  relieved: 'M -20 0 Q 0 10 20 0 Q 0 15 -20 0 Z',
  sleepy: 'M -6 4 C -6 -3 6 -3 6 4 C 6 10 -6 10 -6 4 Z',
};
const YAWN = 'M -18 -6 C -18 -30 18 -30 18 -6 C 18 30 -18 30 -18 -6 Z';
const WHISTLE = 'M -6 2 C -6 -5 6 -5 6 2 C 6 8 -6 8 -6 2 Z';

const E = (o: Partial<Eye>): Eye => ({lid: 0.12, lidB: 0, iris: 1, dx: 0, dy: 0, div: 0, ...o});
const D = (o: Partial<ExprDef> & {mouth: string}): ExprDef => ({
  browR: {y: 0, rot: 0}, browL: {y: 0, rot: 0}, eye: E({}),
  tears: 0, sweat: 0, blush: 0, angry: 0, dazed: 0, teeth: 0, sparkle: 0, panic: 0, spiral: 0, jit: 0, dart: 0, messy: 0, load: 0, ...o,
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
  bored: D({mouth: M.bored, browR: {y: 4, rot: 2}, browL: {y: 5, rot: -2}, eye: E({lid: 0.55, lidB: 0.1, dx: -0.3, dy: 0.2})}),
  curious: D({mouth: M.curious, browR: {y: -2, rot: 2}, browL: {y: -15, rot: 6}, eye: E({lid: 0.02, iris: 1.05, dx: 0.3, dy: -0.3})}),
  hooked: D({mouth: M.hooked, browR: {y: -10, rot: -2}, browL: {y: -10, rot: 2}, eye: E({lid: 0, iris: 1.3, dy: 0.1}), sparkle: 1, blush: 0.6, teeth: 1}),
  panicked: D({mouth: M.panicked, browR: {y: -18, rot: -14}, browL: {y: -18, rot: 14}, eye: E({lid: 0, iris: 0.48}), sweat: 1, panic: 1}),
  hypnotized: D({mouth: M.hypnotized, browR: {y: -8, rot: -4}, browL: {y: -8, rot: 4}, eye: E({lid: 0.05, iris: 1}), spiral: 1, dazed: 0.6}),
  sweaty_stressed: D({mouth: M.stressed, browR: {y: 2, rot: -18}, browL: {y: 2, rot: 18}, eye: E({lid: 0.3, iris: 0.8}), sweat: 1, panic: 0.7, teeth: 1}),
  jittery: D({mouth: M.jittery, browR: {y: -10, rot: -16}, browL: {y: -10, rot: 16}, eye: E({lid: 0.05, iris: 0.6}), sweat: 0.6, jit: 1}),
  lonely: D({mouth: M.lonely, browR: {y: -2, rot: -12}, browL: {y: -2, rot: 12}, eye: E({lid: 0.45, dx: -0.5, dy: 0.6})}),
  tempted: D({mouth: M.tempted, browR: {y: -6, rot: -4}, browL: {y: -10, rot: 6}, eye: E({lid: 0.35, dx: 0.6, iris: 1.1}), blush: 0.6, sparkle: 0.35}),
  proud: D({mouth: M.proud, browR: {y: -4, rot: 6}, browL: {y: -4, rot: -6}, eye: E({lid: 0.5, lidB: 0.3}), teeth: 1, blush: 0.3}),
  laughing: D({mouth: M.laughing, browR: {y: -8, rot: -6}, browL: {y: -8, rot: 6}, eye: E({lid: 0.72, lidB: 0.5}), teeth: 1, blush: 0.8}),
  lethargic: D({mouth: M.lethargic, browR: {y: 6, rot: -6}, browL: {y: 6, rot: 6}, eye: E({lid: 0.68, iris: 0.8, dy: 0.5})}),
  restless: D({mouth: M.worried, browR: {y: -6, rot: -14}, browL: {y: -6, rot: 14}, eye: E({lid: 0.15, iris: 0.8}), dart: 1, sweat: 0.4}),
  focused: D({mouth: M.flat, browR: {y: 6, rot: 8}, browL: {y: 6, rot: -8}, eye: E({lid: 0.32, dy: 0.5})}),
  relieved: D({mouth: M.relieved, browR: {y: -8, rot: -8}, browL: {y: -8, rot: 8}, eye: E({lid: 0.62, lidB: 0.2}), blush: 0.3}),
  sleepy: D({mouth: M.sleepy, browR: {y: 6, rot: -4}, browL: {y: 6, rot: 4}, eye: E({lid: 0.85, iris: 0.8})}),
  confused_morning: D({mouth: M.jittery, browR: {y: 4, rot: 4}, browL: {y: -14, rot: 8}, eye: E({lid: 0.45, dx: 0.3}), messy: 1}),
  confident: D({mouth: M.smirk, browR: {y: 4, rot: 10}, browL: {y: 2, rot: -12}, eye: E({lid: 0.22, dx: 0.1})}),
  nervous: D({mouth: M.worried, browR: {y: -8, rot: -16}, browL: {y: -8, rot: 16}, eye: E({lid: 0.08, iris: 0.75, dx: -0.3}), sweat: 0.7}),
  flat: D({mouth: M.flat, browR: {y: 3, rot: 0}, browL: {y: 3, rot: 0}, eye: E({lid: 0.5})}),
  smug: D({mouth: 'M -24 2 Q 4 8 26 -10 Q 10 14 -24 7 Z', browR: {y: 2, rot: 8}, browL: {y: -10, rot: 4}, eye: E({lid: 0.42, dx: 0.25}), blush: 0.15}),
  lazy: D({mouth: 'M -16 4 Q 0 7 16 3 Q 2 10 -16 8 Z', browR: {y: 7, rot: -4}, browL: {y: 7, rot: 4}, eye: E({lid: 0.62, iris: 0.85, dy: 0.3})}),
  empty: D({mouth: M.flat, browR: {y: 1, rot: 0}, browL: {y: 1, rot: 0}, eye: E({lid: 0.3, iris: 0.55, dy: 0.15}), dazed: 0.15}),
  obsessive: D({mouth: M.stressed, browR: {y: -6, rot: 14}, browL: {y: -6, rot: -14}, eye: E({lid: 0, iris: 0.5, dy: 0.1}), sweat: 0.5, jit: 0.4, teeth: 1}),
  irritated: D({mouth: 'M -20 4 Q 0 -2 20 4 L 18 10 Q 0 6 -18 10 Z', browR: {y: 5, rot: 18}, browL: {y: 5, rot: -18}, eye: E({lid: 0.38, iris: 0.85}), angry: 0.45}),
  smirk_denial: D({mouth: M.smirk, browR: {y: -4, rot: 4}, browL: {y: -12, rot: 6}, eye: E({lid: 0.35, dx: 0.7, dy: -0.6})}),
  cold: D({mouth: 'M -18 3 L 18 3 L 18 7 L -18 7 Z', browR: {y: 5, rot: 6}, browL: {y: 5, rot: -6}, eye: E({lid: 0.42, iris: 0.8})}),
  oblivious: D({mouth: 'M -6 3 C -6 -3 6 -3 6 3 C 6 8 -6 8 -6 3 Z', browR: {y: -8, rot: -2}, browL: {y: -10, rot: 4}, eye: E({lid: 0.15, dx: 0.5, dy: -0.85})}),
  confused: D({mouth: M.jittery, browR: {y: 4, rot: 8}, browL: {y: -14, rot: 6}, eye: E({lid: 0.12, dx: -0.3, iris: 0.9})}),
  excited: D({mouth: M.laughing, browR: {y: -12, rot: -8}, browL: {y: -12, rot: 8}, eye: E({lid: 0, iris: 1.15, dy: -0.1}), sparkle: 0.6, blush: 0.6, teeth: 1}),
  explosive: D({mouth: M.panicked, browR: {y: 8, rot: 26}, browL: {y: 8, rot: -26}, eye: E({lid: 0.1, iris: 0.45}), angry: 1, teeth: 1, jit: 0.8}),
  daydreaming: D({mouth: 'M -16 2 Q 0 10 16 2 Q 0 12 -16 2 Z', browR: {y: -6, rot: -4}, browL: {y: -6, rot: 4}, eye: E({lid: 0.28, iris: 0.6, dx: 0.4, dy: -0.6}), blush: 1.4}),
  ashamed: D({mouth: M.guilty, browR: {y: -3, rot: -18}, browL: {y: -3, rot: 18}, eye: E({lid: 0.5, dx: -0.5, dy: 0.8}), blush: 0.7, sweat: 0.4}),
  lost: D({mouth: 'M -12 4 Q 0 0 12 4 Q 0 8 -12 4 Z', browR: {y: -8, rot: -10}, browL: {y: -14, rot: 4}, eye: E({lid: 0.1, iris: 0.8, dx: -0.4, dy: -0.2})}),
  tired: D({mouth: M.lethargic, browR: {y: 6, rot: -8}, browL: {y: 6, rot: 8}, eye: E({lid: 0.6, lidB: 0.15, iris: 0.85, dy: 0.4}), sweat: 0.6}),
  unfocused: D({mouth: M.flat, browR: {y: -2, rot: -4}, browL: {y: 0, rot: 2}, eye: E({lid: 0.32, iris: 0.6, div: 1}), dazed: 0.35}),
  empty_stare: D({mouth: 'M -14 3 L 14 3 L 14 6 L -14 6 Z', browR: {y: 2, rot: 0}, browL: {y: 2, rot: 0}, eye: E({lid: 0.22, iris: 0.42})}),
  avoiding_eye_contact: D({mouth: M.guilty, browR: {y: -2, rot: -12}, browL: {y: -2, rot: 12}, eye: E({lid: 0.42, dx: -0.9, dy: 0.7}), sweat: 0.3}),
  struggling: D({mouth: 'M -24 -2 Q 0 -6 24 -2 L 22 10 Q 0 6 -22 10 Z', browR: {y: -4, rot: -20}, browL: {y: -4, rot: 20},
    eye: E({lid: 0.42, lidB: 0.2, iris: 0.8}), teeth: 1, sweat: 1, jit: 0.5}),
  blank: D({mouth: 'M -10 4 L 10 4 L 10 7 L -10 7 Z', browR: {y: -6, rot: 0}, browL: {y: -6, rot: 0}, eye: E({lid: 0, iris: 0.32}), load: 1}),
  hopeless: D({mouth: 'M -18 10 Q 0 0 18 10 Q 0 5 -18 10 Z', browR: {y: -4, rot: -20}, browL: {y: -4, rot: 20},
    eye: E({lid: 0.58, lidB: 0.1, iris: 0.8, dy: 0.8}), sweat: 0.2}),
  // melotot: mata terbuka penuh, iris kecil, alis naik tinggi, mulut terbuka kaget
  bulging: D({mouth: 'M -15 2 C -15 -20 15 -20 15 2 C 15 30 -15 30 -15 2 Z', browR: {y: -20, rot: -8}, browL: {y: -20, rot: 8}, eye: E({lid: 0, iris: 0.42}), sweat: 0.8}),
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
  sparkle: lerp(a.sparkle, b.sparkle, t), panic: lerp(a.panic, b.panic, t), spiral: lerp(a.spiral, b.spiral, t),
  jit: lerp(a.jit, b.jit, t), dart: lerp(a.dart, b.dart, t), messy: lerp(a.messy, b.messy, t), load: lerp(a.load, b.load, t),
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

/* ---------------- kostum ---------------- */
// bomber = jaket bomber navy (default); groom = jas pengantin (charcoal, kemeja putih, dasi kupu-kupu, bunga di saku)
export type Outfit = 'bomber' | 'groom';
const OUT = {
  bomber: {j0: C.navyLight, j1: C.navy, j2: C.navyDark, arm: C.navy, armHi: C.navyLight, cuff: C.navyLight, pants: C.chino, pantsLine: C.navyDark, shoe: C.navyDark, sole: C.cream},
  groom: {j0: '#4A4F63', j1: '#2B2F40', j2: '#181B26', arm: '#2B2F40', armHi: '#4A4F63', cuff: '#F4F1EA', pants: '#242838', pantsLine: '#12141C', shoe: '#14161E', sole: '#2A2D38'},
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
  rimColor2?: string;
  chains?: number; // jumlah lilitan rantai yang masih utuh (0..3)
  outfit?: Outfit;
};

export const Character: React.FC<CharacterProps> = ({
  x = 540, y = 1500, scale = 1, expression = 'neutral', pose = 'standing_relaxed',
  lookAt = {x: 0, y: 0}, talking = false, rim = false, rimColor = '#FFF4E0', blinkSeed = 1,
  walkSpeed = 1, phoneColor = C.red2, id = 'c', rimColor2 = '#FFB23F', chains = 0, outfit = 'bomber',
}) => {
  const O = OUT[outfit];
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const amp = useMouthOpen(talking);

  // ----- pose tween: overlap/follow-through per kelompok (badan -> lengan -> kepala, makin telat) -----
  const poseAt = (fr: number) => {
    const pk = activeKF(pose, fr);
    const k = fr - pk.at;
    const antic = pk.first ? 0 : k >= 0 && k < 6 ? Math.sin((k / 6) * Math.PI) * 0.1 : 0; // anticipation
    const sp = (delay: number, stiffness: number, damping: number) =>
      pk.first ? 1 : spring({frame: fr - pk.at - delay, fps, config: {damping, stiffness, mass: 0.7}}) - antic;
    const A = POSES[pk.prev], B = POSES[pk.cur];
    const Pb = lerpPose(A, B, sp(0, 170, 15));
    const Pa = lerpPose(A, B, sp(2, 120, 11));
    const Ph = lerpPose(A, B, sp(3, 105, 10));
    return {
      ...Pb, armR: Pa.armR, armL: Pa.armL, pointL: Pa.pointL, holdPhoneL: Pa.holdPhoneL, tap: Pa.tap, tremble: Pa.tremble,
      strum: Pa.strum, curl: Pa.curl, snip: Pa.snip, struggle: Pb.struggle, dice: Pa.dice, shades: Ph.shades, behind: Pa.behind, puff: Ph.puff, capeFall: lerpPose(A, B, sp(4, 40, 9)).capeFall, sleep: Ph.sleep,
      headTilt: Ph.headTilt, headDY: Ph.headDY, pitch: Ph.pitch, turn: Ph.turn, whistle: Ph.whistle, yawn: Ph.yawn, cur: pk.cur,
    };
  };
  const P = poseAt(frame);
  const Plag = poseAt(frame - 4); // rambut telat ngikut kepala
  const pk = activeKF(pose, frame);

  // ----- expression morph 7 frame -----
  const ek = activeKF(expression, frame);
  const et0 = ek.first ? 1 : clamp((frame - ek.at) / 7);
  const et = et0 * et0 * (3 - 2 * et0);
  const X = lerpExpr(EXPR[ek.prev], EXPR[ek.cur], et);

  // ----- idle -----
  const t = frame / fps;
  const breathe = Math.sin(t * 2 * Math.PI * 0.28);
  const bob = Math.sin(t * 2 * Math.PI * 0.5 + 1) * 2;

  // weight shift + mikro-gestur (selalu jalan, karakter tidak pernah diam total)
  const still = 1 - Math.min(1, P.walk + P.run);
  const wsh = Math.sin(t * 2 * Math.PI * 0.23 + blinkSeed) * still;
  const micro = (k: number) => Math.sin(t * (1.1 + k * 0.37) + k * 2.1) + 0.5 * Math.sin(t * (2.3 + k * 0.5) + k);
  P.armR = {a: P.armR.a + micro(1) * 2.2, b: P.armR.b + micro(2) * 3 + P.tremble * Math.sin(t * 38) * 4};
  P.armL = {a: P.armL.a + micro(3) * 2.2, b: P.armL.b + micro(4) * 3 + P.tap * (Math.sin(t * 2 * Math.PI * 3.2) > 0 ? -7 : 2)};
  P.lean += wsh * 1.3 + P.jitter * Math.sin(t * 31) * 1.5 + P.struggle * (Math.sin(t * 2 * Math.PI * 2.6) * 5 + Math.sin(t * 17) * 1.2);
  P.shoulder += P.struggle * Math.max(0, Math.sin(t * 2 * Math.PI * 2.6 + 1)) * 0.5;
  P.headTilt += P.struggle * Math.sin(t * 2 * Math.PI * 2.6 + 0.6) * 4;
  P.armL = {a: P.armL.a + P.strum * Math.sin(t * 2 * Math.PI * 2.2) * 8, b: P.armL.b + P.strum * Math.sin(t * 2 * Math.PI * 2.2) * 6};
  P.armR = {a: P.armR.a, b: P.armR.b + P.curl * (Math.sin(t * 2 * Math.PI * 0.8) * 45 + 45)};
  P.legR = {a: P.legR.a + wsh * 2 * still, b: P.legR.b};
  P.legL = {a: P.legL.a - wsh * 2 * still, b: P.legL.b};

  // walking / running cycle
  const cyc = t * 2 * Math.PI * (1.6 + P.run * 1.6) * walkSpeed;
  const sw = Math.sin(cyc);
  const wAmp = P.walk * 26 + P.run * 48;
  const legR = {a: P.legR.a + sw * wAmp, b: P.legR.b - Math.max(0, -sw) * (P.walk * 30 + P.run * 70)};
  const legL = {a: P.legL.a + sw * wAmp, b: P.legL.b - Math.max(0, sw) * (P.walk * 30 + P.run * 70)};
  const armSw = P.walk * 22 + P.run * 40;
  const armR = {a: P.armR.a - sw * armSw, b: P.armR.b - P.run * 70};
  const armL = {a: P.armL.a - sw * armSw, b: P.armL.b - P.run * 70};
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

  // lirikan: tiap ±1,8 dtk mata melirik sebentar ke samping lalu kembali
  let glance = 0;
  {
    const gp = 1.8 + rand(blinkSeed * 3.3) * 0.6;
    const gk = Math.floor(t / gp);
    const gt = t - gk * gp;
    if (rand(gk * 4.1 + blinkSeed) > 0.45 && gt > 0.3 && gt < 1.0) glance = (rand(gk * 7.7 + blinkSeed) > 0.5 ? 1 : -1) * 0.45;
  }

  // ----- geometry -----
  const pelvis = {x: wsh * 5, y: -P.pelvisY + stepBob};
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
    const sh = {x: side * 66, y: -torsoH + 22 - P.shoulder * 12};
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
      <rect x={-30 + side * 6} y={-8} width={60} height={30} rx={14} fill={O.shoe} />
      <rect x={-31 + side * 6} y={12} width={62} height={11} rx={5} fill={O.sole} />
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
          stroke={O.cuff} strokeWidth={36} strokeLinecap="round" />
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
      <path d={limbPath(pts.sh, pts.el, pts.hand)} stroke={O.arm} strokeWidth={40} strokeLinecap="round"
        strokeLinejoin="round" fill="none" />
      <path d={limbPath(pts.sh, pts.el, pts.hand)} stroke={O.armHi} strokeWidth={8} strokeLinecap="round"
        strokeLinejoin="round" fill="none" opacity={0.35} transform={`translate(${side * -9},-4)`} />
      {hand(pts, side, point, bracelet)}
    </g>
  );

  // ---------- kepala ----------
  const tx = turn * 14; // geser fitur wajah (3/4 view)
  const pitchDY = P.pitch * 26;
  const eyeW = 22;
  const eye = (cx: number, side: -1 | 1) => {
    const lid = clamp(Math.max(X.eye.lid, blink, P.yawn * 0.85, P.sleep));
    const lidB = X.eye.lidB;
    const div = X.eye.div * side * 0.6;
    const ix = (X.eye.dx + glance + lookAt.x * 0.8 + div + X.dart * (Math.sin(t * 5.3) > 0.2 ? 0.8 : Math.sin(t * 5.3) < -0.4 ? -0.8 : 0)) * 7;
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
          {X.sparkle > 0.05 && (
            <g opacity={X.sparkle}>
              <circle cx={ix} cy={iy + 1} r={11 * X.eye.iris} fill="#FF6F91" opacity={0.55} />
              <path transform={`translate(${ix + 3},${iy - 3}) scale(${0.9 + 0.2 * Math.sin(t * 9)})`}
                d="M 0 -8 C 1 -2 2 -1 8 0 C 2 1 1 2 0 8 C -1 2 -2 1 -8 0 C -2 -1 -1 -2 0 -8 Z" fill={C.white} />
              <circle cx={ix - 5} cy={iy + 5} r={2.2} fill={C.white} />
            </g>
          )}
          {X.spiral > 0.05 && (
            <g opacity={X.spiral} transform={`translate(${ix * 0.3},1) rotate(${t * 400 * side})`}>
              <circle r={14} fill={C.white} />
              <path d="M 0 0 m -2 0 a 2 2 0 1 1 4 0 a 5 5 0 1 1 -10 0 a 8 8 0 1 1 16 0 a 11 11 0 1 1 -22 0" stroke={C.plum}
                strokeWidth={2.6} fill="none" />
            </g>
          )}
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
    if (P.yawn > 0.5) return YAWN;
    if (P.whistle > 0.5 || P.puff > 0.5) return WHISTLE;
    if (!talking || amp < 0.06) return X.mouth;
    if (amp < 0.14) return TALK[0];
    if (amp < 0.26) return TALK[1];
    return TALK[2];
  })();

  const headY = -torsoH - 22 - 96 + P.headDY + bob * 0.5;
  const faceGlowOp = P.faceGlow * (0.55 + 0.1 * Math.sin(t * 9) + 0.05 * Math.sin(t * 23));

  const head = (
    <g transform={`translate(${X.jit * Math.sin(t * 47) * 2.5},${-torsoH}) rotate(${P.headTilt + Math.sin(t * 1.7) * 0.8 + X.jit * Math.sin(t * 39) * 1.5}) translate(0,${headY + torsoH})`}>
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
      {X.panic > 0.05 && [0, 1, 2].map((i) => {
        const ph = (t * 1.8 + i * 0.33) % 1;
        return <path key={i} d={`M ${-74 + i * 70} ${-50 + i * 6 + ph * 60} q 7 12 0 18 q -7 -6 0 -18 Z`} fill={C.mint} opacity={X.panic * (1 - ph)} />;
      })}
      {P.whistle > 0.3 && [0, 1].map((i) => {
        const ph = (t * 0.9 + i * 0.5) % 1;
        return (
          <g key={i} opacity={P.whistle * Math.sin(ph * Math.PI)} transform={`translate(${60 + ph * 70},${40 - ph * 90}) rotate(${-10 + i * 18})`}>
            <ellipse cx={0} cy={0} rx={9} ry={7} fill={C.cream} transform="rotate(-20)" />
            <rect x={6} y={-32} width={4} height={32} fill={C.cream} />
            <path d="M 10 -32 Q 22 -26 18 -14" stroke={C.cream} strokeWidth={4} fill="none" />
          </g>
        );
      })}
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
        fill={C.hair} transform={`rotate(${clamp((Plag.headTilt - P.headTilt) * 0.6 + (Plag.lean - P.lean) * 0.4 + Math.sin(t * 2 * Math.PI * 2.4) * P.shake * 3, -8, 8)} 0 -40) translate(${tx * 0.25},${pitchDY * 0.55}) scale(1,${1 + P.pitch * 0.12})`} />
      <path d="M -20 -118 C 10 -126 50 -114 70 -88" stroke="#3A3446" strokeWidth={7} fill="none" strokeLinecap="round"
        opacity={0.8} transform={`translate(${tx * 0.25},${pitchDY * 0.55})`} />
      <path d="M -24 -70 C -14 -96 -6 -110 4 -124" stroke="#2C2734" strokeWidth={4} fill="none" strokeLinecap="round"
        transform={`translate(${tx * 0.25},${pitchDY * 0.55})`} />
      {X.messy > 0.05 && (
        <g opacity={X.messy} fill={C.hair} transform={`translate(${tx * 0.25},${pitchDY * 0.55})`}>
          <path d="M -40 -118 L -58 -158 L -22 -126 Z" /><path d="M 0 -128 L 6 -172 L 22 -128 Z" /><path d="M 40 -116 L 74 -146 L 58 -106 Z" />
          <path d="M -70 -80 L -104 -96 L -78 -62 Z" />
        </g>
      )}
      {P.sleep > 0.5 && [0, 1, 2].map((i) => {
        const ph = (t * 0.6 + i / 3) % 1;
        return (
          <path key={i} d="M -10 -10 L 10 -10 L -10 10 L 10 10" stroke={C.cream} strokeWidth={5} fill="none" strokeLinejoin="round" strokeLinecap="round"
            opacity={Math.sin(ph * Math.PI)} transform={`translate(${70 + ph * 60},${-110 - ph * 90}) scale(${0.6 + ph * 0.8})`} />
        );
      })}
      {P.shades > 0.5 && (
        <g transform={`translate(${tx},${pitchDY - 2})`}>
          <rect x={-66} y={-16} width={56} height={34} rx={14} fill="#0B0C10" />
          <rect x={10} y={-16} width={56} height={34} rx={14} fill="#0B0C10" />
          <rect x={-12} y={-10} width={24} height={6} rx={3} fill="#0B0C10" />
          <path d="M -58 -10 L -40 -10" stroke="#FFFFFF" strokeWidth={4} opacity={0.5} strokeLinecap="round" />
          <path d="M 18 -10 L 36 -10" stroke="#FFFFFF" strokeWidth={4} opacity={0.5} strokeLinecap="round" />
        </g>
      )}
      {P.puff > 0.5 && [-1, 1].map((sd) => <ellipse key={sd} cx={sd * 46 + tx} cy={40 + pitchDY} rx={20} ry={16} fill={C.skin} stroke={C.skinShade} strokeWidth={2} />)}
      {/* glow HP ke muka */}
      <ellipse cx={0} cy={30} rx={92} ry={90} fill={`url(#${fid}-fglow)`} opacity={faceGlowOp} />
      {/* bengong: spiral kecil */}
      {X.dazed > 0.1 && (
        <g opacity={X.dazed} transform={`translate(${70},${-120}) rotate(${t * 140})`}>
          <path d="M 0 0 m -3 0 a 3 3 0 1 1 6 0 a 6 6 0 1 1 -12 0 a 9 9 0 1 1 18 0" stroke={C.cream}
            strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.85} />
        </g>
      )}
      {/* blank: ikon loading berputar di samping kepala */}
      {X.load > 0.1 && (
        <g opacity={X.load} transform="translate(96,-118)">
          <circle r={34} fill="#10131C" opacity={0.85} />
          {Array.from({length: 8}).map((_, i) => {
            const a = (i / 8) * Math.PI * 2, on = ((i - Math.floor(t * 10)) % 8 + 8) % 8;
            return <circle key={i} cx={Math.cos(a) * 20} cy={Math.sin(a) * 20} r={5} fill="#E8ECF4" opacity={0.2 + on / 9} />;
          })}
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
      {outfit === 'groom' ? (
        <g>
          {/* kemeja putih + dasi kupu-kupu + kerah jas (lapel) + kancing + bunga di saku */}
          <path d={`M -30 ${-torsoH + 2} L 0 ${-torsoH + 96} L 30 ${-torsoH + 2} Z`} fill="#F4F1EA" />
          <path d={`M -30 ${-torsoH + 2} L -8 ${-torsoH + 18} L -2 ${-torsoH + 6} Z M 30 ${-torsoH + 2} L 8 ${-torsoH + 18} L 2 ${-torsoH + 6} Z`} fill="#DCD8CF" />
          <path d={`M -16 ${-torsoH + 14} L -2 ${-torsoH + 22} L -16 ${-torsoH + 30} Z M 16 ${-torsoH + 14} L 2 ${-torsoH + 22} L 16 ${-torsoH + 30} Z`} fill="#121420" />
          <rect x={-5} y={-torsoH + 17} width={10} height={10} rx={3} fill="#121420" />
          <path d={`M -34 ${-torsoH + 2} L -2 ${-torsoH + 100} L -20 ${-torsoH + 60} L -48 ${-torsoH + 30} Z`} fill={O.j0} />
          <path d={`M 34 ${-torsoH + 2} L 2 ${-torsoH + 100} L 20 ${-torsoH + 60} L 48 ${-torsoH + 30} Z`} fill={O.j0} />
          {[0, 1].map((k) => <circle key={k} cx={0} cy={-torsoH + 112 + k * 30} r={4.5} fill="#0E1018" />)}
          <line x1={0} y1={-torsoH + 100} x2={0} y2={-6} stroke={O.j2} strokeWidth={3} />
          <g transform={`translate(-46,${-torsoH + 52})`}>
            {[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx={0} cy={-7} rx={5} ry={8} fill="#FFFFFF" transform={`rotate(${r})`} />)}
            <circle r={4} fill="#F2C94C" />
            <path d="M 2 8 L 8 18" stroke="#6E9E5A" strokeWidth={3} />
          </g>
          <path d={`M -58 ${-torsoH * 0.36} l 28 0`} stroke={O.j2} strokeWidth={4} strokeLinecap="round" />
          <rect x={-74} y={-16} width={148} height={16} rx={6} fill={O.j1} />
        </g>
      ) : (
        <g>
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
      )}
    </g>
  );

  const legsSvg = (
    <g>
      {[LR, LL].map((L, i) => (
        <g key={i}>
          <path d={limbPath(L.hip, L.knee, L.foot)} stroke={O.pants} strokeWidth={46} strokeLinecap="round"
            strokeLinejoin="round" fill="none" />
          <path d={limbPath(L.hip, L.knee, L.foot)} stroke={O.pantsLine} strokeWidth={6} strokeLinecap="round"
            strokeLinejoin="round" fill="none" opacity={0.4} transform={`translate(${i ? -12 : 12},0)`} />
        </g>
      ))}
      <rect x={-62} y={pelvis.y - 22} width={124} height={44} rx={18} fill={O.pants} />
      {shoe(LR.foot, LR.a2, -1)}
      {shoe(LL.foot, LL.a2, 1)}
    </g>
  );

  const phoneInHand = P.holdPhoneL > 0.5 && (
    <g transform={`translate(${AL.hand.x - 8},${AL.hand.y - 34}) rotate(-8)`}>
      <PhoneBody w={46} h={86} glow={1} color={phoneColor} back />
    </g>
  );

  const crossed = pk.cur === 'arms_crossed';
  const cur = pk.cur as string;
  const mid = {x: (AR.hand.x + AL.hand.x) / 2, y: (AR.hand.y + AL.hand.y) / 2};
  // ---- props (ikut pose) ----
  const capeSvg = P.cape > 0.5 && (
    <g transform={`translate(0,${P.capeFall * (torsoH + P.pelvisY - 30)}) rotate(${P.capeFall * 8})`} opacity={1 - P.capeFall * 0.15}>
      <path d={`M -64 ${-torsoH + 18} C -110 ${-torsoH * 0.3} ${-130 - Math.sin(t * 6) * 10} 120 ${-120 - Math.sin(t * 6) * 14} ${200 - P.capeFall * 150}
          Q 0 ${222 - P.capeFall * 160 + Math.sin(t * 5) * 8} ${120 + Math.sin(t * 6 + 1) * 14} ${200 - P.capeFall * 150}
          C ${130 + Math.sin(t * 6) * 10} 120 110 ${-torsoH * 0.3} 64 ${-torsoH + 18} Z`} fill="#C62F3E" />
      <path d={`M -64 ${-torsoH + 18} C -100 ${-torsoH * 0.3} -110 100 -96 ${190 - P.capeFall * 150}`} stroke="#8E1B2C" strokeWidth={10} fill="none" opacity={0.6} />
    </g>
  );
  const weightSvg = cur === 'carrying_weight' && (
    <g transform={`translate(0,${-torsoH - 205})`}>
      {/* karung berat di pundak (di belakang kepala), simbol barbel */}
      <path d="M -150 40 C -170 -40 -120 -120 -40 -126 C -20 -150 20 -150 40 -126 C 120 -120 170 -40 150 40 C 120 110 -120 110 -150 40 Z" fill="#8A6A4A" />
      <path d="M -40 -126 C -20 -110 20 -110 40 -126" stroke="#6E5238" strokeWidth={10} fill="none" strokeLinecap="round" />
      <ellipse cx={-60} cy={-50} rx={60} ry={30} fill="#A88560" opacity={0.55} />
      <g transform="translate(0,-40)">
        <rect x={-62} y={-7} width={124} height={14} rx={7} fill="#2A2228" />
        {[-62, -46, 46, 62].map((x, i) => <rect key={i} x={x - 7} y={i % 3 === 0 ? -28 : -22} width={14} height={i % 3 === 0 ? 56 : 44} rx={5} fill="#3A3238" />)}
      </g>
    </g>
  );
  const bookSvg = cur === 'reading_focused' && (
    <g transform={`translate(${mid.x},${mid.y - 20})`}>
      <path d="M 0 -50 C -30 -60 -64 -58 -80 -50 L -80 50 C -64 42 -30 42 0 52 Z" fill={C.teal} />
      <path d="M 0 -50 C 30 -60 64 -58 80 -50 L 80 50 C 64 42 30 42 0 52 Z" fill="#3F8C85" />
      <rect x={-3} y={-52} width={6} height={104} fill="#2E6E68" />
    </g>
  );
  const guitarSvg = cur === 'playing_guitar' && (
    <g transform={`translate(30,-60) rotate(-32)`}>
      <rect x={-12} y={-250} width={24} height={200} rx={6} fill="#6E4A2E" />
      <rect x={-18} y={-276} width={36} height={34} rx={8} fill="#5A3A22" />
      <path d="M 0 -60 C -70 -60 -78 0 -50 30 C -86 70 -60 130 0 130 C 60 130 86 70 50 30 C 78 0 70 -60 0 -60 Z" fill={C.amber} />
      <circle cx={0} cy={40} r={22} fill="#3A2416" />
      {[-6, -2, 2, 6].map((x) => <line key={x} x1={x} y1={-270} x2={x} y2={100} stroke={C.cream} strokeWidth={1.5} opacity={0.7} />)}
    </g>
  );
  const dumbbellSvg = cur === 'workout' && (
    <g transform={`translate(${AR.hand.x},${AR.hand.y}) rotate(${-AR.a2 + 90})`}>
      <rect x={-46} y={-6} width={92} height={12} rx={6} fill="#5A5258" />
      {[-46, 46].map((x) => <rect key={x} x={x - 12} y={-26} width={24} height={52} rx={8} fill="#2A2228" />)}
    </g>
  );
  const scissorsSvg = cur === 'holding_scissors' && (() => {
    const open = 14 + Math.max(0, Math.sin(t * 2 * Math.PI * 1.6)) * 18 * P.snip;
    return (
      <g transform={`translate(${AL.hand.x + 6},${AL.hand.y - 22}) rotate(-30)`}>
        <g transform={`rotate(${-open / 2})`}><path d="M 0 0 L 6 -90 L 12 -88 L 8 0 Z" fill="#D9D2DA" /><circle cx={-6} cy={22} r={16} fill="none" stroke={C.red1} strokeWidth={8} /></g>
        <g transform={`rotate(${open / 2})`}><path d="M 0 0 L -6 -90 L -12 -88 L -8 0 Z" fill="#C9C1C6" /><circle cx={6} cy={22} r={16} fill="none" stroke={C.red1} strokeWidth={8} /></g>
        <circle r={5} fill="#5A5258" />
      </g>
    );
  })();
  const diceSvg = P.dice > 0.5 && (() => {
    const k = (t * 1.4) % 1;
    return (
      <g>
        {[0, 1].map((i) => (
          <g key={i} transform={`translate(${AL.hand.x + 10 + i * 30 + k * 40},${AL.hand.y - 50 - Math.sin(k * Math.PI) * 70 + i * 16}) rotate(${k * 540 + i * 40})`}>
            <rect x={-15} y={-15} width={30} height={30} rx={6} fill="#F7F3EA" stroke="#C9C1B4" strokeWidth={2} />
            {[[-7, -7], [7, 7], [0, 0]].slice(0, i + 2).map(([x, y], j) => <circle key={j} cx={x} cy={y} r={3.2} fill="#C0262E" />)}
          </g>
        ))}
      </g>
    );
  })();
  const wheelSvg = cur === 'steering_wheel' && (
    <g transform={`translate(${mid.x},${mid.y + 4}) rotate(${Math.sin(t * 0.8) * 6})`}>
      <circle r={92} fill="none" stroke="#2A2228" strokeWidth={22} />
      <circle r={26} fill="#3A3238" />
      {[90, 210, 330].map((a) => <rect key={a} x={-8} y={0} width={16} height={74} rx={6} fill="#3A3238" transform={`rotate(${a})`} />)}
    </g>
  );
  // selimut menyelubungi pundak (di belakang lengan yang memeluk badan) + garis menggigil
  const blanketSvg = cur === 'shaking_cold' && (
    <g>
      <path d={`M -30 ${-torsoH - 6} Q -110 ${-torsoH - 10} -116 ${-torsoH + 60} L -104 -10 Q -60 6 -40 -6 L -36 ${-torsoH + 40} Z`} fill="#B85C7A" />
      <path d={`M 30 ${-torsoH - 6} Q 110 ${-torsoH - 10} 116 ${-torsoH + 60} L 104 -10 Q 60 6 40 -6 L 36 ${-torsoH + 40} Z`} fill="#A24E6B" />
      {[-1, 1].map((sd) => [0, 1].map((k) => (
        <path key={`${sd}${k}`} d={`M ${sd * (138 + k * 14)} ${-torsoH + 30 + k * 40} q ${sd * 8} 10 0 20 q ${-sd * 8} 10 0 20`} stroke={C.cream}
          strokeWidth={4} fill="none" opacity={0.55 + 0.4 * Math.sin(t * 20 + k)} />
      )))}
    </g>
  );

  // ---- props video otak bodoh ----
  // roda hamster: lingkaran besar di belakang badan, jeruji berputar (karakter lari di dasar roda)
  const hamsterSvg = cur === 'running_hamster_wheel' && (
    <g transform="translate(0,-250)">
      <circle r={262} fill="none" stroke="#C9CED8" strokeWidth={16} opacity={0.9} />
      <circle r={244} fill="none" stroke="#8A90A0" strokeWidth={5} opacity={0.7} />
      <g transform={`rotate(${-t * 220})`}>
        {Array.from({length: 12}).map((_, i) => <line key={i} x1={0} y1={0} x2={0} y2={-250} stroke="#8A90A0" strokeWidth={4} opacity={0.45} transform={`rotate(${i * 30})`} />)}
        {Array.from({length: 36}).map((_, i) => <rect key={i} x={-3} y={-262} width={6} height={16} fill="#E8ECF4" opacity={0.8} transform={`rotate(${i * 10})`} />)}
      </g>
      <circle r={22} fill="#5A6170" />
      <path d="M -20 0 L -90 262 M 20 0 L 90 262" stroke="#5A6170" strokeWidth={14} strokeLinecap="round" />
    </g>
  );
  // treadmill: sabuk berjalan + rangka + pegangan di depan
  const treadSvg = cur === 'walking_treadmill' && (
    <g>
      <rect x={-190} y={-4} width={380} height={34} rx={16} fill="#2A2E3A" />
      <rect x={-176} y={0} width={352} height={14} rx={7} fill="#4A5060" />
      {Array.from({length: 14}).map((_, i) => {
        const x = ((i * 28 - t * 160) % 392 + 392) % 392 - 196;
        return <rect key={i} x={x} y={1} width={6} height={12} fill="#6A7080" opacity={Math.abs(x) < 176 ? 1 : 0} />;
      })}
      <path d="M 170 2 L 214 -250 L 150 -262" stroke="#5A6170" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x={150} y={-300} width={84} height={50} rx={10} fill="#2A2E3A" />
      <rect x={160} y={-292} width={64} height={22} rx={5} fill="#FF4A3A" opacity={0.75 + 0.2 * Math.sin(t * 5)} />
    </g>
  );
  // rantai dari pergelangan kanan ke HP di tangan kiri
  const chainSvg = cur === 'chained_to_phone' && (() => {
    const a = {x: AR.hand.x, y: AR.hand.y}, b = {x: AL.hand.x, y: AL.hand.y - 30};
    const n = 9;
    return (
      <g>
        {Array.from({length: n}).map((_, i) => {
          const k = (i + 0.5) / n;
          const x = a.x + (b.x - a.x) * k, y = a.y + (b.y - a.y) * k + Math.sin(k * Math.PI) * 34 + Math.sin(t * 9 + i) * 2;
          const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
          return <ellipse key={i} cx={x} cy={y} rx={13} ry={7} fill="none" stroke={i % 2 ? '#B8BEC9' : '#E3E7EE'} strokeWidth={5} transform={`rotate(${ang + (i % 2) * 90},${x},${y})`} />;
        })}
        <rect x={a.x - 16} y={a.y - 12} width={32} height={22} rx={6} fill="#9AA0AC" stroke="#E3E7EE" strokeWidth={3} />
      </g>
    );
  })();
  // pensil di tangan kiri (belajar)
  const pencilSvg = cur === 'sitting_desk_study' && (
    <g transform={`translate(${AL.hand.x - 6},${AL.hand.y - 10}) rotate(${-30 + Math.sin(t * 9) * 6})`}>
      <rect x={-5} y={-70} width={10} height={64} rx={2} fill="#FFD166" />
      <path d="M -5 -6 L 5 -6 L 0 8 Z" fill="#F1C9A5" />
      <rect x={-5} y={-78} width={10} height={9} rx={2} fill="#FF8FA0" />
    </g>
  );
  // tali boneka dari kedua tangan ke atas (ditarik)
  const stringsSvg = cur === 'puppet_pulled' && (
    <g>
      {[AL.hand, AR.hand].map((h, i) => (
        <line key={i} x1={h.x} y1={h.y} x2={h.x + 60 + i * 30} y2={-900} stroke="#E8ECF4" strokeWidth={2.5} opacity={0.85} />
      ))}
    </g>
  );

  const body = (
    <g>
      {hamsterSvg}
      {legsSvg}
      {treadSvg}
      <g transform={`translate(${pelvis.x},${pelvis.y}) rotate(${P.lean})`}>
        {capeSvg}
        {P.behind > 0.5 && (
          <g>
            <circle cx={AL.hand.x + 10} cy={AL.hand.y - 10} r={70} fill="#FF3B3B" opacity={0.28 + 0.08 * Math.sin(t * 6)} />
            {arm(AL, 1)}
            <g transform={`translate(${AL.hand.x + 4},${AL.hand.y - 30}) rotate(14)`}><PhoneBody w={44} h={82} glow={1} color="#FF3B3B" back /></g>
          </g>
        )}
        {torso}
        {weightSvg}
        {blanketSvg}
        {head}
        {guitarSvg}
        {wheelSvg}
        {crossed ? (
          <>
            {arm(AL, 1)}
            {arm(AR, -1, 0, true)}
          </>
        ) : (
          <>
            {arm(AR, -1, 0, true)}
            {P.behind < 0.5 && arm(AL, 1, P.pointL)}
          </>
        )}
        {chains > 0 && <ChainBand torsoH={torsoH} n={chains} t={t} />}
        {phoneInHand}
        {chainSvg}
        {pencilSvg}
        {stringsSvg}
        {bookSvg}
        {dumbbellSvg}
        {scissorsSvg}
        {diceSvg}
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
          <stop offset="0" stopColor={O.j0} />
          <stop offset="0.45" stopColor={O.j1} />
          <stop offset="1" stopColor={O.j2} />
        </linearGradient>
        <radialGradient id={`${fid}-fglow`} cx="0.5" cy="0.75" r="0.7">
          <stop offset="0" stopColor={phoneColor} stopOpacity={0.75} />
          <stop offset="1" stopColor={phoneColor} stopOpacity={0} />
        </radialGradient>
        <filter id={`${fid}-rim`} x="-35%" y="-25%" width="170%" height="150%" colorInterpolationFilters="sRGB">
          {/* rim kiri-atas (putih hangat) */}
          <feOffset in="SourceAlpha" dx={5} dy={4} result="o1" />
          <feComposite in="SourceAlpha" in2="o1" operator="out" result="e1" />
          <feGaussianBlur in="e1" stdDeviation={1.5} result="e1b" />
          <feFlood floodColor={rimColor} />
          <feComposite in2="e1b" operator="in" result="r1" />
          {/* rim kanan (amber) */}
          <feOffset in="SourceAlpha" dx={-5} dy={2} result="o2" />
          <feComposite in="SourceAlpha" in2="o2" operator="out" result="e2" />
          <feGaussianBlur in="e2" stdDeviation={1.5} result="e2b" />
          <feFlood floodColor={rimColor2} />
          <feComposite in2="e2b" operator="in" result="r2" />
          <feMerge result="rims"><feMergeNode in="r1" /><feMergeNode in="r2" /></feMerge>
          <feGaussianBlur in="rims" stdDeviation={6} result="rimGlow" />
          {/* backlight: siluet melebar + blur amber di belakang badan */}
          <feMorphology in="SourceAlpha" operator="dilate" radius={4} result="dil" />
          <feGaussianBlur in="dil" stdDeviation={16} result="dilB" />
          <feFlood floodColor={rimColor2} floodOpacity={0.42} />
          <feComposite in2="dilB" operator="in" result="back" />
          <feMerge>
            <feMergeNode in="back" />
            <feMergeNode in="rimGlow" />
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="rims" />
          </feMerge>
        </filter>
      </defs>
      {/* bayangan di lantai */}
      <ellipse cx={0} cy={6} rx={110} ry={16} fill="#000" opacity={0.28} />
      <g filter={rim ? `url(#${fid}-rim)` : undefined}>{body}</g>
    </g>
  );
};
