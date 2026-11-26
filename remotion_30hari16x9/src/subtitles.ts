// Subtitle karaoke maks 3 kata (data/subs.json) + SUBTITLE POIN PENTING 💬 (subtitle 3 kata disembunyikan selama tampil).
// Poin penting SELALU menempel ke ilustrasi relevannya (posisi x,y diatur per beat di scene: KEY_POS), animasi masuk kuat & variatif,
// keluar cepat 7 frame.
import SUBS_JSON from '../data/subs.json';
import {BEATS, FPS_T} from './timeline';

export type Chunk = {words: number[]; s: number; e: number};
export const CHUNKS = SUBS_JSON as Chunk[];

// SUBTITLE POIN PENTING 💬: maks 3 kata, MEDIUM ±68-76 px (16:9), overlay sedikit di bawah ilustrasi (KEY_POS per beat di scene).
// slam = jatuh dari atas + shake; punch = scale 0→1,25→1; wipe = mask wipe kiri→kanan; stamp = cap/stempel miring + bayangan;
// ink = cipratan tinta lalu teks; tear = kertas sobek mengungkap teks; neon = nyala berkedip; sand = teks terkikis pasir di ujung
export type KeyStyle = 'slam' | 'punch' | 'wipe' | 'stamp' | 'ink' | 'tear' | 'neon' | 'sand';
export type Callout = {beat: number; lines: string[]; accent: string[]; color: string; style: KeyStyle; s: number; e: number};
const Y = '#F5FF3B', R = '#FF3B4A', G = '#3FF08A', CY_ = '#3FE8FF', A = '#FFB23F';
const C: Array<[number, string[], string[], string, KeyStyle]> = [
  [1, ['APA YANG TERJADI?'], ['TERJADI?'], Y, 'slam'],
  [3, ['30 HARI?'], ['30'], Y, 'punch'],
  [4, ['3 HARI PERTAMA'], ['3'], R, 'wipe'],
  [5, ['PALING BERAT'], ['BERAT'], R, 'slam'],
  [7, ['OTAK HAFAL POLA'], ['POLA'], R, 'punch'],
  [13, ['GEJALA WITHDRAWAL'], ['WITHDRAWAL'], R, 'wipe'],
  [14, ['SAKAU'], ['SAKAU'], R, 'slam'],
  [16, ['STUDI ZHEJIANG'], ['ZHEJIANG'], CY_, 'wipe'],
  [18, ['NAIK 145%'], ['145%'], Y, 'punch'],
  [20, ['BUKAN SUPERMAN'], ['BUKAN'], R, 'slam'],
  [26, ['FLATLINE'], ['FLATLINE'], CY_, 'wipe'],
  [28, ['DOPAMIN DIRESET'], ['DIRESET'], Y, 'punch'],
  [31, ['OTAK DIDETOKS'], ['DIDETOKS'], G, 'slam'],
  [34, ['MELATIH OTAK MEMILIH'], ['MEMILIH'], G, 'wipe'],
  [36, ['FOKUS LEBIH PANJANG'], ['FOKUS'], G, 'punch'],
  [37, ['BUKAN DIKENDALIKAN'], ['DIKENDALIKAN'], G, 'slam'],
  [39, ['PFC DOMINAN'], ['DOMINAN'], Y, 'punch'],
  [40, ['66 HARI'], ['66'], Y, 'slam'],
  [43, ['MIMPI BASAH NORMAL'], ['NORMAL'], G, 'wipe'],
  [46, ['NEUROPLASTICITY'], ['NEUROPLASTICITY'], A, 'wipe'],
  [48, ['PULIHKAN OTAK'], ['PULIHKAN'], A, 'punch'],
  [49, ['LINK DI BIO'], ['LINK'], Y, 'slam'],
];
const DELAY: Record<number, number> = {};
export const CALLOUTS: Callout[] = C.map(([beat, lines, accent, color, style]) => {
  const b = BEATS[beat - 1];
  const s = b.start + (beat === 1 ? 0 : 0.12) + (DELAY[beat] ?? 0);
  return {beat, lines, accent, color, style, s, e: Math.min(b.end - 0.05, s + 2.8)};
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
