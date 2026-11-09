#!/usr/bin/env bash
# One-shot 3D brain video: render frames -> SFX + mix (SFX at 50% of voice) -> mp4
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p build out
(cd src && python3 b3d_video.py ../build/b3d_noaudio.mp4)
(cd src && python3 b3d_sfx.py ../assets/voiceover_brain3d.mp3 ../build/b3d_mix.wav)
ffmpeg -y -loglevel error -i build/b3d_noaudio.mp4 -i build/b3d_mix.wav -map 0:v -map 1:a -c:v copy \
  -c:a aac -b:a 192k -shortest -movflags +faststart out/pmo_brain3d_oneshot.mp4
echo "done -> out/pmo_brain3d_oneshot.mp4"
