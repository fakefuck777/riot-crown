import { describe, it, expect } from 'vitest';
import { getStorefrontI18n, resolveStorefrontI18nForRequest } from './storefrontI18n';

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

describe('resolveStorefrontI18nForRequest', () => {
  it('maps /ja/... to JA + JP', () => {
    const req = new Request('https://x.test/ja/products/foo');
    expect(resolveStorefrontI18nForRequest(req, {})).toEqual({ language: 'JA', country: 'JP' });
  });

  it('uses riot_locale cookie when path has no locale prefix', () => {
    const req = new Request('https://x.test/products/foo', {
      headers: { Cookie: 'riot_locale=KR' },
    });
    expect(resolveStorefrontI18nForRequest(req, {})).toEqual({ language: 'KO', country: 'KR' });
  });

  it('prefers URL locale over cookie', () => {
    const req = new Request('https://x.test/fr/', {
      headers: { Cookie: 'riot_locale=JP' },
    });
    expect(resolveStorefrontI18nForRequest(req, {})).toEqual({ language: 'FR', country: 'FR' });
  });

  it('falls back to env when EN and no cookie', () => {
    const req = new Request('https://x.test/');
    expect(
      resolveStorefrontI18nForRequest(req, {
        PUBLIC_STOREFRONT_LANGUAGE: 'JA',
        PUBLIC_STOREFRONT_COUNTRY: 'JP',
      }),
    ).toEqual({ language: 'JA', country: 'JP' });
  });

  it('uses session overrides when URL is EN-default and cookie absent', () => {
    const req = new Request('https://x.test/');
    const session = {
      get: (k: string) => (k === 'storefront_country' ? 'us' : k === 'storefront_language' ? 'en' : null),
    };
    expect(resolveStorefrontI18nForRequest(req, {}, session)).toEqual({ language: 'EN', country: 'US' });
  });

  it('URL locale wins over session when both present', () => {
    const req = new Request('https://x.test/ja/products/x');
    const session = {
      get: (k: string) => (k === 'storefront_country' ? 'us' : k === 'storefront_language' ? 'en' : null),
    };
    expect(resolveStorefrontI18nForRequest(req, {}, session)).toEqual({ language: 'JA', country: 'JP' });
  });
});
