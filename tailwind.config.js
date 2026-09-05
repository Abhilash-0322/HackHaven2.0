/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111116',
        paper: '#f3f0e8',
        acid: '#d6f277',
        teal: '#62dfcf',
        violet: '#a996ff',
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui'],
        display: ['Syne', 'ui-sans-serif', 'system-ui'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(214, 242, 119, .18), 0 14px 42px rgba(0, 0, 0, .2)',
      },
    },
  },
  plugins: [],
}
