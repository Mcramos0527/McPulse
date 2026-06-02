import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        'accent-green': '#00FF94',
        'accent-blue': '#1F5C99',
        danger: '#FF3B3B',
        warning: '#FFB800',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(0, 255, 148, 0.3)',
        'glow-red': '0 0 20px rgba(255, 59, 59, 0.3)',
        'glow-yellow': '0 0 20px rgba(255, 184, 0, 0.3)',
        'glow-blue': '0 0 20px rgba(31, 92, 153, 0.3)',
      },
      animation: {
        'pulse-green': 'pulse-green 2s infinite',
        'scanline': 'scanline 8s linear infinite',
        'count-up': 'count-up 2s ease-out forwards',
      },
      keyframes: {
        'pulse-green': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 255, 148, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 255, 148, 0.6)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
