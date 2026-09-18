# AGENTS guide

This repo is **megapot.build** — the **launch factory** for
[https://megapot.build](https://megapot.build). Anyone (not only developers)
can ship a Megapot marketing or ticket site in two steps. Builders clone
[BuiltByGoat/network-site-template](https://github.com/BuiltByGoat/network-site-template)
(`main`), not this repo. Clones ship a **player** marketing shell; public
copy sells play; attribution stays in private env. Cribble only. Protocol
skills still live at [llms.megapot.io](https://llms.megapot.io).

## Two-step IA

1. **Get your referral code** — register / open the Megapot dashboard
   (`https://megapot.io/dashboard` with factory UTMs) and create an
   8-character code. It attributes play from the site they launch. Never
   display a real code (no DomainManager samples). Format hint `ABCD1234` only.
2. **Choose what to launch**
   - **Marketing site (primary, referral-gated):** cloneable player shell.
     Launch stays disabled until the code is 8 alphanumeric characters.
     Recommended host: **Cloudflare Pages**. Secondary: Vercel. Deeplinks
     inject `MEGAPOT_PLAY_DESTINATION` (hosted play URL `https://megapot.io/r/{CODE}`)
     into **private env**, never public HTML. Also: open-template path +
     non-dev checklist (GitHub → env names → deploy → `curl -sI /go` = 302).
   - **Ticket-selling site:** how-to only (no one-click dump). Docs +
     [llms.megapot.io](https://llms.megapot.io). No code gate to read;
     Step 1 still applies when they go live.

## Privacy

Never put referral codes, wallet addresses, or API tokens in public pages,
footers, README badges, or marketing copy. Document env **names** only.
Public play buttons go to `/go`. The host binds `MEGAPOT_PLAY_DESTINATION`.
`SITE_HOSTNAME` is required for HTML UTMs. Factory Pages project
`megapot-build` must set `SITE_HOSTNAME=megapot.build` so HTML + `/go`
Location match. Medium / campaign defaults: `builder` / `build-factory-v1`.
Cribble SoT: `#000` / `#02fe01` / `#ff6a1a` / `#9bdcf5`.

Play is intent. Do not frame dashboard as signup. Dashboard is the door
to create a referral code.

## Layout

| Path | Purpose |
| --- | --- |
| `app/` | Next.js factory (landing, disclaimer) |
| `src/components` | Factory chrome (referral → launch) |
| `src/lib/referral.ts` | 8-char code gate + `/r/{CODE}` play destination |
| `src/lib/deploy.ts` | Cloudflare / Vercel / GitHub template deeplinks |
| `src/lib/play-redirect.ts` | Shared destination resolver (tests) |
| `src/lib/utms.ts` | Hostname UTM resolver (`SITE_HOSTNAME` required for source) |
| `src/lib/seo.ts` | Canonical host, IA steps, robots/sitemap policy |
| `functions/go.js` | Cloudflare Pages Function for `/go` |
| `functions/go/index.js` | Same handler for trailing-slash `/go/` |
| `wrangler.toml` | Pages project name `megapot-build`; `compatibility_date`; `[vars] SITE_HOSTNAME`; `[[analytics_engine_datasets]]` `GO_HITS` / `network_go_hits`; no `account_id` |
| `scripts/write-pages-routes.ts` | Writes `out/_routes.json` (`include: ["/*"]`, static excludes) + `out/_worker.js` |
| `scripts/check-privacy.mjs` | Scan for leaked addresses / invite tokens |
| `docs/LAUNCH.md` | Human + agent launch contract |

Do not add `functions/go.ts` or a Next.js `app/go` page. A static `/go` 200
wins over the Function. Do not publish apex DNS steps.

## Convention

Files in `src/` keep a short JSDoc header (`@customize`, plus `@skill` /
`@endpoint` when a file touches protocol docs or the Data API).

## See also

- [`README.md`](./README.md) — local run + Pages project `megapot-build`
- [`docs/LAUNCH.md`](./docs/LAUNCH.md) — two-step launch
- [network-site-template](https://github.com/BuiltByGoat/network-site-template) — the cloneable
- [`docs/DISCLAIMER.md`](./docs/DISCLAIMER.md)
