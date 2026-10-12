# CellQuest

Interactive high-school cell biology labs: osmosis, enzymes, and selective membranes.

## Stack

- React + TypeScript + Vite
- localStorage progress (saved on this device)
- No auth, database, or paid services

## Run locally

```bash
npm install
npm run dev
```

Dev server: [http://127.0.0.1:4731](http://127.0.0.1:4731)

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite on port 4731 |
| `npm run build` | Typecheck + production build |
| `npm run typecheck` | TypeScript project build check |
| `npm run lint` | Oxlint |
| `npm test` | Focused simulation & persistence tests |

## What you can do

1. **Home** — hero cell with clickable organelles; enter a lab in two clicks
2. **Experiments** — filter the three complete labs by topic
3. **Interactive lab** — Learn → Predict → Experiment → Explain → Reflect
4. **My Learning** — progress, concepts, notes (device-local)
5. **About the Models** — assumptions, relative units, references

## Model notes

Simulations use relative units and labeled simplifications. CellQuest is an educational tool — not medical advice and not a research simulator.
