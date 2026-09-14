# Spark Site Template

A template for building websites with Claude Code. The developer provides a reference URL and intake materials, and Claude builds the site through a series of commands.

## Commands

Run these in order. Each command checks state before proceeding.

| Command | What it does | Requires |
|---------|-------------|----------|
| `/intake` | Crawl reference site, process intake files, reconcile sitemap, download images | `intake/INTAKE.md` and `intake/sitemap.md` filled in |
| `/homepage` | Build design system, generate homepage, create 404 page, run design review | State: `intake_complete` |
| `/generate-pages` | Build all remaining pages, create redirects, run tests and SEO audit | State: `homepage_approved` |
| `/review` | Comprehensive pre-launch review (accessibility, images, responsiveness, scripts, links, build) | Any time |
| `/test` | Playwright tests, responsive spot-checks, link verification | Any time |
| `/launch` | Remove staging artifacts, verify scripts/SEO, build, deploy to production | After client sign-off |

### Utility commands

- `/review` and `/test` — Can be run anytime, not just pre-launch. Useful during homepage iteration or after generating pages.

## State Management

`.site-factory/state.json` tracks progress. Commands check state before running.

```
intake_complete → homepage_pending_approval → homepage_approved → pages_pending_approval → complete
```

| State | Set by | Means |
|-------|--------|-------|
| `intake_complete` | `/intake` | Intake processed, reference site crawled, sitemap reconciled |
| `homepage_pending_approval` | `/homepage` | Homepage generated, awaiting dev review |
| `homepage_approved` | `/homepage` (on approval) | Dev approved homepage, ready for remaining pages |
| `pages_pending_approval` | `/generate-pages` | All pages built, awaiting review |
| `complete` | `/generate-pages` (on approval) | All pages approved |

## Project Structure

```
intake/                 # Client inputs
  INTAKE.md             # Business info, goals, audience, references
  sitemap.md            # Pages to build
  branding/
    colors.md           # Brand colors
    fonts.md            # Font families
    intake-quick.md     # Free-form intake notes, transcript excerpts
  images/               # Client-provided assets

reference/              # Output from /intake crawl
  analysis.md           # Design values, content, section ordering
  screenshots/          # Visual reference captures

src/                    # Website source
  components/           # Reusable UI (Header, Footer, sections)
  layouts/              # Page templates (BaseLayout)
  pages/                # Route pages (index.astro, 404.astro, etc.)
  styles/               # Global CSS with Tailwind v4 @theme
  DESIGN.md             # Design system documentation

public/                 # Static files
  images/               # All site images (never hotlink externally)
  _redirects            # Cloudflare redirect rules

.site-factory/          # Build state
  state.json            # Current phase, page inventory

.claude/
  commands/             # Slash command definitions
  agents/               # Agent instruction files
```

## Agents

Agent definitions in `.claude/agents/` provide detailed instructions for specialized tasks. Commands reference these agents internally — you don't invoke agents directly.

- **site-analyzer** — Crawl reference site, discover pages, extract design values, capture screenshots
- **color-system-generator** — Brand colors → full Tailwind v4 palettes with WCAG AA contrast
- **typography-system-generator** — Fonts → fluid type scale, loading strategy, heading hierarchy
- **component-builder** — Generate responsive, accessible Astro components
- **content-writer** — Generate brand-aligned copy
- **image-sourcer** — Download, optimize, and prepare images (no hotlinking, proper formats/dimensions)
- **visual-qa** — Screenshot all breakpoints, compare against reference
- **design-reviewer** — WCAG 2.2 AA compliance, responsive design, visual consistency
- **seo-auditor** — Meta tags, structured data, Core Web Vitals readiness

## Tech Stack

- Astro 5.x (static output)
- Tailwind CSS v4 (CSS-first with @theme, no tailwind.config.js)
- Playwright (functional testing)
- Cloudflare Workers (deployment via wrangler)

## Third-Party Scripts

When adding any external script (GTM, BugHerd, Hotjar, chat widgets, etc.):

1. **Always use `is:inline`** on external `<script>` tags — Astro will try to bundle them otherwise, causing CORS errors
2. **Do not edit the CSP** — `public/_headers` CSP and Permissions-Policy are permissive on purpose (any `https:` source) because clients add tags through GTM without a deploy. Never tighten them to a domain allowlist, and never add a nonce/hash/`'strict-dynamic'` to `script-src` (that disables `'unsafe-inline'` and breaks GTM Custom HTML tags)
3. **Still smoke-test the deployed site in a browser** — capture console + network on the staging URL and fix any CSP violations, failed third-party requests, or broken iframes. The headers only exist on the Worker, so the dev server can't show these

See `docs/third-party-scripts.md` for the full guide, what the policy still enforces, and troubleshooting steps.

## Conventions

- Components in `src/components/` use PascalCase
- Pages follow `state.pages.planned` list
- Design system documented in `src/DESIGN.md`
- All images go in `public/images/` — never hotlink to external URLs
- All internal links must end with a trailing slash (e.g. `/about/`, not `/about`) — Cloudflare resolves trailing-slash URLs directly while non-trailing URLs incur a redirect. **Enforced**: `npm run check:links` scans the build output (run by `/review` and `/launch`); fix violations with `node scripts/fix-trailing-slashes.mjs .`
- Redirects go in `public/_redirects` (Cloudflare format)
- Use `compound-engineering:frontend-design` skill for page generation

## Commands Reference

- `npm run dev` — Start development server (localhost:4321)
- `npm run build` — Build for production
- `npm run test` — Run Playwright tests
- `npm run check:links` — Enforce trailing-slash convention against the build output
- `npm run deploy` — Build and deploy to Cloudflare Workers (postdeploy auto-verifies the Approximated workaround on the staging origin)

## Deployment

Deployment has two phases:

**Build phase (now):** deploys are manual — `npm run deploy` (`astro build &&
wrangler deploy`). The site serves at `https://<name>.spark0.io/` (staging
custom domain, dashboard-managed) and `https://<name>.<account>.workers.dev`.
Pushing to `origin/main` does NOT deploy during this phase — that's
intentional; WIP commits shouldn't publish.

**Launch phase:** `/launch` step 0 activates CI — copy `docs/launch/deploy.yml`
to `.github/workflows/deploy.yml`, enable Actions on the repo, set + verify
the repo secrets. From then on every push to main deploys (the CF Worker and,
after CMS onboarding, the fly.io staging box both depend on it — CMS publishes
ride this pipeline).

**Safety rails already in this template (do not remove):**
- `wrangler.jsonc` pins `workers_dev: true` and declares NO routes — a
  declared route flips wrangler's default and every deploy silently disables
  the workers.dev URL, which is what Approximated targets in production
  (caused a real outage, 2026-08-06)
- `worker/index.js` + `! ETag` in `public/_headers` + the postdeploy verify =
  the Approximated blank-page workaround (both halves required)
- The permissive CSP/Permissions-Policy in `public/_headers` — tightening
  them silently breaks client-managed GTM tags (see
  `docs/third-party-scripts.md`)
- `not_found_handling: "404-page"` serves the branded 404 (without it,
  unknown URLs return an empty body and browsers show their own error page)
- `gen-lockfile.sh` regenerates the site-local `package-lock.json` outside any
  npm-workspace context — run it after ANY dependency change or CI's `npm ci`
  breaks

## Process Documentation

Full process documentation (for PMs, strategists, and developers) lives at the sibling project `../spark-docs/` and is deployed at https://spark-process.carenetic-digital.workers.dev
