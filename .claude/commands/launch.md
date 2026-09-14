---
name: project:launch
description: Prepare the site for production launch. Removes staging artifacts, verifies everything is ready, builds, and deploys.
disable-model-invocation: true
---

# Launch Preparation

Prepare the site for production launch. Remove staging artifacts, verify all launch requirements, build, and deploy.

> Lessons baked into this checklist came from real launch incidents on
> ablefamilydental (2026-07-28) and crestwooddental (2026-08-06). Don't skip
> steps that look paranoid — each one was a production incident once.

## Steps

### 0. Repo & Pipeline Setup (one-time, do FIRST — needs admin/secret access)

- **Enable GitHub Actions on the repo** — new repos in the org often have it
  disabled. Probe: `gh api repos/<org>/<repo>/actions/permissions` returning
  404 means disabled (403 means enabled but unreadable). Fix in repo Settings
  → Actions → General → "Allow all actions". Needs a repo admin.
- **Activate the deploy workflow** — copy `docs/launch/deploy.yml` to
  `.github/workflows/deploy.yml` and replace every `{{SITE_SLUG}}` with the
  worker name from `wrangler.jsonc`. (It lives dormant in docs/ because during
  the build phase manual `npm run deploy` is correct — CI deploys only matter
  once Approximated and the CMS depend on push-to-main.)
