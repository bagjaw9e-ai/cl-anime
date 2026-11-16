import {continueRender, delayRender, staticFile} from 'remotion';

// Poppins ExtraBold/Bold (dari @fontsource/poppins, disalin ke public/fonts) untuk subtitle, callout, label.
export const FONT = 'Poppins, Inter, DejaVu Sans, sans-serif';
if (typeof document !== 'undefined') {
  const h = delayRender('load Poppins');
  Promise.all([
    new FontFace('Poppins', `url(${staticFile('fonts/poppins-latin-800-normal.woff2')}) format('woff2')`, {weight: '800'}).load(),
    new FontFace('Poppins', `url(${staticFile('fonts/poppins-latin-700-normal.woff2')}) format('woff2')`, {weight: '700'}).load(),
  ]).then((fs) => { fs.forEach((f) => (document.fonts as unknown as {add: (x: FontFace) => void}).add(f)); continueRender(h); }).catch(() => continueRender(h));
}
