// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default <Config>{
  content: [
    "./app.vue",
    "./pages/**/*.vue",
    "./components/**/*.vue",
    "./layouts/**/*.vue",
  ],
  darkMode: "class", // Enables dark mode via class
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // Deep Blue
        secondary: "#9333EA", // Purple
        accent: "#FACC15", // Yellow
        background: "#F8FAFC", // Light grayish
        darkBackground: "#1E293B", // Dark mode background
        text: "#111827", // Dark gray text
        darkText: "#E5E7EB", // Light gray text in dark mode
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};
