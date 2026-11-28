// frame awal/akhir beat + frame kata kunci di dalam beat (sinkron animasi ke kata yang diucapkan)
import {BEATS, wordInBeat} from '../timeline';
export const bf = (id: number, off = 0) => BEATS[id - 1].f0 + off;
export const be = (id: number, off = 0) => BEATS[id - 1].f1 + off;
export const wordF = (beat: number, w: string, nth = 0) => wordInBeat(beat, w.replace(/[^\w-]/g, ''), nth);
