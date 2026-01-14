/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2.5rem', // Matches the soft corners in the design
      },
      colors: {
        // We map the design's colors to your Brand Identity
        primary: "#0F172A",    // The Dark text color (almost black/navy)
        accent: "#84CC16",     // Your Bright Green (for highlights)
        surface: "#F4F7F4",    // The very light background grey/green
        "pale-green": "#E3F0D3", // The distinct light green background color in the design
      }
    },
  },
  plugins: [],
}