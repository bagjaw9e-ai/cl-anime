#!/usr/bin/env bash
# Video 3: faceless neon stickman (warm orange tone), crossfades, wind SFX at 50% of the voice
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p build out
(cd src && python3 render3.py ../build/v3_noaudio.mp4)
(cd src && python3 sfx3.py ../assets/voiceover_v3.mp3 ../build/v3_mix.wav)
ffmpeg -y -loglevel error -i build/v3_noaudio.mp4 -i build/v3_mix.wav -map 0:v -map 1:a -c:v copy \
  -c:a aac -b:a 192k -shortest -movflags +faststart out/pmo_stickman_v3.mp4
echo "done -> out/pmo_stickman_v3.mp4"
