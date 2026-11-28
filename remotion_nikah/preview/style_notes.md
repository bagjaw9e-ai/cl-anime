# Style notes — `reference/ref_1.mp4` → video "nikah dengan pecandu" (VO_5, 9:16)

Sumber: `reference/ref_1.mp4` (720x1280, 30 fps, 12,31 dtk). Diekstrak 3 frame/detik → 37 frame `preview/ref1_frames/f_001..037.jpg`,
contact sheet `preview/ref1_contact.jpg`. Scene detection (`select=gt(scene,0.25)`) = **0 hard cut**: semua pergantian di ref_1 halus.

## 1. Gaya umum
- **Sinematik minimalis**: panggung gelap hampir kosong, subjek kecil-medium di tengah, banyak ruang negatif di atas & bawah.
- Bentuk sederhana tanpa tekstur: figur tebal berkepala bulat, toko/bangunan kotak, gerobak, kardus menyala.
- **Hierarki cahaya = hierarki cerita**: yang sedang dibahas MENYALA (inti putih-krem / amber), pendukung abu-abu redup
  (`#5A6170`–`#7A808C`). Penonton diarahkan oleh lampu, bukan oleh potongan gambar.

## 2. Lighting & warna (sampel piksel)
| frame | atas | tengah (halo latar) | lantai | bawah | catatan |
|---|---|---|---|---|---|
| f001 (0 dtk) | `#151922` | `#1F2227` | `#1C1F24` | `#0C0F14` | navy gelap |
| f014 (4,3 dtk) | `#1E1E1E` | `#262624` | `#242424` | `#161513` | **tone geser** ke cokelat-abu hangat ("EARLY") |
| f020 (6,3 dtk) | `#16191E` | `#222327` | `#212224` | `#101113` | balik ke navy (dissolve) |
| f035 (11,3 dtk) | `#131A22` | `#1E2327` | `#1E1F24` | `#0C0F14` | navy, objek amber menyala |
- Latar = gradasi vertikal: paling terang tepat di belakang subjek (lampu jauh), vignette kuat ke pojok, grain halus.
- Objek fokus: inti `#FFF4E0`, amber `#FFB23F → #FFD166`, **halo radial besar** (±1,5× ukuran objek), cahaya tumpah ke lantai.
- Bangunan: jendela/pintu putih menyala + halo putih lembut; bagian badan abu-abu medium.
- **Tone bergeser tapi TEMPAT tetap** (navy → cokelat hangat → navy, ±0,5 dtk ikut dissolve) → dasar aturan
  "setiap zoom in, warna background berubah halus, tempat sama".

## 3. Lantai & reflection
- Horizon tipis di ±68% tinggi frame; lantai sedikit lebih gelap dan mengkilap.
- Semua objek punya **pantulan vertikal samar** (opacity 15–20%, memudar ke bawah) + genangan cahaya sumber di lantai.

## 4. Cara objek masuk
- **Glow-up pelan** (±0,5–0,7 dtk): opacity + radius halo naik bersamaan, lalu **partikel cahaya amber naik** diagonal (3–6 titik).
- Objek baru menggantikan yang lama dengan **dissolve/morph** (yang lama mengecil + memudar), tidak pop agresif.
- Figur selalu bergerak kecil (melangkah di tempat, lengan mendorong gerobak, kepala menoleh) → tidak ada yang diam total.
- Teks ref (kalimat putih bold kata per kata, 1 kata aksen amber) → dasar subtitle karaoke 3 kata (kata aktif berwarna).

## 5. Kamera & transisi
- Kamera kalem: zoom-out pelan ±10% di awal, lalu push-in sangat lambat. Selalu ease-in-out.
- Transisi yang dipakai ref_1: (a) **dissolve + pergeseran tone warna**, (b) **fade lewat gelap** (scene meredup hampir hitam,
  objek berikutnya menyala pelan), (c) **glow-up objek** sebagai pusat perhatian, (d) **pull-out** yang mengungkap tempat.

## 6. Penerapan di video ini
- **Background = tempat nyata tapi samar** (`src/components/PlacesNikah.tsx`, baru semua): digambar sederhana, blur DOF kuat
  (5–10 px) + dim 0,4–0,65 + vignette, lantai mengkilap dengan pantulan karakter/ilustrasi/lampu.
  - HOOK: meja akad (krem-emas hangat) | kamar gelap (merah tua) | meja undangan (putih-krem, lampu meja) — quick cut + snap zoom/whip.
  - ONE SHOT: kamar pengantin baru + kardus pindahan, lantai kayu mengkilap; tone krem hangat → ungu → merah gelap selama zoom 1x→3x.
  - FASE 1: apartemen malam (ruang tengah + kamar + dapur kecil), lantai keramik mengkilap, dasar ungu-pink gelap.
  - FASE 2: garasi malam, beton basah mengkilap, mobil samar, rak perkakas, dasar biru-cyan dingin.
  - MID-CTA: panggung gelap ala ref_1 (navy → amber), lantai reflektif.
  - FASE 3: lorong rumah + kamar anak, lantai kayu mengkilap, lampu tidur anak, dasar merah-maroon makin gelap.
- **Tone shift per zoom**: tiap keyframe kamera membawa palet (`cameraTrack.ts`); warna latar diinterpolasi selama zoom berjalan.
- Kontras: jaket suami navy & hijab istri dusty rose → di latar senada (biru garasi / pink apartemen) WAJIB rim light 2 sisi + halo.
- Fokus dengan lighting: spotlight + halo di subjek yang dibahas, sisanya redup; partikel cahaya naik dari objek penting.
- Ilustrasi utama medium (400–650 px), bentuk simpel menyala, selalu bergerak (idle loop/denyut/partikel). Maks 3 elemen bareng.
- Transisi besar hanya saat ganti fase/tempat: fade lewat gelap ala ref_1, rumah kartu runtuh → debu → reveal apartemen,
  zoom tembus pintu (Mid-CTA → Fase 3), pull-out reveal. Dalam satu tempat: zoom/tilt ke ilustrasi berikut (min 12 frame).
- Overlay layar (tidak ikut kamera): panel neon (pusat y ±340, 560–700 x 84 px, ikon 60 px), baterai (y ±400–450),
  subtitle 3 kata (pusat y 1390), 💬 poin penting overlay di bawah ilustrasi.
