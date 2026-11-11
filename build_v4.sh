#!/usr/bin/env bash
# Video 4: red-neon faceless stickman, camera-pan transitions, animation-only SFX at 50% of the voice
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p build out
(cd src && python3 render4.py ../build/v4_noaudio.mp4)
(cd src && python3 sfx4.py ../assets/voiceover_v3.mp3 ../build/v4_mix.wav)
ffmpeg -y -loglevel error -i build/v4_noaudio.mp4 -i build/v4_mix.wav -map 0:v -map 1:a -c:v copy \
  -c:a aac -b:a 192k -shortest -movflags +faststart out/pmo_stickman_v4_red.mp4
echo "done -> out/pmo_stickman_v4_red.mp4"
