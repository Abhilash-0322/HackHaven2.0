/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#081f2a',
        ocean: '#0d5c63',
        mint: '#a8dadc',
        butter: '#f5d491',
        coral: '#ef8354',
        cloud: '#f4f7f2',
      },
      fontFamily: {
        display: ['"DM Sans"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 60px rgba(8, 31, 42, 0.08)',
        card: '0 3px 0 rgba(8, 31, 42, 0.04), 0 20px 40px rgba(8, 31, 42, 0.07)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.035'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
