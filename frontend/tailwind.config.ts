import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        green: {
          DEFAULT: '#2DB56A',
          dark: '#0D2B1A',
        },
        silver: '#C0C0C0',
        surface: '#111111',
        border: {
          DEFAULT: '#1E1E1E',
          card: '#2A2A2A',
        },
        muted: '#6B7280',
        amber: {
          DEFAULT: '#F59E0B',
          bg: '#1A1200',
        },
      },
      animation: {
        'wa-pulse': 'wa-pulse 2s infinite',
        'check': 'check-spring 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        'wa-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 #25D36640' },
          '50%': { boxShadow: '0 0 0 12px #25D36600' },
        },
        'check-spring': {
          '0%': { transform: 'scale(0) rotate(-45deg)', opacity: '0' },
          '60%': { transform: 'scale(1.2) rotate(5deg)' },
          '80%': { transform: 'scale(0.95) rotate(-2deg)' },
          '100%': { transform: 'scale(1) rotate(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
