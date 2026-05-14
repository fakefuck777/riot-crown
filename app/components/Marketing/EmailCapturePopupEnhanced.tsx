'use client';
import { useState, useEffect, useCallback } from 'react';

interface EmailCapturePopupEnhancedProps {
  onClose?: () => void;
}

const CAPTURED_KEY = 'riot_email_captured';
const DISMISSED_KEY = 'riot_email_popup_dismissed_at';
const DISMISS_COOLDOWN_MS = 1000 * 60 * 60 * 24 * 3;

export function EmailCapturePopupEnhanced({ onClose }: EmailCapturePopupEnhancedProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const canShowPopup = useCallback(() => {
    if (localStorage.getItem(CAPTURED_KEY) === 'true') return false;

    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (!dismissedAt) return true;

    return Date.now() - Number(dismissedAt) > DISMISS_COOLDOWN_MS;
  }, []);

  const closePopup = useCallback(() => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setIsVisible(false);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (!canShowPopup()) return;

    let hasTriggered = false;

    const handleScroll = () => {
      if (hasTriggered || isVisible) return;

      const scrollTop = window.scrollY;
      const docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const scrollPercent = scrollTop / docHeight;

      if (scrollPercent >= 0.45) {
        hasTriggered = true;
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [canShowPopup, isVisible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Email captured:', email);
    localStorage.setItem(CAPTURED_KEY, 'true');
    localStorage.removeItem(DISMISSED_KEY);

    setIsSubmitted(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsSubmitted(false);
      setEmail('');
      onClose?.();
    }, 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closePopup} />

      <div
        className="relative max-w-md w-full p-8 rounded-lg animate-fadeIn"
        style={{
          background: 'linear-gradient(135deg, rgba(5,5,5,0.98) 0%, rgba(13,13,30,0.98) 100%)',
          border: '1px solid rgba(255,18,147,0.2)',
          boxShadow: '0 0 40px rgba(255,18,147,0.15)',
        }}
      >
        <button
          onClick={closePopup}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="关闭弹窗"
        >
          ✕
        </button>

        {!isSubmitted ? (
          <>
            <h2 className="text-2xl font-black uppercase mb-2" style={{ color: '#FF1293' }}>
              限量珍珠贴纸
            </h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(242,242,242,0.7)' }}>
              输入邮箱，获得独家Y2K珍珠贴纸 + 10% 首单折扣
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="你的邮箱"
                required
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 font-bold uppercase tracking-wider rounded transition-all"
                style={{
                  background: 'linear-gradient(135deg, #FF1293 0%, #FF0080 100%)',
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(255,18,147,0.4)',
                }}
              >
                获取贴纸 + 折扣码
              </button>
            </form>

            <p className="text-xs mt-4 text-center" style={{ color: 'rgba(168,168,168,0.5)' }}>
              我们不会分享你的邮箱
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✓</div>
            <p className="text-lg font-bold text-white mb-2">成功！</p>
            <p className="text-sm" style={{ color: 'rgba(242,242,242,0.7)' }}>
              检查你的邮箱获取折扣码
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
