import type { Metadata } from 'next';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { LINKS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Continue to Megapot',
  description:
    'Local static fallback for /go. On Cloudflare Pages a Function reads a private destination and redirects.',
};

export default function GoFallbackPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="wrap go-fallback">
        <p className="kicker">Attribution hop</p>
        <h1>Continue to Megapot</h1>
        <p>
          This static preview cannot read private host env. On Cloudflare Pages, a Function at{' '}
          <code>/go</code> 302s using the destination name bound on the project. Nothing secret is
          rendered here.
        </p>
        <div className="cta-row">
          <a className="btn btn-green" href={LINKS.play} rel="noreferrer">
            Go to Megapot
          </a>
          <a className="btn btn-ghost" href="/">
            Back to the factory
          </a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
