/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#161616',
        paper: '#f7f7f2',
        lime: '#ccff00',
        cloud: '#e9e9e2',
        lilac: '#d9d2ff',
        coral: '#ff785f',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        sticker: '4px 4px 0 #161616',
        soft: '0 18px 50px rgba(22, 22, 22, 0.08)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
