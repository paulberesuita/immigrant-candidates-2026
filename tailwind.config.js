/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./script.js",
    "./functions/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

