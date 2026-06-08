# Grave of the Fallen Sun

A pure-frontend dark fantasy browser RPG inspired by punishing Soulslike structure and roguelike runs. Explore a cursed dying kingdom, fight telegraphed turn-based battles, collect gear, uncover cryptic item and NPC lore, rest at bonfires, and risk losing dropped souls after death.

## Play locally

```bash
python3 -m http.server 4173
```

Then open <http://127.0.0.1:4173> in a browser.

## Claude lore integration

The character creation screen accepts an optional Anthropic API key. When provided, the browser calls Claude for:

- hidden item lore descriptions
- cryptic NPC dialogue
- unique death epitaphs

If the API is unavailable or no key is provided, the game falls back to built-in lore so the run remains fully playable offline.
