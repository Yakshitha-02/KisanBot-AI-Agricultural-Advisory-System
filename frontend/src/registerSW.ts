import { registerSW } from "virtual:pwa-register";

export const updateSW = registerSW({
  immediate: true,

  onOfflineReady() {
    console.log("✅ App ready for offline use.");
  },

  onRegistered() {
    console.log("✅ Service Worker Registered");
  },

  onNeedRefresh() {
    console.log("🔄 New version available.");
  },
});