'use client';
import { useRef, useEffect, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { useLocale } from '~/lib/LocaleContext';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';
import { useDocumentVisible } from '~/hooks/useDocumentVisible';

// ─── Pearl Component ───────────────────────────────────────────────────────

interface PearlProps {
  position: [number, number, number];
  scale: number;
  color: string;
  metallic: number;
  roughness: number;
  emissiveIntensity: number;
}

function Pearl({ position, scale, color, metallic, roughness, emissiveIntensity }: PearlProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.5;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} scale={scale} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial
          color={color}
          metalness={metallic}
          roughness={roughness}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          envMapIntensity={1.0}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        intensity={0.5}
        distance={10}
        color={color}
        decay={2}
        castShadow={false}
      />
    </group>
  );
}

// ─── Necklace Chain ───────────────────────────────────────────────────────

function NecklaceChain() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current && !window.isUserInteracting) {
      groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      groupRef.current.rotation.x = Math.cos(clock.getElapsedTime() * 0.3) * 0.05;
    }
  });

  const pearlData: PearlProps[] = useMemo(
    () => [
      // Center - premium gold
      { position: [0, 0, 0], scale: 1.3, color: '#d4af37', metallic: 0.9, roughness: 0.15, emissiveIntensity: 0.5 },
      // Platinum accents
      { position: [-2, 1, 0], scale: 0.9, color: '#e8e8e8', metallic: 0.95, roughness: 0.1, emissiveIntensity: 0.4 },
      { position: [2, 1, 0], scale: 0.9, color: '#e8e8e8', metallic: 0.95, roughness: 0.1, emissiveIntensity: 0.4 },
      // Rose accents
      { position: [-3.5, -0.5, 0], scale: 0.7, color: '#ff1493', metallic: 0.8, roughness: 0.2, emissiveIntensity: 0.4 },
      { position: [3.5, -0.5, 0], scale: 0.7, color: '#ff1493', metallic: 0.8, roughness: 0.2, emissiveIntensity: 0.4 },
      // Cyan accents
      { position: [-4.5, -2, 0], scale: 0.6, color: '#00d9ff', metallic: 0.85, roughness: 0.15, emissiveIntensity: 0.4 },
      { position: [4.5, -2, 0], scale: 0.6, color: '#00d9ff', metallic: 0.85, roughness: 0.15, emissiveIntensity: 0.4 },
      // Purple accents
      { position: [-5, -3.5, 0], scale: 0.5, color: '#8338ec', metallic: 0.85, roughness: 0.12, emissiveIntensity: 0.35 },
      { position: [5, -3.5, 0], scale: 0.5, color: '#8338ec', metallic: 0.85, roughness: 0.12, emissiveIntensity: 0.35 },
      // Extra pearls for depth - gold
      { position: [0, -2, 1], scale: 0.8, color: '#d4af37', metallic: 0.88, roughness: 0.18, emissiveIntensity: 0.35 },
      { position: [0, -2, -1], scale: 0.8, color: '#00d9ff', metallic: 0.82, roughness: 0.2, emissiveIntensity: 0.35 },
    ],
    []
  );

  return (
    <group ref={groupRef}>
      {pearlData.map((props, i) => (
        <Pearl key={i} {...props} />
      ))}
    </group>
  );
}

// ─── Particle System ───────────────────────────────────────────────────────

function ParticleSystem() {
  const pointsRef = useRef<THREE.Points>(null);
  const positionsRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (!pointsRef.current) return;

    const geometry = new THREE.BufferGeometry();
    const count = 800;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 25;
      positions[i + 1] = (Math.random() - 0.5) * 25;
      positions[i + 2] = (Math.random() - 0.5) * 15;

      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    positionsRef.current = positions;

    const material = new THREE.PointsMaterial({
      color: '#FF1293',
      size: 0.15,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7,
    });

    pointsRef.current.geometry = geometry;
    pointsRef.current.material = material;
  }, []);

  useFrame(() => {
    if (pointsRef.current && positionsRef.current) {
      pointsRef.current.rotation.x += 0.00005;
      pointsRef.current.rotation.y += 0.0001;

      const positions = positionsRef.current;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += (Math.random() - 0.5) * 0.01;
        positions[i + 1] += (Math.random() - 0.5) * 0.01;
        positions[i + 2] += (Math.random() - 0.5) * 0.01;

        // Wrap around
        if (Math.abs(positions[i]) > 25) positions[i] *= -0.95;
        if (Math.abs(positions[i + 1]) > 25) positions[i + 1] *= -0.95;
        if (Math.abs(positions[i + 2]) > 15) positions[i + 2] *= -0.95;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return <points ref={pointsRef} />;
}

// ─── Hero Scene ───────────────────────────────────────────────────────────

function HeroScene() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={2}
        maxDistance={15}
        minDistance={3}
        rotateSpeed={0.8}
      />

      {/* Lighting Setup */}
      <ambientLight intensity={0.6} color="#1a1a2e" />
      <directionalLight position={[5, 5, 5]} intensity={1.1} color="#d4af37" castShadow={true} />
      <directionalLight position={[-5, -5, 5]} intensity={0.8} color="#00d9ff" castShadow={true} />
      <pointLight position={[0, 0, 5]} intensity={1.2} color="#e8e8e8" castShadow={true} />
      <pointLight position={[-8, 0, 0]} intensity={0.7} color="#ff1493" />
      <pointLight position={[8, 0, 0]} intensity={0.7} color="#8338ec" />

      {/* Scene Content */}
      <ParticleSystem />
      <NecklaceChain />

      {/* Environment */}
      <Environment preset="night" />
      <Preload all />
    </>
  );
}

