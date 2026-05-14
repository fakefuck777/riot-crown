'use client';
/* eslint-disable react/no-unknown-property, @typescript-eslint/no-unused-vars */
import { useRef, useEffect, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Preload } from '@react-three/drei';
import * as THREE from 'three';

// ─── Pearl Component ───────────────────────────────────────────────────────

interface PearlProps {
  position: [number, number, number];
  scale: number;
  color: string;
  metallic: number;
  roughness: number;
  emissiveIntensity: number;
  isChrome?: boolean;
}

function Pearl({ position, scale, color, metallic, roughness, emissiveIntensity, isChrome }: PearlProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (meshRef.current && !window.isUserInteracting) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.5;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} scale={scale} castShadow={true} receiveShadow={true}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial
          color={color}
          metalness={metallic}
          roughness={roughness}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          envMapIntensity={1.5}
          wireframe={false}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        intensity={1.2}
        distance={15}
        color={color}
        decay={2}
        castShadow={true}
      />
    </group>
  );
}

// ─── Necklace Chain ───────────────────────────────────────────────────────

function NecklaceChain() {
  const groupRef = useRef<THREE.Group>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      if (!window.isUserInteracting) {
        groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
        groupRef.current.rotation.x = Math.cos(clock.getElapsedTime() * 0.3) * 0.05;
      }
      // 滚动时碎裂重组
      if (scrollProgress > 0.3) {
        const scale = 1 - scrollProgress * 0.5;
        groupRef.current.scale.set(scale, scale, scale);
      }
    }
  });

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

  const pearlData: PearlProps[] = useMemo(
    () => [
      // Center - neon pink (main pearl)
      { position: [0, 0, 0], scale: 1.5, color: '#FF1293', metallic: 0.85, roughness: 0.15, emissiveIntensity: 0.5, isChrome: true },
      // Gold accents
      { position: [-2.5, 1.2, 0], scale: 1, color: '#C9A84C', metallic: 0.95, roughness: 0.08, emissiveIntensity: 0.35 },
      { position: [2.5, 1.2, 0], scale: 1, color: '#C9A84C', metallic: 0.95, roughness: 0.08, emissiveIntensity: 0.35 },
      // Pink sides
      { position: [-4, -0.5, 0], scale: 0.8, color: '#FF1293', metallic: 0.8, roughness: 0.2, emissiveIntensity: 0.4 },
      { position: [4, -0.5, 0], scale: 0.8, color: '#FF1293', metallic: 0.8, roughness: 0.2, emissiveIntensity: 0.4 },
      // Cyan accents
      { position: [-5.5, -2, 0], scale: 0.7, color: '#6ECBFF', metallic: 0.9, roughness: 0.12, emissiveIntensity: 0.35 },
      { position: [5.5, -2, 0], scale: 0.7, color: '#6ECBFF', metallic: 0.9, roughness: 0.12, emissiveIntensity: 0.35 },
      // Purple accents
      { position: [-6.5, -3.5, 0], scale: 0.6, color: '#B366FF', metallic: 0.85, roughness: 0.15, emissiveIntensity: 0.3 },
      { position: [6.5, -3.5, 0], scale: 0.6, color: '#B366FF', metallic: 0.85, roughness: 0.15, emissiveIntensity: 0.3 },
      // Acid green
      { position: [0, -4.5, 0], scale: 0.5, color: '#C8FF00', metallic: 0.8, roughness: 0.18, emissiveIntensity: 0.25 },
      // Extra pearls for depth
      { position: [0, -2, 1.5], scale: 0.9, color: '#FF1293', metallic: 0.8, roughness: 0.2, emissiveIntensity: 0.35 },
      { position: [0, -2, -1.5], scale: 0.9, color: '#6ECBFF', metallic: 0.85, roughness: 0.18, emissiveIntensity: 0.35 },
      // Chrome silver
      { position: [-3, 3, 0.5], scale: 0.7, color: '#E8E8E8', metallic: 0.98, roughness: 0.05, emissiveIntensity: 0.2 },
      { position: [3, 3, 0.5], scale: 0.7, color: '#E8E8E8', metallic: 0.98, roughness: 0.05, emissiveIntensity: 0.2 },
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
  const velocitiesRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (!pointsRef.current) return;

    const geometry = new THREE.BufferGeometry();
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30;
      positions[i + 1] = (Math.random() - 0.5) * 30;
      positions[i + 2] = (Math.random() - 0.5) * 20;

      velocities[i] = (Math.random() - 0.5) * 0.03;
      velocities[i + 1] = (Math.random() - 0.5) * 0.03;
      velocities[i + 2] = (Math.random() - 0.5) * 0.03;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    positionsRef.current = positions;
    velocitiesRef.current = velocities;

    const colors = new Float32Array(count * 3);
    const colorChoices = [
      [1, 0.07, 0.58], // pink
      [0.43, 0.4, 1], // purple
      [0.43, 0.8, 1], // cyan
      [0.78, 1, 0], // acid
    ];

    for (let i = 0; i < count * 3; i += 3) {
      const choice = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i] = choice[0];
      colors[i + 1] = choice[1];
      colors[i + 2] = choice[2];
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
    });

    pointsRef.current.geometry = geometry;
    pointsRef.current.material = material;
  }, []);

  useFrame(() => {
    if (pointsRef.current && positionsRef.current && velocitiesRef.current) {
      pointsRef.current.rotation.x += 0.00008;
      pointsRef.current.rotation.y += 0.00012;

      const positions = positionsRef.current;
      const velocities = velocitiesRef.current;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];

        // Wrap around
        if (positions[i] > 15) positions[i] = -15;
        if (positions[i] < -15) positions[i] = 15;
        if (positions[i + 1] > 15) positions[i + 1] = -15;
        if (positions[i + 1] < -15) positions[i + 1] = 15;
        if (positions[i + 2] > 10) positions[i + 2] = -10;
        if (positions[i + 2] < -10) positions[i + 2] = 10;
      }

      (pointsRef.current.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial />
    </points>
  );
}

