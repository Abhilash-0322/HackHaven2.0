/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#07100d',
        panel: '#0d1713',
        mint: '#b9f6c4',
        lime: '#d6ff4a',
        signal: '#83e86b',
        cloud: '#e6eee8',
        dim: '#84978b',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        signal: '0 0 40px rgba(214, 255, 74, .13)',
      },
    },
  },
  plugins: [],
}
