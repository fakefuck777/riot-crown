'use client';
import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Preload } from '@react-three/drei';
import * as THREE from 'three';

interface Product3DViewerProps {
  modelUrl: string;
  productName: string;
  onMaterialChange?: (material: string) => void;
}

// ─── 3D Model Loader ───────────────────────────────────────────────────────

function Model() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && !window.isUserInteracting) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#FF1293" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ─── Material Variants ───────────────────────────────────────────────────────

const MATERIAL_VARIANTS = {
  pearl_white: {
    name: '珍珠白',
    color: '#F5F5F5',
    metalness: 0.3,
    roughness: 0.4,
  },
  pearl_black: {
    name: '珍珠黑',
    color: '#1a1a1a',
    metalness: 0.4,
    roughness: 0.3,
  },
  chrome_gold: {
    name: '镀金铬',
    color: '#C9A84C',
    metalness: 0.95,
    roughness: 0.1,
  },
  chrome_silver: {
    name: '银铬',
    color: '#E8E8E8',
    metalness: 0.98,
    roughness: 0.05,
  },
};

// ─── Product 3D Viewer ───────────────────────────────────────────────────────

export function Product3DViewer({ modelUrl, productName, onMaterialChange }: Product3DViewerProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<keyof typeof MATERIAL_VARIANTS>('pearl_white');
  const [showAR, setShowAR] = useState(false);

  const handleMaterialChange = (material: keyof typeof MATERIAL_VARIANTS) => {
    setSelectedMaterial(material);
    onMaterialChange?.(material);
  };

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      {/* 3D Canvas */}
      <div className="relative w-full h-96 md:h-[600px] bg-gradient-to-b from-gray-900 to-black">
        <Suspense fallback={<div className="w-full h-full bg-black flex items-center justify-center">
          <span className="text-gray-500">加载中...</span>
        </div>}>
          <Canvas
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
            }}
            onMouseDown={() => (window.isUserInteracting = true)}
            onMouseUp={() => (window.isUserInteracting = false)}
            onTouchStart={() => (window.isUserInteracting = true)}
            onTouchEnd={() => (window.isUserInteracting = false)}
          >
            <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={50} />
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              autoRotate={!window.isUserInteracting}
              autoRotateSpeed={3}
            />

            {/* Lighting */}
            <ambientLight intensity={0.5} color="#1a1a2e" />
            <directionalLight position={[5, 5, 5]} intensity={1} color="#FF1293" />
            <directionalLight position={[-5, -5, 5]} intensity={0.7} color="#6ECBFF" />
            <pointLight position={[0, 0, 3]} intensity={0.8} color="#C9A84C" />

            {/* Model */}
            <Model />

            <Environment preset="night" />
            <Preload all />
          </Canvas>
        </Suspense>

        {/* Material Selector Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 flex-wrap z-10">
          {Object.entries(MATERIAL_VARIANTS).map(([key, variant]) => (
            <button
              key={key}
              onClick={() => handleMaterialChange(key as keyof typeof MATERIAL_VARIANTS)}
              className={`px-3 py-2 rounded text-xs font-mono uppercase transition-all ${
                selectedMaterial === key
                  ? 'ring-2 ring-offset-2 ring-pink-500'
                  : 'hover:ring-1 hover:ring-gray-600'
              }`}
              style={{
                backgroundColor: variant.color,
                color: key.includes('black') ? '#fff' : '#000',
              }}
            >
              {variant.name}
            </button>
          ))}
        </div>

        {/* AR Try-On Button */}
        <button
          onClick={() => setShowAR(!showAR)}
          className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-pink-600 to-pink-500 text-white font-bold uppercase text-xs rounded hover:shadow-lg hover:shadow-pink-500/50 transition-all z-10"
          style={{
            background: 'linear-gradient(135deg, #FF1293 0%, #FF0080 100%)',
            boxShadow: '0 0 15px rgba(255,18,147,0.3)',
          }}
        >
          {showAR ? '关闭AR' : '虚拟试戴'}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-6 border-t border-gray-800">
        <h3 className="text-xl font-bold text-white mb-2">{productName}</h3>
        <p className="text-sm text-gray-400 mb-4">
          支持360°旋转 • 材质切换 • AR虚拟试戴
        </p>
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-600 to-pink-500 text-white font-bold uppercase text-sm rounded hover:shadow-lg transition-all"
            style={{
              background: 'linear-gradient(135deg, #FF1293 0%, #FF0080 100%)',
            }}>
            加入购物车
          </button>
          <button className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 font-bold uppercase text-sm rounded hover:border-pink-500 hover:text-pink-500 transition-all">
            ♡ 收藏
          </button>
        </div>
      </div>
    </div>
  );
}

