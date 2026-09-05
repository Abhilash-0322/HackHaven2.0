/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff8ff',
          100: '#dff1ff',
          200: '#b9e3ff',
          300: '#7bceff',
          400: '#38bdf8',
          500: '#229ed9',
          600: '#168acd',
          700: '#1375b5',
          800: '#145e91',
          900: '#164e73',
        },
        agent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 10px 0 rgb(13 112 177 / 0.06), 0 1px 3px -1px rgb(15 23 42 / 0.05)',
        card: '0 14px 30px -18px rgb(13 112 177 / 0.34)',
      },
    },
  },
  plugins: [],
};
