# Brand Typography — West End Dental Centre

Live site uses **Acumin Pro Condensed / Acumin Pro Semi Condensed** for headings and **Roboto** for body (CDS WordPress theme). Acumin is licensed; this rebuild uses a close Google Fonts pair so we do not embed an unlicensed copy.

## Font Families

### Display Font (Headings)
**Font:** Barlow Condensed
**Weights:** 500 (Medium), 600 (Semibold), 700 (Bold)
**Notes:** Condensed humanist sans, closest widely available stand-in for Acumin Pro Condensed.
**Google Fonts URL:** https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&display=swap

### Body Font (Text)
**Font:** Roboto
**Weights:** 400 (Regular), 500 (Medium), 600 (Semibold)
**Google Fonts URL:** https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600&display=swap

### Combined Loader
https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Roboto:wght@400;500;600&display=swap

## Hierarchy Notes

- **Page hero (h1):** Barlow Condensed 600, fluid clamp ~36px mobile to ~64px desktop
- **Section headings (h2):** Barlow Condensed 600
- **Body:** Roboto 400, 16–18px, line-height ~1.6
- **UI / nav:** Roboto 500–600

## Fallback Stack

```
--font-display: 'Barlow Condensed', 'Avenir Next Condensed', 'Helvetica Neue', sans-serif;
--font-body: 'Roboto', system-ui, -apple-system, 'Segoe UI', sans-serif;
```

If official West End brand files for Acumin Pro become available, swap display to the self-hosted family and keep Roboto for body.
