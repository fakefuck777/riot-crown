import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void:    '#050505',  // Vantablack base
        'void-plate': '#07070c',
        'void-pit':   '#030304',
        dust:    '#2A2A2A',
        chrome:  '#A8A8A8',
        titanium:'#F2F2F2',
        gold:    '#C9A84C',
        liquid:  '#D4D4D4',
        // Y2K 黑暗工业风格
        'y2k-pink':     '#ff1293',
        'y2k-pink-dark':'#cc0f75',
        'y2k-purple':   '#b366ff',
        'y2k-purple-dark': '#8833cc',
        'y2k-blue':     '#6ecbff',
        'y2k-blue-dark':'#3399ff',
        'y2k-acid':     '#c8ff00',
        'y2k-acid-dark':'#99cc00',
        'y2k-red':      '#ff0033',
        'y2k-red-dark': '#cc0028',
        'y2k-silver':   '#e8e8e8',
        'y2k-silver-dark': '#b3b3b3',
        // 液态金属渐变
        'liquid-metal': '#d4d4d4',
        'liquid-dark':  '#808080',
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
        'neon-pink-purple': 'linear-gradient(135deg, #ff1293 0%, #b366ff 100%)',
        'neon-blue-cyan': 'linear-gradient(135deg, #6ecbff 0%, #00ffff 100%)',
        'liquid-metal-gradient': 'linear-gradient(135deg, #e8e8e8 0%, #808080 50%, #e8e8e8 100%)',
        'acid-glow': 'linear-gradient(135deg, #c8ff00 0%, #99ff00 100%)',
        'dark-waste': 'radial-gradient(ellipse at 50% 50%, rgba(255,18,147,0.1) 0%, transparent 70%)',
      },
      boxShadow: {
        'neon-pink': '0 0 20px rgba(255, 18, 147, 0.5), 0 0 40px rgba(255, 18, 147, 0.25)',
        'neon-purple': '0 0 20px rgba(179, 102, 255, 0.5), 0 0 40px rgba(179, 102, 255, 0.25)',
        'neon-blue': '0 0 20px rgba(110, 203, 255, 0.5), 0 0 40px rgba(110, 203, 255, 0.25)',
        'neon-acid': '0 0 20px rgba(200, 255, 0, 0.5), 0 0 40px rgba(200, 255, 0, 0.25)',
        'glitch-pink': '3px 3px 0px rgba(255, 18, 147, 0.8), -3px -3px 0px rgba(110, 203, 255, 0.8)',
        'glitch-purple': '2px 2px 0px rgba(179, 102, 255, 0.8), -2px -2px 0px rgba(200, 255, 0, 0.8)',
      },
      transitionTimingFunction: {
        'brutal': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'heavy':  'cubic-bezier(0.77, 0, 0.175, 1)',
      },
      animation: {
        'neon-flicker': 'neon-flicker 0.15s infinite',
        'glitch': 'glitch 0.3s infinite',
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'shimmer': 'shimmer 3s infinite',
        'waste-rain': 'waste-rain 4s linear infinite',
      },
      keyframes: {
        'neon-flicker': {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.5' },
        },
        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'waste-rain': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
