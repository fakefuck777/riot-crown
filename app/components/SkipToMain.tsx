'use client';

import { useLocale } from '~/lib/LocaleContext';

export function SkipToMain() {
  const { t } = useLocale();
  return (
    <a href="#main-content" className="skip-to-main">
      {t.nav.skipToMain}
    </a>
  );
}
