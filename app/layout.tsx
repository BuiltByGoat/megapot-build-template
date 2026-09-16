import type { Metadata } from 'next';
import { IBM_Plex_Mono, Outfit } from 'next/font/google';
import { FACTORY_CANONICAL_ORIGIN, FACTORY_DESCRIPTION } from '@/lib/seo';
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
  description: FACTORY_DESCRIPTION,
  icons: { icon: '/favicon.svg' },
  metadataBase: new URL(FACTORY_CANONICAL_ORIGIN),
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description: FACTORY_DESCRIPTION,
    url: '/',
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title,
    description: FACTORY_DESCRIPTION,
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
