import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  //If user is logged in, redirect them to the settings page when they try to sign in
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    //return user to where the last URL they were visiting before they logged out
    let callbackUrl = nextUrl.pathname;

    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  //Don't do anything if no if statements are met
  return null;
});

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  //whatever matches in the array will cause this middleware (auth) to be

  //Everything except next static files and images will invoke the middleware (auth)
  //This is a regex from Clerk
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
