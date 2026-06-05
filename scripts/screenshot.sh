#!/usr/bin/env bash
# Capture the running dev app to a timestamped PNG so UI changes can be reviewed
# before reporting done. Requires the Vite dev server running on :5173.
#
# Usage:
#   scripts/screenshot.sh [route-or-url] [name]
#   scripts/screenshot.sh "#/home" home
#   scripts/screenshot.sh "http://localhost:5173/?review=cart#/home" review-cart
set -euo pipefail

ROUTE="${1:-#/home}"
NAME="${2:-shot}"

case "$ROUTE" in
  http*) URL="$ROUTE" ;;
  *)     URL="http://localhost:5173/$ROUTE" ;;
esac

DIR="$(cd "$(dirname "$0")/.." && pwd)/.screenshots"
mkdir -p "$DIR"
OUT="$DIR/${NAME}-$(date +%Y%m%d-%H%M%S).png"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1440,1000 --virtual-time-budget=4000 \
  --screenshot="$OUT" "$URL" >/dev/null 2>&1

echo "$OUT"
