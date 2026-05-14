import { useMember } from '~/lib/MemberContext';
import { MemberBadge } from '~/components/MemberBadge';
import { ExclusiveCollection } from '~/components/ExclusiveCollection';

export default function MemberDashboard() {
  const { tier, totalSpent, discountPercentage, hasEarlyAccess } = useMember();

  return (
    <main className="min-h-screen bg-void pt-32 pb-16">
      <div className="max-w-6xl mx-auto px-8">
        <h1 className="text-5xl md:text-7xl font-black uppercase mb-8" style={{ color: '#FF1293' }}>
          Riot Dashboard
        </h1>

        <div className="mb-8">
          <MemberBadge />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div
            className="p-6 rounded-lg border"
            style={{
              background: 'rgba(5,5,5,0.8)',
              borderColor: 'rgba(255,18,147,0.2)',
            }}
          >
            <p className="text-sm font-mono uppercase tracking-widest mb-2" style={{ color: '#6ECBFF' }}>
              当前等级
            </p>
            <h2 className="text-3xl font-black uppercase mb-4" style={{ color: '#FF1293' }}>
              {tier === 'none' ? 'Level 0' : tier === 'level1' ? 'Level 1' : tier === 'level2' ? 'Level 2' : 'Level 3'}
            </h2>
            <p className="text-sm" style={{ color: 'rgba(242,242,242,0.7)' }}>
              已消费 ${totalSpent}
            </p>
          </div>

          <div
            className="p-6 rounded-lg border"
            style={{
              background: 'rgba(5,5,5,0.8)',
              borderColor: 'rgba(255,18,147,0.2)',
            }}
          >
            <p className="text-sm font-mono uppercase tracking-widest mb-2" style={{ color: '#6ECBFF' }}>
              会员权益
            </p>
            <h2 className="text-3xl font-black uppercase mb-4" style={{ color: '#FF1293' }}>
              {discountPercentage}% 折扣
            </h2>
            {hasEarlyAccess && (
              <p className="text-sm text-cyan-400">✓ 抢先购买已解锁</p>
            )}
          </div>
        </div>

        <ExclusiveCollection />
      </div>
    </main>
  );
}
