// Subtitle karaoke (maks 3 kata/chunk, data/subs.json dari scripts/build_words.py + data/subs_manual.txt)
// + jadwal CALLOUT (💬). Selama callout tampil, subtitle utama disembunyikan.
import SUBS_JSON from '../data/subs.json';
import {FPS_T, WORDS} from './timeline';

export type Chunk = {words: number[]; s: number; e: number};
export const CHUNKS = SUBS_JSON as Chunk[];

export type Callout = {beat: number; text: string; s: number; e: number; color: string; icon?: 'lock' | 'warn' | 'up' | 'flat' | 'drop' | 'brain' | 'cal' | 'flag' | 'check' | 'link' | 'muscle'; pos: 'top' | 'sub'};
const ws = (w: string, nth = 0) => WORDS.filter((x) => x.w.replace(/[^\w%-]/g, '').toLowerCase() === w.toLowerCase())[nth].s;
export const CALLOUTS: Callout[] = [
  {beat: 3, text: '30 HARI TANPA COLI?', s: ws('30'), e: 3.62, color: '#F5FF3B', icon: 'cal', pos: 'top'},
  {beat: 4, text: 'HARI 1–3', s: 3.62, e: 4.95, color: '#FF4D5A', icon: 'warn', pos: 'top'},
  {beat: 13, text: 'WITHDRAWAL', s: ws('withdrawal'), e: 17.9, color: '#FF7A45', icon: 'warn', pos: 'top'},
  {beat: 18, text: '145%', s: ws('145%'), e: 26.95, color: '#4FB3A9', icon: 'up', pos: 'top'},
  {beat: 20, text: 'BUKAN SUPERMAN', s: ws('bukan', 1), e: 30.8, color: '#FFD166', pos: 'top'},
  {beat: 22, text: 'MINGGU 2', s: ws('minggu'), e: 36.6, color: '#7E8CC8', icon: 'cal', pos: 'top'},
  {beat: 26, text: 'FLATLINE', s: ws('flatline'), e: 41.45, color: '#8FD3C8', icon: 'flat', pos: 'top'},
  {beat: 31, text: 'DETOKS DOPAMIN', s: ws('didetoks'), e: 54.35, color: '#4FB3A9', icon: 'drop', pos: 'top'},
  {beat: 32, text: 'MINGGU 3–4', s: ws('minggu', 2), e: 56.4, color: '#FFB547', icon: 'cal', pos: 'top'},
  {beat: 34, text: 'LATIH OTAK MEMILIH', s: ws('melatih'), e: 61.25, color: '#FFD166', icon: 'brain', pos: 'top'},
  {beat: 39, text: 'PFC DOMINAN', s: ws('PFC'), e: 74.65, color: '#FFD166', icon: 'brain', pos: 'top'},
  {beat: 40, text: '66 HARI', s: ws('66'), e: 79.3, color: '#8FD36A', icon: 'cal', pos: 'top'},
  {beat: 41, text: 'BUKAN GARIS FINISH', s: 80.6, e: 81.75, color: '#FF7A45', icon: 'flag', pos: 'top'},
  {beat: 43, text: 'MIMPI BASAH = NORMAL', s: ws('mimpi'), e: 87.2, color: '#8FD3C8', icon: 'check', pos: 'top'},
  {beat: 49, text: 'LINK DI BIO', s: ws('link'), e: 102.5, color: '#FF4D5A', icon: 'link', pos: 'top'},
];
export const calloutAt = (f: number) => CALLOUTS.find((c) => f >= Math.round(c.s * FPS_T) && f < Math.round(c.e * FPS_T));
export const chunkAt = (f: number) => {
  const t = f / FPS_T;
  // ganti chunk tanpa jeda kosong: chunk aktif = chunk terakhir yang sudah mulai (sampai chunk berikutnya mulai)
  let cur: Chunk | undefined;
  for (const c of CHUNKS) if (c.s <= t + 0.03) cur = c;
  return cur;
};
