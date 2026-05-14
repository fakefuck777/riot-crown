'use client';
import { useState, useEffect } from 'react';
import { ProductModel } from '~/components/3D/ProductModel';
import { ARTryOn } from '~/components/3D/ARTryOn';
import { ScarcityEngine } from '~/components/Marketing/ScarcityEngine';
import { OthersBuyingNotif } from '~/components/Marketing/OthersBuyingNotif';
import { BlackBoxAnimation } from '~/components/Marketing/BlackBoxAnimation';

interface ProductDetailEnhancedProps {
  product: {
    id: string;
    name: string;
    price: string;
    description: string;
    material: string;
    stock?: number;
    totalStock?: number;
    soldCount?: number;
    launchDate?: Date;
  };
  onAddToCart?: (product: any) => void;
}

export function ProductDetailEnhanced({ product, onAddToCart }: ProductDetailEnhancedProps) {
  const [showAR, setShowAR] = useState(false);
  const [showBlackBox, setShowBlackBox] = useState(false);
  const [showOthersBuying, setShowOthersBuying] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState('pearl_glossy');

  const handleAddToCart = () => {
    // Trigger "others buying" notification
    setShowOthersBuying(true);
    setTimeout(() => setShowOthersBuying(false), 8000);

    // Show black box animation after 2 seconds
    setTimeout(() => setShowBlackBox(true), 2000);

    // Call parent handler
    onAddToCart?.({
      productId: product.id,
      productName: product.name,
      material: selectedMaterial,
    });
  };

  if (showAR) {
    return <ARTryOn productName={product.name} onClose={() => setShowAR(false)} />;
  }

  return (
    <div className="w-full bg-void py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Product Header */}
        <div className="mb-12">
          <p className="text-label uppercase tracking-ultra-wide text-y2k-blue mb-4">
            {product.material}
          </p>
          <h1 className="text-display-xl font-black uppercase text-transparent bg-clip-text bg-neon-pink-purple mb-4"
            style={{ textShadow: '0 0 30px rgba(255, 18, 147, 0.3)' }}>
            {product.name}
          </h1>
          <p className="text-display-lg font-black text-y2k-pink mb-6">{product.price}</p>
          <p className="text-data text-titanium/70 max-w-2xl leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* 3D Model - Left */}
          <div className="lg:col-span-2">
            <ProductModel
              productName={product.name}
              onMaterialChange={setSelectedMaterial}
              onARClick={() => setShowAR(true)}
            />
          </div>

          {/* Scarcity & Actions - Right */}
          <div className="space-y-6">
            {/* Scarcity Engine */}
            <ScarcityEngine
              productName={product.name}
              totalStock={product.totalStock || 100}
              soldCount={product.soldCount || 0}
              launchDate={product.launchDate}
            />

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full px-6 py-4 bg-gradient-to-r from-y2k-pink to-y2k-purple text-white font-bold uppercase rounded transition-all hover:shadow-neon-pink active:scale-95"
              style={{
                boxShadow: '0 0 20px rgba(255, 18, 147, 0.3)',
              }}
            >
              💎 加入购物车
            </button>

            {/* Product Info Card */}
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
              <button className="flex-1 px-4 py-3 bg-void-pit border border-y2k-pink/30 text-y2k-pink font-bold uppercase rounded hover:border-y2k-pink/60 transition-all text-sm">
                ❤️ 收藏
              </button>
              <button className="flex-1 px-4 py-3 bg-void-pit border border-y2k-blue/30 text-y2k-blue font-bold uppercase rounded hover:border-y2k-blue/60 transition-all text-sm">
                📱 分享
              </button>
            </div>
          </div>
        </div>

        {/* Product Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Story */}
          <div className="p-8 bg-void-pit rounded border border-y2k-pink/20">
            <h2 className="text-display-lg font-black uppercase text-y2k-pink mb-6">故事</h2>
            <div className="space-y-4 text-data text-titanium/70 leading-relaxed">
              <p>
                千禧年的废墟中，珍珠在液态金属的怀抱里重生。每一颗都承载着末世的绝望与重生的希望。
              </p>
              <p>
                被铬合金加冕，它不再是饰品，而是你崩坏后的王冠。戴上它，你就是 2000 年废墟里最后一个女王。
              </p>
              <p className="text-y2k-pink font-bold">
                限量到只剩你一个人的欲望。
              </p>
            </div>
          </div>

          {/* Care Instructions */}
          <div className="p-8 bg-void-pit rounded border border-y2k-blue/20">
            <h2 className="text-display-lg font-black uppercase text-y2k-blue mb-6">护理指南</h2>
            <ul className="space-y-3 text-data text-titanium/70">
              <li className="flex gap-3">
                <span className="text-y2k-pink flex-shrink-0">•</span>
                <span>避免长期接触水和汗液</span>
              </li>
              <li className="flex gap-3">
                <span className="text-y2k-pink flex-shrink-0">•</span>
                <span>定期用软布擦拭以保持光泽</span>
              </li>
              <li className="flex gap-3">
                <span className="text-y2k-pink flex-shrink-0">•</span>
                <span>存放在干燥、阴凉的地方</span>
              </li>
              <li className="flex gap-3">
                <span className="text-y2k-pink flex-shrink-0">•</span>
                <span>避免与化学物质接触</span>
              </li>
              <li className="flex gap-3">
                <span className="text-y2k-pink flex-shrink-0">•</span>
                <span>如有损伤，请联系我们的工坊进行修复</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Manifesto */}
        <div className="p-8 bg-gradient-to-r from-y2k-pink/10 to-y2k-purple/10 rounded border border-y2k-pink/30 mb-12">
          <h2 className="text-display-lg font-black uppercase text-transparent bg-clip-text bg-neon-pink-purple mb-6">
            宣言
          </h2>
          <p className="text-data text-titanium/70 leading-relaxed">
            这不是饰品，是你崩坏后的王冠。戴上它，你就是 2000 年废墟里最后一个女王。每一件 RIOT CROWN 都是独一无二的艺术品，承载着千禧年的绝望与重生的希望。限量到只剩你一个人的欲望。
          </p>
        </div>
      </div>

      {/* Modals */}
      {showBlackBox && (
        <BlackBoxAnimation
          productName={product.name}
          onClose={() => setShowBlackBox(false)}
        />
      )}

      {/* Others Buying Notification */}
      <OthersBuyingNotif
        productName={product.name}
        isVisible={showOthersBuying}
        onClose={() => setShowOthersBuying(false)}
      />
    </div>
  );
}
