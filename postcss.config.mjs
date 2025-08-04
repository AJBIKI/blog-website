// /** @type {import('postcss-load-config').Config} */
// const config = {
//   plugins: {
//     '@tailwindcss/postcss': {}, // This is the only change
//     autoprefixer: {},
//   },
// };

// export default config;



// /** @type {import('postcss-load-config').Config} */
// const config = {
//   plugins: {
//     tailwindcss: {},  // Changed from '@tailwindcss/postcss'
//     autoprefixer: {},
//   },
// };

// export default config;


/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;