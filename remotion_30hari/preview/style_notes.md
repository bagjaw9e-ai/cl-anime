# Style notes — analisis `reference/ref.mp4` (720x1280, 30 fps, 105,7 dtk)

Sumber: 106 frame (1/detik, `reference/frames/`) + scene detection (`gt(scene,0.25)`, 13 cut: 2.9, 5.1, 8.1, 17.4, 38.0,
44.5, 53.0, 63.0, 64.2, 65.1, 81.3, 84.9, 94.0 dtk) + strip 15 fps di sekitar cut (`reference/cuts/`).

## Gaya ilustrasi
- Flat 2D vector, bentuk membulat, **tanpa outline**. Shading = gradasi lembut + bayangan oval di lantai.
- Ruangan **nyata & detail**: kamar (kasur, meja + lampu meja, poster "chill", rak, jendela malam dengan siluet kota),
  ruang tamu (sofa oranye, lampu berdiri, tanaman, jendela, kaligrafi dinding), aula/istana (pilar, rak, tirai merah),
  gurun malam (piramida, palem), langit awan. Lantai selalu ada (garis horizon ±60-70% tinggi layar), karakter berdiri di lantai.
- **String lights / bokeh** di bagian atas ruangan (bulatan cahaya kuning kecil), partikel debu/bintang melayang,
  **vignette** kuat di pinggir, grain halus.
- Palet per scene: ungu-indigo malam, cokelat-kayu hangat, krem-oranye siang, merah gelap (bahaya), emas (istana).

## Lighting & fokus
- Fokus pakai cahaya: **spotlight/glow radial** di belakang subjek (mis. lingkaran cahaya di belakang karakter, glow di
  balik monster), sisanya digelapkan. Saat fokus ke elemen (kartu/teks), latar **di-blur + digelapkan** (frame 36-37, 69).
- Rim light warna di karakter/objek penting (merah di bahaya, teal di objek "baik").

## Elemen UI (wajib ditiru)
- **Label fase / chip atas** (y ≈ 6-8% layar): kotak kecil berwarna berisi angka tier + pill gelap dengan teks putih
  bold ("1 | JIN SALEH", "2 | AMIR"). Warna kotak beda tiap tier (hijau, biru, kuning, oranye, merah...).
  Muncul dengan pop kecil, ganti isi tiap bagian.
- **Chip bubble kecil** di bawah label (pill putih/ungu + emoji + teks pendek: "penghuni rumah", "dosa terasa biasa").
- **Subtitle**: putih, sans ExtraBold (Poppins-like), 1-3 kata, pusat ±80% tinggi layar; **kata aktif kuning**
  (karaoke). Di bawahnya sumber kecil (dalil) — kita tidak pakai.
- **Callout**: teks besar warna aksen + emoji ("⚠ LEVEL PALING BAHAYA", "PLOT TWIST", "PALING BANDEL"), muncul slam,
  ditaruh di ruang kosong atas/tengah.
- Speech bubble putih dengan teks kutipan + ekor; kartu putih rounded untuk kutipan panjang (latar di-blur).
- Garis putus-putus tipis menunjuk dari elemen ke karakter (frame 3-4, "chill" → karakter).

## Cara elemen masuk
- **Pop dengan overshoot** (scale 0 → 1.1 → 1) untuk chip, bubble, kado, kartu tier.
- **Slide/rise**: monster naik dari lubang lantai (frame 63-64), daftar tier masuk satu per satu dari kiri.
- Kubah pelindung transparan muncul membesar dari karakter (frame 38).
- Karakter selalu idle (napas, kedip, tangan bergerak), ekspresi mata berubah per kalimat.

## Transisi yang dipakai
1. **Whip slide horizontal + motion blur** (17.4 dtk): scene lama terdorong ke kiri, scene baru masuk dari kanan, ±8 frame.
2. **Blur dissolve** (≈48 dtk, 69 dtk): scene lama nge-blur kuat lalu crossfade ke scene baru, ±10-12 frame.
3. **Light sweep / bloom** (63 dtk): layar dibanjiri cahaya terang, scene baru muncul dari terang.
4. **Hard cut + pop** (38, 85 dtk) — cut langsung lalu elemen pop masuk.
5. Di dalam scene: camera push-in pelan, pan ke elemen, fokus ganti pakai blur latar.

## Penerapan di video 30 hari
- Karakter kita (rig pria bomber navy) + ruangan per fase digambar lengkap (kamar malam, lab, kamar hujan, kamar pagi, CTA).
- Chip fase [HARI 0] → [HARI 1–3] → [HARI 7] → [MINGGU 2] → [MINGGU 3–4] → [66 HARI] di y 140-260.
- Subtitle karaoke 3 kata (pusat y 1380), callout slam di y 300-450 / zona subtitle, subtitle disembunyikan saat callout.
- Transisi antar fase: whip slide, blur dissolve, light sweep (+ push-in tembus, match cut kalender→bulan bila cocok).
