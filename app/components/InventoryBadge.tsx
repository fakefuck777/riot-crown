'use client';
import { useMemo } from 'react';

interface InventoryBadgeProps {
  quantity: number;
  maxQuantity?: number;
  showPercentage?: boolean;
}

export function InventoryBadge({ quantity, maxQuantity = 100, showPercentage = true }: InventoryBadgeProps) {
  const { color, message } = useMemo(() => {
    const percentage = (quantity / maxQuantity) * 100;

    if (quantity === 0) {
      return {
        status: 'SOLD_OUT',
        color: '#8B0000',
        message: '已售罄',
      };
    }

    if (quantity <= 5) {
      return {
        status: 'CRITICAL',
        color: '#FF1293',
        message: `仅剩 ${quantity} 件`,
      };
    }

    if (percentage <= 25) {
      return {
        status: 'LOW',
        color: '#FF6B35',
        message: `仅剩 ${quantity} 件`,
      };
    }

    if (percentage <= 50) {
      return {
        status: 'MEDIUM',
        color: '#FFB703',
        message: '销售中',
      };
    }

    return {
      status: 'AVAILABLE',
      color: '#6ECBFF',
      message: '现货充足',
    };
  }, [quantity, maxQuantity]);

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-2 rounded text-xs font-mono uppercase tracking-widest"
      style={{
        backgroundColor: `${color}20`,
        border: `1px solid ${color}`,
        color: color,
      }}
    >
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      {message}
      {showPercentage && quantity > 0 && (
        <span style={{ opacity: 0.7 }}>
          ({Math.round((quantity / maxQuantity) * 100)}%)
        </span>
      )}
    </div>
  );
}
