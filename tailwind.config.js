/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#FAF7F2', muted: '#F0EBE3', dark: '#E8E2D8' },
        charcoal: { DEFAULT: '#2C2C2C', light: '#4A4A4A', muted: '#6B6B6B' },
        terracotta: { DEFAULT: '#C45C3E', light: '#D4785C', dark: '#A34A30' },
        ink: '#1A1A1A',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        body: ['Lora', 'Georgia', 'serif'],
      },
      boxShadow: {
        editorial: '0 2px 24px -4px rgba(26, 26, 26, 0.08)',
      },
    },
  },
  plugins: [],
};
