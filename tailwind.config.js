/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: '#08090b',
        panel: '#101216',
        line: '#252930',
        cloud: '#f5f7fa',
        mint: '#b6f09c',
        violet: '#a78bfa',
        coral: '#ff8f70',
      },
      boxShadow: {
        glow: '0 0 55px rgba(182, 240, 156, 0.12)',
      },
    },
  },
  plugins: [],
}
