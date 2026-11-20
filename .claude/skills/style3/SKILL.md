---
name: style3
description: Bikin video motion graphic vertikal baru (Remotion) dengan GAYA VIDEO 3 FASE (out/video_3fase.mp4) — ruangan flat 2D detail ala ref_2 + pencahayaan gelap sinematik ala ref_1, karakter pria (rig bomber navy) & wanita berhijab, subtitle karaoke 3 kata + callout poster, VO + BGM 1% + SFX foley. Pakai ketika user mengetik /style3 atau minta video baru "pakai style video 3 fase".
---

# /style3 — gaya video 3 fase (referensi: `remotion_3fase/`, hasil: `remotion_3fase/out/video_3fase.mp4`)

User akan melampirkan aset baru (voiceover, kadang BGM, naskah, storyboard, logo). Ikuti brief user; bila user tidak menyebut
sesuatu, pakai setelan di bawah (setelan terakhir yang di-approve). Semua komunikasi pakai gaya bahasa user (Indonesia santai, "gua/lo").

## 0. Setup project baru (JANGAN bikin kit dari nol)
1. Folder baru `remotion_<nama>/` di root repo. Copy dari `remotion_3fase/`: `package.json` (ganti name), `package-lock.json`,
   `remotion.config.ts`, `tsconfig.json`, `.gitignore` (berisi `node_modules`, `out/parts/`), `public/fonts`, `public/sfx/*.wav`,
   `public/pmo_savior*.png`, seluruh `src/` dan `scripts/`, lalu `cp -r remotion_3fase/node_modules` (jangan npm install).
2. Aset user: VO → `public/voiceover.m4a`, BGM → `public/bgm.m4a`, referensi → `reference/`, logo → `public/` lalu
   `python3 scripts/key_logo.py` (key out hitam, bentuk/warna tidak berubah). Logo PMO SAVIOR TIDAK BOLEH sendirian di layar.
3. Isi scene/ilustrasi/timeline lama adalah contoh — tulis ulang sesuai naskah & storyboard baru, pakai ulang komponennya.

## 1. Gaya visual (dikunci)
- **Dunia = ref_2, cahaya = ref_1** (`remotion_3fase/preview/style_notes.md`): ruangan flat 2D vector lengkap (furnitur, jendela,
  detail) di `src/components/Places.tsx` (WeddingHall, BedroomNight, DarkStage, Office, LabDark, LivingDining `cold`, CoupleBedroom;
  tambah tempat baru dengan pola yang sama: `Room` + props, horizon `WALL_Y=1110`, kaki karakter `STAND_Y=1250`).
- Ruangan diredupkan (`dim` 0.2–0.6) + **blur tipis depth-of-field** (`bgBlur` 1.5–3 px) + `Spotlight` lembut ke subjek + vignette + grain.
- Objek/karakter yang dibahas DISOROT: glow/halo (`Halo`), partikel naik (`Rise`), pantulan lantai (`Reflect`).
- **Kontras wajib**: background selalu beda warna dari karakter. Karakter selalu `LitCharacter`/`LitFemale` (rim light 2 sisi +
  backlight + halo). Warna halo ikut mood tempat (pink kamar malam, oranye kantor, biru saat dingin).
- Tone per bagian berubah halus (mis. hangat amber → biru pucat dingin lewat prop `cold`).
- Elemen masuk: `Appear kind="pop"` (overshoot ala ref_2) untuk properti, `kind="glow"` (fade ala ref_1) untuk objek menyala,
  `kind="rise"` untuk siluet/objek dari bawah. Garis putus-putus penunjuk `DashPointer`. Maks 3 elemen ilustrasi tampil bareng.
