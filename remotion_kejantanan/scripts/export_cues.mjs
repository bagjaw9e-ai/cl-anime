// Ekspor cue SFX yang sudah di-resolve (frame absolut) dari src/timeline.ts -> data/sfx_cues.json
import {build} from 'esbuild';
import fs from 'fs';
import path from 'path';
import {pathToFileURL} from 'url';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tmp = path.join(root, 'node_modules/.cache/timeline.mjs');
fs.mkdirSync(path.dirname(tmp), {recursive: true});
await build({entryPoints: [path.join(root, 'src/timeline.ts')], bundle: true, format: 'esm', outfile: tmp, logLevel: 'error'});
const T = await import(pathToFileURL(tmp).href + '?' + Date.now());
const out = {
  fps: T.FPS_T, total_frames: T.TOTAL_FRAMES, vo_duration: T.VO_DURATION,
  scenes: T.CUTS.map((c, i) => ({id: c.id, text: c.text, ...T.sceneWindow(i)})),
  cues: T.resolveCues(),
};
fs.writeFileSync(path.join(root, 'data/sfx_cues.json'), JSON.stringify(out, null, 1));
console.log(`${out.cues.length} cues -> data/sfx_cues.json`);
