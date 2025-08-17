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
        background: {
          dark: "#0a0a0a",
          purple: "#1e0032",
        },
        accent: {
          purple: "#7e3ff2",
          pink: "#e05eff",
          danger: "#ff1744",
          warning: "#ff9100",
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',

        // Custom gradients
        'learn-gradient':
          'linear-gradient(135deg, #7e3ff2 0%, #e05eff 100%)',
        'card-front':
          'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(126,63,242,0.2))',
        'card-back':
          'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(224,94,255,0.2))',
        'correct-gradient':
          'linear-gradient(135deg, #6a00f4, #d500f9)',
        'incorrect-gradient':
          'linear-gradient(135deg, #ff1744, #ff9100)',
      },
      boxShadow: {
        glow: "0 0 15px rgba(126,63,242,0.6)",
        card: "0 8px 20px rgba(0,0,0,0.4)",
      },
      borderRadius: {
        card: "1rem",
        button: "0.75rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
