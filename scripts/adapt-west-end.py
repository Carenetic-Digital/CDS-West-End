#!/usr/bin/env python3
"""Swap Crestwood-specific copy, IDs, and leftover service links for West End."""
from __future__ import annotations

from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"

REPLACEMENTS = [
    ("Crestwood Dental Clinic", "West End Dental Centre"),
    ("Crestwood Family Dental", "West End Dental Centre"),
    ("Crestwood Dental", "West End Dental"),
    ("crestwooddental.ca", "westenddentalcentre.com"),
    ("crestwood-family-dental.spark0.io", "westenddentalcentre.com"),
    ("https://crestwooddental.ca", "https://www.westenddentalcentre.com"),
    ("Medicine Hat and the surrounding communities", "West Edmonton and the surrounding communities"),
    ("Medicine Hat communities", "West Edmonton communities"),
    ("Medicine Hat, AB", "Edmonton, AB"),
    ("Medicine Hat, Alberta", "Edmonton, Alberta"),
    ("in Medicine Hat", "in West Edmonton"),
    ("Medicine Hat", "Edmonton"),
    ("Dunmore Road SE #200", "9509 156 St NW, Suite M9"),
    ("Dunmore Road SE", "156 St NW"),
    ("1899 Dunmore Road SE #200", "9509 156 St NW, Suite M9"),
    ("403.526.0777", "780-944-2828"),
    ("+14035260777", "+17809442828"),
    ("reception@crestwooddental.ca", "info@westenddentalcentre.com"),
    ("GTM-MJ62KZ3", "GTM-K9457KP"),
    ("GTM-TRVXMJQ", "GTM-K9457KP"),
    ("#00703a", "#1d6f8c"),
    ("/images/logos/crestwood-dental-logo-white.png", "/images/logos/west-end-logo-white.png"),
    ("/images/logos/crestwood-dental-logo.png", "/images/logos/west-end-logo.png"),
    ("/images/hero/crestwood-dental-hero.jpg", "/images/hero/west-end-hero.jpg"),
    ("carried over from crestwooddental.ca", "carried over from westenddentalcentre.com"),
    ("two containers, carried over from westenddentalcentre.com", "container carried over from westenddentalcentre.com"),
]


def replace_in_text(text: str) -> str:
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    return text


def walk_src() -> list[Path]:
    skip = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".otf", ".woff", ".woff2", ".ico"}
    files = []
    for path in SRC.rglob("*"):
        if path.is_file() and path.suffix.lower() not in skip:
            files.append(path)
    return files


def patch_services_index() -> None:
    path = SRC / "pages/services/index.astro"
    text = path.read_text()
    # Replace the huge categories array with a data import
    start = text.index("---\n")
    end = text.index("---", start + 3)
    new_fm = """---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { serviceCategories } from '../../data/services';

const categories = serviceCategories.map((cat) => ({
  title: cat.title,
  href: cat.href,
  blurb: cat.blurb,
  services: cat.items.map((item) => ({ name: item.label, href: item.href })),
  icon: `<circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/>`,
}));
"""
    text = new_fm + text[end:]
    text = replace_in_text(text)
    path.write_text(text)


def patch_our_team() -> None:
    path = SRC / "pages/about/our-team.astro"
    text = path.read_text()
    # Drop the inline doctors array
    text = re.sub(
        r"const doctors = \[[\s\S]*?\];\n\nconst siteURL",
        "import { doctors } from '../../data/team';\n\nconst siteURL",
        text,
        count=1,
    )
    if "import { doctors }" not in text.split("---")[1]:
        text = text.replace(
            "import BaseLayout from '../../layouts/BaseLayout.astro';",
            "import BaseLayout from '../../layouts/BaseLayout.astro';\nimport { doctors } from '../../data/team';",
        )
        text = re.sub(r"const doctors = \[[\s\S]*?\];\n\n", "", text, count=1)
    text = replace_in_text(text)
    text = text.replace(
        'src="/images/team/hero-our-team.jpg"',
        'src="/images/team/dr-melissa-wong.png"',
    )
    text = re.sub(
        r'alt="[^"]*treatment room"',
        'alt="Dr. Melissa Wong, general dentist at West End Dental Centre"',
        text,
        count=1,
    )
    path.write_text(text)


