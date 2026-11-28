// PROPS POSE BARU video "nikah dengan pecandu" untuk rig pria (Character) — semua digambar baru & selalu bergerak.
// Koordinat: torso frame (asal = pinggul, sudah ikut lean) untuk back/front; head frame untuk head; body frame (asal = tanah) untuk body.
import React from 'react';
import {rand} from '../theme';
import {CardHouse, HandsetNk, Pebble} from '../illustrations/nk/shared';

type Pt = {x: number; y: number};
type Arm = {sh: Pt; el: Pt; hand: Pt; a2: number};
export type NkGeo = {cur: string; t: number; f: number; AR: Arm; AL: Arm; torsoH: number; headY: number; tx: number; pitchDY: number; noProps?: boolean; pelvisY: number};

const MALE_NEW = new Set([
  'shaking_hands_akad', 'slipping_ring', 'standing_in_fantasy_swirl', 'holding_house_of_cards', 'lounging_on_armrest_phone',
  'wearing_thick_gloves', 'earphones_ignoring', 'ticking_checklist_blindly', 'comparing_two_lights', 'back_turned_frosty',
  'throwing_pebbles', 'sleeping_soundly_back_turned', 'sticking_sticker_on_warning_light', 'peering_through_binoculars',
  'chasing_fireflies', 'pressing_elevator_button_up', 'raising_huge_shield', 'slamming_door_shut', 'head_full_of_tangled_wires',
  'storm_cloud_head',
]);
export const isNikahPose = (p: string) => MALE_NEW.has(p);

// ---------- di BELAKANG badan (torso frame) ----------
export const nkBack = (g: NkGeo) => {
  const {cur, t, torsoH} = g;
  if (g.noProps) return null;
  if (cur === 'standing_in_fantasy_swirl') {
    // garis angin melingkar di belakang badan
    return (
      <g opacity={0.55}>
        {[0, 1, 2, 3].map((i) => {
          const ph = (t * 0.06 + i * 0.25) % 1;
          return <path key={i} d={`M ${-170 + ph * 60} ${-torsoH + 40 + i * 50} q 90 ${-30 - i * 6} 180 0 t 160 0`} stroke="#F7D6E6" strokeWidth={4}
            fill="none" strokeLinecap="round" opacity={Math.sin(ph * Math.PI)} transform={`translate(${ph * 40},0)`} />;
        })}
      </g>
    );
  }
  return null;
};

