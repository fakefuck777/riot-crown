'use client';
/* eslint-disable react/no-unknown-property, @typescript-eslint/no-unused-vars */
import {
  Component,
  type ErrorInfo,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  Suspense,
  useMemo,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { useLocale } from '~/lib/LocaleContext';
import { useDeviceCapabilities, getSceneQualityTier, getParticleCount, getPearlSegments } from '~/hooks/useDeviceCapabilities';

// 预加载 Three.js 和相关库
if (typeof window !== 'undefined') {
  // 预加载 WebGL 上下文
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (gl) {
    gl.getParameter(gl.VERSION);
  }
}

declare global {
  interface Window {
    isUserInteracting?: boolean;
  }
}

/** 画质档位：由 Canvas 外传入，避免 R3F 树内重复测 UA / 宽度 */
type PearlSceneQuality = {
  /** 球体经纬分段（上限 64 桌面 / 40 移动，显著低于原 128²） */
  pearlSegments: number;
  /** 小颗珍珠再降一档分段，近似 LOD */
  pearlSegmentsSmall: number;
  meshShadows: boolean;
  /** 仅少数关键珍珠挂点光源，且永不 castShadow（原 14×点光+阴影极重） */
  attachedPointLight: 'none' | 'subtle' | 'full';
  envMapIntensity: number;
  /** ACES tone mapping exposure（电影感高光压暗部抬） */
  toneExposure: number;
};

const PearlSceneQualityContext = createContext<PearlSceneQuality>({
  pearlSegments: 48,
  pearlSegmentsSmall: 32,
  meshShadows: false,
  attachedPointLight: 'subtle',
  envMapIntensity: 1.8,
  toneExposure: 1.08,
});

// ─── Pearl Component ───────────────────────────────────────────────────────

interface PearlProps {
  position: [number, number, number];
  scale: number;
  color: string;
  metallic: number;
  roughness: number;
  emissiveIntensity: number;
  isChrome?: boolean;
  /** 是否使用「小珍珠」较低分段 */
  lowDetail?: boolean;
  /** 是否允许挂载呼吸点光（由 NecklaceChain 按索引控制数量） */
  allowAttachedLight?: boolean;
}

function Pearl({
  position,
  scale,
  color,
  metallic,
  roughness,
  emissiveIntensity,
  isChrome: _isChrome,
  lowDetail,
  allowAttachedLight,
}: PearlProps) {
  const q = useContext(PearlSceneQualityContext);
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const segments = lowDetail ? q.pearlSegmentsSmall : q.pearlSegments;
  const showLight =
    allowAttachedLight &&
    q.attachedPointLight !== 'none' &&
    (q.attachedPointLight === 'full' || q.attachedPointLight === 'subtle');

  useFrame(({ clock }) => {
    if (meshRef.current && !window.isUserInteracting) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;
      // 呼吸效果 — 珍珠脉动
      const breathe = 1 + Math.sin(clock.getElapsedTime() * 1.2) * 0.08;
      meshRef.current.scale.set(breathe, breathe, breathe);
    }
    if (lightRef.current && showLight) {
      const base = q.attachedPointLight === 'full' ? 1.35 : 0.85;
      lightRef.current.intensity = base + Math.sin(clock.getElapsedTime() * 2.5) * 0.45;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} scale={scale} castShadow={q.meshShadows} receiveShadow={q.meshShadows}>
        <sphereGeometry args={[1, segments, segments]} />
        <meshStandardMaterial
          color={color}
          metalness={metallic}
          roughness={roughness}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          envMapIntensity={q.envMapIntensity}
          wireframe={false}
          toneMapped={true}
        />
      </mesh>
      {showLight ? (
        <pointLight
          ref={lightRef}
          intensity={0.9}
          distance={16}
          color={color}
          decay={2}
          castShadow={false}
        />
      ) : null}
    </group>
  );
}

// ─── Necklace Chain ───────────────────────────────────────────────────────

function NecklaceChain() {
  const q = useContext(PearlSceneQualityContext);
  const groupRef = useRef<THREE.Group>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollProgressRef = useRef(0);

  const lightIndices = useMemo(() => {
    if (q.attachedPointLight === 'none') return new Set<number>();
    if (q.attachedPointLight === 'subtle') return new Set([0, 1, 2]);
    return new Set([0, 1, 2, 5, 6, 10, 11]);
  }, [q.attachedPointLight]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      if (!window.isUserInteracting) {
        groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
        groupRef.current.rotation.x = Math.cos(clock.getElapsedTime() * 0.3) * 0.05;
      }
      // 滚动时碎裂重组
      if (scrollProgressRef.current > 0.3) {
        const scale = 1 - scrollProgressRef.current * 0.5;
        groupRef.current.scale.set(scale, scale, scale);
      } else {
        groupRef.current.scale.set(1, 1, 1);
      }
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      const progress = Math.min(scrollPercent, 1);
      setScrollProgress(progress);
      scrollProgressRef.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pearlData: PearlProps[] = useMemo(
    () => [
      // Center - Premium holographic pearl (main focal point)
      { position: [0, 0, 0], scale: 1.6, color: '#00D9FF', metallic: 0.92, roughness: 0.08, emissiveIntensity: 0.6, isChrome: true },

      // Tier 1: Iridescent accents (surrounding center)
      { position: [-2.8, 1.5, 0], scale: 1.1, color: '#FF006E', metallic: 0.88, roughness: 0.12, emissiveIntensity: 0.5 },
      { position: [2.8, 1.5, 0], scale: 1.1, color: '#8338EC', metallic: 0.88, roughness: 0.12, emissiveIntensity: 0.5 },

      // Tier 2: Gradient transition (mid-range)
      { position: [-4.2, -0.8, 0], scale: 0.95, color: '#FB5607', metallic: 0.85, roughness: 0.15, emissiveIntensity: 0.45 },
      { position: [4.2, -0.8, 0], scale: 0.95, color: '#FFBE0B', metallic: 0.85, roughness: 0.15, emissiveIntensity: 0.45 },

      // Tier 3: Deep jewel tones (outer ring)
      { position: [-5.8, -2.2, 0], scale: 0.8, color: '#3A86FF', metallic: 0.9, roughness: 0.1, emissiveIntensity: 0.4 },
      { position: [5.8, -2.2, 0], scale: 0.8, color: '#06FFA5', metallic: 0.9, roughness: 0.1, emissiveIntensity: 0.4 },

      // Tier 4: Accent jewels (far outer)
      { position: [-6.8, -3.8, 0], scale: 0.7, color: '#FF006E', metallic: 0.87, roughness: 0.13, emissiveIntensity: 0.35 },
      { position: [6.8, -3.8, 0], scale: 0.7, color: '#00D9FF', metallic: 0.87, roughness: 0.13, emissiveIntensity: 0.35 },

      // Bottom accent - Premium white diamond
      { position: [0, -4.8, 0], scale: 0.6, color: '#F0F0F0', metallic: 0.95, roughness: 0.05, emissiveIntensity: 0.3 },

      // Depth pearls - 3D positioning
      { position: [0, -2.2, 1.8], scale: 1.0, color: '#8338EC', metallic: 0.86, roughness: 0.14, emissiveIntensity: 0.4 },
      { position: [0, -2.2, -1.8], scale: 1.0, color: '#FB5607', metallic: 0.86, roughness: 0.14, emissiveIntensity: 0.4 },

      // Top crown jewels - Premium chrome
      { position: [-3.2, 3.2, 0.6], scale: 0.75, color: '#FFFFFF', metallic: 0.98, roughness: 0.04, emissiveIntensity: 0.25 },
      { position: [3.2, 3.2, 0.6], scale: 0.75, color: '#E0E0E0', metallic: 0.97, roughness: 0.06, emissiveIntensity: 0.22 },
    ],
    []
  );

  return (
    <group ref={groupRef}>
      {pearlData.map((props, i) => (
        <Pearl
          key={i}
          {...props}
          lowDetail={props.scale < 0.85}
          allowAttachedLight={lightIndices.has(i)}
        />
      ))}
    </group>
  );
}

// ─── Particle System ───────────────────────────────────────────────────────

function ParticleSystem() {
  const pointsRef = useRef<THREE.Points>(null);
  const positionsRef = useRef<Float32Array | null>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const caps = useDeviceCapabilities();
  const count = getParticleCount(caps);

  useEffect(() => {
    if (!pointsRef.current) return;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30;
      positions[i + 1] = (Math.random() - 0.5) * 30;
      positions[i + 2] = (Math.random() - 0.5) * 20;

      velocities[i] = (Math.random() - 0.5) * 0.015;
      velocities[i + 1] = (Math.random() - 0.5) * 0.015;
      velocities[i + 2] = (Math.random() - 0.5) * 0.015;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    positionsRef.current = positions;
    velocitiesRef.current = velocities;

    const colors = new Float32Array(count * 3);
    const colorChoices = [
      [0, 0.85, 1], // cyan - premium
      [1, 0, 0.43], // magenta - premium
      [0.52, 0.23, 1], // purple - premium
      [1, 0.38, 0.03], // orange - premium
      [1, 0.75, 0.05], // gold - premium
      [0.23, 0.53, 1], // blue - premium
      [0.02, 1, 0.65], // mint - premium
      [1, 1, 1], // white - premium
    ];

    for (let i = 0; i < count * 3; i += 3) {
      const choice = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i] = choice[0];
      colors[i + 1] = choice[1];
      colors[i + 2] = choice[2];
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: caps.isMobile ? 0.1 : 0.12,
      sizeAttenuation: true,
      transparent: true,
      opacity: caps.isMobile ? 0.4 : 0.6,
      vertexColors: true,
      toneMapped: false,
    });

    pointsRef.current.geometry = geometry;
    pointsRef.current.material = material;
  }, [count, caps.isMobile]);

  useFrame(() => {
    if (pointsRef.current && positionsRef.current && velocitiesRef.current) {
      pointsRef.current.rotation.x += 0.00006;
      pointsRef.current.rotation.y += 0.0001;

      const positions = positionsRef.current;
      const velocities = velocitiesRef.current;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];

        if (positions[i] > 17.5) positions[i] = -17.5;
        if (positions[i] < -17.5) positions[i] = 17.5;
        if (positions[i + 1] > 17.5) positions[i + 1] = -17.5;
        if (positions[i + 1] < -17.5) positions[i + 1] = 17.5;
        if (positions[i + 2] > 12.5) positions[i + 2] = -12.5;
        if (positions[i + 2] < -12.5) positions[i + 2] = 12.5;
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

// ─── Neon Glitch Effect (Premium) ───────────────────────────────────────

function NeonGlitch() {
  const groupRef = useRef<THREE.Group>(null);
  const glitchStateRef = useRef({ active: false, intensity: 0 });

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const rand = Math.random();
    if (rand > 0.97) {
      glitchStateRef.current.active = true;
      glitchStateRef.current.intensity = Math.random() * 0.15;
    } else if (glitchStateRef.current.active && rand > 0.5) {
      glitchStateRef.current.active = false;
    }

    if (glitchStateRef.current.active) {
      groupRef.current.position.x = (Math.random() - 0.5) * glitchStateRef.current.intensity;
      groupRef.current.position.y = (Math.random() - 0.5) * glitchStateRef.current.intensity;
    } else {
      groupRef.current.position.x *= 0.9;
      groupRef.current.position.y *= 0.9;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Premium glitch lines - sparse, high-contrast */}
      <mesh position={[0, 1.5, 0.1]}>
        <planeGeometry args={[20, 0.08]} />
        <meshBasicMaterial color="#FF1293" transparent opacity={0.25} />
      </mesh>
      <mesh position={[0, -2.5, 0.1]}>
        <planeGeometry args={[18, 0.06]} />
        <meshBasicMaterial color="#6ECBFF" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

/** ACES 电影级色调 + WebGL context lost → 父级静态回退（仍保证首屏品牌可见） */
function GlFilmicAndContextGuard({ onWebglContextLost }: { onWebglContextLost: () => void }) {
  const gl = useThree((s) => s.gl);
  const q = useContext(PearlSceneQualityContext);

  useLayoutEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = q.toneExposure;
    gl.setClearColor('#050505', 1);
  }, [gl, q.toneExposure]);

  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (e: Event) => {
      (e as WebGLContextEvent).preventDefault?.();
      onWebglContextLost();
    };
    canvas.addEventListener('webglcontextlost', lost, false);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [gl, onWebglContextLost]);

  return null;
}

function CanvasInner({ onWebglContextLost }: { onWebglContextLost: () => void }) {
  return (
    <>
      <GlFilmicAndContextGuard onWebglContextLost={onWebglContextLost} />
      <Scene />
    </>
  );
}

class PearlCanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[PearlNecklaceScene] Canvas error:', error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

/** WebGL 不可用或已丢失时：同构图层 + 霓虹氛围，避免空白 / “没加载” */
function StaticPearlFallback({
  eyebrow,
  scrollLabel,
}: {
  eyebrow: string;
  scrollLabel: string;
}) {
  return (
    <>
      <div
        className="absolute inset-0 bg-void"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 85% 55% at 50% 38%, rgba(255,18,147,0.12) 0%, transparent 52%), radial-gradient(ellipse 55% 45% at 82% 62%, rgba(110,203,255,0.08) 0%, transparent 48%), radial-gradient(ellipse 50% 35% at 18% 70%, rgba(179,102,255,0.06) 0%, transparent 45%), #050505',
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <h1
          className="text-brutal-chrome"
          style={{
            textShadow:
              '0 4px 8px rgba(0, 0, 0, 0.9), 0 12px 24px rgba(0, 0, 0, 0.7), inset -2px -2px 4px rgba(0, 0, 0, 0.6), inset 2px 2px 4px rgba(255, 255, 255, 0.4), 0 0 40px rgba(201, 168, 76, 0.25)',
            letterSpacing: '0.08em',
            filter: 'brightness(1.2) contrast(1.4) drop-shadow(0 0 30px rgba(201, 168, 76, 0.3))',
            animation: 'chrome-shine 8s ease-in-out infinite',
          }}
        >
          RIOT CROWN
        </h1>
        <p
          className="text-label uppercase tracking-ultra-wide text-titanium mt-6 px-4"
          style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(201, 168, 76, 0.15)',
            opacity: 0.85,
            letterSpacing: '0.2em',
            fontWeight: 500,
            textAlign: 'center',
            animation: 'fade-pulse 4s ease-in-out infinite',
          }}
        >
          {eyebrow}
        </p>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <div className="animate-bounce text-y2k-pink text-center">
          <p className="text-label uppercase tracking-wide mb-2">{scrollLabel}</p>
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </>
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
        enableZoom={false}
        enablePan={false}
        autoRotate={!window.isUserInteracting}
        autoRotateSpeed={2}
        onStart={() => {
          window.isUserInteracting = true;
        }}
        onEnd={() => {
          window.isUserInteracting = false;
        }}
      />

      {/* Optimized Lighting */}
      <ambientLight intensity={0.3} color="#ffffff" />

      {/* Key Light - Pink */}
      <pointLight position={[8, 6, 8]} intensity={1.2} color="#FF1293" decay={2} castShadow={false} />

      {/* Fill Light - Cyan */}
      <pointLight position={[-8, -6, 8]} intensity={0.9} color="#6ECBFF" decay={2} castShadow={false} />

      {/* Rim Light - Purple */}
      <pointLight position={[0, 0, 12]} intensity={0.6} color="#B366FF" decay={2} castShadow={false} />

      {/* Environment */}
      <Environment preset="night" />

      {/* Fog for depth */}
      <fog attach="fog" args={['#000000', 5, 25]} />

      {/* Scene Content */}
      <NecklaceChain />
      <ParticleSystem />
      <NeonGlitch />

      <Preload all />
    </>
  );
}

