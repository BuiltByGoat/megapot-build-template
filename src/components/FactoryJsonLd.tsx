/**
 * ---
 * @customize  Builder HowTo JSON-LD. Picker → configure → deploy.
 * ---
 */
import { factoryJsonLd } from '@/lib/seo';

export function FactoryJsonLd() {
  return <script type="application/ld+json">{JSON.stringify(factoryJsonLd())}</script>;
}
