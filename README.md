# AgentEval — landing site

The static marketing / documentation site for **AgentEval**, an automated QA platform
for AI agents based on the LLM-as-a-Judge principle. Hand-written HTML + CSS + a little
vanilla JavaScript. No framework, no build step, no dependencies.

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

The **Live Demo** and **GitHub** cards on the home page link out to the interactive demo
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

## Design system

`CLAUDE.md` is the visual guide the site is built against — palette (a soft lavender-pastel),
typography (Archivo / IBM Plex Sans Hebrew / IBM Plex Mono), spacing scale, shadow and shape
rules, and RTL conventions.

## Local development

No tooling required — open `index.html` in a browser, or serve the folder:

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
