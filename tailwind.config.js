/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0e13',
        panel: '#11151c',
        line: '#242a34',
        copper: '#d69b62',
        sage: '#92a890',
        paper: '#e5e0d7',
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui'],
        serif: ['DM Serif Display', 'Georgia', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
