// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define your custom brand colors
        'navy': {
          900: '#1A2C42', // Your Primary Navy Blue
          700: '#2E435B', // A slightly lighter shade for hovers/accents
        },
        'teal': {
          500: '#009688', // Your Secondary Teal Color
          600: '#007A6F', // A darker shade for hover effects
        },
      },
      // You can also extend other defaults like font-family or spacing here
    },
  },
  plugins: [],
}