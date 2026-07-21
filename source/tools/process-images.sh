#!/usr/bin/env bash
# Crop + compress the provided city/day photos into web-ready WebP heroes.
# City masters -> 16:10 @ 1280x800; day heroes -> 16:9 @ 1280x720; WebP q80.
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

# Same, but crop from the cover-resized image at an explicit vertical offset —
# used when the subject sits off-center (e.g. a boat low in the frame).
# $1 source  $2 output  $3 WxH  $4 +x+y offset
crop_at() {
  magick "$SRC/$1" -auto-orient -resize "${3}^" -crop "${3}${4}" +repage \
    -strip -quality 80 -define webp:method=6 "$OUT/$2"
}

C=1280x800   # 16:10 city master
D=1280x720   # 16:9  day hero

crop 01-guangzhou-city-master-a.jpg gz-city.webp "$C"
crop 02-shanghai-city-master-c.jpg  sh-city.webp "$C"
crop 03-beijing-city-master-c.jpg   bj-city.webp "$C"

# gz-1: bias the crop downward so the whole Pearl River cruise boat is in-frame
# (boat sits low; center-crop clipped its hull). Trims the Canton Tower's tip.
crop_at 04-guangzhou-2026-07-26-b.jpg gz-1.webp "$D" +0+220
crop 05-guangzhou-2026-07-27-a.jpg gz-2.webp "$D"
crop 06-guangzhou-2026-07-28-b.jpg gz-3.webp "$D"
crop 07-guangzhou-2026-07-29-a.jpg gz-4.webp "$D"

crop 08-shanghai-2026-07-29-d.jpg sh-1.webp "$D"
crop 09-shanghai-2026-07-30-c.jpg sh-2.webp "$D"
crop 10-shanghai-2026-07-31-b.jpg sh-3.webp "$D"
crop 11-shanghai-2026-08-01-a.jpg sh-4.webp "$D"
crop 12-shanghai-2026-08-02-c.jpg sh-5.webp "$D"

crop 13-beijing-2026-08-02-c.jpg bj-1.webp "$D"
crop 14-beijing-2026-08-03-b.jpg bj-2.webp "$D"
crop 15-beijing-2026-08-04-b.jpg bj-3.webp "$D"
crop 16-beijing-2026-08-05-b.jpg bj-4.webp "$D"

echo "wrote $(ls "$OUT"/*.webp | wc -l | tr -d ' ') webp files to $OUT"
du -sh "$OUT"
