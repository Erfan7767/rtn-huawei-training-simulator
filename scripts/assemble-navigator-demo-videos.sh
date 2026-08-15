#!/usr/bin/env bash
set -euo pipefail

FRAMES_ROOT="/home/ubuntu/rtn_demo_frames"
OUT="/home/ubuntu/rtn_demo_videos"
mkdir -p "$OUT"

for N in 01 02 03; do
  ffmpeg -y -framerate 5 -i "$FRAMES_ROOT/lesson${N}/frame-%04d.png" \
    -c:v libx264 -preset medium -pix_fmt yuv420p -movflags +faststart \
    "$OUT/RTN910_practical_${N}_silent.mp4"
done
