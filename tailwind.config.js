/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#060809',
        panel: '#0b0f10',
        line: '#1b2525',
        acid: '#baff3f',
        signal: '#54e2ff',
        amber: '#ffb454',
        danger: '#ff6b75',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        acid: '0 0 30px rgba(186, 255, 63, .12)',
        signal: '0 0 30px rgba(84, 226, 255, .12)',
      },
    },
  },
  plugins: [],
}
