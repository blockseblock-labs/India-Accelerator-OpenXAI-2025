/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./pages/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				background: { DEFAULT: "#f8f5e6" },
				foreground: { DEFAULT: "#1f2937" },
				muted: { DEFAULT: "#efe9d8" },
				accent: { DEFAULT: "#2f855a" },
			},
			boxShadow: {
				soft: "0 1px 3px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.03)",
			},
		},
	},
	plugins: [],
};


