/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Sans"', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
      },
      colors: {
        ink: '#0b0c15',
        shell: '#11121e',
        lilac: '#bfa7ff',
        mint: '#a8f5d2',
      },
    },
  },
  plugins: [],
}
