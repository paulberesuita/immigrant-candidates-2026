# Latino Leaders 2026

A simple website that highlights young Latino candidates running for office in 2026.

- The **frontend** is plain `index.html` + `styles.css` + `script.js`.
- The **backend** is a Cloudflare **Pages Function** (`functions/api/candidates.js`) that reads from a Cloudflare **D1 database**.
- The UI fetches candidates from `GET /api/candidates` and renders the cards + modal.

## Why Cloudflare / why Functions / why deploy (simple)
- **Why Cloudflare Pages**: it hosts your static website files on Cloudflare’s global network so the site loads fast and is easy to publish.
- **Why Functions**: the candidate data lives in a database (D1). Your browser can’t query D1 directly, so a **server-side endpoint** is needed. Pages Functions provide that endpoint (like `GET /api/candidates`).
- **Why deploy**: deploying uploads your latest files + Functions to Cloudflare. Until you deploy, the public site is still running the previous version.

## How it works (simple)
1. The browser loads the static site.
2. `script.js` calls `GET /api/candidates`.
3. The Pages Function queries D1 (`DB`) and returns rows from the `candidates` table.
4. The page renders the grid and lets users search/filter + open a details modal.

## The `functions/` folder (what it is + why it’s structured this way)
Cloudflare Pages treats the `functions/` folder as **server-side routes** (API endpoints). The folder/file path becomes the URL path.

- `functions/api/candidates.js` → `GET /api/candidates`
- (In general) `functions/<something>/<file>.js` → `/<something>/<file>`

This structure matters because **the filesystem is the router**: Cloudflare discovers routes based on where the file lives under `functions/`.

## Easiest way to test (recommended)
If you want the simplest, least confusing workflow (and you want to use the **real D1 database**):

1) Install dependencies:

```bash
pnpm install
```

2) Deploy:

```bash
pnpm deploy
```

3) Open the deployed URL that Wrangler prints (it will look like `https://<hash>.latino-leaders-2026.pages.dev`).

That deployed site uses **Cloudflare Pages + Functions + your remote D1 binding**, exactly like production.

## Optional: run locally (UI + API, port 3000)
Use this only if you specifically want to develop locally.

```bash
pnpm dev
```

Then open `http://localhost:3000`.

> Note: local mode uses a **local** D1 database. If you haven’t created/seeded it yet, `/api/candidates` may return an empty list or a DB error.

## D1 database setup
This project expects a D1 database bound as **`DB`**.

- **Binding name**: `DB`
- **Table expected**: `candidates` (queried by the API)

### Cloudflare Dashboard binding
See `DEPLOYMENT_NOTES.md` for the exact steps to bind the D1 database in the Cloudflare Pages dashboard.

### Local D1 (only if you choose to run locally)
If you want local dev to show candidates, you need a local D1 database with a `candidates` table.
The exact schema/seed data is up to you, but the key idea is: **create the table and insert rows** into local D1.

## API
- **Endpoint**: `GET /api/candidates`
- **Code**: `functions/api/candidates.js`
- **Response**: JSON array of candidates (rows from D1)

## Deploy
```bash
pnpm deploy
```

This runs:
- `wrangler pages deploy . --project-name latino-leaders-2026`

## Project layout
- `index.html`: page markup
- `styles.css`: styling
- `script.js`: UI logic (fetch/render/filter/modal)
- `functions/api/candidates.js`: Pages Function that queries D1
- `wrangler.toml`: Pages + D1 binding config for Wrangler