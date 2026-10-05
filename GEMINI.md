# Project Rules & Workflow

## Automatic Git Push on Changes
- **CRITICAL REQUIREMENT**: After making any code, style, or asset changes, **ALWAYS** automatically stage, commit with a descriptive message, and push the changes to GitHub (`git add -A; git commit -m "..."; git push origin main`).
- Never wait for the user to prompt for a Git commit or push. The push triggers the automatic Vercel production deployment pipeline.
