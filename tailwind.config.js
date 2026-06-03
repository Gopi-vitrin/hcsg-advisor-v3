/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './v2.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'hcsg-orange':        '#e65e25',  // palette1 — primary CTA
        'hcsg-navy':          '#011e41',  // palette3 — dark surfaces
        'hcsg-brown':         '#653a15',  // palette4 — dark brown accent
        'hcsg-sienna':        '#b55c35',  // palette6 — burnt sienna dividers
        'hcsg-amber':         '#f5a524',  // palette15 — warnings
        'hcsg-light-orange':  '#f7630c',  // palette14 — vivid orange
        'hcsg-dark-red':      '#b82105',  // palette13 — errors/critical
        'hcsg-green':         '#13612e',  // palette11 — success/confirmed
        'hcsg-warm-gray':     '#b6b7a9',  // palette5 — muted text
        'hcsg-light-gray':    '#e8e8e8',  // section backgrounds
        'hcsg-blue':          '#1159af',  // palette12 — supplemental (not in layouts)
        'hcsg-bg':            '#1a3d6b',  // lighter screen background (content areas)
      },
    },
  },
  plugins: [],
}
