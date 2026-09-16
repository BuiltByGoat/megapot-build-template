import type { Metadata } from 'next';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export const metadata: Metadata = {
  title: 'Marketing shell preview',
  description:
    'Preview the Cloudflare Pages marketing starter. Play buttons go to /go — attribution stays on the host.',
};

export default function MarketingPreviewPage() {
  return (
    <>
      <SiteHeader current="template" />
      <main id="main" className="preview-page wrap">
        <div className="preview-toolbar">
          <p>
            Live preview of <code>templates/marketing</code>. Play CTAs use <code>/go</code>. In
            this factory preview they fall back to the public Megapot origin unless a Pages Function
            is bound.
          </p>
          <a className="btn btn-ghost" href="/starter/marketing/index.html">
            Open fullscreen
          </a>
        </div>
        <iframe
          className="preview-embed"
          title="Marketing shell preview"
          src="/starter/marketing/index.html"
        />
      </main>
      <SiteFooter />
    </>
  );
}
