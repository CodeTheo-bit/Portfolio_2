# P J Tivin Elvis — Portfolio Project

A modern, highly modular portfolio platform featuring three distinct bespoke themes, organized into cleanly decoupled directories for assets, sections, styles, and scripts.

---

## 📁 Project Architecture & Folder Organization

```text
portfolio-deploy/
├── index.html                           ← Primary production entry point (Minimalist Light theme)
├── vercel.json                          ← Vercel deployment & routing config
├── README.md                            ← Project documentation
├── profile.png                          ← Optional profile photo (drop here)
│
├── assets/                              ← Root Assets for production site
│   ├── css/
│   │   ├── variables.css                ← Design tokens (colors, fonts, shadows)
│   │   ├── base.css                     ← Reset, layout container & background glows
│   │   ├── components.css               ← Modular component styles (nav, hero, cards, etc.)
│   │   └── style.css                    ← Master stylesheet bundle
│   └── js/
│       └── main.js                      ← Glass navbar & smooth navigation logic
│
├── sections/                            ← Modular HTML sections for active site
│   ├── navbar.html                      ← Sticky glass header & navigation
│   ├── hero.html                        ← Headline, bio, CTAs & portrait stage
│   ├── about.html                       ← Narrative and key metrics
│   ├── skills.html                      ← 6 Technical domain cards
│   ├── projects.html                    ← Curated works & GitHub showcase
│   ├── contact.html                     ← Direct email & social buttons
│   └── footer.html                      ← Site footer & credits
│
└── pages/                               ← Dedicated standalone themes & page designs
    │
    ├── minimalist-light/                ← Page 1: Minimalist Light (Warm Pastel Sand & Crimson)
    │   ├── index.html                   ← Standalone page
    │   ├── css/
    │   │   ├── variables.css
    │   │   ├── base.css
    │   │   ├── components.css
    │   │   └── style.css
    │   ├── js/
    │   │   └── main.js
    │   └── sections/
    │       ├── navbar.html, hero.html, about.html, skills.html,
    │       ├── projects.html, contact.html, footer.html
    │
    ├── noir-aztec/                      ← Page 2: Noir Aztec (Film Noir Navy & Sun Stone Geometry)
    │   ├── index.html                   ← Standalone page
    │   ├── css/
    │   │   ├── variables.css
    │   │   ├── components.css
    │   │   └── style.css
    │   ├── js/
    │   │   ├── cursor.js                ← Custom animated dual-ring cursor
    │   │   ├── sunstone.js              ← Generative SVG Sun Stone & parallax
    │   │   └── main.js                  ← Navigation scroll spy & scroll reveal
    │   └── sections/
    │       ├── navbar.html, hero.html, work.html, about.html,
    │       ├── capabilities.html, contact.html, footer.html
    │
    └── royal-luxury/                    ← Page 3: Royal Luxury (Gold & Crimson with Constellation Canvas)
        ├── index.html                   ← Standalone page
        ├── css/
        │   ├── variables.css
        │   ├── components.css
        │   └── style.css
        ├── js/
        │   ├── cursor.js                ← Custom gold cursor & crosshairs
        │   ├── particles.js             ← Interactive canvas particle constellation & nebula
        │   ├── widgets.js               ← Live trading chart, bookshelf, basketball & F1 track
        │   └── main.js                  ← Scroll reveal & progress bar animations
        └── sections/
            ├── navbar.html, hero.html, about.html, skills.html,
            ├── projects.html, widgets.html, contact.html, footer.html
```

---

## 🎨 Available Themes

1. **Minimalist Light** (`index.html` or `pages/minimalist-light/index.html`)
   - Warm pastel gold / sand / champagne background (`#f9f6f0`) with rich cream crimson (`#8c1d28`) accents.
   - Clean editorial typography (*Instrument Serif* + *Plus Jakarta Sans*).
   - Crisp cards, domain capsules, and cutout portrait stage.

2. **Noir Aztec** (`pages/noir-aztec/index.html`)
   - 2am film-noir dark navy (`#0D1F2D`) with warm sand punch (`#D4C4B0`).
   - Generative Aztec Sun Stone (*Piedra del Sol*) geometry and parallax.
   - Aztec step-fret greca dividers, diamond lattice texture, and smooth custom cursor.

3. **Royal Luxury** (`pages/royal-luxury/index.html`)
   - Imperial void black (`#020205`) and luxury gold (`#d4af37`) with crimson undertones.
   - Live canvas particle constellation network and shooting stars.
   - 5 interactive widgets: Live Trading Ticker, Bookshelf peek, Basketball game, Leaderboard win-rate, and F1 Racing track.

*Note: A floating theme switcher pill is located in the bottom-right corner of each page to effortlessly explore between designs.*

---

## 🚀 Deployment (Vercel)

The project is preconfigured for zero-configuration static deployment via Vercel.

```bash
cd portfolio-deploy
vercel
```

All static assets, subdirectories, and page themes will be served automatically.
