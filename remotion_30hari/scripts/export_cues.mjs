// Ekspor cue SFX (frame absolut) dari src/sfxTrack.ts -> data/sfx_cues.json
import {build} from 'esbuild';
import fs from 'fs';
import path from 'path';
import {pathToFileURL} from 'url';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const entry = path.join(root, 'node_modules/.cache/sfx_entry.ts');
const tmp = path.join(root, 'node_modules/.cache/sfx.mjs');
fs.mkdirSync(path.dirname(tmp), {recursive: true});
fs.writeFileSync(entry, `export * from '../../src/sfxTrack'; export {BEATS, TOTAL_FRAMES, VO_DURATION, FPS_T} from '../../src/timeline';`);
await build({entryPoints: [entry], bundle: true, format: 'esm', outfile: tmp, logLevel: 'error', loader: {'.json': 'json'}, external: ['remotion', 'react']});
const T = await import(pathToFileURL(tmp).href + '?' + Date.now());
const out = {fps: T.FPS_T, total_frames: T.TOTAL_FRAMES, vo_duration: T.VO_DURATION,
  beats: T.BEATS.map((b) => ({id: b.id, text: b.text, f0: b.f0, imp: !!b.imp})), cues: T.SFX_CUES};
fs.writeFileSync(path.join(root, 'data/sfx_cues.json'), JSON.stringify(out, null, 1));
const k = {}; for (const c of out.cues) k[c.kind] = (k[c.kind] || 0) + 1;
console.log(`${out.cues.length} cue ->`, JSON.stringify(k));
