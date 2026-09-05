/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        ink: '#090d1b',
        violet: '#9b8cff',
        teal: '#42dfc2',
      },
      boxShadow: {
        glass: '0 20px 60px rgba(0, 0, 0, .22)',
      },
    },
  },
  plugins: [],
}
