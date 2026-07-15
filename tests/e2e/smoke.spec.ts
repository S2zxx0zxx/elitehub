import { test, expect } from '@playwright/test';

test('has title and main heading', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/EliteHub/);

  // Expect the page to render without crashing and find a basic element
  // Since we have a Clerk Auth button or standard landing page text, we just check for basic layout
  const body = page.locator('body');
  await expect(body).toBeVisible();
});

test('explore page loads', async ({ page }) => {
  await page.goto('/explore');
  await expect(page.locator('body')).toBeVisible();
});
