import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: ["sonerugurlu.tail28c4a2.ts.net"],
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4101",
        changeOrigin: true,
        secure: false,
        ws: true, // WebSocket ve uzun süreli bağlantıları desteklemesi için
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
