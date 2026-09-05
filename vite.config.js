import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 6016, host: true },
  preview: { port: 6016, host: true },
});
