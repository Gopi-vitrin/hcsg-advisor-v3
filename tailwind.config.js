/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'hcsg-orange':        '#e65e25',
        'hcsg-navy':          '#011e41',
        'hcsg-brown':         '#653a15',
        'hcsg-blue':          '#1159af',
        'hcsg-amber':         '#f5a524',
        'hcsg-light-orange':  '#f7630c',
        'hcsg-dark-red':      '#b82105',
      },
    },
  },
  plugins: [],
}
