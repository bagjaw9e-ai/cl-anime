// Timeline: beat (storyboard) + word-level timestamp (Whisper small, dikoreksi ke ejaan naskah: data/words.json).
// start = detik kata pertama beat; frame = detik * 30. Durasi video = voiceover + 2,5 dtk end card.
import WORDS_JSON from '../data/words.json';

export const FPS_T = 30;
export const VO_DURATION = 105.07;
export const END_CARD = 2.5;
export const END_DURATION = VO_DURATION + END_CARD;
export const TOTAL_FRAMES = Math.ceil(END_DURATION * FPS_T);

export type Word = {w: string; s: number; e: number};
export const WORDS = WORDS_JSON as Word[];

export type Section = 'HOOK' | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'CTA' | 'END';
export type Beat = {id: number; sec: Section; text: string; start: number; imp?: boolean; callout?: boolean};

const RAW: Beat[] = [
  {id: 1, sec: 'HOOK', text: 'Apa yang terjadi pada otak', start: 0.0, imp: true},
  {id: 2, sec: 'HOOK', text: 'kalau lo enggak coli', start: 1.36},
  {id: 3, sec: 'HOOK', text: 'selama 30 hari?', start: 2.44, imp: true, callout: true},
  {id: 4, sec: 'F1', text: 'Tiga hari pertama', start: 3.62, callout: true},
  {id: 5, sec: 'F1', text: 'adalah fase yang paling berat.', start: 4.42, imp: true},
  {id: 6, sec: 'F1', text: 'Bukan karena tubuh lo butuh,', start: 6.7},
  {id: 7, sec: 'F1', text: 'tapi karena otak lo udah hafal polanya:', start: 8.14},
  {id: 8, sec: 'F1', text: 'bosen,', start: 10.36},
  {id: 9, sec: 'F1', text: 'sendirian,', start: 11.12},
  {id: 10, sec: 'F1', text: 'pegang HP', start: 11.92},
  {id: 11, sec: 'F1', text: 'langsung balik buka bokep', start: 12.46},
  {id: 12, sec: 'F1', text: 'dan onani.', start: 13.74},
  {id: 13, sec: 'F1', text: 'Fase ini, lo akan merasakan gejala withdrawal', start: 14.56, imp: true, callout: true},
  {id: 14, sec: 'F1', text: 'atau sakau.', start: 16.84},
  {id: 15, sec: 'F2', text: 'Sekitar hari ketujuh,', start: 17.96},
  {id: 16, sec: 'F2', text: 'satu studi dari Journal of Zhejiang University-SCIENCE', start: 19.26, imp: true},
  {id: 17, sec: 'F2', text: 'bilang kalau kadar testosteron pria', start: 22.08},
  {id: 18, sec: 'F2', text: 'naik sampai sekitar 145% dari normal,', start: 24.04, imp: true, callout: true},
  {id: 19, sec: 'F2', text: 'terus balik lagi ke level biasa.', start: 27.46},
  {id: 20, sec: 'F2', text: 'Jadi bukan jadi Superman,', start: 28.9, callout: true},
  {id: 21, sec: 'F2', text: 'cuma tanda tubuh lo lagi menyesuaikan.', start: 30.86},
  {id: 22, sec: 'F3', text: 'Masuk ke fase yang datar, yaitu di minggu kedua.', start: 32.92, callout: true},
  {id: 23, sec: 'F3', text: 'Banyak yang ngerasa lesu,', start: 35.94},
  {id: 24, sec: 'F3', text: 'libido drop,', start: 37.32},
  {id: 25, sec: 'F3', text: 'mood datar.', start: 38.26},
  {id: 26, sec: 'F3', text: 'Fase ini biasa disebut flatline.', start: 39.22, imp: true, callout: true},
  {id: 27, sec: 'F3', text: 'Otak bagian amigdala', start: 41.5},
  {id: 28, sec: 'F3', text: 'sedang menyesuaikan kadar dopamin ke level yang normal.', start: 42.56},
  {id: 29, sec: 'F3', text: 'Jadi wajar kalau lo ngerasa gelisah,', start: 45.56},
  {id: 30, sec: 'F3', text: 'karena hormon kebahagiaan biasanya naik dari PMO,', start: 47.98},
  {id: 31, sec: 'F3', text: 'dan sekarang otak lo sedang didetoks dari bokep dan coli.', start: 50.94, imp: true, callout: true},
  {id: 32, sec: 'F4', text: 'Masuk ke minggu ketiga dan minggu terakhir.', start: 54.46, imp: true, callout: true},
  {id: 33, sec: 'F4', text: 'Setiap kali lo berhasil nahan dorongan PMO,', start: 56.48},
  {id: 34, sec: 'F4', text: 'lo lagi melatih otak buat memilih.', start: 59.26, callout: true},
  {id: 35, sec: 'F4', text: 'Di fase ini banyak orang mulai merasa punya waktu lebih banyak,', start: 61.34},
  {id: 36, sec: 'F4', text: 'fokus mereka juga jadi lebih panjang.', start: 64.64},
  {id: 37, sec: 'F4', text: 'Yang paling penting, lo bukan lagi orang yang dikendalikan sama hawa nafsu.', start: 66.74, imp: true},
  {id: 38, sec: 'F4', text: 'Lo bisa kontrol otak tengah', start: 70.7},
  {id: 39, sec: 'F4', text: 'dan otak bagian PFC kembali lebih dominan.', start: 72.1, imp: true, callout: true},
  {id: 40, sec: 'F5', text: 'Tapi ingat, rata-rata kebiasaan baru butuh sekitar 66 hari buat nempel.', start: 74.74, imp: true, callout: true},
  {id: 41, sec: 'F5', text: 'Jadi 30 hari itu bukan garis finish,', start: 79.4, callout: true},
  {id: 42, sec: 'F5', text: 'itu baru awal lo pegang kendali.', start: 81.8},
  {id: 43, sec: 'F5', text: 'Lo juga akan mengalami mimpi basah dan itu adalah hal normal.', start: 83.26, callout: true},
  {id: 44, sec: 'F5', text: 'Mimpi basah merupakan cara sperma keluar secara organik,', start: 87.26},
  {id: 45, sec: 'F5', text: 'bukan artifisial atau paksaan seperti dari onani.', start: 90.26},
  {id: 46, sec: 'CTA', text: 'Miliki juga konsep neuroplasticity', start: 93.16},
  {id: 47, sec: 'CTA', text: 'agar lo tidak ngasal dan salah langkah,', start: 95.3},
  {id: 48, sec: 'CTA', text: 'dan bisa memulihkan kerusakan di otak akibat PMO.', start: 97.38},
  {id: 49, sec: 'CTA', text: 'Miliki lewat link di bio,', start: 100.22, imp: true, callout: true},
  {id: 50, sec: 'CTA', text: 'dijamin efektif buat lo sebagai pecandu berat PMO.', start: 101.62},
  {id: 51, sec: 'END', text: '(end card)', start: VO_DURATION},
];

