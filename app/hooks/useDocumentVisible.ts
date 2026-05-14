import { useState, useEffect } from 'react';

/**
 * False while tab is hidden — pause expensive loops (WebGL).
 * Initial `true` matches SSR (no `document`) and the first client paint, then sync in `useEffect`
 * so we never derive visibility from `document` during render (avoids rare hydration mismatches).
 */
export function useDocumentVisible(): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(!document.hidden);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return visible;
}
