/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101010',
        paper: '#f4f1eb',
        neon: '#c7f36b',
        lavender: '#c9b8ff',
      },
      fontFamily: {
        display: ['"DM Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
