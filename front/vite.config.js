import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        // Le front appelle /api/... : Vite transmet à l'API Express.
        // Front et API ont donc la même origine : le cookie suit, pas besoin de CORS.
        proxy: { "/api": "http://localhost:3000" },
    },
});
