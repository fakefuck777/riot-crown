'use client';
import { useMember } from '~/lib/MemberContext';

export function MemberBadge() {
  const { tier, totalSpent, discountPercentage, hasEarlyAccess } = useMember();

  const tierConfig = {
    none: {
      name: 'Riot Level 0',
      color: '#6ECBFF',
      next: '首次购买解锁 5% 折扣',
    },
    level1: {
      name: 'Riot Level 1',
      color: '#FF1293',
      next: '消费 $500 解锁 10% 折扣 + 抢先购买',
    },
    level2: {
      name: 'Riot Level 2',
      color: '#C9A84C',
      next: '消费 $1500 解锁 15% 折扣 + VIP 支持',
    },
    level3: {
      name: 'Riot Level 3',
      color: '#FF1493',
      next: '最高等级已解锁',
    },
  } as const;

  const currentTier = tierConfig[tier];

  return (
    <div
      className="inline-flex items-center gap-3 px-4 py-3 rounded-lg"
      style={{
        background: `linear-gradient(135deg, ${currentTier.color}20 0%, rgba(5,5,5,0.95) 100%)`,
        border: `1px solid ${currentTier.color}`,
        boxShadow: `0 0 20px ${currentTier.color}20`,
      }}
    >
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: currentTier.color }}
      />
      <div>
        <p className="text-sm font-bold uppercase tracking-widest" style={{ color: currentTier.color }}>
          {currentTier.name}
        </p>
        <p className="text-xs" style={{ color: 'rgba(242,242,242,0.7)' }}>
          已消费 ${totalSpent} • {discountPercentage}% 折扣
        </p>
        {hasEarlyAccess && (
          <p className="text-xs font-mono uppercase tracking-widest mt-1" style={{ color: '#6ECBFF' }}>
            ✓ 抢先购买已解锁
          </p>
        )}
      </div>
    </div>
  );
}
