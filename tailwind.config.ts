import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void:    '#050505',  // Vantablack base
        /** Slightly lifted cool plate — long-scroll visual rest vs flat void */
        'void-plate': '#07070c',
        /** Deep anchor — footer / dense panels */
        'void-pit':   '#030304',
        dust:    '#2A2A2A',  // Mid-dark texture
        chrome:  '#A8A8A8',  // Pearl Gray
        titanium:'#F2F2F2',  // Stark Titanium
        gold:    '#C9A84C',  // 18K Raw Gold
        liquid:  '#D4D4D4',  // Liquid Chrome
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      letterSpacing: {
        'ultra-wide':       '0.35em',
        'wide-header':      '0.2em',
        'compressed':       '-0.04em',
        'ultra-compressed': '-0.07em',
      },
      lineHeight: {
        'brutal': '0.88',
        'airy':   '1.6',
      },
      spacing: {
        '18':  '4.5rem',
        '22':  '5.5rem',
        '30':  '7.5rem',
        '38':  '9.5rem',
        '72':  '18rem',
        '96':  '24rem',
        '128': '32rem',
      },
      fontSize: {
        'display-2xl': ['clamp(5rem, 12vw, 14rem)', { lineHeight: '0.88', letterSpacing: '0.02em' }],
        'display-xl':  ['clamp(3.5rem, 8vw, 9rem)',  { lineHeight: '0.9',  letterSpacing: '0.03em' }],
        'display-lg':  ['clamp(2.5rem, 5vw, 6rem)',  { lineHeight: '0.92', letterSpacing: '0.04em' }],
        'label':       ['0.65rem',                   { lineHeight: '1',    letterSpacing: '0.25em' }],
        'data':        ['0.7rem',                    { lineHeight: '1.2',  letterSpacing: '-0.04em' }],
      },
      backgroundImage: {
        'void-gradient': 'linear-gradient(180deg, #050505 0%, #0d0d0d 100%)',
      },
      transitionTimingFunction: {
        'brutal': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'heavy':  'cubic-bezier(0.77, 0, 0.175, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
