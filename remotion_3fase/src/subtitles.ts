// Subtitle karaoke maks 3 kata (data/subs.json) + jadwal CALLOUT 💬 (subtitle 3 kata disembunyikan selama callout).
import SUBS_JSON from '../data/subs.json';
import {BEATS, FPS_T} from './timeline';

export type Chunk = {words: number[]; s: number; e: number};
export const CHUNKS = SUBS_JSON as Chunk[];

export type Callout = {beat: number; lines: string[]; accent: string[]; color: string; s: number; e: number; style: 'slam' | 'neon'};
// [beat, baris, kata aksen, warna aksen, gaya]
const C: Array<[number, string[], string[], string, 'slam' | 'neon']> = [
  [2, ['JANGAN NIKAH SAMA', 'PRIA PECANDU PMO'], ['PMO'], '#FF3B3B', 'slam'],
  [4, ['3 FASE', 'KERUSAKAN OTAK'], ['3'], '#F5FF3B', 'slam'],
  [7, ['SISTEM REWARD', 'DIBAJAK'], ['DIBAJAK'], '#FF3B3B', 'slam'],
  [10, ['RESEPTOR', 'TUMPUL'], ['TUMPUL'], '#F5FF3B', 'slam'],
  [17, ['SELALU NYARI', 'YANG LEBIH LIAR'], ['LIAR'], '#FF3B3B', 'slam'],
  [18, ['NEURO', 'PLASTICITY'], ['PLASTICITY'], '#FFD166', 'neon'],
  [20, ['LINK', 'DI BIO'], ['BIO'], '#F5FF3B', 'neon'],
  [23, ['PFC', 'DIGEROGOTI'], ['DIGEROGOTI'], '#FF3B3B', 'slam'],
  [31, ['DIA NGANGGEP INI', 'BUKAN MASALAH'], ['BUKAN'], '#FF3B3B', 'slam'],
  [32, ['JAMA PSYCHIATRY', '2014'], ['2014'], '#F5FF3B', 'neon'],
  [34, ['STRIATUM', 'MENGECIL'], ['MENGECIL'], '#FF3B3B', 'slam'],
  [38, ['KONEKSI', 'RUSAK'], ['RUSAK'], '#FF3B3B', 'slam'],
  [41, ['MATI RASA', 'KE ISTRI'], ['MATI', 'RASA'], '#9FD3FF', 'slam'],
  [45, ['ISTRI = OBJEK'], ['OBJEK'], '#FF3B3B', 'slam'],
  [50, ['TANPA PEDULI', 'ISTRINYA'], ['ISTRINYA'], '#FF3B3B', 'slam'],
  [51, ['ABUSIVE'], ['ABUSIVE'], '#FF3B3B', 'slam'],
  [54, ['DIA NGGAK', 'NGERASA SALAH'], ['SALAH'], '#FF3B3B', 'slam'],
];
// tampil dari awal beat (+0,15 dtk) maks 2,8 dtk atau sampai beat selesai
export const CALLOUTS: Callout[] = C.map(([beat, lines, accent, color, style]) => {
  const b = BEATS[beat - 1];
  const s = b.start + 0.15;
  return {beat, lines, accent, color, style, s, e: Math.min(b.end, s + 2.8)};
});
export const calloutAt = (f: number) => CALLOUTS.find((c) => f >= Math.round(c.s * FPS_T) && f < Math.round(c.e * FPS_T));
export const chunkAt = (f: number) => {
  const t = f / FPS_T;
  let cur: Chunk | undefined;
  for (const c of CHUNKS) if (c.s <= t + 0.03) cur = c;
  if (cur && t > cur.e + 0.6) return undefined;
  if (cur && CALLOUTS.some((c) => (cur!.s + cur!.e) / 2 >= c.s && (cur!.s + cur!.e) / 2 < c.e)) return undefined;
  return cur;
};
