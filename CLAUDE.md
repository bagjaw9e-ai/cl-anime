# cl-anime: pedoman produksi video stickman neon

Repo ini membuat video pendek 9:16 dari **audio voice-over + transkrip** yang di-attach user.
Video pertama (`out/pmo_savior_neon_stickman.mp4`, kode di `src/`) adalah **referensi utama** yang sudah
di-approve user. Video baru harus mengikuti gaya yang dikunci di bawah.

## DIKUNCI: selalu pertahankan di setiap video
1. **Image CTA**: `assets/pmo_savior.png` (logo "PMO / SAVIOR") tampil di layar HP pada scene CTA
   (kalimat "link di bio"), dengan panah ke atas + jari mengetuk. Logo digambar **setelah bloom**
   (lihat `CTA_POST` di `src/render.py`) supaya tulisannya tajam dan jelas, ukurannya hampir selebar layar HP.
2. **Colour tone** (ikuti video referensi grok): latar hitam berasap, siluet figur diisi hitam dengan
   outline **neon merah** (`RED (255,34,44)`, aksen `HOT`/`WHT`), bloom/glow, lantai neon merah dengan pantulan.
   Tidak ada warna lain selain variasi merah/putih (pengecualian kecil: es/ICE untuk efek "dingin").
3. **Gaya ilustrasi**: stickman tebal ber-outline (rig di `src/engine.py`: `fig()`, pose dict, ekspresi wajah),
   pria berkepala bulat, wanita berambut panjang + dress; props neon (HP, ranjang, pintu, otak, hati, dll);
   motion graphic simbolik (baterai, gauge, jaringan saraf, molekul, HUD medis).
4. **Fokus objek di tengah**: tiap scene punya framing kamera `FOCUS = (cx, cy, zoom)` di `src/scenes.py`
   sehingga subjek utama ada di tengah frame 9:16 (jangan menumpuk di bawah).
5. **Ilustrasi eksplisit (sugestif, tanpa ketelanjangan/adegan seks)**: siluet wanita berlekuk berlingerie
   (`fig(..., curvy=True)`), penari di layar HP (`screen_girl`), hologram dari HP, tisu remas, pisang layu
   sebagai simbol DE, dll. Tetap aman untuk TikTok/IG.
6. **Tanpa teks / caption** (selain logo CTA), **tanpa BGM**: hanya voice-over + SFX.
7. **Ganti ilustrasi per kalimat / titik** sesuai transkrip; 9:16, 1080x1920, 30 fps, durasi = durasi audio.

## BISA BERUBAH per video (user akan kasih adjustment tiap video)
- SFX (jenis, volume; terakhir bus SFX `volume=0.375` di `build.sh`)
- Pergerakan kamera (push-in, zoom, shake)
- Gaya animasi & transisi (terakhir: crossfade halus seragam `TRANS = ['fade'] * n`, `TR = 0.6`)
Tanyakan/ikuti adjustment dari user; kalau tidak disebut, pakai setelan video terakhir.

## Alur kerja video baru
1. Simpan audio ke `assets/`, transkrip dipecah per kalimat.
2. Timing: cari jeda dengan `ffmpeg -af silencedetect=noise=-30dB:d=0.15`, cocokkan dengan estimasi
   proporsi panjang karakter tiap kalimat (HuggingFace/whisper diblokir di environment ini).
   Kalimat panjang boleh dipecah jadi 2 scene di koma.
3. Buat modul scene baru (salin pola `src/scenes.py`): isi `B` (batas scene), `SCENES`, `FOCUS`, `TRANS`,
   event `SHAKES/FLASHES/GLITCHES`, lalu jadwal SFX di `src/sfx.py`. Gunakan ulang helper engine.
4. Preview cepat: `cd src && python3 preview.py <out.png> <t1> <t2> ...` (contact sheet), cek framing.
5. Build: `./build.sh` → `out/<nama>.mp4` (render paralel ~6 menit untuk 68 detik), kirim ke user.
6. Commit + push ke branch yang ditentukan.

Dependensi: `pip install skia-python scipy numpy` + `apt-get install -y libegl1`.

## Format kedua: one-shot otak 3D (video ke-2, `out/pmo_brain3d_oneshot.mp4`)
- Kode: `src/b3d_mesh.py` (mesh otak realistis: korteks fsaverage5 dari paket nilearn + cerebellum/batang otak
  dari volume MNI152 via marching cubes, cache `assets/brain_mesh.npz`; renderer painter's-algorithm skia
  dengan shading per-vertex), `src/b3d_video.py` (timeline `BEATS` per kalimat/koma, kamera instan
  zoom/pan/tilt + motion blur, state otak: highlight PFC, penyusutan, retak, pecah, rewire; ilustrasi di
  kiri/kanan/atas otak), `src/b3d_sfx.py` (palet SFX FM/tonal/granular + mix), build: `./build_b3d.sh`.
- Otak selalu berputar pelan ke samping (`YAW_SPEED` deg/s; `choose_yaw()` memilih sudut awal supaya lobus
  frontal menghadap kamera di beat PFC). Satu shot tanpa cut.
- Area atas & bawah frame dibiarkan kosong (user mengisi teks manual): semua konten di pita y≈560–1360.
- Neon tidak berlebihan: bloom lebih rendah (`bloom(amt1=.55, amt2=.42)`).
- SFX = 50% volume voice: mix mengukur LUFS (pyloudnorm) dan menaruh bus SFX −6 dB di bawah voice, lalu
  seluruh mix dinormalkan ke −14 LUFS. Dependensi tambahan: `pip install nilearn scikit-image pyloudnorm`.
