import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)", 
  "/create(.*)", 
  "/onboarding(.*)", 
  "/api/onboarding(.*)",
  "/api/dashboard(.*)",
  "/api/posts(.*)",
  "/api/payout(.*)",
  "/api/upload(.*)",
  "/api/checkout(.*)"
]);

export default clerkMiddleware((auth, request) => {
  if (isProtectedRoute(request)) {
    const { userId, redirectToSignIn } = auth();
    if (!userId) {
      return redirectToSignIn();
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*"
  ],
};
