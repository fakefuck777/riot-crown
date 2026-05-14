'use client';
import { useEffect, useState } from 'react';

interface OthersBuyingNotifProps {
  productName: string;
  count?: number;
}

export function OthersBuyingNotif({ productName, count = 3 }: OthersBuyingNotifProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCount, setActiveCount] = useState(count);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCount(Math.floor(Math.random() * 5) + 1);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 3000);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-2xl"
      style={{
        background: 'rgba(5,5,5,0.95)',
        border: '1px solid rgba(255,18,147,0.3)',
        boxShadow: '0 0 20px rgba(255,18,147,0.2)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
          style={{ backgroundColor: '#FF1293' }}
        />
        <div className="flex-1">
          <p className="text-sm font-bold text-white mb-1">
            其他人也在抢
          </p>
          <p className="text-xs" style={{ color: 'rgba(242,242,242,0.7)' }}>
            {activeCount} 位顾客正在查看 {productName}
          </p>
        </div>
      </div>
    </div>
  );
}
