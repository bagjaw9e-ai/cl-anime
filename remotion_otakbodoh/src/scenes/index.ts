import {ShotDef} from './types';
import {shotHook} from './hook';
import {shotE1} from './efek1';
import {shotMid} from './mid';
import {shotE2} from './efek2';
import {shotE3, shotClose} from './efek3';
// 6 shot: HOOK+ONE SHOT (kamar ultah) -> EFEK 1 (ruang makan) -> MID-CTA (panggung) -> EFEK 2 (jalan+halte) -> EFEK 3 (kafe) -> PENUTUP 30 frame.
// Transisi berat hanya saat ganti tempat/efek; di dalam tempat = camera move + rack focus.
export const SHOTS: ShotDef[] = [shotHook, shotE1, shotMid, shotE2, shotE3, shotClose];
