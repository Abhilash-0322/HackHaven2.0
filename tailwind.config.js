/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Sans"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        ink: '#e8f3e7',
        muted: '#8aa49b',
        surface: '#102c2b',
        panel: '#123534',
        teal: '#75e2bb',
        acid: '#d7f56a',
        coral: '#ff927f',
      },
      boxShadow: {
        glow: '0 0 60px rgba(117, 226, 187, 0.11)',
      },
    },
  },
  plugins: [],
}
