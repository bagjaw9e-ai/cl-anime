import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Stage} from './Stage';
import {Reflect} from './components/Lit';
import * as A from './illustrations/part1';
import * as B from './illustrations/part2';
import * as C from './illustrations/part3';
import * as S from './illustrations/shared';
import * as PR from './illustrations/promo';
import {WeddingPhoto, DeskFire} from './components/Places';

export const ILL_W = 2400;
export const ILL_H = 4440;
type It = [string, (t: number) => React.ReactNode, number, number]; // label, gambar (origin tengah panel), skala, warm
const ITEMS: It[] = [
  ['1 kilatan blitz', () => <g transform="translate(-860,-700) scale(1)"><A.CameraFlash k={3} /></g>, 0.35, 0.6],
  ['2 HP di saku jas 18+', () => <A.PocketPhone on={1} />, 1.6, 0.6],
  ['2 foto nikah retak', () => <WeddingPhoto crack={1} />, 1.1, 0.6],
  ['3 HP 18+ (siluet blur+sensor)', () => <S.Phone18 w={150} />, 1, 0],
  ['3 kotak tisu', (t) => <g transform="translate(0,60)"><A.TissueBox pull={(t % 30) / 30} /></g>, 1.2, 0],
  ['3 piala ironis (ikon tisu)', () => <g transform="translate(0,110)"><A.IronicTrophy /></g>, 1, 0],
  ['4 otak X-ray, retak 1-2-3', () => <A.XrayBrain cracks={[1, 1, 1]} />, 0.62, 0],
  ['5 retak melebar + tanda tanya', (t) => <g><A.XrayBrain cracks={[1, 1, 1]} widen={1} s={0.55} /><A.QuestionMarks on={1} t={t} /></g>, 1, 0],
  ['7 setir REWARD direbut', (t) => <A.RewardHijack grab={0.8} t={t} />, 0.5, 0],
  ['9 partikel pink banjiri kepala', (t) => <A.PinkFlood x1={-140} y1={120} x2={120} y2={-120} t={t} on={1} />, 1, 0],
  ['10 reseptor berkarat & tertutup', () => <A.Receptors rust={0.85} />, 0.55, 0],
  ['12 berkas jatuh', () => <g transform="translate(0,-60)"><A.FallingFiles fall={0.6} /></g>, 1, 0],
  ['13 sajadah + ruang kosong di dada', () => <g><g transform="translate(0,120)"><A.PrayerMat /></g><g transform="translate(0,-80)"><A.ChestHollow on={1} /></g></g>, 0.9, 0],
  ['15 timbangan wanita vs HP', (t) => <g transform="translate(0,90)"><A.BalanceScale tilt={1} t={t} /></g>, 0.6, 0],
  ['16 gelas bocor', (t) => <g transform="translate(0,90)"><A.LeakyGlass t={t} /></g>, 0.75, 0],
  ['17 tangga tambah terus + gauge', (t) => <g transform="translate(-20,160)"><A.EndlessStairs grow={1} needle={0.95} t={t} /></g>, 0.42, 0],
  ['18 otak amber menyala', (t) => <B.AmberBrain glow={1} t={t} s={0.6} />, 1, 0],
  ['18 jaringan neuron', (t) => <PR.NeuronNet t={t} grow={1} s={0.45} />, 1, 0],
  ['19 saraf disambung ulang', (t) => <B.NerveReconnect join={1} t={t} />, 0.45, 0],
  ['20 e-book + link + panah', (t) => <g><g transform="translate(-50,30)"><PR.EbookTablet t={t} on={1} s={0.45} /></g><g transform="translate(110,-60)"><PR.LinkIcon t={t} on={1} s={0.4} /></g><g transform="translate(110,-120)"><PR.ArrowUp t={t} on={1} h={120} /></g></g>, 1, 0],
  ['21 sirene merah (bukan laser)', (t) => <B.SirenLight on={1} t={t} />, 1, 0],
  ['23 PFC digerogoti rayap', (t) => <B.TermiteBrain eat={0.6} t={t} />, 0.6, 0.2],
  ['24 panel kendali, lampu mati', () => <B.Cockpit off={0.5} />, 0.65, 0.2],
  ['25 pedal rem patah', () => <g transform="translate(0,60)"><B.BrakePedal snap={0.3} /></g>, 0.9, 0.2],
  ['26 tali tekad putus', () => <B.WillRope p={0.85} />, 0.5, 0.2],
  ['27 korek + sumbu pendek', (t) => <B.MatchFuse burn={0.5} t={t} />, 1.2, 0.2],
  ['28 atasan siluet + asap marah', (t) => <g><g transform="translate(-40,300) scale(0.55)"><B.BossSilhouette point={1} /></g><S.AngerSteam x={90} y={-60} t={t} /></g>, 1, 0.2],
  ['29 dadu di atas berkas', (t) => <B.DiceOnFiles roll={0.8} t={t} />, 0.7, 0.2],
  ['30 kompas liar + jalan bercabang', (t) => <g><B.CompassSpin t={t} /><g transform="translate(0,200)"><B.ForkRoad /></g></g>, 0.8, 0.2],
  ['31 meja/berkas terbakar', () => <g transform="translate(0,80)"><DeskFire x={0} y={0} /></g>, 1, 0.2],
  ['32 jurnal JAMA + kaca pembesar', () => <B.Cockpit off={0} />, 0, 0],
  ['33 kalender jam/minggu + grafik', () => <C.WeekHours stack={1} bars={1} />, 0.42, 0],
  ['34 striatum mengecil + grafik turun', (t) => <C.StriatumBrain shrink={0.8} t={t} />, 0.55, 0],
  ['35 peneliti siluet + papan eskalasi', () => <g transform="translate(0,300)"><C.ResearcherBoard arrows={1} point={1} /></g>, 0.5, 0],
  ['36 treadmill + hati di tongkat', (t) => <g transform="translate(-60,140)"><C.TreadmillHeart t={t} /></g>, 0.5, 0],
  ['38 benang merah putus', (t) => <C.RedThread x1={-150} y1={0} x2={150} y2={0} snap={0.6} t={t} />, 1, 0.6],
  ['39 layar nurut + tombol OK', (t) => <C.ObedientScreen press={0.5} t={t} />, 0.55, 0.6],
  ['40 kartu di-swipe', (t) => <C.SwipeCards t={t} />, 0.5, 0.6],
  ['41 es merayap di dada', () => <C.IceChest ice={1} />, 1.2, 0.6],
  ['43 bubble cerita jatuh', (t) => <C.FallingBubbles t={t} x1={-130} y1={-80} dir={1} floorY={140} />, 1, 0.6],
  ['45 viewfinder + manekin (simbolik)', () => <C.Viewfinder w={300} h={420} m={1} />, 0.75, 0.6],
  ['46 hati nyala lalu retak', () => <C.HeartCrack glow={1} crack={0.7} />, 1.3, 0.6],
  ['49 bubble #@!% (tanpa kata kasar)', () => <S.JaggedBubble />, 0.8, 0.6],
  ['51 foto nikah jatuh & pecah', () => <WeddingPhoto crack={1} />, 1.1, 0.6],
  ['53 piring pecah', () => <C.BrokenPlate p={0.8} />, 1.3, 0.6],
  ['55 hati jadi batu', () => <C.StoneHeart stone={1} />, 1.3, 0.6],
  ['* garis putus-putus penunjuk', () => <S.DashPointer x1={-140} y1={-120} x2={120} y2={100} />, 1, 0],
];
// beat 32 pakai komponen JournalGlow (di-swap di sini supaya urutan label rapi)
ITEMS[30] = ['32 jurnal JAMA + kaca pembesar', () => <C.JournalGlow on={1} mag={0.6} />, 0.55, 0];

export const IllustrationSheet: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#07090D'}}>
      <svg width={ILL_W} height={ILL_H}>
        {ITEMS.map(([label, el, s, warm], i) => {
          const col = i % 6, row = Math.floor(i / 6);
          const w = 380, h = 480, floor = 440;
          return (
            <Stage key={i} x={20 + col * 396} y={20 + row * 550} w={w} h={h} floor={floor} warm={warm} label={label}>
              <Reflect floor={floor} op={0.12} depth={40}><g transform={`translate(${w / 2},${h / 2 - 10}) scale(${s})`}>{el(t)}</g></Reflect>
            </Stage>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
