// Jadwal ilustrasi: slot di world, frame masuk & keluar. Ilustrasi lama keluar saat yang baru masuk.
import {beatF} from './timeline';

export type Slot = 'top' | 'left' | 'right' | 'floor' | 'top3' | 'behind' | 'hand' | 'logo' | 'offR' | 'upL';
// pusat slot di world (karakter berdiri di (0,0), skala 1.25, kepala ~y-655, puncak kepala ~y-820)
export const SLOT: Record<Slot, {x: number; y: number; w: number; h: number}> = {
  top: {x: 0, y: -1150, w: 440, h: 330},
  top3: {x: 0, y: -1010, w: 620, h: 150},
  left: {x: -340, y: -640, w: 280, h: 300},
  right: {x: 340, y: -640, w: 280, h: 300},
  floor: {x: 0, y: 40, w: 560, h: 130},
  behind: {x: 0, y: -620, w: 1000, h: 1150},
  hand: {x: 52, y: -500, w: 160, h: 160},
  logo: {x: 0, y: -1180, w: 620, h: 420},
  offR: {x: 520, y: -1000, w: 160, h: 160},
  upL: {x: -310, y: -930, w: 200, h: 300},
};

export type Ill = {key: string; beat: number; slot: Slot; in: number; out: number; label: string};
const B = (id: number, off = 0) => beatF(id) + off;
const END = 99999;

export const ILLS: Ill[] = [
  {key: 'shield', beat: 1, slot: 'top', in: B(1, 6), out: B(6), label: 'perisai emas (retak di #2)'},
  {key: 'phoneRed', beat: 2, slot: 'upL', in: B(2, 14), out: B(3, 6), label: 'HP glow merah'},
  {key: 'hourglass', beat: 3, slot: 'right', in: B(3, 4), out: B(4, 30), label: 'jam pasir merah'},
  {key: 'calendar', beat: 4, slot: 'left', in: B(4, 3), out: B(5, 20), label: 'kalender HARI INI ✓'},
  {key: 'shadow', beat: 5, slot: 'floor', in: B(5, 4), out: B(6), label: 'bayangan retak & layu'},
  {key: 'holoBrain', beat: 6, slot: 'top', in: B(6, 4), out: B(14), label: 'hologram otak + mikroskop'},
  {key: 'threeSlots', beat: 7, slot: 'top3', in: B(7, 6), out: B(12, 24), label: '3 slot + badge 3 (#8 kado NEW, #9 hati, #10 DNA)'},
  {key: 'phoneBig', beat: 11, slot: 'right', in: B(11, 4), out: B(14), label: 'HP besar (#12 sedot 3 bola, #13 flash 3 IN 1)'},
  {key: 'dopamine', beat: 14, slot: 'top', in: B(14, 2), out: B(17), label: 'air mancur dopamin + meter DOPAMIN'},
  {key: 'hook', beat: 15, slot: 'hand', in: B(15, 2), out: B(16, 10), label: 'kail di kerah'},
  {key: 'loop', beat: 16, slot: 'behind', in: B(16, 4), out: B(17, 10), label: 'panah loop orbit'},
  {key: 'wifi', beat: 17, slot: 'top', in: B(17, 4), out: B(19), label: 'globe + wifi'},
  {key: 'scroll', beat: 18, slot: 'right', in: B(18, 2), out: B(20), label: 'kolom thumbnail blur + ∞'},
  {key: 'tap', beat: 19, slot: 'hand', in: B(19, 6), out: B(20, 6), label: 'jempol tap + riak'},
  {key: 'cards', beat: 20, slot: 'behind', in: B(20, 2), out: B(21, 10), label: 'ledakan kartu blur'},
  {key: 'wall', beat: 21, slot: 'behind', in: B(21, 6), out: B(22, 10), label: 'dinding grid + 1000+'},
  {key: 'frozenBrain', beat: 22, slot: 'top', in: B(22, 4), out: B(25), label: 'otak beku frost'},
  {key: 'knob', beat: 23, slot: 'left', in: B(23, 3), out: B(24, 30), label: 'kenop volume -> 0'},
  {key: 'flower', beat: 24, slot: 'right', in: B(24, 4), out: B(25), label: 'bunga layu'},
  {key: 'star', beat: 25, slot: 'right', in: B(25, 4), out: B(27, 20), label: 'bintang cerah (#26 jadi abu)'},
  {key: 'clock', beat: 27, slot: 'left', in: B(27, 4), out: B(28, 20), label: 'jam dinding makin cepat'},
  {key: 'gauge', beat: 28, slot: 'top', in: B(28, 4), out: B(29, 10), label: 'gauge zona merah + api'},
  {key: 'spiral', beat: 29, slot: 'behind', in: B(29, 1), out: B(30, 8), label: 'spiral hipnotis'},
  {key: 'treadmill', beat: 30, slot: 'floor', in: B(30), out: B(31, 8), label: 'treadmill + hati di tongkat'},
  {key: 'room', beat: 31, slot: 'behind', in: B(31, 2), out: B(34), label: 'ruang kosong + tumbleweed'},
  {key: 'icons', beat: 32, slot: 'left', in: B(32, 2), out: B(33, 10), label: 'stik game / buku / chat pudar'},
  {key: 'bubble', beat: 33, slot: 'top', in: B(33, 4), out: B(34, 20), label: 'thought bubble pink blur kabur'},
  {key: 'autopilot', beat: 34, slot: 'left', in: B(34, 4), out: B(35, 10), label: 'tali boneka + AUTOPILOT'},
  {key: 'battery', beat: 35, slot: 'left', in: B(35, 6), out: B(37, 10), label: 'baterai hijau (#36 terkuras merah)'},
  {key: 'chart', beat: 37, slot: 'right', in: B(37, 4), out: B(39), label: 'papan BOREDOM INTOLERANCE'},
  {key: 'panicBrain', beat: 38, slot: 'top', in: B(38, 2), out: B(39, 20), label: 'otak keringat + sirene'},
  {key: 'flatline', beat: 39, slot: 'right', in: B(39, 4), out: B(40, 10), label: 'monitor flatline'},
  {key: 'tossPhone', beat: 41, slot: 'offR', in: B(41, 12), out: B(41, 40), label: 'HP dilempar'},
  {key: 'checklist', beat: 42, slot: 'left', in: B(42, 4), out: B(45), label: 'checklist ✓✓✓'},
  {key: 'guide', beat: 43, slot: 'top', in: B(43, 4), out: B(44), label: 'buku panduan teal'},
  {key: 'logo', beat: 44, slot: 'logo', in: B(44), out: END, label: 'LOGO neon'},
  {key: 'rewired', beat: 45, slot: 'right', in: B(45, 4), out: B(46, 30), label: 'otak saraf nyambung'},
];

// progres masuk/keluar (0..1) untuk animasi pop-in / shrink-out
export const illState = (il: Ill, f: number) => {
  const inP = Math.min(1, Math.max(0, (f - il.in) / 10));
  const outP = Math.min(1, Math.max(0, (f - il.out) / 10));
  return {visible: f >= il.in && f < il.out + 10, inP, outP};
};
