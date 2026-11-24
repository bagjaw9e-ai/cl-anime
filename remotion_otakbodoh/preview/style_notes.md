# Style notes — `reference/ref_1.mp4` (720x1280, 30 fps, 12,3 dtk) → video "otak bodoh"

Sumber: 37 frame (3 fps, `reference/frames/f001..037.png`), contact sheet `preview/ref1_frames.jpg`.
Scene detection (`gt(scene,0.25)`) = **0 cut** → semua pergantian di ref_1 halus (dissolve / fade gelap / glow-up).

## 1. Gaya umum
- Sinematik minimalis: panggung kosong gelap, subjek kecil di tengah, banyak ruang negatif.
- Bentuk simpel: figur stickman tebal (kepala bulat), bangunan kotak, gerobak, buku — tanpa detail tekstur.
- Hierarki cahaya = hierarki cerita: yang dibahas MENYALA (putih-krem / amber), pendukung abu-abu redup `#5A6170–#7A808C`.

## 2. Lighting & warna
| area | navy (0–3 dtk, 6–12 dtk) | cokelat hangat ("EARLY", 3,5–6 dtk) |
|---|---|---|
| atas/pojok | `#0D1216`–`#141821` | `#151517` |
| tengah (halo latar) | `#20232A`–`#282B30` | `#272624`–`#2A2927` |
| lantai | `#090D10` | `#151412` |
| vignette bawah | `#07080C` | `#0F0E0C` |
- Latar = gradasi vertikal, paling terang di tengah belakang subjek (lampu jauh), vignette kuat, grain halus.
- Objek utama: inti `#FFF4E0`, amber `#FFB23F → #FFD166`, **halo radial besar** (±1,5× objek), cahaya "tumpah" ke lantai.
- Jendela/pintu bangunan putih menyala + halo putih lembut di belakangnya.
- **Tone bergeser** navy → cokelat hangat → navy (±0,5 dtk, ikut dissolve) sementara TEMPAT tetap → dasar aturan
  "setiap zoom in tone background berubah, tempat sama".

## 3. Lantai & reflection
- Horizon tipis di ±68% tinggi frame; lantai lebih gelap & mengkilap.
- Semua objek punya pantulan vertikal samar (opacity 15–20%, memudar ke bawah) + glow sumber cahaya di lantai.

## 4. Cara objek masuk
- Fade + glow-up pelan (±0,6 dtk): opacity & radius halo naik bareng, lalu **partikel cahaya amber naik** diagonal (3–6 titik).
- Objek baru muncul di tempat objek lama sambil yang lama mengecil + memudar (morph/dissolve), bukan pop agresif.
- Figur selalu bergerak kecil (melangkah di tempat, lengan mendorong) → karakter tidak pernah statis.
- Teks: kalimat putih bold muncul kata per kata, 1 kata aksen amber.

## 5. Kamera & transisi
- Kamera kalem: zoom-out pelan ±10% (0–3 dtk) lalu tahan / push-in sangat lambat. Ease-in-out.
- Transisi: (a) dissolve + perubahan tone, (b) fade lewat gelap (scene meredup ke hampir hitam lalu objek berikutnya
  menyala pelan), (c) glow-up objek sebagai pusat perhatian, (d) pull-out yang mengungkap tempat.

## 6. Penerapan di video ini (brief VO_4)
- **Background = tempat nyata tapi samar**: digambar sederhana (`Places*.tsx`), blur DOF kuat (6–10 px) + dim 0,45–0,65 + vignette,
  lantai mengkilap dengan `Reflect` (karakter, ilustrasi, lampu). Tiap fase tempat beda: kelas/kamar/pintu/ruang rantai (hook),
  ruang kosong mengkilap (one shot), perpustakaan malam (biru tua), panggung amber (PMO SAVIOR), hutan berkabut + genangan
  (hijau-biru), jalan kota basah (ungu-merah), kantor kosong → jalan ke cakrawala senja (abu dingin → merah redup).
- **Tone shift per zoom**: `cameraTrack.ts` menyimpan palet per keyframe zoom; warna latar diinterpolasi sepanjang durasi zoom
  (mis. biru tua → indigo → ungu) tanpa mengganti tempat.
- Karakter navy di latar gelap kebiruan → `LitCharacter` (rim 2 sisi + backlight + halo) wajib.
- Fokus dengan lighting: `Spotlight` + halo di subjek yang dibahas, sisanya redup; partikel `Rise` naik dari objek penting.
- Ilustrasi medium (400–650 px), gaya ref_1: bentuk simpel menyala di atas gelap; maks 3 elemen bareng.
- Transisi besar hanya ganti fase/tempat: fade gelap ala ref_1, zoom tembus pintu (match cut pintu 1/2/3), pull-out reveal,
  whip di hook. Dalam satu tempat: zoom/tilt ke ilustrasi berikutnya (titik fokus di tengah frame, min 12 frame, ease-in-out).
- UI baru: panel teks NEON (y 300–420) + baterai progres (y 440–500) mulai Fase 1; subtitle 3 kata y≈1390; 💬 poin penting
  overlay di bawah ilustrasi.
