/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f0f7',
          100: '#d1e1ef',
          200: '#a3c3df',
          300: '#75a5cf',
          400: '#4787bf',
          500: '#1a2e4a', // Azul escuro principal
          600: '#15253c',
          700: '#101c2e',
          800: '#0b1320',
          900: '#060a12',
        },
        gold: {
          50: '#fef9e7',
          100: '#fdf3cf',
          200: '#fbe79f',
          300: '#f9db6f',
          400: '#f7cf3f',
          500: '#d4af37', // Dourado principal
          600: '#b8942f',
          700: '#9c7927',
          800: '#805e1f',
          900: '#644317',
        },
      },
    },
  },
  plugins: [],
}

