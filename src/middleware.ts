import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
];

export default clerkMiddleware((auth, req) => {
  // Check if the request is for a public route
  const isPublic = publicRoutes.some((pattern) => {
    const matcher = createRouteMatcher(pattern);
    return matcher(req);
  });

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
