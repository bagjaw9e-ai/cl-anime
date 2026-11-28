// ILLUSTRATION SHEET video "nikah dengan pecandu": semua ilustrasi BARU per beat (+ ikon panel neon). Semua dinamis.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Stage} from './Stage';
import {AkadTable, FantasySwirl, InviteInk, RingCharger} from './illustrations/nk/hook';
import {CardHouse, HandsetNk, HeartOrb} from './illustrations/nk/shared';
import {BurningTag, CactusWords, CrackWindow, DimLamp, DullPencil, ForcedDoor, FridgeChecklist, HoloProjector, KettleBoil, NightClock, PhoneOnStand,
  PlankBridge, PoisonPlant, RadarDish, ShadowPriceTag, SpinWheel, TissueCube, WaveToFlat} from './illustrations/nk/fase1';
import {CallusMitt, ChiliLadder, ConveyorFactory, DashWarning, FilingDrawer, FireflySwarm, FlashlightBeam, MiragePhone, ScientistSil, ShrinkSweater,
  TowerHead, WeekBeakers} from './illustrations/nk/fase2';
import {BrickWall, BrokenRobot, FallingToys, HandShadow, HeartHouse, LiftPanel, MonsterShadow, MuteBadge, NeonIcon, RedShout, RedSmoke, SlamDoor, StitchedHead,
  StormCloud, TangledString, TinCan, WallFrames} from './illustrations/nk/fase3';

export const ILL_W = 2400;
export const ILL_H = 5900;
type It = [string, number, (t: number) => React.ReactNode, number?]; // label, skala, render, offset y
const ITEMS: It[] = [
  ['B1 meja akad + buku nikah', 0.42, (t) => <AkadTable t={t} />, 60],
  ['B2 cincin + kabel charger -> HP 18+', 0.62, (t) => <RingCharger t={t} k={1} />, -20],
  ['B3 tinta merah tumpah di undangan', 0.66, (t) => <InviteInk t={t} k={0.7} />],
  ['B4 pusaran khayalan + kertas rencana', 0.62, (t) => <FantasySwirl t={t} />, 120],
  ['B5 rumah kartu goyah', 1.15, (t) => <CardHouse t={t} wob={1} />, 120],
  ['B5→6 rumah kartu runtuh jadi debu', 1.15, (t) => <CardHouse t={t} collapse={0.7} />, 120],
  ['B7 HP baru 18+ & kotak tisu kubus', 1, (t) => <g><g transform="translate(-60,0)"><HandsetNk t={t} w={130} h={240} /></g><g transform="translate(120,90)"><TissueCube t={t} /></g></g>],
  ['B8 jembatan papan jatuh ke jurang', 0.62, (t) => <PlankBridge t={t} k={0.45} />, -40],
  ['B9 HP proyektor + hologram pixel', 0.75, (t) => <HoloProjector t={t} />, 30],
  ['B10 hologram angguk (boneka per)', 0.75, (t) => <HoloProjector t={t} nod={1} />, 30],
  ['B11 roda putar kartu siluet', 0.62, (t) => <SpinWheel t={t} ang={t * 9} />, -30],
  ['B12 antena radar sinyal melemah', 1.3, (t) => <RadarDish t={t} k={0.6} />, 80],
  ['B14 gelombang suara -> garis datar', 0.85, (t) => <WaveToFlat t={t} />],
  ['B15 daftar tugas kulkas "ISTRI" dicentang', 0.68, (t) => <FridgeChecklist t={t} k={0.8} />],
  ['B16 label harga di bayangan istri + scan', 0.6, (t) => <ShadowPriceTag t={t} k={0.8} />, 20],
  ['B17 cahaya hati + label terbakar rontok', 1, (t) => <g><g transform="translate(-60,20)"><HeartOrb t={t} s={1.3} /></g><g transform="translate(110,-40)"><BurningTag t={t} k={0.45} /></g></g>],
  ['B18 lampu tidur redup vs HP 18+', 0.7, (t) => <g><g transform="translate(-170,0)"><DimLamp t={t} /></g><g transform="translate(170,0)"><PhoneOnStand t={t} /></g></g>],
  ['B19 ketel mendidih, tutup meletup', 0.72, (t) => <KettleBoil t={t} k={0.8} />, 20],
  ['B20 gelembung kata kaktus, duri melesat', 0.68, (t) => <g transform="translate(-140,0)"><CactusWords t={t} /></g>],
  ['B21 pintu: gagang diputar paksa, cahaya merah', 0.42, (t) => <ForcedDoor t={t} />],
  ['B23 tanaman disiram racun -> layu hitam', 0.85, (t) => <PoisonPlant t={t} k={0.6} />, 60],
  ['B24 kaca jendela retak menjalar', 0.62, (t) => <CrackWindow t={t} k={0.7} />],
  ['B25 jam dinding malam', 1.6, (t) => <NightClock t={t * 30} />],
  ['B26 pensil EMPATI tumpul + rautan berdebu', 0.62, (t) => <DullPencil t={t} k={0.5} />],
  ['B28 kepala: menara kontrol korslet', 0.62, (t) => <TowerHead t={t} k={0.5} />, 80],
  ['B29 senter: tajam -> melebar & redup', 0.68, (t) => <FlashlightBeam t={t} k={0.55} />],
  ['B30 pabrik ban berjalan kebanjiran kotak pink', 0.6, (t) => <ConveyorFactory t={t} k={0.8} />, 40],
  ['B31 sarung tangan baseball kapalan, bola mental', 0.62, (t) => <CallusMitt t={t} />],
  ['B33 HP fatamorgana pink', 0.68, (t) => <MiragePhone t={t} />, 80],
  ['B34 lampu peringatan dasbor + stiker AMAN', 0.62, (t) => <DashWarning t={t} k={0.75} />],
  ['B35 laci arsip + map JAMA PSYCHIATRY 2014', 0.6, (t) => <FilingDrawer t={t} k={0.95} />, 40],
  ['B36 rak 7 gelas ukur (S-M) terisi pink', 0.55, (t) => <WeekBeakers t={t} k={0.85} />],
  ['B37 sweater STRIATUM menyusut', 0.62, (t) => <ShrinkSweater t={t} k={0.8} />],
  ['B38 siluet ilmuwan + ? berputar', 0.6, (t) => <ScientistSil t={t} />, 40],
  ['B39 cabai level 1-5, yang terpedas diambil', 0.5, (t) => <ChiliLadder t={t} k={0.35} />],
  ['B40 kunang-kunang pink lolos', 0.8, (t) => <FireflySwarm t={t} />],
  ['B41 kain kepala sobek dijahit benang emas', 0.68, (t) => <StitchedHead t={t} k={0.45} />],
  ['B42 tombol lift naik, cahaya ke atas', 0.6, (t) => <LiftPanel t={t} k={0.7} />, 80],
  ['B43 jahitan emas selesai, kain utuh menyala', 0.68, (t) => <StitchedHead t={t} k={1} />],
  ['B45 bayangan -> monster bertanduk', 0.55, (t) => <MonsterShadow t={t} k={0.9} />, 40],
  ['B46 telepon kaleng, tali kusut kendor', 1, (t) => <g><g transform="translate(-170,-40)"><TinCan rot={-70} /></g><TangledString t={t} x0={-150} y0={-30} x1={160} y1={40} />
    <g transform="translate(180,50)"><TinCan rot={100} /></g></g>],
  ['B47 bata naik jadi tembok tinggi', 0.7, (t) => <BrickWall t={t} k={0.75} />, 160],
  ['B49 pintu dibanting', 0.42, (t) => <SlamDoor t={t} k={0.96} />],
  ['B50 ikon mute + asap merah dari celah pintu', 1, (t) => <g><g transform="translate(0,140)"><RedSmoke t={t} /></g><g transform="translate(0,-40)"><MuteBadge t={t} s={1.3} /></g></g>],
  ['B52 awan badai melayang', 0.8, (t) => <StormCloud t={t} />, -40],
  ['B54 gelombang bentakan merah + bingkai goyang + mainan jatuh', 0.62, (t) => <g><g transform="translate(-200,-120)"><RedShout t={t} /></g><g transform="translate(60,-150) scale(0.8)"><WallFrames t={t} shake={1} /></g>
    <g transform="translate(60,140) scale(0.8)"><FallingToys t={t} k={0.6} /></g></g>],
  ['B55 robot kayu patah + bayangan tangan membeku', 0.62, (t) => <g><g transform="translate(140,-80)"><HandShadow t={t} k={0.45} /></g><g transform="translate(-60,170)"><BrokenRobot t={t} /></g></g>],
  ['B56 miniatur rumah hangat + hati di atap', 0.62, (t) => <HeartHouse t={t} />, 40],
  ['B57 lampu padam, awan mengepung, kamar anak tetap nyala', 0.62, (t) => <HeartHouse t={t} off={0.85} clouds={0.9} />, 40],
];

