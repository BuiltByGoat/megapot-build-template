/**
 * ---
 * @customize  Public footer. Hub → megapot.network. Latest results →
 *             megapotresults.com.
 * ---
 */
import { LINKS } from '@/lib/links';
import { SITE_NAME } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="site-footer wrap">
      <p>
        {SITE_NAME} is an independent factory for launching Megapot Network sites. You ship a player
        marketing site or follow the ticket how-to; this hub is not a player landing. It is not
        operated by, affiliated with, or endorsed by Megapot. Play and payouts happen on megapot.io.
        The Network hub is{' '}
        <a href={LINKS.hub} data-cta="hub" rel="noreferrer">
          megapot.network
        </a>
        .
      </p>
      <p>
        18+ only. A lottery is entertainment, not income — most tickets lose.{' '}
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
