# Style notes — kombinasi ref_1 + ref_2 (video 3 fase)

Sumber: `reference/ref1_frames/` (24 frame, 2 fps, 12,3 dtk), `reference/ref2_frames/` (211 frame, 2 fps, 105,7 dtk),
contact sheet `preview/ref1_contact.jpg`, `preview/ref2_contact.jpg`, strip cut 15 fps `reference/cuts/` + `preview/ref2_cuts.jpg`.
Scene detection `gt(scene,0.25)`: **ref_1 = 0 cut** (semua dissolve halus); **ref_2 = 13 cut**
(2.87, 5.1, 8.1, 17.4, 38.0, 44.5, 53.0, 63.0, 64.2, 65.1, 81.3, 84.9, 94.0 dtk).

## ref_2 — ruangan nyata, ritme cepat
- Flat 2D vector tanpa outline, bentuk membulat, shading gradasi + bayangan oval di lantai.
- **Ruangan lengkap & detail** per bagian: kamar (kasur, meja, lampu meja, poster, jendela malam + siluet kota), ruang tamu
  (sofa oranye, lampu berdiri, tanaman, jendela, kaligrafi), aula/istana (pilar, rak, tirai merah), gurun malam, langit awan.
  Lantai selalu ada (horizon ±60–70% tinggi), karakter berdiri di lantai. String lights/bokeh di atas, partikel melayang.
- **Label chip** atas (y ±6–8%): kotak warna kecil berisi angka + pill gelap teks putih bold ("1 | JIN SALEH");
  warna kotak beda tiap tier. Chip bubble kecil di bawahnya (pill + emoji + teks pendek).
- **Garis putus-putus** tipis dari label/bubble menunjuk ke objek/karakter.
- **Callout** teks besar warna aksen + emoji ("⚠ LEVEL PALING BAHAYA", "SYIRIK") slam di ruang kosong.
- Elemen masuk **pop overshoot** (0 → 1.1 → 1), kartu/daftar masuk satu-satu, monster naik dari lantai, kubah membesar.
- Ritme cepat: ilustrasi/ekspresi berganti per kalimat (±1,5–3 dtk).
- Subtitle putih ExtraBold 1–3 kata di ±80% tinggi, kata aktif kuning (karaoke).

## ref_1 — panggung gelap sinematik
- Latar gradasi navy/charcoal gelap (`#0D1216` → `#282B30` di tengah), tone bisa geser ke cokelat hangat (`#2A2927`)
  lalu balik navy; vignette kuat, grain halus. Minimalis, banyak ruang kosong.
- **Hierarki cahaya**: objek yang dibahas MENYALA (amber `#FFB23F`/kuning `#FFD166`/putih hangat `#FFF4E0`) + halo radial
  besar; elemen pendukung abu-abu redup `#5A6170`. Glow fade-in ±0,6 dtk, lalu partikel amber kecil naik.
- Lantai gelap dengan **pantulan** samar objek (15–20%) + cahaya tumpah ke lantai.
- Kamera: zoom-out / push-in sangat lambat; transisi = dissolve/morph ±0,6 dtk, tanpa cut.

## Transisi yang ada di referensi
| jenis | sumber | contoh | durasi |
|---|---|---|---|
| whip slide horizontal + motion blur | ref_2 17.4 dtk | scene lama terdorong ke kiri, baru masuk dari kanan | 8–10 f |
| blur dissolve | ref_2 38 / 81 dtk | scene lama nge-blur kuat lalu crossfade | 10–12 f |
| light sweep / bloom | ref_2 63 dtk | layar dibanjiri cahaya terang, scene baru muncul dari terang | 10–14 f |
| hard cut + pop | ref_2 44.5 / 85 dtk | cut langsung lalu elemen pop | 0 f |
| dissolve + tone shift | ref_1 3.5 dtk | bangunan mengecil & memudar, tone navy → cokelat | ±18 f |
| glow-up | ref_1 7.5 dtk | objek nyala pelan + partikel naik | ±18 f |

## Cara kombinasi untuk video 3 fase
- **Dunia = ruangan ref_2, cahaya = ref_1.** Tiap tempat digambar lengkap (furnitur, jendela, detail) tapi diredupkan
  (overlay gelap ±45–60% + desaturasi ringan) dan diberi **blur tipis (depth of field)** untuk latar.
- **Sorotan**: subjek yang dibahas dapat spotlight radial + rim light + glow; sumber cahaya utama = objek di cerita
  (layar HP pink, lampu meja, monitor, jendela bulan). Objek ilustrasi menyala terang di atas ruangan redup.
- Lantai tiap ruangan diberi pantulan halus (ref_1). Partikel cahaya naik di objek penting (amber; pink di fase 1).
- **UI ref_2**: label chip fase di atas (y 140–260) + 3 slot fase berikon otak; garis putus-putus penunjuk;
  subtitle karaoke 3 kata (y 1380); callout poster saat 💬 (subtitle disembunyikan).
- Pop overshoot untuk properti/karakter masuk (ref_2); glow fade-in + partikel untuk objek "penting" (ref_1).
- **Transisi**: ganti tempat/fase = transisi berat (whip slide, light sweep, fade lewat gelap ala ref_1);
  di dalam satu tempat = camera move halus (push/pan/tilt) + rack focus (blur latar berubah), tanpa cut.
- **Tone per tempat**: pelaminan hangat → meredup dramatis; kamar navy-ungu + glow pink; panggung mid-CTA navy + amber;
  kantor teal-abu kusam + aksen oranye/merah; lab gelap + monitor/papan menyala; rumah pasangan amber hangat → biru pucat dingin.
- Kontras wajib: karakter (jaket navy) selalu diberi rim light hangat + halo di belakangnya di ruangan kebiruan.
