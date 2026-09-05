/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#123B60',
        primary: '#2778D4',
        'primary-dark': '#1B5FAE',
        sky: '#EAF5FF',
        mint: '#E6F8F4',
        sun: '#FFF3D2',
        coral: '#FFF0EC',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 16px 50px rgba(37, 103, 159, 0.12)',
        card: '0 8px 28px rgba(18, 59, 96, 0.08)',
      },
    },
  },
  plugins: [],
}
