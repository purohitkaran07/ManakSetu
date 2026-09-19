/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#062B52',
          'navy-dark': '#041B33',
          deep: '#0B2545',
          blue: '#0067C5',
          'blue-light': '#0B73E8',
          accent: '#0265C2',
          light: '#F0F6FC',
          'light-blue': '#EAF5FF',
          border: '#D8E5F0',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
