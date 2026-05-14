'use client';
import { useMember } from '~/lib/MemberContext';
import { useLocale } from '~/lib/LocaleContext';

export function ExclusiveCollection() {
  const { tier, hasEarlyAccess } = useMember();

  if (tier === 'none') {
    return (
      <section className="py-16 px-8 text-center">
        <h2 className="text-3xl font-black uppercase mb-4" style={{ color: '#FF1293' }}>
          独家系列
        </h2>
        <p className="mb-6" style={{ color: 'rgba(242,242,242,0.7)' }}>
          成为 Riot Level 会员解锁独家珍珠系列
        </p>
        <button
          className="px-8 py-3 font-bold uppercase tracking-wider rounded"
          style={{
            background: 'linear-gradient(135deg, #FF1293 0%, #FF0080 100%)',
            color: '#fff',
          }}
        >
          了解会员系统
        </button>
      </section>
    );
  }

  return (
    <section className="py-16 px-8">
      <h2 className="text-3xl font-black uppercase mb-8" style={{ color: '#FF1293' }}>
        ✓ 独家系列已解锁
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Exclusive products would be rendered here */}
        <div
          className="p-6 rounded-lg border"
          style={{
            background: 'rgba(5,5,5,0.8)',
            borderColor: 'rgba(255,18,147,0.2)',
          }}
        >
          <p className="text-sm font-mono uppercase tracking-widest mb-4" style={{ color: '#6ECBFF' }}>
            Exclusive
          </p>
          <h3 className="text-lg font-black uppercase mb-4" style={{ color: '#FF1293' }}>
            Millennium Relic Pearl
          </h3>
          <p className="text-sm mb-6" style={{ color: 'rgba(242,242,242,0.7)' }}>
            仅限 Riot Level 会员
          </p>
          <button
            className="w-full px-4 py-2 font-bold uppercase text-sm rounded"
            style={{
              background: 'linear-gradient(135deg, #FF1293 0%, #FF0080 100%)',
              color: '#fff',
            }}
          >
            加入购物车
          </button>
        </div>
      </div>

      {hasEarlyAccess && (
        <div
          className="mt-8 p-6 rounded-lg border"
          style={{
            background: 'rgba(255,18,147,0.05)',
            borderColor: 'rgba(255,18,147,0.2)',
          }}
        >
          <p className="text-sm font-mono uppercase tracking-widest mb-2" style={{ color: '#6ECBFF' }}>
            ✓ 抢先购买已解锁
          </p>
          <p style={{ color: 'rgba(242,242,242,0.7)' }}>
            你可以在新品发售前 24 小时购买
          </p>
        </div>
      )}
    </section>
  );
}
