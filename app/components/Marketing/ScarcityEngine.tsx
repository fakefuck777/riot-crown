'use client';
import { useState, useEffect } from 'react';

interface ScarcityEngineProps {
  productName: string;
  totalStock: number;
  soldCount: number;
  launchDate?: Date;
}

export function ScarcityEngine({ _productName, totalStock, soldCount, launchDate }: ScarcityEngineProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [stockPercent, setStockPercent] = useState(0);
  const [_showUrgency, setShowUrgency] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      if (!launchDate) return;

      const now = new Date();
      const diff = launchDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('已上线');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}天${hours}小时`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}小时${minutes}分钟`);
      } else {
        setTimeLeft(`${minutes}分钟`);
        setShowUrgency(true);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [launchDate]);

  useEffect(() => {
    const percent = (soldCount / totalStock) * 100;
    setStockPercent(Math.min(percent, 100));
  }, [soldCount, totalStock]);

  const remaining = totalStock - soldCount;
  const isLowStock = remaining <= 5;
  const isSoldOut = remaining <= 0;

  return (
    <div className="space-y-4">
      {/* Urgency Text */}
      <div className="p-4 bg-gradient-to-r from-y2k-pink/10 to-y2k-purple/10 rounded border border-y2k-pink/30">
        <p className="text-display-lg font-black uppercase text-transparent bg-clip-text bg-neon-pink-purple animate-neon-flicker">
          {isSoldOut ? '已售罄' : isLowStock ? '仅剩最后机会' : '限量珍藏'}
        </p>
        <p className="text-data text-titanium/70 mt-2">
          {isSoldOut
            ? '这个系列已经成为传说。下一个限量系列即将诞生。'
            : isLowStock
            ? `仅剩 ${remaining} 件。你是最后的女王吗？`
            : `已有 ${soldCount} 人选择成为 RIOT CROWN 的一部分`}
        </p>
      </div>

      {/* Stock Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-label uppercase tracking-wide text-y2k-blue">库存进度</span>
          <span className="text-data font-bold text-y2k-pink">{remaining} / {totalStock}</span>
        </div>
        <div className="w-full h-2 bg-void-pit rounded overflow-hidden border border-y2k-pink/20">
          <div
            className={`h-full transition-all duration-500 ${
              isLowStock
                ? 'bg-gradient-to-r from-y2k-red to-y2k-pink animate-pulse'
                : 'bg-gradient-to-r from-y2k-pink to-y2k-purple'
            }`}
            style={{ width: `${stockPercent}%` }}
          />
        </div>
      </div>

      {/* Countdown */}
      {launchDate && timeLeft !== '已上线' && (
        <div className="p-4 bg-void-pit rounded border border-y2k-blue/20">
          <p className="text-label uppercase tracking-wide text-y2k-blue mb-2">限时上线</p>
          <p className="text-display-lg font-black text-y2k-acid animate-pulse">{timeLeft}</p>
        </div>
      )}

      {/* Call to Action */}
      <div className="p-4 bg-gradient-to-r from-y2k-pink/20 to-y2k-purple/20 rounded border border-y2k-pink/40">
        <p className="text-data text-titanium font-bold mb-3">
          💎 <span className="text-y2k-pink">这不是饰品，是你崩坏后的王冠</span>
        </p>
        <p className="text-label text-titanium/70">
          戴上它，你就是 2000 年废墟里最后一个女王。
        </p>
      </div>

      {/* Social Proof */}
      <div className="p-4 bg-void-pit rounded border border-y2k-blue/20">
        <p className="text-label uppercase tracking-wide text-y2k-blue mb-3">其他人也在抢</p>
        <div className="space-y-2">
          {[
            { name: '匿名用户', action: '刚刚加入购物车' },
            { name: '女王 #2847', action: '5 分钟前下单' },
            { name: '废墟猎人', action: '10 分钟前购买' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-data text-titanium/70">
              <div className="w-2 h-2 rounded-full bg-y2k-pink animate-pulse" />
              <span>{item.name}</span>
              <span className="text-y2k-blue">{item.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
