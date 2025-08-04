// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       animation: {
//         'fade-in-up': 'fadeInUp 1s ease-out',
//       },
//       keyframes: {
//         fadeInUp: {
//           '0%': {
//             opacity: '0',
//             transform: 'translateY(30px)',
//           },
//           '100%': {
//             opacity: '1',
//             transform: 'translateY(0)',
//           },
//         },
//       },
//       backdropBlur: {
//         xs: '2px',
//       },
//     },
//   },
//   plugins: [],
// }


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}