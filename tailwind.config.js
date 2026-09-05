/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#07100c',
        panel: '#101b15',
        moss: '#a4d65e',
        'moss-dark': '#5e9436',
        mist: '#edf5ec',
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui'],
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glow: '0 0 70px rgba(164, 214, 94, .16)',
      },
    },
  },
  plugins: [],
}
