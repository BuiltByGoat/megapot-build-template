import type { Metadata } from 'next';
import { IBM_Plex_Mono, Outfit } from 'next/font/google';
import { SITE_NAME } from '@/lib/site';
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

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Megapot site factory`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    'A Megapot Network site factory. Preview a marketing shell, bind attribution in private env, deploy to Cloudflare Pages. No referral codes or wallets on the public page.',
  icons: { icon: '/favicon.svg' },
  metadataBase: new URL('https://megapot.build'),
  openGraph: {
    title: `${SITE_NAME} — Megapot site factory`,
    description:
      'Ship Megapot-powered marketing sites without leaking attribution into public markup.',
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
