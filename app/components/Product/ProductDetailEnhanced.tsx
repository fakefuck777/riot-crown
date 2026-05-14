'use client';
import { useState } from 'react';
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
  onAddToCart?: (product: Record<string, unknown>) => void;
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
        {/* Product Header - Enhanced */}
        <div className="mb-12">
          <p className="text-label uppercase tracking-ultra-wide text-y2k-blue mb-4 animate-pulse">
            ✨ {product.material}
          </p>
          <h1 className="text-5xl md:text-7xl font-black uppercase text-transparent bg-clip-text bg-neon-pink-purple mb-6"
            style={{
              textShadow: '0 0 40px rgba(255, 18, 147, 0.5), 0 0 80px rgba(255, 18, 147, 0.2)',
              letterSpacing: '0.05em'
            }}>
            {product.name}
          </h1>
          <div className="flex items-baseline gap-4 mb-8">
            <p className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-y2k-pink via-y2k-purple to-y2k-pink"
              style={{ textShadow: '0 0 30px rgba(255, 18, 147, 0.4)' }}>
              {product.price}
            </p>
            <p className="text-label text-y2k-blue/60 line-through">¥9999</p>
          </div>
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

            {/* Add to Cart Button - Enhanced */}
            <button
              onClick={handleAddToCart}
              className="w-full px-8 py-6 bg-gradient-to-r from-y2k-pink via-y2k-purple to-y2k-pink text-white font-black uppercase rounded text-lg transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group animate-pulse"
              style={{
                boxShadow: '0 0 40px rgba(255, 18, 147, 0.8), 0 0 80px rgba(255, 18, 147, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.15)',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                animationDuration: '2s',
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                💎 立即购买 💎
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:animate-pulse" />
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-3 bg-void-pit rounded border border-y2k-pink/20">
                <p className="text-y2k-pink font-bold">✓ 限量版</p>
                <p className="text-titanium/50 text-xs">仅剩 {product.stock || 12} 件</p>
              </div>
              <div className="p-3 bg-void-pit rounded border border-y2k-blue/20">
                <p className="text-y2k-blue font-bold">✓ 终身保修</p>
                <p className="text-titanium/50 text-xs">官方认证</p>
              </div>
            </div>

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
              <button className="flex-1 px-4 py-3 bg-void-pit border border-y2k-pink/30 text-y2k-pink font-bold uppercase rounded hover:border-y2k-pink/60 transition-all text-sm hover:bg-y2k-pink/10">
                ❤️ 收藏
              </button>
              <button className="flex-1 px-4 py-3 bg-void-pit border border-y2k-blue/30 text-y2k-blue font-bold uppercase rounded hover:border-y2k-blue/60 transition-all text-sm hover:bg-y2k-blue/10">
                📱 分享
              </button>
            </div>
          </div>
        </div>

        {/* Product Story Section - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Story */}
          <div className="p-8 bg-gradient-to-br from-void-pit to-void rounded border border-y2k-pink/30 hover:border-y2k-pink/60 transition-all duration-300"
            style={{
              boxShadow: '0 0 30px rgba(255, 18, 147, 0.1), inset 0 0 20px rgba(255, 18, 147, 0.05)'
            }}>
            <h2 className="text-display-lg font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-y2k-pink to-y2k-purple mb-6">
              👑 故事
            </h2>
            <div className="space-y-4 text-data text-titanium/70 leading-relaxed">
              <p>
                千禧年的废墟中，珍珠在液态金属的怀抱里重生。每一颗都承载着末世的绝望与重生的希望。
              </p>
              <p>
                被铬合金加冕，它不再是饰品，而是你崩坏后的王冠。戴上它，你就是 2000 年废墟里最后一个女王。
              </p>
              <p className="text-y2k-pink font-bold text-lg">
                限量到只剩你一个人的欲望。
              </p>
            </div>
          </div>

          {/* Care Instructions */}
          <div className="p-8 bg-gradient-to-br from-void-pit to-void rounded border border-y2k-blue/30 hover:border-y2k-blue/60 transition-all duration-300"
            style={{
              boxShadow: '0 0 30px rgba(107, 203, 255, 0.1), inset 0 0 20px rgba(107, 203, 255, 0.05)'
            }}>
            <h2 className="text-display-lg font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-y2k-blue to-y2k-purple mb-6">
              🛡️ 护理指南
            </h2>
            <ul className="space-y-3 text-data text-titanium/70">
              <li className="flex gap-3 hover:text-y2k-blue transition-colors">
                <span className="text-y2k-pink flex-shrink-0 font-bold">→</span>
                <span>避免长期接触水和汗液</span>
              </li>
              <li className="flex gap-3 hover:text-y2k-blue transition-colors">
                <span className="text-y2k-pink flex-shrink-0 font-bold">→</span>
                <span>定期用软布擦拭以保持光泽</span>
              </li>
              <li className="flex gap-3 hover:text-y2k-blue transition-colors">
                <span className="text-y2k-pink flex-shrink-0 font-bold">→</span>
                <span>存放在干燥、阴凉的地方</span>
              </li>
              <li className="flex gap-3 hover:text-y2k-blue transition-colors">
                <span className="text-y2k-pink flex-shrink-0 font-bold">→</span>
                <span>避免与化学物质接触</span>
              </li>
              <li className="flex gap-3 hover:text-y2k-blue transition-colors">
                <span className="text-y2k-pink flex-shrink-0 font-bold">→</span>
                <span>如有损伤，请联系我们的工坊进行修复</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Manifesto - Enhanced */}
        <div className="p-8 md:p-12 bg-gradient-to-r from-y2k-pink/15 via-y2k-purple/15 to-y2k-pink/15 rounded border border-y2k-pink/40 mb-12 relative overflow-hidden"
          style={{
            boxShadow: '0 0 40px rgba(255, 18, 147, 0.2), inset 0 0 30px rgba(255, 18, 147, 0.05)'
          }}>
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, #FF1293 0%, transparent 50%)',
            }} />
          <h2 className="text-4xl md:text-5xl font-black uppercase text-transparent bg-clip-text bg-neon-pink-purple mb-6 relative z-10">
            ⚡ 宣言
          </h2>
          <p className="text-lg md:text-xl text-titanium/80 leading-relaxed relative z-10 font-semibold">
            这不是饰品，是你崩坏后的王冠。戴上它，你就是 2000 年废墟里最后一个女王。每一件 RIOT CROWN 都是独一无二的艺术品，承载着千禧年的绝望与重生的希望。
            <span className="text-y2k-pink font-black"> 限量到只剩你一个人的欲望。</span>
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
