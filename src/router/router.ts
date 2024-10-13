import { createRouter, createWebHistory } from "vue-router";
import Register from "../pages/register/Register.vue";
import Login from "../pages/login/Login.vue";
import Home from "../pages/home/Home.vue";
import { useAuthStore } from "../store/authStore";
import Settings from "../pages/settings/Settings.vue";
import Events from "../pages/events/Events.vue";

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

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated();

  // Redirect logged-in users away from login and register routes
  if (isAuthenticated && (to.name === "Register" || to.name === "Login")) {
    next({ name: "Home" });
  }
  // Check if user is not authenticated and trying to access protected routes
  else if (
    !isAuthenticated &&
    (to.name === "Settings" || to.name === "Events")
  ) {
    next({ name: "Login" });
  } else {
    next();
  }
});
