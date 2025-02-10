/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-quill/dist/quill.snow.css",
  ],
  themes: [
    {
      studyPlatform: {
        primary: "#007BFF",
        secondary: "#28A745",
        accent: "#FFC107",
        neutral: "#343A40",
        "base-100": "#FFFFFF",
        info: "#17A2B8",
        success: "#28A745",
        warning: "#FFC107",
        error: "#DC3545",
      },
    },
  ],
  plugins: [
    require('daisyui'),
  ],
}