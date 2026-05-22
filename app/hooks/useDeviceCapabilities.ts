import { useEffect, useState } from 'react';

interface NavigatorWithDeviceMemory extends Navigator {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  connection?: {
    effectiveType?: string;
  };
}

export interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  hasCoarsePointer: boolean;
  cores: number;
  memory: number;
  connection: string;
  webglSupported: boolean;
  webglVersion: 'webgl2' | 'webgl' | 'none';
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    isTablet: false,
    hasCoarsePointer: false,
    cores: 4,
    memory: 4,
    connection: '4g',
    webglSupported: false,
    webglVersion: 'none',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 检测设备类型
    const ua = navigator.userAgent;
    const isMobile = /iPhone|iPad|Android|Mobile/i.test(ua);
    const isTablet = /iPad|Android/i.test(ua) && window.innerWidth > 768;
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    // 检测硬件能力
    const nav = navigator as NavigatorWithDeviceMemory;
    const cores = nav.hardwareConcurrency ?? 4;
    const memory = nav.deviceMemory ?? 4;
    const connection = nav.connection?.effectiveType ?? '4g';

    // 检测 WebGL 支持
    let webglSupported = false;
    let webglVersion: 'webgl2' | 'webgl' | 'none' = 'none';

    try {
      const canvas = document.createElement('canvas');
      if (canvas.getContext('webgl2')) {
        webglSupported = true;
        webglVersion = 'webgl2';
      } else if (canvas.getContext('webgl')) {
        webglSupported = true;
        webglVersion = 'webgl';
      }
    } catch (e) {
      webglSupported = false;
    }

    setCapabilities({
      isMobile,
      isTablet,
      hasCoarsePointer,
      cores,
      memory,
      connection,
      webglSupported,
      webglVersion,
    });
  }, []);

  return capabilities;
}

/**
 * 根据设备能力获取 3D 场景质量等级
 */
export function getSceneQualityTier(caps: DeviceCapabilities): 'low' | 'medium' | 'high' {
  if (!caps.webglSupported) return 'low';

  if (!caps.isMobile) return 'high';

  // 移动设备
  if (caps.cores <= 4 || caps.memory <= 2) return 'low';
  if (caps.cores <= 6 || caps.memory <= 4) return 'medium';
  return 'high';
}

/**
 * 根据设备能力获取粒子数量
 */
export function getParticleCount(caps: DeviceCapabilities): number {
  if (!caps.isMobile) return 1500;

  const tier = getSceneQualityTier(caps);

  if (tier === 'low') {
    return caps.connection === '4g' ? 150 : 80;
  }
  if (tier === 'medium') {
    return caps.connection === '4g' ? 300 : 150;
  }
  return 800;
}

/**
 * 根据设备能力获取珍珠分段数
 */
export function getPearlSegments(caps: DeviceCapabilities): { main: number; small: number } {
  if (!caps.isMobile) {
    return { main: 64, small: 40 };
  }

  const tier = getSceneQualityTier(caps);

  if (tier === 'low') {
    return { main: 24, small: 16 };
  }
  if (tier === 'medium') {
    return { main: 40, small: 28 };
  }
  return { main: 56, small: 36 };
}