def patch_base_layout() -> None:
    path = SRC / "layouts/BaseLayout.astro"
    text = path.read_text()
    text = replace_in_text(text)
    # Single GTM container
    text = re.sub(
        r"    <script is:inline>\n      \(function \(w, d, s, l, i\) \{[\s\S]*?GTM-K9457KP'\);\n    </script>\n    <script is:inline>\n      \(function \(w, d, s, l, i\) \{[\s\S]*?GTM-K9457KP'\);\n    </script>",
        """    <script is:inline>
      (function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l != 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
      })(window, document, 'script', 'dataLayer', 'GTM-K9457KP');
    </script>""",
        text,
        count=1,
    )
    text = text.replace(
        'const logoURL = new URL(\'/images/logos/west-end-logo.png\', siteURL).href;',
        'const logoURL = new URL(clinic.logo, siteURL).href;',
    )
    if "fonts.googleapis.com" not in text:
        text = text.replace(
            '<meta name="theme-color" content="#1d6f8c" />',
            '''<meta name="theme-color" content="#1d6f8c" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Roboto:wght@400;500;600&display=swap" rel="stylesheet" />''',
        )
    # Drop duplicate noscript GTM
    text = text.replace(
        '''      <iframe
        src="https://www.googletagmanager.com/ns.html?id=GTM-K9457KP"
        height="0"
        width="0"
        style="display:none;visibility:hidden"
        title="Google Tag Manager"
      ></iframe>
      <iframe
        src="https://www.googletagmanager.com/ns.html?id=GTM-K9457KP"
        height="0"
        width="0"
        style="display:none;visibility:hidden"
        title="Google Tag Manager"
      ></iframe>''',
        '''      <iframe
        src="https://www.googletagmanager.com/ns.html?id=GTM-K9457KP"
        height="0"
        width="0"
        style="display:none;visibility:hidden"
        title="Google Tag Manager"
      ></iframe>''',
    )
    path.write_text(text)


def patch_homepage() -> None:
    path = SRC / "pages/index.astro"
    text = path.read_text()
    text = replace_in_text(text)
    # Remove dropped homepage service tiles
    for drop in (
        "Children's Dentistry",
        "TMJ & Jaw",
        "Dental Implants",
        "CBCT Scans",
        "Intraoral Cameras",
        "Smile Makeovers",
        "Botulinum Toxin",
    ):
        # leave icons; we'll filter the array via regex of title lines later
        pass
    text = text.replace(
        'alt="Dr. Leo Rotband working with a patient at West End Dental Centre"',
        'alt="West End Dental Centre in West Edmonton"',
    )
    text = text.replace(
        "Your Comprehensive Dental Care Provider in Edmonton",
        "Your family dentist in West Edmonton",
    )
    text = text.replace(
        "Family Dentistry for Edmonton Communities",
        "Welcome to West End Dental Centre in Edmonton",
    )
    # Keep structure; strip children's / TMJ tiles from the homepage grid by title
    # The homepage uses serviceCategories with title fields — drop those objects.
    def drop_category(src: str, title: str) -> str:
        pattern = rf"  \{{ title: \"{re.escape(title)}\",[\s\S]*?\}}\s*(?:,\s*)?(?=\n  \{{ title:|\n\];)"
        return re.sub(pattern, "", src)

    for title in ("Children's Dentistry", "TMJ & Jaw"):
        text = drop_category(text, title)
    path.write_text(text)


def split_service_pages() -> None:
    rest = SRC / "pages/services/restorative"
    src = rest / "crowns-bridges.astro"
    if src.exists():
        crowns = replace_in_text(src.read_text())
        (rest / "crowns.astro").write_text(
            crowns.replace("Crowns & Bridges", "Dental Crowns")
            .replace("crowns and bridges", "crowns")
            .replace("Crowns and Bridges", "Dental Crowns")
        )
        (rest / "bridges.astro").write_text(
            crowns.replace("Crowns & Bridges", "Dental Bridges")
            .replace("crowns and bridges", "bridges")
            .replace("Crowns and Bridges", "Dental Bridges")
        )
        src.unlink()

    perio = SRC / "pages/services/periodontal"
    scaling = perio / "scaling-root-planing.astro"
    if scaling.exists():
        therapy = replace_in_text(scaling.read_text())
        (perio / "periodontal-therapy.astro").write_text(
            therapy.replace("Scaling & Root Planing", "Periodontal Therapy")
            .replace("Scaling and Root Planing", "Periodontal Therapy")
        )
        scaling.unlink()

    prosth = SRC / "pages/services/prosthodontics"
    dentures = prosth / "dentures.astro"
    if dentures.exists() and not (prosth / "porcelain-bridges.astro").exists():
        page = replace_in_text(dentures.read_text())
        (prosth / "porcelain-bridges.astro").write_text(
            page.replace("Dentures", "Porcelain Bridges")
            .replace("dentures", "porcelain bridges")
            .replace("Full & Partial porcelain bridges", "Porcelain Bridges")
        )


