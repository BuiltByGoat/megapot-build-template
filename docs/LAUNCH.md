# Launch a Megapot site

megapot.build is the **launch factory**. Anyone can ship a player-facing
marketing site, or follow the ticket-selling how-to, in two steps.

This is not the player homepage. Clones come from
[BuiltByGoat/network-site-template](https://github.com/BuiltByGoat/network-site-template).

## Step 1 — Get your referral code

1. Open the Megapot dashboard (factory CTA uses `utm_source=megapot.build`,
   `utm_medium=builder`, `utm_campaign=build-factory-v1`).
2. Register if needed, then create your referral code. **8 characters** for
   everyone (letters and numbers). Format hint: `ABCD1234` — never a live code.
3. That code attributes play from the site you launch. It does not belong on
   public pages.

## Step 2 — Choose what to launch

### A) Marketing site (primary)

Player marketing shell from `network-site-template`. Launch / Deploy stay
disabled until the 8-character code is valid.

**Hosts**

- **Cloudflare Pages (recommended)** — Deploy-to-Cloudflare button at
  `https://deploy.workers.cloudflare.com/?url=https://github.com/BuiltByGoat/network-site-template`
- **Vercel (secondary)** —
  `https://vercel.com/new/clone?repository-url=https://github.com/BuiltByGoat/network-site-template`
  with env names `MEGAPOT_PLAY_DESTINATION`, `SITE_HOSTNAME`. The factory
  injects `MEGAPOT_PLAY_DESTINATION` on the clone URL when the code is valid.
  Fill `SITE_HOSTNAME` on the host (the hostname of the site you are launching).

**Private env (names only)**

| Name | Role |
| --- | --- |
| `MEGAPOT_PLAY_DESTINATION` | Absolute Play URL, including referral: hosted path `/r/{CODE}` |
| `SITE_HOSTNAME` | Public hostname of the clone; stamps HTML + `/go` UTMs |

Do not put values in git, README badges, or public HTML.

**Open template**

GitHub template flow still requires the code first. Then: connect GitHub →
set the env names on the host → deploy → smoke `/go`.

**Smoke**

```bash
curl -sI https://YOUR_DOMAIN/go
curl -sI https://YOUR_DOMAIN/go/
# Both must be HTTP 302
```

### B) Ticket-selling site

Not a one-click template. Read:

- [Start here](https://docs.megapot.io/build-on-megapot/start-here)
- [Add the jackpot to your site](https://docs.megapot.io/build-on-megapot/add-to-your-site)
- [llms.megapot.io](https://llms.megapot.io) for agents
- Megapot dashboard (same Step 1 door)

No referral-code gate to read the how-to. Create the code before you go live.

## Factory `/go`

This factory’s Play link is a secondary hop (`/go` → 302). It must not compete
with Launch. Never add a Next `app/go` page or a static `/go` 200.

## Privacy

No wallets, no live referral codes, no `MEGAPOT_PLAY_DESTINATION` values in
public HTML, README footers, or marketing copy. Env **names** only.
