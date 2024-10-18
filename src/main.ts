import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import { router } from "./router/router";

const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount("#app");
app.config.errorHandler = (err, vm, info) => {
  console.error("Global error handler:", err, info);
};
