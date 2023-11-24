const getPrismThemeStyles = require('./prism-themes/getPrismThemeStyles')
const getThemeByName = getPrismThemeStyles.getThemeByName

module.exports = {
  // corePlugins: {
  //   preflight: false,
  // },
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            ...getThemeByName('prism-base16-ateliersulphurpool.light'),
          },
        },
        invert: {
          css: {
            ...getThemeByName('prism-duotone-dark'),
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
