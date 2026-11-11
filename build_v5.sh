#!/usr/bin/env bash
# Video 5: revision of video 4 (more beats, realistic objects, lively stickmen)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p build out
(cd src && python3 render5.py ../build/v5_noaudio.mp4)
(cd src && python3 sfx5.py ../assets/voiceover_v3.mp3 ../build/v5_mix.wav)
ffmpeg -y -loglevel error -i build/v5_noaudio.mp4 -i build/v5_mix.wav -map 0:v -map 1:a -c:v copy \
  -c:a aac -b:a 192k -shortest -movflags +faststart out/pmo_stickman_v5_red.mp4
echo "done -> out/pmo_stickman_v5_red.mp4"
