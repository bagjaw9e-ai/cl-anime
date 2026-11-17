"""Cek akhir otomatis: (1) subtitle 3 kata tidak pernah tampil bareng subtitle poin penting,
(2) subtitle tidak menimpa objek: ambil frame di tengah tiap chunk subtitle, bandingkan piksel area subtitle
    dengan render tanpa subtitle tidak bisa -> pakai crop area subtitle untuk dicek visual (preview/check_subs.jpg)."""
import json, os, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, 'data/words.json'))); S = json.load(open(os.path.join(ROOT, 'data/subs.json')))
# jadwal callout (sama dengan src/subtitles.ts)
CALL = [(0.2, W[4]['s']), (W[13]['s'], W[16]['s']), (W[25]['s'], W[31]['s']), (W[35]['s'], 14.68)]
inC = lambda t: any(a <= t < b for a, b in CALL)
shown, hidden = [], []
for c in S:
    txt = ' '.join(W[i]['w'] for i in c['words'])
    mid = (c['s'] + c['e']) / 2
    (hidden if inC(mid) else shown).append((round(mid, 2), txt))
print('chunk tampil:', len(shown), '| disembunyikan karena poin penting:', len(hidden))
for m, t in hidden: print('  disembunyikan', m, t)
# frame tengah tiap chunk yang tampil -> contact sheet area y 1150-1500
vid = os.path.join(ROOT, 'out/video_promo.mp4'); tmp = os.path.join(ROOT, 'preview/_chk'); os.makedirs(tmp, exist_ok=True)
for k, (m, _) in enumerate(shown):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(m), '-i', vid, '-frames:v', '1', '-vf', 'crop=1080:500:0:1000,scale=540:-1', f'{tmp}/{k:02d}.png'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{tmp}/%02d.png', '-vf', f'tile=3x{(len(shown) + 2) // 3}', '-frames:v', '1', os.path.join(ROOT, 'preview/check_subs.jpg')], check=True)
subprocess.run(['rm', '-rf', tmp])
print('preview/check_subs.jpg ditulis')
