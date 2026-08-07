#!/usr/bin/env bash
# Enforces the internal-link trailing-slash convention (see CLAUDE.md):
# Cloudflare serves pages at /path/ and 307-redirects /path, so every
# slash-less internal link costs a redirect hop. Scans the BUILD OUTPUT
# (dist/) so dynamically-generated links are covered too.
#
# Usage: npm run build && scripts/check-trailing-slashes.sh
# Fix violations in source with: node scripts/fix-trailing-slashes.mjs .
set -euo pipefail

[ -d dist ] || { echo "dist/ not found — run 'npm run build' first"; exit 2; }

offenders=$(grep -rEoh 'href="/[^"#?]*"' dist --include="*.html" \
  | grep -vE '/"$' | grep -vE '\.[a-z0-9]+"$' | sort -u || true)

if [ -n "$offenders" ]; then
  echo "FAIL: internal links missing trailing slashes (each costs a 307):"
  echo "$offenders"
  echo
  echo "Fix source files with: node scripts/fix-trailing-slashes.mjs ."
  echo "(Dynamic/template-literal links must be fixed by hand — search the offender path.)"
  exit 1
fi
echo "ok: all internal links carry trailing slashes"
