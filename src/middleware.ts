import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Simple in-memory rate limiter (per Edge isolate)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS = 30; // 30 requests
const WINDOW_MS = 60 * 1000; // per 1 minute

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

export default clerkMiddleware(async (auth, request) => {
  // 1. API Rate Limiting (Anti-Spam)
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const now = Date.now();
  const rateLimitData = rateLimitMap.get(ip);

  if (rateLimitData) {
    if (now > rateLimitData.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    } else {
      if (rateLimitData.count >= MAX_REQUESTS) {
        return new NextResponse("Too Many Requests - Rate Limit Exceeded", { status: 429 });
      }
      rateLimitData.count += 1;
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
  }

  // 2. Auth Protection
  if (isProtectedRoute(request)) {
    const { userId, redirectToSignIn } = await auth();
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
