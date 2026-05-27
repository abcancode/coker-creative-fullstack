/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Bona Nova SC'", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
