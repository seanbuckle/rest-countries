import { registerSW } from "virtual:pwa-register";

registerSW({
    onNeedRefresh() {
        // Show a toast or notification to the user to refresh
        console.log("New content available, please refresh.");
    },
    onOfflineReady() {
        console.log("App ready to work offline");
    },
});
