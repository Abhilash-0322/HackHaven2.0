/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#113d2d",
        moss: "#4c8d68",
        mint: "#dceee2",
        cream: "#faf9f5",
        ink: "#1d2d25",
        clay: "#d37d55",
        lilac: "#e9e0f4",
      },
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 16px 50px rgba(17, 61, 45, .09)",
      },
    },
  },
  plugins: [],
};
