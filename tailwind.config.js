/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { ink: '#080a0a', panel: '#101313', mint: '#b7ff46', lime: '#d9ff85', line: '#252c2b' },
      fontFamily: { display: ['Space Grotesk', 'sans-serif'], mono: ['IBM Plex Mono', 'monospace'], body: ['DM Sans', 'sans-serif'] },
      boxShadow: { lime: '0 0 32px rgba(183,255,70,.14)', insetline: 'inset 0 1px rgba(255,255,255,.05)' },
    },
  },
  plugins: [],
}
