/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        ink: "#19221f",
        sage: "#dce8dd",
        moss: "#55745c",
        clay: "#e7815d",
        sand: "#f7f7f2",
      },
      boxShadow: {
        soft: "0 18px 55px rgba(36, 54, 44, 0.09)",
        card: "0 8px 25px rgba(36, 54, 44, 0.07)",
      },
    },
  },
  plugins: [],
};
