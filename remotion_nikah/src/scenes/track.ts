// Track kamera + TONE. Key = [frame, x, y, zoom, tone?, rot?]: titik dunia (x,y) dibawa ke TENGAH layar (540, CY).
// Gerak ease-in-out (cubic), zoom diinterpolasi di ruang log (terasa konstan). Tone diinterpolasi dengan easing yang SAMA
// sepanjang durasi gerakan -> setiap zoom/tilt warna latar bergeser halus, tempat tetap sama.
import {Easing} from 'remotion';
import {Cam} from '../kit';
import {Tone, mixTone, rand} from '../theme';
import {TONES, ToneName} from '../components/PlacesNikah';

export type Key = [number, number, number, number, ToneName?, number?];
export type Shake = [number, number, number]; // [frame, durasi, amplitudo px layar]
const EIO = Easing.inOut(Easing.cubic);
const clamp = (v: number) => Math.max(0, Math.min(1, v));

export const makeTrack = (keys: Key[], shakes: Shake[] = [], baseTone: ToneName = 'f1Base') => {
  const tones: Tone[] = [];
  keys.forEach((k, i) => tones.push(k[4] ? TONES[k[4]] : tones[i - 1] ?? TONES[baseTone]));
  const seg = (f: number) => {
    if (f <= keys[0][0]) return {i: 0, u: 0};
    for (let i = 1; i < keys.length; i++) if (f <= keys[i][0]) return {i, u: EIO(clamp((f - keys[i - 1][0]) / Math.max(1, keys[i][0] - keys[i - 1][0])))};
    return {i: keys.length - 1, u: 1, end: true};
  };
  const cam = (f: number): Cam => {
    const {i, u} = seg(f);
    const a = keys[Math.max(0, i - 1)], b = keys[i];
    const s = Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * u);
    let x = a[1] + (b[1] - a[1]) * u, y = a[2] + (b[2] - a[2]) * u;
    const r = (a[5] ?? 0) + ((b[5] ?? 0) - (a[5] ?? 0)) * u;
    for (const [sf, dur, amp] of shakes) {
      const k = f - sf;
      if (k >= 0 && k <= dur) { const d = (1 - k / dur) * amp / s; x += (rand(f * 1.7 + sf) - 0.5) * 2 * d; y += (rand(f * 2.3 + sf + 5) - 0.5) * 2 * d; }
    }
    return {x, y, s, r};
  };
  const tone = (f: number): Tone => {
    const {i, u} = seg(f);
    return mixTone(tones[Math.max(0, i - 1)], tones[i], u);
  };
  return {cam, tone};
};
