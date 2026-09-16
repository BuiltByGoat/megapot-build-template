/**
 * ---
 * @customize  megapot.build landing. Developer factory — not a player
 *             brochure. Picker → configure → deploy. Public CTAs use
 *             /go or official origins — never a referral code or wallet.
 *             Cribble tokens only.
 * ---
 */
import { FactoryJsonLd } from '@/components/FactoryJsonLd';
import { LINKS } from '@/lib/links';
import { FACTORY_HOSTNAME, PAGES_PROJECT_NAME } from '@/lib/utms';

export function FactoryLanding() {
  return (
    <main id="main">
      <FactoryJsonLd />
      <section className="hero wrap" aria-labelledby="hero-title">
        <p className="kicker">Megapot Network · developer factory</p>
        <h1 id="hero-title">
          Ship a player site. Keep the referral <em>private.</em>
        </h1>
        <p className="lede">
          megapot.build is the <strong>developer</strong> factory for{' '}
          <a href={LINKS.cloneable} rel="noreferrer">
            BuiltByGoat/network-site-template
          </a>
          . Clone that repo, ship a <strong>player-facing</strong> marketing shell, and bind your
          play destination in private host env. Players tap Play → Megapot. This hub does not sell
          tickets and does not ship old HTML kits.
        </p>
        <div className="cta-row">
          <a className="btn btn-green" href={LINKS.cloneable} rel="noreferrer">
            Clone network-site-template
          </a>
          <a className="btn btn-ghost" href="#picker">
            Start with Picker
          </a>
        </div>
        <ul className="stat-row" aria-label="Two-sided funnel">
          <li className="stat">
            <strong>You are here</strong>
            <span>Developer factory. Explains the clone — does not sell play.</span>
          </li>
          <li className="stat">
            <strong>Clone the shell</strong>
            <span>network-site-template is the player site you ship.</span>
          </li>
          <li className="stat">
            <strong>Private env</strong>
            <span>
              Bind <code>MEGAPOT_PLAY_DESTINATION</code> on the host. Never on the page.
            </span>
          </li>
          <li className="stat">
            <strong>Players Play</strong>
            <span>Their /go hops to Megapot. Second-level referrals stay with you.</span>
          </li>
        </ul>
      </section>

      <section className="wrap" id="picker" aria-labelledby="picker-title">
        <p className="kicker">01 · Picker</p>
        <h2 id="picker-title">Clones ship player sites</h2>
        <p className="intro">
          There is no kit picker. Clone{' '}
          <a href={LINKS.cloneable} rel="noreferrer">
            BuiltByGoat/network-site-template
          </a>{' '}
          on <code>main</code>. That template&apos;s public homepage must sell <strong>Play</strong>{' '}
          to players — it is not a developer brochure. This factory is the explainer. Preview:{' '}
          <a href={LINKS.cloneablePreview} rel="noreferrer">
            network-site-template.pages.dev
          </a>
          .
        </p>
        <div className="template-panel">
          <div className="template-copy">
            <ol>
              <li>
                <b>Use GitHub&apos;s template flow</b>
                Open{' '}
                <a href={LINKS.cloneable} rel="noreferrer">
                  github.com/BuiltByGoat/network-site-template
                </a>{' '}
                or <code>git clone https://github.com/BuiltByGoat/network-site-template.git</code>.
              </li>
              <li>
                <b>Stay on main</b>
                The canonical squash is on <code>main</code>. Do not start from deprecated kits. Do
                not retarget the public homepage at other developers.
              </li>
              <li>
                <b>Preview the player door</b>
                The Pages demo is the cribble-first shell players see. It sells play. Your referral
                stays off that page.
              </li>
            </ol>
            <div className="cta-row">
              <a className="btn btn-green" href={LINKS.cloneable} rel="noreferrer">
                Open the GitHub template
              </a>
              <a className="btn btn-ghost" href={LINKS.cloneablePreview} rel="noreferrer">
                Live player preview
              </a>
            </div>
          </div>
          <a
            className="preview-frame"
            href={LINKS.cloneablePreview}
            rel="noreferrer"
            aria-label="Open the live player-site preview of network-site-template"
          >
            <div className="preview-bar">
              <i />
              <i />
              <i />
              <span>network-site-template.pages.dev</span>
            </div>
            <div className="preview-body">
              <div className="ghost-kicker">Player site</div>
              <h3>Play the jackpot.</h3>
              <p>One tap. Tickets and payouts stay on Megapot. Latest results stay public.</p>
              <span className="preview-cta">Play →</span>
            </div>
          </a>
        </div>
        <p className="intro" style={{ marginTop: 22, marginBottom: 0 }}>
          The ghost above is the player voice the clone must keep. Factory copy lives here on
          megapot.build — not on the template homepage.
        </p>
      </section>

      <section className="wrap" id="configure" aria-labelledby="configure-title">
        <p className="kicker">02 · Configure</p>
        <h2 id="configure-title">Your referral stays in private env</h2>
        <p className="intro">
          Put <em>your</em> play destination on the host — never in landing copy, footers, or README
          badges. HTML outbound UTMs require <code>SITE_HOSTNAME</code> at build. The factory Pages
          project <code>{PAGES_PROJECT_NAME}</code> must set{' '}
          <code>SITE_HOSTNAME={FACTORY_HOSTNAME}</code> so dashboard / results / hub hrefs and{' '}
          <code>/go</code> Location match. Clones set their own deploy host. Values stay off the
          page.
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
                <td>Pages + build</td>
                <td>
                  Required for HTML UTMs. Factory: <code>{FACTORY_HOSTNAME}</code>. Alias:{' '}
                  <code>MEGAPOT_SITE_HOSTNAME</code>.
                </td>
              </tr>
              <tr>
                <td>
                  <code>MEGAPOT_PLAY_DESTINATION</code>
                </td>
                <td>Pages Function</td>
                <td>
                  Your private play / referral destination. Absolute URL <code>/go</code> redirects
                  to. Empty → public Megapot origin. Never a code or wallet in public markup.
                </td>
              </tr>
              <tr>
                <td>
                  <code>NEXT_PUBLIC_SITE_NAME</code>
                </td>
                <td>Public label</td>
                <td>
                  Cloneable (player site) title: <code>Play on Megapot | {'{SITE_NAME}'}</code>.
                  This factory: <code>Build on Megapot | {'{SITE_NAME}'}</code>.
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
                <td>Reserved. Never ship it in the bundle.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="privacy" style={{ marginTop: 28 }}>
          <p>
            No referral codes, wallet addresses, or API tokens in landing copy, footers, README
            badges, or cloneable markup. Hostname UTMs are campaign params, not secrets. Players
            never see your destination.
          </p>
        </div>
      </section>

      <section className="wrap" id="deploy" aria-labelledby="deploy-title">
        <p className="kicker">03 · Deploy</p>
        <h2 id="deploy-title">Cloudflare Pages, Function-win /go</h2>
        <p className="intro">
          Cloneable and factory both export <code>out/</code>. Player Play buttons hop{' '}
          <code>/go</code> — <code>functions/go.js</code> + <code>functions/go/index.js</code> with{' '}
          <code>_routes.json</code> <code>include: [&quot;/*&quot;]</code>. Never a static{' '}
          <code>/go</code> 200. The factory&apos;s existing Pages project is{' '}
          <code>{PAGES_PROJECT_NAME}</code> on a personal Cloudflare account. Custom-domain
          attachment is DomainManager only — this factory does not publish apex DNS steps.
        </p>
        <div className="grid-3">
          <article className="card">
            <span className="chip chip-green">Build</span>
            <h3>
              <code>pnpm build</code> → <code>out/</code>
            </h3>
            <p>
              Next.js static export. Factory build sets{' '}
              <code>SITE_HOSTNAME={FACTORY_HOSTNAME}</code> so HTML stamps matching UTMs.
            </p>
          </article>
          <article className="card">
            <span className="chip chip-ice">Function</span>
            <h3>Plain JS /go</h3>
            <p>
              Git integration so <code>functions/</code> ships. Bind{' '}
              <code>SITE_HOSTNAME={FACTORY_HOSTNAME}</code> and your private{' '}
              <code>MEGAPOT_PLAY_DESTINATION</code> on the project.
            </p>
          </article>
          <article className="card">
            <span className="chip chip-ember">Privacy</span>
            <h3>View-source /go</h3>
            <p>
              Public markup links to <code>/go</code>. The destination never appears in HTML.
            </p>
          </article>
        </div>
      </section>

      <section className="wrap" aria-labelledby="flywheel-title">
        <p className="kicker">Two-sided funnel</p>
        <h2 id="flywheel-title">You build. Players play.</h2>
        <p className="intro">
          Play is intent on the <em>clone</em>. Dashboard and results stay public look-ups — not a
          signup flow. Hub is megapot.network. Latest results are megapotresults.com. This
          factory&apos;s <code>/go</code> is the same hop pattern your player site ships.
        </p>
        <div className="cta-row">
          <a className="btn btn-green" href={LINKS.cloneable} rel="noreferrer">
            Clone network-site-template
          </a>
          <a className="btn btn-ghost" href={LINKS.dashboard} data-cta="dashboard" rel="noreferrer">
            Dashboard
          </a>
          <a className="btn btn-ghost" href={LINKS.results} data-cta="results" rel="noreferrer">
            Latest results
          </a>
          <a className="btn btn-ghost" href={LINKS.docs} rel="noreferrer">
            llms.megapot.io
          </a>
          <a className="btn btn-ember" href={LINKS.play} data-cta="play">
            Factory /go hop
          </a>
        </div>
      </section>
    </main>
  );
}
