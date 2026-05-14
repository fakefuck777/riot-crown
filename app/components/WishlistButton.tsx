'use client';
import { useState, useEffect } from 'react';
import { useLocale } from '~/lib/LocaleContext';

interface WishlistButtonProps {
  productId: string;
  onToggle?: (isWishlisted: boolean) => void;
}

export function WishlistButton({ productId, onToggle }: WishlistButtonProps) {
  const { t } = useLocale();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('riot_wishlist') || '[]');
    setIsWishlisted(wishlist.includes(productId));
  }, [productId]);

  const handleToggle = () => {
    const wishlist = JSON.parse(localStorage.getItem('riot_wishlist') || '[]');
    let updated: string[];

    if (isWishlisted) {
      updated = wishlist.filter((id: string) => id !== productId);
    } else {
      updated = [...wishlist, productId];
    }

    localStorage.setItem('riot_wishlist', JSON.stringify(updated));
    setIsWishlisted(!isWishlisted);
    onToggle?.(!isWishlisted);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className="px-4 py-2 border border-gray-600 text-gray-300 font-bold uppercase text-sm rounded hover:border-pink-500 hover:text-pink-500 transition-all"
        style={{
          borderColor: isWishlisted ? '#FF1293' : 'rgba(75,85,99,0.5)',
          color: isWishlisted ? '#FF1293' : 'rgba(242,242,242,0.7)',
        }}
      >
        {isWishlisted ? '♥' : '♡'} {t.product.covet}
      </button>

      {showToast && (
        <div
          className="fixed bottom-4 left-4 px-4 py-2 rounded text-sm font-mono"
          style={{
            background: 'rgba(5,5,5,0.95)',
            border: '1px solid #FF1293',
            color: '#FF1293',
            boxShadow: '0 0 15px rgba(255,18,147,0.3)',
          }}
        >
          {isWishlisted ? '✓ Added to Wishlist' : '✓ Removed from Wishlist'}
        </div>
      )}
    </>
  );
}
