import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./core/**/*.{js,ts,jsx,tsx,mdx}",
    "./shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        backcontrast: "var(--backcontrast)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        hover: "var(--hover)",
        textGray: "var(--text-gray)",
        active: "var(--active)",
        navItemNonActiveHover: "var(--nav-item-root-non-active-hover)",
        navItemNonActiveClick: "var(--nav-item-root-non-active-click)",
        navItemActiveBg: "var(--nav-item-root-active-bg)",
        navItemActiveHover: "var(--nav-item-root-active-hover)",
        navItemActiveClick: "var(--nav-item-root-active-click)",
      },
    },
  },
  plugins: [],
} satisfies Config;
