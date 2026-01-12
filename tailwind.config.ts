import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        headline: ["var(--font-headline)", "serif"],
        ui: ["var(--font-ui)", "ui-sans-serif", "system-ui"],
        body: ["var(--font-body)", "Georgia", "serif"],
      },
    },
  },
} satisfies Config;