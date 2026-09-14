# Adding Third-Party Scripts

Follow this guide when adding any external script (GTM, GA, BugHerd, Hotjar, chat widgets, embedded forms, etc.).

## 1. Use `is:inline` (Astro script processing)

Astro processes `<script>` tags by default — it tries to bundle external scripts, which causes CORS failures. Any external script loaded via `src="https://..."` needs the `is:inline` directive.

```astro
<!-- WRONG — Astro will try to fetch/bundle this, causing CORS error -->
<script type="text/javascript" src="https://example.com/widget.js" async="true"></script>

<!-- CORRECT — is:inline tells Astro to emit the tag as-is -->
<script is:inline type="text/javascript" src="https://example.com/widget.js" async="true"></script>
```

Add scripts to `src/layouts/BaseLayout.astro` inside `<head>` so they load on every page.

## 2. You do NOT need to edit the CSP

The Content-Security-Policy and Permissions-Policy in `public/_headers` are **permissive on purpose**. Any `https:` script, style, image, font, frame, or connection is allowed, so adding a script needs no header change.

### Why permissive

Site maintenance is shared with the client. Clients and their marketing vendors add and change tags in Google Tag Manager (Meta Pixel, LinkedIn Insight, CallRail, chat widgets, A/B testing tools) whenever they want, with no deploy and often without telling us. A per-domain allowlist blocks those tags **silently**: the only sign is a console error, so the client thinks tracking works and we find out weeks later. Vendors also move their sub-resources to new domains over time, so even a correct allowlist goes stale.

We accept a looser CSP in exchange for tags that just work. Consent management, not CSP, is what controls what third-party tags may do (see issue #15).

### What the policy still enforces

| Directive / header | Value | Why it stays |
|--------------------|-------|--------------|
| `object-src` | `'none'` | Blocks `<object>`/`<embed>` plugins; no modern tag uses them |
| `base-uri` | `'self'` | Stops injected `<base>` tags from rewriting relative URLs |
| `form-action` | `'self' https:` | Forms can post to any HTTPS service (Mailchimp, HubSpot), never plain HTTP |
| `frame-ancestors` + `X-Frame-Options` | `'self'` / `SAMEORIGIN` | Other sites can't frame ours (clickjacking); same-origin framing still works |
| `upgrade-insecure-requests` | — | Hardcoded `http://` resource URLs are upgraded to HTTPS instead of blocked as mixed content |
| `X-Content-Type-Options` | `nosniff` | No MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Full URLs aren't leaked cross-origin |

What's allowed that a strict policy would block, and the tags that need it:

- `script-src 'unsafe-inline'`: GTM Custom HTML tags and most vendor snippets inject inline script
- `script-src 'unsafe-eval'`: GTM Custom JavaScript variables and some tag templates use `eval`
- `blob:` in `script-src`/`worker-src`: session recording and chat tools (Hotjar, Clarity, LiveChat) spin up blob workers
- `wss:` in `connect-src`: real-time widgets (Intercom, Pusher-backed tools like BugHerd, Hotjar)
- `data:` in `img-src`/`font-src`/`media-src`: inlined pixels, icon fonts, and media

### Permissions-Policy

`camera=*, microphone=*, geolocation=*` lets embedded tools use those features: telehealth/video-consult widgets, voice input in chat widgets, and "use my location" store locators. Cross-origin iframes still need their own `allow="camera; microphone; geolocation"` attribute (vendor embeds include it), and the browser still prompts the visitor. The old `camera=(), microphone=(), geolocation=()` value blocked those features outright, with no prompt shown.

### Don't tighten it back

- **Don't add domain allowlists** to replace `https:`. That brings back the silent-failure problem above.
- **Don't add a `'nonce-…'`, `'sha256-…'`, or `'strict-dynamic'` to `script-src`.** When any of those is present, browsers ignore `'unsafe-inline'`, which breaks every GTM Custom HTML tag and inline vendor snippet at once.
- **Don't add a `<meta http-equiv="Content-Security-Policy">`** to a layout. Browsers enforce both policies, so a meta CSP silently re-restricts the header's policy.
- **Keep the CSP on one line.** Cloudflare `_headers` lines are capped at 2,000 characters.

### What can still block a script

The policy allows any `https:` (and `wss:`) source, so these are the only things that still fail:

- Plain `http:` URLs are rewritten to `https:` by `upgrade-insecure-requests`. If the host doesn't serve HTTPS, the request fails as a network error, not a CSP violation. Ask the vendor for an HTTPS URL.
- `<object>`/`<embed>` plugins (`object-src 'none'`).
- `frame-ancestors 'self'`: if a client's tool loads **our site inside its own iframe** (e.g. VWO/Optimizely visual editors, some landing-page builders), the frame is refused. If a client genuinely needs this, add that tool's origin to `frame-ancestors` and change `X-Frame-Options` to match (or drop it, since `frame-ancestors` takes precedence in modern browsers).

If the console shows `violates the following Content Security Policy directive`, it's one of the cases above. A plain `https://` domain being blocked means the header was tightened again; restore the template's policy.

## Removing staging scripts at launch

BugHerd and other staging-only tools need no CSP entries, so removing them at launch means removing just the `<script>` tag.

## Checklist for adding a new script

1. Add `<script is:inline ...>` tag to `BaseLayout.astro` `<head>` (or configure it in GTM)
2. Build and deploy
3. Smoke-test the **deployed** site in a browser (Playwright): load the pages that use the script and capture console messages and network requests. The CSP only exists on the Worker, so `npm run dev`/`npm run preview` can't show violations.
4. Fix anything reported: CSP/Permissions-Policy violations, failed requests, iframes that don't render, JS errors from the script

Even with a permissive policy, keep doing step 3. It catches drifted headers, the few directives that still block, and vendor scripts that simply fail.
