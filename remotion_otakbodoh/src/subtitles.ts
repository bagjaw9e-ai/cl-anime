// Subtitle karaoke maks 3 kata (data/subs.json) + SUBTITLE POIN PENTING 💬 (subtitle 3 kata disembunyikan selama tampil).
// Poin penting SELALU menempel ke ilustrasi relevannya (posisi x,y diatur per beat di scene: KEY_POS), animasi masuk kuat & variatif,
// keluar cepat 7 frame.
import SUBS_JSON from '../data/subs.json';
import {BEATS, FPS_T} from './timeline';

export type Chunk = {words: number[]; s: number; e: number};
export const CHUNKS = SUBS_JSON as Chunk[];

// SUBTITLE POIN PENTING 💬: maks 3 kata, MEDIUM ±90-100 px, overlay sedikit di bawah ilustrasi (KEY_POS per beat di scene).
// slam = jatuh dari atas + shake; punch = scale 0→1,25→1; wipe = mask wipe kiri→kanan; stamp = cap/stempel miring + bayangan;
// ink = cipratan tinta lalu teks; tear = kertas sobek mengungkap teks; neon = nyala berkedip; sand = teks terkikis pasir di ujung
export type KeyStyle = 'slam' | 'punch' | 'wipe' | 'stamp' | 'ink' | 'tear' | 'neon' | 'sand';
export type Callout = {beat: number; lines: string[]; accent: string[]; color: string; style: KeyStyle; s: number; e: number};
const C: Array<[number, string[], string[], string, KeyStyle]> = [
  [1, ['OTAK JADI', 'BODOH'], ['BODOH'], '#F5FF3B', 'slam'],
  [4, ['ADIKSI PMO'], ['PMO'], '#FF3B3B', 'punch'],
  [5, ['TIGA FASE', 'PERUBAHAN'], ['TIGA'], '#F5FF3B', 'wipe'],
  [7, ['HYPOFRONTALITY'], ['HYPOFRONTALITY'], '#F5FF3B', 'punch'],
  [8, ['PFC MENURUN'], ['MENURUN'], '#FF3B3B', 'slam'],
  [9, ['MESIN', 'KECERDASAN'], ['KECERDASAN'], '#F5FF3B', 'wipe'],
  [15, ['SIKLUS PMO'], ['SIKLUS'], '#FF3B3B', 'punch'],
  [16, ['MAKIN MELEMAH'], ['MELEMAH'], '#FF3B3B', 'slam'],
  [18, ['NEUROPLASTICITY'], ['NEUROPLASTICITY'], '#F5FF3B', 'wipe'],
  [22, ['OTAK TENGAH'], ['TENGAH'], '#FF3B3B', 'punch'],
  [28, ['TERTIPU LAYAR'], ['TERTIPU'], '#F5FF3B', 'slam'],
  [29, ['DIKIRA NYATA'], ['NYATA'], '#FF3B3B', 'stamp'],
  [30, ['HUMAN BRAIN', 'MAPPING'], ['MAPPING'], '#F5FF3B', 'wipe'],
  [33, ['KENDALI', 'DIAMBIL ALIH'], ['DIAMBIL', 'ALIH'], '#FF3B3B', 'slam'],
  [37, ['KENDALI DIRI', 'LUMPUH'], ['LUMPUH'], '#FF3B3B', 'punch'],
  [39, ['BATIN MENOLAK'], ['MENOLAK'], '#F5FF3B', 'wipe'],
  [40, ['GAMPANG MARAH'], ['MARAH'], '#FF3B3B', 'slam'],
  [45, ['RENCANA HIDUP', 'AMBRUK'], ['AMBRUK'], '#FF3B3B', 'stamp'],
  [48, ['PERFORMA TURUN'], ['TURUN'], '#FF3B3B', 'wipe'],
  [49, ['MENDADAK BLANK'], ['BLANK'], '#F5FF3B', 'punch'],
  [54, ['JALAN PINTAS'], ['PINTAS'], '#F5FF3B', 'slam'],
  [56, ['POTENSI', 'PERLAHAN MATI'], ['MATI'], '#FF3B3B', 'wipe'],
  [57, ['JALAN DI TEMPAT'], ['TEMPAT'], '#FF3B3B', 'punch'],
];
// beat 5: muncul pas pintu ke-3 nyala (one shot), beat lain +0,12 dtk dari awal beat
const DELAY: Record<number, number> = {5: 2.0};
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
