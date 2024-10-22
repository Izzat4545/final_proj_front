import { createRouter, createWebHistory } from "vue-router";
import Register from "../pages/authentication/register/Register.vue";
import Login from "../pages/authentication/login/Login.vue";
import Home from "../pages/home/Home.vue";
import { useAuthStore } from "../store/authStore";
import Settings from "../pages/settings/Settings.vue";
import Events from "../pages/events/Events.vue";
import AuthCallback from "../pages/authentication/authCallback/AuthCallback.vue";
import ForgotPassword from "../pages/authentication/forgotPassword/forgotPassword.vue";
import Gifts from "../pages/gifts/Gifts.vue";
import { RouteNames, RoutePaths } from "../enums/Routes";

const routes = [
  {
    path: RoutePaths.HOME,
    name: RouteNames.HOME,
    component: Home,
  },
  {
    path: RoutePaths.SETTINGS,
    name: RouteNames.SETTINGS,
    component: Settings,
  },
  {
    path: RoutePaths.EVENTS,
    name: RouteNames.EVENTS,
    component: Events,
  },
  {
    path: RoutePaths.EVENTS_BY_ID,
    name: RouteNames.EVENTS_BY_ID,
    component: Events,
  },
  {
    path: RoutePaths.GIFTS_BY_EVENT_ID,
    name: RouteNames.GIFTS_BY_EVENT_ID,
    component: Gifts,
  },
  {
    path: RoutePaths.REGISTER,
    name: RouteNames.REGISTER,
    component: Register,
  },
  {
    path: RoutePaths.LOGIN,
    name: RouteNames.LOGIN,
    component: Login,
  },
  {
    path: RoutePaths.FORGOT_PASSWORD,
    name: RouteNames.FORGOT_PASSWORD,
    component: ForgotPassword,
  },
  {
    path: RoutePaths.AUTH_CALLBACK,
    name: RouteNames.AUTH_CALLBACK,
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
    [
      RouteNames.REGISTER,
      RouteNames.LOGIN,
      RouteNames.AUTH_CALLBACK,
      RouteNames.FORGOT_PASSWORD,
    ].includes(to.name as RouteNames)
  ) {
    next({ name: RouteNames.HOME });
  }
  // Check if user is not authenticated and trying to access protected routes
  else if (
    !isAuthenticated &&
    [RouteNames.SETTINGS, RouteNames.EVENTS, RouteNames.EVENTS_BY_ID].includes(
      to.name as RouteNames
    )
  ) {
    next({ name: RouteNames.LOGIN });
  } else {
    next();
  }
});
