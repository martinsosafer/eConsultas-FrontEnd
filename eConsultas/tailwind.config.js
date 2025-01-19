/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Main colors
        primary: {
          DEFAULT: "#0EA5E9", // sky-600
          hover: "#0284C7", // sky-700
          light: "#E0F2FE", // sky-100
          dark: "#0C4A6E", // sky-900
        },
        secondary: {
          DEFAULT: "#14B8A6", // teal-500
          hover: "#0D9488", // teal-600
          light: "#CCFBF1", // teal-100
          dark: "#115E59", // teal-800
        },
        accent: {
          DEFAULT: "#6366F1", // indigo-500
          hover: "#4F46E5", // indigo-600
          light: "#E0E7FF", // indigo-100
          dark: "#3730A3", // indigo-800
        },
        destructive: {
          DEFAULT: "#DC2626", // red-600
          hover: "#B91C1C", // red-700
        },
        warning: {
          DEFAULT: "#F59E0B", // amber-500
          hover: "#D97706", // amber-600
        },
        success: {
          DEFAULT: "#22C55E", // green-500
          hover: "#16A34A", // green-600
        },
        background: "#FAFAFA", // gray-50
        card: "#FFFFFF", // white
        border: "#E5E7EB", // gray-200
        ring: "#0EA5E9", // sky-600
      },
      fontFamily: {
        sans: [
          "Inter var",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
