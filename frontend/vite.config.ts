import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
      enabled: true,
       },

      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
      ],

      manifest: {
        name: "KisanBot",
        short_name: "KisanBot",

        description:
          "AI-powered multilingual agricultural assistant for farmers.",

        theme_color: "#16a34a",

        background_color: "#ffffff",

        display: "standalone",

        orientation: "portrait",

        start_url: "/",

        scope: "/",

        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,

        clientsClaim: true,

        skipWaiting: true,

        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "document",

            handler: "NetworkFirst",

            options: {
              cacheName: "pages-cache",
            },
          },

          {
            urlPattern: ({ request }) =>
              request.destination === "image",

            handler: "CacheFirst",

            options: {
              cacheName: "image-cache",
            },
          },

          {
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style",

            handler: "StaleWhileRevalidate",

            options: {
              cacheName: "static-assets",
            },
          },
          {
  urlPattern: ({ request }) =>
    request.destination === "font",

  handler: "CacheFirst",

  options: {
    cacheName: "fonts-cache",
  },
},
{
  urlPattern: ({ url }) =>
    url.origin === "http://127.0.0.1:8000",

  handler: "NetworkFirst",

  options: {
    cacheName: "backend-api",
    networkTimeoutSeconds: 3,
  },
},
        ],
      },
    }),
  ],

  server: {
    port: 5173,
  },
});