# Style notes — `reference/ref_1.mp4` (720x1280, 30 fps, 12,3 dtk) → video "30 hari" 16:9 (1920x1080)

Sumber: 37 frame (3 fps, `reference/frames/f001..037.png`), contact sheet `preview/ref1_frames.jpg`.
Scene detection (`gt(scene,0.25)`) = **0 cut** → semua pergantian di ref_1 halus (dissolve / fade lewat gelap / glow-up).

## 1. Gaya umum
- Sinematik minimalis: panggung kosong gelap, subjek kecil, banyak ruang negatif; bentuk simpel (figur tebal kepala bulat,
  bangunan kotak, gerobak, buku) tanpa tekstur.
- Hierarki cahaya = hierarki cerita: yang dibahas MENYALA (putih-krem / amber), pendukung abu-abu redup `#5A6170–#7A808C`.

## 2. Lighting & warna
| area | navy (0–3 dtk, 6–12 dtk) | cokelat hangat ("EARLY", 3,5–6 dtk) |
|---|---|---|
| atas/pojok | `#0D1216`–`#141821` | `#151517` |
| tengah (halo latar) | `#20232A`–`#282B30` | `#272624`–`#2A2927` |
| lantai | `#090D10` | `#151412` |
| vignette | `#07080C` | `#0F0E0C` |
- Latar gradasi vertikal, paling terang di belakang subjek (lampu jauh), vignette kuat, grain halus.
- Objek utama: inti `#FFF4E0`, amber `#FFB23F → #FFD166`, halo radial besar (±1,5× objek), cahaya tumpah ke lantai.
- **Tone bergeser** navy → cokelat hangat → navy (±0,5 dtk, ikut dissolve) sementara tempat tetap → dasar aturan
  "tiap zoom in, tone latar berubah, tempat tetap sama".

## 3. Lantai & reflection
- Horizon tipis (±68% tinggi frame); lantai lebih gelap & mengkilap; semua objek punya pantulan vertikal samar
  (opacity 15–20%, memudar ke bawah) + glow sumber cahaya di lantai.

## 4. Cara objek masuk
- Fade + glow-up pelan (±0,6 dtk): opacity & radius halo naik bareng, lalu partikel cahaya amber naik diagonal (3–6 titik).
- Objek baru muncul sambil yang lama mengecil + memudar (morph/dissolve) — bukan pop agresif.
- Figur selalu bergerak kecil (melangkah di tempat, lengan mendorong) → karakter tidak pernah statis.
- Teks muncul kata per kata, 1 kata aksen amber.

## 5. Kamera & transisi
- Kamera kalem: zoom-out pelan ±10% lalu tahan / push-in lambat, ease-in-out.
- Transisi: dissolve + perubahan tone, fade lewat gelap (meredup hampir hitam lalu objek berikutnya menyala), glow-up objek
  sebagai pusat perhatian, pull-out yang mengungkap tempat.

## 6. Penerapan di video 30 hari 16:9
- **Kanvas 1920x1080**: horizon dunia y≈760, kaki karakter y≈800 (dunia), zona ilustrasi/karakter x 360–1560 / y 290–800,
  titik fokus kamera di tengah layar (960, 545). Margin aman 80 px di semua sisi.
- **Komposisi horizontal**: karakter boleh di sepertiga kiri/kanan, ilustrasi utama di tengah (fokus di tengah frame).
- **UI atas**: panel neon (y 120–190, lebar 520–680, ikon statis ±56 px di kiri teks, jarak 10–12 px) + baterai dengan logo
  charge (petir) berdenyut + kilau (y 205–240). Subtitle 3 kata pusat (960, 905); 💬 poin penting 68–76 px di bawah ilustrasi.
- **Tempat nyata tapi samar** (blur DOF kuat 7–10 px + redup + vignette), lantai mengkilap/basah dengan pantulan:
  ruang MRI, kamar gelap, dapur malam (hook) → apartemen studio malam (ungu-merah) → gym malam (biru-cyan) → peron stasiun
  hujan (abu-biru pucat) → taman pagi + genangan (hijau-emas) → lintasan stadion pagi + kamar subuh (biru lembut) →
  panggung gelap ala ref_1 (amber).
- **Tone shift per zoom** (cameraTrack): palet latar diinterpolasi sepanjang durasi zoom, tempat tetap.
- Karakter navy di latar gelap kebiruan → rim light 2 sisi + halo wajib.
- **Ilustrasi selalu dinamis** (idle loop, putar, denyut, partikel, cairan, cahaya berkedip) — satu-satunya yang statis: ikon panel neon.
- Semua pose & ilustrasi BARU (lihat `preview/used_assets.md`).
