/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'med-teal': '#0f766e',
        'med-light': '#ccfbf1',
        'med-dark': '#115e59',
        'text-main': '#1e293b',
        'glass': 'rgba(255, 255, 255, 0.1)'
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
        'emergency-pulse': 'emergency-pulse 2s ease-in-out infinite',
        'shine': 'shine 3s infinite',
        'button-press': 'button-press 0.2s ease',
        'slide-in-up': 'slideInUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'shake': 'shake 0.8s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'emergency-pulse': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 0 20px rgba(239, 68, 68, 0)' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'button-press': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        slideInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
      }
    },
  },
  plugins: [],
}
