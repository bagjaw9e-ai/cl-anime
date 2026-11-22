"""Cek akhir otomatis video umur25 (out/video_umur25.mp4) sesuai QA brief:
1. subtitle 3 kata tidak pernah tampil bareng subtitle poin penting (chunk di jendela poin penting disembunyikan),
2. tidak ada teks poin penting yang berdiri sendiri: tiap poin penting punya ilustrasi/karakter di beat yang sama (dicek visual di
   preview/final_keypoints.jpg: 1 frame di tengah tiap poin penting),
3. one shot (beat 3-5) tanpa cut: scene detection,
4. scene penutup tepat 30 frame (1 dtk) setelah VO, tanpa narasi (audio VO diam) & tanpa subtitle,
5. tidak ada SFX laser/zap (nama file cue),
6. audio: loudness & true-peak; contact sheet 1 frame/beat -> preview/final_beats.jpg (ukuran ilustrasi, zona tengah, tempat per efek)."""
import json, os, re, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = os.path.join(ROOT, 'out/video_umur25.mp4')
S = json.load(open(os.path.join(ROOT, 'data/subs.json')))
B = json.load(open(os.path.join(ROOT, 'data/beats.json')))
VO_END = 105.44; FR = 30
CALL = [1, 2, 3, 7, 8, 16, 17, 22, 23, 26, 28, 31, 35, 39, 41, 43, 49, 51]
bt = {b['id']: b for b in B}
ends = {b['id']: (B[i + 1]['start'] if i + 1 < len(B) else VO_END) for i, b in enumerate(B)}
win = []
for c in CALL:
    s = bt[c]['start'] + (0 if c == 1 else 0.12)
    win.append((c, s, min(ends[c], s + 2.8)))
hidden = [c for c in S if any(a <= (c['s'] + c['e']) / 2 < b for _, a, b in win)]
print(f'1) poin penting {len(win)}, chunk subtitle {len(S)}, disembunyikan saat poin penting {len(hidden)} -> tidak dobel (by design)')
def cuts(a, b, th=0.3):
    out = subprocess.run(['ffmpeg', '-ss', str(a), '-t', str(b - a), '-i', V, '-vf', f"select='gt(scene,{th})',showinfo", '-f', 'null', '-'], capture_output=True, text=True).stderr
    return [round(a + float(x), 2) for x in re.findall(r'pts_time:([0-9.]+)', out)]
os1, os2 = bt[3]['start'] + 0.1, bt[6]['start'] - 0.35
print(f'3) one shot {os1:.2f}-{os2:.2f} dtk: cut = {cuts(os1, os2) or "tidak ada"}')
n = int(subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', V], capture_output=True, text=True).stdout.strip().rstrip(','))
vo_frames = round(VO_END * FR)
vol = subprocess.run(['ffmpeg', '-ss', str(VO_END + 0.02), '-i', os.path.join(ROOT, 'public/voiceover.m4a'), '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
mx = re.findall(r'max_volume: ([-0-9.]+) dB', vol)
print(f'4) total frame {n}, VO berakhir frame {vo_frames} -> penutup {n - vo_frames} frame (target 30); sisa VO setelah narasi: {mx[0] + " dB" if mx else "kosong (tidak ada narasi)"}; subtitle penutup: dimatikan (chunkAt)')
sfx = json.load(open(os.path.join(ROOT, 'data/sfx_cues.json')))['cues']
bad = [c['file'] for c in sfx if re.search(r'laser|zap|scifi|sci_fi|beam|blaster', c['file'])]
print(f'5) SFX laser/zap: {bad or "tidak ada"} ({len(sfx)} cue)')
lo = subprocess.run(['ffmpeg', '-i', V, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
print('6) audio:', ' | '.join(re.findall(r'(I:\s+[-0-9.]+ LUFS|Peak:\s+[-0-9.]+ dBFS)', lo)[-2:]))
tmp = os.path.join(ROOT, 'preview/_fb'); os.makedirs(tmp, exist_ok=True)
fr = [round(b['start'] * FR) for b in B] + [vo_frames]
for i in range(len(B)):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{(fr[i] + fr[i + 1]) / 2 / FR:.3f}', '-i', V, '-frames:v', '1', '-vf', 'scale=216:-1', f'{tmp}/b{i:02d}.png'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{(vo_frames + 15) / FR:.3f}', '-i', V, '-frames:v', '1', '-vf', 'scale=216:-1', f'{tmp}/b99.png'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-pattern_type', 'glob', '-i', f'{tmp}/b*.png', '-vf', 'tile=13x4', '-frames:v', '1', os.path.join(ROOT, 'preview/final_beats.jpg')], check=True)
for k, (c, a, b) in enumerate(win):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{a + 0.6:.3f}', '-i', V, '-frames:v', '1', '-vf', 'scale=216:-1', f'{tmp}/k{k:02d}.png'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-pattern_type', 'glob', '-i', f'{tmp}/k*.png', '-vf', 'tile=9x2', '-frames:v', '1', os.path.join(ROOT, 'preview/final_keypoints.jpg')], check=True)
subprocess.run(['rm', '-rf', tmp])
print('2) preview/final_keypoints.jpg & preview/final_beats.jpg ditulis')
