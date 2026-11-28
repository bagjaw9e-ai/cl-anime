"""Jadwal SFX video "nikah dengan pecandu" -> data/sfx_cues.json + preview/sfx_missing.txt.
Frame diambil dari timeline beat/kata (sama dengan animasi di src/scenes/*). Jenis:
  anim  = animasi/ilustrasi/gerakan karakter  -> 20% volume VO
  trans = transisi + camera movement + panel neon ganti -> 15% volume VO
File dari public/sfx (library foley project sebelumnya). Bunyi yang belum ada filenya ditandai MISSING (+ fallback terdekat)."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
B = json.load(open(os.path.join(ROOT, 'data/beats.json')))
W = json.load(open(os.path.join(ROOT, 'data/words.json')))
FPS = 30
norm = lambda s: ''.join(ch for ch in s.lower() if ch.isalnum() or ch == '-')
def bf(b, off=0): return round(B[b - 1]['start'] * FPS) + off
def wf(b, w, off=0, nth=0):
    hits = [x for x in W[B[b - 1]['w0']:B[b - 1]['w1']] if norm(x['w']) == norm(w)]
    return round(hits[nth]['s'] * FPS) + off

# bunyi yang BELUM ADA filenya di public/sfx: nama -> (deskripsi, fallback dari library)
MISSING = {
    'ink_bottle_fall': ('botol tinta kaca kecil terguling & jatuh di meja kayu', 'glass_clink'),
    'wood_plank_crack': ('papan/kayu kering patah (krak) — jembatan papan & robot kayu mainan', 'piece_fall'),
    'rubber_squeak': ('sarung tangan karet tebal berdecit saat digenggam', 'wheel_squeak'),
    'muffled_talk': ('suara bicara teredam (gumam tanpa kata, seperti dari balik earphone)', 'muffle_down'),
    'fridge_door': ('pintu kulkas dibuka-tutup (hisap seal + tutup empuk)', 'door_close_soft'),
    'cashier_beep': ('bunyi scan kasir lembut (bip pendek, bukan laser)', 'monitor_beep'),
    'kettle_whistle': ('ketel mendidih bersiul (uap naik nada)', 'whistle'),
    'kettle_lid_pop': ('tutup ketel logam meletup terangkat lalu jatuh berdenting', 'pop_out'),
    'pebble_glass_hit': ('kerikil kecil kena kaca jendela (tik keras)', 'knock_tap'),
    'garage_roller': ('pintu garasi gulung (rolling door) bergulir naik', 'chain_rattle'),
    'metal_drawer': ('laci lemari arsip besi ditarik di rel logam', 'drawer_lock'),
    'washer_spin': ('mesin cuci: drum berputar + air berkecipak', 'gear_spin'),
    'needle_sew': ('jarum menembus kain + benang ditarik (menjahit)', 'string_zip'),
    'floor_creak': ('lantai kayu rumah berderit diinjak', 'seesaw_creak'),
    'brick_place': ('batu bata disusun satu-satu (klak bata + gesek semen)', 'chess_knock'),
    'door_slam': ('pintu kayu kamar dibanting keras', 'desk_slam'),
    'cloth_tear': ('kain payung sobek (robekan kain, bukan kertas)', 'paper_tear'),
}
C = []
def A(frame, f, note, dur=None): C.append({'frame': int(frame), 'cls': 'anim', 'file': f, 'note': note, 'dur': dur})
def T(frame, f, note, dur=None): C.append({'frame': int(frame), 'cls': 'trans', 'file': f, 'note': note, 'dur': dur})

# ---------------- HOOK ----------------
A(0, 'paper_page_turn', 'B1 kertas buku nikah dibuka')
T(11, 'tr_snap_zoom', 'B1 snap zoom ke cincin')
A(16, 'crystal_ting', 'B1 denting cincin dipasang')
T(bf(2, -4), 'tr_whip', 'B2 whip cepat ke kamar gelap')
A(bf(2, 3), 'cable_plug', 'B2 colokan charger (cincin -> kabel)')
A(wf(2, 'PMO'), 'phone_notification_soft', 'B2 notifikasi HP 18+')
T(bf(3), 'tr_snap_zoom', 'B3 snap push ke undangan')
A(bf(3, 2), 'ink_bottle_fall', 'B3 botol tinta jatuh')
A(bf(3, 10), 'ink_spread', 'B3 tinta merah menyebar')
# ---------------- ONE SHOT ----------------
T(bf(4, -4), 'tr_dissolve', 'B4 masuk one shot (dissolve)')
A(bf(4, 2), 'wind_room', 'B4 angin berputar (pusaran khayalan)', 2.4)
A(bf(4, 16), 'papers_fly', 'B4 kertas rencana beterbangan')
A(wf(5, 'masa'), 'paper_slide', 'B5 rumah kartu berpindah tangan, kartu bergeser')
A(wf(5, 'perjuangkan?') - 4, 'paper_collapse', 'B5 rumah kartu runtuh pelan')
# ---------------- FASE 1 ----------------
T(bf(6, -10), 'sand_flow', 'B6 debu rumah kartu -> reveal apartemen', 1.2)
T(bf(6), 'neon_on', 'B6 panel neon FASE 1 flicker nyala (buzz)')
T(bf(6, 6), 'click_sharp', 'B6 baterai terpasang (klik)')
A(bf(7, 2), 'screen_tap', 'B7 tap layar HP 18+')
T(bf(7, 4), 'tr_push', 'B7 zoom ke HP (tone geser)')
A(wf(7, 'bokep'), 'fizzle', 'B7 desis lembut')
T(bf(8, 16), 'whoosh_soft', 'B8 pindah fokus ke jembatan')
T(bf(8, 46), 'tr_air_fall', 'B8 tilt turun ke jembatan')
A(wf(8, 'ikatan'), 'wood_plank_crack', 'B8 papan kayu patah')
for i, off in enumerate([6, 15, 24, 33]): A(wf(8, 'ikatan') + off, 'piece_fall', f'B8 papan jatuh ke jurang #{i + 1}')
A(bf(9, 6), 'reel', 'B9 proyektor HP berputar')
T(bf(9, 14), 'tr_push', 'B9 zoom ke hologram')
A(bf(10, 4), 'boing', 'B10 boneka per boing (angguk)')
A(bf(10, 18), 'boing', 'B10 boing kedua')
A(bf(11, 2), 'dial_clicks', 'B11 roda putar tik-tik-tik')
A(bf(11, 28), 'wheel_squeak', 'B11 roda berdecit melambat')
T(bf(12, 14), 'whoosh_soft', 'B12 pan istri -> suami')
A(bf(12, 22), 'hum_down', 'B12 radar berdengung melemah')
T(bf(13, 14), 'tr_push', 'B13 zoom ke tangan')
A(wf(13, 'hangat'), 'rubber_squeak', 'B13 sarung tangan karet berdecit')
A(bf(14, 4), 'muffled_talk', 'B14 suara bicara istri teredam')
T(bf(14, 26), 'whoosh_soft', 'B14 pan ke suami')
T(bf(15, 4), 'tr_whip', 'B15 whip ke dapur')
A(bf(15, 24), 'fridge_door', 'B15 pintu kulkas')
A(wf(15, 'kewajiban'), 'pen_check', 'B15 spidol mencentang "ISTRI"')
T(bf(16, 6), 'tr_whip', 'B16 pindah ke dinding')
A(bf(16, 26), 'pop_soft', 'B16 label harga menempel di bayangan')
A(wf(16, 'benda'), 'cashier_beep', 'B16 label di-scan (kasir lembut)')
T(bf(17, 4), 'tr_push', 'B17 push-in ke istri')
A(bf(17, 6), 'fire_crackle', 'B17 label harga terbakar', 1.8)
T(bf(18, 4), 'whoosh_trans', 'B18 pan (blend) ke kamar')
A(wf(18, 'kamar'), 'light_switch', 'B18 saklar lampu tidur')
T(bf(19, 2), 'tr_whip', 'B19 whip ke ketel')
A(bf(19, 4), 'kettle_whistle', 'B19 siulan ketel')
A(wf(19, 'meledak'), 'kettle_lid_pop', 'B19 tutup ketel meletup')
T(bf(20, 4), 'whoosh_soft', 'B20 pan ke istri')
A(wf(20, 'ketus'), 'whoosh_throw', 'B20 duri kaktus melesat (whoosh kecil)')
T(bf(21, 6), 'tr_whip', 'B21 pindah ke pintu kamar')
A(bf(21, 24), 'knob_turn', 'B21 gagang pintu diputar paksa')
A(bf(21, 36), 'heartbeat', 'B21 detak jantung pelan', 3.2)
A(wf(21, 'tanpa'), 'knob_turn', 'B21 gagang diputar paksa lagi')
T(bf(22, 6), 'tr_air_rise', 'B22 tilt naik ke punggung beku')
A(bf(22, 8), 'wind_soft', 'B22 angin dingin pelan', 1.6)
T(bf(23, 6), 'whoosh_soft', 'B23 pindah ke tanaman')
A(wf(23, 'perilaku'), 'water_pour', 'B23 cairan racun dituang', 1.4)
A(wf(23, 'toksik'), 'steam_hiss', 'B23 desis tanaman layu', 1.4)
T(bf(24, 4), 'whoosh_soft', 'B24 push ke kaca')
A(1584, 'pebble_glass_hit', 'B24 kerikil kena kaca #1')
A(1588, 'crack_creep', 'B24 kaca retak menjalar')
A(1620, 'pebble_glass_hit', 'B24 kerikil kena kaca #2')
T(bf(25, 6), 'whoosh_soft', 'B25 tilt ke jam dinding')
A(bf(25, 14), 'clock_tick', 'B25 detak jam dinding', 2.6)
A(bf(25, 60), 'snore_soft', 'B25 dengkur pelan suami')
T(bf(26, 6), 'tr_push', 'B26 zoom ke pensil')
A(wf(26, 'sudah'), 'dull_knife', 'B26 pensil diraut tapi seret')
# ---------------- FASE 2 ----------------
T(bf(27, -10), 'tr_dark_fade', 'B27 fade lewat gelap ke garasi')
T(bf(27), 'neon_on', 'B27 panel neon FASE 2 (buzz)')
A(bf(27, 4), 'garage_roller', 'B27 pintu garasi bergulir')
T(bf(28, 6), 'tr_push', 'B28 zoom ke menara kontrol')
A(wf(28, 'pusat'), 'elec_flicker', 'B28 lampu menara korslet #1')
A(wf(28, 'prefrontal'), 'elec_flicker', 'B28 korslet #2')
A(wf(29, 'mengatur'), 'click_sharp', 'B29 klik senter')
A(wf(29, 'fokus'), 'hum_down', 'B29 dengung senter melemah')
T(bf(29, 20), 'whoosh_soft', 'B29 tilt ikut sinar')
T(bf(30, 6), 'tr_whip', 'B30 pindah ke pabrik mini')
A(bf(30, 10), 'gears_soft', 'B30 ban berjalan', 2.6)
A(wf(30, 'habis-habisan'), 'thud', 'B30 kotak jatuh')
A(wf(30, 'bokep'), 'heavy_sack_thud', 'B30 kotak bertumpuk & tumpah')
T(bf(31, 4), 'whoosh_soft', 'B31 zoom ke sarung tangan')
A(wf(31, 'kelelahan') - 4, 'ball_bounce', 'B31 bola mental keras')
A(wf(31, 'kebal'), 'ball_bounce', 'B31 bola mental lagi')
T(bf(32, 4), 'tr_whip', 'B32 pan ke pintu rumah')
A(bf(32, 10), 'door_open', 'B32 pintu dibuka pelan')
T(bf(33, 6), 'tr_push', 'B33 push ke HP')
A(bf(33, 4), 'shimmer_rise', 'B33 dengung fatamorgana halus')
T(bf(34, 6), 'tr_push', 'B34 zoom ke dasbor')
A(wf(34, 'menyangkal'), 'tape_pull', 'B34 stiker dikelupas')
A(wf(34, 'keras'), 'pop_soft', 'B34 stiker ditempel')
T(bf(35, 6), 'tr_push', 'B35 zoom ke laci arsip')
A(bf(35, 4), 'metal_drawer', 'B35 laci besi ditarik')
A(wf(35, '2014') - 6, 'stamp_thud', 'B35 stempel JAMA PSYCHIATRY 2014')
T(bf(36, 6), 'whoosh_soft', 'B36 pan horizontal ke rak tabung')
for i in range(7): A(bf(36, 12) + round(i * 13.4), 'water_pour', f'B36 cairan dituang ke gelas #{i + 1}', 0.42)
T(bf(37, 6), 'tr_push', 'B37 zoom ke mesin cuci')
A(bf(37, 2), 'washer_spin', 'B37 mesin cuci berputar', 1.6)
A(wf(37, 'menyusutnya') + 8, 'ting_short', 'B37 "ding" cucian selesai')
T(bf(38, 4), 'tr_air_rise', 'B38 tilt ke ilmuwan')
A(wf(38, 'menduga') - 4, 'tap_tap', 'B38 pulpen mengetuk papan jepit')
T(bf(39, 70), 'whoosh_soft', 'B39 pan ke cabai terpedas')
A(wf(39, 'ekstrem'), 'chew', 'B39 kunyah cabai')
A(wf(39, 'ekstrem') + 10, 'fire_crackle', 'B39 desis api cabai', 1.2)
T(bf(40, 4), 'whoosh_soft', 'B40 tracking ikut suami lari')
A(bf(40, 2), 'footsteps_short', 'B40 langkah lari')
A(wf(40, 'sensasi'), 'paper_flap', 'B40 kepakan kecil kunang-kunang')
# ---------------- MID-CTA ----------------
T(bf(41, -10), 'tr_dark_fade', 'B41 fade lewat gelap ke panggung')
T(bf(41), 'neon_on', 'B41 panel neon PMO SAVIOR (buzz)')
A(wf(41, 'neuroplasticity'), 'needle_sew', 'B41 jarum menjahit kain')
T(bf(42, 6), 'whoosh_soft', 'B42 pindah ke tombol lift')
A(wf(42, 'link') - 4, 'click_sharp', 'B42 tombol lift ditekan')
A(wf(42, 'bio'), 'metal_ding', 'B42 "ting" lift')
T(wf(42, 'PMO'), 'tr_air_rise', 'B42 tilt naik ikut cahaya')
A(wf(43, 'pulihkan'), 'string_zip', 'B43 benang emas ditarik kencang')
A(wf(43, 'otak'), 'sparkle', 'B43 kilau lembut kain utuh')
T(bf(43, 4), 'tr_push', 'B43 zoom ke kain kepala')
A(bf(44, 6), 'far_switches', 'B44 lampu panggung padam berurutan')
A(bf(44, 42), 'door_creak', 'B44 pintu rumah berderit')
T(bf(44, 52), 'tr_push', 'B44 zoom ke pintu merah')
# ---------------- FASE 3 ----------------
T(bf(45, -10), 'tr_door_light', 'B45 zoom tembus pintu -> lorong')
T(bf(45), 'neon_broken', 'B45 panel neon FASE 3 (buzz, flicker)')
A(bf(45, 8), 'floor_creak', 'B45 lantai kayu berderit')
T(bf(45, 56), 'tr_push', 'B45 push ke bayangan monster')
T(bf(45, 100), 'whoosh_soft', 'B45 pan ke anak')
A(bf(46, 4), 'spoon_clink', 'B46 kaleng berdenting')
A(wf(46, 'susah'), 'string_drop', 'B46 tali kaleng kendor')
T(bf(46, 40), 'whoosh_soft', 'B46 pan ke suami')
for i, off in enumerate([0, 18, 36, 54]): A(wf(47, 'membangun') + off, 'brick_place', f'B47 bata disusun #{i + 1}')
T(wf(47, 'tembok'), 'tr_air_rise', 'B47 tilt naik ikut tembok')
A(bf(48, 2), 'shield_clang', 'B48 perisai logam diangkat')
T(bf(48, 4), 'tr_push', 'B48 zoom ke perisai')
T(bf(49, 2), 'tr_whip', 'B49 whip ikut suami ke pintu')
A(wf(49, 'menghindar') + 4, 'door_slam', 'B49 pintu dibanting')
A(wf(50, 'membungkam'), 'bass_hit', 'B50 dentum pelan (lalu hening)')
T(bf(50, 4), 'tr_push', 'B50 push ke istri')
A(bf(51, 6), 'elec_flicker', 'B51 percikan listrik kabel kusut')
T(bf(51, 4), 'tr_push', 'B51 zoom ke kepala')
A(bf(52, 4), 'low_rumble', 'B52 guruh pelan', 2.0)
A(bf(52, 14), 'wind_room', 'B52 angin', 1.8)
T(bf(52, 16), 'whoosh_soft', 'B52 pull-out')
A(bf(53, 2), 'rain_loop', 'B53 hujan dari awan petir', 2.4)
A(wf(53, 'dilindungi') - 8, 'cloth_tear', 'B53 kain payung sobek')
T(bf(53, 16), 'tr_air_fall', 'B53 tilt ke istri & anak')
A(wf(54, 'bentakan'), 'muffled_shout', 'B54 dentum bentakan teredam (tanpa kata)')
A(wf(54, 'makian'), 'muffled_shout', 'B54 bentakan teredam kedua')
A(wf(54, 'makian') + 4, 'frame_fall', 'B54 mainan jatuh dari rak')
T(bf(54, 14), 'tr_push', 'B54 shake + zoom (tone merah)')
A(bf(55, 6), 'wood_plank_crack', 'B55 robot kayu mainan patah')
A(wf(55, 'verbal'), 'heavy_breath', 'B55 napas tertahan')
T(bf(55, 14), 'tr_push', 'B55 slow push ke mainan patah')
A(bf(56, 10), 'soft_hum', 'B56 lampu hangat berdengung lembut', 2.4)
T(bf(56, 14), 'whoosh_soft', 'B56 pull-out')
for i, off in enumerate([10, 24, 38]): A(bf(57, off), 'switch_off', f'B57 saklar lampu jendela mati #{i + 1}')
A(bf(57, 30), 'wind_soft', 'B57 angin malam', 2.6)

lib = set(f[:-4] for f in os.listdir(os.path.join(ROOT, 'public/sfx')) if f.endswith('.wav'))
for c in C:
    if c['file'] not in lib:
        assert c['file'] in MISSING, c
        c['missing'] = True; c['fallback'] = MISSING[c['file']][1]
        assert c['fallback'] in lib, c
C.sort(key=lambda c: c['frame'])
json.dump({'cues': C, 'missing': {k: {'desc': v[0], 'fallback': v[1]} for k, v in MISSING.items()}}, open(os.path.join(ROOT, 'data/sfx_cues.json'), 'w'), ensure_ascii=False, indent=0)
use = {}
for c in C:
    if c.get('missing'): use.setdefault(c['file'], []).append(c['note'].split(' ')[0] + f"@{c['frame']}")
lines = ['# SFX yang BELUM ADA filenya di public/sfx (library foley project sebelumnya, 355 file). Perlu disintesis / dikirim / pakai fallback.',
         '# nama_file | dipakai di (beat@frame) | deskripsi bunyi | fallback terdekat dari library']
for k, (d, fb) in MISSING.items():
    lines.append(f"{k}.wav | {', '.join(use.get(k, []))} | {d} | {fb}.wav")
open(os.path.join(ROOT, 'preview/sfx_missing.txt'), 'w').write('\n'.join(lines) + '\n')
na = sum(c['cls'] == 'anim' for c in C); nt = len(C) - na
print(len(C), 'cue:', na, 'animasi 20% +', nt, 'transisi 15% |', len(MISSING), 'bunyi belum ada,', sum(1 for c in C if c.get('missing')), 'cue terdampak')