export const BEATS = RAW.map((b, i) => {
  const end = i + 1 < RAW.length ? RAW[i + 1].start : END_DURATION;
  return {...b, end, f0: Math.round(b.start * FPS_T), f1: Math.round(end * FPS_T)};
});
export const beatF = (id: number, off = 0) => BEATS[id - 1].f0 + off;
export const beatAt = (f: number) => BEATS.filter((b) => b.f0 <= f).pop() ?? BEATS[0];

// Label fase (chip atas). Mulai [HARI 0] di hook, bertambah sepanjang video.
export type Phase = {from: number; num: string; label: string; color: string};
export const PHASES: Phase[] = [
  {from: 0, num: '0', label: 'HARI 0', color: '#8A7A9A'},
  {from: beatF(4), num: '1', label: 'HARI 1–3', color: '#FF4D5A'},
  {from: beatF(15), num: '7', label: 'HARI 7', color: '#4FB3A9'},
  {from: beatF(22), num: '14', label: 'MINGGU 2', color: '#7E8CC8'},
  {from: beatF(32), num: '21', label: 'MINGGU 3–4', color: '#FFB547'},
  {from: beatF(40), num: '66', label: '66 HARI', color: '#8FD36A'},
];
export const phaseAt = (f: number) => PHASES.filter((p) => p.from <= f).pop()!;

// Neon logo (beat 49): interval nyala [mulai, selesai) frame relatif dari awal beat 49; terakhir = stabil.
export const NEON_ON: Array<[number, number]> = [[6, 8], [11, 13], [16, 99999]];
