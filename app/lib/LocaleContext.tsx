'use client';
/** Client UI locale. Storefront `i18n` is per-request in `server.ts` → `resolveStorefrontI18nForRequest`, not this file. */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { translations, type Locale, type Translations } from '~/lib/i18n';
import { serializeLocaleCookie } from '~/lib/localeCookie';

interface LocaleContextValue {
  locale:  Locale;
  t:       Translations;
  setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale:    'EN',
  t:         translations.EN,
  setLocale: () => {},
});

export function LocaleProvider({
  children,
  initialLocale = 'EN',
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    setLocaleState(initialLocale);
  }, [initialLocale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof document !== 'undefined') {
      document.cookie = serializeLocaleCookie(l);
    }
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
