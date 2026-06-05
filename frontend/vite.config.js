import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "BOZP",
        short_name: "BOZP",
        background_color: "#101828",
        theme_color: "#000000",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "images/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "images/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
