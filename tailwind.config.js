/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#3B5F73',
          blueMuted: '#294758',
          green: '#3D6F68',
          greenMuted: '#2C524D',
          bg: '#0F1C24',
          surface: '#13232D',
          text: '#E6F0F3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
