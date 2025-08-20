/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        darkblue: '#0A1128',
        black: '#000000',
        accent: '#1E90FF', // Optional accent color
      },
      fontFamily: {
        sans: ['Poppins', ...fontFamily.sans],
        display: ['Montserrat', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 1.5s ease-in-out',
        bounceSlow: 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};