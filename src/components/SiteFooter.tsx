/**
 * ---
 * @customize  Public footer. Keep attribution and wallets out of this file.
 * ---
 */
import { LINKS, SITE_NAME } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="site-footer wrap">
      <p>
        {SITE_NAME} is an independent site factory for the Megapot Network. It is not operated by,
        affiliated with, or endorsed by Megapot. Play and payouts happen on{' '}
        <a href={LINKS.play} rel="noreferrer">
          megapot.io
        </a>
        .
      </p>
      <p>
        18+ only. A lottery is entertainment, not income — most tickets lose. Attribution belongs in
        private host env, never in this footer.{' '}
        <a href={LINKS.factoryRepo} rel="noreferrer">
          Source
        </a>
        {' · '}
        <a href="/disclaimer/">Disclaimer</a>
      </p>
    </footer>
  );
}
