/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          100: '#E6FDF5',
          500: '#00D68F',
          600: '#00D68F',
          700: '#00B87A',
        },
        accent: {
          100: '#F0FFE0',
          500: '#D4FF00',
          600: '#B8E600',
        },
        primary: {
          DEFAULT: '#00D68F',
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
