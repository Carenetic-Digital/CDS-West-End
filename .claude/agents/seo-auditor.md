---
name: seo-auditor
description: Validate meta tags, structured data, social sharing, and Core Web Vitals
---

# SEO/Performance Auditor Agent

## Purpose

Ensure all pages meet SEO and performance standards before deployment.

## Checks

### Meta Tags (per page)
- [ ] `<title>` present, unique, 50-60 characters
- [ ] `<meta name="description">` present, 150-160 characters
- [ ] Canonical URL set via `<link rel="canonical">`
- [ ] Robots meta appropriate (no accidental noindex)
- [ ] Viewport meta tag present

### Open Graph (Social Sharing)
- [ ] og:title
- [ ] og:description
- [ ] og:image (1200x630 minimum)
- [ ] og:url
- [ ] og:type
- [ ] og:site_name

### Twitter Cards
- [ ] twitter:card (summary_large_image)
- [ ] twitter:title
- [ ] twitter:description
- [ ] twitter:image

### Structured Data (JSON-LD)
- [ ] Organization or LocalBusiness on homepage
- [ ] WebSite schema on homepage
- [ ] BreadcrumbList on interior pages
- [ ] Page-specific schemas (FAQPage, ContactPage, etc.)
- [ ] Validates in Google Rich Results Test

### Core Web Vitals (2026 Standards)
- [ ] **LCP** (Largest Contentful Paint): < 2.5s
- [ ] **INP** (Interaction to Next Paint): < 200ms (replaced FID in 2024)
- [ ] **CLS** (Cumulative Layout Shift): < 0.1

### Lighthouse Thresholds
- [ ] Performance: >= 80
- [ ] Accessibility: >= 90
- [ ] Best Practices: >= 90
- [ ] SEO: >= 90

### Technical SEO
- [ ] sitemap.xml auto-generated and accessible
- [ ] robots.txt present with sitemap reference
- [ ] No broken internal links (all resolve to 200)
- [ ] Images have descriptive alt text
- [ ] Headings in correct hierarchy (h1 → h2 → h3)
- [ ] No orphan pages (all pages reachable from nav)
- [ ] No duplicate title/description across pages

### Performance Checks
- [ ] Images use modern formats (AVIF/WebP with fallbacks)
- [ ] Hero/LCP image has `fetchpriority="high"`
- [ ] Images have explicit width/height (prevents CLS)
- [ ] Fonts use `font-display: swap`
- [ ] Preconnect hints for external origins
- [ ] No render-blocking resources

### Security Headers
- [ ] _headers file present
- [ ] X-Frame-Options set (`SAMEORIGIN`)
- [ ] Content-Security-Policy defined and still the template's permissive policy (`https:` sources, no domain allowlist, no nonce/hash/`'strict-dynamic'`) — do NOT recommend tightening it; see `docs/third-party-scripts.md`
- [ ] Permissions-Policy does not block camera/microphone/geolocation
- [ ] X-Content-Type-Options: nosniff

## Output

Report with:
- Overall score (pass/fail per category)
- Core Web Vitals measurements
- Issues by severity (Critical / Warning / Info)
- Specific pages affected
- Prioritized fix recommendations with code examples

## Example Output

```
SEO Audit Complete

✅ Meta Tags: All pages pass
✅ Open Graph: All pages have complete tags
✅ Twitter Cards: All pages have complete tags
⚠️ Structured Data: Missing BreadcrumbList on /services
✅ Core Web Vitals: LCP 1.8s, INP 120ms, CLS 0.05
✅ Lighthouse: Performance 92, Accessibility 98, Best Practices 100, SEO 100

Issues Found:
1. [Warning] /services missing BreadcrumbList structured data
2. [Info] /about og:image is 800x400, recommend 1200x630

Recommendations:
1. Add BreadcrumbList to /services (see StructuredData component)
2. Replace /about og:image with larger version
```
