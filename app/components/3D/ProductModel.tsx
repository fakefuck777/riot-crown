'use client';
import { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { useUserInteraction } from '~/lib/UserInteractionContext';
import { useLocale } from '~/lib/LocaleContext';
import { AdvancedVisualEffects } from '~/components/3D/AdvancedVisualEffects';

interface ProductModelProps {
  productName: string;
  onMaterialChange?: (material: string) => void;
  onARClick?: () => void;
}

const MATERIAL_VARIANTS = {
  pearl_glossy: {
    nameKey: 'Pearl Glossy',
    color: '#F5F5F5',
    metalness: 0.4,
    roughness: 0.2,
    emissive: '#ffffff',
    emissiveIntensity: 0.15,
  },
  pearl_matte: {
    nameKey: 'Pearl Matte',
    color: '#E8E8E8',
    metalness: 0.2,
    roughness: 0.6,
    emissive: '#000000',
    emissiveIntensity: 0,
  },
  pearl_oxidized: {
    nameKey: 'Pearl Oxidized',
    color: '#A0A0A0',
    metalness: 0.3,
    roughness: 0.7,
    emissive: '#333333',
    emissiveIntensity: 0.05,
  },
  chrome_plated: {
    nameKey: 'Chrome Plated',
    color: '#E8E8E8',
    metalness: 0.98,
    roughness: 0.05,
    emissive: '#ffffff',
    emissiveIntensity: 0.2,
  },
  chrome_gold: {
    nameKey: 'Chrome Gold',
    color: '#C0C0C0',
    metalness: 0.95,
    roughness: 0.08,
    emissive: '#C0C0C0',
    emissiveIntensity: 0.15,
  },
  neon_pink: {
    nameKey: 'Neon Pink',
    color: '#FF1293',
    metalness: 0.7,
    roughness: 0.15,
    emissive: '#FF1293',
    emissiveIntensity: 0.5,
  },
};

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 150;

  useEffect(() => {
    if (!pointsRef.current) return;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.random() * 1;
      const height = (Math.random() - 0.5) * 2;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    (geometry as unknown as { velocities: Float32Array }).velocities = velocities;
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const velocities = (pointsRef.current.geometry as unknown as { velocities: Float32Array }).velocities;

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      const dist = Math.sqrt(
        positions[i * 3] ** 2 + positions[i * 3 + 1] ** 2 + positions[i * 3 + 2] ** 2
      );

      if (dist > 3) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 1.5;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.05}
        color="#FF1293"
        sizeAttenuation={true}
        transparent={true}
        opacity={0.6}
      />
    </points>
  );
}

function Model({ material }: { material: typeof MATERIAL_VARIANTS[keyof typeof MATERIAL_VARIANTS] }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { isUserInteracting } = useUserInteraction();
  const materialTransitionRef = useRef(1);

  useFrame(() => {
    if (groupRef.current && !isUserInteracting) {
      groupRef.current.rotation.y += 0.005;
    }

    if (meshRef.current && materialTransitionRef.current < 1) {
      materialTransitionRef.current = Math.min(materialTransitionRef.current + 0.05, 1);
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = materialTransitionRef.current;
    }
  });

  useEffect(() => {
    materialTransitionRef.current = 0;
  }, [material]);

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} castShadow={true} receiveShadow={true}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial
          color={material.color}
          metalness={material.metalness}
          roughness={material.roughness}
          emissive={material.emissive}
          emissiveIntensity={material.emissiveIntensity}
          envMapIntensity={1.5}
          transparent={true}
          opacity={1}
        />
      </mesh>

      <mesh position={[-1.5, 0.8, 0]} castShadow={true} receiveShadow={true}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#E8E8E8"
          metalness={0.95}
          roughness={0.08}
          emissive="#ffffff"
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh position={[1.5, 0.8, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#E8E8E8"
          metalness={0.95}
          roughness={0.08}
          emissive="#ffffff"
          emissiveIntensity={0.25}
        />
      </mesh>

      <Particles />

      <pointLight position={[3, 3, 3]} intensity={1.5} color="#FF1293" decay={2} />
      <pointLight position={[-3, -3, 3]} intensity={1.2} color="#6ECBFF" decay={2} />
      <pointLight position={[0, 2, -3]} intensity={0.8} color="#B366FF" decay={2} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" castShadow />
    </group>
  );
}

