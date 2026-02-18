/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2dd4a8', dark: '#1ab894', light: 'rgba(45,212,168,0.15)' },
        htb: {
          dark: '#1A1A1A',
          darkAlt: '#2A2A2A',
          bg: '#F8FAFC',
        },
      },
    },
  },
  plugins: [],
};
