// Render still di frame absolut: node scripts/stills_abs.mjs nama:frame nama:frame ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'Main', browserExecutable});
for (const a of process.argv.slice(2)) {
  const [name, fr] = a.split(':');
  await renderStill({composition, serveUrl, output: path.join(root, 'preview', name + '.png'), frame: +fr, browserExecutable, chromiumOptions: {gl: 'swangle'}});
  console.log(name, fr);
}
