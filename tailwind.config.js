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
      colors: {
        navy: {
          50: '#E8EBF4',
          100: '#C5CCE3',
          200: '#9BA7CF',
          300: '#7A8BC4',
          400: '#4E63A9',
          500: '#3A4FA8',
          600: '#27388E',
          700: '#1E2C6E',
          800: '#162052',
          900: '#0F1638',
        },
      },
    },
  },
  plugins: [],
}

