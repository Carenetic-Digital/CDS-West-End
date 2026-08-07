// Add trailing slashes to internal page links (site convention: Cloudflare
// serves /page/ and 307s /page — this removes the redirect hop).
// Handles href="..." (HTML), href: "..." (data arrays), and fragment links.
// Skips: root "/", external URLs, tel/mailto, and static-asset paths
// (last segment contains a dot).
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const root = process.argv[2];
const files = execSync(
  `find ${root}/src -type f \\( -name '*.astro' -o -name '*.ts' -o -name '*.tsx' -o -name '*.json' \\)`,
  { encoding: 'utf8' }
).trim().split('\n');

const assetLike = (p) => /\.[a-z0-9]+$/i.test(p.split('/').pop());
const fixPath = (p) => {
  if (p === '/' || p.endsWith('/') || assetLike(p)) return p;
  return p + '/';
};

let totalChanges = 0;
for (const f of files) {
  const before = readFileSync(f, 'utf8');
  let changes = 0;
  // href="..."/href='...' and href: "..."/href: '...' — path with optional #fragment
  const after = before.replace(
    /(href\s*[=:]\s*)(["'])(\/[^"'#?\s]*)(#[^"']*)?\2/g,
    (m, pre, q, path, frag = '') => {
      const fixed = fixPath(path);
      if (fixed === path) return m;
      changes++;
      return `${pre}${q}${fixed}${frag}${q}`;
    }
  );
  if (changes > 0) {
    writeFileSync(f, after);
    console.log(`${changes}\t${f.replace(root + '/', '')}`);
    totalChanges += changes;
  }
}
console.log(`\nTOTAL: ${totalChanges} links fixed`);