export const IllustrationSheet: React.FC = () => {
  const f = useCurrentFrame();
  const t = 40 + f;
  const W = 460, H = 470, G = 14;
  return (
    <AbsoluteFill style={{background: '#07090D'}}>
      <svg width={ILL_W} height={ILL_H}>
        <text x={30} y={56} fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#F2EEE6">ILUSTRASI BARU per beat (semua bergerak: denyut, partikel, cairan, cahaya) — props pose ada di character_sheet</text>
        {ITEMS.map(([label, s, r, oy = 0], i) => {
          const col = i % 5, row = Math.floor(i / 5);
          return (
            <Stage key={i} x={20 + col * (W + G)} y={84 + row * (H + 60)} w={W} h={H} floor={H - 40} label={label}>
              <g transform={`translate(${W / 2},${H / 2 + oy * s}) scale(${s})`}>{r(t)}</g>
            </Stage>
          );
        })}
        {(() => {
          const col = 0, row = Math.ceil(ITEMS.length / 5);
          const icons: Array<[Parameters<typeof NeonIcon>[0]['name'], string]> = [['cracked_rings', '#FF4FB4'], ['cracked_gear', '#29E3FF'], ['glow_shield', '#FF2A3A'], ['cracked_house', '#FF1F2E']];
          return (
            <Stage x={20 + col * (W + G)} y={84 + row * (H + 60)} w={W * 2 + G} h={H} floor={H} label="IKON PANEL NEON: Fase 1 cincin retak · Fase 2 roda gigi retak · PMO SAVIOR perisai · Fase 3 rumah retak">
              {icons.map(([n, c], j) => <g key={n} transform={`translate(${120 + j * 220},${H / 2})`}><rect x={-80} y={-80} width={160} height={160} rx={24} fill="rgba(6,7,12,0.7)" stroke={c} strokeWidth={2} /><NeonIcon name={n} c={c} s={120} t={t} /></g>)}
            </Stage>
          );
        })()}
      </svg>
    </AbsoluteFill>
  );
};
