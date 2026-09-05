/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#f4f7f0",
          100: "#e6eee0",
          200: "#cfdfc5",
          300: "#afc8a3",
          400: "#8ead83",
          500: "#719569",
          600: "#577a50",
          700: "#456140",
          800: "#394d36",
          900: "#303f2f"
        },
        ink: "#21312a",
        sand: "#f7f6f0"
      },
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui"],
        display: ["Fraunces", "Georgia", "serif"]
      },
      boxShadow: {
        float: "0 24px 70px rgba(64, 89, 67, 0.14)"
      }
    }
  },
  plugins: []
};
