# P J Tivin Elvis — Portfolio

A luxury, royal-themed interactive portfolio website.

## Project Structure

```
portfolio/
├── index.html      ← Main portfolio (single file, everything included)
├── photo.jpg       ← ADD YOUR PHOTO HERE (optional)
├── vercel.json     ← Vercel deployment config
├── .gitignore
└── README.md
```

## How to Add Your Photo

1. Drop your photo into this folder and name it `photo.jpg`
2. Open `index.html`, find the `div.pph` block and delete it
3. Uncomment the `<img src="photo.jpg" ...>` line just below it

## Customisation (search ✏️ in index.html)

- Your name, tagline, bio
- Skill percentages and descriptions
- Project titles, categories, descriptions, GitHub links
- Email, LinkedIn, GitHub URLs

## Deploy to Vercel

### Option A — Vercel CLI (recommended)
```bash
npm install -g vercel
cd portfolio
vercel
```
Follow the prompts. Your site will be live in ~30 seconds.

### Option B — GitHub + Vercel Dashboard
1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. No build settings needed — Vercel detects static HTML automatically
4. Click Deploy

## Local Preview
Just open `index.html` directly in your browser — no server needed.
