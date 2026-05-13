import { describe, expect, it } from 'vitest';
import {
  localeFromUrlSlug,
  stripLeadingLocaleFromPathname,
  withLocalePath,
} from './localePath';

describe('localeFromUrlSlug', () => {
  it('maps known slugs', () => {
    expect(localeFromUrlSlug('ja')).toBe('JP');
    expect(localeFromUrlSlug('ZH')).toBe('ZH');
    expect(localeFromUrlSlug('en')).toBe('EN');
  });
  it('returns null for unknown', () => {
    expect(localeFromUrlSlug('de')).toBeNull();
    expect(localeFromUrlSlug(undefined)).toBeNull();
  });
});

describe('stripLeadingLocaleFromPathname', () => {
  it('strips one locale segment', () => {
    expect(stripLeadingLocaleFromPathname('/ja/products/01')).toEqual({
      leadingLocale: 'JP',
      restPath: '/products/01',
    });
  });
  it('leaves unsegmented product paths', () => {
    expect(stripLeadingLocaleFromPathname('/products/01')).toEqual({
      leadingLocale: null,
      restPath: '/products/01',
    });
  });
});

describe('withLocalePath', () => {
  it('prefixes non-EN locales', () => {
    expect(withLocalePath('JP', '/products/01')).toBe('/ja/products/01');
    expect(withLocalePath('JP', '/')).toBe('/ja');
  });
  it('keeps EN unprefixed', () => {
    expect(withLocalePath('EN', '/products/01')).toBe('/products/01');
    expect(withLocalePath('EN', '/')).toBe('/');
  });
});