- **Set repo secrets** and VERIFY them (a set-timestamp proves nothing —
  crestwood's first CI run failed on a mispasted token):
  - `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
  - `GH_PACKAGES_TOKEN` — verify:
    `curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $TOKEN" https://npm.pkg.github.com/@sparkable-cms/cms` must be 200
- **Confirm wrangler.jsonc safety rails intact**: `workers_dev: true`, no
  `routes` declared, `run_worker_first: true`, `not_found_handling: "404-page"`.

### 1. Remove Staging Artifacts

- **Remove BugHerd script** — search all layouts and pages for BugHerd `<script>` tags and remove them. Confirm removal.
- **Remove `noindex`** — find and remove any `<meta name="robots" content="noindex">` or `noindex, nofollow` tags, and flip any `noindex = true` default in BaseLayout. The 404 page keeps its explicit noindex.
- **robots.txt** — `src/pages/robots.txt.ts` must serve `Allow: /` + the
  production sitemap URL. **Never add a `public/robots.txt` alongside it** —
  the two silently drift and the dynamic route wins the build.

### 2. Verify Scripts & Tracking

**Important:** Read `docs/third-party-scripts.md` before adding any scripts. All external scripts require:
- `is:inline` directive on the `<script>` tag (Astro will CORS-fail without it)
- NO CSP change — `public/_headers` allows any `https:` source on purpose

Checks:
- **GTM/GA** — read the container ID(s) from the OLD SITE'S LIVE `<head>`
  (`curl -s https://<old-domain>/ | grep -o 'GTM-[A-Z0-9]*' | sort -u`), never
  from intake docs — an intake leftover once nearly shipped another client's
  container. Sites may run MORE THAN ONE container; install all of them.
  If none found, ask for the ID.
- **Reference site scripts** — check the reference site's `<head>` for scripts that should carry over (booking widgets, chat, call tracking). Report any found with: "The reference site has [script]. Is this needed on the new site?" Get an explicit yes/no per script.
- **Verify all external `<script>` tags use `is:inline`**
- **Verify `public/_headers` still carries the template's permissive CSP and Permissions-Policy** — not tightened to a domain allowlist, no nonce/hash/`'strict-dynamic'` in `script-src`, no `<meta http-equiv="Content-Security-Policy">` in any layout. Restore the template values if they drifted; clients will add GTM tags after launch without telling us
- **Verify all scripts from old site are accounted for** — either installed or explicitly declined.

### 3. Verify SEO Readiness

- `sitemap.xml` exists and is accessible
- `robots.txt` allows crawling (no disallow on important paths)
- All pages have unique `<title>` and `<meta name="description">`
- Open Graph tags present on all pages
- Structured data / JSON-LD is valid, and every hardcoded URL (canonicals,
  `@id`s, sitemap references, `site:` in astro.config.mjs) points at the
  PRODUCTION domain, not the spark0.io staging domain
- **Previous-client sweep** — if this site was cloned from another site's
  build, grep user-visible content for the previous client's name, city, and
  street (`grep -rin "<prev-client>\|<prev-city>" src/`) — a cloned site once
  shipped with the previous clinic's name in a page title

### 4. Verify Functionality

- All navigation links work (no `/404` references remaining)
- **Trailing slashes**: `npm run build && npm run check:links` must pass —
  every slash-less internal link costs a 307 on Cloudflare. Fix violations
  with `node scripts/fix-trailing-slashes.mjs .` (template-literal links by
  hand)
- **Form redirect targets** — forms configured in external services (Jotform
  etc.) often redirect to a URL like `/thank-you` after submit. That target
  lives in the FORM's settings, so no repo audit finds it. Check each form's
  post-submit redirect and confirm the target page exists (curl it on the
  built site). Two launched sites 404'd real form submitters this way.
- Forms submit correctly
- Form-shell pages (`/book/`, `/contact/`, patient forms) have
  `Cache-Control: no-store` rules in `public/_headers`
- Redirects in `public/_redirects` are present and properly formatted
- Console has no critical errors

### 5. Build

```bash
npm run build
```

Confirm the build completes cleanly with no errors.

### 6. Deploy

```bash
npm run deploy
```

Deploy to Cloudflare Workers. The `postdeploy` hook auto-verifies the
Approximated workaround (no ETag + full-200 conditionals) on the staging
origin. **A FAIL in the first ~2 minutes after deploy is usually the CF edge
propagation window — re-run before diagnosing.**

After deployment:
- Verify the site loads on the staging URL and the workers.dev URL
  (`https://<name>.<account-subdomain>.workers.dev` — this is what
  Approximated will target; it must return 200)
- Spot-check a few redirects to confirm they work
- Spot-check a form submission end-to-end (including its redirect target)
- Verify an unknown URL serves the branded 404 page (not a blank one)
- **Browser smoke test on the DEPLOYED site** — a permissive CSP makes violations rare, not impossible, and the headers only exist on the Worker (`npm run dev`/`npm run preview` send no CSP, so they can't catch this). With Playwright, load the homepage plus 3–5 representative pages (a form page, a page with embeds) on the staging URL and capture console messages and network requests. Report and fix:
  - Any `Content-Security-Policy` or `Permissions-Policy` violation — it means the header drifted from the template, a meta CSP was added, or a resource is hitting `object-src`/`frame-ancestors`/`base-uri`
  - Failed third-party requests (non-2xx, network errors, mixed content) and iframes (forms, maps, video) that don't render
  - Uncaught JavaScript errors from third-party scripts

  Do not proceed to DNS cutover until it's clean — failures found after cutover are visible to the client.

### 7. DNS Cutover (client/CDS side)

- Approximated targets the **workers.dev URL**; the spark0.io domain is the
  human-friendly staging alias
- After cutover, verify ON THE PRODUCTION DOMAIN: homepage 200 with
  `Apx-Hit`/`Via: Caddy` headers, **no ETag**, clean robots.txt (the
  spark0.io origin shows Cloudflare's zone-injected AI-crawler robots.txt;
  the Approximated-fronted domain must show the site's own), GTM firing,
  www → apex redirect
- Note: Approximated caches 404s and ignores query strings — a page added
  after its URL was 404-hit stays stale until the TTL expires (~10 min) or a
  dashboard purge

### 8. Report

```
Launch Report
=============

✅ READY
  - Actions enabled + deploy.yml activated + secrets verified
  - BugHerd removed
  - noindex removed, robots.txt single-source + production sitemap
  - GTM/GA installed (containers from old site's live head)
  - Reference-site scripts accounted for
  - sitemap.xml accessible, canonicals/@ids on production domain
  - Previous-client sweep clean
  - Trailing-slash check green
  - Form redirect targets exist
  - Build clean, deployed, postdeploy verify green
  - workers.dev URL 200 (Approximated target)
  - Branded 404 serving

⚠️ NEEDS ATTENTION
  - [anything that couldn't be verified or needs follow-up]

❌ NEEDS HUMAN INPUT
  - [anything that requires information or a decision]

🚀 Site is live at: [production URL]

Post-launch:
  - Add to Baseline monitoring
  - Verify analytics data flowing in 24 hours
  - Next phases: CMS onboarding, then the Bridge (see the monorepo's
    CDS_SITE_LAUNCH_AUDIT.md / DEPLOYMENT_SETUP.md)
```

## Notes

- DNS setup is handled separately and may require coordination with the client
- If GTM/GA credentials aren't available, deploy without them and flag for follow-up
- The site should be fully functional before DNS cutover
