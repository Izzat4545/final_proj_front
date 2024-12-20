export enum RouteNames {
  HOME = "HOME",
  SETTINGS = "Settings",
  EVENTS = "Events",
  EVENTS_BY_ID = "EventsById",
  GIFTS_BY_EVENT_ID = "GiftsByEventId",
  REGISTER = "Register",
  LOGIN = "Login",
  FORGOT_PASSWORD = "ForgotPassword",
  AUTH_CALLBACK = "AuthCallback",
  NOT_FOUND = "NotFound",
}

export enum RoutePaths {
  HOME = "/",
  SETTINGS = "/settings",
  EVENTS = "/events",
  EVENTS_BY_ID = "/events/:id",
  GIFTS_BY_EVENT_ID = "/gifts/:id",
  REGISTER = "/register",
  LOGIN = "/login",
  FORGOT_PASSWORD = "/auth/reset",
  AUTH_CALLBACK = "/auth/callback",
  NOT_FOUND = "/:pathMatch(.*)*",
}
