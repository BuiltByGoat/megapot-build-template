# megapot.build

Factory / explainer for the **Megapot Network** cloneable:
[BuiltByGoat/network-site-template](https://github.com/BuiltByGoat/network-site-template).

This repo is the builder hub. It is **not** the site you clone. It does **not**
ship the old `megapot-templates` HTML kits.

Live template preview: [network-site-template.pages.dev](https://network-site-template.pages.dev).

## What you get

- A factory landing that explains: clone the template → set `SITE_HOSTNAME` +
  `MEGAPOT_PLAY_DESTINATION` (private) → Cloudflare Pages deploy
- A `/go` hop on this hub: public markup links there; a Pages Function reads
  a private env name and 302s
- cribble tokens (dark, green / ember / ice)

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

## Private env names

| Name | Public? | Role |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_NAME` | yes (label) | Title is `Build on Megapot \| {SITE_NAME}`. Safe. Not attribution. |
| `SITE_HOSTNAME` | **no** | Deploy host. Becomes hostname-style `utm_source`. |
| `MEGAPOT_SITE_HOSTNAME` | **no** | Alias of `SITE_HOSTNAME`. |
| `MEGAPOT_UTM_SOURCE` | **no** | Optional explicit `utm_source` if hostname envs are unset. |
| `MEGAPOT_UTM_MEDIUM` | **no** | `utm_medium` override (factory default `builder`). |
| `MEGAPOT_UTM_CAMPAIGN` | **no** | `utm_campaign` override (factory default `build-factory-v1`). |
| `MEGAPOT_PLAY_DESTINATION` | **no** | Absolute URL the `/go` Function redirects to. Empty → public Megapot origin. |
| `MEGAPOT_REFERRER_ADDRESS` | **no** | Reserved. Unused by the cloneable v1 shell. |
| `MEGAPOT_API_KEY` | **no** | Reserved for server-side Data API reads. Never prefix with `NEXT_PUBLIC_`. |

See [`.env.example`](./.env.example). Do not put values in git.

## Hostname UTMs

`/go` and outbound dashboard / results / hub hrefs resolve:

- `utm_source` from `SITE_HOSTNAME` (scheme / `www.` stripped), else the factory
  default `megapot.build`
- `utm_medium` from `MEGAPOT_UTM_MEDIUM`, else `builder`
- `utm_campaign` from `MEGAPOT_UTM_CAMPAIGN`, else `build-factory-v1`

When `SITE_HOSTNAME` is set at build time, static dashboard / results / hub
hrefs stamp the same `utm_source` as the Function. These are campaign params,
not referral codes.

## Deploy shape (Cloudflare Pages)

Target: the operator's personal Cloudflare account. GitHub stays
`BuiltByGoat/megapot-build-template`. Do not flip megapot.build DNS from this
repo — DomainManager only.

1. New Pages project → connect this GitHub repo (Git integration, not a lone
   `out/` upload — Functions live in `functions/`).
2. Framework: **None** (or Next.js static). Build command: `pnpm install && pnpm build`. Output directory: `out`.
3. Node 22 (see `.nvmrc`).
4. Pages picks up `functions/go.js` as `GET /go` and `functions/go/index.js` as
   `GET /go/`. `out/_routes.json` includes `/*` and excludes only real static
   assets. Never exclude `/go`.
5. Settings → Variables and Secrets → set `SITE_HOSTNAME` and
   `MEGAPOT_PLAY_DESTINATION`. Encrypt / keep them out of logs.
6. Deploy. View-source the landing: you should see `/go`, not the destination.

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
