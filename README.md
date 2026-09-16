# megapot.build

Factory / explainer for the **Megapot Network** cloneable:
[BuiltByGoat/network-site-template](https://github.com/BuiltByGoat/network-site-template)
(`main`).

This repo is the builder hub. It is **not** the site you clone.

Live template preview: [network-site-template.pages.dev](https://network-site-template.pages.dev).

## IA

1. **Pick** — clone `network-site-template`
2. **Configure** — bind `SITE_HOSTNAME` + `MEGAPOT_PLAY_DESTINATION` (private)
3. **Deploy** — Cloudflare Pages `out/` + Function-win `/go`

Cribble tokens only (`#000` / `#02fe01` / `#ff6a1a` / `#9bdcf5`).

## Privacy

Never display on a public page, footer, README badge, or marketing copy:

- Referral codes
- Wallet addresses
- API tokens or other secrets

Document **names** only. Values live on the host (Cloudflare Pages env) or in
an uncommitted `.env.local`.

## Run locally

Requires Node 22+ and [pnpm](https://pnpm.io).

```bash
pnpm install
cp .env.example .env.local   # names only — leave values empty
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

`/go` is a Cloudflare Pages Function (`functions/go.js` +
`functions/go/index.js`). `next dev` does not invoke it. After `pnpm build`,
preview the Function-win export with `npx wrangler pages dev out` if you need
the 302 locally.

```bash
pnpm check    # lint + types + tests + privacy + UTMs + /go shape
pnpm build    # static export → out/  (writes out/_routes.json)
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
| `MEGAPOT_PLAY_DESTINATION` | **no** | Absolute URL the `/go` Function redirects to. Empty → public Megapot origin. |
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

Play is intent. Dashboard and latest results are public look-ups, not a signup
flow.

## Pages project (Cloudflare)

Existing project name: **`megapot-build`** (personal Cloudflare account).
GitHub stays `BuiltByGoat/megapot-build-template`.

1. Keep the `megapot-build` Pages project. Git integration (not a lone `out/`
   upload — Functions live in `functions/`).
2. Framework: **None** (or Next.js static). Build command: `pnpm install && pnpm build`. Output directory: `out`.
3. Node 22 (see `.nvmrc`).
4. Pages picks up `functions/go.js` as `GET /go` and `functions/go/index.js` as
   `GET /go/`. `out/_routes.json` includes `/*` and excludes only real static
   assets. Never exclude `/go`.
5. Settings → Variables and Secrets → set `SITE_HOSTNAME=megapot.build` and
   `MEGAPOT_PLAY_DESTINATION`. Encrypt private values / keep them out of logs.
   `wrangler.toml` `[vars]` also sets `SITE_HOSTNAME` for local `pages dev`.
   Do not add `account_id`.
6. View-source the landing: you should see `/go`, not the destination.

Custom-domain / apex attachment is DomainManager only. This README does not
treat an apex hostname as live.

To ship a **player site**, clone
[network-site-template](https://github.com/BuiltByGoat/network-site-template)
instead of this factory.

## Customize

- Factory copy: `src/components/FactoryLanding.tsx`
- Tokens: `src/styles/cribble.css`
- Official origins: `src/lib/origin.ts`

## License

MIT — see [`LICENSE`](./LICENSE).

## Disclaimer

Independent factory, not Megapot. 18+. Full text in
[`docs/DISCLAIMER.md`](./docs/DISCLAIMER.md).
