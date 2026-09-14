---
name: project:review
description: Comprehensive pre-launch review. Checks accessibility, images, SEO, scripts, responsiveness, and launch readiness.
disable-model-invocation: true
---

# Run Pre-Launch Review

Run a comprehensive review of all generated pages and report findings. Fix what you can automatically. For anything that requires human input (e.g., missing GTM ID), report it clearly so the user knows what's still needed.

## Checks to Run

### 1. Accessibility (WCAG 2.2 AA)
- Color contrast ratios on all text/background combinations
- Alt text on every image
- Heading hierarchy (h1 > h2 > h3, no skipped levels)
- Keyboard navigation (all interactive elements focusable and operable)
- Form labels and ARIA attributes
- Focus indicators visible

### 2. Images
- **No hotlinked images** — scan all `<img>` src attributes for external URLs. All images must be local in `public/images/`. Flag any external URLs as critical.
- All `<img>` tags have explicit `width` and `height` attributes
- Images use appropriate formats (WebP/AVIF for photos, SVG for icons/logos)
- Images are reasonably sized (not serving 4000px originals at 800px display)
- Hero image uses `loading="eager"` and `fetchpriority="high"`
- All other images use `loading="lazy"`
- Run image compression if any images are oversized

### 3. Responsiveness
- Screenshot or verify layout at mobile (375px), tablet (768px), desktop (1280px+)
- No horizontal scroll on any page
- No overlapping elements or cut-off text
- Navigation works on mobile (hamburger menu, etc.)

### 3b. Internal Link Convention (trailing slashes)

Run the enforcement check — it scans the BUILD OUTPUT so dynamically-generated
links are covered:

```bash
npm run build && npm run check:links
```

If it fails, fix static links with `node scripts/fix-trailing-slashes.mjs .`
and template-literal/dynamic links by hand, then re-run until green. Every
slash-less internal link costs a 307 redirect on Cloudflare.

### 4. Scripts & Launch Readiness

**Important:** Read `docs/third-party-scripts.md` for the full guide. When adding or checking scripts:
- All external `<script>` tags MUST use `is:inline` (Astro will CORS-fail without it)
- Script domains do NOT go in the CSP — `public/_headers` allows any `https:` source on purpose (clients add tags through GTM without a deploy)

Checks:
- Check if GTM or GA is installed. If not, report: "GTM/GA not found. Need the GTM container ID or GA measurement ID to install."
- Check the reference site's `<head>` for scripts that should carry over (chat widgets, tracking pixels, remarketing tags, heatmaps). Report any found with: "The reference site has [script]. Do you want this on the new site?"
- Verify all external `<script>` tags in BaseLayout.astro use `is:inline`
- Verify `public/_headers` still carries the template's permissive CSP (`https:` in `script-src`/`connect-src`/`frame-src`, `'unsafe-inline'` + `'unsafe-eval'` in `script-src`, no nonce/hash/`'strict-dynamic'`) and Permissions-Policy (`camera=*, microphone=*, geolocation=*`). If it was tightened to a domain allowlist, restore it and flag it. No layout may add a `<meta http-equiv="Content-Security-Policy">`
- Verify every loaded script uses `https:` (`http:` URLs get upgraded, and fail if the host has no HTTPS)

**Browser smoke test on the DEPLOYED site** — a permissive CSP makes violations rare, not impossible, and the headers only exist on the Worker (`npm run dev`/`npm run preview` send no CSP, so they can't catch this). With Playwright, load the homepage plus 3–5 representative pages (a form page, a page with embeds) on the staging URL and capture console messages and network requests. Report and fix:
- Any `Content-Security-Policy` or `Permissions-Policy` violation — it means the header drifted from the template, a meta CSP was added, or a resource is hitting `object-src`/`frame-ancestors`/`base-uri`
- Failed third-party requests (non-2xx, network errors, mixed content) and iframes (forms, maps, video) that don't render
- Uncaught JavaScript errors from third-party scripts

If the site hasn't been deployed yet, say so and skip the smoke test rather than running it against the dev server.
- Check if BugHerd script is still present. If so, flag: "BugHerd script still installed. Remove before launch."
- Check if `noindex` meta tag is still present. If so, flag: "noindex still set. Remove before launch."

### 5. Functionality
- All navigation links work (no remaining /404 links)
- Forms submit without errors
- Console errors reviewed — fix what's possible, report the rest
- Redirects in `public/_redirects` are present and correctly formatted

### 6. Build
- Run `npm run build` to verify clean build
- Report any build warnings or errors

## Report Format

```
Pre-Launch Review
=================

✅ PASSING
  - [list items that pass]

⚠️ NEEDS ATTENTION (can fix automatically)
  - [list items Claude will fix]

❌ NEEDS HUMAN INPUT
  - [list items that require information or decisions from the user]
  - Example: "GTM not installed. Provide your GTM container ID (GTM-XXXXXX) to add it."
  - Example: "Reference site has Intercom chat widget. Should this be added?"

📊 STATS
  - Pages reviewed: [count]
  - Images checked: [count]
  - Issues found: [count] ([count] auto-fixed, [count] need input)
```

After reporting, automatically fix everything in the "NEEDS ATTENTION" category without asking. Only pause for items that need human input.
