// Subtitle karaoke maks 3 kata (data/subs.json) + SUBTITLE POIN PENTING 💬 (subtitle 3 kata disembunyikan selama tampil).
// Poin penting SELALU menempel ke ilustrasi relevannya (posisi x,y diatur per beat di scene: KEY_POS), animasi masuk kuat & variatif,
// keluar cepat 7 frame.
import SUBS_JSON from '../data/subs.json';
import {BEATS, FPS_T} from './timeline';

export type Chunk = {words: number[]; s: number; e: number};
export const CHUNKS = SUBS_JSON as Chunk[];

// slam = jatuh dari atas + shake; punch = scale 0→1,25→1; wipe = mask wipe kiri→kanan; stamp = cap/stempel miring + bayangan;
// ink = cipratan tinta lalu teks; tear = kertas sobek mengungkap teks; neon = nyala berkedip; sand = teks terkikis pasir di ujung
export type KeyStyle = 'slam' | 'punch' | 'wipe' | 'stamp' | 'ink' | 'tear' | 'neon' | 'sand';
export type Callout = {beat: number; lines: string[]; accent: string[]; color: string; style: KeyStyle; s: number; e: number};
const C: Array<[number, string[], string[], string, KeyStyle]> = [
  [1, ['UMUR 25', 'TAHUN'], ['25'], '#F5FF3B', 'slam'],
  [2, ['MASIH KECANDUAN', 'PMO?'], ['PMO?'], '#FF3B3B', 'stamp'],
  [3, ['3 EFEK', 'KERUSAKAN OTAK'], ['3'], '#F5FF3B', 'wipe'],
  [7, ['GAMPANG', 'MARAH'], ['MARAH'], '#FF8A2B', 'slam'],
  [8, ['ABUSIVE'], ['ABUSIVE'], '#FF3B3B', 'punch'],
  [16, ['HAL KECIL =', 'MELEDAK'], ['MELEDAK'], '#FF3B3B', 'punch'],
  [17, ['MAKIN', 'EKSTREM'], ['EKSTREM'], '#FF3B3B', 'stamp'],
  [22, ['MENGINFEKSI', 'TANPA SADAR'], ['MENGINFEKSI'], '#F5FF3B', 'ink'],
  [23, ['NEURO', 'PLASTICITY'], ['PLASTICITY'], '#FFD166', 'neon'],
  [26, ['EFEK KEDUA', 'LEBIH NGERI'], ['NGERI'], '#FF3B3B', 'stamp'],
  [28, ['PENUH', 'HAYALAN'], ['HAYALAN'], '#FF5FA2', 'punch'],
  [31, ['KENAPA?'], ['KENAPA?'], '#F5FF3B', 'slam'],
  [35, ['OTAK TENGAH NAIK,', 'PFC TURUN'], ['NAIK,', 'TURUN'], '#FF3B3B', 'wipe'],
  [39, ['BISA BERUJUNG', 'PELECEHAN'], ['PELECEHAN'], '#FF3B3B', 'stamp'],
  [41, ['PLOS ONE,', '2014'], ['2014'], '#F5FF3B', 'stamp'],
  [43, ['CARA BERPIKIR', 'TERGANGGU'], ['TERGANGGU'], '#7FD8F0', 'tear'],
  [49, ['PD MAKIN', 'TERKIKIS'], ['TERKIKIS'], '#F5FF3B', 'sand'],
  [51, ['NATAP MATA AJA', 'GAK BERANI'], ['GAK', 'BERANI'], '#7FD8F0', 'wipe'],
];
const DELAY: Record<number, number> = {};
export const CALLOUTS: Callout[] = C.map(([beat, lines, accent, color, style]) => {
  const b = BEATS[beat - 1];
  const s = b.start + (beat === 1 ? 0 : 0.12) + (DELAY[beat] ?? 0);
  return {beat, lines, accent, color, style, s, e: Math.min(b.end, s + 2.8)};
});
export const calloutAt = (f: number) => CALLOUTS.find((c) => f >= Math.round(c.s * FPS_T) && f < Math.round(c.e * FPS_T));
export const chunkAt = (f: number) => {
  const t = f / FPS_T;
  let cur: Chunk | undefined;
  for (const c of CHUNKS) if (c.s <= t + 0.03) cur = c;
  if (cur && t > cur.e + 0.6) return undefined;
  if (cur && CALLOUTS.some((c) => (cur!.s + cur!.e) / 2 >= c.s && (cur!.s + cur!.e) / 2 < c.e)) return undefined;
  if (t >= BEATS[BEATS.length - 1].start) return undefined; // penutup: tanpa subtitle
  return cur;
};
