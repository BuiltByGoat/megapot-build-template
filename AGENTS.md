# AGENTS guide

This repo is **megapot.build** — a Megapot Network site factory. It is the
lineage of the old jackpot-site template, rewritten as a landing + starter
path. Protocol skills still live at [llms.megapot.io](https://llms.megapot.io).
The HTML template library is
[BuiltByGoat/megapot-templates](https://github.com/BuiltByGoat/megapot-templates).

## Privacy

Never put referral codes, wallet addresses, or API tokens in public pages,
footers, README badges, or marketing copy. Document env **names** only.
Public play buttons go to `/go`. The host binds `MEGAPOT_PLAY_DESTINATION`.
`/go` and Play/dashboard hrefs always set factory UTMs (`utm_source=megapot.build`,
`utm_medium=builder`, `utm_campaign=build-factory-v1`). Cribble SoT accents:
`#000` / `#02fe01` / `#ff6a1a` / `#9bdcf5`.

## Layout

| Path | Purpose |
| --- | --- |
| `app/` | Next.js factory (landing, preview chrome, `/go` static fallback) |
| `src/components` | Factory chrome |
| `src/lib/play-redirect.ts` | Shared destination resolver (tests) |
| `functions/go.ts` | Cloudflare Pages Function for the factory |
| `templates/marketing/` | Standalone Cloudflare Pages starter |
| `scripts/check-privacy.mjs` | Scan for leaked addresses / invite tokens |

## Convention

Files in `src/` keep a short JSDoc header (`@customize`, plus `@skill` /
`@endpoint` when a file touches protocol docs or the Data API).

## See also

- [`README.md`](./README.md) — local run + Cloudflare Pages
- [`templates/marketing/README.md`](./templates/marketing/README.md) — starter deploy
- [`docs/DISCLAIMER.md`](./docs/DISCLAIMER.md)
