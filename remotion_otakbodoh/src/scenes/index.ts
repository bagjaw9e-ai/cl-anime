import {ShotDef} from './types';
import {HOOK_SHOTS} from './hook';
import {shotF1, shotPmo} from './fase1';
import {shotF2, shotF3} from './fase2';
import {shotOffice, shotRoad} from './masaDepan';
// HOOK (4 quick cut, tempat beda) -> ONE SHOT (ruang kosong) -> FASE 1 perpustakaan -> PMO SAVIOR panggung -> FASE 2 hutan
// -> FASE 3 jalan basah -> kantor -> jalan ke cakrawala + penutup. Transisi besar hanya saat ganti fase/tempat.
export const SHOTS: ShotDef[] = [...HOOK_SHOTS, shotF1, shotPmo, shotF2, shotF3, shotOffice, shotRoad];