// ---------- di DEPAN badan & lengan (torso frame) ----------
export const nkFront = (g: NkGeo) => {
  const {cur, t, AR, AL, torsoH} = g;
  if (g.noProps) return null;
  const mid = {x: (AR.hand.x + AL.hand.x) / 2, y: (AR.hand.y + AL.hand.y) / 2};
  switch (cur) {
    case 'shaking_hands_akad': {
      // tangan wali (lengan baju putih, siluet) menjabat dari kiri; pompa jabat tangan
      const pump = Math.sin(t * 0.33) * 6;
      const h = {x: AR.hand.x - 6, y: AR.hand.y + pump * 0.5};
      return (
        <g>
          <path d={`M ${h.x - 330} ${h.y + 70} Q ${h.x - 160} ${h.y + 40} ${h.x - 30} ${h.y + 4}`} stroke="#D9D4CA" strokeWidth={38} fill="none" strokeLinecap="round" />
          <path d={`M ${h.x - 330} ${h.y + 70} Q ${h.x - 160} ${h.y + 40} ${h.x - 30} ${h.y + 4}`} stroke="#FFFFFF" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.5} transform="translate(0,-9)" />
          <ellipse cx={h.x - 16} cy={h.y + 4} rx={22} ry={17} fill="#D9A882" />
          <path d={`M ${h.x - 30} ${h.y - 8} q 18 -6 34 4`} stroke="#C08A66" strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>
      );
    }
    case 'slipping_ring': {
      // tangan pengantin wanita (lengan kebaya brokat) diulurkan dari kiri; cincin emas bergerak dari tangan kiri ke jari manis
      const k = 0.5 + 0.5 * Math.sin(t * 0.16);
      const bh = {x: AR.hand.x - 4, y: AR.hand.y - 26};
      const ring = {x: AL.hand.x + (bh.x + 26 - AL.hand.x) * k, y: AL.hand.y - 8 + (bh.y - AL.hand.y + 8) * k};
      return (
        <g>
          <path d={`M ${bh.x - 300} ${bh.y + 60} Q ${bh.x - 150} ${bh.y + 30} ${bh.x - 10} ${bh.y}`} stroke="#F6EFE4" strokeWidth={30} fill="none" strokeLinecap="round" />
          {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={bh.x - 260 + i * 52} cy={bh.y + 52 - i * 13} r={6} fill="#E3D3B4" opacity={0.8} />)}
          <ellipse cx={bh.x + 4} cy={bh.y} rx={17} ry={12} fill="#F1C9A5" />
          <rect x={bh.x + 12} y={bh.y - 5} width={30} height={9} rx={4.5} fill="#F1C9A5" />
          <g transform={`translate(${ring.x},${ring.y})`}>
            <circle r={26} fill="#FFD166" opacity={0.25 + 0.15 * Math.sin(t * 0.5)} />
            <ellipse rx={11} ry={8} fill="none" stroke="#F2C14E" strokeWidth={5} />
            <path d="M 0 -14 l 4 -8 l -4 -6 l -4 6 Z" fill="#E8FBFF" />
            <path transform={`translate(10,-16) scale(${0.6 + 0.4 * Math.abs(Math.sin(t * 0.3))})`} d="M 0 -8 C 1 -2 2 -1 8 0 C 2 1 1 2 0 8 C -1 2 -2 1 -8 0 C -2 -1 -1 -2 0 -8 Z" fill="#FFFFFF" />
          </g>
        </g>
      );
    }
    case 'holding_house_of_cards':
      return (
        <g>
          <g transform={`translate(${AR.hand.x - 10},${AR.hand.y - 14}) rotate(${Math.sin(t * 0.21) * 3})`}><CardHouse t={t} s={0.62} wob={1} glow={0.5} /></g>
          <g transform={`translate(${AL.hand.x + 2},${AL.hand.y - 30}) rotate(-12)`}><HandsetNk t={t} w={46} h={86} badge={0} /></g>
        </g>
      );
    case 'lounging_on_armrest_phone':
      return <g transform={`translate(${AL.hand.x - 4},${AL.hand.y - 36}) rotate(-6)`}><HandsetNk t={t} w={48} h={90} back badge={0.8} /></g>;
    case 'earphones_ignoring':
      return <g transform={`translate(${AR.hand.x + 6},${AR.hand.y - 30}) rotate(10)`}><HandsetNk t={t} w={44} h={84} back badge={0} color="#8FB8FF" /></g>;
    case 'ticking_checklist_blindly': {
      return (
        <g>
          <g transform={`translate(${AL.hand.x + 8},${AL.hand.y - 6}) rotate(${-50 + Math.sin(t * 0.9) * 8})`}>
            <rect x={-8} y={-52} width={16} height={60} rx={6} fill="#1C1C22" />
            <rect x={-9} y={-60} width={18} height={18} rx={5} fill="#E8203A" />
            <path d="M -5 8 L 5 8 L 0 20 Z" fill="#101014" />
          </g>
          <g transform={`translate(${AR.hand.x + 4},${AR.hand.y - 30}) rotate(-8)`}><HandsetNk t={t} w={44} h={84} back badge={0} color="#8FB8FF" /></g>
        </g>
      );
    }
    case 'back_turned_frosty':
      // kristal embun beku di punggung + uap dingin naik dari bahu
      return (
        <g>
          <path d={`M -70 ${-torsoH + 10} Q 0 ${-torsoH - 6} 70 ${-torsoH + 10} L 76 -30 L -76 -30 Z`} fill="#BFE6FF" opacity={0.16 + 0.04 * Math.sin(t * 0.2)} />
          {Array.from({length: 9}).map((_, i) => {
            const x = -56 + rand(i * 3.1) * 112, y = -torsoH + 30 + rand(i * 5.7) * (torsoH - 70), s = 0.6 + rand(i) * 0.7;
            return (
              <g key={i} transform={`translate(${x},${y}) scale(${s}) rotate(${t * 0.5 + i * 20})`} opacity={0.55 + 0.35 * Math.sin(t * 0.15 + i)}>
                {[0, 60, 120].map((r) => <line key={r} x1={-10} y1={0} x2={10} y2={0} stroke="#E8F7FF" strokeWidth={2.6} transform={`rotate(${r})`} strokeLinecap="round" />)}
              </g>
            );
          })}
          {[-1, 1].map((sd) => [0, 1].map((k) => {
            const ph = (t * 0.02 + k * 0.5 + (sd > 0 ? 0.25 : 0)) % 1;
            return <circle key={`${sd}${k}`} cx={sd * (60 + ph * 20)} cy={-torsoH - 10 - ph * 120} r={12 + ph * 22} fill="#DDF2FF" opacity={(1 - ph) * 0.3} />;
          }))}
        </g>
      );
    case 'throwing_pebbles': {
      // kerikil di genggaman kanan + kerikil yang dilempar dari tangan kiri tiap siklus
      const cyc = (t / 36) % 1;
      const fly = cyc > 0.45 ? (cyc - 0.45) / 0.55 : -1;
      return (
        <g>
          {[0, 1, 2].map((i) => <g key={i} transform={`translate(${AR.hand.x - 12 + i * 14},${AR.hand.y - 16 - (i % 2) * 10})`}><Pebble s={1.1} seed={i + 2} /></g>)}
          {fly < 0 ? (
            <g transform={`translate(${AL.hand.x},${AL.hand.y - 10})`}><Pebble s={1.3} seed={9} /></g>
          ) : (
            <g>
              {[0.12, 0.08, 0.04].map((d, i) => {
                const q = Math.max(0, fly - d);
                return <circle key={i} cx={AL.hand.x + q * 420} cy={AL.hand.y - 10 - Math.sin(q * Math.PI) * 120 + q * 60} r={10 - i * 2} fill="#C9C4D2" opacity={0.25 - i * 0.06} />;
              })}
              <g transform={`translate(${AL.hand.x + fly * 420},${AL.hand.y - 10 - Math.sin(fly * Math.PI) * 120 + fly * 60}) rotate(${fly * 400})`}><Pebble s={1.4} seed={9} /></g>
            </g>
          )}
        </g>
      );
    }
    case 'sticking_sticker_on_warning_light':
      return (
        <g>
          <g transform={`translate(${AL.hand.x + 18},${AL.hand.y + 8}) rotate(${-8 + Math.sin(t * 0.4) * 3})`}>
            <rect x={-46} y={-22} width={92} height={44} rx={10} fill="#5FD08A" stroke="#FFFFFF" strokeWidth={4} />
            <text x={0} y={10} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={26} fill="#0E3A22">AMAN</text>
          </g>
          <g transform={`translate(${AR.hand.x},${AR.hand.y - 12}) rotate(-14)`}>
            <rect x={-30} y={-40} width={60} height={80} rx={6} fill="#F4F1EA" />
            {[0, 1].map((i) => <rect key={i} x={-22} y={-30 + i * 36} width={44} height={26} rx={6} fill="#5FD08A" opacity={0.9} />)}
          </g>
        </g>
      );
    case 'raising_huge_shield': {
      const c = {x: mid.x, y: mid.y - 30};
      return (
        <g transform={`translate(${c.x},${c.y}) rotate(${Math.sin(t * 0.25) * 2})`}>
          <circle r={176} fill="#000" opacity={0.25} transform="translate(8,10)" />
          <circle r={172} fill="#6E7688" />
          <circle r={172} fill="none" stroke="#B9C0CE" strokeWidth={16} />
          <circle r={130} fill="none" stroke="#5A6172" strokeWidth={6} />
          {Array.from({length: 12}).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <circle key={i} cx={Math.cos(a) * 152} cy={Math.sin(a) * 152} r={6} fill="#D9DEE8" />;
          })}
          <circle r={42} fill="#9AA2B2" stroke="#D9DEE8" strokeWidth={6} />
          <path d="M -110 -90 Q -40 -150 40 -140" stroke="#FFFFFF" strokeWidth={10} fill="none" opacity={0.25} strokeLinecap="round" />
          <path d="M 60 40 l 14 10 M 70 30 l -6 18 M -80 60 l 12 -6" stroke="#4A5060" strokeWidth={4} strokeLinecap="round" />
        </g>
      );
    }
    case 'slamming_door_shut': {
      const ph = (t * 0.05) % 1;
      return (
        <g opacity={0.7}>
          {[0, 1, 2].map((i) => <path key={i} d={`M ${AL.hand.x + 30} ${AL.hand.y - 40 + i * 34} l ${70 + i * 10} 0`} stroke="#F2EEE6" strokeWidth={5} strokeLinecap="round"
            opacity={Math.sin(((ph + i * 0.2) % 1) * Math.PI)} />)}
        </g>
      );
    }
    case 'pressing_elevator_button_up': {
      const p = (t * 0.04) % 1;
      return <circle cx={AL.hand.x + 34} cy={AL.hand.y - 8} r={10 + p * 40} fill="none" stroke="#FFC23F" strokeWidth={4} opacity={1 - p} />;
    }
    default:
      return null;
  }
};

