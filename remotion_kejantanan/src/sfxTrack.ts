// SFX 3 lapis (tanpa BGM). Semua cue di FRAME KEJADIAN (sesuai kode ilustrasi/karakter).
//  kind 'imp' = SFX PENTING (beat ★, berlapis: impact + elemen + ekor reverb)      -> -9 dB relatif voice
//  kind 'ill' = SFX ilustrasi masuk / event kecil (badge, label, ikon, partikel)       -> -18 dB
//  kind 'out' = SFX ilustrasi keluar (whoosh/pop kecil)                                 -> -23 dB
//  kind 'cam' = SFX gerak kamera (air whoosh / swell / sub-rumble, low-pass, panjang = durasi gerak) -> -28 dB
// Mixer (scripts/mix_sfx.py): ducking 3-4 dB saat narasi, sunyi 4 frame sebelum impact, maks 3 bunyi barengan
// (1 kamera + 2 ilustrasi), kamera dimatikan saat barengan SFX penting, fade 2-4 frame, variasi pitch, limiter -1 dBFS.
import {ILLS} from './illustrationTrack';
import {MOVES} from './cameraTrack';
import {NEON_ON, beatF} from './timeline';

export type Kind = 'imp' | 'ill' | 'out' | 'cam';
export type Cue = {beat: number; f: number; sfx: string; kind: Kind; db?: number; rate?: number; len?: number; carry?: boolean; note?: string};

const B = (id: number, off = 0) => beatF(id) + off;
const inF = (key: string, off = 0) => ILLS.find((i) => i.key === key)!.in + off;
const c = (beat: number, f: number, sfx: string, kind: Kind = 'ill', o: Partial<Cue> = {}): Cue => ({beat, f, sfx, kind, ...o});

