# AgentEval — Landing Page

Static landing page for AgentEval. Pure HTML/CSS, no build step, no dependencies — deploys as-is on Vercel.

## Structure

```
index.html      — homepage (nav to the 5 sections)
problem.html    — "The Problem" (final content)
prd.html        — "PRD" (placeholder — content pending)
demo.html       — "Live Demo" (placeholder — content pending)
research.html   — "Research" (placeholder — content pending)
about.html      — "About Me" (placeholder — content pending)
```

## Deploy on Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial AgentEval landing page"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import the GitHub repo you just pushed
   - Framework preset: **Other** (no build command needed — it's static HTML)
   - Leave Build Command / Output Directory empty
   - Click **Deploy**

That's it — Vercel serves static HTML files with zero configuration.
