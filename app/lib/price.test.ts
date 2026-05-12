import { describe, it, expect } from 'vitest';
import { formatYenTotal, parseDisplayPriceYen, sumCartLineTotals } from './price';

describe('parseDisplayPriceYen', () => {
  it('parses yen with comma and symbol', () => {
    expect(parseDisplayPriceYen('¥ 4,200')).toBe(4200);
  });
  it('returns 0 for empty', () => {
    expect(parseDisplayPriceYen('')).toBe(0);
  });
});

describe('formatYenTotal', () => {
  it('formats with locale grouping', () => {
    expect(formatYenTotal(4200, 'en-US')).toBe('¥ 4,200');
  });
  it('guards non-finite', () => {
    expect(formatYenTotal(Number.NaN)).toBe('¥ 0');
  });
});

describe('sumCartLineTotals', () => {
  it('sums lines', () => {
    expect(
      sumCartLineTotals([
        { price: '¥ 1,000', qty: 2 },
        { price: '¥500', qty: 1 },
      ]),
    ).toBe(2500);
  });
});
