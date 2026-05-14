'use client';
import { useEffect, useState } from 'react';

interface RecommendedProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  viewers: number;
}

export function OthersViewingNotif({ productId }: { productId: string }) {
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);

  useEffect(() => {
    // 模拟获取相关产品
    const mockProducts: RecommendedProduct[] = [
      {
        id: '1',
        name: '霓虹粉珍珠项链',
        price: '¥2999',
        image: '/products/neon-pink.jpg',
        viewers: Math.floor(Math.random() * 50) + 10,
      },
      {
        id: '2',
        name: '镀金铬珍珠手链',
        price: '¥1999',
        image: '/products/chrome-gold.jpg',
        viewers: Math.floor(Math.random() * 50) + 10,
      },
      {
        id: '3',
        name: '珍珠氧化戒指',
        price: '¥1499',
        image: '/products/oxidized.jpg',
        viewers: Math.floor(Math.random() * 50) + 10,
      },
    ];

    setRecommendations(mockProducts);
  }, [productId]);

  return (
    <div className="p-6 bg-void-pit rounded border border-y2k-blue/20">
      <h3 className="text-label uppercase tracking-wide text-y2k-blue mb-4">其他人也在看</h3>
      <div className="space-y-3">
        {recommendations.map((product) => (
          <div key={product.id} className="flex items-center gap-3 p-3 bg-void rounded hover:bg-void-plate transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-y2k-pink to-y2k-purple rounded flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-data font-bold text-titanium truncate">{product.name}</p>
              <p className="text-label text-y2k-pink">{product.price}</p>
            </div>
            <div className="text-xs text-y2k-blue font-bold flex-shrink-0">
              {product.viewers} 人看过
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
