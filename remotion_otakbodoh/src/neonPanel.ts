// Jadwal teks PANEL NEON (y 300-420) + baterai progres (y 440-500). Tampil mulai Fase 1 sampai akhir (tidak di HOOK & ONE SHOT).
// Tiap segmen = rentang narasi persis (awal kata pertama segmen) -> segmen berikutnya; segmen 5 berlanjut sampai frame terakhir.
import {TOTAL_FRAMES, beatF} from './timeline';

export type NeonWord = {t: string; c: string; bright?: boolean};
export type NeonSeg = {id: number; from: number; to: number; words: NeonWord[]; glow: string; flicker: 'soft' | 'broken'};
const W = (t: string, c: string, bright = false): NeonWord => ({t, c, bright});

export const NEON: NeonSeg[] = [
  {id: 1, from: beatF(6), to: beatF(17), glow: '#2FD8FF', flicker: 'soft',
    words: [W('FASE 1 :', '#9BEFFF'), W('HYPOFRONTALITY', '#E8FDFF', true)]},          // "Pada fase pertama," .. "akan semakin melemah."
  {id: 2, from: beatF(17), to: beatF(21), glow: '#FF2A3A', flicker: 'soft',
    words: [W('PMO', '#FFFFFF', true), W('SAVIOR', '#FF3346', true)]},                // "Walaupun lewat link di bio," .. "fase selanjutnya."
  {id: 3, from: beatF(21), to: beatF(34), glow: '#FF3FD8', flicker: 'soft',
    words: [W('FASE 2 :', '#FFB5F0'), W('OTAK TENGAH', '#FFE6FA', true)]},             // "Di fase kedua," .. "dari prefrontal cortex."
  {id: 4, from: beatF(34), to: beatF(46), glow: '#FF5A1F', flicker: 'soft',
    words: [W('FASE 3 :', '#FFC09A'), W('PERILAKU IMPULSIF', '#FFE9DC', true)]},       // "Di fase ketiga," .. "rencana hidup jangka panjang."
  {id: 5, from: beatF(46), to: TOTAL_FRAMES, glow: '#FF1F2E', flicker: 'broken',
    words: [W('HANCURNYA', '#FFD9DC', true), W('MASA DEPAN', '#FF4A55', true)]},       // "Pada akhirnya," .. "jalan di tempat." + penutup
];
export const NEON_FROM = NEON[0].from;
export const SWITCH_OUT = 6;  // panel lama flicker mati (frame sebelum segmen baru)
export const SWITCH_IN = 14;  // panel baru flicker nyala 2-3x lalu stabil
export const neonAt = (f: number) => NEON.find((s) => f >= s.from && f < s.to);