// ─── Pearl Necklace Scene Component ───────────────────────────────────────

export function PearlNecklaceScene() {
  const { t } = useLocale();
  const [isMobile, setIsMobile] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  const sceneQuality = useMemo<PearlSceneQuality>(() => {
    if (isMobile) {
      return {
        pearlSegments: 32,
        pearlSegmentsSmall: 20,
        meshShadows: false,
        attachedPointLight: 'none',
        envMapIntensity: 2.2,
        toneExposure: 0.95,
      };
    }
    return {
      pearlSegments: 48,
      pearlSegmentsSmall: 32,
      meshShadows: false,
      attachedPointLight: 'subtle',
      envMapIntensity: 1.8,
      toneExposure: 1.05,
    };
  }, [isMobile]);

  const [useStaticFallback, setUseStaticFallback] = useState(false);

  const handleWebglContextLost = useCallback(() => {
    setUseStaticFallback(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsCanvasReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full bg-void" style={{ touchAction: 'auto' }}>
      <div className="relative w-full h-[85vh] md:h-screen overflow-hidden" style={{ touchAction: 'pan-y' }}>
        {useStaticFallback ? (
          <StaticPearlFallback eyebrow={t.hero.eyebrow} scrollLabel={t.hero.scroll} />
        ) : (
          <>
            {isCanvasReady && (
              <Suspense
                fallback={
                  <div className="w-full h-full bg-void flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-2 border-y2k-pink border-t-transparent rounded-full animate-spin" />
                    <span className="text-y2k-pink text-sm tracking-widest">{t.product.loading}</span>
                  </div>
                }
              >
                <PearlSceneQualityContext.Provider value={sceneQuality}>
                  <PearlCanvasErrorBoundary
                    fallback={
                      <StaticPearlFallback eyebrow={t.hero.eyebrow} scrollLabel={t.hero.scroll} />
                    }
                  >
                    <Canvas
                      gl={{
                        antialias: !isMobile,
                        alpha: false,
                        powerPreference: isMobile ? 'low-power' : 'high-performance',
                        stencil: false,
                        depth: true,
                        precision: isMobile ? 'lowp' : 'highp',
                        failIfMajorPerformanceCaveat: false,
                        preserveDrawingBuffer: false,
                      }}
                      dpr={isMobile ? 1 : [1, 1.5]}
                      performance={{ min: 0.5, max: isMobile ? 1 : 1 }}
                      style={{
                        pointerEvents: 'auto',
                        touchAction: isMobile ? 'pan-y' : 'auto',
                      }}
                      aria-label="Interactive 3D pearl necklace scene"
                      role="img"
                    >
                      <CanvasInner onWebglContextLost={handleWebglContextLost} />
                    </Canvas>
                  </PearlCanvasErrorBoundary>
                </PearlSceneQualityContext.Provider>
              </Suspense>
            )}

            {/* Overlay Text - Centered Premium Design */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {/* Top Brand Tagline */}
              <div className="mb-4 md:mb-6 text-center">
                <p
                  className="text-xs md:text-sm uppercase tracking-widest text-y2k-pink"
                  style={{
                    textShadow: '0 0 20px rgba(255, 18, 147, 0.5)',
                    letterSpacing: '0.3em',
                    fontWeight: 600,
                  }}
                >
                  {t.hero.eyebrow}
                </p>
              </div>

              {/* Center Title - Silver Metallic Premium */}
              <h1
                className="font-black text-center leading-none whitespace-nowrap"
                style={{
                  fontSize: 'clamp(3.5rem, 18vw, 16rem)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f2f2f2 15%, #e8e8e8 30%, #d4d4d4 50%, #a8a8a8 70%, #808080 85%, #606060 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: 'none',
                  filter: 'drop-shadow(0 0 30px rgba(232, 232, 232, 0.3)) drop-shadow(0 0 60px rgba(168, 168, 168, 0.15))',
                  letterSpacing: '-0.03em',
                  fontFamily: 'var(--font-y2k-display), var(--font-display)',
                  animation: 'chrome-shine 6s ease-in-out infinite',
                  overflow: 'visible',
                }}
              >
                RIOT CROWN
              </h1>

              {/* Bottom Decorative Line */}
              <div className="mt-6 md:mt-8 flex items-center gap-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-y2k-pink" />
                <span className="text-xs uppercase tracking-widest text-y2k-pink opacity-70">Premium Collection</span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-y2k-pink" />
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
              <div className="animate-bounce text-y2k-pink text-center">
                <p className="text-label uppercase tracking-wide mb-2">{t.hero.scroll}</p>
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
