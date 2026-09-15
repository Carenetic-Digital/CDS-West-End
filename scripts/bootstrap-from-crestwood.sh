#!/usr/bin/env bash
# Copy Crestwood architecture into this repo, then strip Crestwood-only pages/assets.
set -euo pipefail

SRC="${CRESTWOOD_REF:-/tmp/crestwood-ref}"
DST="$(cd "$(dirname "$0")/.." && pwd)"

if [[ ! -d "$SRC/src" ]]; then
  echo "Crestwood reference missing at $SRC. Clone it first." >&2
  exit 1
fi

echo "Copying Crestwood src → $DST/src"
rsync -a --delete \
  --exclude 'pages/blog/' \
  --exclude 'pages/news/' \
  --exclude 'content/blog/' \
  "$SRC/src/" "$DST/src/"

echo "Removing Crestwood-only service trees"
rm -rf \
  "$DST/src/pages/services/childrens" \
  "$DST/src/pages/services/sedation" \
  "$DST/src/pages/services/sleep-apnea" \
  "$DST/src/pages/services/tmj" \
  "$DST/src/pages/blog" \
  "$DST/src/pages/news" \
  "$DST/src/content/blog"

rm -f \
  "$DST/src/pages/marketing.astro" \
  "$DST/src/pages/services/diagnostic/cbct.astro" \
  "$DST/src/pages/services/diagnostic/intraoral-cameras.astro" \
  "$DST/src/pages/services/diagnostic/oral-cancer-screening.astro" \
  "$DST/src/pages/services/diagnostic/diagnostic-images.astro" \
  "$DST/src/pages/services/preventive/nutrition.astro" \
  "$DST/src/pages/services/preventive/comfort.astro" \
  "$DST/src/pages/services/restorative/inlays-onlays.astro" \
  "$DST/src/pages/services/prosthodontics/implant-restorations.astro" \
  "$DST/src/pages/services/prosthodontics/inlays-onlays.astro" \
  "$DST/src/pages/services/prosthodontics/replacement.astro" \
  "$DST/src/pages/services/prosthodontics/crowns-bridges.astro" \
  "$DST/src/pages/services/cosmetic/smile-makeovers.astro" \
  "$DST/src/pages/services/cosmetic/gum-contouring.astro" \
  "$DST/src/pages/services/endodontics/cracked-tooth.astro" \
  "$DST/src/pages/services/endodontics/internal-bleaching.astro" \
  "$DST/src/pages/services/endodontics/traumatic-injuries.astro" \
  "$DST/src/pages/services/emergency/appointments.astro" \
  "$DST/src/pages/services/emergency/broken-tooth.astro" \
  "$DST/src/pages/services/emergency/knocked-out-tooth.astro" \
  "$DST/src/pages/services/emergency/same-day.astro" \
  "$DST/src/pages/services/emergency/toothache.astro" \
  "$DST/src/pages/services/oral-surgery/wisdom-teeth.astro" \
  "$DST/src/pages/services/periodontal/gum-contouring.astro" \
  "$DST/src/layouts/BlogArticleLayout.astro"

echo "Copying shared public assets"
mkdir -p "$DST/public/images/logos" "$DST/public/images/icons" "$DST/public/images/team" \
  "$DST/public/images/hero" "$DST/public/images/about" "$DST/public/images/services"

# Shared org marks only — no Crestwood/Able/Medicine Hat photography
for f in \
  canadian-dental-association.png \
  CanadianDentalAssociation.jpg \
  CanadianDentalServices.png \
  cdsa-college-dental-surgeons-alberta.png \
  commitment-to-clean.png \
  Commitment-to-Clean-shield.png \
  invisalign-provider-logo-rgb.webp
do
  if [[ -f "$SRC/public/images/logos/$f" ]]; then
    cp "$SRC/public/images/logos/$f" "$DST/public/images/logos/"
  fi
done

