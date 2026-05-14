'use client';
import { useState } from 'react';
import { ProductModel } from '~/components/3D/ProductModel';
import { ARTryOn } from '~/components/3D/ARTryOn';
import { ScarcityEngine } from '~/components/Marketing/ScarcityEngine';

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    price: string;
    description: string;
    totalStock: number;
    soldCount: number;
    launchDate?: Date;
  };
}

export function ProductDetail3D({ product }: ProductDetailProps) {
  const [showAR, setShowAR] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState('pearl_glossy');

  const handleARClick = () => {
    setShowAR(true);
  };

  const handleARClose = () => {
    setShowAR(false);
  };

  if (showAR) {
    return <ARTryOn productName={product.name} onClose={handleARClose} />;
  }

  return (
    <div className="w-full bg-void py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Product Header */}
        <div className="mb-12">
          <h1 className="text-display-xl font-black uppercase text-transparent bg-clip-text bg-neon-pink-purple mb-4"
            style={{ textShadow: '0 0 30px rgba(255, 18, 147, 0.3)' }}>
            {product.name}
          </h1>
          <p className="text-label uppercase tracking-ultra-wide text-y2k-blue mb-6">
            {product.description}
          </p>
          <p className="text-display-lg font-black text-y2k-pink">{product.price}</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* 3D Model */}
          <div className="lg:col-span-2">
            <ProductModel
              productName={product.name}
              onMaterialChange={setSelectedMaterial}
              onARClick={handleARClick}
            />
          </div>

          {/* Scarcity & Info */}
          <div className="space-y-6">
            <ScarcityEngine
              productName={product.name}
              totalStock={product.totalStock}
              soldCount={product.soldCount}
              launchDate={product.launchDate}
            />

            {/* Add to Cart Button */}
            <button
              className="w-full px-6 py-4 bg-gradient-to-r from-y2k-pink to-y2k-purple text-white font-bold uppercase rounded transition-all hover:shadow-neon-pink"
              onClick={() => {
                // Trigger add to cart event
                window.dispatchEvent(new CustomEvent('riot:addToCart', {
                  detail: {
                    productId: product.id,
                    productName: product.name,
                    material: selectedMaterial,
                  },
                }));
              }}
            >
              加入购物车
            </button>

            {/* Product Details */}
            <div className="p-6 bg-void-pit rounded border border-y2k-pink/20">
              <h3 className="text-label uppercase tracking-wide text-y2k-blue mb-4">产品信息</h3>
              <div className="space-y-3 text-data text-titanium/70">
                <div className="flex justify-between">
                  <span>材质</span>
                  <span className="text-y2k-pink font-bold">珍珠 + 铬合金</span>
                </div>
                <div className="flex justify-between">
                  <span>尺寸</span>
                  <span className="text-y2k-blue font-bold">可调节</span>
                </div>
                <div className="flex justify-between">
                  <span>包装</span>
                  <span className="text-y2k-acid font-bold">黑盒限量版</span>
                </div>
                <div className="flex justify-between">
                  <span>保修</span>
                  <span className="text-y2k-purple font-bold">终身保修</span>
                </div>
              </div>
            </div>

            {/* Wishlist & Share */}
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-3 bg-void-pit border border-y2k-pink/30 text-y2k-pink font-bold uppercase rounded hover:border-y2k-pink/60 transition-all">
                ❤️ 收藏
              </button>
              <button className="flex-1 px-4 py-3 bg-void-pit border border-y2k-blue/30 text-y2k-blue font-bold uppercase rounded hover:border-y2k-blue/60 transition-all">
                📱 分享
              </button>
            </div>
          </div>
        </div>

        {/* Product Story */}
        <div className="p-8 bg-void-pit rounded border border-y2k-pink/20 mb-12">
          <h2 className="text-display-lg font-black uppercase text-y2k-pink mb-6">故事</h2>
          <div className="space-y-4 text-data text-titanium/70 leading-relaxed">
            <p>
              千禧年的废墟中，珍珠在液态金属的怀抱里重生。每一颗都承载着末世的绝望与重生的希望。
            </p>
            <p>
              被铬合金加冕，它不再是饰品，而是你崩坏后的王冠。戴上它，你就是 2000 年废墟里最后一个女王。
            </p>
            <p>
              限量到只剩你一个人的欲望。这是 RIOT CROWN 对每一位选择者的承诺。
            </p>
          </div>
        </div>

        {/* Care Instructions */}
        <div className="p-8 bg-void-pit rounded border border-y2k-blue/20">
          <h2 className="text-display-lg font-black uppercase text-y2k-blue mb-6">护理指南</h2>
          <ul className="space-y-3 text-data text-titanium/70">
            <li>• 避免长期接触水和汗液</li>
            <li>• 定期用软布擦拭以保持光泽</li>
            <li>• 存放在干燥、阴凉的地方</li>
            <li>• 避免与化学物质接触</li>
            <li>• 如有损伤，请联系我们的工坊进行修复</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
