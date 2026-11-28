#!/bin/bash
# render animatic 540x960 per potongan (bisa dilanjut bila container restart), lalu gabung + VO
cd "$(dirname "$0")/.."
RANGES=("0-1499" "1500-2999" "3000-4276")
for i in 0 1 2; do
  out=out/parts/anim_p$i.mp4
  [ -s "$out" ] && { echo "skip p$i"; continue; }
  npx remotion render src/index.ts Animatic out/parts/tmp_p$i.mp4 --frames=${RANGES[$i]} --concurrency=4 --muted --crf=24 > out/parts/anim_p$i.log 2>&1 && mv out/parts/tmp_p$i.mp4 $out
  echo "done p$i"
done
printf "file 'anim_p0.mp4'\nfile 'anim_p1.mp4'\nfile 'anim_p2.mp4'\n" > out/parts/anim_list.txt
ffmpeg -v error -y -f concat -safe 0 -i out/parts/anim_list.txt -i public/voiceover.m4a -map 0:v -map 1:a -c:v copy -c:a aac -b:a 160k preview/animatic.mp4 && echo ANIMATIC_OK
