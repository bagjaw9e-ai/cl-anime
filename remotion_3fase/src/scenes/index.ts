import {ShotDef} from './types';
import {shotHook} from './hook';
import {shotF1} from './fase1';
import {shotMid} from './mid';
import {shotF2} from './fase2';
import {shotRiset} from './riset';
import {shotF3a, shotF3b, shotF3c} from './fase3';
// 8 shot. Transisi berat (light/whip/dark/blend) hanya saat GANTI TEMPAT/FASE; di dalam tempat = camera move + rack focus.
export const SHOTS: ShotDef[] = [shotHook, shotF1, shotMid, shotF2, shotRiset, shotF3a, shotF3b, shotF3c];
