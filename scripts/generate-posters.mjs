// Renders the three 3D scenes once and saves them as poster images in public/posters.
// Usage: pnpm build && pnpm exec http-server out -p 4300 -s &  node scripts/generate-posters.mjs http://localhost:4300
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const base = process.argv[2] ?? 'http://localhost:3000';
mkdirSync('public/posters', { recursive: true });

const browser = await chromium.launch({
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

async function shoot({ name, viewport, selector, scroll }) {
  const page = await browser.newPage({ viewport });
  await page.goto(base);
  await page.addStyleTag({
    content: '[data-overlay] { visibility: hidden !important; }',
  });
  await page.evaluate((s) => document.querySelector(s)?.scrollIntoView(), scroll);
  await page.waitForSelector(`${selector}[data-scene-ready="true"]`, { timeout: 60000 });
  // let the soft-shadow accumulation finish
  await page.waitForTimeout(6000);
  await page
    .locator(selector)
    .first()
    .screenshot({ path: `public/posters/${name}.jpg`, type: 'jpeg', quality: 80 });
  await page.close();
  console.log('wrote', name);
}

await shoot({
  name: 'hero',
  viewport: { width: 1440, height: 900 },
  selector: 'section[aria-labelledby="hero-title"] [data-scene-ready]',
  scroll: '#hero-title',
});
await shoot({
  name: 'hero-mobile',
  viewport: { width: 390, height: 844 },
  selector: 'section[aria-labelledby="hero-title"] [data-scene-ready]',
  scroll: '#hero-title',
});
await shoot({
  name: 'collection',
  viewport: { width: 1440, height: 900 },
  selector: '#collection [data-scene-ready]',
  scroll: '#collection',
});
await shoot({
  name: 'watch',
  viewport: { width: 1440, height: 900 },
  selector: '#watch [data-scene-ready]',
  scroll: '#watch',
});

await browser.close();
