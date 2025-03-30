import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/group(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const baseHost = "localhost:3000";
  const host = req.headers.get("host") || ""; // ✅ Ensure `host` is not null
  const reqPath = req.nextUrl.pathname;
  const origin = req.nextUrl.origin;

  // ✅ If the route is protected, authenticate and stop further execution
  if (isProtectedRoute(req)) {
    await auth().protect();
    return; // ✅ Added return to prevent further execution
  }

  // ✅ Check if the request host is different from `baseHost` and if the request path starts with "/group"
  if (host !== baseHost && reqPath.startsWith("/group")) {
    try {
      const response = await fetch(`${origin}/api/domain?host=${host}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return NextResponse.next(); // ✅ Allow normal flow if API call fails
      }

      const data = await response.json();

      if (data?.status === 200 && data?.domain) {
        return NextResponse.rewrite(new URL(reqPath, `https://${data.domain}`)); // ✅ Fixed duplicate `reqPath`
      }
    } catch (error) {
      console.error("Middleware Fetch Error:", error);
    }
  }

  return NextResponse.next(); // ✅ Ensure a response is always returned
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
