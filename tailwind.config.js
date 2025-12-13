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
        // Primary - Electric Indigo (overriding Tailwind's indigo)
        indigo: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4338CA',  // Electric Indigo - main
          700: '#312E81',  // Deep Indigo - emphasis
          800: '#2E2772',
          900: '#1E1B4B',
        },
        // Secondary - Coral
        coral: {
          DEFAULT: '#F97066',
          light: '#FEB8B1',
          500: '#F97066',
          300: '#FEB8B1',
        },
        // Neutrals
        snow: '#FAFAFA',
        whisper: '#F4F4F5',
        zinc: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          500: '#71717A',
          700: '#3F3F46',
          900: '#18181B',
        },
      },
    },
  },
  plugins: [],
}

