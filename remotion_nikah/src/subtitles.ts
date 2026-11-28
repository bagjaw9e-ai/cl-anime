// Subtitle karaoke maks 3 kata (data/subs.json) + SUBTITLE POIN PENTING 💬 (subtitle 3 kata disembunyikan selama tampil).
// Poin penting SELALU menempel ke ilustrasi relevannya (posisi x,y diatur per beat di scene: KEY_POS), animasi masuk kuat & variatif,
// keluar cepat 7 frame.
import SUBS_JSON from '../data/subs.json';
import {BEATS, FPS_T, WORDS} from './timeline';

export type Chunk = {words: number[]; s: number; e: number};
export const CHUNKS = SUBS_JSON as Chunk[];

// SUBTITLE POIN PENTING 💬 (video nikah dengan pecandu): maks 3 kata, MEDIUM ±90-100 px, overlay sedikit di bawah ilustrasi (KEY_POS per beat di scene).
// slam = jatuh dari atas + shake; punch = scale 0→1,25→1; wipe = mask wipe kiri→kanan; stamp = cap/stempel miring + bayangan;
// ink = cipratan tinta lalu teks; tear = kertas sobek mengungkap teks; neon = nyala berkedip; sand = teks terkikis pasir di ujung
export type KeyStyle = 'slam' | 'punch' | 'wipe' | 'stamp' | 'ink' | 'tear' | 'neon' | 'sand';
export type Callout = {beat: number; lines: string[]; accent: string[]; color: string; style: KeyStyle; s: number; e: number};
// [beat, baris, kata aksen, warna aksen fase, gaya masuk, kata kunci pemicu (muncul saat kata ini diucapkan)]
const HOOK = '#FF3B3B', F1 = '#FF5FB0', F2 = '#3FE6FF', CTA = '#FFC23F', F3 = '#FF3344';
const C: Array<[number, string[], string[], string, KeyStyle, string]> = [
  [2, ['KECANDUAN PMO'], ['PMO'], HOOK, 'slam', 'kecanduan'],
  [3, ['SUATU KESALAHAN'], ['KESALAHAN'], HOOK, 'punch', 'suatu'],
  [5, ['MASA DEPAN', 'RUMAH TANGGA?'], ['RUMAH', 'TANGGA?'], '#F5FF3B', 'wipe', 'masa'],
  [8, ['IKATAN BATIN', 'HANCUR'], ['HANCUR'], F1, 'slam', 'ikatan'],
  [12, ['KEPEKAAN', 'MENGHILANG'], ['MENGHILANG'], F1, 'wipe', 'kepekaan'],
  [15, ['CUMA KEWAJIBAN'], ['KEWAJIBAN'], F1, 'punch', 'cuma'],
  [17, ['BUKAN BENDA'], ['BENDA'], F1, 'slam', 'bukan'],
  [21, ['TANPA PEDULI', 'ISTRI'], ['ISTRI'], F1, 'wipe', 'tanpa'],
  [23, ['PERILAKU TOKSIK'], ['TOKSIK'], F1, 'punch', 'perilaku'],
  [26, ['EMPATI TUMPUL'], ['TUMPUL'], F1, 'slam', 'empatinya'],
  [28, ['PREFRONTAL', 'CORTEX'], ['CORTEX'], F2, 'wipe', 'prefrontal'],
  [31, ['RESEPTOR KEBAL'], ['KEBAL'], F2, 'punch', 'kelelahan'],
  [34, ['MENYANGKAL', 'KERAS'], ['KERAS'], F2, 'slam', 'menyangkal'],
  [35, ['JAMA PSYCHIATRY', '2014'], ['2014'], F2, 'wipe', 'JAMA'],
  [37, ['STRIATUM', 'MENYUSUT'], ['MENYUSUT'], F2, 'punch', 'menyusutnya'],
  [41, ['NEUROPLASTICITY'], ['NEUROPLASTICITY'], CTA, 'wipe', 'neuroplasticity'],
  [42, ['LINK DI BIO'], ['BIO'], CTA, 'punch', 'link'],
  [45, ['ABUSIVE KE', 'KELUARGA'], ['ABUSIVE'], F3, 'slam', 'abusive'],
  [47, ['TEMBOK TINGGI'], ['TINGGI'], F3, 'punch', 'tembok'],
  [54, ['BENTAKAN', '& MAKIAN'], ['BENTAKAN', '&', 'MAKIAN'], F3, 'slam', 'bentakan'],
  [55, ['VERBAL & FISIK'], ['FISIK'], F3, 'wipe', 'verbal'],
  [57, ['RUMAH', 'MENCEKAM'], ['MENCEKAM'], F3, 'slam', 'mencekam'],
];
const norm = (w: string) => w.replace(/[^\w]/g, '').toLowerCase();
export const CALLOUTS: Callout[] = C.map(([beat, lines, accent, color, style, key]) => {
  const b = BEATS[beat - 1];
  const kw = WORDS.slice(b.w0, b.w1).find((w) => norm(w.w) === norm(key));
  const s = Math.max(b.start + 0.05, (kw?.s ?? b.start) - 0.05);
  return {beat, lines, accent, color, style, s, e: Math.min(b.end - 0.05, s + 2.8)};
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
