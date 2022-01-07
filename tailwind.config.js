module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './posts/**/*.{mdx,md}'],
  darkMode: 'class',
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Montserrat'],
      serif: ['Merriweather'],
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
