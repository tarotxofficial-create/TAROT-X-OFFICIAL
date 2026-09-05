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
        void: '#050508',
        'primary-void': '#050508',
        obsidian: {
          950: '#050508',
          900: '#0a0d14',
          850: '#0f1420',
          800: '#141b2d',
          700: '#1e293b',
        },
        steel: {
          900: '#0b0e14',
          800: '#111622',
          DEFAULT: '#1F2833',
          light: '#2d3748',
        },
        'monolith-steel': '#1F2833',
        gold: {
          100: '#fdf8ea',
          200: '#f9ecc8',
          300: '#f4de9e',
          400: '#ecc86b',
          500: '#e5b238',
          600: '#c69222',
          700: '#9d6d16',
          glow: '#d4af37',
        },
        cyan: {
          vector: '#66FCF1',
          glow: '#45A29E',
        },
        'vector-cyan': '#66FCF1',
        amber: {
          warning: '#C5A059',
          gold: '#d4af37',
        },
        'warning-amber': '#C5A059',
        bone: '#F8F9FA',
        'text-primary': '#F8F9FA',
        smoke: '#C5C6C7',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        'cinzel-decorative': ['"Cinzel Decorative"', 'serif'],
        mono: ['"Space Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'laser-glow': 'laserGlow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(0.5deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        laserGlow: {
          '0%': { opacity: '0.4', filter: 'drop-shadow(0 0 4px #66FCF1)' },
          '100%': { opacity: '0.9', filter: 'drop-shadow(0 0 12px #66FCF1)' },
        }
      }
    },
  },
  plugins: [],
}

