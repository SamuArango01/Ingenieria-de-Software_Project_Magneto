import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// pasar a otro archivo
// estas son las rutas protegidas
const ProtectedRoutes = [
  "/setup-role",
  "/dashboard",
  "/entrevistador",
  "/profile",
  "/settings",
];

const isProtectedRoute = createRouteMatcher(ProtectedRoutes);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
