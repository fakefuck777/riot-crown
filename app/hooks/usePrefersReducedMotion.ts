import { useState, useEffect } from 'react';

/**
 * 首屏必須與 SSR 一致：初始為 false，客戶端 mount 後再讀 matchMedia。
 * 若用 useSyncExternalStore 且 getServerSnapshot 恒為 false，而用戶開啟「減少動態效果」時
 * 客戶端首幀即為 true，會導致 GraffitiCanvas 在服務端與客戶端渲染不同樹，觸發 React #418/#425 水合失敗。
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return reduced;
}
