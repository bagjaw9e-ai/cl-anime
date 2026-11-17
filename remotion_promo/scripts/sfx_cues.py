"""Jadwal SFX di FRAME KEJADIAN animasi (frame absolut 30 fps, lihat src/scenes.tsx).
Output: data/sfx_cues.json (dibaca scripts/mix_audio.py), preview/sfx_map.txt, preview/sfx_missing.txt.
kelas: imp = aksi utama, ill = ilustrasi/gerak karakter, trans = transisi/kamera (paling pelan).
dur = potong (detik, None = penuh), fade = fade out terakhir (detik)."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
C = [  # frame, file, kelas, dur, catatan
    (0,   'chain_rattle',      'ill',   1.0,  'B1 rantai berderak saat karakter meronta (frame 0-30)'),
    (10,  'chain_snap',        'imp',   None, 'B1 lilitan bawah putus + kilatan'),
    (19,  'chain_snap',        'imp',   None, 'B1 lilitan tengah putus'),
    (28,  'chain_snap',        'imp',   None, 'B1 lilitan atas + tali ke HP putus, pose lepas'),
    (38,  'chain_drop',        'ill',   None, 'B1 potongan rantai mendarat di lantai'),
    (58,  'tape_pull',         'imp',   None, 'B2 plester dikelupas dari otak (58-80)'),
    (80,  'crystal_join_soft', 'ill',   None, 'B2 retakan nyala amber & mulai menyatu'),
    (100, 'crystal_ting',      'ill',   1.0,  'B2 kilau kristal saat otak utuh'),
    (118, 'paper_rustle',      'ill',   None, 'B3 papan klip menyala (kertas)'),
    (127, 'pen_check',         'ill',   None, 'B3 centang di papan klip'),
    (134, 'glass_clink',       'imp',   None, 'B3 tabung reaksi menyala (gelas berdenting)'),
    (150, 'grow_soft',         'ill',   None, 'B4 sambungan neuron tumbuh (150-198)'),
    (167, 'ting_short',        'ill',   None, 'B4 simpul neuron menyala (kata "neuroplasticity")'),
    (185, 'ting_short',        'ill',   None, 'B4 simpul terluar menyala'),
    (196, 'blur_whoosh_soft',  'trans', None, 'transisi B4 -> B5 (peti)'),
    (212, 'cloth_drop',        'ill',   0.5,  'B5 karakter membungkuk pegang tutup peti (gesekan jaket)'),
    (233, 'padlock_open',      'imp',   None, 'B5 gembok klik terbuka (kata "bongkar")'),
    (244, 'chest_hinge',       'imp',   0.6,  'B5 engsel peti berderit, tutup terangkat'),
    (253, 'padlock_drop',      'ill',   0.45, 'B5 gembok mendarat di lantai'),
    (263, 'light_sweep_air',   'ill',   None, 'B5 whoosh cahaya amber dari peti -> kilatan match cut ke B6'),
    (274, 'scissors_snip',     'imp',   None, 'B6 gunting memotong pita (kata "basa")'),
    (286, 'whoosh_soft',       'trans', None, 'transisi B6 -> B7'),
    (300, 'whoosh_soft',       'trans', 0.4,  'B7 lengan menunjuk ke samping'),
    (306, 'paper_page_turn',   'ill',   None, 'B7 e-book menyala (halaman dibalik)'),
    (330, 'screen_tap',        'imp',   None, 'B7 tombol play diklik'),
    (345, 'footsteps_walk',    'ill',   1.3,  'B8 langkah kaki menuju toko (345-384), berhenti di depan pintu'),
    (362, 'neon_switch_click', 'imp',   None, 'B8 saklar neon papan PMO SAVIOR'),
    (370, 'neon_buzz_soft',    'ill',   0.6,  'B8 buzz halus neon setelah berkedip, stabil'),
    (391, 'click_sharp',       'imp',   0.35, 'B9 klik ikon link (kata "link")'),
    (394, 'whoosh_up',         'ill',   None, 'B9 panah swoosh naik ke arah bio'),
    (440, 'neon_hum',          'amb',   2.0,  'END hum neon pelan lalu fade out sampai akhir'),
]
FADE = {'neon_hum': 1.2, 'neon_buzz_soft': 0.4, 'footsteps_walk': 0.2, 'chain_rattle': 0.25}
MISSING = {  # file belum ada di public/sfx -> fallback sementara (sintesis lama) bila user setuju
    'chain_rattle': ('-', 'rantai logam berderak/bergemerincing saat ditarik-tarik ±1 dtk'),
    'chain_snap': ('chain_break_sparkle.wav (ada ekor kilau, kurang natural)', 'mata rantai logam patah/putus, pendek & tajam'),
    'chain_drop': ('piece_fall.wav (benturan kayu, bukan logam)', 'potongan rantai jatuh ke lantai keras (gemerincing logam)'),
    'chest_hinge': ('door_open.wav (engsel pintu)', 'engsel peti kayu berderit pendek ±0,6 dtk'),
    'padlock_drop': ('piece_fall.wav', 'gembok logam kecil jatuh ke lantai (clunk)'),
}
os.makedirs(os.path.join(ROOT, 'data'), exist_ok=True)
cues = [{'frame': f, 'file': n, 'cls': c, 'dur': d, 'fade': FADE.get(n, 0.1), 'note': nt} for f, n, c, d, nt in sorted(C)]
json.dump({'fps': FPS, 'cues': cues}, open(os.path.join(ROOT, 'data/sfx_cues.json'), 'w'), indent=1, ensure_ascii=False)
have = set(x[:-4] for x in os.listdir(os.path.join(ROOT, 'public/sfx')))
with open(os.path.join(ROOT, 'preview/sfx_map.txt'), 'w') as o:
    o.write('# SFX map: frame | detik | file | kelas | catatan   (status: OK = file ada, MISSING = belum ada)\n')
    for c in cues:
        st = 'OK' if c['file'] in have else 'MISSING'
        o.write(f"{c['frame']:4d} | {c['frame']/FPS:6.2f}s | {c['file'] + '.wav':22s} | {c['cls']:5s} | {st:7s} | {c['note']}\n")
with open(os.path.join(ROOT, 'preview/sfx_missing.txt'), 'w') as o:
    o.write('# SFX yang awalnya belum ada filenya di public/sfx.\n# Status: user pilih opsi 2 -> disintesis natural dengan scripts/make_foley_promo.py (logam/kayu, tanpa beep/laser).\n')
    o.write('# nama_file.wav | bunyi | frame | status\n')
    for n, (fb, desc) in MISSING.items():
        frames = ', '.join(str(c['frame']) for c in cues if c['file'] == n)
        o.write(f"{n + '.wav':18s} | {desc} | frame {frames} | {'SINTESIS (ada)' if n in have else 'MISSING'}\n")
print(open(os.path.join(ROOT, 'preview/sfx_missing.txt')).read())
