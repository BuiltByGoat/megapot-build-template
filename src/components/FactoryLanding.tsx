/**
 * ---
 * @customize  megapot.build landing. Explain the factory, not a specific
 *             operator's invite. Public CTAs use official Megapot origins
 *             or /go — never a referral code or wallet.
 * ---
 */
import { LINKS } from '@/lib/site';

export function FactoryLanding() {
  return (
    <main id="main">
      <section className="hero wrap" aria-labelledby="hero-title">
        <p className="kicker">Megapot Network · site factory</p>
        <h1 id="hero-title">
          Ship a Megapot site. Keep attribution <em>private</em>.
        </h1>
        <p className="lede">
          megapot.build is a factory for builders who want Megapot-powered marketing and referral
          sites — without leaking codes, wallets, or tokens into public markup. Preview a starter,
          bind earnings on the host, deploy to Cloudflare Pages.
        </p>
        <div className="cta-row">
          <a className="btn btn-green" href="/templates/marketing/">
            Preview the marketing shell
          </a>
          <a className="btn btn-ghost" href={LINKS.dashboard} rel="noreferrer">
            Create a Megapot account
          </a>
          <a className="btn btn-ghost" href={LINKS.docs} rel="noreferrer">
            Developer toolkit
          </a>
        </div>
        <ul className="stat-row">
          <li className="stat">
            <strong>Marketing shell</strong>
            <span>Honest lottery explainer, ready to preview and fork</span>
          </li>
          <li className="stat">
            <strong>Cloudflare Pages</strong>
            <span>Static export plus a /go worker for private binding</span>
          </li>
          <li className="stat">
            <strong>Zero public secrets</strong>
            <span>No codes, wallets, or API keys in the page or footer</span>
          </li>
        </ul>
      </section>

      <section className="wrap" aria-labelledby="get-title">
        <p className="kicker">What you get</p>
        <h2 id="get-title">A factory, not a pasted invite link</h2>
        <p className="intro">
          The old megapot.build builder baked an invite URL into downloaded HTML. This factory keeps
          the public surface clean: players see a site; operators bind attribution in Cloudflare
          env. The template library behind the shells still lives at{' '}
          <a href={LINKS.templatesLibrary} rel="noreferrer">
            BuiltByGoat/megapot-templates
          </a>
          .
        </p>
        <div className="grid-3">
          <article className="card">
            <span className="chip chip-green">Players</span>
            <h3>A door to the daily drawing</h3>
            <p>
              The marketing shell explains odds, money flow, and how to verify a drawing — then
              sends people to Megapot through a host-side redirect.
            </p>
          </article>
          <article className="card">
            <span className="chip chip-ice">Builders</span>
            <h3>A starter you can actually ship</h3>
            <p>
              TypeScript factory, cribble tokens, and a Cloudflare-shaped marketing path. Clone,
              preview, deploy. No third design system to invent.
            </p>
          </article>
          <article className="card">
            <span className="chip chip-ember">Operators</span>
            <h3>Earnings stay off the page</h3>
            <p>
              Bind destination and wallet names in private env. Public copy never prints a referral
              code or a payout address.
            </p>
          </article>
        </div>
      </section>

      <section className="wrap" aria-labelledby="template-title">
        <p className="kicker">Starter path</p>
        <h2 id="template-title">Marketing shell — previewable, Pages-ready</h2>
        <div className="template-panel">
          <div className="template-copy">
            <p className="intro">
              One scroll experience: the problem with opaque lotteries, how Megapot works, published
              odds, and a responsible-play note. Structure follows the megapot-templates contract
              (self-contained page, repeated CTA, independence disclaimer) with the invite token
              retired.
            </p>
            <ol>
              <li>
                <b>Preview it here</b>
                Open the in-factory preview. Every play button points at <code>/go</code>, not an
                invite URL.
              </li>
              <li>
                <b>Copy the starter</b>
                <code>templates/marketing</code> is a static Cloudflare Pages project: HTML, cribble
                CSS, and a Pages Function.
              </li>
              <li>
                <b>Bind privately, then deploy</b>
                Set the env names on your Pages project. The function 302s. The HTML never learns
                the destination.
              </li>
            </ol>
            <div className="cta-row">
              <a className="btn btn-green" href="/templates/marketing/">
                Open the preview
              </a>
              <a className="btn btn-ghost" href={LINKS.factoryRepo} rel="noreferrer">
                View the repo
              </a>
            </div>
          </div>
          <a
            className="preview-frame"
            href="/templates/marketing/"
            aria-label="Open marketing shell preview"
          >
            <div className="preview-bar">
              <i />
              <i />
              <i />
              <span>/templates/marketing</span>
            </div>
            <div className="preview-body">
              <div className="ghost-kicker">Independent guide</div>
              <h3>A daily drawing you can actually read.</h3>
              <p>
                Odds, money flow, and receipts — then a play button that does not expose how the
                operator is credited.
              </p>
              <span className="preview-cta">Play today → /go</span>
            </div>
          </a>
        </div>
      </section>

      <section className="wrap" aria-labelledby="env-title">
        <p className="kicker">Private binding</p>
        <h2 id="env-title">Env names, never values</h2>
        <p className="intro">
          Set these on Cloudflare Pages (or in <code>.env.local</code> for Next). Documented as
          names only. Do not put secrets in <code>NEXT_PUBLIC_*</code>.
        </p>
        <div className="card">
          <table className="env-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Where it lives</th>
                <th scope="col">Role</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>MEGAPOT_PLAY_DESTINATION</code>
                </td>
                <td>Pages Function / server</td>
                <td>
                  Absolute URL <code>/go</code> redirects to. Empty → public Megapot origin.
                </td>
              </tr>
              <tr>
                <td>
                  <code>MEGAPOT_REFERRER_ADDRESS</code>
                </td>
                <td>Server only</td>
                <td>Reserved for a future on-chain app template. Unused by the marketing shell.</td>
              </tr>
              <tr>
                <td>
                  <code>MEGAPOT_API_KEY</code>
                </td>
                <td>Server only</td>
                <td>Data API key if a fork adds server reads. Never ship it in the bundle.</td>
              </tr>
              <tr>
                <td>
                  <code>NEXT_PUBLIC_SITE_NAME</code>
                </td>
                <td>Public label</td>
                <td>Factory title. Safe to expose. Not attribution.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="wrap" aria-labelledby="privacy-title">
        <p className="kicker">Hard rule</p>
        <h2 id="privacy-title">Public pages do not carry the money path</h2>
        <div className="privacy">
          <p>
            No referral codes, wallet addresses, or API tokens in landing copy, footers, README
            badges, or starter HTML. Attribution is a host concern. If you need the older HTML token
            set (including an invite placeholder), use it only in a private generator — not in
            anything this factory publishes.
          </p>
        </div>
      </section>

      <section className="wrap" aria-labelledby="flywheel-title">
        <p className="kicker">Developer flywheel</p>
        <h2 id="flywheel-title">Play. Build. Ship another door.</h2>
        <p className="intro">
          The factory exists to grow Megapot players and Megapot builders at the same time. Pick the
          door that matches the visit.
        </p>
        <div className="cta-row">
          <a className="btn btn-ember" href={LINKS.play} rel="noreferrer">
            Play on Megapot
          </a>
          <a className="btn btn-green" href={LINKS.dashboard} rel="noreferrer">
            Developer signup
          </a>
          <a className="btn btn-ghost" href={LINKS.docs} rel="noreferrer">
            llms.megapot.io
          </a>
        </div>
      </section>
    </main>
  );
}
