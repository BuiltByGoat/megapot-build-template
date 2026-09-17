# AGENTS guide

This repo is **megapot.build** — the **developer** factory / explainer.
Builders clone [BuiltByGoat/network-site-template](https://github.com/BuiltByGoat/network-site-template)
(`main`), not this repo. Clones ship a **player** marketing shell; public
copy sells play; attribution stays in private env. IA: picker → configure →
deploy. Cribble only. Protocol skills still live at
[llms.megapot.io](https://llms.megapot.io).

## Privacy

Never put referral codes, wallet addresses, or API tokens in public pages,
footers, README badges, or marketing copy. Document env **names** only.
Public play buttons go to `/go`. The host binds `MEGAPOT_PLAY_DESTINATION`.
`SITE_HOSTNAME` is required for HTML UTMs. Factory Pages project
`megapot-build` must set `SITE_HOSTNAME=megapot.build` so HTML + `/go`
Location match. Medium / campaign defaults: `builder` / `build-factory-v1`.
Cribble SoT: `#000` / `#02fe01` / `#ff6a1a` / `#9bdcf5`.

Play is intent. Do not frame dashboard as signup.

## Layout

| Path | Purpose |
| --- | --- |
| `app/` | Next.js factory (landing, disclaimer) |
| `src/components` | Factory chrome (picker → configure → deploy) |
| `src/lib/play-redirect.ts` | Shared destination resolver (tests) |
| `src/lib/utms.ts` | Hostname UTM resolver (`SITE_HOSTNAME` required for source) |
| `src/lib/seo.ts` | Canonical host, IA steps, robots/sitemap policy |
| `functions/go.js` | Cloudflare Pages Function for `/go` |
| `functions/go/index.js` | Same handler for trailing-slash `/go/` |
| `wrangler.toml` | Pages project name `megapot-build`; `[vars] SITE_HOSTNAME`; no `account_id` |
| `scripts/write-pages-routes.ts` | Writes `out/_worker.js` + `out/_routes.json` (`include: ["/*"]`, static excludes) |
| `scripts/check-privacy.mjs` | Scan for leaked addresses / invite tokens |

Do not add `functions/go.ts` or a Next.js `app/go` page. A static `/go` 200
wins over the Function. `out/_worker.js` is required so Direct Upload of
`out/` still 302s. Do not publish apex DNS steps.

## Convention

Files in `src/` keep a short JSDoc header (`@customize`, plus `@skill` /
`@endpoint` when a file touches protocol docs or the Data API).

## See also

- [`README.md`](./README.md) — local run + Pages project `megapot-build`
- [network-site-template](https://github.com/BuiltByGoat/network-site-template) — the cloneable
- [`docs/DISCLAIMER.md`](./docs/DISCLAIMER.md)
