import { Appointment } from '@/widgets/appointment';
import { Collection } from '@/widgets/collection';
import { Craftsmanship } from '@/widgets/craftsmanship';
import { Hero } from '@/widgets/hero';
import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';
import { WatchShowcase } from '@/widgets/watch-showcase';

export function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Collection />
        <WatchShowcase />
        <Craftsmanship />
        <Appointment />
      </main>
      <SiteFooter />
    </>
  );
}
