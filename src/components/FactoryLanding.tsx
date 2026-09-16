/**
 * ---
 * @customize  megapot.build landing. Explain the factory, not a specific
 *             operator's invite. Public CTAs use /go or official origins —
 *             never a referral code or wallet.
 * ---
 */
import { LINKS } from '@/lib/links';

export function FactoryLanding() {
  return (
    <main id="main">
      <section className="hero wrap" aria-labelledby="hero-title">
        <p className="kicker">Megapot Network · builder hub</p>
        <h1 id="hero-title">
          Clone the Network site. Keep attribution <em>private</em>.
        </h1>
        <p className="lede">
          megapot.build is the factory for{' '}
          <a href={LINKS.cloneable} rel="noreferrer">
            BuiltByGoat/network-site-template
          </a>
          — the canonical cloneable. Clone it, bind <code>SITE_HOSTNAME</code> and{' '}
          <code>MEGAPOT_PLAY_DESTINATION</code> on the host, deploy to Cloudflare Pages. This hub
          does not ship the old HTML kits.
        </p>
        <div className="cta-row">
          <a className="btn btn-green" href={LINKS.cloneable} rel="noreferrer">
            Clone network-site-template
          </a>
          <a className="btn btn-ghost" href={LINKS.cloneablePreview} rel="noreferrer">
            Live preview
          </a>
          <a className="btn btn-ember" href={LINKS.play} data-cta="play">
            Play on Megapot
          </a>
        </div>
        <ul className="stat-row">
          <li className="stat">
            <strong>Canonical cloneable</strong>
            <span>network-site-template on GitHub — cribble-first, Pages-ready</span>
          </li>
          <li className="stat">
            <strong>Private /go</strong>
            <span>Play hops through a Function. Destination stays in host env</span>
          </li>
          <li className="stat">
            <strong>Zero public secrets</strong>
            <span>No codes, wallets, or API keys in the page or footer</span>
          </li>
        </ul>
      </section>

      <section className="wrap" aria-labelledby="path-title">
        <p className="kicker">Ship path</p>
        <h2 id="path-title">Clone → bind → deploy</h2>
        <p className="intro">
          The factory explains the path. The site you ship is a clone of the template, not this
          repo. Set env <em>names</em> on Cloudflare Pages. Values never belong in git or markup.
        </p>
        <div className="template-panel">
          <div className="template-copy">
            <ol>
              <li>
                <b>Clone the template</b>
                Use GitHub&apos;s template flow or{' '}
                <code>git clone https://github.com/BuiltByGoat/network-site-template.git</code>.
              </li>
              <li>
                <b>Bind privately</b>
                On the Pages project, set <code>SITE_HOSTNAME</code> (hostname-style{' '}
                <code>utm_source</code>) and <code>MEGAPOT_PLAY_DESTINATION</code> (the /go 302).
              </li>
              <li>
                <b>Deploy to Cloudflare Pages</b>
                Build command <code>pnpm build</code>, output <code>out/</code>. Git integration so{' '}
                <code>functions/go.js</code> ships with the static export.
              </li>
            </ol>
            <div className="cta-row">
              <a className="btn btn-green" href={LINKS.cloneable} rel="noreferrer">
                Open the GitHub template
              </a>
              <a className="btn btn-ghost" href={LINKS.docs} rel="noreferrer">
                Developer toolkit
              </a>
            </div>
          </div>
          <a
            className="preview-frame"
            href={LINKS.cloneablePreview}
            rel="noreferrer"
            aria-label="Open the live network-site-template preview"
          >
            <div className="preview-bar">
              <i />
              <i />
              <i />
              <span>network-site-template.pages.dev</span>
            </div>
            <div className="preview-body">
              <div className="ghost-kicker">Canonical cloneable</div>
              <h3>Ship a jackpot front door.</h3>
              <p>
                Play hops through a private /go. Dashboard and latest results stay public,
                UTM-stamped, and empty of attribution secrets.
              </p>
              <span className="preview-cta">Preview the template →</span>
            </div>
          </a>
        </div>
      </section>

      <section className="wrap" aria-labelledby="get-title">
        <p className="kicker">What this hub is</p>
        <h2 id="get-title">A factory, not a pasted invite link</h2>
        <div className="grid-3">
          <article className="card">
            <span className="chip chip-green">Players</span>
            <h3>A door to the daily drawing</h3>
            <p>
              The cloneable explains the jackpot, then sends people to Megapot through a host-side
              redirect. This factory&apos;s Play button uses the same <code>/go</code> hop.
            </p>
          </article>
          <article className="card">
            <span className="chip chip-ice">Builders</span>
            <h3>One cloneable to ship</h3>
            <p>
              TypeScript, Next.js static export, cribble tokens, and the Function-win /go shape
              already proven on the template. Clone it — do not resurrect old kit DNA.
            </p>
          </article>
          <article className="card">
            <span className="chip chip-ember">Operators</span>
            <h3>Earnings stay off the page</h3>
            <p>
              Bind destination and hostname in private env. Public copy never prints a referral code
              or a payout address.
            </p>
          </article>
        </div>
      </section>

      <section className="wrap" aria-labelledby="env-title">
        <p className="kicker">Private binding</p>
        <h2 id="env-title">Env names, never values</h2>
        <p className="intro">
          Set these on the cloned Pages project (and on this factory if you host it). Documented as
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
                  <code>SITE_HOSTNAME</code>
                </td>
                <td>Pages Function / build</td>
                <td>
                  Deploy host. Becomes hostname-style <code>utm_source</code> on /go and outbound
                  links. Alias: <code>MEGAPOT_SITE_HOSTNAME</code>.
                </td>
              </tr>
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
                  <code>NEXT_PUBLIC_SITE_NAME</code>
                </td>
                <td>Public label</td>
                <td>
                  Site title. Cloneable uses <code>Play on Megapot | {'{SITE_NAME}'}</code>. This
                  factory uses <code>Build on Megapot | {'{SITE_NAME}'}</code>.
                </td>
              </tr>
              <tr>
                <td>
                  <code>MEGAPOT_REFERRER_ADDRESS</code>
                </td>
                <td>Server only</td>
                <td>Reserved. Unused by the cloneable v1 shell.</td>
              </tr>
              <tr>
                <td>
                  <code>MEGAPOT_API_KEY</code>
                </td>
                <td>Server only</td>
                <td>Data API key if a fork adds server reads. Never ship it in the bundle.</td>
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
            badges, or cloneable markup. Attribution is a host concern. Hostname UTMs (
            <code>utm_source</code> from <code>SITE_HOSTNAME</code>) are campaign params, not
            secrets.
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
          <a className="btn btn-ember" href={LINKS.play} data-cta="play">
            Play on Megapot
          </a>
          <a className="btn btn-green" href={LINKS.dashboard} data-cta="dashboard" rel="noreferrer">
            Developer signup
          </a>
          <a className="btn btn-ghost" href={LINKS.results} data-cta="results" rel="noreferrer">
            Latest results
          </a>
          <a className="btn btn-ghost" href={LINKS.docs} rel="noreferrer">
            llms.megapot.io
          </a>
        </div>
      </section>
    </main>
  );
}
