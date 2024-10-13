import { createRouter, createWebHistory } from "vue-router";
import Register from "../pages/register/Register.vue";
import Login from "../pages/login/Login.vue";
import Home from "../pages/home/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
