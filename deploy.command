#!/bin/bash
# Deploy the trip app. Double-click to run.
#
# IMPORTANT: this folder is the recovered v29 source, pulled byte-for-byte from
# the Vercel production build on 2 Oct 2026. The old ~/Downloads/static/ folder
# holds a stale August build — do NOT deploy from there.

cd "$(dirname "$0")" || exit 1

echo "──────────────────────────────────────────────"
echo " Deploying semmence-trip"
echo " Folder: $(pwd)"
echo "──────────────────────────────────────────────"
echo
cat version.txt 2>/dev/null
echo

# Rebuild index.html from src/ so a deploy can never ship stale output.
if [ -d src ] && [ -f build.py ]; then
  echo "Rebuilding index.html from src/ ..."
  python3 build.py || { echo "Build failed - nothing deployed."; read -r -p "Press return to close."; exit 1; }
  echo
fi

# Guard: the manifest references icon-512.png, so a deploy without it 404s.
missing=""
for f in index.html sw.js manifest.webmanifest config.js version.txt icon-180.png icon-512.png; do
  [ -f "$f" ] || missing="$missing $f"
done
if [ -n "$missing" ]; then
  echo "⚠  MISSING FILES:$missing"
  echo
  echo "   Download anything missing from https://semmence-trip.vercel.app/<filename>"
  echo "   and put it in this folder before deploying."
  echo
  read -r -p "Deploy anyway? [y/N] " force
  case "$force" in [yY]|[yY][eE][sS]) ;; *) echo "Cancelled."; read -r -p "Press return to close."; exit 0 ;; esac
fi

echo "Files that will ship:"
ls -1 index.html sw.js manifest.webmanifest config.js version.txt icon-*.png 2>/dev/null | sed 's/^/  /'
echo

if [ ! -d .vercel ]; then
  echo "Not linked to Vercel yet. Choose the EXISTING project 'semmence-trip'."
  echo
  read -r -p "Run vercel link now? [y/N] " go
  case "$go" in [yY]|[yY][eE][sS]) ;; *) echo "Cancelled."; read -r -p "Press return to close."; exit 0 ;; esac
  npx vercel link || { echo "Link failed."; read -r -p "Press return to close."; exit 1; }
fi

read -r -p "Deploy to PRODUCTION? [y/N] " reply
case "$reply" in
  [yY]|[yY][eE][sS]) ;;
  *) echo "Cancelled. Nothing deployed."; echo; read -r -p "Press return to close."; exit 0 ;;
esac

echo
npx vercel deploy --prod
status=$?

echo
if [ $status -eq 0 ]; then
  echo "✓ Deployed. Check https://semmence-trip.vercel.app"
  echo "  The service worker cache was bumped, so a refresh picks up the change."
else
  echo "✗ Deploy failed (exit $status)."
  echo "  If it asked you to log in, run 'npx vercel login' and try again."
fi

echo
read -r -p "Press return to close."
