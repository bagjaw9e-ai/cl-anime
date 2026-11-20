// Timeline: 55 beat storyboard + word-level Whisper small (data/words.json, ejaan = naskah; scripts/build_words.py,
// scripts/build_timeline.py). Durasi video = voiceover + 2 dtk ending.
import WORDS_JSON from '../data/words.json';
import BEATS_JSON from '../data/beats.json';

export const FPS_T = 30;
export const VO_DURATION = 124.69;
export const END_CARD = 2;
export const END_DURATION = VO_DURATION + END_CARD;
export const TOTAL_FRAMES = Math.ceil(END_DURATION * FPS_T);

export type Word = {w: string; s: number; e: number};
export const WORDS = WORDS_JSON as Word[];
export type Section = 'HOOK' | 'ONESHOT' | 'F1' | 'MID' | 'F2' | 'RISET' | 'F3' | 'END';
type RawBeat = {id: number; sec: Section; w0: number; w1: number; start: number; text: string};

const RAW = BEATS_JSON as RawBeat[];
export const BEATS = [...RAW, {id: 56, sec: 'END' as Section, w0: WORDS.length, w1: WORDS.length, start: VO_DURATION, text: '(ending)'}].map((b, i, a) => {
  const end = i + 1 < a.length ? a[i + 1].start : END_DURATION;
  return {...b, end, f0: Math.round(b.start * FPS_T), f1: Math.round(end * FPS_T)};
});
export type Beat = (typeof BEATS)[number];
export const beatF = (id: number, off = 0) => BEATS[id - 1].f0 + off;
export const beatAt = (f: number) => BEATS.filter((b) => b.f0 <= f).pop() ?? BEATS[0];
// frame kata ke-n di dalam beat (untuk sinkron animasi ke kata kunci)
export const wordInBeat = (beat: number, w: string, nth = 0) => {
  const b = BEATS[beat - 1];
  const hits = WORDS.slice(b.w0, b.w1).map((x, i) => [x, i] as const).filter(([x]) => x.w.replace(/[^\w-]/g, '').toLowerCase() === w.toLowerCase());
  return Math.round(hits[nth][0].s * FPS_T);
};

// Label chip fase + 3 slot fase (open loop: slot nyala satu-satu)
export type Phase = {from: number; num: string; label: string; color: string; slot: number};
export const PHASES: Phase[] = [
  {from: 0, num: '?', label: '3 FASE', color: '#8A90A0', slot: 0},
  {from: beatF(6), num: '1', label: 'FASE 1', color: '#FFD23F', slot: 1},
  {from: beatF(18), num: '★', label: 'HARAPAN', color: '#FFB23F', slot: 1},
  {from: beatF(21, 12), num: '!', label: 'AWAS', color: '#FF8A2B', slot: 2},
  {from: beatF(22), num: '2', label: 'FASE 2', color: '#FF8A2B', slot: 2},
  {from: beatF(32), num: '📄', label: 'RISET', color: '#7FB7C9', slot: 2},
  {from: beatF(37), num: '3', label: 'FASE 3', color: '#FF3B3B', slot: 3},
];
export const phaseAt = (f: number) => PHASES.filter((p) => p.from <= f).pop()!;
