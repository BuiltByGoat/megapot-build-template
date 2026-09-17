/**
 * ---
 * @customize  Two-step HowTo JSON-LD. Referral code, then launch
 *             a player marketing site or read the ticket how-to.
 * ---
 */
import { factoryJsonLd } from '@/lib/seo';

export function FactoryJsonLd() {
  return <script type="application/ld+json">{JSON.stringify(factoryJsonLd())}</script>;
}
