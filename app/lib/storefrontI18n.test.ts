import { describe, it, expect } from 'vitest';
import { getStorefrontI18n } from './storefrontI18n';

describe('getStorefrontI18n', () => {
  it('defaults to EN / US when unset', () => {
    expect(getStorefrontI18n({})).toEqual({ language: 'EN', country: 'US' });
  });

  it('trims and uppercases env', () => {
    expect(
      getStorefrontI18n({
        PUBLIC_STOREFRONT_LANGUAGE: ' ja ',
        PUBLIC_STOREFRONT_COUNTRY: ' jp ',
      }),
    ).toEqual({ language: 'JA', country: 'JP' });
  });
});
