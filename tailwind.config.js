/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1b302d',
        forest: '#315c4b',
        sage: '#82a998',
        cream: '#f7f5ef',
        sand: '#e8dec9',
        blush: '#ead7d0',
        gold: '#c99d55',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        card: '0 20px 60px rgba(49, 92, 75, .10)',
        soft: '0 10px 30px rgba(24, 58, 50, .08)',
      },
    },
  },
  plugins: [],
}
