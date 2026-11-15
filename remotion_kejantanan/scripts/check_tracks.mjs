// Cek: maks ilustrasi kelihatan bareng, durasi gerak kamera >= 12 frame, karakter di dalam frame.
import {build} from 'esbuild';
import path from 'path';
import fs from 'fs';
import {pathToFileURL} from 'url';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tmp = path.join(root, 'node_modules/.cache/tracks.mjs');
fs.mkdirSync(path.dirname(tmp), {recursive: true});
fs.writeFileSync(path.join(root, 'node_modules/.cache/entry.ts'),
  `export * from '../../src/illustrationTrack'; export * from '../../src/cameraTrack'; export {charX, CHAR_SCALE} from '../../src/characterTrack'; export {TOTAL_FRAMES, BEATS} from '../../src/timeline';`);
await build({entryPoints: [path.join(root, 'node_modules/.cache/entry.ts')], bundle: true, format: 'esm', outfile: tmp, logLevel: 'error',
  external: ['remotion', 'react', 'flubber', '@remotion/*']});
const T = await import(pathToFileURL(tmp).href);
let mx = 0, mxf = 0;
for (let f = 0; f < T.TOTAL_FRAMES; f++) {
  const n = T.ILLS.filter((i) => f >= i.in && f < i.out + 10 && i.slot !== 'logo').length + (f >= T.ILLS.find((i) => i.key === 'logo').in ? 1 : 0);
  if (n > mx) { mx = n; mxf = f; }
}
console.log('maks ilustrasi bareng:', mx, '@frame', mxf, T.ILLS.filter((i) => mxf >= i.in && mxf < i.out + 10).map((i) => i.key).join(','));
console.log('gerak kamera < 12 frame:', T.MOVES.filter((m) => m.d < 12).length);
// karakter di layar: titik kepala & kaki
let bad = [];
for (let f = 0; f < T.TOTAL_FRAMES; f += 5) {
  const c = T.camAt(f);
  const pts = [[T.charX(f), -655]]; // kepala
  for (const [x, y] of pts) {
    const sx = 540 + (x - c.x) * c.z, sy = 960 + (y - c.y) * c.z;
    if (sx < 60 || sx > 1020 || sy < 60 || sy > 1860) { bad.push(f); break; }
  }
}
const beatOf = (f) => T.BEATS.filter((b) => b.f0 <= f).pop().id;
console.log('beat dengan kepala karakter di luar layar:', [...new Set(bad.map(beatOf))].join(',') || 'tidak ada');
