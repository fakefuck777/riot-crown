'use client';
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function LensFlare() {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // 跟随光源位置
      const time = clock.getElapsedTime();
      const lightPos = new THREE.Vector3(
        Math.sin(time * 0.3) * 5,
        3 + Math.cos(time * 0.2) * 1,
        5
      );

      // 计算屏幕空间位置
      const screenPos = lightPos.clone().project(camera);
      const flarePos = new THREE.Vector3(
        (screenPos.x * window.innerWidth) / 2,
        -(screenPos.y * window.innerHeight) / 2,
        0
      );

      groupRef.current.position.copy(flarePos);

      // 脉动效果
      const scale = 1 + Math.sin(time * 2) * 0.3;
      groupRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* 主光晕 */}
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[80, 32]} />
        <meshBasicMaterial
          color="#FF1293"
          transparent={true}
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 次光晕 */}
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[50, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent={true}
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 光芒 */}
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[120, 8]} />
        <meshBasicMaterial
          color="#FF1293"
          transparent={true}
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
