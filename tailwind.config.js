/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        '[820px]': '820px',
      },
      lineHeight: {
        'relaxed': '1.7',
      },
      spacing: {
        '[2px]': '2px',
      }
    },
  },
  plugins: [],
}