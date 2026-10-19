#!/bin/zsh
# Make a PDF of the whole site: build -> single-file bundle -> print once with headless Chrome.
# Usage: zsh pdf.sh "<output.pdf>"
set -e
cd "${0:A:h}"
OUT="${1:-Navi Lifesciences Website.pdf}"
TMP=$(mktemp -d)
osascript -l JavaScript build.js "$PWD" >/dev/null
osascript -l JavaScript bundle.js "$PWD" "$TMP/site.html" >/dev/null
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --user-data-dir="$TMP/prof" \
  --no-pdf-header-footer --virtual-time-budget=10000 --print-to-pdf="$OUT" "file://$TMP/site.html" 2>/dev/null
rm -rf "$TMP"
echo "Wrote $OUT"
