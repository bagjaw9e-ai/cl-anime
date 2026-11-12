// Timeline potongan audio. Sumber: Whisper small (word-level timestamps) -> data/whisper_words.json.
// start/end dalam detik (voiceover.m4a). Visual dimulai ~3 frame sebelum kata pertama.
// beats: waktu (detik, absolut) untuk beat visual tambahan bila potongan > 2,5 dtk.
// hit: waktu (detik, absolut) momen kejadian utama yang dipakai scene (frame relatif = prop `hit`).
// cues: SFX per scene, ditaruh di FRAME KEJADIAN di kode scene. `at` = frame relatif scene (angka) atau token:
//   'hit', 'b0', 'b1', 'dur' (+/- offset), mis. 'hit-15', 'b1+4', 'dur-22'.
//   imp = SFX penting (★, -11 dB relatif voice), default -20 dB. db = override, rate = pitch/kecepatan.
//   carry = boleh lanjut melewati awal SFX scene berikutnya (mis. hum neon sampai end card).
// SFX dirakit jadi satu bus oleh scripts/mix_sfx.py (lihat preview/sfx_map.txt).

export type Cue = {sfx: string; at: number | string; imp?: boolean; db?: number; rate?: number; carry?: boolean};
export type Cut = {id: number; text: string; start: number; end: number; beats?: number[]; hit?: number; cues: Cue[]};

export const FPS_T = 30;
export const VO_DURATION = 75.372;
export const END_CARD = 2.0; // tahan logo setelah narasi
export const END_DURATION = VO_DURATION + END_CARD;
export const TR_T = 9; // frame transisi (sama dengan Transition.TR)

const I = {imp: true};
const Q = {db: -26}; // whoosh transisi pelan
const c = (sfx: string, at: number | string, o: Partial<Cue> = {}): Cue => ({sfx, at, ...o});

// Neon logo nyala di scene 37: interval [mulai, selesai) frame relatif; terakhir = stabil.
export const NEON_ON: Array<[number, number]> = [[8, 10], [13, 15], [18, 99999]];

