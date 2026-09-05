/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f4f1eb',
        ink: '#171616',
        vermilion: '#e2553d',
        cobalt: '#2744b8',
        acid: '#d7ef45',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
