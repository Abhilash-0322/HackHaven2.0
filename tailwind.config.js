/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#071018',
        ink: '#0b1720',
        mint: '#74f7de',
        lavender: '#a98cff',
        coral: '#ff9966',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        mint: '0 0 40px rgba(116, 247, 222, .16)',
        lavender: '0 0 40px rgba(169, 140, 255, .18)',
      },
    },
  },
  plugins: [],
}
