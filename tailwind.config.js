/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: '#07150f',
        neon: '#14f195',
        solana: '#9945ff',
        mist: '#a9c7b9',
      },
      boxShadow: {
        neon: '0 0 30px rgba(20, 241, 149, .16)',
        'neon-sm': '0 0 15px rgba(20, 241, 149, .2)',
      },
    },
  },
  plugins: [],
}
