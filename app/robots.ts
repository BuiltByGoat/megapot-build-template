import type { MetadataRoute } from 'next';
import { FACTORY_CANONICAL_ORIGIN, ROBOTS_DISALLOW } from '@/lib/seo';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [...ROBOTS_DISALLOW],
    },
    sitemap: new URL('/sitemap.xml', FACTORY_CANONICAL_ORIGIN).toString(),
    host: new URL(FACTORY_CANONICAL_ORIGIN).host,
  };
}
