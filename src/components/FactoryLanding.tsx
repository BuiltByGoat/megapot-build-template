/**
 * ---
 * @customize  megapot.build landing. Picker / configure / deploy IA.
 *             Public CTAs use /go or official origins — never a referral
 *             code or wallet. Cribble tokens only.
 * ---
 */
import { LINKS } from '@/lib/links';
import { FACTORY_HOSTNAME, PAGES_PROJECT_NAME } from '@/lib/utms';

export function FactoryLanding() {
  return (
    <main id="main">
      <section className="hero wrap" aria-labelledby="hero-title">
        <p className="kicker">Megapot Network · factory</p>
        <h1 id="hero-title">
          Pick the Network site. Configure privately. <em>Deploy.</em>
        </h1>
        <p className="lede">
          megapot.build is the factory for{' '}
          <a href={LINKS.cloneable} rel="noreferrer">
            BuiltByGoat/network-site-template
          </a>
          . One cloneable. Bind <code>SITE_HOSTNAME</code> and <code>MEGAPOT_PLAY_DESTINATION</code>{' '}
          on the host. Ship to Cloudflare Pages. This hub does not ship old HTML kits.
        </p>
        <div className="cta-row">
          <a className="btn btn-green" href="#pick">
            Start with Pick
          </a>
          <a className="btn btn-ghost" href={LINKS.cloneable} rel="noreferrer">
            Clone network-site-template
          </a>
          <a className="btn btn-ember" href={LINKS.play} data-cta="play">
            Play on Megapot
          </a>
        </div>
      </section>

      <section className="wrap" id="pick" aria-labelledby="pick-title">
        <p className="kicker">01 · Pick</p>
        <h2 id="pick-title">The cloneable is network-site-template</h2>
        <p className="intro">
          There is no kit picker. Clone{' '}
          <a href={LINKS.cloneable} rel="noreferrer">
            BuiltByGoat/network-site-template
          </a>{' '}
          on <code>main</code>. Preview:{' '}
          <a href={LINKS.cloneablePreview} rel="noreferrer">
            network-site-template.pages.dev
          </a>
          . This factory repo is the explainer, not the site you ship.
        </p>
        <div className="template-panel">
          <div className="template-copy">
            <ol>
              <li>
                <b>Use GitHub&apos;s template flow</b>
                Or <code>git clone https://github.com/BuiltByGoat/network-site-template.git</code>.
              </li>
              <li>
                <b>Stay on main</b>
                The canonical squash is on <code>main</code>. Do not start from deprecated kits.
              </li>
              <li>
                <b>Preview before you bind</b>
                The Pages demo is the cribble-first shell you will configure.
              </li>
            </ol>
            <div className="cta-row">
              <a className="btn btn-green" href={LINKS.cloneable} rel="noreferrer">
                Open the GitHub template
              </a>
              <a className="btn btn-ghost" href={LINKS.cloneablePreview} rel="noreferrer">
                Live preview
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

      <section className="wrap" id="configure" aria-labelledby="configure-title">
        <p className="kicker">02 · Configure</p>
        <h2 id="configure-title">Env names, never values</h2>
        <p className="intro">
          HTML outbound UTMs require <code>SITE_HOSTNAME</code> at build. The factory Pages project{' '}
          <code>{PAGES_PROJECT_NAME}</code> must set <code>SITE_HOSTNAME={FACTORY_HOSTNAME}</code>{' '}
          so dashboard / results / hub hrefs and <code>/go</code> Location match. Clones set their
          own deploy host. Values stay off the page.
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
                  Absolute URL <code>/go</code> redirects to. Empty → public Megapot origin.
                </td>
              </tr>
              <tr>
                <td>
                  <code>NEXT_PUBLIC_SITE_NAME</code>
                </td>
                <td>Public label</td>
                <td>
                  Cloneable title: <code>Play on Megapot | {'{SITE_NAME}'}</code>. This factory:{' '}
                  <code>Build on Megapot | {'{SITE_NAME}'}</code>.
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
            badges, or cloneable markup. Hostname UTMs are campaign params, not secrets.
          </p>
        </div>
      </section>

      <section className="wrap" id="deploy" aria-labelledby="deploy-title">
        <p className="kicker">03 · Deploy</p>
        <h2 id="deploy-title">Cloudflare Pages, Function-win /go</h2>
        <p className="intro">
          Cloneable and factory both export <code>out/</code>. Play is <code>functions/go.js</code>{' '}
          + <code>functions/go/index.js</code> with <code>_routes.json</code>{' '}
          <code>include: [&quot;/*&quot;]</code>. Never a static <code>/go</code> 200. The
          factory&apos;s existing Pages project is <code>{PAGES_PROJECT_NAME}</code> on a personal
          Cloudflare account. Custom-domain attachment is DomainManager only — this factory does not
          publish apex DNS steps.
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
              <code>SITE_HOSTNAME={FACTORY_HOSTNAME}</code> and{' '}
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
        <p className="kicker">Doors</p>
        <h2 id="flywheel-title">Play. Build. Ship another door.</h2>
        <p className="intro">
          Play is intent. Dashboard and results stay public look-ups — not a signup flow.
        </p>
        <div className="cta-row">
          <a className="btn btn-ember" href={LINKS.play} data-cta="play">
            Play on Megapot
          </a>
          <a className="btn btn-green" href={LINKS.dashboard} data-cta="dashboard" rel="noreferrer">
            Dashboard
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
