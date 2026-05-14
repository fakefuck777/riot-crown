'use client';
import { useState, useEffect } from 'react';

interface PurchaseNotification {
  id: string;
  userName: string;
  action: string;
  timestamp: Date;
  avatar?: string;
}

export function useRealtimePurchaseNotifications(productId: string) {
  const [notifications, setNotifications] = useState<PurchaseNotification[]>([]);

  useEffect(() => {
    // 模拟实时购买通知（实际应该用 WebSocket）
    const generateNotification = () => {
      const actions = ['刚刚加入购物车', '5 分钟前下单', '10 分钟前购买', '刚刚浏览'];
      const names = ['女王 #' + Math.floor(Math.random() * 9999), '匿名用户', '废墟猎人', '千禧年收藏家'];

      const notification: PurchaseNotification = {
        id: Math.random().toString(36),
        userName: names[Math.floor(Math.random() * names.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        timestamp: new Date(),
      };

      setNotifications((prev) => {
        const updated = [notification, ...prev];
        // 只保留最近 5 条
        return updated.slice(0, 5);
      });
    };

    // 每 3-8 秒生成一条通知
    const interval = setInterval(() => {
      generateNotification();
    }, Math.random() * 5000 + 3000);

    return () => clearInterval(interval);
  }, [productId]);

  return notifications;
}
