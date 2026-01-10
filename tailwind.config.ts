// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      fontFamily: {
        body: ['Georgia', 'Tinos', '"Liberation Serif"', 'serif'],
        headline: ['"Playfair Display"', 'Georgia', 'serif'],
        ui: ['"Libre Franklin"', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
} satisfies Config;