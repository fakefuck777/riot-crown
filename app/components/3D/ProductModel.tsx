'use client';
import { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Preload } from '@react-three/drei';
import * as THREE from 'three';

interface ProductModelProps {
  productName: string;
  onMaterialChange?: (material: string) => void;
  onARClick?: () => void;
}

// ─── Material Variants ───────────────────────────────────────────────────────

const MATERIAL_VARIANTS = {
  pearl_glossy: {
    name: '珍珠高光',
    color: '#F5F5F5',
    metalness: 0.4,
    roughness: 0.2,
    emissive: '#ffffff',
    emissiveIntensity: 0.1,
  },
  pearl_matte: {
    name: '珍珠哑光',
    color: '#E8E8E8',
    metalness: 0.2,
    roughness: 0.6,
    emissive: '#000000',
    emissiveIntensity: 0,
  },
  pearl_oxidized: {
    name: '珍珠氧化',
    color: '#A0A0A0',
    metalness: 0.3,
    roughness: 0.7,
    emissive: '#333333',
    emissiveIntensity: 0.05,
  },
  chrome_plated: {
    name: '镀铬',
    color: '#E8E8E8',
    metalness: 0.98,
    roughness: 0.05,
    emissive: '#ffffff',
    emissiveIntensity: 0.15,
  },
  chrome_gold: {
    name: '镀金铬',
    color: '#C9A84C',
    metalness: 0.95,
    roughness: 0.08,
    emissive: '#C9A84C',
    emissiveIntensity: 0.1,
  },
  neon_pink: {
    name: '霓虹粉',
    color: '#FF1293',
    metalness: 0.7,
    roughness: 0.15,
    emissive: '#FF1293',
    emissiveIntensity: 0.4,
  },
};

// ─── 3D Model Component ───────────────────────────────────────────────────

function Model({ material }: { material: typeof MATERIAL_VARIANTS[keyof typeof MATERIAL_VARIANTS] }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (groupRef.current && !window.isUserInteracting) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Pearl */}
      <mesh ref={meshRef} castShadow={true} receiveShadow={true}>
        <sphereGeometry args={[1.2, 128, 128]} />
        <meshStandardMaterial
          color={material.color}
          metalness={material.metalness}
          roughness={material.roughness}
          emissive={material.emissive}
          emissiveIntensity={material.emissiveIntensity}
          envMapIntensity={1.3}
        />
      </mesh>

      {/* Chrome Accents */}
      <mesh position={[-1.5, 0.8, 0]} castShadow={true} receiveShadow={true}>
        <sphereGeometry args={[0.4, 64, 64]} />
        <meshStandardMaterial
          color="#E8E8E8"
          metalness={0.95}
          roughness={0.08}
          emissive="#ffffff"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[1.5, 0.8, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.4, 64, 64]} />
        <meshStandardMaterial
          color="#E8E8E8"
          metalness={0.95}
          roughness={0.08}
          emissive="#ffffff"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Lighting */}
      <pointLight position={[2, 2, 2]} intensity={1.2} color="#FF1293" />
      <pointLight position={[-2, -2, 2]} intensity={1} color="#6ECBFF" />
    </group>
  );
}

// ─── Product 3D Viewer ───────────────────────────────────────────────────

export function ProductModel({ productName, onMaterialChange, onARClick }: ProductModelProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<keyof typeof MATERIAL_VARIANTS>('pearl_glossy');
  const [isARSupported, setIsARSupported] = useState(false);

  useEffect(() => {
    // Check AR support
    setIsARSupported('XRSession' in window || 'webkitXRSession' in window);
  }, []);

  const handleMaterialChange = (material: keyof typeof MATERIAL_VARIANTS) => {
    setSelectedMaterial(material);
    onMaterialChange?.(material);
  };

  const currentMaterial = MATERIAL_VARIANTS[selectedMaterial];

  return (
    <div className="w-full bg-void rounded-lg overflow-hidden border border-y2k-pink/20">
      {/* 3D Canvas */}
      <div className="relative w-full h-96 md:h-[600px] bg-gradient-to-b from-void-plate to-void">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center">
          <span className="text-y2k-pink animate-pulse">加载中...</span>
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
            <ambientLight intensity={0.5} color="#ffffff" />
            <pointLight position={[5, 5, 5]} intensity={1.2} color="#FF1293" />
            <pointLight position={[-5, -5, 5]} intensity={1} color="#6ECBFF" />

            {/* Environment */}
            <Environment preset="night" />

            {/* Model */}
            <Model material={currentMaterial} />

            <Preload all />
          </Canvas>
        </Suspense>
      </div>

      {/* Material Selector */}
      <div className="p-6 bg-void-plate border-t border-y2k-pink/20">
        <p className="text-label uppercase tracking-ultra-wide text-y2k-blue mb-4">材质选择</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(MATERIAL_VARIANTS).map(([key, variant]) => (
            <button
              key={key}
              onClick={() => handleMaterialChange(key as keyof typeof MATERIAL_VARIANTS)}
              className={`px-4 py-3 rounded text-sm font-bold uppercase transition-all ${
                selectedMaterial === key
                  ? 'bg-y2k-pink text-void shadow-neon-pink'
                  : 'bg-void-pit text-titanium border border-y2k-pink/30 hover:border-y2k-pink/60'
              }`}
            >
              {variant.name}
            </button>
          ))}
        </div>
      </div>

      {/* AR Try-On Button */}
      {isARSupported && (
        <div className="p-4 bg-void border-t border-y2k-pink/20">
          <button
            onClick={onARClick}
            className="w-full px-6 py-3 bg-gradient-to-r from-y2k-pink to-y2k-purple text-white font-bold uppercase rounded transition-all hover:shadow-neon-pink"
          >
            📱 虚拟试戴 (AR)
          </button>
        </div>
      )}

      {/* Product Info */}
      <div className="p-6 bg-void-pit border-t border-y2k-pink/20">
        <h3 className="text-display-lg font-black uppercase text-y2k-pink mb-2">{productName}</h3>
        <p className="text-data text-titanium/70">
          当前材质：<span className="text-y2k-blue font-bold">{currentMaterial.name}</span>
        </p>
        <p className="text-data text-titanium/50 mt-2">
          拖拽旋转 • 滚轮缩放 • 点击材质切换
        </p>
      </div>
    </div>
  );
}
