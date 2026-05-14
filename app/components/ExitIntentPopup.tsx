'use client';
import { useState, useEffect } from 'react';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !localStorage.getItem('riot_exit_shown')) {
        setIsVisible(true);
        localStorage.setItem('riot_exit_shown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => setIsVisible(false)}
      />

      {/* Modal */}
      <div
        className="relative max-w-md w-full p-8 rounded-lg"
        style={{
          background: 'linear-gradient(135deg, rgba(5,5,5,0.98) 0%, rgba(13,13,30,0.98) 100%)',
          border: '1px solid rgba(255,18,147,0.2)',
          boxShadow: '0 0 40px rgba(255,18,147,0.15)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <h2 className="text-2xl font-black uppercase mb-2" style={{ color: '#FF1293' }}>
          等等！
        </h2>
        <p className="text-sm mb-6" style={{ color: 'rgba(242,242,242,0.7)' }}>
          获得 <span className="font-bold text-yellow-400">10% 折扣</span> + 黑盒包装升级
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(242,242,242,0.7)' }}>
            <span style={{ color: '#6ECBFF' }}>✓</span>
            限量珍珠项链
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(242,242,242,0.7)' }}>
            <span style={{ color: '#6ECBFF' }}>✓</span>
            黑盒包装 + 故事卡
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(242,242,242,0.7)' }}>
            <span style={{ color: '#6ECBFF' }}>✓</span>
            全球免运费
          </div>
        </div>

        <button
          className="w-full px-4 py-3 font-bold uppercase tracking-wider rounded transition-all mb-3"
          style={{
            background: 'linear-gradient(135deg, #FF1293 0%, #FF0080 100%)',
            color: '#fff',
            boxShadow: '0 0 20px rgba(255,18,147,0.4)',
          }}
        >
          获取 10% 折扣
        </button>

        <button
          onClick={() => setIsVisible(false)}
          className="w-full px-4 py-2 text-sm font-mono uppercase tracking-widest"
          style={{ color: 'rgba(168,168,168,0.6)' }}
        >
          继续购物
        </button>
      </div>
    </div>
  );
}
