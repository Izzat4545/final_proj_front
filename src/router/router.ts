import { createRouter, createWebHistory } from "vue-router";
import Register from "../pages/authentication/register/Register.vue";
import Login from "../pages/authentication/login/Login.vue";
import Home from "../pages/home/Home.vue";
import { useAuthStore } from "../store/authStore";
import Settings from "../pages/settings/Settings.vue";
import Events from "../pages/events/Events.vue";
import AuthCallback from "../pages/authentication/authCallback/AuthCallback.vue";
import ForgotPassword from "../pages/authentication/forgotPassword/forgotPassword.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/events",
    name: "Events",
    component: Events,
  },
  {
    path: "/events/:id",
    name: "EventsById",
    component: Events,
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
  {
    path: "/auth/reset",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/auth/callback",
    name: "AuthCallback",
    component: AuthCallback,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated();

  // Redirect logged-in users away from login and register routes
  if (
    isAuthenticated &&
    (to.name === "Register" ||
      to.name === "Login" ||
      to.name === "AuthCallback" ||
      to.name === "ForgotPassword")
  ) {
    next({ name: "Home" });
  }
  // Check if user is not authenticated and trying to access protected routes
  else if (
    !isAuthenticated &&
    (to.name === "Settings" || to.name === "Events" || to.name === "EventsById")
  ) {
    next({ name: "Login" });
  } else {
    next();
  }
});
