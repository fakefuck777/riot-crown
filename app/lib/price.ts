/** Parse formatted display prices like `¥ 4,200` or `¥4200` into a number. */
export function parseDisplayPriceYen(price: string): number {
  const digits = price.replace(/[^\d.]/g, '');
  const n = parseFloat(digits);
  return Number.isFinite(n) ? n : 0;
}

export function sumCartLineTotals(
  items: { price: string; qty: number }[],
): number {
  return items.reduce((sum, item) => sum + parseDisplayPriceYen(item.price) * item.qty, 0);
}

/** Format JPY total using the active UI locale for digit grouping. */
export function formatYenTotal(amount: number, numberingLocale = 'en'): string {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  const formatted = safe.toLocaleString(numberingLocale, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  return `¥ ${formatted}`;
}
