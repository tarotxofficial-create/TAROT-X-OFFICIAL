/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#06070a',
          900: '#0a0d14',
          850: '#0f1420',
          800: '#141b2d',
          700: '#1e293b',
        },
        gold: {
          100: '#fdf8ea',
          200: '#f9ecc8',
          300: '#f4de9e',
          400: '#ecc86b',
          500: '#e5b238',
          600: '#c69222',
          700: '#9d6d16',
          glow: '#d4af37'
        },
        mystic: {
          purple: '#8a2be2',
          violet: '#6b21a8',
          amethyst: '#9333ea',
          indigo: '#4f46e5',
          cyan: '#06b6d4',
          emerald: '#10b981',
          crimson: '#e11d48'
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        'cinzel-decorative': ['"Cinzel Decorative"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'rotate-slow': 'spin 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
