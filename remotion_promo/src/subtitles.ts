// Subtitle karaoke maks 3 kata (data/subs.json dari scripts/build_words.py + data/subs_manual.txt)
// + subtitle POIN PENTING (💬). Selama poin penting tampil, subtitle 3 kata disembunyikan.
import SUBS_JSON from '../data/subs.json';
import {FPS_T, VO_DURATION, WORDS} from './timeline';

export type Chunk = {words: number[]; s: number; e: number};
export const CHUNKS = SUBS_JSON as Chunk[];

// lines: baris teks; accent: kata yang diberi warna aksen. Posisi (y baseline per baris) diatur per scene di Main.
export type Callout = {beat: number; lines: string[]; accent: string[]; accentColor: string; s: number; e: number};
const w = (i: number) => WORDS[i];
export const CALLOUTS: Callout[] = [
  {beat: 1, lines: ['LEPAS DARI', 'PMO'], accent: ['PMO'], accentColor: '#F5FF3B', s: 0.2, e: w(4).s},
  {beat: 4, lines: ['NEURO', 'PLASTICITY'], accent: ['PLASTICITY'], accentColor: '#FFD166', s: w(13).s, e: w(16).s},
  {beat: 7, lines: ['E-BOOK + VIDEO', 'STOP PMO'], accent: ['STOP', 'PMO'], accentColor: '#FF3B3B', s: w(25).s, e: w(31).s},
  {beat: 9, lines: ['LINK', 'DI BIO'], accent: ['BIO'], accentColor: '#FF3B3B', s: w(35).s, e: VO_DURATION},
];
export const calloutAt = (f: number) => CALLOUTS.find((c) => f >= Math.round(c.s * FPS_T) && f < Math.round(c.e * FPS_T));
export const chunkAt = (f: number) => {
  const t = f / FPS_T;
  let cur: Chunk | undefined;
  for (const c of CHUNKS) if (c.s <= t + 0.03) cur = c;
  if (cur && t > cur.e + 0.6) return undefined; // jeda panjang / end card: kosong
  // chunk yang diucapkan selama subtitle poin penting tidak muncul lagi setelah poin penting selesai
  if (cur && CALLOUTS.some((c) => (cur!.s + cur!.e) / 2 >= c.s && (cur!.s + cur!.e) / 2 < c.e)) return undefined;
  return cur;
};
