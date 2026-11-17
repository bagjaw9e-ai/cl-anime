# Style notes — analisis `reference/ref.mp4` (720x1280, 30 fps, 12,3 dtk)

Sumber: 24 frame (2/detik, `reference/frames/f_001..024.jpg`), contact sheet `preview/ref_contact.jpg`,
strip gerak 5 fps (`preview/ref_motion.jpg`: dissolve 3,2–4,8 dtk & glow-up 7,5–9,1 dtk).
Scene detection (`gt(scene,0.2)`) tidak menemukan satu cut pun → semua perubahan pakai transisi halus.

## Colour tone (sampel piksel)
| area | navy (0–3 dtk, 6–12 dtk) | cokelat hangat (3,5–6 dtk) |
|---|---|---|
| atas / pojok | `#0D1216` – `#141821` | `#151517` |
| tengah (halo latar) | `#20232A` – `#282B30` | `#272624` – `#2A2927` |
| lantai | `#090D10` | `#151412` |
| pinggir bawah (vignette) | `#07080C` | `#0F0E0C` |

- Latar = gradasi vertikal gelap navy/charcoal, paling terang di tengah (seperti ada lampu jauh di belakang subjek),
  pinggir & bawah hampir hitam (vignette kuat). Sangat minimalis: tidak ada ruangan/dekor, banyak ruang kosong.
- Tone bergeser pelan navy → cokelat-abu hangat (bagian "EARLY") → kembali navy. Pergeseran ±0,5 dtk, ikut crossfade.
- Grain/noise halus terlihat di area gelap.

## Lantai & pantulan
- Garis horizon tipis di ±68% tinggi frame; di bawahnya lantai lebih gelap.
- Semua objek punya **pantulan vertikal** samar di lantai (opacity ±15–20%, memudar ke bawah) + glow putih/amber
  yang "tumpah" ke lantai di bawah objek menyala.

## Hierarki cahaya (kunci gaya)
- Objek UTAMA menyala: figur putih-krem (`#F2EEE6`) dengan kepala bulat bercahaya, kotak/buku kuning-amber
  (`#FFB23F` → `#FFD166`, inti `#FFF4E0`) dengan **halo radial besar** (bloom amber, radius ±1,5× objek).
- Bangunan "CH. 20": badan abu-abu, jendela & pintu **putih menyala** + halo putih lembut di belakang bangunan,
  kanopi bergaris putih-abu, papan nama gelap dengan teks putih.
- Elemen PENDUKUNG abu-abu redup (`#5A6170` – `#7A808C`, figur kedua, gerobak) → tidak bersaing.
- Glow-up (7,5–9 dtk): objek amber nyala pelan ±0,6 dtk (opacity & radius halo naik), lalu **partikel cahaya kecil
  amber naik** diagonal dari objek (3–6 titik, memudar ke atas).

## Animasi & kamera
- Semua gerakan kalem, ease-in-out; tidak ada pop agresif.
- Kamera: zoom-out pelan (bangunan & figur mengecil ±10% di 0–3 dtk), lalu tahan/push-in sangat lambat.
- Transisi "EARLY": bangunan mengecil + memudar ke posisi lain (morph/dissolve ±0,6 dtk) sementara gerobak
  muncul; tone latar ikut bergeser. Kembali ke scene awal juga lewat dissolve.
- Figur selalu bergerak sedikit (melangkah di tempat, lengan mendorong).

## Tipografi di referensi
- Label kecil abu-abu spasi lebar ("CH. 1", "EARLY", "GARIS HIDUP") — kita tidak pakai (subtitle sesuai brief).
- Kalimat besar putih bold dengan 1 kata aksen amber ("one") di atas → padanan "subtitle poin penting" kita.

## Penerapan di video promo (brief)
- Bg: gradasi `#0E1320 → #1B2233` (navy) ↔ `#2A2018` (cokelat hangat beat 2–6) → balik navy beat 8 + aksen merah logo.
- Lantai horizon y≈1200 (bawah zona objek 450–1200) dengan pantulan objek & karakter.
- Karakter (bomber navy) di atas navy → wajib rim light putih-amber + halo/backlight + pantulan lantai.
- Objek utama dinyalakan (amber/kuning/putih hangat + halo), pendukung abu-abu `#5A6170`.
- Glow fade-in pelan, partikel naik dari objek penting, push-in/pull-out lambat, transisi dissolve/blur halus.
- Merah neon `#FF3B3B` hanya di logo PMO SAVIOR / CTA.