- Visual sensitif SELALU simbolik (HP "18+" isinya siluet blur pink ter-pixelate + sensor bar `Phone18`; KDRT = bayangan, pintu,
  benda pecah, bahasa tubuh; kata kasar = `JaggedBubble` #@!%). Tanpa ketelanjangan, pose seksual, kontak fisik kekerasan.

## 2. Karakter (rig yang sudah ada — hanya tambah pose/ekspresi)
- Pria: `src/components/Character.tsx` (bomber navy; `outfit="groom"` jas pengantin). ±45 ekspresi, ±70 pose, props otomatis
  (HP, kacamata hitam, dadu, gunting, buku, dll). Prop `pose`/`expression` = string atau keyframe `[[frame, nilai], ...]`.
- Wanita: `src/components/FemaleCharacter.tsx` (hijab dusty rose + gamis mauve; `outfit="bride"`). 13 ekspresi, 9 pose
  (termasuk `sitting_bed_edge_hugging_knees` tampak belakang, `crying_in_corner`); prop `gray` untuk memudar jadi siluet.
- Karakter sekunder (atasan/peneliti) = siluet abu-abu sederhana. Karakter tidak wajib di setiap frame.
- Selalu hidup: napas, weight shift, kedip, lirikan otomatis, anticipation + follow-through (spring) saat ganti pose.
- Preview wajib: `src/CharacterSheet.tsx` → `preview/character_sheet.png` (cek kontras rim ON vs OFF).

## 3. Layout 9:16 (1080x1920, 30 fps, durasi = VO + 2 dtk ending)
- Atas y 140–260: `PhaseHeader` (chip label fase ala ref_2 + slot fase berikon otak yang nyala satu-satu; atur `PHASES` di `src/timeline.ts`).
- Tengah y 420–1250: karakter & ilustrasi. Kamera dijepit otomatis (`floorY` di ShotDef → kaki maks y≈1260 di layar, tidak keluar
  ruangan); ilustrasi taruh DI SAMPING karakter setinggi dada bila kamera zoom (jangan di atas kepala → nabrak header).
- Subtitle 3 kata pusat y 1380. 260 px bawah & 80 px kiri/kanan kosong (UI TikTok/Reels).
- Callout default di zona lantai bawah (top 1290); pindahkan ke atas (`CALLOUT_TOP` di `UI.tsx`, mis. 300) bila ada objek di bawah.

## 4. Subtitle & callout
- Transcribe: Whisper small (faster-whisper; bobot npm `@skillninja/shortmovie-telop-model-p0..p3` → gabung `small/`, cek sha256;
  decode audio ke f32 16 kHz dulu). Buang token halusinasi berdurasi nol di awal. `scripts/build_words.py` menyelaraskan kata ke
  ejaan NASKAH (`data/script.txt`) via difflib. `scripts/build_timeline.py`: daftar beat (teks awal tiap beat) → `data/beats.json`
  + chunk subtitle maks 3 kata (`data/subs.json`).
- Subtitle: Poppins ExtraBold ±76 px (mengecil otomatis bila panjang), putih + stroke tipis gelap + shadow, kata aktif kuning
  `#F5FF3B` + glow + scale 1.08, pop kecil.
- Callout 💬 (`src/subtitles.ts`): 110–140 px, maks 2 baris, kata aksen kuning/merah, gaya `slam` (masuk besar + shake kecil) atau
  `neon` (berkedip nyala). Tampil dari awal beat +0,15 dtk (bisa `DELAY` per beat), maks 2,8 dtk. Selama callout, subtitle 3 kata
  disembunyikan dan chunk yang tertutup tidak muncul lagi sesudahnya.

## 5. Kamera & transisi (`src/scenes/*.tsx`, `src/Main.tsx`)
- Satu `ShotDef` per TEMPAT: `cam` (keyframe `camKeys`), `bg`, `bgBlur`, `dim`, `fg`, `overlay`, `floorY`, `free` (kamera bebas
  untuk one shot zoom). Beat di dalam tempat = camera move (push/pan/tilt) + rack focus, tanpa cut.
- Transisi berat HANYA saat ganti tempat/fase: `light` (light sweep), `whip` (slide horizontal + motion blur 8–10 f), `dark` (fade
  lewat gelap ala ref_1), `dissolve` (blur dissolve 10–12 f), `blend` (match cut + kilat). Shake via `shake()`.
- HOOK: frame 0 langsung bergerak (tanpa fade-in/intro), open loop (slot fase kosong yang terisi sepanjang video).
- One shot zoom: satu shot tanpa cut, zoom eksponensial ease-in-out, karakter tetap hidup; verifikasi dengan scene detection.
- Beat > 2,5 dtk: tambah mikro-beat (elemen kedua, ganti ekspresi, camera move) kecuali di one shot.

## 6. Audio (`scripts/sfx_cues.py` → `scripts/mix_audio.py`)
- VO 100%. BGM 1% (−40 dB loudness relatif VO), fade in 1 dtk, fade out 2 dtk.
- SFX di FRAME KEJADIAN animasi: penting ⭐ `imp` ≈19–20% VO (−14,5 dB), ilustrasi/gerak `ill` 15% (−16,5 dB), transisi `trans` 10%
  (−20 dB). Cap dinamis K-weighted (3 pass) → SFX terkeras ≤ 20% VO. Maks 3 barengan. Fade in 2 frame (transisi) / 5 ms (transien),
  fade out 3 frame. Variasi pitch ±5–10% untuk SFX berulang. Limiter master −1,6 dBFS (true-peak setelah AAC < −1 dBFS).
- Foley natural saja, DILARANG laser/zap/sci-fi. Pakai `public/sfx` dulu; bunyi yang belum ada → tulis `preview/sfx_missing.txt`
  dan TANYA user dulu (opsi: user kirim file / gua sintesis / pakai fallback). Pola sintesis: `scripts/make_foley_3fase.py`.

## 7. Alur kerja (berhenti & TUNGGU konfirmasi di tiap ⏸)
1. Setup + copy kit + analisis referensi (ekstrak frame 2 fps + strip di sekitar cut scene detection) → `preview/style_notes.md`.
2. Transcribe → `src/timeline.ts` + `src/subtitles.ts`.
3. ⏸ Karakter (pose/ekspresi baru) → `preview/character_sheet.png`.
4. ⏸ Ilustrasi + background tiap tempat → `preview/illustration_sheet.png` + 1 still per tempat (`src/PlaceStills.tsx`).
5. ⏸ Animatic 540x960 (`Animatic` composition, VO saja) → `preview/animatic.mp4`. Sebelum render, cek 1 still per beat
   (`SUB=anim COMP=Main node scripts/stills_abs.mjs nama:frame ...`) dan perbaiki framing.
6. ⏸ Mixing → `preview/sfx_map.txt` + `preview/audio_check.mp4` (animatic + `public/mix_final.wav`).
7. Render final → `out/video_<nama>.mp4`, lalu `python3 scripts/check_final.py` (subtitle vs callout, one shot tanpa cut,
   SFX laser, loudness/true-peak, contact sheet `preview/final_beats.jpg`).
Commit + push ke branch kerja setelah tiap langkah.

## 8. Render panjang (penting)
- Proses background maksimal 2 jam; render 1080x1920 ±1,4 dtk/frame. Video > ±80 dtk WAJIB dirender per potongan
  (masing-masing ≤ ±1300 frame, `--frames=a-b --muted`) ke `out/parts/pN.mp4`, lalu gabung lossless:
  `ffmpeg -f concat -safe 0 -i list.txt -i public/mix_final.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest out/video.mp4`.
- Pantau progres dengan Monitor (re-arm tiap 30 menit). Ikuti permintaan user soal berhenti antar potongan & frekuensi update progres.
- Container bisa restart: cek `out/parts/` & `public/mix_final.wav` masih ada, ulang hanya potongan yang hilang.
