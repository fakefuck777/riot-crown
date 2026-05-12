import { test, expect } from '@playwright/test';

test('首頁載入且可進入商品頁', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#main-content')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 20_000 });

  await page.locator('#collection h3').first().click({ timeout: 30_000 });
  await expect(page).toHaveURL(/\/products\/.+/);
});

test('相容路由 /cart 會導回首頁區塊', async ({ page }) => {
  const res = await page.goto('/cart');
  expect(res?.status()).toBeLessThan(400);
  await expect(page).toHaveURL('/');
});
