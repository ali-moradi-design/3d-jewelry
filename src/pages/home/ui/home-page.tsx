import { Hero } from '@/widgets/hero';
import { SiteHeader } from '@/widgets/site-header';

export function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
      </main>
    </>
  );
}
