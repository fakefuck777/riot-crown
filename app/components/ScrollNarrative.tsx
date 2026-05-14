'use client';
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocale } from '~/lib/LocaleContext';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface ScrollNarrativeProps {
  onChapterChange?: (chapter: number) => void;
}

export function ScrollNarrative({ onChapterChange }: ScrollNarrativeProps) {
  const { locale } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const chapter1Ref = useRef<HTMLDivElement>(null);
  const chapter2Ref = useRef<HTMLDivElement>(null);
  const chapter3Ref = useRef<HTMLDivElement>(null);
  const [, setCurrentChapter] = useState(0);

  const narratives = {
    EN: {
      chapter1: {
        title: 'BORN FROM RUINS',
        subtitle: 'In the wreckage of 2000, pearls emerged.',
        description: 'Chrome-plated, iridescent, defiant. Not jewelry—a resurrection.',
      },
      chapter2: {
        title: 'CROWNED BY QUEENS',
        subtitle: 'The last woman standing.',
        description: 'She wore it like armor. Like a crown. Like the only truth left.',
      },
      chapter3: {
        title: 'RAVE AT 3AM',
        subtitle: 'The night belongs to those who refuse to fade.',
        description: 'Strobe lights. Sweat. Chrome catching every flash. This is where legends are made.',
      },
    },
    ZH: {
      chapter1: {
        title: '废墟中重生',
        subtitle: '千禧年崩坏后，珍珠诞生了。',
        description: '镀铬、彩虹光泽、叛逆。不是饰品——是复活。',
      },
      chapter2: {
        title: '女王加冕',
        subtitle: '最后站立的女人。',
        description: '她戴上它，像穿上盔甲。像戴上王冠。像仅存的真理。',
      },
      chapter3: {
        title: '凌晨三点的狂欢',
        subtitle: '夜晚属于拒绝褪色的人。',
        description: '频闪灯。汗水。Chrome 在每一道闪光中闪烁。传奇在这里诞生。',
      },
    },
    JP: {
      chapter1: {
        title: '廃墟から再生',
        subtitle: 'ミレニアムの崩壊後、真珠が誕生した。',
        description: 'クロムメッキ、虹色、反抗的。ジュエリーではなく——復活。',
      },
      chapter2: {
        title: '女王の戴冠',
        subtitle: '最後に立つ女性。',
        description: '彼女はそれを鎧のように着た。王冠のように。唯一の真実のように。',
      },
      chapter3: {
        title: '午前3時のレイブ',
        subtitle: '夜は色褪せることを拒む者のもの。',
        description: 'ストロボライト。汗。すべてのフラッシュでクロムが輝く。伝説がここで生まれる。',
      },
    },
  };

  const currentNarrative = narratives[locale as keyof typeof narratives] || narratives.EN;

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Chapter 1: Ruins
      gsap.fromTo(
        chapter1Ref.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: chapter1Ref.current,
            start: 'top 60%',
            end: 'top 30%',
            scrub: 1,
            onEnter: () => {
              setCurrentChapter(1);
              onChapterChange?.(1);
            },
          },
        }
      );

      // Chapter 1 background animation
      gsap.to(chapter1Ref.current, {
        backgroundPosition: '100% 100%',
        duration: 20,
        repeat: -1,
        ease: 'none',
        scrollTrigger: {
          trigger: chapter1Ref.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 2,
        },
      });

      // Chapter 2: Crown
      gsap.fromTo(
        chapter2Ref.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'back.out',
          scrollTrigger: {
            trigger: chapter2Ref.current,
            start: 'top 60%',
            end: 'top 30%',
            scrub: 1,
            onEnter: () => {
              setCurrentChapter(2);
              onChapterChange?.(2);
            },
          },
        }
      );

      // Chapter 3: Rave
      gsap.fromTo(
        chapter3Ref.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: chapter3Ref.current,
            start: 'top 60%',
            end: 'top 30%',
            scrub: 1,
            onEnter: () => {
              setCurrentChapter(3);
              onChapterChange?.(3);
            },
          },
        }
      );

      // Chapter 3 strobe effect - only when in viewport
      const strobeAnimation = gsap.to(chapter3Ref.current, {
        boxShadow: '0 0 40px rgba(255,18,147,0.8)',
        duration: 0.3,
        repeat: -1,
        yoyo: true,
        paused: true,
        scrollTrigger: {
          trigger: chapter3Ref.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
          onEnter: () => {
            strobeAnimation.play();
          },
          onLeave: () => {
            strobeAnimation.pause();
          },
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [reducedMotion, locale, onChapterChange]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Chapter 1: Ruins */}
      <section
        ref={chapter1Ref}
        className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a0033 50%, #000000 100%)',
          backgroundSize: '200% 200%',
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-y2k-pink/10 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h2
            className="text-display-3xl font-black uppercase mb-4 text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(135deg, #FF1293 0%, #B366FF 100%)',
              textShadow: '0 0 40px rgba(255,18,147,0.3)',
              letterSpacing: '0.15em',
            }}
          >
            {currentNarrative.chapter1.title}
          </h2>
          <p
            className="text-display-lg font-bold uppercase mb-6"
            style={{
              color: '#6ECBFF',
              textShadow: '0 0 20px rgba(110,203,255,0.3)',
              letterSpacing: '0.08em',
            }}
          >
            {currentNarrative.chapter1.subtitle}
          </p>
          <p
            className="text-body-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(242,242,242,0.8)' }}
          >
            {currentNarrative.chapter1.description}
          </p>
        </div>

        {/* Particle effect */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: ['#FF1293', '#6ECBFF', '#B366FF', '#C8FF00'][i % 4],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                opacity: Math.random() * 0.6 + 0.2,
              }}
            />
          ))}
        </div>
      </section>

      {/* Chapter 2: Crown */}
      <section
        ref={chapter2Ref}
        className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0d0d1f 0%, #1a0033 50%, #0d0d1f 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-b from-y2k-pink/5 via-transparent to-y2k-purple/5" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div
            className="inline-block mb-8 px-6 py-3 rounded-full border"
            style={{
              borderColor: '#FF1293',
              background: 'rgba(255,18,147,0.05)',
            }}
          >
            <span className="text-label uppercase tracking-widest" style={{ color: '#FF1293' }}>
              ✦ 第二章 ✦
            </span>
          </div>

          <h2
            className="text-display-3xl font-black uppercase mb-4 text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(135deg, #C9A84C 0%, #FF1293 100%)',
              textShadow: '0 0 40px rgba(201,168,76,0.3)',
              letterSpacing: '0.15em',
            }}
          >
            {currentNarrative.chapter2.title}
          </h2>
          <p
            className="text-display-lg font-bold uppercase mb-6"
            style={{
              color: '#C9A84C',
              textShadow: '0 0 20px rgba(201,168,76,0.3)',
              letterSpacing: '0.08em',
            }}
          >
            {currentNarrative.chapter2.subtitle}
          </p>
          <p
            className="text-body-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(242,242,242,0.8)' }}
          >
            {currentNarrative.chapter2.description}
          </p>
        </div>

        {/* Crown glow effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none">
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-20"
            style={{
              background: 'radial-gradient(circle, #C9A84C 0%, transparent 70%)',
              animation: 'pulse 4s ease-in-out infinite',
            }}
          />
        </div>
      </section>

      {/* Chapter 3: Rave */}
      <section
        ref={chapter3Ref}
        className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a0000 0%, #330033 50%, #1a0000 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-b from-y2k-pink/20 via-transparent to-y2k-pink/10" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div
            className="inline-block mb-8 px-6 py-3 rounded-full border animate-pulse"
            style={{
              borderColor: '#FF1293',
              background: 'rgba(255,18,147,0.1)',
            }}
          >
            <span className="text-label uppercase tracking-widest" style={{ color: '#FF1293' }}>
              ✦ 第三章 ✦
            </span>
          </div>

          <h2
            className="text-display-3xl font-black uppercase mb-4 text-transparent bg-clip-text animate-neon-flicker"
            style={{
              backgroundImage: 'linear-gradient(135deg, #FF1293 0%, #FF0080 100%)',
              textShadow: '0 0 60px rgba(255,18,147,0.5)',
              letterSpacing: '0.15em',
            }}
          >
            {currentNarrative.chapter3.title}
          </h2>
          <p
            className="text-display-lg font-bold uppercase mb-6 animate-pulse"
            style={{
              color: '#FF1293',
              textShadow: '0 0 30px rgba(255,18,147,0.4)',
              letterSpacing: '0.08em',
            }}
          >
            {currentNarrative.chapter3.subtitle}
          </p>
          <p
            className="text-body-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(242,242,242,0.8)' }}
          >
            {currentNarrative.chapter3.description}
          </p>
        </div>

        {/* Strobe effect overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,18,147,0.1) 2px, rgba(255,18,147,0.1) 4px)',
            animation: 'strobe 0.1s infinite',
          }}
        />
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.2; }
          50% { transform: translateY(-20px); opacity: 0.8; }
        }
        @keyframes strobe {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.3; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
