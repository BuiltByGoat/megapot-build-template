import type { Metadata } from 'next';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { LINKS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Disclaimer',
};

export default function DisclaimerPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="wrap" style={{ padding: '56px 0 72px', maxWidth: '68ch' }}>
        <p className="kicker">Independence</p>
        <h1 style={{ letterSpacing: '-0.035em', fontSize: '2.2rem' }}>Disclaimer</h1>
        <p>
          megapot.build is an independent Infrastructure Participant interface — a community site
          factory that helps builders ship Megapot-powered marketing pages. It is not operated by,
          affiliated with, or endorsed by Megapot.
        </p>
        <p>
          Ticket purchases, drawings, and payouts happen on{' '}
          <a href={LINKS.play} rel="noreferrer">
            megapot.io
          </a>
          . Participating assets may be lost. You are responsible for the laws of your jurisdiction.
          18+ only.
        </p>
        <p>
          Canonical acknowledgement:{' '}
          <a
            href="https://docs.megapot.io/appendix/infrastructure-participant-acknowledgement"
            rel="noreferrer"
          >
            Infrastructure Participant Acknowledgement
          </a>
          .
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
