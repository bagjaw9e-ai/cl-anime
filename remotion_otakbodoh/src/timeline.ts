// Timeline video "otak bodoh": 57 beat storyboard + word-level Whisper small (data/words.json, ejaan = naskah;
// scripts/build_words.py, scripts/build_timeline.py). Durasi video = durasi BGM_4.m4a PERSIS (ffprobe 129,497 dtk -> 3885 frame).
// VO mulai frame 0; sisa setelah VO selesai = scene penutup (beat 58) tanpa narasi & tanpa subtitle.
import WORDS_JSON from '../data/words.json';
import BEATS_JSON from '../data/beats.json';

export const FPS_T = 30;
export const BGM_DURATION = 129.497;                         // ffprobe public/bgm.m4a
export const TOTAL_FRAMES = Math.round(BGM_DURATION * FPS_T); // 3885
export const VO_DURATION = 128.1;                            // kata terakhir "tempat." selesai 128,06 dtk
export const VO_FRAMES = Math.round(VO_DURATION * FPS_T);     // 3843 -> penutup 42 frame
export const END_DURATION = TOTAL_FRAMES / FPS_T;

export type Word = {w: string; s: number; e: number};
export const WORDS = WORDS_JSON as Word[];
export type Section = 'HOOK' | 'ONESHOT' | 'F1' | 'PMO' | 'F2' | 'F3' | 'MD' | 'END';
type RawBeat = {id: number; sec: Section; w0: number; w1: number; start: number; text: string};

const RAW = BEATS_JSON as RawBeat[];
export const CLOSE_BEAT = 58;
export const BEATS = [...RAW, {id: CLOSE_BEAT, sec: 'END' as Section, w0: WORDS.length, w1: WORDS.length, start: VO_DURATION, text: '(penutup)'}].map((b, i, a) => {
  const end = i + 1 < a.length ? a[i + 1].start : END_DURATION;
  return {...b, end, f0: b.id === CLOSE_BEAT ? VO_FRAMES : Math.round(b.start * FPS_T), f1: i + 1 < a.length ? Math.round(end * FPS_T) : TOTAL_FRAMES};
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
