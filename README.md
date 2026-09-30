# P J Tivin Elvis — Portfolio

A unified, high-performance portfolio featuring bespoke typography powered by the **Sentient** font suite, WebGL Volumetric Light Rays, deep obsidian contrast, and modular architecture.

---

## 📁 Architecture & File Structure

```text
portfolio-deploy/
├── index.html                   ← Primary production entry point
├── vercel.json                  ← Vercel deployment configuration
├── README.md                    ← Project documentation
├── profile.png                  ← Profile portrait
│
├── assets/
│   ├── css/
│   │   ├── variables.css        ← Design tokens (deep obsidian, off-white text, crimson & gold accents)
│   │   ├── sentient.css         ← Sentient typography definitions & responsive font scale
│   │   ├── base.css             ← Reset, background aura & base styles
│   │   ├── components.css       ← Component styles (nav, hero, cards, forms, grid)
│   │   ├── light-rays.css       ← WebGL volumetric light rays container & toggle styles
│   │   └── style.css            ← Master stylesheet bundle
│   │
│   ├── fonts/                   ← Local Sentient font suite (WOFF2, WOFF, TTF, Variable)
│   │
│   └── js/
│       ├── light-rays.js        ← WebGL volumetric light rays shader engine
│       └── main.js              ← Navbar scroll, smooth navigation & Light Rays control
│
└── sections/                    ← Modular HTML sections
    ├── navbar.html              ← Sticky glass header & navigation
    ├── hero.html                ← Headline, bio, interactive toggle & portrait stage
    ├── about.html               ← Narrative, metrics & educational background
    ├── skills.html              ← Technical skill categories & pill tags
    ├── projects.html            ← Featured projects grid (Deep Learning, Vision, Engineering, Analytics)
    ├── contact.html             ← Direct email & contact actions
    └── footer.html              ← Site credits
```

---

## ✨ Features & Design System

- **Sentient Typography**: Premium serif display typography paired with *Plus Jakarta Sans* for clean, modern readability.
- **Deep Obsidian Noir Palette**: High-contrast dark theme with `#0c0b0a` obsidian base, `#181716` card layers, `#ffffff` pure white headings, and `#faf7f2` luminous off-white body copy.
- **WebGL Volumetric Light Rays**: Interactive shader-driven light ray effect on the hero stage with mouse influence and an interactive toggle button.
- **Native Precision Cursor**: Standard browser cursor for clean, responsive desktop and mobile interaction.
- **Responsive Layout**: Designed for mobile, tablet, and widescreen monitors with CSS Grid and Flexbox.

---

## 🚀 Running Locally

```bash
# Start a simple local server
python -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080) in your browser.
