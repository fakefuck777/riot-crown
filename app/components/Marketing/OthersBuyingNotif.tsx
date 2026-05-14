'use client';
import { useState, useEffect } from 'react';

interface OthersBuyingNotifProps {
  productName: string;
  isVisible: boolean;
  onClose?: () => void;
}

export function OthersBuyingNotif({ productName, isVisible, onClose }: OthersBuyingNotifProps) {
  const [notifications, setNotifications] = useState<Array<{ id: string; name: string; action: string }>>([]);

  useEffect(() => {
    if (!isVisible) return;

    // Simulate real-time notifications
    const names = ['匿名用户', '女王 #2847', '废墟猎人', '夜店女孩', '千禧年幽灵', '液态金属迷'];
    const actions = ['刚刚加入购物车', '5 分钟前下单', '10 分钟前购买', '正在查看'];

    const interval = setInterval(() => {
      const newNotif = {
        id: Math.random().toString(),
        name: names[Math.floor(Math.random() * names.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
      };
      setNotifications(prev => [newNotif, ...prev.slice(0, 4)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-40 max-w-sm">
      <div className="p-6 bg-void-pit rounded border border-y2k-pink/40 backdrop-blur-sm"
        style={{
          boxShadow: '0 0 30px rgba(255, 18, 147, 0.2)',
          animation: 'slideInRight 0.4s ease-out',
        }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-label uppercase tracking-wide text-y2k-pink font-bold">
            其他人也在抢
          </p>
          <button
            onClick={onClose}
            className="text-titanium/50 hover:text-titanium transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className="flex items-center gap-2 p-2 bg-void rounded border border-y2k-pink/20 animate-fadeIn"
            >
              <div className="w-2 h-2 rounded-full bg-y2k-pink animate-pulse flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-data text-titanium font-bold truncate">{notif.name}</p>
                <p className="text-label text-y2k-blue/70 truncate">{notif.action}</p>
              </div>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes slideInRight {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
