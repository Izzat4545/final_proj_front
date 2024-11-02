import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import { router } from "./router/router";
import Notifications from "@kyvg/vue3-notification";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";

const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(Notifications);
app.use(autoAnimatePlugin);
app.mount("#app");
app.config.errorHandler = (err, _vm, info) => {
  console.error("Global error handler:", err, info);
};
