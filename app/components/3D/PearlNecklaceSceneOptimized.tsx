'use client';
import { Suspense, lazy } from 'react';

// 延迟加载 3D 组件，避免阻塞初始渲染
const PearlNecklaceSceneOriginal = lazy(() =>
  import('./PearlNecklaceScene').then(m => ({ default: m.PearlNecklaceScene }))
);

// 快速加载的占位符
function PearlNecklaceSceneFallback() {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#d4af37',
        fontSize: '14px',
        fontFamily: 'JetBrains Mono',
        letterSpacing: '0.1em',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>LOADING LUXURY EXPERIENCE</div>
        <div style={{ fontSize: '12px', opacity: 0.6 }}>
          <div style={{ animation: 'pulse 1.5s infinite' }}>●</div>
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export function PearlNecklaceScene() {
  return (
    <Suspense fallback={<PearlNecklaceSceneFallback />}>
      <PearlNecklaceSceneOriginal />
    </Suspense>
  );
}
