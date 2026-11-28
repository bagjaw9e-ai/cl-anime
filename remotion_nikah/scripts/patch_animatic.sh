#!/bin/bash
# tunggu re-render bagian 1 selesai, render ulang segmen beat 54 (frame 3930-4030), lalu susun animatic final (re-encode) + VO
cd "$(dirname "$0")/.."
until [ -s out/parts/anim_p0.mp4 ]; do sleep 20; done
npx remotion render src/index.ts Animatic out/parts/patch54.mp4 --frames=3930-4030 --concurrency=4 --muted --crf=24 > out/parts/patch54.log 2>&1 || { echo PATCH_FAIL; exit 1; }
ffmpeg -v error -y -i out/parts/anim_p0.mp4 -i out/parts/anim_p1.mp4 -i out/parts/anim_p2.mp4 -i out/parts/patch54.mp4 -i public/voiceover.m4a -filter_complex \
 "[2:v]trim=start_frame=0:end_frame=930,setpts=PTS-STARTPTS[a];[2:v]trim=start_frame=1031,setpts=PTS-STARTPTS[b];[0:v][1:v][a][3:v][b]concat=n=5:v=1:a=0[v]" \
 -map "[v]" -map 4:a -c:v libx264 -crf 22 -preset veryfast -pix_fmt yuv420p -c:a aac -b:a 160k -r 30 preview/animatic.mp4 && echo FINAL_OK || echo FINAL_FAIL
