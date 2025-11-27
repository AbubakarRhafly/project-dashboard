import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";   // ← wajib untuk Tailwind v4

export default defineConfig({
  plugins: [react(), tailwind()],
});
