import type { Metadata } from 'next';
import { IBM_Plex_Mono, Outfit } from 'next/font/google';
import { documentTitle, SITE_NAME } from '@/lib/site';
import '@/styles/factory.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const plex = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex',
  display: 'swap',
});

const title = documentTitle(SITE_NAME);

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    'Megapot Network site factory. Clone network-site-template, bind SITE_HOSTNAME and MEGAPOT_PLAY_DESTINATION privately, deploy to Cloudflare Pages.',
  icons: { icon: '/favicon.svg' },
  metadataBase: new URL('https://megapot.build'),
  openGraph: {
    title,
    description:
      'Builder hub for the canonical Megapot Network cloneable. Attribution stays in host env.',
    url: 'https://megapot.build',
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${plex.variable}`}>
      <body
        style={
          {
            '--crib-sans': 'var(--font-outfit), "Avenir Next", "Segoe UI", sans-serif',
            '--crib-mono': 'var(--font-plex), ui-monospace, monospace',
          } as React.CSSProperties
        }
      >
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
