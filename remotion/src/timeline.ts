// Timeline potongan audio. Sumber: Whisper small (word-level timestamps) -> data/whisper_words.json.
// start/end dalam detik (voiceover.m4a). Visual dimulai ~3 frame sebelum kata pertama.
// beats: waktu (detik, absolut) untuk beat visual tambahan bila potongan > 2,5 dtk.
export type SfxName = 'bass_hit' | 'alert_glitch' | 'thud' | 'brake_snap' | 'shimmer_rise' | 'chain_break';

export type Cut = {id: number; text: string; start: number; end: number; beats?: number[]; sfx?: {name: SfxName; at: number}};

export const VO_DURATION = 75.372;

export const CUTS: Cut[] = [
  {id: 1, text: 'Pornografi itu', start: 0.0, end: 0.84},
  {id: 2, text: 'beneran bikin otak lo makin bodoh.', start: 0.84, end: 2.8, sfx: {name: 'bass_hit', at: 2.2}},
  {id: 3, text: 'Ini bukan sekadar ceramah moral,', start: 2.8, end: 4.42},
  {id: 4, text: 'tapi fakta medis', start: 4.42, end: 5.36},
  {id: 5, text: 'soal gimana fungsi otak lo dipreteli pelan-pelan.', start: 5.36, end: 8.3, beats: [6.94]},
  {id: 6, text: 'Hasil scan otak nunjukin', start: 8.3, end: 9.88},
  {id: 7, text: 'kalau pecandu pornografi ngalamin kondisi yang namanya hypofrontality,', start: 9.88, end: 13.86, beats: [11.24, 12.6], sfx: {name: 'alert_glitch', at: 12.6}},
  {id: 8, text: 'alias menurunnya fungsi prefrontal cortex.', start: 13.86, end: 16.22, beats: [15.0]},
  {id: 9, text: 'Padahal, bagian otak depan ini', start: 16.22, end: 18.12, beats: [17.1]},
  {id: 10, text: 'adalah mesin utama kepintaran lo', start: 18.12, end: 20.16},
  {id: 11, text: 'tempat lo mikir kompleks,', start: 20.16, end: 21.5},
  {id: 12, text: 'nyusun strategi,', start: 21.5, end: 22.66},
  {id: 13, text: 'ngerencanain masa depan,', start: 22.66, end: 23.96},
  {id: 14, text: 'nyerap teori rumit,', start: 23.96, end: 24.96},
  {id: 15, text: 'sampai ngerem kelakuan buruk.', start: 24.96, end: 26.6},
  {id: 16, text: 'Masalahnya, kita juga punya yang namanya otak tengah.', start: 26.6, end: 29.82, beats: [27.5, 28.86]},
  {id: 17, text: 'Bagian ini lebih kuno,', start: 29.82, end: 31.32},
  {id: 18, text: 'mirip struktur otak hewan,', start: 31.32, end: 32.7},
  {id: 19, text: 'dan cuma ngurusin insting dasar kayak makan dan berkembang biak.', start: 32.7, end: 36.12, beats: [34.2, 34.82]},
  {id: 20, text: 'Karena otak tengah ini nggak pinter-pinter amat,', start: 36.12, end: 38.5},
  {id: 21, text: 'dia ketipu sama layar dua dimensi', start: 38.5, end: 40.38},
  {id: 22, text: 'dan ngira bokep itu pasangan sungguhan.', start: 40.38, end: 43.02, beats: [41.88]},
  {id: 23, text: 'Makin sering lo konsumsi pornografi,', start: 43.02, end: 45.12},
  {id: 24, text: 'otak tengah lo makin dominan', start: 45.12, end: 46.52},
  {id: 25, text: 'dan fungsi prefrontal cortex lo makin lemah.', start: 46.52, end: 48.98, sfx: {name: 'thud', at: 47.2}},
  {id: 26, text: 'Efeknya, rem di otak lo blong.', start: 48.98, end: 50.98, sfx: {name: 'brake_snap', at: 50.0}},
  {id: 27, text: 'Lo jadi kompulsif', start: 50.98, end: 51.98},
  {id: 28, text: 'atau terus-terusan ngulangin kebiasaan itu', start: 51.98, end: 54.04},
  {id: 29, text: 'padahal lo nggak mau.', start: 54.04, end: 55.42},
  {id: 30, text: 'Lo jadi impulsif,', start: 55.42, end: 56.58},
  {id: 31, text: 'gampang lepas kontrol sama emosi atau hawa nafsu,', start: 56.58, end: 59.12, beats: [58.24]},
  {id: 32, text: 'dan otak lo jadi tumpul pas harus mikir strategi atau masa depan.', start: 59.12, end: 62.98, beats: [60.68, 62.02]},
  {id: 33, text: 'Tapi kabar baiknya,', start: 62.98, end: 64.28, sfx: {name: 'shimmer_rise', at: 62.98}},
  {id: 34, text: 'kerusakan fungsi ini nggak permanen.', start: 64.28, end: 66.28},
  {id: 35, text: 'Lewat mekanisme neuroplasticity,', start: 66.28, end: 68.2},
  {id: 36, text: 'otak lo bisa pulih dan benerin dirinya sendiri.', start: 68.2, end: 70.9, beats: [69.26]},
  {id: 37, text: 'Lo bisa miliki konsepnya lewat link di bio', start: 70.9, end: 72.94},
  {id: 38, text: 'buat lepas dari adiksi PMO.', start: 72.94, end: VO_DURATION, sfx: {name: 'chain_break', at: 73.4}},
];
