/**
 * ---
 * @customize  megapot.build landing. Developer factory: picker →
 *             configure → deploy. Clones ship a player site. Public
 *             CTAs use /go or official origins. Cribble tokens only.
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
          Clone the player site. Configure on the host. <em>Deploy.</em>
        </h1>
        <p className="lede">
          megapot.build is for <strong>builders</strong>, not players. Clone{' '}
          <a href={LINKS.cloneable} rel="noreferrer">
            BuiltByGoat/network-site-template
          </a>
          , bind <code>MEGAPOT_PLAY_DESTINATION</code> on the host, and ship a front door whose
          public copy sells play — not a builder ad.
        </p>
        <div className="cta-row">
          <a className="btn btn-green" href={LINKS.cloneable} rel="noreferrer">
            Clone network-site-template
          </a>
          <a className="btn btn-ghost" href="#picker">
            Start with Picker
          </a>
          <a className="btn btn-ember" href={LINKS.play} data-cta="play">
            Play on Megapot
          </a>
        </div>
        <ul className="stat-row" aria-label="Two-sided funnel">
          <li className="stat">
            <strong>This factory</strong>
            <span>Developers land here. Clone the template. Factory Play is first-level /go.</span>
          </li>
          <li className="stat">
            <strong>Your clone</strong>
            <span>A player marketing shell. Public copy sells play, not a builder pitch.</span>
          </li>
          <li className="stat">
            <strong>Function /go</strong>
            <span>
              Players hit Play → <code>/go</code> → your <code>MEGAPOT_PLAY_DESTINATION</code>.
            </span>
          </li>
        </ul>
      </section>

      <section className="wrap" aria-labelledby="funnel-title">
        <p className="kicker">Two-sided funnel</p>
        <h2 id="funnel-title">Developers here. Players on the site you ship.</h2>
        <p className="intro">
          You visit this factory, clone the player shell, and bind{' '}
          <code>MEGAPOT_PLAY_DESTINATION</code> on the host. Players never see this page. They see{' '}
          <em>your</em> site, tap Play, and land on Megapot through Function-win <code>/go</code>.
        </p>
        <div className="grid-3">
          <article className="card">
            <span className="chip chip-ice">01 · Factory</span>
            <h3>Builders, not a player landing</h3>
            <p>
              This hub explains picker → configure → deploy. It is not the homepage clones publish.
              Factory Play is our first-level hop.
            </p>
          </article>
          <article className="card">
            <span className="chip chip-green">02 · Clone</span>
            <h3>Ship a player site</h3>
            <p>
              <a href={LINKS.cloneable} rel="noreferrer">
                network-site-template
              </a>{' '}
              is the player marketing shell. Its public copy should sell play — not advertise
              builders.
            </p>
          </article>
          <article className="card">
            <span className="chip chip-ember">03 · /go</span>
            <h3>Bind Play on the host</h3>
            <p>
              Put the destination in <code>MEGAPOT_PLAY_DESTINATION</code>. Public Play buttons
              point at <code>/go</code>; the Function issues the Location at request time.
            </p>
          </article>
        </div>
      </section>

      <section className="wrap" id="picker" aria-labelledby="picker-title">
        <p className="kicker">01 · Picker</p>
        <h2 id="picker-title">Clone the player site: network-site-template</h2>
        <p className="intro">
          The cloneable is a <strong>player</strong> marketing shell, not a developer homepage.
          Clone{' '}
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
                <b>Preview the player front door</b>
                The Pages demo is the cribble-first shell players will see. You configure it on the
                host after clone.
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
              <div className="ghost-kicker">Player site you ship</div>
              <h3>Play on Megapot.</h3>
              <p>
                Public copy sells play. Play hops through <code>/go</code>. Dashboard and latest
                results stay public look-ups — not a signup flow.
              </p>
              <span className="preview-cta">Preview the player shell →</span>
            </div>
          </a>
        </div>
      </section>

      <section className="wrap" id="configure" aria-labelledby="configure-title">
        <p className="kicker">02 · Configure</p>
        <h2 id="configure-title">Bind Play on the host</h2>
        <p className="intro">
          Bind <code>MEGAPOT_PLAY_DESTINATION</code> on the host — the absolute URL <code>/go</code>{' '}
          redirects to. HTML outbound UTMs require <code>SITE_HOSTNAME</code> at build. The factory
          Pages project <code>{PAGES_PROJECT_NAME}</code> must set{' '}
          <code>SITE_HOSTNAME={FACTORY_HOSTNAME}</code> so dashboard / results / hub hrefs and{' '}
          <code>/go</code> Location match. Clones set their own deploy host.
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
                <td>Pages Function</td>
                <td>
                  Your clone&apos;s Play destination — the absolute URL <code>/go</code> redirects
                  to. Bind it on Cloudflare Pages. Empty → public Megapot origin.
                </td>
              </tr>
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
                <td>Reserved for server-side Data API reads. Do not prefix with NEXT_PUBLIC_.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="callout" style={{ marginTop: 28 }}>
          <p>
            <code>SITE_HOSTNAME</code> stamps HTML UTMs so dashboard, results, and hub match{' '}
            <code>/go</code> Location. <code>MEGAPOT_PLAY_DESTINATION</code> is the Function&apos;s
            redirect target. Hostname UTMs are campaign params (
            <code>builder</code> / <code>build-factory-v1</code>).
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
            <span className="chip chip-ember">Hop</span>
            <h3>Play uses /go</h3>
            <p>
              Public markup links to <code>/go</code>. The Function reads{' '}
              <code>MEGAPOT_PLAY_DESTINATION</code> and returns the Location.
            </p>
          </article>
        </div>
      </section>

      <section className="wrap" aria-labelledby="flywheel-title">
        <p className="kicker">Doors</p>
        <h2 id="flywheel-title">Factory Play is first-level. Your clone&apos;s Play is yours.</h2>
        <p className="intro">
          Play is intent. This factory&apos;s Play button is our <code>/go</code>. After you ship,
          players use yours. Dashboard and results stay public look-ups — not a signup flow.
        </p>
        <div className="cta-row">
          <a className="btn btn-green" href={LINKS.cloneable} rel="noreferrer">
            Clone network-site-template
          </a>
          <a className="btn btn-ember" href={LINKS.play} data-cta="play">
            Play on Megapot
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
        </div>
      </section>
    </main>
  );
}
