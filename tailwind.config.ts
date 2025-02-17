import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7289da',
          50: '#f5f6fd',
          100: '#ebedfb',
          200: '#d8dcf7',
          300: '#b8bff0',
          400: '#8f9be4',
          500: '#7289da',
          600: '#4c69cf',
          700: '#3d55b7',
          800: '#344795',
          900: '#2d3c77',
          950: '#1e2748',
        },
        dark: {
          DEFAULT: '#2C2F33',
          50: '#f6f6f7',
          100: '#e3e3e5',
          200: '#c7c8cc',
          300: '#a3a5ab',
          400: '#7d8089',
          500: '#636770',
          600: '#4e515a',
          700: '#2C2F33',
          800: '#1e2024',
          900: '#17181b',
          950: '#0c0d0e',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
