"""Jadwal SFX video umur25 di FRAME KEJADIAN animasi (frame absolut 30 fps, sinkron src/scenes/*.tsx).
Kelas (brief): anim = SFX animasi/ilustrasi/gerakan karakter 20% VO; trans = SFX transisi/camera move 10% VO.
Output: data/sfx_cues.json, preview/sfx_map.txt (draf), preview/sfx_missing.txt."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
B = json.load(open(os.path.join(ROOT, 'data/beats.json')))
bf = lambda i, o=0: round(B[i - 1]['start'] * 30) + o
VO_F = round(105.44 * 30)
C = [  # (frame, file, kelas, durasi maks dtk / None, catatan)
 # HOOK
 (2, 'match_strike', 'anim', 0.8, 'B1 korek menyalakan lilin 25'), (6, 'party_popper', 'anim', None, 'B1 party popper + confetti meledak'),
 (4, 'whoosh_fast', 'trans', 0.4, 'B1 snap zoom-in ke lilin'),
 (bf(2, 4), 'candle_blow', 'anim', None, 'B2 lilin ditiup -> gelap'), (bf(2, 8), 'whoosh_fast', 'trans', 0.4, 'B2 whip cepat + flash ke pria'),
 (bf(2, 14), 'phone_notification_soft', 'anim', None, 'B2 notifikasi HP di balik punggung'),
 # ONE SHOT
 (bf(3, 34), 'crack_soft', 'anim', None, 'B3 retakan 1'), (bf(3, 48), 'crack_soft', 'anim', None, 'B3 retakan 2'), (bf(3, 62), 'crack_soft', 'anim', None, 'B3 retakan 3'),
 (bf(3, 20), 'deflate', 'anim', 1.6, 'B3 balon kempes pelan (dekorasi layu)'),
 (bf(4, 0), 'curtain_open', 'anim', 1.2, 'B4 kain/tirai bergeser, dinding jadi layar bayangan'), (bf(4, 30), 'heavy_breath', 'anim', 1.2, 'B4 napas'),
 (bf(5, 2), 'crack_creep', 'anim', 1.2, 'B5 retakan merayap'), (bf(5, 6), 'heartbeat', 'anim', 1.0, 'B5 detak jantung pelan'),
 (bf(6, -6), 'light_sweep_air', 'trans', None, 'tembus retakan 1 -> kilat merah ke Efek 1'),
 # EFEK 1
 (bf(6, 8), 'stamp_thud', 'anim', None, 'B6 label chip EFEK 1 (stempel)'),
 (bf(7, 4), 'match_strike', 'anim', None, 'B7 korek di sumbu'), (bf(7, 16), 'fuse_hiss', 'anim', 1.2, 'B7 desis sumbu terbakar'),
 (bf(8, 6), 'crack_soft', 'anim', None, 'B8 gelas retak'),
 (bf(9, 8), 'desk_slam', 'anim', None, 'B9 meja digebrak'), (bf(9, 12), 'chair_scrape', 'anim', None, 'B9 kursi bergeser (keluarga mundur)'),
 (bf(10, 6), 'screen_tap', 'anim', None, 'B10 tap layar HP'),
 (bf(11, 4), 'water_flow', 'anim', 1.5, 'B11 air bah partikel pink'),
 (bf(12, 14), 'power_down', 'anim', None, 'B12 HP mati'),
 (bf(13, 4), 'fall_whoosh', 'anim', 0.6, 'B13 mood jatuh bebas'), (bf(13, 20), 'thud', 'anim', 0.6, 'B13 dentum'),
 (bf(14, 14), 'paper_tear', 'anim', None, 'B14 kertas tagihan disobek dari buku'),
 (bf(15, 24), 'spoon_clink', 'anim', None, 'B15 sendok'), (bf(15, 30), 'munch', 'anim', None, 'B15 kunyah lucu'),
 (bf(16, 8), 'water_slosh', 'anim', 0.8, 'B16 air tumpah'), (bf(16, 38), 'cartoon_blast', 'anim', None, 'B16 kepala meledak (bom kartun teredam)'),
 (bf(17, 10), 'footsteps_walk', 'anim', 1.6, 'B17 langkah di tangga'), (bf(17, 40), 'gauge_rise', 'anim', None, 'B17 jarum gauge ke merah'),
 (bf(17, 6), 'whoosh_up', 'trans', 0.5, 'B17 tilt naik ngikutin tangga'),
 (bf(18, 12), 'click_sharp', 'anim', 0.3, 'B18 folder diklik'), (bf(18, 28), 'click_sharp', 'anim', 0.3, 'B18 folder diklik'), (bf(18, 44), 'click_sharp', 'anim', 0.3, 'B18 folder diklik'),
 (bf(18, 54), 'shield_clang', 'anim', None, 'B18 dentang perisai'),
 (bf(19, 26), 'stamp_thud', 'anim', None, 'B19 stempel NORMAL'),
 (bf(20, 14), 'chair_scrape', 'anim', None, 'B20 kursi terbalik'), (bf(20, 24), 'plate_break', 'anim', None, 'B20 piring pecah'),
 (bf(21, 4), 'footsteps_short', 'anim', None, 'B21 langkah menjauh'), (bf(21, 14), 'frame_fall', 'anim', 0.5, 'B21 bingkai miring (gesek paku)'),
 (bf(22, 4), 'ink_spread', 'anim', 1.6, 'B22 tinta/noda merah menyebar'), (bf(22, 10), 'heartbeat', 'anim', 1.5, 'B22 detak jantung'),
 # MID-CTA
 (bf(23, -6), 'light_switch', 'trans', None, 'fade lewat gelap: lampu mati lalu objek nyala'),
 (bf(23, 6), 'chime_soft', 'anim', None, 'B23 ting lembut otak amber'), (bf(23, 10), 'warm_swell', 'anim', None, 'B23 swell hangat'),
 (bf(24, 8), 'click_sharp', 'anim', 0.35, 'B24 klik link'),
 (bf(25, 50), 'tape_pull', 'anim', None, 'B25 perban dilepas'), (bf(25, 80), 'sigh', 'anim', 1.2, 'B25 napas lega'),
 (bf(26, 2), 'light_switch', 'anim', None, 'B26 saklar mati'), (bf(26, 8), 'bass_hit', 'anim', 1.4, 'B26 dentum rendah'),
 # EFEK 2
 (bf(27, -5), 'whoosh_fast', 'trans', None, 'whip slide ke jalan kota'), (bf(27, 6), 'stamp_thud', 'anim', None, 'B27 label chip EFEK 2'),
 (bf(27, 10), 'car_pass', 'anim', None, 'B27 mobil lewat'),
 (bf(28, 4), 'bubble_pop', 'anim', None, 'B28 awan hayalan pop'), (bf(28, 14), 'pop_soft', 'anim', None, 'B28 gelembung pop'),
 (bf(29, 4), 'heels_steps', 'anim', 1.2, 'B29 langkah heels'), (bf(29, 12), 'bus_pass', 'anim', 1.6, 'B29 bus lewat'),
 (bf(30, 4), 'paper_crumple', 'anim', None, 'B30 kertas diremas'), (bf(30, 10), 'steam_hiss', 'anim', 0.8, 'B30 desis sensor'),
 (bf(31, 0), 'knock_tap', 'anim', None, 'B31 ketukan (Kenapa?)'),
 (bf(32, 10), 'dumbbell_set_down', 'anim', None, 'B32 barbel diangkat/diletakkan'), (bf(32, 18), 'workout_breath', 'anim', 1.2, 'B32 napas berat angkat beban'),
 (bf(33, 4), 'stone_grind', 'anim', 1.4, 'B33 batu bergeser'), (bf(33, 20), 'sand_flow', 'anim', 1.0, 'B33 debu'),
 (bf(34, 4), 'munch', 'anim', None, 'B34 kunyah'), (bf(34, 26), 'bird_chirp', 'anim', 1.2, 'B34 kicau burung (sarang)'),
 (bf(35, 20), 'seesaw_creak', 'anim', None, 'B35 kayu jungkat-jungkit berderit'), (bf(35, 58), 'thud', 'anim', 0.6, 'B35 thud otak tengah turun'),
 (bf(36, 20), 'scale_clank', 'anim', 1.0, 'B36 timbangan berdenting'),
 (bf(37, 4), 'glass_fog', 'anim', 1.4, 'B37 embun/napas di kaca'),
 (bf(38, 2), 'water_rush', 'anim', 1.6, 'B38 arus air deras'),
 (bf(39, 8), 'bus_brake', 'anim', None, 'B39 rem bus mendadak'), (bf(39, 20), 'heartbeat', 'anim', 2.0, 'B39 detak jantung'),
 (bf(40, 10), 'paper_page_turn', 'anim', None, 'B40 kertas dibalik'),
 (bf(41, 4), 'camera_shutter', 'anim', None, 'B41 shutter kamera jurnal'), (bf(41, 14), 'stamp_thud', 'anim', None, 'B41 stempel PLOS ONE 2014'),
 # EFEK 3
 (bf(42, -6), 'light_sweep_air', 'trans', None, 'light sweep ke kafe'), (bf(42, 6), 'stamp_thud', 'anim', None, 'B42 label chip EFEK 3'), (bf(42, 14), 'cup_tray', 'anim', None, 'B42 cangkir kopi'),
 (bf(43, 16), 'gear_jam', 'anim', None, 'B43 gear macet berderit'),
 (bf(44, 10), 'sigh', 'anim', 1.6, 'B44 helaan napas panjang'),
 (bf(45, 4), 'knob_turn', 'anim', 1.0, 'B45 putaran lensa'),
 (bf(46, 2), 'paper_flap', 'anim', 1.2, 'B46 kertas beterbangan'),
 (bf(47, 4), 'cup_tray', 'anim', None, 'B47 cangkir diletakkan (lalu hening canggung)'),
 (bf(48, 30), 'heavy_sack_thud', 'anim', None, 'B48 beban jatuh di pundak'),
 (bf(49, 20), 'sand_flow', 'anim', 1.8, 'B49 pasir berjatuhan'),
 (bf(50, 4), 'room_tone', 'anim', 2.4, 'B50 dengung ruangan pelan'), (bf(50, 2), 'whoosh_soft', 'trans', 0.6, 'B50 extreme push-in ke mata'),
 (bf(51, 4), 'chair_scrape', 'anim', None, 'B51 kursi bergeser pelan'), (bf(51, 30), 'heavy_breath', 'anim', 1.4, 'B51 napas'),
 # PENUTUP (20%)
 (VO_F + 8, 'glass_shatter', 'anim', 0.9, 'PENUTUP kaca pecah halus (3 otak retak pecah)'), (VO_F + 24, 'light_switch', 'anim', None, 'PENUTUP saklar lampu mati'),
]
MISSING_DESC = {
 'party_popper': 'party popper meletus + kertas confetti', 'candle_blow': 'tiupan napas mematikan lilin (fuh)', 'fuse_hiss': 'sumbu terbakar mendesis',
 'chair_scrape': 'kursi kayu bergeser di lantai', 'paper_tear': 'kertas tagihan disobek dari buku', 'spoon_clink': 'sendok logam berdenting',
 'munch': 'kunyah lucu (nyam-nyam, bukan vokal)', 'cartoon_blast': 'ledakan kartun teredam (poof + debu, bukan bom realistis)',
 'shield_clang': 'perisai logam berdentang', 'ink_spread': 'tinta basah menyebar/merembes', 'car_pass': 'mobil lewat (whoosh ban + mesin)',
 'heels_steps': 'langkah sepatu heels di trotoar', 'bus_pass': 'bus lewat (mesin berat + angin)', 'paper_crumple': 'kertas diremas',
 'knock_tap': 'ketukan kayu dua kali', 'seesaw_creak': 'kayu jungkat-jungkit berderit', 'glass_fog': 'napas di kaca dingin (hah) + embun',
 'water_rush': 'arus air deras', 'bus_brake': 'rem bus mendadak (desis angin + decit)', 'room_tone': 'dengung ruangan pelan (AC/kafe sepi)',
}
FALLBACK = {'party_popper': '-', 'candle_blow': 'breath? (heavy_breath)', 'fuse_hiss': 'steam_hiss', 'chair_scrape': 'wheel_creak', 'paper_tear': 'tape_pull',
 'spoon_clink': 'glass_clink', 'munch': '-', 'cartoon_blast': 'thud', 'shield_clang': 'rusty_clank', 'ink_spread': 'water_bubbles', 'car_pass': 'whoosh_air',
 'heels_steps': 'footsteps_short', 'bus_pass': 'engine_idle_soft', 'paper_crumple': 'paper_rustle', 'knock_tap': 'soft_hit', 'seesaw_creak': 'chest_hinge',
 'glass_fog': 'heavy_breath', 'water_rush': 'water_flow', 'bus_brake': 'brake_snap (logam, kurang cocok)', 'room_tone': 'neon_hum'}
have = set(x[:-4] for x in os.listdir(os.path.join(ROOT, 'public/sfx')))
cues = [{'frame': f, 'file': n, 'cls': c, 'dur': d, 'note': nt} for f, n, c, d, nt in sorted(C)]
json.dump({'fps': 30, 'cues': cues}, open(os.path.join(ROOT, 'data/sfx_cues.json'), 'w'), indent=1, ensure_ascii=False)
with open(os.path.join(ROOT, 'preview/sfx_map.txt'), 'w') as o:
    o.write('# SFX map (draf) | frame | detik | beat/jenis | file | status | catatan\n# jenis: anim = animasi/ilustrasi/gerakan karakter 20% VO, trans = transisi/camera move 10% VO\n')
    for c in cues:
        o.write(f"{c['frame']:5d} | {c['frame']/30:7.2f}s | {c['cls']:5s} | {c['file'] + '.wav':26s} | {'OK' if c['file'] in have else 'MISSING':7s} | {c['note']}\n")
miss = sorted(MISSING_DESC)
with open(os.path.join(ROOT, 'preview/sfx_missing.txt'), 'w') as o:
    o.write('# SFX yang belum ada filenya di public/sfx (perlu file foley dari lo, atau gua sintesis kalau lo izinkan)\n# file | bunyi | frame | status | fallback file lama\n')
    for n in miss:
        fr = ', '.join(str(c['frame']) for c in cues if c['file'] == n)
        o.write(f"{n + '.wav':18s} | {MISSING_DESC[n]} | frame {fr} | {'ADA' if n in have else 'MISSING'} | {FALLBACK[n]}\n")
print(len(cues), 'cue,', sum(1 for c in cues if c['file'] not in have), 'cue file belum ada;', sorted({c['file'] for c in cues if c['file'] not in have}))
