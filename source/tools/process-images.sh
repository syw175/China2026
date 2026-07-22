#!/usr/bin/env bash
# Crop + compress the three city-master photos into web-ready WebP heroes.
# City masters -> 16:10 @ 1280x800; WebP q80.
# Approved day heroes are committed assets recorded in source/day-images.js;
# this script deliberately cannot overwrite those user-selected crops.
# Output: repo-root images/ (served next to index.html, like fonts/).
# Re-run:  bash source/tools/process-images.sh
set -euo pipefail

SRC="${SRC:-$HOME/Documents/China 2026 WebSite Re-design/image-research/final-images/images}"
OUT="$(cd "$(dirname "$0")/../.." && pwd)/images"
mkdir -p "$OUT"

# cover-resize to fill the box, center-crop to exact aspect, encode WebP.
# $1 source file  $2 output name  $3 WxH  ($4 optional gravity, default center)
crop() {
  local grav="${4:-center}"
  magick "$SRC/$1" -auto-orient -resize "${3}^" -gravity "$grav" -extent "$3" \
    -strip -quality 80 -define webp:method=6 "$OUT/$2"
}

C=1280x800   # 16:10 city master

crop 01-guangzhou-city-master-a.jpg gz-city.webp "$C"
crop 02-shanghai-city-master-c.jpg  sh-city.webp "$C"
crop 03-beijing-city-master-c.jpg   bj-city.webp "$C"

echo "updated 3 city master WebP files in $OUT"
du -sh "$OUT"
