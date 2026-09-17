# megapot.build

Launch factory for the Megapot Network cloneable:
[BuiltByGoat/network-site-template](https://github.com/BuiltByGoat/network-site-template)
(`main`).

Anyone can ship a **player** marketing site — or follow the ticket-selling
how-to — in two steps. This repo is the hub. It is **not** the site you clone.
Public copy on clones sells play; your referral stays in private host env
(`MEGAPOT_PLAY_DESTINATION`).

Live player-shell preview: [network-site-template.pages.dev](https://network-site-template.pages.dev).

## Two steps

1. **Get your referral code** — register / open the [Megapot dashboard](https://megapot.io/dashboard)
   and create an 8-character code (format hint `ABCD1234`, never a live sample).
   That code attributes play from the site you launch.
2. **Choose what to launch**
   - **Marketing site (primary)** — player shell. Enter the code before Launch.
     [Cloudflare Pages](https://deploy.workers.cloudflare.com/?url=https://github.com/BuiltByGoat/network-site-template)
     is recommended; [Vercel](https://vercel.com/new/clone?repository-url=https://github.com/BuiltByGoat/network-site-template)
     is secondary. Deeplinks inject `MEGAPOT_PLAY_DESTINATION` into private env
     (hosted play URL path `/r/{CODE}`). Also: open the GitHub template after
     the code is valid, then connect GitHub → set env names → deploy → smoke `/go`.
   - **Ticket-selling site** — how-to only (no one-click dump). See
     [docs/LAUNCH.md](./docs/LAUNCH.md). Reading it does not require a code;
     create one before you go live.

Cribble tokens only (`#000` / `#02fe01` / `#ff6a1a` / `#9bdcf5`).

Factory Play (`/go`) is a secondary “Play Megapot” hop. It does not compete
with Launch.

## Privacy

Never display on a public page, footer, README badge, or marketing copy:

- Referral codes (format hint `ABCD1234` is allowed)
- Wallet addresses
- API tokens or other secrets
- `MEGAPOT_PLAY_DESTINATION` **values**

Document **names** only. Values live on the host (Cloudflare Pages env) or in
an uncommitted `.env.local`.

## Run locally

Requires Node 20.19+ and [pnpm](https://pnpm.io). `.nvmrc` pins 22 for Pages.

```bash
pnpm install
cp .env.example .env.local   # names only — leave values empty
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

`/go` is a Cloudflare Pages Function (`functions/go.js` +
`functions/go/index.js`). `next dev` does not invoke it. After `pnpm build`,
`pnpm preview` (`wrangler pages dev out`) is the local 302.

```bash
pnpm check    # lint + types + tests + privacy + UTMs + live /go 302 + SEO/IA
pnpm build    # static export → out/  (writes out/_routes.json + out/_worker.js)
pnpm preview  # wrangler pages dev out — Function-win /go
```

`pnpm build` sets `SITE_HOSTNAME=megapot.build` unless the environment already
has `SITE_HOSTNAME`. That is required so static dashboard / results / hub hrefs
include `utm_source=megapot.build`.

## Private env names

| Name | Public? | Role |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_NAME` | yes (label) | Title is `Build on Megapot \| {SITE_NAME}`. Safe. Not attribution. |
| `SITE_HOSTNAME` | **no** | Required for HTML UTMs. Factory Pages project must set `megapot.build`. |
| `MEGAPOT_SITE_HOSTNAME` | **no** | Alias of `SITE_HOSTNAME`. |
| `MEGAPOT_UTM_SOURCE` | **no** | Optional explicit `utm_source` if hostname envs are unset. |
| `MEGAPOT_UTM_MEDIUM` | **no** | `utm_medium` override (factory default `builder`). |
| `MEGAPOT_UTM_CAMPAIGN` | **no** | `utm_campaign` override (factory default `build-factory-v1`). |
| `MEGAPOT_PLAY_DESTINATION` | **no** | Absolute URL the `/go` Function redirects to. On a clone: hosted `/r/{CODE}` play URL. Empty → public Megapot origin. |
| `MEGAPOT_REFERRER_ADDRESS` | **no** | Reserved. Unused by the cloneable v1 shell. |
| `MEGAPOT_API_KEY` | **no** | Reserved for server-side Data API reads. Never prefix with `NEXT_PUBLIC_`. |

See [`.env.example`](./.env.example). Do not put secret values in git.

## Hostname UTMs

`SITE_HOSTNAME` is required for HTML UTMs. `/go` Location uses the same resolver.

Factory (this repo / Pages project `megapot-build`):

- `SITE_HOSTNAME=megapot.build` — required so HTML + Location match
- `utm_medium` default `builder`
- `utm_campaign` default `build-factory-v1`

Clones set their own deploy host. These are campaign params, not referral codes.

Play is intent. Dashboard is the door to create a referral code — not a Play
signup flow. Latest results stay a public look-up.

## Pages project (Cloudflare)

Existing project name: **`megapot-build`** (personal Cloudflare account).
GitHub stays `BuiltByGoat/megapot-build-template`.

1. Keep the `megapot-build` Pages project. Prefer Git integration. A dashboard
   zip of `out/` alone used to drop `functions/`; `pnpm build` now writes
   `out/_worker.js` so that path 302s too. Still prefer Git so env + Functions
   stay together.
2. Framework: **None** or **Next.js (Static HTML Export)** — never Next.js SSR
   / `@cloudflare/next-on-pages`. Build command: `pnpm install && pnpm build`.
   Output directory: `out`.
3. Node 22 (see `.nvmrc`). `pnpm build` / `pnpm check` also run on Node 20.19.
4. `wrangler.toml` must keep `compatibility_date` plus `pages_build_output_dir = "out"`.
   Without the date, Wrangler ships static `out/` (Next `404.html`) and GET `/go`
   is a 404 instead of a Function 302. `functions/go.js` is `GET /go`;
   `functions/go/index.js` is `GET /go/`. `out/_routes.json` includes `/*` and
   excludes only real static assets. Never exclude `/go`.
5. Settings → Variables and Secrets → set `SITE_HOSTNAME=megapot.build` and
   `MEGAPOT_PLAY_DESTINATION` (Production **and** Preview). Encrypt the
   destination / keep it out of logs. `wrangler.toml` `[vars]` also sets
   `SITE_HOSTNAME` for local `pages dev`. Do not add `account_id`. Do not put
   the destination in git.
6. After DomainManager redeploys, smoke on **pages.dev first** (not DNS):
   `curl -sI https://megapot-build.pages.dev/go` and `/go/` must be **HTTP 302**
   with `Location` containing `utm_source=megapot.build`, `utm_medium=builder`,
   `utm_campaign=build-factory-v1` (unless those names are overridden in env).
   A 404 HTML title `404: This page could not be found.` means the Function
   still did not win. View-source the landing: `/go`, never the destination.

Custom-domain / apex attachment is DomainManager only. This README does not
treat an apex hostname as live. Do not change NS/DNS for this fix.

To ship a **player site**, use the two-step flow on megapot.build (or clone
[network-site-template](https://github.com/BuiltByGoat/network-site-template)
directly). The clone’s public homepage should sell play, not advertise
builders. Bind the play destination in private env.

## Customize

- Factory copy: `src/components/FactoryLanding.tsx`
- Marketing launch gate: `src/components/MarketingLaunch.tsx`
- Launch contract: [`docs/LAUNCH.md`](./docs/LAUNCH.md)
- Tokens: `src/styles/cribble.css`
- Official origins: `src/lib/origin.ts`

## License

MIT — see [`LICENSE`](./LICENSE).

## Disclaimer

Independent factory, not Megapot. 18+. Full text in
[`docs/DISCLAIMER.md`](./docs/DISCLAIMER.md).
