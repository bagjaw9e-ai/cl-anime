#!/usr/bin/env bash
# Build the full 9:16 neon stickman video: frames -> SFX -> mix with voice-over.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p build out
(cd src && python3 sfx.py ../build/sfx.wav && python3 render.py ../build/video_noaudio.mp4)
ffmpeg -y -loglevel error -i build/video_noaudio.mp4 -i assets/voiceover.mp3 -i build/sfx.wav \
  -filter_complex "[1:a]aresample=44100,volume=1.0[v];[2:a]volume=0.75[s];[v][s]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95,loudnorm=I=-14:TP=-1.0:LRA=11[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/pmo_savior_neon_stickman.mp4
echo "done -> out/pmo_savior_neon_stickman.mp4"
