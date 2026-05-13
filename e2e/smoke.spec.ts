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

test('商品 OG SVG 可取得', async ({ request }) => {
  const sm = await request.get('/sitemap.xml');
  const xml = await sm.text();
  let slug = '01';
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const tail = m[1].match(/\/products\/([^/?#]+)$/);
    if (tail?.[1]) {
      slug = decodeURIComponent(tail[1]);
      break;
    }
  }
  const res = await request.get(`/og/product/${slug}.svg`);
  expect(res.ok()).toBeTruthy();
  expect(res.headers()['content-type']).toMatch(/image\/svg\+xml/);
  const text = await res.text();
  expect(text).toContain('RIOT CROWN');
});
