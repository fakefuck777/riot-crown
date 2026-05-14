'use client';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CinematicBackgroundProps {
  intensity?: number;
  color?: string;
}

export function CinematicBackground({ intensity = 0.8, color = '#FF1293' }: CinematicBackgroundProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useEffect(() => {
    if (!particlesRef.current) return;

    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    (geometry as unknown as { velocities: Float32Array }).velocities = velocities;
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const velocities = (particlesRef.current.geometry as unknown as { velocities: Float32Array }).velocities;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];

        // 边界反弹
        if (Math.abs(positions[i]) > 10) velocities[i] *= -1;
        if (Math.abs(positions[i + 1]) > 10) velocities[i + 1] *= -1;
        if (Math.abs(positions[i + 2]) > 10) velocities[i + 2] *= -1;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 背景粒子 */}
      <points ref={particlesRef}>
        <bufferGeometry />
        <pointsMaterial
          size={0.08}
          color={color}
          sizeAttenuation={true}
          transparent={true}
          opacity={intensity * 0.4}
        />
      </points>

      {/* 环境光 */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <pointLight position={[5, 5, 5]} intensity={1.2} color={color} decay={2} />
      <pointLight position={[-5, -5, 5]} intensity={0.8} color="#6ECBFF" decay={2} />
    </group>
  );
}