export const CUTS: Cut[] = [
  {id: 1, text: 'Pornografi itu', start: 0.0, end: 0.84, cues: [c('phone_hum', 0), c('notif_soft', 10)]},
  {id: 2, text: 'beneran bikin otak lo makin bodoh.', start: 0.84, end: 2.8, hit: 2.2, cues: [c('bass_hit', 'hit', I), c('deflate', 'hit', I)]},
  {id: 3, text: 'Ini bukan sekadar ceramah moral,', start: 2.8, end: 4.42, cues: [c('whoosh_fast', 'dur-22')]},
  {id: 4, text: 'tapi fakta medis', start: 4.42, end: 5.36, cues: [c('monitor_beep', 3)]},
  {id: 5, text: 'soal gimana fungsi otak lo dipreteli pelan-pelan.', start: 5.36, end: 8.3, beats: [6.94], cues: [14, 28, 44, 50, 56, 62, 68, 74, 80, 86].map((f) => c('puzzle_click', f))},
  {id: 6, text: 'Hasil scan otak nunjukin', start: 8.3, end: 9.88, cues: [c('whoosh_trans', 0, Q), c('mri_hum_rise', 2)]},
  {id: 7, text: 'kalau pecandu pornografi ngalamin kondisi yang namanya hypofrontality,', start: 9.88, end: 13.86, beats: [11.24, 12.6], hit: 12.6, cues: [c('whoosh_soft', 'b0-6'), c('alert_glitch', 'hit', I)]},
  {id: 8, text: 'alias menurunnya fungsi prefrontal cortex.', start: 13.86, end: 16.22, beats: [15.0], cues: [c('power_down', 2), c('elec_flicker', 'b0')]},
  {id: 9, text: 'Padahal, bagian otak depan ini', start: 16.22, end: 18.12, beats: [17.1], cues: [c('whoosh_trans', 0, Q), c('chime_soft', 'b0-2')]},
  {id: 10, text: 'adalah mesin utama kepintaran lo', start: 18.12, end: 20.16, cues: [c('gear_spin', 0), c('bulb_ding', 22)]},
  {id: 11, text: 'tempat lo mikir kompleks,', start: 20.16, end: 21.5, cues: Array.from({length: 13}).map((_, i) => c('node_pop', Math.round(10 + i * 1.6)))},
  {id: 12, text: 'nyusun strategi,', start: 21.5, end: 22.66, cues: [c('whoosh_trans', 0, Q), c('chess_tap', 6, {db: -24}), c('chess_tap', 22), c('chess_tap', 32)]},
  {id: 13, text: 'ngerencanain masa depan,', start: 22.66, end: 23.96, cues: [c('warm_swell', 0)]},
  {id: 14, text: 'nyerap teori rumit,', start: 23.96, end: 24.96, cues: [c('suck_swoosh', 10)]},
  {id: 15, text: 'sampai ngerem kelakuan buruk.', start: 24.96, end: 26.6, cues: [c('pedal_stomp', 13)]},
  {id: 16, text: 'Masalahnya, kita juga punya yang namanya otak tengah.', start: 26.6, end: 29.82, beats: [27.5, 28.86], cues: [c('dive_whoosh', 6), c('low_rumble', 'b0')]},
  {id: 17, text: 'Bagian ini lebih kuno,', start: 29.82, end: 31.32, cues: [c('stone_rumble', 0)]},
  {id: 18, text: 'mirip struktur otak hewan,', start: 31.32, end: 32.7, cues: [c('whoosh_trans', 0, Q), c('lizard_hiss', 2), c('monkey_chatter', 9, {db: -23})]},
  {id: 19, text: 'dan cuma ngurusin insting dasar kayak makan dan berkembang biak.', start: 32.7, end: 36.12, beats: [34.2, 34.82], cues: [c('pop_soft', 'b0-2'), c('bird_chirp', 'b1+4')]},
  {id: 20, text: 'Karena otak tengah ini nggak pinter-pinter amat,', start: 36.12, end: 38.5, cues: [c('bonk', 34, I), c('twinkle_stars', 37, I)]},
  {id: 21, text: 'dia ketipu sama layar dua dimensi', start: 38.5, end: 40.38, cues: [c('whoosh_trans', 0, Q), c('hmm_cartoon', 6), c('pop_soft', 30)]},
  {id: 22, text: 'dan ngira bokep itu pasangan sungguhan.', start: 40.38, end: 43.02, beats: [41.88], cues: [c('boing', 'b0-4'), c('paper_flap', 'b0')]},
  {id: 23, text: 'Makin sering lo konsumsi pornografi,', start: 43.02, end: 45.12, cues: [c('clock_fast', 0)]},
  {id: 24, text: 'otak tengah lo makin dominan', start: 45.12, end: 46.52, cues: [c('rumble_rise', 0), c('heartbeat_heavy', 4)]},
  {id: 25, text: 'dan fungsi prefrontal cortex lo makin lemah.', start: 46.52, end: 48.98, hit: 47.2, cues: [c('fall_whoosh', 'hit-10'), c('thud', 'hit', I)]},
  {id: 26, text: 'Efeknya, rem di otak lo blong.', start: 48.98, end: 50.98, hit: 50.0, cues: [c('brake_snap', 'hit-15', I), c('engine_roar', 'hit')]},
  {id: 27, text: 'Lo jadi kompulsif', start: 50.98, end: 51.98, cues: [c('wheel_creak', 0)]},
  {id: 28, text: 'atau terus-terusan ngulangin kebiasaan itu', start: 51.98, end: 54.04, cues: [c('tape_rewind', 15), c('tape_rewind', 36)]},
  {id: 29, text: 'padahal lo nggak mau.', start: 54.04, end: 55.42, cues: [1, 10, 20, 30].map((f) => c('string_zip', f))},
  {id: 30, text: 'Lo jadi impulsif,', start: 55.42, end: 56.58, cues: [c('thunder_crack', 2, I), c('thunder_crack', 15, {...I, db: -15})]},
  {id: 31, text: 'gampang lepas kontrol sama emosi atau hawa nafsu,', start: 56.58, end: 59.12, beats: [58.24], cues: [c('steam_hiss', 0), c('rope_snap', 'b0')]},
  {id: 32, text: 'dan otak lo jadi tumpul pas harus mikir strategi atau masa depan.', start: 59.12, end: 62.98, beats: [60.68, 62.02], cues: [14, 22, 30, 38, 44].map((f) => c('piece_fall', f)).concat([c('wind_soft', 'b0'), c('gear_jam', 'b1')])},
  {id: 33, text: 'Tapi kabar baiknya,', start: 62.98, end: 64.28, hit: 62.98, cues: [c('shimmer_rise', 'hit', I)]},
  {id: 34, text: 'kerusakan fungsi ini nggak permanen.', start: 64.28, end: 66.28, cues: [c('crystal_ting', 14), c('crystal_ting', 26, {rate: 1.12})]},
  {id: 35, text: 'Lewat mekanisme neuroplasticity,', start: 66.28, end: 68.2, cues: [c('grow_soft', 4), c('sparkle', 22)]},
  {id: 36, text: 'otak lo bisa pulih dan benerin dirinya sendiri.', start: 68.2, end: 70.9, beats: [69.26], cues: [c('whoosh_trans', 0, Q), c('swell_positive', 2), c('confident_stomp', 'b0')]},
  {id: 37, text: 'Lo bisa miliki konsepnya lewat link di bio', start: 70.9, end: 72.94, cues: NEON_ON.map(([f]) => c('neon_click', f, I)).concat([c('neon_hum', NEON_ON[NEON_ON.length - 1][0], {carry: true, db: -22})])},
  {id: 38, text: 'buat lepas dari adiksi PMO.', start: 72.94, end: VO_DURATION, hit: 73.4, cues: [c('chain_break_sparkle', 'hit', I)]},
  {id: 39, text: '(end card logo)', start: VO_DURATION, end: END_DURATION, cues: []},
];

