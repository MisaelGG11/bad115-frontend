/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#5271ff',
        'primary-dark': '#2c3748',
        'primary-dark-active': '#1e2430',
        'primary-light': '#768fff',
        'secondary': '#000083',
        'purple': '#7e5bef',
        'pink': '#ff49db',
        'orange': '#ff7849',
        'success': '#13ce66',
        'warning': '#ffc82c',
        'gray-dark': '#273444',
        'gray': '#8492a6',
        'gray-light': '#d3dce6',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
