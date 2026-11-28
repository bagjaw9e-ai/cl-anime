// Jadwal PANEL NEON (overlay layar, pusat x 540, y ±300-384) + ikon ±60 px di KIRI teks (jarak 11 px) + baterai (y ±400-450).
// Tampil mulai Fase 1 ("Pada fase pertama,") sampai frame terakhir; tidak tampil di HOOK & ONE SHOT.
// Tiap segmen = rentang narasi persis: awal kata pertama segmen -> awal kata pertama segmen berikutnya.
import {TOTAL_FRAMES, beatF} from './timeline';

export type NeonWord = {t: string; c: string; bright?: boolean};
export type NeonIconName = 'cracked_rings' | 'cracked_gear' | 'glow_shield' | 'cracked_house';
export type NeonSeg = {id: number; from: number; to: number; words: NeonWord[]; glow: string; icon: NeonIconName; flicker: 'soft' | 'often'};
const W = (t: string, c: string, bright = false): NeonWord => ({t, c, bright});

export const NEON: NeonSeg[] = [
  // "Pada fase pertama," .. "kemampuan empatinya sudah tumpul."
  {id: 1, from: beatF(6), to: beatF(27), glow: '#FF4FB4', icon: 'cracked_rings', flicker: 'soft',
    words: [W('FASE 1 :', '#FFC6E6'), W('IKATAN BATIN HANCUR', '#FFE9F5', true)]},
  // "Berlanjut di fase kedua," .. "sensasi kenikmatan serupa."
  {id: 2, from: beatF(27), to: beatF(41), glow: '#29E3FF', icon: 'cracked_gear', flicker: 'soft',
    words: [W('FASE 2 :', '#B8F6FF'), W('LOGIKA DIGEROGOTI', '#E8FDFF', true)]},
  // "Walaupun ada konsep neuroplasticity" .. "di fase terakhir."  (gaya logo: PMO putih, SAVIOR merah)
  {id: 3, from: beatF(41), to: beatF(45), glow: '#FF2A3A', icon: 'glow_shield', flicker: 'soft',
    words: [W('PMO', '#FFFFFF', true), W('SAVIOR', '#FF3346', true)]},
  // "Adiksi PMO ini menjelma" .. akhir video (flicker lebih sering)
  {id: 4, from: beatF(45), to: TOTAL_FRAMES, glow: '#FF1F2E', icon: 'cracked_house', flicker: 'often',
    words: [W('FASE 3 :', '#FFB3B8'), W('RUMAH JADI MENCEKAM', '#FFE3E5', true)]},
];
export const NEON_FROM = NEON[0].from;
export const SWITCH_OUT = 6;  // panel lama flicker mati (frame sebelum segmen baru)
export const SWITCH_IN = 14;  // panel baru flicker nyala 2-3x lalu stabil
export const neonAt = (f: number) => NEON.find((s) => f >= s.from && f < s.to);
