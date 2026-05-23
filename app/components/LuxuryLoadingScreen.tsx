import React, { useEffect, useState } from 'react';

export function LuxuryLoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading completion
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fade-out 0.6s ease-out 1.4s forwards',
      }}
    >
      <style>{`
        @keyframes fade-out {
          to {
            opacity: 0;
            pointer-events: none;
          }
        }

        @keyframes luxury-pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        .luxury-loader {
          width: 60px;
          height: 60px;
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-top: 2px solid #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .luxury-loader-text {
          position: absolute;
          bottom: 40px;
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          color: #d4af37;
          text-transform: uppercase;
          animation: luxury-pulse 2s ease-in-out infinite;
        }
      `}</style>

      <div style={{ position: 'relative' }}>
        <div className="luxury-loader" />
        <div className="luxury-loader-text">Loading Luxury...</div>
      </div>
    </div>
  );
}
