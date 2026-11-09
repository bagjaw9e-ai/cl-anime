# PMO Savior – Neon Stickman Animation (9:16)

Video stickman animasi bergaya motion graphic neon merah (mengikuti color tone video referensi:
latar hitam berasap, figur siluet hitam dengan outline neon merah, lantai neon dengan pantulan).

- Resolusi 1080x1920 (9:16), 30 fps, durasi mengikuti voice-over (±68 detik)
- Tanpa teks / caption, tanpa BGM — hanya voice-over + SFX sintetis yang mengikuti motion graphic & transisi
- Ilustrasi berganti per kalimat sesuai transkrip (timing diselaraskan ke jeda pada audio)
- Scene CTA memakai gambar `assets/pmo_savior.png` di layar HP + panah "link di bio"

## Struktur
| File | Isi |
|---|---|
| `src/engine.py` | engine gambar neon (skia): rig stickman pria/wanita, ekspresi wajah, props, otak, bloom bg |
| `src/scenes.py` | 15 scene + timing per kalimat, jenis transisi, event shake/flash/glitch |
| `src/render.py` | compositor: transisi crossfade halus, pantulan lantai, bloom, logo CTA tajam → ffmpeg |
| `src/sfx.py` | SFX sintetis (whoosh, boom, klik kunci, ketukan, flush, zap, heartbeat, shatter, chime, dll) |
| `build.sh` | render + mix audio → `out/pmo_savior_neon_stickman.mp4` |

## Timeline scene
| Waktu | Kalimat | Ilustrasi |
|---|---|---|
| 0.0–4.5 | Bokep dan onani… pengecut | ribuan suami berlutut di depan HP raksasa, satu meringkuk ketakutan |
| 4.5–8.1 | ngunci pintu kamar mandi | suami di balik pintu dengan HP, gembok terkunci, istri mengetuk lalu menangis |
| 8.1–14.1 | ngeles capek… budak imajinasi | di ranjang malam, istri meraih, suami berpaling; gelembung imajinasi + rantai |
| 14.1–17.8 | istri nangis memeluk bantal sampai pagi | istri memeluk bantal, jam berputar, bulan → matahari |
| 17.8–22.2 | jatah dibuang di kloset… ilusi | tuas flush, pusaran kloset, sosok ilusi larut |
| 22.2–28.1 | PIED merusak saraf | HUD medis, saraf panggul tersengat & padam, baterai habis, panah layu, EKG datar |
| 28.1–33.6 | visual cortex & striatum | kepala profil, sinar HP memicu visual cortex & striatum |
| 33.6–38.4 | tubuh istri gak memicu dopamine | molekul dopamin pecah di tengah jalan, gauge kosong |
| 38.4–45.3 | loyo di ranjang, beringas di layar | split screen: lemas di ranjang vs mata menyala menatap HP |
| 45.3–48.5 | prefrontal cortex menyusut | otak, area prefrontal menyusut & retak |
| 48.5–51.5 | wibawa kepala keluarga musnah | mahkota pecah, istri & anak menjauh |
| 51.5–57.0 | oksitosin mati rasa, dingin, ngamuk, miskin gairah | hati membeku → mengamuk → api gairah padam |
| 57.0–61.2 | gak mau keluarga hancur | lantai retak, HP dibuang ke tong sampah, keluarga pulih |
| 61.2–63.1 | neuroplasticity | jaringan saraf tersambung ulang |
| 63.1–68.2 | PMO Savior, link di bio | HP dengan logo PMO Savior, panah ke atas, jari mengetuk |

## Build
```bash
pip install skia-python scipy numpy   # skia butuh libegl1
./build.sh
```

## Video 2: one-shot otak 3D
`out/pmo_brain3d_oneshot.mp4` (83 s, 1080x1920): otak 3D realistis yang terus berputar, ilustrasi per kalimat di kiri/kanan/atas,
kamera instan (zoom/pan/tilt), SFX baru di 50% volume voice, area atas/bawah frame kosong untuk teks manual. Build: `./build_b3d.sh`.
