import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoutes = createRouteMatcher(["/dashboard(.*)"]);
export default clerkMiddleware(async (auth, req: NextRequest) => {
  //  {  TUTORIAL WAY }
  // const { userId } = await auth();
  // if (!userId && isProtectedRoutes(req)) {
  //   const { redirectToSignIn } = await auth();
  //   return redirectToSignIn();
  // }

  //  { CLERK RECOMMENDED WAY}
  if (isProtectedRoutes(req)) {
    await auth.protect();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
