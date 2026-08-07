#!/usr/bin/env bash
# Verifies the two-part Approximated.app workaround is live on a deployed site.
# The Approximated proxy intermittently mangles 304 responses into empty 200s
# (blank pages), so the site must never produce a 304: responses carry no ETag
# (`! ETag` in _headers) and the front worker strips conditional request headers.
#
# Usage: scripts/verify-approximated-fix.sh [https://yourdomain.com/]
# With no argument, derives the staging URL from the worker name in
# wrangler.jsonc (https://<name>.spark0.io/) — so template clones need no edit.
# Runs automatically after every `npm run deploy` (wired as "postdeploy").
set -euo pipefail

URL="${1:-}"
if [ -z "$URL" ]; then
  NAME=$(node -e "
    const s = require('fs').readFileSync('wrangler.jsonc', 'utf8');
    console.log(JSON.parse(s.replace(/^\s*\/\/.*$/gm, ''))['name']);
  ")
  URL="https://${NAME}.spark0.io/"
fi
FAIL=0

headers=$(curl -sS -D - -o /dev/null --max-time 15 "$URL")
if echo "$headers" | grep -qi '^etag:'; then
  echo "FAIL: $URL is serving an ETag header — '! ETag' missing from _headers?"
  FAIL=1
else
  echo "ok: no ETag header"
fi

# Conditional request with the REAL content hash of the built homepage.
# Must come back as a full-bodied 200 — a 304 means the front worker's
# conditional-header strip is not in effect and Approximated can mangle it.
if [ -f dist/index.html ]; then
  hash=$(md5 -q dist/index.html 2>/dev/null || md5sum dist/index.html | cut -d' ' -f1)
  resp=$(curl -sS -D - -o /dev/null --max-time 15 -w 'BODY:%{size_download}' \
    -H "If-None-Match: \"$hash\", W/\"$hash\"" "$URL")
  status=$(echo "$resp" | grep -E '^HTTP' | tail -1 | awk '{print $2}')
  body=$(echo "$resp" | grep -o 'BODY:[0-9]*' | cut -d: -f2)
  if [ "$status" = "200" ] && [ "${body:-0}" -gt 1000 ]; then
    echo "ok: conditional request returned full 200 ($body bytes)"
  else
    echo "FAIL: conditional request returned status=$status body=${body:-0} — expected full 200"
    FAIL=1
  fi
else
  echo "warn: dist/index.html not found (run the build first), skipped conditional-request check"
fi

if [ "$FAIL" -ne 0 ]; then
  echo "Approximated blank-page workaround is NOT fully in effect. See worker/index.js and _headers."
  exit 1
fi
echo "Approximated workaround verified on $URL"
