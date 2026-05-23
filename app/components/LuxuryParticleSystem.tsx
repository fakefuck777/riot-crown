import React, { useEffect, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: 'gold' | 'rose' | 'pearl';
  opacity: number;
  life: number;
  maxLife: number;
}

const PARTICLE_CONFIG = {
  gold: {
    color: '#d4af37',
    size: 2,
    speed: 0.5,
    life: 8000,
  },
  rose: {
    color: '#b76e79',
    size: 1.5,
    speed: 0.3,
    life: 10000,
  },
  pearl: {
    color: '#e8e8e8',
    size: 1,
    speed: 0.2,
    life: 12000,
  },
};

export function LuxuryParticleSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const particleIdRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createParticle = (type: 'gold' | 'rose' | 'pearl'): Particle => {
      const config = PARTICLE_CONFIG[type];
      const angle = Math.random() * Math.PI * 2;
      const speed = config.speed + Math.random() * 0.3;

      return {
        id: particleIdRef.current++,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 20,
        vx: Math.cos(angle) * speed,
        vy: -Math.abs(Math.sin(angle) * speed),
        size: config.size,
        type,
        opacity: 1,
        life: 0,
        maxLife: config.life,
      };
    };

    const updateAndRender = () => {
      const particles = particlesRef.current;

      // Update existing particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 16; // ~60fps

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.01; // Gravity effect

        // Fade out
        const fadeStart = p.maxLife * 0.8;
        if (p.life > fadeStart) {
          p.opacity = 1 - (p.life - fadeStart) / (p.maxLife - fadeStart);
        }
      }

      // Add new particles periodically
      if (particles.length < 40) {
        const types: Array<'gold' | 'rose' | 'pearl'> = ['gold', 'rose', 'pearl'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        particles.push(createParticle(randomType));
      }

      // Render particles
      const existingParticles = container.querySelectorAll('.particle-element');
      existingParticles.forEach((el) => {
        const id = parseInt(el.getAttribute('data-id') || '-1');
        if (!particles.find((p) => p.id === id)) {
          el.remove();
        }
      });

      particles.forEach((particle) => {
        let el = container.querySelector(`[data-id="${particle.id}"]`) as HTMLElement;

        if (!el) {
          el = document.createElement('div');
          el.className = 'particle-element';
          el.setAttribute('data-id', particle.id.toString());
          el.style.cssText = `
            position: absolute;
            width: ${particle.size}px;
            height: ${particle.size}px;
            border-radius: 50%;
            pointer-events: none;
            will-change: transform, opacity;
          `;
          container.appendChild(el);
        }

        const config = PARTICLE_CONFIG[particle.type];
        el.style.left = `${particle.x}px`;
        el.style.top = `${particle.y}px`;
        el.style.opacity = particle.opacity.toString();
        el.style.background = config.color;
        el.style.boxShadow = `0 0 ${particle.size * 5}px ${config.color}`;
      });

      animationFrameRef.current = requestAnimationFrame(updateAndRender);
    };

    animationFrameRef.current = requestAnimationFrame(updateAndRender);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
    />
  );
}
