/**
 * ---
 * @customize  Factory chrome. Swap the brand label via NEXT_PUBLIC_SITE_NAME.
 * ---
 */
import { LINKS, SITE_NAME } from '@/lib/site';

type HeaderProps = {
  current?: 'home' | 'template';
};

export function SiteHeader({ current = 'home' }: HeaderProps) {
  return (
    <header className="site-header wrap">
      <a className="brand" href="/">
        <span className="brand-dot" aria-hidden="true" />
        <span className="brand-mark">{SITE_NAME}</span>
      </a>
      <nav className="nav" aria-label="Factory">
        <a href="/templates/marketing/" aria-current={current === 'template' ? 'page' : undefined}>
          Marketing shell
        </a>
        <a href={LINKS.templatesLibrary} rel="noreferrer">
          Template library
        </a>
        <a href={LINKS.docs} rel="noreferrer">
          Developer toolkit
        </a>
        <a href={LINKS.play} rel="noreferrer">
          Play Megapot
        </a>
      </nav>
    </header>
  );
}