const ILL_CUES: Cue[] = [
  // A
  c(1, inF('shield'), 'warm_swell', 'ill', {note: 'perisai muncul (hum hangat)'}),
  c(1, inF('shield', 8), 'chime_soft', 'ill', {note: 'kilau perisai'}),
  c(2, B(2, 6), 'imp_glass_crack', 'imp', {note: 'perisai retak + impact bass'}),
  c(2, inF('phoneRed'), 'phone_hum', 'ill', {note: 'HP glow muncul'}),
  c(3, inF('hourglass'), 'sand_flow', 'ill', {note: 'pasir mengalir'}),
  c(4, inF('calendar'), 'pop_soft', 'ill', {note: 'kalender pop'}),
  c(4, inF('calendar', 13), 'check_tick', 'ill', {note: 'centang hijau'}),
  c(5, B(5, 2), 'whistle', 'ill', {note: 'siulan cuek'}),
  c(5, inF('shadow', 8), 'crack_soft', 'ill', {note: 'bayangan retak'}),
  // B
  c(6, inF('holoBrain'), 'holo_blip', 'ill', {note: 'hologram nyala'}),
  ...[0, 6, 12].map((o, i) => c(7, inF('threeSlots', o), 'chess_tap', 'ill', {rate: 1 + i * 0.12, note: `slot ${i + 1} muncul (ketukan)`})),
  c(7, inF('threeSlots', 19), 'pop_soft', 'ill', {rate: 1.2, note: 'badge 3'}),
  c(8, B(8, 4), 'sparkle', 'ill', {note: 'kado NEW'}),
  c(9, B(9, 4), 'pop_soft', 'ill', {note: 'hati senyum'}),
  c(9, B(9, 6), 'bulb_ding', 'ill', {note: 'ding'}),
  c(10, B(10, 4), 'molecule_whoosh', 'ill', {note: 'heliks DNA'}),
  c(11, inF('phoneBig'), 'dark_hum', 'ill', {note: 'HP besar, dengung gelap'}),
  c(12, B(12, 2), 'suction', 'ill', {note: '3 bola tersedot'}),
  c(12, B(12, 26), 'merge_pop', 'ill', {note: 'menyatu di HP'}),
  c(13, B(13, 2), 'imp_flash', 'imp', {note: 'HP flash + impact'}),
  c(13, B(13, 8), 'pop_soft', 'ill', {rate: 0.85, note: 'badge 3 IN 1'}),
  // C
  c(14, inF('dopamine'), 'imp_dopamine', 'imp', {note: 'semburan dopamin + bubbling + bass swell'}),
  c(15, inF('hook'), 'reel', 'ill', {note: 'reel pancing'}),
  c(15, B(15, 6), 'string_zip', 'ill', {note: 'tarikan kail di kerah'}),
  c(16, B(16, 0), 'tap_tap', 'ill', {note: 'tap-tap berirama'}),
  c(16, inF('loop'), 'loop_whoosh', 'ill', {note: 'panah loop orbit'}),
  c(17, inF('wifi'), 'digital_signal', 'ill', {note: 'sinyal wifi'}),
  c(18, inF('scroll'), 'scroll_fast', 'ill', {note: 'scroll tanpa henti + ∞'}),
  c(19, inF('tap'), 'click_sharp', 'ill', {note: 'klik jempol + riak'}),
  c(20, inF('cards'), 'card_burst', 'ill', {note: 'ledakan kartu'}),
  c(21, inF('wall'), 'imp_digital_boom', 'imp', {note: 'riuh digital menumpuk + boom'}),
  c(21, inF('wall', 16), 'pop_soft', 'ill', {rate: 0.8, note: 'tag 1000+'}),
  // D
  c(22, inF('frozenBrain'), 'ice_freeze', 'ill', {note: 'es membeku'}),
  c(23, inF('knob'), 'knob_turn', 'ill', {note: 'kenop diputar'}),
  c(23, inF('knob', 6), 'muffle_down', 'ill', {note: 'suara meredup (low-pass)'}),
  c(24, inF('flower'), 'wilt', 'ill', {note: 'bunga layu'}),
  c(25, inF('star'), 'sparkle', 'ill', {rate: 1.15, note: 'bintang berkilau'}),
  c(26, B(26, 4), 'imp_deflate', 'imp', {note: 'bintang jadi abu, deflate berat'}),
  c(26, B(26, 16), 'yawn', 'ill', {note: 'menguap'}),
  c(27, inF('clock'), 'clock_fast', 'ill', {note: 'tik-tok dipercepat'}),
  c(28, inF('gauge'), 'gauge_rise', 'ill', {note: 'jarum gauge naik'}),
  c(28, inF('gauge', 26), 'alarm_soft', 'ill', {note: 'zona merah + api'}),
  c(29, B(29, 2), 'imp_warp', 'imp', {note: 'spiral, wobble/warp + impact'}),
  c(30, B(30, 0), 'treadmill_run', 'ill', {note: 'lari di treadmill'}),
  // E
  c(31, inF('room'), 'wind_soft', 'ill', {note: 'angin sepi + tumbleweed'}),
  c(32, inF('icons'), 'crickets', 'ill', {note: 'jangkrik'}),
  ...[10, 17, 24].map((o, i) => c(32, inF('icons', o), 'pop_out', 'ill', {rate: 1 + i * 0.1, note: `ikon ${['stik game', 'buku', 'chat'][i]} hilang`})),
  c(33, inF('bubble'), 'bubble_pop', 'ill', {note: 'thought bubble muncul'}),
  c(33, inF('bubble', 30), 'whoosh_soft', 'ill', {note: 'bubble kabur ke atas'}),
  c(34, inF('autopilot'), 'servo', 'ill', {note: 'servo mekanis tangan autopilot'}),
  c(34, inF('autopilot', 10), 'pop_soft', 'ill', {rate: 0.9, note: 'badge AUTOPILOT'}),
  c(35, inF('battery'), 'blip_nope', 'ill', {note: 'baterai hijau, blip nope'}),
  c(36, B(36, 2), 'imp_drain', 'imp', {note: 'baterai terkuras + bass drop'}),
  c(37, inF('chart'), 'monitor_beep', 'ill', {note: 'papan medis'}),
  c(37, inF('chart', 8), 'level_rise', 'ill', {note: 'meteran naik mentok'}),
  c(38, B(38, 2), 'imp_panic', 'imp', {note: 'alarm panik + detak jantung'}),
  c(39, inF('flatline'), 'imp_flatline', 'imp', {note: 'flatline (sunyi sebelumnya)'}),
  // F
  c(40, B(40, 0), 'imp_spotlight', 'imp', {note: 'spotlight thunk + swell hangat'}),
  c(41, B(41, 12), 'whoosh_throw', 'ill', {note: 'HP dilempar'}),
  c(41, B(41, 38), 'phone_far', 'ill', {note: 'HP jatuh jauh'}),
  c(42, B(42, 0), 'zip_jacket', 'ill', {note: 'zip jaket (fixing collar)'}),
  ...[0, 1, 2].map((i) => c(42, inF('checklist', 9 + i * 9), 'check_tick', 'ill', {rate: 1 + i * 0.08, note: `centang ${i + 1}`})),
  c(43, inF('guide'), 'book_open', 'ill', {note: 'buku terbuka'}),
  c(43, inF('guide', 10), 'chime_soft', 'ill', {rate: 1.2, note: 'glow teal'}),
  c(44, B(44, NEON_ON[0][0]), 'imp_neon', 'imp', {note: 'neon nyala (buzz + klik berlapis)'}),
  ...NEON_ON.slice(1).map(([o], i) => c(44, B(44, o), 'neon_click', 'ill', {rate: 1 + i * 0.05, note: `flicker ${i + 2}`})),
  c(44, B(44, NEON_ON[NEON_ON.length - 1][0] + 6), 'neon_hum', 'ill', {carry: true, db: -24, note: 'hum neon (sampai end card)'}),
  c(45, inF('rewired'), 'imp_rewire', 'imp', {note: 'sparkle + swell saraf nyambung'}),
  ...Array.from({length: 7}).map((_, i) => c(45, inF('rewired', 16 + i * 7), 'ting_short', 'ill', {rate: 1 + i * 0.06, note: `neuron nyambung ${i + 1}`})),
  c(46, B(46, 30), 'imp_end_hit', 'imp', {note: 'end card: hit penutup lembut'}),
];

