import {ShotDef} from './types';
import {setKeyPos} from '../components/UI';
import {HOOK_SHOTS} from './hook';
import {shotOneShot} from './oneShot';
import {shotF1} from './fase1';
import {shotF2} from './fase2';
import {shotCta} from './midCta';
import {shotF3} from './fase3';
// HOOK (3 quick cut, tempat beda) -> ONE SHOT kamar pengantin -> FASE 1 apartemen -> FASE 2 garasi -> MID-CTA panggung
// -> FASE 3 lorong + kamar anak (tahan sampai BGM habis). Transisi besar hanya saat ganti tempat/fase.
export const SHOTS: ShotDef[] = [...HOOK_SHOTS, shotOneShot, shotF1, shotF2, shotCta, shotF3];

// posisi layar subtitle poin penting 💬 (default [540, 1250] = sedikit di bawah ilustrasi; digeser bila menutup wajah)
setKeyPos({54: [600, 650], 55: [640, 1270]});
