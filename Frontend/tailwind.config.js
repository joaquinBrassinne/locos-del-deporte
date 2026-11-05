/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-gold': '#E8C766',
        'brand-gold-hover': '#f0d27e',
        'brand-dark': '#0e0e0e',
        'brand-card': '#161616',
        'brand-border': '#262626',
        'brand-muted': '#9ca3af',
      },
      fontFamily: {
        sport: ['Oswald', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        sport: '0.03em',
      },
    },
  },
  plugins: [],
};
