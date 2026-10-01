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
        ivory: {
          DEFAULT: '#F6F3ED',
          50: '#FFFFFF',
          100: '#FAF8F5',
          200: '#F6F3ED',
          300: '#EFEAE0',
          400: '#E5DED1',
        },
        sand: {
          DEFAULT: '#E9E3D8',
          light: '#F0EBE2',
          dark: '#DDD5C7',
          border: '#D5CDBE',
        },
        ink: {
          DEFAULT: '#17201C',
          50: '#F4F5F4',
          100: '#E2E5E3',
          200: '#B8C0BC',
          300: '#8E9A94',
          400: '#5C6B64',
          500: '#3D4A43',
          600: '#2D3934',
          700: '#212B26',
          800: '#17201C',
          900: '#0E1411',
        },
        terracotta: {
          DEFAULT: '#C45D3A',
          50: '#FDF6F3',
          100: '#F9ECE6',
          200: '#F1D4C8',
          300: '#E5B19E',
          400: '#D5866C',
          500: '#C45D3A',
          600: '#A84A2A',
          700: '#8A3A1F',
          800: '#6C2B16',
          900: '#4D1D0E',
        },
        olive: {
          DEFAULT: '#66705B',
          light: '#7B876F',
          dark: '#515B47',
          muted: '#8D9882',
        },
        forest: {
          DEFAULT: '#172B2A',
          light: '#233F3E',
          dark: '#0E1B1A',
          border: '#2C4947',
        }
      },
      fontFamily: {
        serif: ['DM Serif Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        '8xl': '1440px',
        '9xl': '1536px',
      },
      letterSpacing: {
        editorial: '0.2em',
        widest: '0.15em',
      }
    },
  },
  plugins: [],
}
