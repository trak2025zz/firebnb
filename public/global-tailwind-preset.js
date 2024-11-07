/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF5A5F",
      },
      boxShadow: {
        background: "40px 40px 10px 9999px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};
