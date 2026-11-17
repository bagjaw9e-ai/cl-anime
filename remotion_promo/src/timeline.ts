// Timeline: beat storyboard + word-level timestamp Whisper small (data/words.json, ejaan = naskah).
// Beat mulai di kata pertamanya. Durasi video = voiceover (14,68 dtk) + 2 dtk end card.
import WORDS_JSON from '../data/words.json';

export const FPS_T = 30;
export const VO_DURATION = 14.68;
export const END_CARD = 2;
export const END_DURATION = VO_DURATION + END_CARD;
export const TOTAL_FRAMES = Math.ceil(END_DURATION * FPS_T);

export type Word = {w: string; s: number; e: number};
export const WORDS = WORDS_JSON as Word[];
const ws = (w: string, nth = 0) => WORDS.filter((x) => x.w.replace(/[^\w-]/g, '').toLowerCase() === w.toLowerCase())[nth].s;

export type Beat = {id: number; text: string; start: number};
const RAW: Beat[] = [
  {id: 1, text: 'Lepas dari adiksi PMO', start: 0},
  {id: 2, text: 'dan pulihkan otak yang mulai tersakiti.', start: ws('dan')},
  {id: 3, text: 'Pakai metode ilmiah', start: ws('pakai')},
  {id: 4, text: 'lewat konsep neuroplasticity.', start: ws('lewat')},
  {id: 5, text: 'Semua rahasianya udah gua bongkar habis', start: ws('semua')},
  {id: 6, text: 'tanpa basa-basi.', start: ws('tanpa')},
  {id: 7, text: 'Langsung cek e-book dan video Stop PMO', start: ws('langsung')},
  {id: 8, text: 'by PMO Savior', start: ws('by')},
  {id: 9, text: 'lewat link di bio sekarang ini.', start: ws('lewat', 1)},
  {id: 10, text: '(end card)', start: VO_DURATION},
];

export const BEATS = RAW.map((b, i) => {
  const end = i + 1 < RAW.length ? RAW[i + 1].start : END_DURATION;
  return {...b, end, f0: Math.round(b.start * FPS_T), f1: Math.round(end * FPS_T)};
});
export const beatF = (id: number, off = 0) => BEATS[id - 1].f0 + off;
export const beatAt = (f: number) => BEATS.filter((b) => b.f0 <= f).pop() ?? BEATS[0];
export const wordF = (w: string, nth = 0) => Math.round(ws(w, nth) * FPS_T);
