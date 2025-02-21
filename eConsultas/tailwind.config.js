/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "640px", // This will be your desktop breakpoint
    },
    extend: {
      scrollBehavior: {
        smooth: "smooth",
      },
      colors: {
        // Main colors
        primary: {
          DEFAULT: "#0EA5E9", // sky-600
          hover: "#0284C7", // sky-700
          light: "#E0F2FE", // sky-100
          dark: "#0C4A6E", // sky-900
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#14B8A6", // teal-500
          hover: "#0D9488", // teal-600
          light: "#CCFBF1", // teal-100
          dark: "#115E59", // teal-800
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "#6366F1", // indigo-500
          hover: "#4F46E5", // indigo-600
          light: "#E0E7FF", // indigo-100
          dark: "#3730A3", // indigo-800
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "#DC2626", // red-600
          hover: "#B91C1C", // red-700
          foreground: "hsl(var(--destructive-foreground))",
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
        foreground: "hsl(var(--foreground))",
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        input: "hsl(var(--input))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
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
      fontSize: {
        title: ["1.5rem", { lineHeight: "2rem", fontWeight: "700" }],
        subtitle: ["1.25rem", { lineHeight: "1.75rem", fontWeight: "600" }],
        normal: ["1rem", { lineHeight: "1.5rem", fontWeight: "400" }],
      },
      animation: {
        blob: "blob 7s infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],

  function({ addVariant }) {
    addVariant("success", ["&.success", ".success &"]);
  },
};
