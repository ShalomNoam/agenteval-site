# AgentEval — landing site

The static marketing / documentation site for **AgentEval**, an automated QA platform
for AI agents based on the LLM-as-a-Judge principle. Hand-written HTML + CSS + vanilla
JavaScript, with GSAP and Lenis loaded from a CDN for motion. No framework, no build step,
no `npm install`.

## Live site

**https://agenteval-site.vercel.app**

## Pages

| File | Section | Notes |
| --- | --- | --- |
| `index.html` | Home | Nav to the sections below |
| `problem.html` | The problem | The case for the product, in prose |
| `prd.html` | PRD | Full product-requirements doc, with an inline six-step "core flow" figure |
| `research.html` | Research | Background on LLM-as-a-Judge, with a source link |
| `about.html` | About me | Short bio + LinkedIn |

Shared files:

| File | Role |
| --- | --- |
| `site.css` | All page styles, in one stylesheet |
| `motion.js` | Scroll and motion layer; every tuning value lives in its `MOTION` object |
| `motion.css` | Hides animated elements only while `motion.js` is about to take over |
| `i18n.js` | Hebrew / English switch (see below) |

The **Live Demo** and **GitHub** rows on the home page link out to the interactive demo
(`https://www.clearcard.online`) and to [its repository](https://github.com/ShalomNoam/clearcard).

## Bilingual (Hebrew / English)

Every page ships in Hebrew and carries a fixed top-corner **עב / EN** switch. `i18n.js` does it
with no library:

- Hebrew is the source of truth — it lives in the HTML and is captured from the DOM at load.
- Elements marked `data-i18n="key"` are swapped on toggle. Long prose sections instead carry one
  `data-i18n-scope="<name>"` on their wrapper; the script auto-assigns sequential keys
  (`<name>.b1`, `.b2`, …) to every heading / paragraph / list-item inside, so a page needs only
  one attribute per section.
- Only the English strings are stored (in `i18n.js`); the toggle also flips `<html dir/lang>` and
  persists the choice in `localStorage`.

## Motion

`motion.js` uses GSAP 3.13 (with ScrollTrigger and SplitText) and Lenis 1.3, pinned to exact
versions on jsDelivr. Pages opt in through HTML attributes (`data-intro`, `data-split`,
`data-reveal`, `data-scrub`, `data-parallax`, `data-magnetic`, …) rather than per-page code.

It is progressive enhancement only: content stays fully visible without JavaScript, if the CDN
fails (a 3-second failsafe in each page's `<head>`), and under `prefers-reduced-motion`. Smooth
scrolling and the magnetic hover run on desktop pointers only.

## Design system

`CLAUDE.md` is the visual guide the site is built against — an editorial layout on a soft
lavender-pastel palette, typography (Archivo / IBM Plex Sans Hebrew / IBM Plex Mono), layout
grid, shape rules, the motion hooks, and RTL conventions.

## Local development

No tooling required — serve the folder (opening `index.html` directly also works, but the
motion libraries need a network connection either way):

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy

Deployed on **Vercel** as a plain static site — no build command, no output directory, no config
file in the repo. Pushing to `main` triggers a deploy.

## License

No open-source license has been applied, so the code is under standard copyright (all rights
reserved) by default. It's published as a portfolio project — you're welcome to read through it.
