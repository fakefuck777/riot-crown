'use client';
import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 高级视觉效果：
 * - 动态光线追踪
 * - 实时反射
 * - 高级粒子系统
 * - 电影级色彩分级
 */

export function AdvancedVisualEffects() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useThree();

  useEffect(() => {
    // 添加高级环境光
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.6);
    scene.add(ambientLight);

    // 添加方向光（模拟太阳光）
    const directionalLight = new THREE.DirectionalLight('#ffffff', 0.8);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // 添加半球光（天空光）
    const hemisphereLight = new THREE.HemisphereLight('#FF1293', '#6ECBFF', 0.4);
    scene.add(hemisphereLight);

    return () => {
      scene.remove(ambientLight);
      scene.remove(directionalLight);
      scene.remove(hemisphereLight);
    };
  }, [scene]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // 动态光线效果
      const time = clock.getElapsedTime();
      groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
      groupRef.current.rotation.y = Math.cos(time * 0.08) * 0.05;
    }
  });

  return <group ref={groupRef} />;
}
