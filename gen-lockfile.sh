#!/bin/bash
set -e
# Generate package-lock.json for this site OUTSIDE any workspace context, so the
# lockfile records `@sparkable-cms/cms` as a registry dependency (not a workspace
# link). Required because the site's standalone GitHub Actions / Docker `npm ci`
# resolves from the GitHub Packages registry, not the monorepo workspace.
#
# Requires a GitHub Packages token in ~/.npmrc (read:packages) to resolve the
# private @sparkable-cms/cms package (once the CMS dependency is added).
SITE_DIR="$(cd "$(dirname "$0")" && pwd)"
WORKDIR="$(mktemp -d -t spark-lockgen-XXXXXX)"
trap 'rm -rf "$WORKDIR"' EXIT
cp "$SITE_DIR/package.json" "$WORKDIR/"
[ -f "$SITE_DIR/.npmrc" ] && cp "$SITE_DIR/.npmrc" "$WORKDIR/"
cd "$WORKDIR"
# --ignore-scripts: skip any postinstall; we only need the dependency graph here.
npm install --package-lock-only --ignore-scripts
cp package-lock.json "$SITE_DIR/package-lock.json"
echo "Done — $SITE_DIR/package-lock.json updated"
