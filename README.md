# Grave of the Fallen Sun

A pure-frontend dark fantasy browser RPG inspired by punishing Soulslike structure and roguelike runs. Explore a cursed dying kingdom through full-screen CSS/SVG illustrated environments, fight telegraphed turn-based battles, collect gear, uncover cryptic item and NPC lore, rest at bonfires, and risk losing dropped souls after death.

## Play locally

```bash
python3 -m http.server 4173
```

Then open <http://127.0.0.1:4173> in a browser.

## Play on the cloud

Yes. The game is a static frontend app, so it can be hosted by any static site provider without a Node server or database. Deploy the repository root and make sure these files are published together:

- `index.html`
- `styles.css`
- `game.js`

Common options:

### GitHub Pages

1. Push this repository to GitHub.
2. Open the repository's **Settings** tab.
3. Go to **Pages**.
4. Set **Source** to **Deploy from a branch**.
5. Choose the branch containing the game and the repository root folder.
6. Save, then open the Pages URL GitHub provides.

### Netlify

1. Create a new Netlify site from this repository.
2. Use the repository root as the publish directory.
3. Leave build command blank.
4. Deploy the site and open the generated Netlify URL.

### Vercel

1. Import this repository into Vercel.
2. Keep the project as a static site.
3. Leave build command blank.
4. Set output directory to `.` if Vercel asks for one.
5. Deploy and open the generated Vercel URL.

### Cloudflare Pages

1. Create a Pages project from this repository.
2. Leave build command blank.
3. Set output directory to `/` or `.` depending on the Cloudflare UI.
4. Deploy and open the generated Pages URL.

## Claude lore integration

The character creation screen accepts an optional Anthropic API key. When provided, the browser calls Claude for:

- hidden item lore descriptions
- cryptic NPC dialogue
- unique death epitaphs

If the API is unavailable or no key is provided, the game falls back to built-in lore so the run remains fully playable offline.

> **Cloud hosting note:** do not hard-code a real Anthropic API key into this public frontend. Browser-side keys can be viewed by players. For a public cloud deployment, either play with the built-in fallback lore or add a small serverless proxy that keeps the API key secret.
