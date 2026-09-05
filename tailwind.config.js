/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      colors: {
        ink: '#090a12',
        panel: '#11121c',
        purple: '#9d7bff',
        mint: '#a7f3d0',
        acid: '#d7f85f',
      },
      boxShadow: {
        glow: '0 0 42px rgba(157, 123, 255, .18)',
      },
    },
  },
  plugins: [],
}
