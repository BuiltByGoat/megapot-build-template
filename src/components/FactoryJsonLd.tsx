/**
 * ---
 * @customize  Developer-factory HowTo JSON-LD. Picker → configure → deploy.
 *             Clones ship a player site.
 * ---
 */
import { factoryJsonLd } from '@/lib/seo';

export function FactoryJsonLd() {
  return <script type="application/ld+json">{JSON.stringify(factoryJsonLd())}</script>;
}
