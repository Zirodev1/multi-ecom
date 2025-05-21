import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { DEMO_MODE_COOKIE, DEMO_ROLE_COOKIE, DEMO_STORE_URL } from "./lib/demo-mode";

// Configure public routes
const publicRoutes = [
  "/",
  "/(.*)/product/(.*)",
  "/browse(.*)",
  "/cart",
  "/checkout",
  "/profile",
  "/products/(.*)",
  "/api/webhook(.*)",
  "/api/search-products(.*)",
  "/dashboard/signin",
  "/demo",
  "/api/demo/(.*)",
];

export default clerkMiddleware((auth, req) => {
  // Check if the request is for a public route
  const isPublic = publicRoutes.some((pattern) => {
    const matcher = createRouteMatcher(pattern);
    return matcher(req);
  });

  // Check if user is in demo mode
  const demoMode = req.cookies.get(DEMO_MODE_COOKIE)?.value === "true";
  const demoRole = req.cookies.get(DEMO_ROLE_COOKIE)?.value;
  
  // Allow demo users to access dashboard routes based on their role
  if (demoMode && demoRole) {
    // If trying to access dashboard routes that match their role, allow it
    if ((demoRole === "ADMIN" && req.nextUrl.pathname.startsWith("/dashboard/admin")) ||
        (demoRole === "SELLER" && req.nextUrl.pathname.startsWith("/dashboard/seller"))) {
      return NextResponse.next();
    }
  }

  // For all other routes, protect them
  if (!isPublic) {
    const authState = auth.protect();
    return authState.redirectToSignIn ? NextResponse.redirect(new URL('/dashboard/signin', req.url)) : NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
