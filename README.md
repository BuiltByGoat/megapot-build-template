# megapot.build

Site factory for the **Megapot Network**. Help builders ship Megapot-powered
marketing sites, send players to the daily drawing, and keep attribution
**off the public page**.

This repository is the megapot.build lineage of the old jackpot-site template.
The HTML template library it reuses is
[BuiltByGoat/megapot-templates](https://github.com/BuiltByGoat/megapot-templates).

## What you get

- A factory landing that explains the product without secrets
- A **marketing shell** you can preview at `/templates/marketing` and deploy as
  its own Cloudflare Pages project (`templates/marketing/`)
- A `/go` hop: public markup links there; a Pages Function reads a private env
  name and 302s
- cribble tokens (dark, green / ember / ice) shared by the factory and the starter

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

- Factory landing: `/`
- Marketing preview: `/templates/marketing`
- `/go` in `next dev` is a static fallback (no private env). It points at the
  public Megapot origin and tells you to bind the Function on Pages.

```bash
pnpm check    # lint + types + redirect tests + privacy scan
pnpm build    # static export → out/  (Cloudflare Pages output)
```

## Private env names

| Name | Public? | Role |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_NAME` | yes (label) | Factory title. Safe. Not attribution. |
| `MEGAPOT_PLAY_DESTINATION` | **no** | Absolute URL the `/go` Function redirects to. Empty → public Megapot origin. `/go` always appends factory UTMs on the Location. |
| `MEGAPOT_REFERRER_ADDRESS` | **no** | Reserved for a future on-chain app template. Unused by the marketing shell. |
| `MEGAPOT_API_KEY` | **no** | Reserved for server-side Data API reads. Never prefix with `NEXT_PUBLIC_`. |

See [`.env.example`](./.env.example). Do not put values in git.

## Hostname UTMs

Play, dashboard, and results hrefs — and every `/go` 302 — set:

- `utm_source=megapot.build`
- `utm_medium=builder`
- `utm_campaign=build-factory-v1`

These are campaign params, not referral codes. Do not add wallets or invite paths to public markup.

## Deploy shape (Cloudflare Pages)

Target: the operator's personal Cloudflare account. GitHub stays
`BuiltByGoat/megapot-build-template`.

### Factory (this repo root)

1. New Pages project → connect this GitHub repo.
2. Framework: **None** (or Next.js static). Build command: `pnpm install && pnpm build`. Output directory: `out`.
3. Pages will pick up `functions/go.ts` as `GET /go`.
4. Settings → Environment variables → set `MEGAPOT_PLAY_DESTINATION` (and the other names if you need them later). Encrypt / keep them out of logs.
5. Deploy. View-source the landing and the marketing preview: you should see `/go`, not the destination.

### Marketing starter only

Point a Pages project at `templates/marketing` (no build; output `/`). Same
Function + same env names. Details in
[`templates/marketing/README.md`](./templates/marketing/README.md).

## Customize

- Factory copy: `src/components/FactoryLanding.tsx`
- Tokens: `src/styles/cribble.css` (factory) and `templates/marketing/cribble.css` (starter)
- Official Megapot origins: `src/lib/site.ts`

Older Formal / Fun / Degen / Daily HTML lives in
[megapot-templates](https://github.com/BuiltByGoat/megapot-templates). Those
files still use an invite placeholder — do not paste that token into this
factory's public UI.

## License

MIT — see [`LICENSE`](./LICENSE).

## Disclaimer

Independent factory, not Megapot. 18+. Full text in
[`docs/DISCLAIMER.md`](./docs/DISCLAIMER.md).
