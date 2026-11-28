// Timeline video "nikah dengan pecandu" (VO_5): 57 beat storyboard + word-level Whisper small (data/words.json, ejaan = naskah;
// scripts/build_words.py, scripts/build_timeline.py). Durasi video = durasi BGM_5.m4a PERSIS (ffprobe 142,570 dtk -> 4277 frame).
// VO mulai frame 0 (kata terakhir "diri." selesai 142,02 dtk); beat 57 ditahan sampai BGM habis (frame terakhir).
import WORDS_JSON from '../data/words.json';
import BEATS_JSON from '../data/beats.json';

export const FPS_T = 30;
export const BGM_DURATION = 142.57;                          // ffprobe public/bgm.m4a
export const TOTAL_FRAMES = Math.round(BGM_DURATION * FPS_T); // 4277
export const VO_DURATION = 142.05;                           // kata terakhir selesai 142,02 dtk
export const VO_FRAMES = Math.round(VO_DURATION * FPS_T);     // 4262 -> tahan 15 frame
export const END_DURATION = TOTAL_FRAMES / FPS_T;

export type Word = {w: string; s: number; e: number};
export const WORDS = WORDS_JSON as Word[];
export type Section = 'HOOK' | 'ONESHOT' | 'F1' | 'F2' | 'CTA' | 'F3';
type RawBeat = {id: number; sec: Section; w0: number; w1: number; start: number; text: string};

const RAW = BEATS_JSON as RawBeat[];
export const BEATS = RAW.map((b, i, a) => {
  const end = i + 1 < a.length ? a[i + 1].start : END_DURATION;
  return {...b, end, f0: Math.round(b.start * FPS_T), f1: i + 1 < a.length ? Math.round(end * FPS_T) : TOTAL_FRAMES};
});
export type Beat = (typeof BEATS)[number];
export const beatF = (id: number, off = 0) => BEATS[id - 1].f0 + off;
export const beatAt = (f: number) => BEATS.filter((b) => b.f0 <= f).pop() ?? BEATS[0];
// frame kata ke-n di dalam beat (sinkron animasi ke kata kunci)
export const wordInBeat = (beat: number, w: string, nth = 0) => {
  const b = BEATS[beat - 1];
  const hits = WORDS.slice(b.w0, b.w1).filter((x) => x.w.replace(/[^\w-]/g, '').toLowerCase() === w.toLowerCase());
  return Math.round(hits[nth].s * FPS_T);
};
// progres baterai 0..1 = frame / frame terakhir (tepat 100% di frame terakhir)
export const progressAt = (f: number) => Math.max(0, Math.min(1, f / (TOTAL_FRAMES - 1)));
