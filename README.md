# Megapot Jackpot Site

Deploy your own white-label Megapot jackpot site — a working, forkable
frontend for the Megapot on-chain lottery. Set one wallet address and ship.

- USDC-denominated on Base — mainnet (chain ID 8453) or Sepolia (84532)
- React 19 + wagmi v2 + Vite 6 + Tailwind v3 — zero backend required
- Your site earns a fee on every ticket bought and every winning claimed
  through it — paid on-chain to your wallet

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/BuiltByGoat/megapot-build-template)

## What you get

A working five-page Megapot app you can clone, rebrand, and ship. Pages
cover the core protocol surface: live drawing state, ticket purchase
(jackpot / bulk / subscription), wallet stats + claims, LP deposit /
withdraw, and a paginated round history.

Every file in `src/` carries a JSDoc header with `@skill / @contract /
@endpoint / @customize` metadata, so a human or an AI coding agent dropped
into the repo orients in one read. See [`AGENTS.md`](./AGENTS.md) for the
convention, and the protocol-side docs at
[`llms.megapot.io`](https://llms.megapot.io).

## Deploy in one click

1. Click **Deploy with Vercel** above. It clones this template into your own
   GitHub account and creates a Vercel project from it.
2. When Vercel prompts for environment variables, set **`VITE_REFERRER_ADDRESS`**
   to your Base wallet address. This is the wallet that earns your referral
   fees — set it before your first real visitor.
3. (Optional) set `VITE_APP_NAME` (your site name) and `VITE_CHAIN`
   (`mainnet` or `testnet`).
4. Deploy. Your site is live.

> **Test your earnings from a different wallet.** The protocol does not credit
> a referral when the buyer's wallet is also the referrer wallet (no
> self-referral). To confirm fees accrue, buy a test ticket from a wallet that
> is **not** your `VITE_REFERRER_ADDRESS`.

## Fork manually (5 minutes)

1. `git clone https://github.com/BuiltByGoat/megapot-build-template`
2. `cd megapot-build-template && pnpm bootstrap` — copies `.env.example`
   → `.env` (if missing) and runs `pnpm install`
3. Open `.env` and set `VITE_REFERRER_ADDRESS` to your wallet. This is the
   one value every site needs to change.
4. (Optional, both recommended) Also in `.env`:
   - `VITE_MEGAPOT_API_KEY` — mint one at
     [megapot.io/dashboard](https://megapot.io/dashboard); lifts the
     anonymous tier (10/min, 500/day) to the partner tier (60/min,
     10K/day) so Tickets and History don't throttle under traffic
   - `VITE_WALLETCONNECT_PROJECT_ID` — without it, only browser-extension
     wallets (MetaMask, Rabby, Brave, etc.) and Coinbase Wallet work; the
     WalletConnect QR modal, Rainbow, and MetaMask mobile are disabled
5. `pnpm dev` — http://localhost:5173

The app logs dev-mode warnings when `VITE_REFERRER_ADDRESS` is still the
placeholder — so you can't accidentally ship without setting your wallet.

## How referral fees work

Megapot pays referral fees on every ticket purchased and every winning
claimed through an interface. This template is wired to collect those fees on
every purchase and pay them on-chain: your wallet (`VITE_REFERRER_ADDRESS`)
receives the operator share, and a small platform share keeps the template
free and maintained. The arrangement is set on-chain at purchase time. You
claim your accrued fees from your own wallet — the app's wallet-stats page
exposes the claim.

## Environment variables

| Var | What | What breaks if blank |
|---|---|---|
| `VITE_REFERRER_ADDRESS` | Wallet that receives your referral fees | Defaults to a dead address (`0x…dEaD`); fees earned on it are unrecoverable — set your wallet |
| `VITE_CHAIN` | `mainnet` or `testnet` | Defaults to `mainnet`; must agree with `VITE_RPC_URL` |
| `VITE_RPC_URL` | Base / Base Sepolia HTTPS RPC | Defaults to public RPC — rate-limited, fine for local dev only |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect Cloud project ID | WC QR + Rainbow + MetaMask mobile disabled; injected wallets + Coinbase Wallet still work |
| `VITE_MEGAPOT_API_KEY` | Data API key (browser tier) — [Get a key](https://megapot.io/dashboard) | Empty = anonymous tier (10/min, 500/day) |
| `VITE_API_BASE_URL` | Override Data API URL — set to `/api/megapot` for the proxy tier | Empty = `https://api.megapot.io/v1` |
| `VITE_APP_NAME` | Your site name; label in wallet-connect modals | Falls back to a generic name |
| `MEGAPOT_API_KEY` | Server-side Data API key (proxy tier only) — [Get a key](https://megapot.io/dashboard) | Required only if you deploy `server/proxy.ts` |

Full reference + commented defaults: [`.env.example`](./.env.example).

## Customize

Rebrand seams — brand identity, wallet provider, chain, LP feature toggle,
API-key safety, allowance strategy, disclaimer line, UI copy — are each a
single edit point with a short rationale in
[`docs/CUSTOMIZE.md`](./docs/CUSTOMIZE.md). Files that are rebrand seams are
marked ⚙ in [`docs/CUSTOMIZE.md`](./docs/CUSTOMIZE.md).

## Deploy shapes

The app builds to a static `dist/` (`pnpm build`). Three deploy shapes, one
per Data API key tier — pick once per fork:

- **Static hosting (anonymous tier)** — no backend, no key. Works on Vercel
  static, Cloudflare Pages, GitHub Pages, Netlify, S3 + CloudFront. 10/min,
  500/day per IP.
- **Browser key (higher tier)** — set `VITE_MEGAPOT_API_KEY` in your host's
  env vars (60/min, 10K/day). The key ships in the browser bundle —
  acceptable for the read-only Data API; rotate from the
  [dashboard](https://megapot.io/dashboard) if leaked.
- **Proxy (recommended for production keys)** — deploy
  [`server/proxy.ts`](./server/proxy.ts) alongside the static site, set
  `MEGAPOT_API_KEY` server-side and `VITE_API_BASE_URL=/api/megapot`. The key
  never reaches the browser. Platform wrappers in
  [`examples/`](./examples/README.md) cover Vercel Functions and Cloudflare
  Workers.

## License

MIT — see [`LICENSE`](./LICENSE).

## Disclaimer

This application is an Infrastructure Participant interface, not operated by,
affiliated with, or endorsed by Megapot. Participating assets may be lost.
Full text in [`docs/DISCLAIMER.md`](./docs/DISCLAIMER.md).
