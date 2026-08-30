# Handbook website (GitHub Pages)

Static UI to browse [cursor-handbook](https://github.com/girijashankarj/cursor-handbook) components: search, filter by type and role, copy paths, and open GitHub or raw files.

## Develop locally

```bash
cd website
npm install
npm run dev
```

`predev` regenerates `public/components.json` and `public/guide.json` before the dev server starts.

## Production build

```bash
cd website && npm run build
```

Optional env vars for deploy-safe builds:

- `VITE_BASE_PATH` (example: `/cursor-handbook/`, `/my-fork-name/`)
- `VITE_SITE_URL` (example: `https://user.github.io/repo`)

Output: `website/dist/`. Deployed by [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) to `https://girijashankarj.github.io/cursor-handbook/` when GitHub Pages uses the **GitHub Actions** source.
