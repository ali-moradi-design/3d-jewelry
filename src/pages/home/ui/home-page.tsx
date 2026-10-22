import { Collection } from '@/widgets/collection';
import { Hero } from '@/widgets/hero';
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
      </main>
    </>
  );
}
