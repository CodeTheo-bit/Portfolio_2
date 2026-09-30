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
│   │   ├── variables.css        ← Design tokens (rich black, off-white text, crimson & lavender accents)
│   │   ├── sentient.css         ← Sentient typography definitions & responsive font scale
│   │   ├── base.css             ← Reset & base styles
│   │   ├── components.css       ← Component styles (nav, hero, cards, forms, grid)
│   │   ├── ferrofluid.css       ← Full-page fixed Ferrofluid canvas styling
│   │   └── style.css            ← Master stylesheet bundle
│   │
│   ├── fonts/                   ← Local Sentient font suite (WOFF2, WOFF, TTF, Variable)
│   │
│   └── js/
│       ├── ferrofluid.js        ← React Bits Ferrofluid WebGL shader engine
│       └── main.js              ← Navbar scroll, smooth navigation & Ferrofluid initialization
│
└── sections/                    ← Modular HTML sections
    ├── navbar.html              ← Sticky glass header & navigation
    ├── hero.html                ← Headline, bio & portrait stage
    ├── about.html               ← Narrative, metrics & educational background
    ├── skills.html              ← Technical skill categories & pill tags
    ├── projects.html            ← Featured projects grid (Deep Learning, Vision, Engineering, Analytics)
    ├── contact.html             ← Direct email & contact actions
    └── footer.html              ← Site credits
```

---

## ✨ Features & Design System

- **Sentient Typography**: Premium serif display typography paired with *Plus Jakarta Sans* for clean, modern readability.
- **Rich Pitch-Black Background**: Deep `#000000` base with frosted glass cards (`rgba(10, 10, 10, 0.78)`), pure white titles (`#ffffff`), and warm off-white body copy (`#faf7f2`).
- **React Bits Ferrofluid Background**: Full-page procedural magnetic fluid shader with organic liquid contour lines (`#c6b4e5`, `#ffffff`, `#923847`) gently undulating across the entire viewport.
- **Native Precision Cursor**: Standard browser cursor for clean, responsive desktop and mobile interaction.
- **Responsive Layout**: Designed for mobile, tablet, and widescreen monitors with CSS Grid and Flexbox.

---

## 🚀 Running Locally

```bash
# Start a simple local server
python -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080) in your browser.
