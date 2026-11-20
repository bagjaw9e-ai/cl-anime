// SHOT 2: FASE 1 — kamar tidur pria malam (beat 6-17). Satu tempat: ganti fokus pakai camera move + rack focus.
import React from 'react';
import {BedroomNight} from '../components/Places';
import {LitCharacter, LitFemale, Reflect, Halo} from '../components/Lit';
import {Spotlight} from '../components/Spot';
import * as A from '../illustrations/part1';
import {DashPointer} from '../illustrations/shared';
import {Appear, be, bf, camKeys, ease, kp, ramp} from '../kit';
import {clamp} from '../theme';
import {ShotDef} from './types';

const FL = 1150; // lantai kamar (kaki karakter)
const PINKH = '#FF8FC0';
// opasitas segmen waktu [a,b) dengan crossfade (karakter pindah posisi/pose antar beat)
const seg = (f: number, a: number, b: number, fd = 6) => clamp(Math.min((f - a) / fd + 1, (b - f) / fd + 1, 1));

export const shotF1: ShotDef = {
  id: 'f1', from: bf(6), to: bf(18), enter: 'light', trLen: 14, trColor: '#FFD23F', floorY: 1150,
  cam: (f) => camKeys(f, [
    [bf(6), 760, 760, 1.9], [bf(6, 22), 600, 820, 1.0],            // keluar dari retakan -> reveal kamar (pull-out)
    [bf(7), 640, 800, 1.05], [bf(7, 30), 720, 760, 1.2],          // push ke otak
    [bf(8), 470, 660, 1.3], [bf(8, 14), 470, 660, 1.3],            // pan ke jendela + jam 02.00
    [bf(9, 4), 760, 880, 1.4], [bf(10), 740, 860, 1.4],            // tilt ke kasur (HP)
    [bf(10, 20), 720, 800, 1.35], [bf(11), 720, 800, 1.35],          // push ke reseptor
    [bf(11, 24), 560, 860, 1.0], [bf(12), 560, 860, 1.0],          // pull-out: kamar luntur
    [bf(12, 8), 260, 860, 1.3], [bf(13), 260, 860, 1.3],           // pan kiri ke meja
    [bf(13, 8), 540, 930, 1.3], [bf(14), 540, 930, 1.3],           // sajadah
    [bf(14, 10), 580, 860, 1.05], [bf(15), 580, 860, 1.05],        // light reveal wanita
    [bf(15, 14), 580, 720, 1.2], [bf(16), 580, 720, 1.2],          // push ke timbangan
    [bf(16, 10), 540, 760, 1.15], [bf(17), 540, 760, 1.15],        // gelas bocor
    [bf(17, 10), 480, 860, 0.95], [be(17), 620, 560, 1.05],        // tangga: tilt naik ngikutin
  ]),
  bg: (f) => <BedroomNight gray={ease(f, bf(11, 6), bf(11, 70))} clockOn={1} />,
  bgBlur: (f) => 2.2 + 1.5 * (ease(f, bf(15), bf(15, 10)) - ease(f, be(17) - 10, be(17))),
  dim: (f) => 0.32 + 0.12 * ease(f, bf(15), bf(15, 10)),
  fg: (f) => {
    const stairsN = 5 + 6 * ease(f, bf(17, 4), be(17) - 10);
    const stepI = Math.min(stairsN - 1, 2 + (stairsN - 3) * ease(f, bf(17, 8), be(17) - 6));
    const stairX = (i: number) => 300 + (-260 + i * 56 + 35) * 0.95, stairY = (i: number) => FL + 100 - i * 52 * 0.95;
    return (
      <g>
        <Spotlight x={kp(f, [[bf(6), 760], [bf(12), 760], [bf(12, 6), 260], [bf(13, 6), 540], [bf(14, 6), 600]])} y={820} rx={520} ry={700} dark={0.55} />
        {/* beat 6-7: duduk di kasur, wajah kena glow HP */}
        <g opacity={seg(f, bf(6), bf(8, 4))}>
          <Reflect floor={FL} op={0.12}><LitCharacter id="f1a" x={760} y={FL} scale={1.0} pose={[[-100, 'sitting_bed_bored'], [bf(7), 'sitting_relaxed_phone']]}
            expression={[[-100, 'bored'], [bf(7, 6), 'hooked']]} phoneColor="#FF5FA2" haloColor={PINKH} /></Reflect>
        </g>
        <Appear f={f} a={bf(7, 4)} b={be(7)} x={430} y={700} s={0.5}><A.RewardHijack grab={ease(f, bf(7, 16), bf(7, 60))} t={f} /></Appear>
        <Appear f={f} a={bf(7, 10)} b={be(7)} kind="glow"><DashPointer x1={700} y1={760} x2={560} y2={720} p={ramp(f, bf(7, 10), bf(7, 24))} color={PINKH} /></Appear>
        {/* beat 8: jam 02.00 disorot */}
        <Appear f={f} a={bf(8)} b={bf(9, 10)} kind="glow"><Halo x={507} y={900} rx={110} color="#FF4D7A" op={0.6} /></Appear>
        {/* beat 8-10: rebahan main HP, partikel pink membanjiri kepala */}
        <g opacity={seg(f, bf(8, 4), bf(11, 4))}>
          <g transform="translate(1040,1000) rotate(-90)">
            <LitCharacter id="f1b" x={0} y={0} scale={0.62} pose="lying_on_bed_phone" expression={[[-100, 'hooked'], [bf(10), 'dazed']]} phoneColor="#FF5FA2" haloColor={PINKH} />
          </g>
        </g>
        <A.PinkFlood x1={740} y1={870} x2={700} y2={990} t={f} on={ease(f, bf(9, 4), bf(9, 16)) * (1 - ease(f, be(9), be(9, 8)))} />
        <Appear f={f} a={bf(10, 4)} b={be(10)} x={720} y={740} s={0.45}><A.Receptors rust={ease(f, bf(10, 14), bf(10, 56))} /></Appear>
        {/* beat 11: duduk bosan, kamar luntur */}
        <g opacity={seg(f, bf(11, 4), bf(12, 4))}>
          <Reflect floor={FL} op={0.12}><LitCharacter id="f1c" x={760} y={FL} scale={1.0} pose="sitting_bed_bored" expression="bored" haloColor="#C9B8E8" /></Reflect>
        </g>
        {/* beat 12: kerja males di meja laptop, berkas jatuh */}
        <g opacity={seg(f, bf(12, 4), bf(13, 4))}>
          <Reflect floor={FL + 60} op={0.12}><LitCharacter id="f1d" x={300} y={FL + 60} scale={0.95} pose="yawning_at_desk" expression="lazy" haloColor={PINKH} /></Reflect>
          <g transform="translate(130,880)"><A.FallingFiles fall={ease(f, bf(12, 6), be(12))} /></g>
        </g>
        {/* beat 13: sajadah, ruang kosong di dada */}
        <g opacity={seg(f, bf(13, 4), bf(14, 4))}>
          <g transform="translate(540,1240)"><A.PrayerMat /></g>
          <LitCharacter id="f1e" x={540} y={1232} scale={1.0} pose="sitting_blank_on_prayer_mat" expression="empty" haloColor="#BFD4FF" halo={0.6} />
          <g transform="translate(540,1090)"><A.ChestHollow on={ease(f, bf(13, 8), bf(13, 18))} /></g>
        </g>
        {/* beat 14-16: wanita masuk bawa teh (light reveal), pria tetap di HP */}
        <g opacity={seg(f, bf(14, 4), bf(17, 4))}>
          <Reflect floor={1250} op={0.12}>
            <LitCharacter id="f1f" x={360} y={1250} scale={1.05} pose="holding_phone" expression={[[-100, 'hooked'], [bf(16), 'restless']]} phoneColor="#FF5FA2" haloColor={PINKH} />
            <g transform={`translate(${kp(f, [[bf(14), 300], [bf(14, 20), 0]])},0)`} opacity={1 - ease(f, bf(16, 4), bf(16, 20))}>
              <LitFemale id="f1w" x={780} y={1250} scale={1.0} pose="bringing_tea" expression={[[-100, 'hopeful'], [bf(15, 20), 'disappointed']]} haloColor="#FFD9A0"
                halo={1 + ease(f, bf(14), bf(14, 14))} />
            </g>
          </Reflect>
          <Appear f={f} a={bf(14, 4)} b={be(14)} kind="glow"><Halo x={780} y={880} rx={260} ry={420} color="#FFD9A0" op={0.35} /></Appear>
        </g>
        <Appear f={f} a={bf(15, 4)} b={be(15)} x={580} y={620} s={0.55}><A.BalanceScale tilt={ease(f, bf(15, 18), bf(15, 46))} t={f} /></Appear>
        <Appear f={f} a={bf(16, 4)} b={be(16)} x={600} y={760} s={0.8}><A.LeakyGlass t={f} /></Appear>
        {/* beat 17: tangga yang terus bertambah, pria naik terus, gauge ke merah */}
        <g opacity={seg(f, bf(17, 2), be(17) + 20)}>
          <g transform={`translate(300,${FL + 100}) scale(0.95)`}><A.EndlessStairs grow={ease(f, bf(17, 4), be(17) - 10)} needle={ease(f, bf(17, 20), be(17) - 8)} t={f} /></g>
          <LitCharacter id="f1g" x={stairX(stepI)} y={stairY(stepI)} scale={0.62} pose="climbing_stairs" expression="obsessive" haloColor="#FF8A5A" />
        </g>
      </g>
    );
  },
};
