/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui'],
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        ink: '#17142d',
        violet: '#8467f5',
      },
      boxShadow: {
        glow: '0 14px 50px rgba(131, 99, 245, 0.18)',
      },
    },
  },
  plugins: [],
}