export function ProductModel({ productName, onMaterialChange, onARClick }: ProductModelProps) {
  const { t } = useLocale();
  const [selectedMaterial, setSelectedMaterial] = useState<keyof typeof MATERIAL_VARIANTS>('pearl_glossy');
  const [isARSupported, setIsARSupported] = useState(false);
  const { isUserInteracting, setIsUserInteracting } = useUserInteraction();
  const [isMobile] = useState(() => /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent));

  useEffect(() => {
    setIsARSupported('XRSession' in window || 'webkitXRSession' in window);
  }, []);

  const handleMaterialChange = (material: keyof typeof MATERIAL_VARIANTS) => {
    setSelectedMaterial(material);
    onMaterialChange?.(material);
  };

  const currentMaterial = MATERIAL_VARIANTS[selectedMaterial];

  return (
    <div className="w-full bg-void rounded-lg overflow-hidden border border-y2k-pink/20" style={{ boxShadow: '0 0 40px rgba(255,18,147,0.2), inset 0 1px 0 rgba(255,18,147,0.1)' }}>
      <div className="relative w-full h-96 md:h-[600px] bg-gradient-to-b from-void-plate to-void" style={{ boxShadow: 'inset 0 0 60px rgba(255,18,147,0.08)' }}>
        <Suspense fallback={<div className="w-full h-full flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-y2k-pink border-t-transparent rounded-full animate-spin" />
          <span className="text-y2k-pink text-xs tracking-widest">{t.product.loading}</span>
        </div>}>
          <Canvas
            gl={{
              antialias: !isMobile,
              alpha: false,
              powerPreference: isMobile ? 'low-power' : 'high-performance',
              precision: isMobile ? 'lowp' : 'highp',
            }}
            dpr={isMobile ? 1 : [1, 2]}
            onMouseDown={() => setIsUserInteracting(true)}
            onMouseUp={() => setIsUserInteracting(false)}
            onTouchStart={() => setIsUserInteracting(true)}
            onTouchEnd={() => setIsUserInteracting(false)}
          >
            <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={50} />
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              autoRotate={!isUserInteracting}
              autoRotateSpeed={3}
            />

            <ambientLight intensity={0.6} color="#ffffff" />
            <pointLight position={[5, 5, 5]} intensity={1.5} color="#FF1293" decay={2} />
            <pointLight position={[-5, -5, 5]} intensity={1.2} color="#6ECBFF" decay={2} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" castShadow />
            <AdvancedVisualEffects />

            <Environment preset="night" />

            <Model material={currentMaterial} />

            <Preload all />
          </Canvas>
        </Suspense>
      </div>

      <div className="p-6 bg-void-plate border-t border-y2k-pink/20">
        <p className="text-label uppercase tracking-ultra-wide text-y2k-blue mb-4" style={{ textShadow: '0 0 12px rgba(110,203,255,0.2)' }}>{t.product.sizeLabel}</p>
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
              style={{
                boxShadow: selectedMaterial === key ? '0 0 20px rgba(255,18,147,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {variant.nameKey}
            </button>
          ))}
        </div>
      </div>

      {isARSupported && (
        <div className="p-4 bg-void border-t border-y2k-pink/20" style={{ boxShadow: 'inset 0 1px 0 rgba(255,18,147,0.08)' }}>
          <button
            onClick={onARClick}
            className="w-full px-6 py-3 bg-gradient-to-r from-y2k-pink to-y2k-purple text-white font-bold uppercase rounded transition-all hover:shadow-neon-pink"
            style={{
              boxShadow: '0 0 24px rgba(255,18,147,0.28), inset 0 1px 0 rgba(255,255,255,0.18)',
              letterSpacing: '0.12em',
            }}
          >
            📱 {t.product.tryOn}
          </button>
        </div>
      )}

      <div className="p-6 bg-void-pit border-t border-y2k-pink/20">
        <h3 className="text-display-lg font-black uppercase text-y2k-pink mb-2">{productName}</h3>
        <p className="text-data text-titanium/70">
          {t.product.sizeSelected.replace('{s}', currentMaterial.nameKey)}
        </p>
        <p className="text-data text-titanium/50 mt-2">
          {t.hero.scroll} • {t.product.zoom} • {t.product.clickSwitch}
        </p>
      </div>
    </div>
  );
}
