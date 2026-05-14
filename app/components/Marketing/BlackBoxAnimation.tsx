'use client';
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

function BlackBox({ isOpen }: { isOpen: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      if (!isOpen) {
        groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
        groupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      } else {
        groupRef.current.rotation.x = 0;
        groupRef.current.rotation.y = 0;
      }
    }

    if (lidRef.current && isOpen) {
      lidRef.current.rotation.x = Math.min(clock.getElapsedTime() * 2, Math.PI * 0.6);
      lidRef.current.position.y = 1.3 + Math.sin(clock.getElapsedTime() * 2) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Box */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 2.5, 1.5]} />
        <meshStandardMaterial
          color="#050505"
          metalness={0.1}
          roughness={0.8}
          emissive="#1a1a1a"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Neon edge */}
      <mesh position={[0, 0, 0.76]}>
        <boxGeometry args={[2.1, 2.6, 0.05]} />
        <meshStandardMaterial
          color="#FF1293"
          emissive="#FF1293"
          emissiveIntensity={isOpen ? 1 : 0.5}
        />
      </mesh>

      {/* Lid */}
      <mesh ref={lidRef} position={[0, 1.3, 0]} castShadow>
        <boxGeometry args={[2, 0.3, 1.5]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.2}
          roughness={0.7}
        />
      </mesh>

      {/* Inner glow */}
      {isOpen && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.8, 2.2, 1.3]} />
          <meshStandardMaterial
            color="#FF1293"
            emissive="#FF1293"
            emissiveIntensity={0.3}
            transparent={true}
            opacity={0.1}
          />
        </mesh>
      )}

      {/* Lighting */}
      <pointLight position={[2, 2, 2]} intensity={isOpen ? 2 : 1.2} color="#FF1293" />
      <pointLight position={[-2, -2, 2]} intensity={isOpen ? 1.5 : 0.8} color="#6ECBFF" />
      {isOpen && <pointLight position={[0, 0, 1]} intensity={1.5} color="#FF1293" />}
    </group>
  );
}

interface BlackBoxAnimationProps {
  productName: string;
  onClose?: () => void;
}

export function BlackBoxAnimation({ productName, onClose }: BlackBoxAnimationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* 3D Box */}
        <div className="w-full h-96 bg-void rounded-lg overflow-hidden mb-6 border border-y2k-pink/20">
          <Canvas
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
            }}
          >
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
            <ambientLight intensity={0.4} />
            <Environment preset="night" />
            <BlackBox />
          </Canvas>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h2 className="text-display-lg font-black uppercase text-transparent bg-clip-text bg-neon-pink-purple">
            黑盒限量版
          </h2>
          <p className="text-data text-titanium/70">
            {productName} 将以黑盒限量版包装发货。
          </p>
          <p className="text-label text-y2k-blue">
            每一个黑盒都是独一无二的艺术品。
          </p>

          {/* Story */}
          <div className="p-6 bg-void-pit rounded border border-y2k-pink/20 text-left">
            <p className="text-data text-titanium/70 leading-relaxed">
              打开黑盒的那一刻，你会看到一张手写的卡片。上面记录着这件珍珠的诞生故事——它在废墟中如何被发现，如何被液态金属加冕，如何成为你的王冠。
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-y2k-pink to-y2k-purple text-white font-bold uppercase rounded hover:shadow-neon-pink transition-all"
            >
              {isOpen ? '关闭黑盒' : '打开黑盒'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-void-pit border border-y2k-pink/30 text-y2k-pink font-bold uppercase rounded hover:border-y2k-pink/60 transition-all"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