// ─── Neon Glitch Effect ───────────────────────────────────────────────────

function NeonGlitch() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current && Math.random() > 0.95) {
      groupRef.current.position.x = (Math.random() - 0.5) * 0.1;
      groupRef.current.position.y = (Math.random() - 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Glitch lines */}
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[20, 0.05]} />
        <meshBasicMaterial color="#FF1293" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 2, 0.1]}>
        <planeGeometry args={[15, 0.03]} />
        <meshBasicMaterial color="#6ECBFF" transparent opacity={0.25} />
      </mesh>
      <mesh position={[0, -3, 0.1]}>
        <planeGeometry args={[18, 0.04]} />
        <meshBasicMaterial color="#B366FF" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

// ─── Main Scene ───────────────────────────────────────────────────────────

function Scene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useEffect(() => {
    window.isUserInteracting = false;
  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 8]} fov={50} />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={!window.isUserInteracting}
        autoRotateSpeed={2}
        onStart={() => (window.isUserInteracting = true)}
        onEnd={() => (window.isUserInteracting = false)}
      />

      {/* Lighting */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#FF1293" />
      <pointLight position={[-10, -10, 10]} intensity={1} color="#6ECBFF" />
      <pointLight position={[0, 0, 15]} intensity={0.8} color="#B366FF" />

      {/* Environment */}
      <Environment preset="night" />

      {/* Scene Content */}
      <NecklaceChain />
      <ParticleSystem />
      <NeonGlitch />

      {/* Post-processing */}
      {/* Bloom and Glitch effects handled via shader materials */}

      <Preload all />
    </>
  );
}

// ─── Pearl Necklace Scene Component ───────────────────────────────────────

export function PearlNecklaceScene() {
  return (
    <div className="relative w-full h-screen bg-void overflow-hidden">
      <Suspense fallback={<div className="w-full h-full bg-void flex items-center justify-center"><span className="text-y2k-pink animate-pulse">加载中...</span></div>}>
        <Canvas
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          dpr={[1, 2]}
        >
          <Scene />
        </Canvas>
      </Suspense>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <h1 className="text-display-2xl font-black uppercase text-transparent bg-clip-text bg-neon-pink-purple animate-neon-flicker"
          style={{
            textShadow: '0 0 30px rgba(255, 18, 147, 0.5), 0 0 60px rgba(179, 102, 255, 0.3)',
            letterSpacing: '0.1em',
          }}>
          RIOT CROWN
        </h1>
        <p className="text-label uppercase tracking-ultra-wide text-y2k-blue mt-4 animate-pulse"
          style={{ textShadow: '0 0 20px rgba(110, 203, 255, 0.4)' }}>
          千禧年崩坏后，珍珠在废墟中重生
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <div className="animate-bounce text-y2k-pink text-center">
          <p className="text-label uppercase tracking-wide mb-2">向下滚动</p>
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
