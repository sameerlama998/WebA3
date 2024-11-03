// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // "./views/**/*.html", // Include your HTML files
    "./views/**/*.ejs", // Include your HTML files
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust as needed for your JavaScript/TypeScript files
  ],
  themes: [
   
    'cupcake',
    
  ],
  plugins: [
    require('daisyui'),
  ],
}
