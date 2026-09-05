/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#070a12',
        panel: '#0d111d',
        line: '#1c2435',
        lime: '#c8f55a',
        mint: '#8af3c5',
        violet: '#8b7cff',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 45px rgba(200,245,90,.12)',
      },
    },
  },
  plugins: [],
}
