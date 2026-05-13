import { test, expect } from '@playwright/test';

const port = Number(process.env.PLAYWRIGHT_PREVIEW_PORT ?? 4173);
const previewOrigin = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    { name: 'riot_locale', value: 'EN', url: previewOrigin },
    { name: 'riot_locale', value: 'EN', url: `http://localhost:${port}` },
  ]);
});

/** First product handle from sitemap (locale-prefixed URLs). */
async function firstProductSlugFromSitemap(request: {
  get: (url: string) => Promise<{ ok: () => boolean; text: () => Promise<string> }>;
}): Promise<string> {
  const res = await request.get('/sitemap.xml');
  expect(res.ok()).toBeTruthy();
  const xml = await res.text();
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const tail = m[1].match(/\/products\/([^/?#]+)$/);
    if (tail?.[1]) return decodeURIComponent(tail[1]);
  }
  throw new Error('sitemap should list at least one /products/ URL');
}

test('語系前綴路由 /ja/ 與 /ja/products/:slug 為 200', async ({ page, request }) => {
  const slug = await firstProductSlugFromSitemap(request);
  const r1 = await page.goto('/ja/');
  expect(r1?.status()).toBe(200);
  const r2 = await page.goto(`/ja/products/${slug}`);
  expect(r2?.status()).toBe(200);
});

test('搜尋頁與商品頁可開且為 200', async ({ page, request }) => {
  const slug = await firstProductSlugFromSitemap(request);
  const r1 = await page.goto('/search');
  expect(r1?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: /SEARCH/i })).toBeVisible();

  const r2 = await page.goto(`/products/${slug}`);
  expect(r2?.status()).toBe(200);
  await expect(page.locator('h1').first()).toBeVisible({ timeout: 15_000 });
});

test('首頁加購 → 開購物車 → 關閉（桌面）', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#collection')).toBeVisible({ timeout: 25_000 });

  const addToBag = page.getByRole('button', { name: /SHOP|ADD TO BAG/i }).first();
  await addToBag.scrollIntoViewIfNeeded();
  await addToBag.click({ timeout: 15_000 });

  // addToCart() 會同步開啟抽屜；此時再點導覽列購物車會被抽屜擋住指標
  const dialog = page.getByRole('dialog', { name: /YOUR PIECES/i });
  await expect(dialog).toBeInViewport({ timeout: 10_000 });

  // 抽屜 DOM 在首次開啟後會保留（GSAP 移出畫面），toBeHidden 不適用
  await page.locator('[data-cart-close]').click();
  await expect(dialog).not.toBeInViewport({ timeout: 12_000 });

  const cartBtn = page.getByRole('button', { name: /Open shopping cart/i }).first();
  await cartBtn.click({ timeout: 10_000 });
  await expect(dialog).toBeInViewport({ timeout: 10_000 });

  await page.locator('[data-cart-close]').click();
  await expect(dialog).not.toBeInViewport({ timeout: 12_000 });
});

test('sitemap 回傳有效 XML', async ({ request }) => {
  const res = await request.get('/sitemap.xml');
  expect(res.ok()).toBeTruthy();
  const text = await res.text();
  expect(text).toContain('<urlset');
  expect(text).toContain('/search');
});
