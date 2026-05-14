import { useState, useEffect } from 'react';

interface InventoryData {
  available: number;
  total: number;
  lastUpdated: Date;
}

export function useRealTimeInventory(productId: string) {
  const [inventory, setInventory] = useState<InventoryData>({
    available: 0,
    total: 100,
    lastUpdated: new Date(),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        // 从 Shopify Storefront API 获取库存
        const response = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });

        if (!response.ok) throw new Error('Failed to fetch inventory');

        const data = await response.json();
        setInventory({
          available: data.available || 0,
          total: data.total || 100,
          lastUpdated: new Date(),
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        // 降级到模拟数据
        setInventory({
          available: Math.floor(Math.random() * 20) + 5,
          total: 100,
          lastUpdated: new Date(),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();

    // 每 30 秒更新一次库存
    const interval = setInterval(fetchInventory, 30000);
    return () => clearInterval(interval);
  }, [productId]);

  return { inventory, isLoading, error };
}
