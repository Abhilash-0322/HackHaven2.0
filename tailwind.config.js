/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF7F2',
          dark: '#F0EBE3',
          light: '#FDFCFA',
        },
        charcoal: {
          DEFAULT: '#2C2C2C',
          light: '#4A4A4A',
          muted: '#6B6B6B',
        },
        terracotta: {
          DEFAULT: '#C45C3E',
          light: '#D4785E',
          dark: '#A34A30',
          muted: '#C45C3E20',
        },
        editorial: {
          border: '#E8E2D9',
          rule: '#D4CCC0',
          ink: '#1A1A1A',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        editorial: '0 1px 3px rgba(44, 44, 44, 0.06), 0 4px 12px rgba(44, 44, 44, 0.04)',
        card: '0 2px 8px rgba(44, 44, 44, 0.05)',
      },
    },
  },
  plugins: [],
};
