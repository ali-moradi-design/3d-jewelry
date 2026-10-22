import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/** Collects console errors and uncaught exceptions for the whole test. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

test('the page loads with its main sections', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Aurelune/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Light, held');
  for (const name of [
    'The Aurel solitaire',
    'Meridian automatic',
    'Four stages, one piece',
    'Book an appointment',
  ]) {
    await expect(page.getByRole('heading', { level: 2, name })).toBeAttached();
  }
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeAttached();
});

test('the 3D scenes render without console errors', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/');

  for (const section of ['section[aria-labelledby="hero-title"]', '#collection', '#watch']) {
    await page.locator(section).scrollIntoViewIfNeeded();
    await page.locator(`${section} [data-scene-ready="true"]`).waitFor({ state: 'attached' });
    await expect(page.locator(`${section} canvas`)).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('choosing a metal and a stone updates the price and the booking form', async ({ page }) => {
  await page.goto('/');
  const price = page.getByTestId('ring-price');
  await expect(price).toHaveText('$5,000');

  await page.getByRole('radio', { name: 'Rose gold' }).check({ force: true });
  await page.getByRole('radio', { name: 'Sapphire' }).check({ force: true });
  await expect(page.getByRole('radio', { name: 'Rose gold' })).toBeChecked();
  await expect(price).toHaveText('$3,900');

  await expect(page.locator('#appointment')).toContainText(
    'Rose gold Aurel solitaire with a sapphire',
  );
});

test('the watch parts move focus and describe themselves', async ({ page }) => {
  await page.goto('/');
  const crown = page.getByRole('button', { name: 'Crown' });
  await expect(crown).toHaveAttribute('aria-pressed', 'false');
  await crown.click();
  await expect(crown).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: 'A signed, screw-down crown' })).toBeVisible();
  await crown.click();
  await expect(crown).toHaveAttribute('aria-pressed', 'false');
});

test('the appointment form validates and confirms', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Request a visit' }).click();
  await expect(page.getByText('Please enter your name.')).toBeVisible();
  await expect(page.getByText('Please enter a valid email address.')).toBeVisible();
  await expect(page.getByText('Please choose a date.')).toBeVisible();

  await page.getByLabel('Name').fill('Ada Lovelace');
  await page.getByLabel('Email').fill('ada@example.com');
  const nextYear = new Date().getFullYear() + 1;
  await page.getByLabel('Preferred date').fill(`${nextYear}-05-20`);
  await page.getByRole('button', { name: 'Request a visit' }).click();
  await expect(page.getByRole('status')).toContainText('Thank you, Ada Lovelace.');
});

test('has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  const serious = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );
  expect(
    serious,
    JSON.stringify(
      serious.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      null,
      2,
    ),
  ).toEqual([]);
});

test('respects reduced motion: no scroll-driven camera, page still works', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = watchErrors(page);
  await page.goto('http://localhost:3000/');
  await page
    .locator('section[aria-labelledby="hero-title"] [data-scene-ready="true"]')
    .waitFor({ state: 'attached' });
  const height = await page
    .locator('section[aria-labelledby="hero-title"]')
    .evaluate((el) => el.getBoundingClientRect().height);
  expect(height).toBeLessThan(1200);
  expect(errors).toEqual([]);
  await context.close();
});
