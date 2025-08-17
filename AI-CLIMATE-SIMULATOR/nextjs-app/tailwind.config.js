/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'earth-blue': '#1e40af',
        'toxic-green': '#16a34a',
        'pollution-red': '#dc2626',
        'ice-blue': '#0ea5e9',
        'desert-yellow': '#ca8a04',
        'forest-green': '#15803d',
        'ocean-deep': '#1e3a8a',
        'smoke-gray': '#374151',
        'warning-orange': '#ea580c',
        'clean-air': '#93c5fd',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      boxShadow: {
        'glow': '0 0 15px rgba(14, 165, 233, 0.5)',
        'danger': '0 0 15px rgba(220, 38, 38, 0.5)',
        'success': '0 0 15px rgba(22, 163, 74, 0.5)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
        '3xl': '3rem',
      },
      fontSize: {
        'xxs': '0.65rem',
        'mega': '4rem',
        'super': '5rem',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      }
    },
  },
  plugins: [],
}