def write_dental_tips() -> None:
    path = SRC / "pages/dental-tips.astro"
    path.write_text(
        """---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="Dental Tips | West End Dental Centre"
  description="Practical dental tips from West End Dental Centre in West Edmonton."
>
  <section class="bg-[var(--color-brand-primary)]">
    <div class="container-wide py-16 lg:py-20">
      <p class="eyebrow text-white">Patient Education</p>
      <h1 class="mt-3 font-display font-semibold text-[length:var(--text-5xl)] leading-tight text-white max-w-2xl">
        Dental Tips
      </h1>
      <p class="mt-4 text-lg text-white/90 max-w-xl leading-relaxed">
        Helpful information for keeping your smile healthy between visits. More articles will be added here as we migrate content from the current West End site.
      </p>
    </div>
  </section>
  <section class="section-y bg-white">
    <div class="container-narrow">
      <p class="text-[var(--color-text)] leading-relaxed">
        Looking for something specific? Call us at
        <a href="tel:+17809442828" class="font-semibold text-[var(--color-brand-primary)]">780-944-2828</a>
        or explore our
        <a href="/services/" class="font-semibold text-[var(--color-brand-primary)]">dental services</a>.
      </p>
    </div>
  </section>
</BaseLayout>
"""
    )


def patch_astro_config() -> None:
    path = ROOT / "astro.config.mjs"
    text = path.read_text()
    if "westenddentalcentre.com" not in text:
        text = text.replace("site: 'https://example.com'", "site: 'https://www.westenddentalcentre.com'")
        text = text.replace('site: "https://example.com"', "site: 'https://www.westenddentalcentre.com'")
    # If Crestwood config was copied, fix site
    text = text.replace("https://crestwooddental.ca", "https://www.westenddentalcentre.com")
    path.write_text(text)


def write_redirects() -> None:
    path = ROOT / "public/_redirects"
    path.write_text(
        """# Legacy WordPress URLs → Crestwood-style West End IA
/about-us/  /about/our-clinic/  301
/dental-services/  /services/  301
/dental-services/general-dentistry/  /services/  301
/dental-services/preventative-dentistry/  /services/preventive/  301
/dental-services/cosmetic-dentistry/  /services/cosmetic/  301
/dental-services/dental-surgery/  /services/oral-surgery/  301
/services/composite-fillings/  /services/restorative/fillings/  301
/services/dental-bridges/  /services/restorative/bridges/  301
/services/dental-crowns/  /services/restorative/crowns/  301
/services/dental-bonding/  /services/cosmetic/bonding/  301
/services/veneers/  /services/cosmetic/veneers/  301
/services/teeth-whitening/  /services/cosmetic/whitening/  301
/services/dentures/  /services/prosthodontics/dentures/  301
/services/porcelain-bridges/  /services/prosthodontics/porcelain-bridges/  301
/services/root-canal-therapy/  /services/endodontics/root-canal/  301
/services/extractions/  /services/oral-surgery/extractions/  301
/services/ehygiene-and-cleaning/  /services/preventive/cleanings-exams/  301
/services/fluoride-treatment/  /services/preventive/fluoride/  301
/services/dental-sealants/  /services/preventive/sealants/  301
/services/mouth-guards-and-night-guards/  /services/preventive/guards/  301
/services/diagnostic-imaging-and-x-rays/  /services/diagnostic/x-rays/  301
/services/gum-disease/  /services/periodontal/gum-disease/  301
/services/periodontal-therapy/  /services/periodontal/periodontal-therapy/  301
/services/restorative-dentistry/  /services/restorative/  301
/services/invisalign-treatment/  /services/orthodontics/invisalign/  301
/emergency-service/  /services/emergency/  301
/financial-options/  /new-patients/insurance-payment/  301
/digital-patient-forms/  /new-patients/forms/  301
/patient-forms/  /new-patients/forms/  301
/patient-info/  /new-patients/  301
/join-our-team/  /about/careers/  301
/contact-us/  /contact/  301
/booking/  /book/  301
/privacy-policy/  /privacy/  301
/dental-tips/  /dental-tips/  301
"""
    )


def main() -> None:
    patch_services_index()
    patch_our_team()
    patch_base_layout()
    patch_homepage()
    split_service_pages()
    write_dental_tips()
    patch_astro_config()
    write_redirects()

    for path in walk_src():
        raw = path.read_text(errors="ignore")
        updated = replace_in_text(raw)
        if updated != raw:
            path.write_text(updated)

    leftovers = []
    for path in walk_src():
        text = path.read_text(errors="ignore")
        if re.search(r"Crestwood|Medicine Hat|Dunmore|403\.526|GTM-MJ62|GTM-TRVX|childrens/|sleep-apnea/|/services/tmj/|/services/sedation/", text):
            leftovers.append(str(path.relative_to(ROOT)))
    print("Adapted. Remaining files with Crestwood-era strings:")
    for item in leftovers:
        print(" ", item)


if __name__ == "__main__":
    main()
