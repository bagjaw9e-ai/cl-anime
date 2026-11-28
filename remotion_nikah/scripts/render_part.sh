#!/bin/bash
# render final 1080x1920 satu part: scripts/render_part.sh <n> <from-to>   (muted; audio = public/mix_final.wav saat digabung)
cd "$(dirname "$0")/.."
n=$1; r=$2
npx remotion render src/index.ts Main out/parts/tmp_final_p$n.mp4 --frames=$r --concurrency=4 --muted --codec=h264 --crf=18 > out/parts/final_p$n.log 2>&1 \
  && mv out/parts/tmp_final_p$n.mp4 out/parts/final_p$n.mp4 && echo "FINAL_PART_DONE p$n" >> out/parts/final_status.log \
  || echo "FINAL_PART_FAIL p$n" >> out/parts/final_status.log
