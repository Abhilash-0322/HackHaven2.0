/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b1014',
        cloud: '#e7f0ed',
        mint: '#b8f2d3',
        lime: '#d6ff70',
      },
    },
  },
  plugins: [],
}
