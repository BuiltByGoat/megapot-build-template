/**
 * ---
 * @customize  megapot.build landing. Two steps: get a referral code,
 *             then launch a player marketing site (ref-gated) or read
 *             the ticket how-to. Public CTAs use /go or official origins.
 *             Cribble tokens only.
 * ---
 */
import { FactoryJsonLd } from '@/components/FactoryJsonLd';
import { MarketingLaunch } from '@/components/MarketingLaunch';
import { REQUIRED_CLONE_ENV } from '@/lib/deploy';
import { LINKS } from '@/lib/links';
import { CLONEABLE_REPO } from '@/lib/origin';
import { REFERRAL_CODE_HINT } from '@/lib/referral';
import { FACTORY_HOSTNAME, PAGES_PROJECT_NAME } from '@/lib/utms';

export function FactoryLanding() {
  return (
    <main id="main">
      <FactoryJsonLd />
      <section className="hero wrap" aria-labelledby="hero-title">
        <p className="kicker">Megapot Network · launch a site</p>
        <h1 id="hero-title">
          Launch a Megapot site. <em>Two steps.</em>
        </h1>
        <p className="lede">
          Anyone can ship a player-facing marketing site — or follow the ticket-selling how-to. Get
          your referral code, then choose what to launch. Play stays on Megapot.
        </p>
        <div className="cta-row">
          <a className="btn btn-green" href="#referral">
            Get your referral code
          </a>
          <a className="btn btn-ghost" href="#launch">
            Choose what to launch
          </a>
        </div>
        <ul className="stat-row" aria-label="Two-step launch">
          <li className="stat">
            <strong>Step 1</strong>
            <span>Create an 8-character referral code in the Megapot dashboard.</span>
          </li>
          <li className="stat">
            <strong>Step 2</strong>
            <span>Launch a marketing site (primary) or read the ticket how-to.</span>
          </li>
          <li className="stat">
            <strong>Private /go</strong>
            <span>
              Visitors tap Play → <code>/go</code>. Attribution stays on the host as{' '}
              <code>MEGAPOT_PLAY_DESTINATION</code>.
            </span>
          </li>
        </ul>
      </section>

      <section className="wrap" id="referral" aria-labelledby="referral-title">
        <p className="kicker">01 · Referral</p>
        <h2 id="referral-title">Get your referral code</h2>
        <p className="intro">
          Register or open the Megapot dashboard and create your referral code. Everyone uses 8
          characters. That code is how Megapot attributes play from the site you launch — it is not
          a public page decoration. Format hint: <code>{REFERRAL_CODE_HINT}</code>.
        </p>
        <div className="cta-row">
          <a className="btn btn-green" href={LINKS.dashboard} data-cta="dashboard" rel="noreferrer">
            Open Megapot dashboard
          </a>
        </div>
        <div className="callout" style={{ marginTop: 28 }}>
          <p>
            Paste the code in Step 2 before Launch. The host stores it as{' '}
            <code>MEGAPOT_PLAY_DESTINATION</code>. Public HTML on the site you ship should never
            print it.
          </p>
        </div>
      </section>

      <section className="wrap" id="launch" aria-labelledby="launch-title">
        <p className="kicker">02 · Launch</p>
        <h2 id="launch-title">Choose what to launch</h2>
        <p className="intro">
          One primary path: a player marketing site on Cloudflare Pages. Vercel is available as a
          secondary host. Ticket-selling is a how-to, not a one-click dump.
        </p>
        <div className="path-grid">
          <MarketingLaunch />
          <article className="path-card" id="tickets">
            <span className="chip chip-ice">Tickets</span>
            <h3>Ticket-selling site</h3>
            <p>
              There is no one-click ticket template on this factory. Sell tickets by wiring Megapot
              into a site you already have, or by following the builder docs. Step 1 attribution
              still applies when you go live.
            </p>
            <ol className="checklist">
              <li>
                <b>Start here</b>
                Pick the lane that matches selling tickets on your own site.
              </li>
              <li>
                <b>Add the jackpot</b>
                Drop buy and claim into a product you already run.
              </li>
              <li>
                <b>Ask an agent</b>
                Point it at <code>llms.megapot.io</code> for live recipes.
              </li>
            </ol>
            <div className="cta-row">
              <a className="btn btn-ghost" href={LINKS.protocolStartHere} rel="noreferrer">
                Start here
              </a>
              <a className="btn btn-ghost" href={LINKS.protocolAddToYourSite} rel="noreferrer">
                Add the jackpot
              </a>
              <a className="btn btn-ghost" href={LINKS.docs} rel="noreferrer">
                llms.megapot.io
              </a>
              <a
                className="btn btn-ghost"
                href={LINKS.dashboard}
                data-cta="dashboard"
                rel="noreferrer"
              >
                Dashboard
              </a>
            </div>
            <p className="field-reason" style={{ marginTop: 16 }}>
              Reading this how-to does not require a referral code. Create one in Step 1 before you
              go live so play is attributed to you.
            </p>
          </article>
        </div>
      </section>

      <section className="wrap" id="notes" aria-labelledby="notes-title">
        <p className="kicker">People and agents</p>
        <h2 id="notes-title">Factory notes</h2>
        <p className="intro">
          Scrape this section for the launch contract. Copy is for humans first; agents second.
        </p>
        <dl className="notes">
          <div>
            <dt>What this site is</dt>
            <dd>
              megapot.build is the launch factory for Megapot Network sites. It is not the player
              homepage. Clones ship a player marketing shell from {CLONEABLE_REPO}.
            </dd>
          </div>
          <div>
            <dt>Two steps</dt>
            <dd>
              Step 1 — get an 8-character referral code in the Megapot dashboard. Step 2 — launch a
              marketing site (referral-gated Cloudflare Pages / Vercel) or follow the ticket how-to
              (no code gate to read).
            </dd>
          </div>
          <div>
            <dt>Required env names</dt>
            <dd>
              {REQUIRED_CLONE_ENV.join(', ')}. Document names only. Factory Pages project{' '}
              <code>{PAGES_PROJECT_NAME}</code> sets <code>SITE_HOSTNAME={FACTORY_HOSTNAME}</code>{' '}
              so HTML and <code>/go</code> Location match.
            </dd>
          </div>
          <div>
            <dt>Template repo</dt>
            <dd>
              <a href={LINKS.cloneable} rel="noreferrer">
                {CLONEABLE_REPO}
              </a>
            </dd>
          </div>
          <div>
            <dt>Smoke checks</dt>
            <dd>
              <code>curl -sI /go</code> and <code>curl -sI /go/</code> must be HTTP 302. Never a
              static 200.
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
