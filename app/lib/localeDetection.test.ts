import { describe, it, expect } from 'vitest';
import { localeFromAcceptLanguage, localeFromCountry, localeFromLanguageTag, resolveLocaleForRequest } from './localeDetection';

describe('localeFromLanguageTag', () => {
  it('maps Chinese variants to ZH', () => {
    expect(localeFromLanguageTag('zh-TW')).toBe('ZH');
    expect(localeFromLanguageTag('zh-Hans')).toBe('ZH');
    expect(localeFromLanguageTag('zh-Hant')).toBe('ZH');
  });
  it('maps core languages', () => {
    expect(localeFromLanguageTag('ja')).toBe('JP');
    expect(localeFromLanguageTag('ko-KR')).toBe('KR');
    expect(localeFromLanguageTag('fr-CA')).toBe('FR');
    expect(localeFromLanguageTag('en-AU')).toBe('EN');
  });
});

describe('localeFromAcceptLanguage', () => {
  it('respects q weights', () => {
    expect(localeFromAcceptLanguage('en;q=0.3, ja;q=0.9')).toBe('JP');
  });
  it('returns null for unsupported', () => {
    expect(localeFromAcceptLanguage('de, it')).toBeNull();
  });
});

describe('localeFromCountry', () => {
  it('maps known countries', () => {
    expect(localeFromCountry('JP')).toBe('JP');
    expect(localeFromCountry('tw')).toBe('ZH');
    expect(localeFromCountry('FR')).toBe('FR');
  });
});

describe('resolveLocaleForRequest', () => {
  it('prefers URL slug over cookie', () => {
    const req = new Request('https://x.test/ja/products/01', {
      headers: {
        Cookie: 'riot_locale=EN',
      },
    });
    const r = resolveLocaleForRequest(req);
    expect(r.locale).toBe('JP');
    expect(r.shouldPersist).toBe(true);
  });

  it('does not persist when URL matches cookie', () => {
    const req = new Request('https://x.test/ja/', {
      headers: { Cookie: 'riot_locale=JP' },
    });
    const r = resolveLocaleForRequest(req);
    expect(r.locale).toBe('JP');
    expect(r.shouldPersist).toBe(false);
  });

  it('prefers cookie over headers when URL has no locale', () => {
    const req = new Request('https://x.test/', {
      headers: {
        Cookie:      'riot_locale=KR',
        'Accept-Language': 'ja,en;q=0.5',
        'cf-ipcountry': 'JP',
      },
    });
    const r = resolveLocaleForRequest(req);
    expect(r.locale).toBe('KR');
    expect(r.shouldPersist).toBe(false);
  });

  it('uses Accept-Language when no cookie', () => {
    const req = new Request('https://x.test/', {
      headers: { 'Accept-Language': 'fr-CH, de;q=0.2' },
    });
    const r = resolveLocaleForRequest(req);
    expect(r.locale).toBe('FR');
    expect(r.shouldPersist).toBe(true);
  });

  it('falls back to country when language unsupported', () => {
    const req = new Request('https://x.test/', {
      headers: {
        'Accept-Language': 'de-DE',
        'cf-ipcountry': 'KR',
      },
    });
    const r = resolveLocaleForRequest(req);
    expect(r.locale).toBe('KR');
    expect(r.shouldPersist).toBe(true);
  });

  it('defaults to EN', () => {
    const req = new Request('https://x.test/', {
      headers: { 'Accept-Language': 'de, pt' },
    });
    const r = resolveLocaleForRequest(req);
    expect(r.locale).toBe('EN');
    expect(r.shouldPersist).toBe(true);
  });
});
