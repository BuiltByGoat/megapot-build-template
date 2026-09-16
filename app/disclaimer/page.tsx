import type { Metadata } from 'next';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { LINKS } from '@/lib/links';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'Independence and 18+ note for the megapot.build factory. Play and payouts stay on megapot.io. Hub is megapot.network. Latest results are megapotresults.com.',
  alternates: { canonical: '/disclaimer/' },
};

export default function DisclaimerPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="wrap" style={{ padding: '56px 0 72px', maxWidth: '68ch' }}>
        <p className="kicker">Independence</p>
        <h1 style={{ letterSpacing: '-0.035em', fontSize: '2.2rem' }}>Disclaimer</h1>
        <p>
          megapot.build is an independent Infrastructure Participant interface — a community
          developer factory that helps builders clone network-site-template and ship a player-facing
          site. It is not operated by, affiliated with, or endorsed by Megapot.
        </p>
        <p>
          Ticket purchases, drawings, and payouts happen on megapot.io. Latest results live on{' '}
          <a href={LINKS.results} data-cta="results" rel="noreferrer">
            megapotresults.com
          </a>
          . The Network hub is{' '}
          <a href={LINKS.hub} data-cta="hub" rel="noreferrer">
            megapot.network
          </a>
          . Participating assets may be lost. You are responsible for the laws of your jurisdiction.
          18+ only.
        </p>
        <p>
          Canonical acknowledgement:{' '}
          <a href={`${LINKS.protocolDocs}/appendix/infrastructure-participant-acknowledgement`}>
            Infrastructure Participant Acknowledgement
          </a>
          .
        </p>
        <p>
          <a className="btn btn-ember" href={LINKS.play} data-cta="play">
            Play on Megapot
          </a>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