// ---------- di frame KEPALA (ikut tilt/pitch kepala) ----------
export const nkHead = (g: NkGeo, outfit: string) => {
  const {cur, t, tx, pitchDY} = g;
  const peci = outfit === 'koko' && (
    <g transform={`translate(${tx * 0.25},${pitchDY * 0.55 - 6})`}>
      <path d="M -74 -84 L -64 -146 Q 0 -158 64 -146 L 74 -84 Q 0 -94 -74 -84 Z" fill="#15151B" />
      <path d="M -74 -84 Q 0 -94 74 -84 L 74 -96 Q 0 -106 -74 -96 Z" fill="#26262E" />
      <path d="M -60 -140 Q 0 -152 60 -140" stroke="#3A3A46" strokeWidth={5} fill="none" opacity={0.8} />
    </g>
  );
  if (g.noProps) return peci || null;
  let el: React.ReactNode = null;
  if (cur === 'earphones_ignoring') {
    const beat = Math.abs(Math.sin(t * 0.35));
    el = (
      <g>
        <path d="M -96 -10 C -104 -150 104 -150 96 -10" stroke="#1E2230" strokeWidth={14} fill="none" strokeLinecap="round" />
        {[-1, 1].map((sd) => (
          <g key={sd} transform={`translate(${sd * 90},0)`}>
            <rect x={-24} y={-38} width={48} height={76} rx={22} fill="#2A3042" />
            <rect x={-16} y={-28} width={32} height={56} rx={15} fill="#3E4760" />
            <circle cx={sd * 4} cy={0} r={6} fill="#8FB8FF" opacity={0.5 + 0.5 * beat} />
          </g>
        ))}
      </g>
    );
  } else if (cur === 'peering_through_binoculars') {
    el = (
      <g transform={`translate(${tx},${pitchDY + 2})`}>
        {[-1, 1].map((sd) => (
          <g key={sd} transform={`translate(${sd * 34},0)`}>
            <rect x={-26} y={-30} width={52} height={62} rx={14} fill="#22252E" />
            <circle cx={0} cy={-26} r={24} fill="#30343F" stroke="#5A6070" strokeWidth={4} />
            <circle cx={0} cy={-26} r={15} fill="#9FD3FF" opacity={0.35 + 0.25 * Math.sin(t * 0.3 + sd)} />
            <path d="M -8 -34 l 8 -4" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
          </g>
        ))}
        <rect x={-10} y={-10} width={20} height={20} rx={4} fill="#3A3E4A" />
      </g>
    );
  } else if (cur === 'head_full_of_tangled_wires') {
    // jendela kaca di ubun-ubun: kabel kusut warna-warni + percikan
    const W = ['#FF5A5A', '#4FB3FF', '#FFD166', '#7CE38B'];
    el = (
      <g>
        <ellipse cx={0} cy={-80} rx={84} ry={58} fill="#0B0D14" opacity={0.92} />
        {W.map((c, i) => {
          const j = (k: number) => Math.sin(t * 0.7 + i * 2 + k) * 4;
          return <path key={i} d={`M ${-70 + j(1)} ${-70 + i * 6} C ${-40 + j(2)} ${-140 + i * 10} ${-10} ${-20} ${20 + j(3)} ${-100 + i * 8} S ${60} ${-50 + j(4)} ${70} ${-90 + i * 6} M ${-50} ${-50 + i * 4} q ${40 + j(5)} ${-60} ${80} ${-10} t ${30} ${-30}`}
            stroke={c} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.9} />;
        })}
        {[0, 1, 2].map((i) => {
          const on = rand(Math.floor(t / 4) * 3 + i) > 0.55;
          const x = -50 + rand(Math.floor(t / 4) + i * 7) * 100, y = -110 + rand(Math.floor(t / 4) * 2 + i) * 50;
          return on ? <g key={i} transform={`translate(${x},${y})`}>
            <circle r={10} fill="#FFF4C2" opacity={0.6} />
            {[0, 45, 90, 135].map((r) => <line key={r} x1={-12} x2={12} y1={0} y2={0} stroke="#FFFFFF" strokeWidth={2.5} transform={`rotate(${r})`} />)}
          </g> : null;
        })}
        <ellipse cx={0} cy={-80} rx={84} ry={58} fill="none" stroke="#CFE8FF" strokeWidth={5} opacity={0.75} />
        <path d="M -54 -116 Q -20 -134 20 -128" stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={0.35} strokeLinecap="round" />
      </g>
    );
  } else if (cur === 'storm_cloud_head') {
    const fl = rand(Math.floor(t / 3)) > 0.8;
    el = (
      <g transform={`translate(${Math.sin(t * 0.1) * 8},${-250 + Math.sin(t * 0.14) * 6})`}>
        {fl && <circle r={130} fill="#E8F1FF" opacity={0.18} />}
        {[[-70, 10, 46], [-26, -18, 58], [32, -10, 54], [76, 12, 40], [0, 22, 50]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? '#3A3F52' : '#2E3244'} />)}
        <path d="M -100 30 Q 0 52 100 30" stroke="#22263A" strokeWidth={14} fill="none" strokeLinecap="round" />
        {fl && <path d="M 6 36 L -14 86 L 6 84 L -8 130 L 30 70 L 10 72 L 24 36 Z" fill="#FFE27A" />}
        {Array.from({length: 7}).map((_, i) => {
          const ph = (t * 0.06 + i / 7) % 1;
          return <line key={i} x1={-70 + i * 22} y1={50 + ph * 90} x2={-76 + i * 22} y2={64 + ph * 90} stroke="#9FC4FF" strokeWidth={3} opacity={1 - ph} />;
        })}
      </g>
    );
  }
  return <g>{el}{peci}</g>;
};

