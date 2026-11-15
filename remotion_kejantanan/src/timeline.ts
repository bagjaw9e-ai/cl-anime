// Timeline beat. Sumber: Whisper small (word-level) -> data/whisper_words.json, dicocokkan dengan naskah.
// start = detik kata pertama beat (voiceover.m4a); end = start beat berikutnya. Frame = detik * 30.
export const FPS_T = 30;
export const VO_DURATION = 81.711;
export const END_CARD = 2.0;
export const END_DURATION = VO_DURATION + END_CARD;
export const TOTAL_FRAMES = Math.ceil(END_DURATION * FPS_T);

export type Part = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'END';
export type Beat = {id: number; part: Part; text: string; start: number; imp?: boolean};

const RAW: Beat[] = [
  {id: 1, part: 'A', text: 'Secara kejantanan,', start: 0.0},
  {id: 2, part: 'A', text: 'pornografi membunuhmu', start: 1.3, imp: true},
  {id: 3, part: 'A', text: 'secara perlahan.', start: 2.7},
  {id: 4, part: 'A', text: 'Efeknya memang tidak (terasa) hari ini,', start: 3.8},
  {id: 5, part: 'A', text: 'namun kamu tidak sadari.', start: 5.42},
  {id: 6, part: 'B', text: 'Padahal menurut sains,', start: 6.88},
  {id: 7, part: 'B', text: 'otak manusia itu dirancang menyukai tiga hal alami:', start: 8.48},
  {id: 8, part: 'B', text: 'sesuatu yang baru ditemui,', start: 11.58},
  {id: 9, part: 'B', text: 'hal menyenangkan di hati,', start: 13.08},
  {id: 10, part: 'B', text: 'dan urusan reproduksi.', start: 14.44},
  {id: 11, part: 'B', text: 'Celakanya, tontonan pornografi', start: 15.74},
  {id: 12, part: 'B', text: 'menggabungkan ketiganya sekaligus', start: 17.76},
  {id: 13, part: 'B', text: 'dalam satu kali aksi.', start: 19.42, imp: true},
  {id: 14, part: 'C', text: 'Otak melepaskan dopamin berlebihan,', start: 20.68, imp: true},
  {id: 15, part: 'C', text: 'hormon yang memicu rasa ketagihan.', start: 22.66},
  {id: 16, part: 'C', text: 'Membuat kita ingin mengulanginya terus-terusan.', start: 24.5},
  {id: 17, part: 'C', text: 'Masalahnya, internet menyediakan stimulus', start: 26.72},
  {id: 18, part: 'C', text: 'tanpa batasan.', start: 29.26},
  {id: 19, part: 'C', text: 'Hanya dengan satu klik di tangan,', start: 30.46},
  {id: 20, part: 'C', text: 'langsung muncul ratusan video', start: 32.14},
  {id: 21, part: 'C', text: 'dengan ribuan pilihan.', start: 33.62, imp: true},
  {id: 22, part: 'D', text: 'Akibatnya, otak mengalami desensitisasi', start: 35.1},
  {id: 23, part: 'D', text: 'atau mati rasa.', start: 37.62},
  {id: 24, part: 'D', text: 'Perlahan kehilangan sensitivitas alaminya.', start: 38.98},
  {id: 25, part: 'D', text: 'Apa yang dulu terlihat menggoda,', start: 41.54},
  {id: 26, part: 'D', text: 'sekarang terasa hambar dan biasa saja.', start: 43.3, imp: true},
  {id: 27, part: 'D', text: 'Akhirnya, seseorang butuh durasi yang makin lama,', start: 45.74},
  {id: 28, part: 'D', text: 'serta mencari konten yang jauh lebih ekstrem', start: 48.64},
  {id: 29, part: 'D', text: 'dan gila,', start: 50.72, imp: true},
  {id: 30, part: 'D', text: 'hanya demi mengejar sensasi kenikmatan yang sama.', start: 51.64},
  {id: 31, part: 'E', text: 'Tiap kali lo gabut', start: 54.24},
  {id: 32, part: 'E', text: 'dan tidak ada distraksi,', start: 55.24},
  {id: 33, part: 'E', text: 'pikiran lo langsung lari ke arah fantasi.', start: 56.2},
  {id: 34, part: 'E', text: 'Tangan otomatis gerak nyari kepuasan sendiri.', start: 58.72},
  {id: 35, part: 'E', text: 'Padahal badan lo sebenernya lagi nggak pengen', start: 61.04},
  {id: 36, part: 'E', text: 'ejakulasi.', start: 63.12, imp: true},
  {id: 37, part: 'E', text: 'Di dunia medis, ini namanya boredom intolerance tingkat tinggi.', start: 64.02},
  {id: 38, part: 'E', text: 'Sebuah kondisi pas otak lo panik', start: 67.52, imp: true},
  {id: 39, part: 'E', text: 'ngadepin sepi tanpa stimulasi.', start: 69.34, imp: true},
  {id: 40, part: 'F', text: 'Kalau lo pria sejati', start: 71.2, imp: true},
  {id: 41, part: 'F', text: 'yang mau berhenti jadi pecundang', start: 72.28},
  {id: 42, part: 'F', text: 'dan siap berbenah,', start: 73.66},
  {id: 43, part: 'F', text: 'ambil panduan neuroplasticity', start: 74.84},
  {id: 44, part: 'F', text: 'dari PMO Savior yang ada di bio', start: 76.28, imp: true},
  {id: 45, part: 'F', text: 'buat nyambung ulang saraf otak lo yang udah terlanjur parah.', start: 78.3, imp: true},
  {id: 46, part: 'END', text: '(end card)', start: VO_DURATION, imp: true},
];

export const BEATS = RAW.map((b, i) => {
  const end = i + 1 < RAW.length ? RAW[i + 1].start : END_DURATION;
  return {...b, end, f0: Math.round(b.start * FPS_T), f1: Math.round(end * FPS_T)};
});
export const beatF = (id: number) => BEATS[id - 1].f0;

// Neon logo nyala di beat 44: interval [mulai, selesai) frame relatif dari awal beat 44; terakhir = stabil.
export const NEON_ON: Array<[number, number]> = [[8, 10], [13, 15], [18, 99999]];
