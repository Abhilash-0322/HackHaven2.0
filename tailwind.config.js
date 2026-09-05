/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#11111d',
        paper: '#f8f6f2',
        lilac: '#c7b8ff',
        coral: '#ff8f70',
        mint: '#a7e8c6',
        sky: '#8ed5ff',
        lemon: '#ffe493',
      },
      fontFamily: {
        display: ['"DM Sans"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 60px rgba(20, 16, 44, .10)',
        card: '0 8px 30px rgba(20, 16, 44, .08)',
      },
    },
  },
  plugins: [],
}
