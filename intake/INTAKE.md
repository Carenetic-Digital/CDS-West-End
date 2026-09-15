# Project Intake

## Business Information

**Business Name:** West End Dental Centre
**Tagline:** General family dentistry in West Edmonton
**Industry:** Healthcare — General & Family Dentistry
**Location:** 9509 156 St NW, Suite M9, Edmonton, AB T5P 4J5
**Phone:** 780-944-2828
**Email:** info@westenddentalcentre.com
**Hours:** Mon 9:00 am–4:30 pm · Tue 9:00 am–8:00 pm · Wed 9:00 am–4:30 pm · Thu 9:00 am–5:00 pm · Fri 9:00 am–4:30 pm · Sat by appointment only
**In business since:** Serving patients at the current location since 1996
**Parent organization:** Canadian Dental Services (CDS)
**Languages:** English, Cantonese

## Target Audience

**Primary audience:** West Edmonton families and individuals looking for a long-term general dentist. Includes new patients, existing patients researching recommended treatment, and people checking CDCP coverage.

**What action should visitors take?** Book an appointment (RecallMax). Secondary: call the clinic, complete new-patient or existing-patient Jotform, learn about CDCP and financial options.

## Reference Sites

**Primary structural/style reference:** Crestwood Family Dental CDS (`https://github.com/Carenetic-Digital/Crestwood-Family-Dental-CDS`, staging `https://crestwood-family-dental.spark0.io/`). Use architecture, components, nav pattern, and patient flow — not Crestwood services, team, or brand.

**Content source of truth:** https://www.westenddentalcentre.com/

## Brand Voice

**Tone:** Warm, professional, family-practice. Care always comes first. Not corporate, not clinical-cold.

**Key messages:**
1. A West Edmonton general family practice at 9509 156 St NW, Suite M9 — in place since 1996.
2. Drs. Melissa Wong, Denis Redmond, and Kenneth Chan (Chan accepting new patients; schedule opens after April 27, 2026). About copy also references Dr. Brenda Lau.
3. Comprehensive care limited to services the current West End site actually lists.
4. CDCP-ready, consistent with other CDS clinic sites.
5. English and Cantonese spoken.

**Hard rules — Canadian dental advertising compliance (Alberta / CDSA):**
- NO patient testimonials, reviews, or "what our patients say" content
- NO superlative/comparative claims ("best," "top-rated," "leading," "#1," "state-of-the-art")
- NO outcome guarantees
- NO discounts, coupons, contests, or incentive offers
- "Specialist" only when formally registered; otherwise "general dentist"

## Content Sources

**Existing content:** Live site at https://www.westenddentalcentre.com/ — copy baseline for v1.

**Dentists (team cards):**
- Dr. Melissa Wong — DDS, University of Alberta (2004); BSc Biological Sciences with Psychology minor, University of Alberta (2000)
- Dr. Denis Redmond — BSc and DDS, University of Alberta; 40+ years in practice
- Dr. Kenneth Chan — University of Melbourne (2019); schedule opens after April 27, 2026

**Content to generate:**
- Localization of Crestwood page shells (clinic name, city, hours, services tree)
- CDCP page consistent with CDS sister sites
- Redirect map from legacy WordPress URLs

## Technical Requirements

**Forms — existing West End Jotform / RecallMax (do not use Crestwood IDs):**
- Booking: `https://can8.recallmax.com/rsm/request/public/bookOnline/patient/layout.html?a=vZ7a2CoMix8MCoa34ZUpJHLfzJ_Rxf0b0Dc`
- Contact: Jotform `213494368799274`
- New patient intake: `https://hipaa.jotform.com/212006050464239`
- Existing patient form: `https://hipaa.jotform.com/212005868711250`

**Analytics:** Live GTM `GTM-K9457KP` (do not carry over Crestwood containers).

**Social:**
- Facebook: https://www.facebook.com/westenddentalcentreedmonton
- Instagram: https://www.instagram.com/westenddentalcentre

**Deployment:** westenddentalcentre.com (cutover later). Cloudflare Workers via wrangler; staging expected at a spark0.io hostname.

**Persistent header CTA:** "Book Appointment" — sticky on scroll. Mobile: Call + Book bar.

**Special features:**
- Crestwood-style mega-menu, scaled to West End services only
- New Patients / Existing Patients flow matching Crestwood
- CDCP page
- Shared privacy, terms, and accessibility pages (clinic-localized)
- Multi-clinic theming via CSS variables
- WCAG 2.2 AA
