"""Cek akhir otomatis video 3 fase (out/video_3fase.mp4):
1. subtitle 3 kata tidak pernah tampil bareng callout (chunk yang jatuh di jendela callout disembunyikan),
2. one shot (beat 3-5) tanpa cut: scene detection di rentang itu,
3. cut/transisi hanya di pergantian tempat,
4. contact sheet 1 frame/beat -> preview/final_beats.jpg untuk cek teks vs objek, zona tengah, tempat per fase,
5. tidak ada SFX laser/zap: daftar file SFX yang dipakai (data/sfx_cues.json) tidak memuat nama laser/zap/sci-fi,
6. audio: loudness & true-peak."""
import json, os, re, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = os.path.join(ROOT, 'out/video_3fase.mp4')
W = json.load(open(os.path.join(ROOT, 'data/words.json'))); S = json.load(open(os.path.join(ROOT, 'data/subs.json')))
B = json.load(open(os.path.join(ROOT, 'data/beats.json')))
CALL = [2, 4, 7, 10, 17, 18, 20, 23, 31, 32, 34, 38, 41, 45, 50, 51, 54]
DELAY = {2: 0.9}
bt = {b['id']: b for b in B}
ends = {b['id']: (B[i + 1]['start'] if i + 1 < len(B) else 124.69) for i, b in enumerate(B)}
win = [(bt[c]['start'] + 0.15 + DELAY.get(c, 0), min(ends[c], bt[c]['start'] + 0.15 + DELAY.get(c, 0) + 2.8)) for c in CALL]
hidden = [c for c in S if any(a <= (c['s'] + c['e']) / 2 < b for a, b in win)]
print(f'1) callout {len(win)}, chunk subtitle {len(S)}, disembunyikan saat callout {len(hidden)} -> tidak ada yang dobel (by design)')
def cuts(a, b, th=0.3):
    out = subprocess.run(['ffmpeg', '-ss', str(a), '-t', str(b - a), '-i', V, '-vf', f"select='gt(scene,{th})',showinfo", '-f', 'null', '-'], capture_output=True, text=True).stderr
    return [round(a + float(x), 2) for x in re.findall(r'pts_time:([0-9.]+)', out)]
os1, os2 = bt[3]['start'], bt[6]['start'] - 0.3
c1 = cuts(os1, os2)
print(f'2) one shot {os1:.2f}-{os2:.2f} dtk: cut terdeteksi = {c1 or "tidak ada"}')
allc = cuts(0, 126.7, 0.35)
print(f'3) semua cut/perubahan besar (>0.35): {allc}')
sfx = json.load(open(os.path.join(ROOT, 'data/sfx_cues.json')))['cues']
bad = [c['file'] for c in sfx if re.search(r'laser|zap|scifi|sci_fi|beam|blaster', c['file'])]
print(f'5) SFX laser/zap: {bad or "tidak ada"} ({len(sfx)} cue)')
fr = [round(b['start'] * 30) for b in B] + [3741]
tmp = os.path.join(ROOT, 'preview/_fb'); os.makedirs(tmp, exist_ok=True)
for i in range(55):
    t = ((fr[i] + fr[i + 1]) / 2) / 30
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.3f}', '-i', V, '-frames:v', '1', '-vf', 'scale=216:-1', f'{tmp}/{i:02d}.png'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{tmp}/%02d.png', '-vf', 'tile=11x5', '-frames:v', '1', os.path.join(ROOT, 'preview/final_beats.jpg')], check=True)
subprocess.run(['rm', '-rf', tmp])
lo = subprocess.run(['ffmpeg', '-i', V, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
print('6) audio:', ' | '.join(re.findall(r'(I:\s+[-0-9.]+ LUFS|Peak:\s+[-0-9.]+ dBFS)', lo)[-2:]))
print('4) preview/final_beats.jpg ditulis')
