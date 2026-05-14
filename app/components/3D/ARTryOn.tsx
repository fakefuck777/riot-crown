'use client';
import { useRef, useEffect, useState } from 'react';
import { useLocale } from '~/lib/LocaleContext';

interface ARTryOnProps {
  productName: string;
  onClose?: () => void;
}

export function ARTryOn({ productName, onClose }: ARTryOnProps) {
  const { t } = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Check WebXR support
    const checkARSupport = async () => {
      if ('XRSession' in window) {
        try {
          const xrNavigator = navigator as unknown as { xr?: { isSessionSupported?: (mode: string) => Promise<boolean> } };
          const supported = await xrNavigator.xr?.isSessionSupported?.('immersive-ar');
          setIsSupported(!!supported);
        } catch (e) {
        }
      }
    };

    checkARSupport();
  }, []);

  const startARSession = async () => {
    try {
      if (!('XRSession' in window)) {
        alert('Your device does not support AR. Please use a WebXR-compatible browser.');
        return;
      }

      // Placeholder for AR implementation
      // In production, integrate with:
      // - WebXR API for immersive AR
      // - Three.js AR.js library
      // - Babylon.js with Babylon AR
      // - Custom pose estimation for neck/wrist detection

      setIsActive(true);

      // Mock AR experience
      alert(`AR Try-On Started: ${productName}\n\nThis is a placeholder interface.\n\nFull implementation requires:\n1. WebXR API integration\n2. Body pose detection\n3. Virtual object placement\n4. Real-time rendering`);
    } catch (error) {
      console.error('AR Error:', error);
      alert('AR startup failed. Please check your browser support.');
    }
  };

  const stopARSession = () => {
    setIsActive(false);
    onClose?.();
  };

  if (!isSupported) {
    return (
      <div className="p-6 bg-void-pit rounded border border-y2k-pink/20 text-center">
        <p className="text-data text-titanium/70 mb-4">
          Your device does not support AR Try-On functionality.
        </p>
        <p className="text-label text-y2k-blue/50">
          Please use a modern WebXR-compatible browser (Chrome, Firefox, Safari 15+)
        </p>
      </div>
    );
  }

  if (isActive) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* AR Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button
            onClick={stopARSession}
            className="px-6 py-3 bg-y2k-pink text-white font-bold uppercase rounded hover:shadow-neon-pink transition-all"
          >
            CLOSE AR
          </button>
        </div>

        {/* AR Info */}
        <div className="absolute top-8 left-8 text-white">
          <p className="text-label uppercase tracking-wide mb-2">AR TRY-ON MODE</p>
          <p className="text-data text-titanium/70">{productName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-void-pit rounded border border-y2k-pink/20">
      <h3 className="text-display-lg font-black uppercase text-y2k-pink mb-4">VIRTUAL TRY-ON</h3>
      <p className="text-data text-titanium/70 mb-6">
        Use your device camera to virtually try on {productName} in real-time.
      </p>
      <button
        onClick={startARSession}
        className="w-full px-6 py-4 bg-gradient-to-r from-y2k-pink to-y2k-purple text-white font-bold uppercase rounded transition-all hover:shadow-neon-pink"
      >
        📱 START AR TRY-ON
      </button>
      <p className="text-label text-y2k-blue/50 mt-4 text-center">
        Requires WebXR-compatible browser
      </p>
    </div>
  );
}
