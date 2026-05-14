'use client';
import { useRef, useEffect, useState } from 'react';

interface ARTryOnProps {
  productName: string;
  onClose?: () => void;
}

export function ARTryOn({ productName, onClose }: ARTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Check WebXR support
    const checkARSupport = async () => {
      if ('XRSession' in window) {
        try {
          const supported = await (navigator as any).xr?.isSessionSupported?.('immersive-ar');
          setIsSupported(!!supported);
        } catch (e) {
          console.log('AR not supported:', e);
        }
      }
    };

    checkARSupport();
  }, []);

  const startARSession = async () => {
    try {
      if (!('XRSession' in window)) {
        alert('你的设备不支持 AR。请使用支持 WebXR 的浏览器。');
        return;
      }

      // Placeholder for AR implementation
      // In production, integrate with:
      // - WebXR API for immersive AR
      // - Three.js AR.js library
      // - Babylon.js with Babylon AR
      // - Custom pose estimation for neck/wrist detection

      setIsActive(true);
      console.log('AR Session started for:', productName);

      // Mock AR experience
      alert(`AR 试戴已启动：${productName}\n\n这是一个预留接口。\n\n完整实现需要：\n1. WebXR API 集成\n2. 人体姿态检测\n3. 虚拟物体放置\n4. 实时渲染`);
    } catch (error) {
      console.error('AR Error:', error);
      alert('AR 启动失败，请检查浏览器支持情况。');
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
          你的设备暂不支持 AR 试戴功能。
        </p>
        <p className="text-label text-y2k-blue/50">
          请使用支持 WebXR 的现代浏览器（Chrome、Firefox、Safari 15+）
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
            关闭 AR
          </button>
        </div>

        {/* AR Info */}
        <div className="absolute top-8 left-8 text-white">
          <p className="text-label uppercase tracking-wide mb-2">AR 试戴模式</p>
          <p className="text-data text-titanium/70">{productName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-void-pit rounded border border-y2k-pink/20">
      <h3 className="text-display-lg font-black uppercase text-y2k-pink mb-4">虚拟试戴</h3>
      <p className="text-data text-titanium/70 mb-6">
        使用你的设备摄像头，在现实中虚拟试戴 {productName}。
      </p>
      <button
        onClick={startARSession}
        className="w-full px-6 py-4 bg-gradient-to-r from-y2k-pink to-y2k-purple text-white font-bold uppercase rounded transition-all hover:shadow-neon-pink"
      >
        📱 启动 AR 试戴
      </button>
      <p className="text-label text-y2k-blue/50 mt-4 text-center">
        需要支持 WebXR 的浏览器
      </p>
    </div>
  );
}
