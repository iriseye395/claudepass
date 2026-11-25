#!/bin/sh
# Re-render public/og.png (1200x630) from og/og.html with headless Chrome.
set -e
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
	--window-size=1200,630 --screenshot="$PWD/public/og.png" "file://$PWD/og/og.html"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
	--window-size=180,180 --screenshot="$PWD/public/apple-touch-icon.png" "file://$PWD/og/icon.html"
