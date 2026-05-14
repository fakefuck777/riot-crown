import { useEffect, useState } from 'react';
import { useLocale } from '~/lib/LocaleContext';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('riot_wishlist') || '[]');
    setWishlist(saved);
  }, []);

  return (
    <main className="min-h-screen bg-void pt-32 pb-16">
      <div className="max-w-6xl mx-auto px-8">
        <h1 className="text-5xl md:text-7xl font-black uppercase mb-8" style={{ color: '#FF1293' }}>
          我的收藏
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg mb-6" style={{ color: 'rgba(242,242,242,0.7)' }}>
              你还没有收藏任何商品
            </p>
            <a
              href="/collections"
              className="inline-block px-8 py-3 font-bold uppercase tracking-wider rounded"
              style={{
                background: 'linear-gradient(135deg, #FF1293 0%, #FF0080 100%)',
                color: '#fff',
              }}
            >
              浏览系列
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((productId) => (
              <div
                key={productId}
                className="p-6 rounded-lg border"
                style={{
                  background: 'rgba(5,5,5,0.8)',
                  borderColor: 'rgba(255,18,147,0.2)',
                }}
              >
                <p className="text-sm font-mono uppercase tracking-widest mb-4" style={{ color: '#6ECBFF' }}>
                  {productId}
                </p>
                <button
                  className="w-full px-4 py-2 font-bold uppercase text-sm rounded"
                  style={{
                    background: 'linear-gradient(135deg, #FF1293 0%, #FF0080 100%)',
                    color: '#fff',
                  }}
                >
                  加入购物车
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Share Section */}
        {wishlist.length > 0 && (
          <div className="mt-16 p-8 rounded-lg border" style={{ borderColor: 'rgba(255,18,147,0.2)' }}>
            <h2 className="text-2xl font-black uppercase mb-4" style={{ color: '#FF1293' }}>
              分享你的收藏
            </h2>
            <div className="flex gap-4 flex-wrap">
              <button
                className="px-6 py-2 font-bold uppercase text-sm rounded"
                style={{
                  background: 'rgba(255,18,147,0.1)',
                  border: '1px solid #FF1293',
                  color: '#FF1293',
                }}
              >
                分享到 Instagram
              </button>
              <button
                className="px-6 py-2 font-bold uppercase text-sm rounded"
                style={{
                  background: 'rgba(255,18,147,0.1)',
                  border: '1px solid #FF1293',
                  color: '#FF1293',
                }}
              >
                分享到 TikTok
              </button>
              <button
                className="px-6 py-2 font-bold uppercase text-sm rounded"
                style={{
                  background: 'rgba(255,18,147,0.1)',
                  border: '1px solid #FF1293',
                  color: '#FF1293',
                }}
              >
                复制链接
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
