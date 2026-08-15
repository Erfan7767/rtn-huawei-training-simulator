#!/usr/bin/env bash
set -euo pipefail

FRAMES="/home/ubuntu/rtn-pilot-frames"
NARRATION="/home/ubuntu/rtn_two_site_pilot_narration.wav"
OUTPUT="/home/ubuntu/rtn_two_site_training_pilot.mp4"
SECONDS_PER_STAGE="7.125"

ffmpeg -y \
  -loop 1 -t "$SECONDS_PER_STAGE" -i "$FRAMES/step-0.png" \
  -loop 1 -t "$SECONDS_PER_STAGE" -i "$FRAMES/step-1.png" \
  -loop 1 -t "$SECONDS_PER_STAGE" -i "$FRAMES/step-2.png" \
  -loop 1 -t "$SECONDS_PER_STAGE" -i "$FRAMES/step-3.png" \
  -loop 1 -t "$SECONDS_PER_STAGE" -i "$FRAMES/step-4.png" \
  -loop 1 -t "$SECONDS_PER_STAGE" -i "$FRAMES/step-5.png" \
  -i "$NARRATION" \
  -filter_complex "\
    [0:v]zoompan=z='min(zoom+0.00035,1.035)':d=171:s=720x1280:fps=24,setsar=1[v0];\
    [1:v]zoompan=z='min(zoom+0.00035,1.035)':d=171:s=720x1280:fps=24,setsar=1[v1];\
    [2:v]zoompan=z='min(zoom+0.00035,1.035)':d=171:s=720x1280:fps=24,setsar=1[v2];\
    [3:v]zoompan=z='min(zoom+0.00035,1.035)':d=171:s=720x1280:fps=24,setsar=1[v3];\
    [4:v]zoompan=z='min(zoom+0.00035,1.035)':d=171:s=720x1280:fps=24,setsar=1[v4];\
    [5:v]zoompan=z='min(zoom+0.00035,1.035)':d=171:s=720x1280:fps=24,setsar=1[v5];\
    [v0][v1][v2][v3][v4][v5]concat=n=6:v=1:a=0[video]" \
  -map "[video]" -map 6:a:0 \
  -c:v libx264 -pix_fmt yuv420p -crf 20 -preset medium \
  -c:a aac -b:a 160k -shortest -movflags +faststart \
  "$OUTPUT"

ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUTPUT"
