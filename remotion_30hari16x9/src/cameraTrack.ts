// Track kamera + TONE background. Tiap key = [frame, x, y, zoom, tone?, rot?]: titik dunia (x,y) dibawa ke TENGAH frame
// (540, CY). Gerakan ease-in-out (cubic). Tone background diinterpolasi dengan easing yang SAMA sepanjang durasi gerakan
// -> setiap zoom in, warna latar bergeser halus (navy -> ungu -> maroon ...) sementara TEMPAT-nya tetap.
import {Cam, ease} from './kit';
import {Tone, TONES, mixTone} from './components/Places30';
import {bf} from './kit';

export type ToneName = keyof typeof TONES;
export type Key = [number, number, number, number, ToneName?, number?];
// key di frame awal beat + offset
export const K = (beat: number, off: number, x: number, y: number, s: number, tone?: ToneName, r?: number): Key => [bf(beat, off), x, y, s, tone, r];

// head guard: bila karakter (x, y puncak kepala dunia) ada di frame, kamera dijaga supaya kepala tetap di bawah
// panel neon + baterai (y layar >= 580).
export type Guard = (f: number) => [number, number] | null;
export const guardCam = (c: Cam, g: [number, number] | null): Cam => {
  if (!g) return c;
  const [gx, gy] = g;
  if (Math.abs(gx - c.x) * c.s > 600) return c;
  return {...c, y: Math.min(c.y, gy + 320 / c.s)};
};
export const track = (f: number, keys: Key[]): {cam: Cam; tone: Tone} => {
  // tone yang berlaku di tiap key (diteruskan dari key sebelumnya bila kosong)
  const tones: Tone[] = [];
  keys.forEach((k, i) => tones.push(k[4] ? TONES[k[4]] : tones[i - 1] ?? TONES.stageAmber));
  const rot = (i: number) => keys[i][5] ?? 0;
  if (f <= keys[0][0]) return {cam: {x: keys[0][1], y: keys[0][2], s: keys[0][3], r: rot(0)}, tone: tones[0]};
  for (let i = 1; i < keys.length; i++) {
    if (f <= keys[i][0]) {
      const a = keys[i - 1], b = keys[i];
      const e = ease(f, a[0], b[0]);
      return {
        cam: {x: a[1] + (b[1] - a[1]) * e, y: a[2] + (b[2] - a[2]) * e, s: a[3] + (b[3] - a[3]) * e, r: rot(i - 1) + (rot(i) - rot(i - 1)) * e},
        tone: mixTone(tones[i - 1], tones[i], e),
      };
    }
  }
  const l = keys.length - 1;
  return {cam: {x: keys[l][1], y: keys[l][2], s: keys[l][3], r: rot(l)}, tone: tones[l]};
};