// ---------- di frame BADAN (asal = tanah, ikut roll) ----------
export const nkBody = (g: NkGeo) => {
  const {cur, t, torsoH, pelvisY} = g;
  if (g.noProps) return null;
  if (cur === 'sleeping_soundly_back_turned') {
    // selimut menutup dari bahu ke kaki; naik-turun napas tidur
    const br = Math.sin(t * 0.12) * 4;
    const top = -pelvisY - torsoH + 40;
    return (
      <g>
        <path d={`M -120 ${top - br} Q 0 ${top - 30 - br} 120 ${top - br} L 130 10 Q 0 30 -130 10 Z`} fill="#4A5578" />
        <path d={`M -120 ${top - br} Q 0 ${top - 30 - br} 120 ${top - br} L 120 ${top + 30 - br} Q 0 ${top + 6 - br} -120 ${top + 30 - br} Z`} fill="#E8E2D6" />
        {[0, 1, 2].map((i) => <path key={i} d={`M ${-90 + i * 70} ${top + 60} q 20 ${80 + i * 20} 0 ${200 + i * 40}`} stroke="#3A4462" strokeWidth={5} fill="none" opacity={0.6} />)}
      </g>
    );
  }
  return null;
};

/* =============================== PROPS POSE BARU ISTRI (FemaleCharacter) =============================== */
export type NkFGeo = {cur: string; t: number; AR: Arm; AL: Arm; torsoH: number; headY: number; pelvisY: number; noProps?: boolean};
export const nkFemaleFront = (g: NkFGeo) => {
  const {cur, t, AR, AL, torsoH, headY} = g;
  if (g.noProps) return null;
  const mid = {x: (AR.hand.x + AL.hand.x) / 2, y: (AR.hand.y + AL.hand.y) / 2};
  switch (cur) {
    case 'offering_model_house':
      return <g transform={`translate(${mid.x},${mid.y - 8})`}><CardHouse t={t} s={0.5} wob={0.35} glow={0.8} /></g>;
    case 'waving_unnoticed': {
      return (
        <g opacity={0.6}>
          {[0, 1].map((i) => <path key={i} d={`M ${AL.hand.x + 26 + i * 16} ${AL.hand.y - 30 - i * 8} q 14 20 0 40`} stroke="#FFE3EC" strokeWidth={4} fill="none"
            strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(t * 0.4 + i)} />)}
        </g>
      );
    }
    case 'holding_husband_hand_warm': {
      const p = 1 + 0.1 * Math.sin(t * 0.22);
      return (
        <g transform={`translate(${mid.x},${mid.y})`}>
          <circle r={90 * p} fill="#FF9A3C" opacity={0.18} />
          <circle r={50 * p} fill="#FFB866" opacity={0.3} />
          <circle r={24} fill="#FFE2B0" opacity={0.55} />
          {[0, 1, 2, 3].map((i) => {
            const ph = (t * 0.03 + i / 4) % 1;
            return <circle key={i} cx={-20 + i * 14 + Math.sin(ph * 6) * 6} cy={-ph * 90} r={3} fill="#FFD9A0" opacity={1 - ph} />;
          })}
        </g>
      );
    }
    case 'talking_soundwave': {
      const m = {x: -6, y: headY + 52};
      return (
        <g>
          {[0, 1, 2, 3].map((i) => {
            const ph = (t * 0.035 + i / 4) % 1;
            return <path key={i} d={`M ${m.x - 40 - ph * 170} ${m.y - 22 - ph * 30} Q ${m.x - 62 - ph * 190} ${m.y} ${m.x - 40 - ph * 170} ${m.y + 22 + ph * 30}`}
              stroke="#FFC6DA" strokeWidth={5} fill="none" strokeLinecap="round" opacity={(1 - ph) * 0.9} />;
          })}
        </g>
      );
    }
    case 'shielding_heart_glow':
      return <g transform={`translate(${mid.x},${mid.y - 4})`}><HeartOrbSmall t={t} /></g>;
    case 'holding_tin_can_phone': {
      const c = {x: AR.hand.x - 6, y: AR.hand.y - 18};
      const sag = 40 + Math.sin(t * 0.12) * 14;
      return (
        <g>
          <path d={`M ${c.x - 20} ${c.y + 10} Q ${c.x - 170} ${c.y + 60 + sag} ${c.x - 320} ${c.y + 30}`} stroke="#E8DCC6" strokeWidth={3} fill="none" />
          <g transform={`translate(${c.x},${c.y}) rotate(-70)`}>
            <rect x={-22} y={-30} width={44} height={60} rx={6} fill="#B9BEC8" />
            <rect x={-22} y={-30} width={44} height={8} fill="#8A909C" />
            <rect x={-22} y={22} width={44} height={8} fill="#8A909C" />
            <rect x={-22} y={-14} width={44} height={22} fill="#C9304A" opacity={0.85} />
            <path d="M -16 -26 L -16 26" stroke="#FFFFFF" strokeWidth={4} opacity={0.35} />
          </g>
        </g>
      );
    }
    case 'holding_torn_umbrella_over_child': {
      const h = AL.hand, top = {x: h.x - 150, y: h.y - 190};
      const fl = Math.sin(t * 0.5);
      return (
        <g>
          <line x1={h.x} y1={h.y + 20} x2={top.x + 30} y2={top.y - 100} stroke="#3A3440" strokeWidth={8} strokeLinecap="round" />
          <path d={`M ${h.x} ${h.y + 20} q 0 26 -20 26`} stroke="#3A3440" strokeWidth={9} fill="none" strokeLinecap="round" />
          <g transform={`translate(${top.x},${top.y}) rotate(-16)`}>
            <path d="M -250 40 Q -200 -100 0 -110 Q 200 -100 250 40 Q 210 20 166 40 Q 120 16 84 40 Q 40 18 0 40 Q -40 18 -84 40 Q -120 16 -166 40 Q -210 20 -250 40 Z" fill="#5E7FA8" />
            <path d="M 0 -110 L -84 40 M 0 -110 L 84 40 M 0 -110 L -166 40 M 0 -110 L 166 40" stroke="#4A6890" strokeWidth={4} />
            {/* sobekan: lubang gelap bergerigi + sobekan kain berkibar */}
            <path d="M 60 -40 l 20 -8 l 8 18 l 18 -4 l -6 22 l 14 12 l -26 4 l -6 18 l -14 -16 l -18 6 l 4 -20 l -16 -10 Z" fill="#0C0E16" />
            <path d={`M 150 10 l 30 ${20 + fl * 12} l -14 6 Z`} fill="#5E7FA8" />
            <path d="M -130 -20 l 16 -6 l 6 14 l -10 12 l -16 -6 Z" fill="#0C0E16" />
            <path d={`M -120 -14 l ${-10 + fl * 8} 40 l 8 2 Z`} fill="#5E7FA8" />
            {Array.from({length: 6}).map((_, i) => {
              const ph = (t * 0.07 + i / 6) % 1, x = i % 2 ? 80 : -122;
              return <line key={i} x1={x + i * 2} y1={-10 + ph * 160} x2={x + i * 2 - 3} y2={6 + ph * 160} stroke="#A9CBFF" strokeWidth={3} opacity={1 - ph} />;
            })}
          </g>
        </g>
      );
    }
    default:
      return null;
  }
};
// selimut untuk istri berbaring (frame badan, ikut roll)
export const nkFemaleBody = (g: NkFGeo) => {
  const {cur, t, torsoH, pelvisY} = g;
  if (g.noProps || cur !== 'lying_awake_in_bed') return null;
  const br = Math.sin(t * 0.14) * 3;
  const top = -pelvisY - torsoH + 70;
  return (
    <g>
      <path d={`M -140 ${top - br} Q 0 ${top - 24 - br} 140 ${top - br} L 150 14 Q 0 34 -150 14 Z`} fill="#8E6A86" />
      <path d={`M -140 ${top - br} Q 0 ${top - 24 - br} 140 ${top - br} L 140 ${top + 34 - br} Q 0 ${top + 10 - br} -140 ${top + 34 - br} Z`} fill="#EDE4E8" />
      {[0, 1, 2].map((i) => <path key={i} d={`M ${-100 + i * 80} ${top + 70} q 24 ${70 + i * 16} 0 ${180 + i * 30}`} stroke="#6E4E68" strokeWidth={5} fill="none" opacity={0.55} />)}
    </g>
  );
};
const HeartOrbSmall: React.FC<{t: number}> = ({t}) => {
  const p = 1 + 0.08 * Math.sin(t * 0.25);
  return (
    <g transform={`scale(${p})`}>
      <circle r={78} fill="#FF7A9A" opacity={0.16} />
      <circle r={46} fill="#FFB3C4" opacity={0.28} />
      <path d="M 0 -6 C -10 -24 -36 -20 -33 2 C -31 16 -12 28 0 38 C 12 28 31 16 33 2 C 36 -20 10 -24 0 -6 Z" transform="translate(0,-12) scale(0.72)" fill="#FFE1E8" stroke="#FF6F91" strokeWidth={4} />
      {[0, 1, 2].map((i) => {
        const ph = (t * 0.025 + i / 3) % 1;
        return <circle key={i} cx={-16 + i * 16} cy={-20 - ph * 70} r={3} fill="#FFD0DC" opacity={1 - ph} />;
      })}
    </g>
  );
};
