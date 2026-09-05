/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b1220',
        cloud: '#f7f9fc',
        brand: '#635bff',
        mint: '#8be8cc',
        coral: '#ff8d6b',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 60px -30px rgba(15, 23, 42, .25)',
        card: '0 1px 2px rgba(15, 23, 42, .05), 0 10px 35px -20px rgba(15, 23, 42, .2)',
      },
    },
  },
  plugins: [],
}
