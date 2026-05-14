'use client';
import { useState, useEffect } from 'react';

interface ConversionFunnelStep {
  name: string;
  count: number;
  percentage: number;
}

export function ConversionFunnelOptimizer() {
  const [funnelData, setFunnelData] = useState<ConversionFunnelStep[]>([
    { name: '页面浏览', count: 1000, percentage: 100 },
    { name: '产品查看', count: 750, percentage: 75 },
    { name: '加入购物车', count: 450, percentage: 45 },
    { name: '开始结账', count: 300, percentage: 30 },
    { name: '完成购买', count: 180, percentage: 18 },
  ]);

  // 实时更新转化数据
  useEffect(() => {
    const interval = setInterval(() => {
      setFunnelData((prev) =>
        prev.map((step) => ({
          ...step,
          count: Math.floor(step.count + (Math.random() - 0.4) * 10),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {funnelData.map((step, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-label text-y2k-blue font-bold">{step.name}</span>
            <span className="text-data text-y2k-pink font-bold">{step.percentage}%</span>
          </div>
          <div className="w-full h-2 bg-void-pit rounded overflow-hidden border border-y2k-pink/20">
            <div
              className="h-full bg-gradient-to-r from-y2k-pink to-y2k-purple transition-all duration-500"
              style={{ width: `${step.percentage}%` }}
            />
          </div>
          <p className="text-xs text-titanium/50">{step.count} 用户</p>
        </div>
      ))}
    </div>
  );
}
