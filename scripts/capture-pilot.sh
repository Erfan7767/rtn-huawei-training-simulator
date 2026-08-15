#!/usr/bin/env bash
set -euo pipefail

BASE_URL="http://localhost:3000"
OUT_DIR="/home/ubuntu/rtn-pilot-frames"

mkdir -p "$OUT_DIR"

for step in 0 1 2 3 4 5; do
  chromium \
    --headless \
    --no-sandbox \
    --disable-gpu \
    --hide-scrollbars \
    --window-size=720,1280 \
    --screenshot="$OUT_DIR/step-${step}.png" \
    "$BASE_URL/?step=${step}"
done
