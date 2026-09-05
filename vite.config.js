import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 6135,
    host: "0.0.0.0",
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
});
