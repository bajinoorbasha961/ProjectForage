/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        lavender: {
          50: '#fbf8ff',
          100: '#f5eeff',
          200: '#ebd9ff',
          300: '#dbb8ff',
          400: '#c48bff',
          500: '#aa53ff',
          600: '#952bfe',
          700: '#8119e3',
          800: '#6a14bd',
          900: '#571399',
          950: '#140b29',
        },
        slate: {
          50: '#faf8ff',
          100: '#f1edfb',
          200: '#e1d9f5',
          300: '#c7b8ec',
          400: '#a58ede',
          500: '#8464ce',
          600: '#6c44be',
          700: '#5833a4',
          800: '#231540',
          850: '#170e2c',
          900: '#120b22',
          950: '#0a0518',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float3d 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'wave-3d': 'wave3d 4s ease-in-out infinite',
      },
      keyframes: {
        float3d: {
          '0%, 100%': { transform: 'translateY(0px) rotateX(0deg) rotateY(0deg)' },
          '50%': { transform: 'translateY(-15px) rotateX(6deg) rotateY(-6deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.08)' },
        },
        wave3d: {
          '0%, 100%': { transform: 'perspective(500px) rotateX(10deg) rotateZ(0deg)' },
          '50%': { transform: 'perspective(500px) rotateX(-10deg) rotateZ(180deg)' },
        }
      },
      boxShadow: {
        '3d-lavender': '0 10px 30px -5px rgba(168, 85, 247, 0.3), 0 0 15px rgba(216, 180, 254, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        '3d-button': '0 6px 0 #6b21a8, 0 10px 20px rgba(147, 51, 234, 0.4)',
        '3d-button-active': '0 2px 0 #6b21a8, 0 4px 10px rgba(147, 51, 234, 0.3)',
        'glow-purple': '0 0 25px rgba(168, 85, 247, 0.5)',
      }
    },
  },
  plugins: [],
}

