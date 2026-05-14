'use client';
import { useState, useEffect } from 'react';

interface BundleRecommendationProps {
  mainProductName: string;
  onBundleAdd?: (bundleId: string) => void;
}

export function BundleRecommendation({ mainProductName, onBundleAdd }: BundleRecommendationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleAddToCart = () => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 5000);
    };

    window.addEventListener('riot:addToCart', handleAddToCart);
    return () => window.removeEventListener('riot:addToCart', handleAddToCart);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 max-w-sm p-6 rounded-lg"
      style={{
        background: 'linear-gradient(135deg, rgba(5,5,5,0.98) 0%, rgba(13,13,30,0.98) 100%)',
        border: '1px solid rgba(255,18,147,0.2)',
        boxShadow: '0 0 40px rgba(255,18,147,0.15)',
      }}
    >
      <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: '#6ECBFF' }}>
        灵魂伴侣
      </p>
      <h3 className="text-lg font-black uppercase mb-2" style={{ color: '#FF1293' }}>
        Chrome Choker
      </h3>
      <p className="text-sm mb-4" style={{ color: 'rgba(242,242,242,0.7)' }}>
        完美搭配你的 {mainProductName}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => {
            onBundleAdd?.('chrome-choker');
            setIsVisible(false);
          }}
          className="flex-1 px-4 py-2 font-bold uppercase text-sm rounded transition-all"
          style={{
            background: 'linear-gradient(135deg, #FF1293 0%, #FF0080 100%)',
            color: '#fff',
            boxShadow: '0 0 15px rgba(255,18,147,0.3)',
          }}
        >
          ADD TO CART
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="px-4 py-2 border border-gray-600 text-gray-300 font-bold uppercase text-sm rounded hover:border-pink-500 transition-all"
        >
          跳过
        </button>
      </div>
    </div>
  );
}