// SFX ilustrasi keluar (otomatis): pop kecil untuk ilustrasi slot, whoosh tipis untuk latar besar
const NO_OUT = new Set(['logo', 'tossPhone', 'threeSlots', 'bubble']);
const OUT_CUES: Cue[] = ILLS.filter((i) => !NO_OUT.has(i.key) && i.out < 90000).map((i) =>
  c(i.beat, i.out, i.slot === 'behind' || i.slot === 'floor' ? 'whoosh_trans' : 'pop_out', 'out', {note: `${i.key} keluar`}));

// SFX kamera (otomatis dari MOVES): cepat -> air whoosh, push/zoom -> swell, pull-out jauh -> sub-rumble,
// pan/tilt -> air tipis; drift pelan tanpa SFX.
const CAM_CUES: Cue[] = MOVES.filter((m) => m.kind !== 'drift' && m.kind !== 'orbit').map((m) => {
  const k = m.kind;
  const sfx = /whip|quick|punch|extreme|follow|dutch/.test(k) ? 'cam_whoosh'
    : /jauh|lebar/.test(k) ? 'cam_rumble'
    : /push|zoom|hero|logo/.test(k) ? 'cam_swell' : 'cam_air';
  const beat = [...Array(46).keys()].map((i) => i + 1).filter((id) => beatF(id) <= m.f).pop() ?? 1;
  return c(beat, m.f, sfx, 'cam', {len: m.d, note: `kamera: ${k}`});
});

export const SFX_CUES: Cue[] = [...ILL_CUES, ...OUT_CUES, ...CAM_CUES].sort((a, b) => a.f - b.f);
export const LEVELS: Record<Kind, number> = {imp: -9, ill: -18, out: -23, cam: -28};
