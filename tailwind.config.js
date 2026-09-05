/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111318',
        panel: '#1a1d24',
        raised: '#232731',
        discord: '#5865f2',
        mint: '#6ee7b7',
        peach: '#ffb59d',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 35px rgba(88, 101, 242, .2)',
      },
    },
  },
  plugins: [],
}
