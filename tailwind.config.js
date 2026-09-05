/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#252b25',
        moss: '#536b58',
        paper: '#f8f5ef',
        butter: '#f2d86b',
        blush: '#ead9d1',
      },
      fontFamily: {
        display: ['DM Serif Display', 'Georgia', 'serif'],
        sans: ['Manrope', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
