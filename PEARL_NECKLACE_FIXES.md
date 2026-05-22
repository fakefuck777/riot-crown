// 这是 PearlNecklaceScene.tsx 的关键修改
// 将以下代码替换到现有文件中

// ============================================================================
// 第 1 步：在文件顶部添加导入
// ============================================================================

import { useDeviceCapabilities, getSceneQualityTier, getParticleCount, getPearlSegments } from '~/hooks/useDeviceCapabilities';

// ============================================================================
// 第 2 步：修改 ParticleSystem 组件 (第 218-308 行)
// ============================================================================

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
      positions[i] = (Math.random() - 0.5) * 35;
      positions[i + 1] = (Math.random() - 0.5) * 35;
      positions[i + 2] = (Math.random() - 0.5) * 25;

      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i + 2] = (Math.random() - 0.5) * 0.02;
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
      [0.93, 0.93, 0.93], // chrome silver
    ];

    for (let i = 0; i < count * 3; i += 3) {
      const choice = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i] = choice[0];
      colors[i + 1] = choice[1];
      colors[i + 2] = choice[2];
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: caps.isMobile ? 0.12 : 0.15,
      sizeAttenuation: true,
      transparent: true,
      opacity: caps.isMobile ? 0.5 : 0.7,
      vertexColors: true,
      toneMapped: true,
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

// ============================================================================
// 第 3 步：修改 PearlNecklaceScene 组件 (第 520-643 行)
// ============================================================================

export function PearlNecklaceScene() {
  const { t } = useLocale();
  const caps = useDeviceCapabilities();
  const [useStaticFallback, setUseStaticFallback] = useState(false);

  // 如果 WebGL 不支持，直接使用静态回退
  useEffect(() => {
    if (!caps.webglSupported) {
      setUseStaticFallback(true);
    }
  }, [caps.webglSupported]);

  const sceneQuality = useMemo<PearlSceneQuality>(() => {
    const tier = getSceneQualityTier(caps);
    const segments = getPearlSegments(caps);

    if (tier === 'low') {
      return {
        pearlSegments: segments.main,
        pearlSegmentsSmall: segments.small,
        meshShadows: false,
        attachedPointLight: 'none',
        envMapIntensity: 1.5,
        toneExposure: 0.95,
      };
    }

    if (tier === 'medium') {
      return {
        pearlSegments: segments.main,
        pearlSegmentsSmall: segments.small,
        meshShadows: false,
        attachedPointLight: 'subtle',
        envMapIntensity: 2.65,
        toneExposure: 0.98,
      };
    }

    // high
    return {
      pearlSegments: segments.main,
      pearlSegmentsSmall: segments.small,
      meshShadows: true,
      attachedPointLight: 'full',
      envMapIntensity: 2.1,
      toneExposure: 1.08,
    };
  }, [caps]);

  const handleWebglContextLost = useCallback(() => {
    setUseStaticFallback(true);
  }, []);

  return (
    <div className="relative w-full bg-void" style={{ touchAction: 'auto' }}>
      <div className="relative w-full h-[85vh] md:h-screen overflow-hidden" style={{ touchAction: 'pan-y' }}>
        {useStaticFallback ? (
          <StaticPearlFallback eyebrow={t.hero.eyebrow} scrollLabel={t.hero.scroll} />
        ) : (
          <>
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
                      antialias: !caps.isMobile,
                      alpha: false,
                      powerPreference: caps.isMobile ? 'low-power' : 'high-performance',
                      stencil: false,
                      depth: true,
                      precision: caps.isMobile ? 'lowp' : 'highp',
                      failIfMajorPerformanceCaveat: false, // ✅ 关键：允许降级
                    }}
                    dpr={caps.isMobile ? 1 : [1, 2]}
                    performance={{ min: 0.3, max: caps.isMobile ? 1 : 1 }} // ✅ 改进：允许更低的性能
                    style={{
                      pointerEvents: 'auto', // ✅ 关键：启用交互
                      touchAction: caps.isMobile ? 'pan-y' : 'auto', // ✅ 允许垂直滚动
                    }}
                    aria-label="Interactive 3D pearl necklace scene" // ✅ 无障碍性
                    role="img"
                  >
                    <CanvasInner onWebglContextLost={handleWebglContextLost} />
                  </Canvas>
                </PearlCanvasErrorBoundary>
              </PearlSceneQualityContext.Provider>
            </Suspense>

            {/* Overlay Text */}
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
                {t.hero.eyebrow}
              </p>
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
