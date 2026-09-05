/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#27231d',
        cream: '#fffaf0',
        paper: '#fffdf8',
        lime: '#d9f36c',
        moss: '#1d482e',
        coral: '#f26d58',
        mango: '#f4b844',
        lavender: '#e9e3ff',
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 50px rgba(46, 35, 20, 0.09)',
        card: '0 8px 0 rgba(39, 35, 29, 0.08)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.08)', opacity: '1' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulseSoft: 'pulseSoft 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
