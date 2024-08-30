/** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }



module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}', // Next.js specific paths
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',    // If using the /app directory in Next.js
    './src/**/*.{js,ts,jsx,tsx}',    // If you store components/pages in /src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

