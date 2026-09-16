/**
 * ---
 * @customize  Factory chrome. Swap the brand label via NEXT_PUBLIC_SITE_NAME.
 * ---
 */
import { LINKS } from '@/lib/links';
import { SITE_NAME } from '@/lib/site';

export function SiteHeader() {
  return (
    <header className="site-header wrap">
      <a className="brand" href="/">
        <span className="brand-dot" aria-hidden="true" />
        <span className="brand-mark">{SITE_NAME}</span>
      </a>
      <nav className="nav" aria-label="Factory">
        <a href="/#picker">Picker</a>
        <a href="/#configure">Configure</a>
        <a href="/#deploy">Deploy</a>
        <a href={LINKS.cloneable} rel="noreferrer">
          Template
        </a>
        <a href={LINKS.play} data-cta="play">
          Play
        </a>
      </nav>
    </header>
  );
}
