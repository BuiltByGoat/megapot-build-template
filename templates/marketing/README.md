# Marketing shell

A Cloudflare Pages starter for a Megapot marketing site. Lineage:
the Formal template in [BuiltByGoat/megapot-templates](https://github.com/BuiltByGoat/megapot-templates)
— same honest explainer, cribble dark tokens, and **no invite URL in the HTML**.

## Public surface

Play buttons are `<a href="/go">`. That path is a Pages Function. The
function reads `MEGAPOT_PLAY_DESTINATION` from the host environment and
302s, appending factory UTMs (`utm_source=megapot.build`,
`utm_medium=builder`, `utm_campaign=build-factory-v1`). If the name is
unset, visitors go to the public Megapot origin with the same UTMs.

Direct Play / results hrefs on this page carry the same UTMs. They are
campaign params, not referral codes.

Do not put referral codes, wallets, or API tokens in `index.html`, the
footer, or this README's badges.

## Local

This folder is static. Open `index.html` in a browser, or from the factory
repo run `pnpm dev` and visit `/templates/marketing`.

`/go` only redirects when a Pages Function is bound (`wrangler pages dev`
from this folder, or the factory's `functions/go.ts` on a Pages project).

## Deploy to Cloudflare Pages

1. Create a Pages project from this directory (or from the factory repo
   with root `templates/marketing`).
2. Build command: none. Output directory: `/` (this folder).
3. In Settings → Environment variables, set the **names** below. Values
   stay on the account — they are not in git.

| Name | Required | Role |
| --- | --- | --- |
| `MEGAPOT_PLAY_DESTINATION` | for credited traffic | Absolute URL `/go` redirects to |
| `MEGAPOT_REFERRER_ADDRESS` | no | Reserved; unused by this shell |
| `MEGAPOT_API_KEY` | no | Reserved; unused by this shell |

4. Deploy. Confirm page source contains `/go` and does not contain your
   destination URL.

## Customize

- Site voice and sections: `index.html`
- Tokens (green / ember / ice): `cribble.css`
- Redirect logic: `functions/go.ts`
