// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // We are extending the default font families
      fontFamily: {
        mono: ['var(--font-roboto-mono)'], // Reference the CSS variable we created
      },
    },
  },
  plugins: [],
};