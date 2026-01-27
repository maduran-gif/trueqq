/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5CF6',
        },
        secondary: {
          DEFAULT: '#3B82F6',
        },
        success: {
          DEFAULT: '#10B981',
        },
      },
    },
  },
}