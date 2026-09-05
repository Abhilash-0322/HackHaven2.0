/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#071018",
        ink: "#0b1720",
        cyan: "#74f7de",
        violet: "#a98cff",
        ember: "#ff9966",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["DM Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        neon: "0 0 40px rgba(116, 247, 222, .16)",
        violet: "0 0 40px rgba(169, 140, 255, .18)",
      },
    },
  },
  plugins: [],
}

