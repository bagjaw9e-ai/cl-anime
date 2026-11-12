// Render still per scene ke preview/scenes/sNN.png. Usage: node scripts/stills.mjs [pos=0.65] [ids...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'fs';
import path from 'path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const pos = parseFloat(process.argv[2] ?? '0.65');
const only = process.argv.slice(3).map(Number);
const src = fs.readFileSync(path.join(root, 'src/timeline.ts'), 'utf8');
const re = /id: (\d+),.*?start: ([\d.]+), end: ([\w.]+)/g;
const cuts = [];
let m;
while ((m = re.exec(src))) cuts.push({id: +m[1], s: +m[2], e: m[3] === 'VO_DURATION' ? 75.37 : +m[3]});
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'Main', browserExecutable});
fs.mkdirSync(path.join(root, 'preview/scenes'), {recursive: true});
for (const c of cuts) {
  if (only.length && !only.includes(c.id)) continue;
  const frame = Math.round((c.s + (c.e - c.s) * pos) * 30);
  const out = path.join(root, `preview/scenes/s${String(c.id).padStart(2, '0')}.png`);
  await renderStill({composition, serveUrl, output: out, frame, browserExecutable, chromiumOptions: {gl: 'swangle'}});
  console.log(c.id, frame);
}
