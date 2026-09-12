import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  // Marketing & public pages
  "/",
  "/gallery",
  "/gallery/(.*)",
  "/artwork/(.*)",
  "/collection/(.*)",
  "/collections",
  "/collections/(.*)",
  "/museum",
  "/museum/(.*)",
  "/about",
  "/journal",
  "/journal/(.*)",
  "/story/(.*)",
  "/search",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
  "/payment/(.*)",
  // Auth pages
  "/login",
  "/register",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  // Admin (no auth in middleware — handled in page-level guards)
  "/admin",
  "/admin/(.*)",
  // Public APIs
  "/api/artworks",
  "/api/artworks/(.*)",
  "/api/collections",
  "/api/collections/(.*)",
  "/api/moon-cycles",
  "/api/moon-cycles/(.*)",
  "/api/admin/artworks",
  "/api/admin/artworks/(.*)",
  "/api/webhooks/(.*)",
  "/(.*)\\.(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
