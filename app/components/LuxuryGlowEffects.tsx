import React, { useEffect, useRef } from 'react';

export function LuxuryGlowEffects() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create glow orbs with smooth animations
    const createGlowOrb = (
      className: string,
      size: number,
      top?: string,
      left?: string,
      right?: string,
      bottom?: string
    ) => {
      const orb = document.createElement('div');
      orb.className = `glow-orb-exclusive ${className}`;
      let styleStr = `
        position: absolute;
        border-radius: 50%;
        filter: blur(100px);
        opacity: 0.12;
        will-change: transform;
        width: ${size}px;
        height: ${size}px;
      `;
      if (top) styleStr += `top: ${top};`;
      if (left) styleStr += `left: ${left};`;
      if (right) styleStr += `right: ${right};`;
      if (bottom) styleStr += `bottom: ${bottom};`;

      orb.style.cssText = styleStr;
      container.appendChild(orb);
    };

    // Create multiple glow orbs
    createGlowOrb('glow-orb-gold-exclusive', 600, '5%', '5%');
    createGlowOrb('glow-orb-rose-exclusive', 500, undefined, undefined, '5%', '10%');
    createGlowOrb('glow-orb-sapphire-exclusive', 700, '50%', '50%');

    // Add subtle mouse tracking for interactive glow
    const handleMouseMove = (e: MouseEvent) => {
      const orbs = container.querySelectorAll('.glow-orb-exclusive');
      orbs.forEach((orb, index) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        const offset = index * 5;
        (orb as HTMLElement).style.transform = `translate(${x + offset}px, ${y + offset}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="glow-container-exclusive"
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
