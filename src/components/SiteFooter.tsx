/**
 * ---
 * @customize  Public footer. Keep attribution and wallets out of this file.
 *             Hub → megapot.network. Latest results → megapotresults.com.
 * ---
 */
import { LINKS } from '@/lib/links';
import { SITE_NAME } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="site-footer wrap">
      <p>
        {SITE_NAME} is an independent developer factory for the Megapot Network. Clones ship player
        sites; this hub is not a player landing. It is not operated by, affiliated with, or endorsed
        by Megapot. Play and payouts happen on megapot.io. The Network hub is{' '}
        <a href={LINKS.hub} data-cta="hub" rel="noreferrer">
          megapot.network
        </a>
        .
      </p>
      <p>
        18+ only. A lottery is entertainment, not income — most tickets lose. Attribution belongs in
        private host env, never in this footer.{' '}
        <a href={LINKS.results} data-cta="results" rel="noreferrer">
          Latest results
        </a>
        {' · '}
        <a href={LINKS.factoryRepo} rel="noreferrer">
          Factory source
        </a>
        {' · '}
        <a href="/disclaimer/">Disclaimer</a>
      </p>
    </footer>
  );
}
