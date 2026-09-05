/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#173840',
        sky: '#e8f4f8',
        ocean: '#287f8c',
        mint: '#d8eee8',
        blush: '#f8ebe8',
        butter: '#fbf3cf',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Fraunces"', 'serif'],
      },
      boxShadow: {
        soft: '0 24px 80px rgba(23, 56, 64, 0.10)',
        card: '0 14px 40px rgba(23, 56, 64, 0.08)',
      },
    },
  },
  plugins: [],
}
