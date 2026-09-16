import { FactoryLanding } from '@/components/FactoryLanding';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export default function HomePage() {
  return (
    <>
      <SiteHeader current="home" />
      <FactoryLanding />
      <SiteFooter />
    </>
  );
}