// ─── Main Hero Component ───────────────────────────────────────────────────

export function HeroY2K() {
  const { t } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const _tabVisible = useDocumentVisible();
  const [_isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      setScrollProgress(Math.min(scrollPercent, 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (reducedMotion) {
    return (
      <section className="relative w-full h-screen min-h-dvh bg-void overflow-hidden flex items-center justify-center">
        <div className="text-center px-8">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4" style={{ color: '#FF1293' }}>
            RIOT CROWN
          </h1>
          <p className="text-lg md:text-2xl font-mono tracking-widest uppercase mb-8" style={{ color: '#6ECBFF' }}>
            {t.hero.subtitle}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-screen min-h-dvh bg-void overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-black" />}>
          <Canvas
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
            }}
            className="w-full h-full"
            onMouseDown={() => (window.isUserInteracting = true)}
            onMouseUp={() => (window.isUserInteracting = false)}
            onTouchStart={() => (window.isUserInteracting = true)}
            onTouchEnd={() => (window.isUserInteracting = false)}
          >
            <HeroScene />
          </Canvas>
        </Suspense>
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 85% 65% at 50% 50%, transparent 0%, rgba(5,5,5,0.3) 40%, rgba(5,5,5,0.7) 70%, rgba(5,5,5,0.95) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Main Copy */}
        <div className="relative z-20 text-center px-8 max-w-4xl">
          <p
            className="text-xs md:text-sm font-mono tracking-widest uppercase mb-6"
            style={{ color: 'rgba(255,18,147,0.7)' }}
          >
            {t.hero.eyebrow}
          </p>

          <h1
            className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 leading-none"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #e8e8e8 25%, #FF1293 50%, #00d9ff 75%, #8338ec 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 0 60px rgba(212,175,55,0.4)',
              filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.3))',
              letterSpacing: '-0.02em',
            }}
          >
            {t.hero.title1}
            <br />
            {t.hero.title2}
          </h1>

          <p
            className="text-sm md:text-base leading-relaxed mb-8 max-w-2xl mx-auto"
            style={{ color: 'rgba(242,242,242,0.75)' }}
          >
            {t.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center pointer-events-auto flex-wrap">
            <button
              className="px-8 py-3 font-bold uppercase tracking-wider transition-all hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #FF1293 0%, #FF0080 100%)',
                color: '#fff',
                boxShadow: '0 0 20px rgba(255,18,147,0.4)',
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, { boxShadow: '0 0 40px rgba(255,18,147,0.8)', duration: 0.3 });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { boxShadow: '0 0 20px rgba(255,18,147,0.4)', duration: 0.3 });
              }}
            >
              {t.hero.shopCta}
            </button>
            <button
              className="px-8 py-3 font-bold uppercase tracking-wider transition-all hover:bg-opacity-10"
              style={{
                border: '2px solid #6ECBFF',
                color: '#6ECBFF',
              }}
            >
              {t.hero.artifacts}
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(168,168,168,0.5)' }}>
              {t.hero.scroll}
            </span>
            <div
              className="w-6 h-10 border-2 rounded-full flex justify-center"
              style={{ borderColor: 'rgba(168,168,168,0.3)' }}
            >
              <div
                className="w-1 h-2 bg-current rounded-full mt-2 animate-bounce"
                style={{ color: 'rgba(168,168,168,0.5)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-pink-600 to-cyan-400 z-20"
        style={{
          width: `${scrollProgress * 100}%`,
          transition: 'width 0.1s ease-out',
        }}
      />
    </section>
  );
}