export const TOTAL_FRAMES = Math.ceil(END_DURATION * FPS_T);
export const STARTS = CUTS.map((cut, i) => (i === 0 ? 0 : Math.round(cut.start * FPS_T) - 3));

export const sceneWindow = (i: number) => {
  const from = STARTS[i];
  const last = i === CUTS.length - 1;
  const dur = (last ? TOTAL_FRAMES : STARTS[i + 1]) - from + (last ? 0 : TR_T);
  const b = (CUTS[i].beats ?? []).map((x) => Math.round(x * FPS_T) - from);
  const hit = CUTS[i].hit !== undefined ? Math.round(CUTS[i].hit! * FPS_T) - from : -999;
  return {from, dur, b, hit};
};

// Resolusi cue -> frame absolut
export const resolveCues = () =>
  CUTS.flatMap((cut, i) => {
    const w = sceneWindow(i);
    return cut.cues.map((q) => {
      let rel: number;
      if (typeof q.at === 'number') rel = q.at;
      else {
        const m = /^(hit|b0|b1|dur)([+-]\d+)?$/.exec(q.at);
        if (!m) throw new Error('cue at tidak valid: ' + q.at);
        const base = m[1] === 'hit' ? w.hit : m[1] === 'dur' ? w.dur : w.b[m[1] === 'b0' ? 0 : 1];
        rel = base + (m[2] ? parseInt(m[2], 10) : 0);
      }
      return {scene: cut.id, sfx: q.sfx, rel, frame: w.from + rel, imp: !!q.imp, db: q.db, rate: q.rate ?? 1, carry: !!q.carry};
    });
  });
