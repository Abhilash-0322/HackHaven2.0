/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080d19',
        panel: '#101a29',
        line: '#233247',
        lime: '#c7f36b',
        aqua: '#7ce5d3',
        muted: '#8492a7',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 80px rgba(199,243,107,.14)',
      },
    },
  },
  plugins: [],
}
