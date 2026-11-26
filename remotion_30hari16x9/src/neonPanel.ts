// Jadwal teks PANEL NEON (atas, pusat x 960, y 120-190) + ikon statis di kiri teks + baterai (y 205-240).
// Tampil mulai segmen "Hari 1-3" sampai akhir (tidak di HOOK). Tiap segmen = rentang narasi persis (awal kata pertama segmen).
import {TOTAL_FRAMES, beatF} from './timeline';

export type NeonWord = {t: string; c: string; bright?: boolean};
export type NeonIconName = 'phone_lock' | 'molecule' | 'flat_circle' | 'shield_check' | 'sprout' | 'neuron';
export type NeonSeg = {id: number; from: number; to: number; words: NeonWord[]; glow: string; icon: NeonIconName};
const W = (t: string, c: string, bright = false): NeonWord => ({t, c, bright});

export const NEON: NeonSeg[] = [
  {id: 1, from: beatF(4), to: beatF(15), glow: '#FF2F6E', icon: 'phone_lock',
    words: [W('HARI 1-3 :', '#FFC2D4'), W('HYPOFRONTALITY', '#FFE6EE', true)]},   // "Tiga hari pertama" .. "atau sakau."
  {id: 2, from: beatF(15), to: beatF(22), glow: '#22E4FF', icon: 'molecule',
    words: [W('HARI KE-7', '#E6FDFF', true)]},                                   // "Sekitar hari ketujuh" .. "lagi menyesuaikan."
  {id: 3, from: beatF(22), to: beatF(32), glow: '#8FB8FF', icon: 'flat_circle',
    words: [W('HARI KE-14', '#EEF4FF', true)]},                                  // "Masuk ke fase yang datar" .. "dari bokep dan coli."
  {id: 4, from: beatF(32), to: beatF(40), glow: '#33F07A', icon: 'shield_check',
    words: [W('HARI 21-30', '#E8FFEF', true)]},                                  // "Masuk ke minggu ketiga" .. "lebih dominan."
  {id: 5, from: beatF(40), to: beatF(46), glow: '#FFC21F', icon: 'sprout',
    words: [W('BUTUH 66 HARI', '#FFF6D6', true)]},                               // "Tapi ingat, rata-rata" .. "seperti dari onani."
  {id: 6, from: beatF(46), to: TOTAL_FRAMES, glow: '#FF9A1F', icon: 'neuron',
    words: [W('NEUROPLASTICITY', '#FFF0DC', true)]},                             // "Miliki juga konsep" .. akhir + penutup
];
export const NEON_FROM = NEON[0].from;
export const SWITCH_OUT = 6;  // panel lama flicker mati
export const SWITCH_IN = 14;  // panel baru flicker nyala 2-3x lalu stabil
export const neonAt = (f: number) => NEON.find((s) => f >= s.from && f < s.to);