if [[ -d "$SRC/public/images/icons" ]]; then
  rsync -a "$SRC/public/images/icons/" "$DST/public/images/icons/"
fi

# Generic service photography for kept hubs
for f in \
  hero-emergency.jpg hero-preventive.jpg hero-diagnostic.jpg hero-restorative.jpg \
  hero-prosthodontics.jpg hero-oral-surgery.jpg hero-periodontal.jpg hero-endodontics.jpg \
  hero-cosmetic.jpg hero-orthodontics.jpg hero-cleaning.jpg hero-crowns-bridges.jpg \
  hero-dentures.jpg hero-new-patients.jpg hero-insurance-payment.jpg \
  contact-hero.jpg emergency-care.jpg cleanings-exams-hero.jpg preventive-fluoride-hero.jpg \
  restorative-filling.jpg crowns-bridges-hero.jpg cosmetic-whitening-hero.jpg \
  cosmetic-veneers-hero.jpg existing-patients-hero.jpg
do
  if [[ -f "$SRC/public/images/services/$f" ]]; then
    cp "$SRC/public/images/services/$f" "$DST/public/images/services/"
  fi
done

if [[ -f "$SRC/public/_headers" ]]; then
  : # keep West End permissive CSP — do not overwrite
fi

echo "Downloading West End brand and team assets"
cd "$DST/public"
curl -fsSL -o images/logos/west-end-logo-white.png \
  "https://www.westenddentalcentre.com/wp-content/uploads/sites/13/2021/07/West-End-Dental-Centre-logo-white-EDM-200px-1.png"
curl -fsSL -o images/team/dr-melissa-wong.png \
  "https://www.westenddentalcentre.com/wp-content/uploads/sites/13/2019/06/West-End-Dr.-Wong.png"
curl -fsSL -o images/team/dr-denis-redmond.png \
  "https://www.westenddentalcentre.com/wp-content/uploads/sites/13/2026/04/West-End-Dr.-Redmond.png"
curl -fsSL -o images/team/dr-kenneth-chan.png \
  "https://www.westenddentalcentre.com/wp-content/uploads/sites/13/2026/04/West-End-Dr.-Chan.png"
curl -fsSL -o images/hero/west-end-hero.jpg \
  "https://www.westenddentalcentre.com/wp-content/uploads/sites/13/2021/07/West-End-Dental-Centre-Edmonton-image-hero-main.jpg"
curl -fsSL -o images/about/about-thumb.jpg \
  "https://www.westenddentalcentre.com/wp-content/uploads/sites/13/2023/09/image-thumb-about-WEDC-Dentist-West-Edmonton-700x400px.jpg"
curl -fsSL -o apple-touch-icon.png \
  "https://www.westenddentalcentre.com/wp-content/uploads/sites/13/2021/08/cropped-WEDC-favicon-transparent-512x512-1-180x180.png"
curl -fsSL -o images/og-default.jpg \
  "https://www.westenddentalcentre.com/wp-content/uploads/sites/13/2022/01/image-thumb-dental-services-dentistry-700x400px.jpg"

# Colorize the white wordmark for the light header
python3 - <<'PY'
from pathlib import Path
try:
    from PIL import Image
except ImportError:
    raise SystemExit("Pillow missing")
src = Path("images/logos/west-end-logo-white.png")
im = Image.open(src).convert("RGBA")
pixels = im.load()
# Brand primary #1d6f8c
r, g, b = 0x1D, 0x6F, 0x8C
for y in range(im.height):
    for x in range(im.width):
        pr, pg, pb, pa = pixels[x, y]
        if pa == 0:
            continue
        # Treat near-white as the mark
        if pr > 200 and pg > 200 and pb > 200:
            pixels[x, y] = (r, g, b, pa)
        else:
            # tint remaining visible pixels toward primary
            pixels[x, y] = (r, g, b, pa)
im.save("images/logos/west-end-logo.png")
print("Wrote images/logos/west-end-logo.png")
PY

echo "Bootstrap copy complete"
