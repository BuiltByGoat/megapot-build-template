import type { MetadataRoute } from 'next';
import { canonicalUrl, SITEMAP_PATHS } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return SITEMAP_PATHS.map((pathname) => ({
    url: canonicalUrl(pathname),
    changeFrequency: pathname === '/' ? 'weekly' : 'yearly',
    priority: pathname === '/' ? 1 : 0.3,
  }));
}
