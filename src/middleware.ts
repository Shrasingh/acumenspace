import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/group(.*)", "/dashboard(.*)"])

export default clerkMiddleware(async (auth, req) => {
  // Get the request URL and host
  const url = req.nextUrl
  const host =
    req.headers.get("host") ||
    process.env.NEXT_PUBLIC_BASE_HOST ||
    "localhost:3000"
  const isProduction = process.env.NODE_ENV === "production"

  // 1. Handle protected routes
  if (isProtectedRoute(req)) {
    const { userId, sessionClaims, redirectToSignIn } = auth()

    // For API routes, return 401 if unauthorized
    if (url.pathname.startsWith("/api") && !userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    // For pages, redirect to sign-in if not authenticated
    if (!userId) {
      return redirectToSignIn({ returnBackUrl: url.href })
    }

    return NextResponse.next()
  }

  // 2. Handle custom domain routing (only in production)
  if (
    isProduction &&
    host !== process.env.NEXT_PUBLIC_BASE_HOST &&
    url.pathname.startsWith("/group")
  ) {
    try {
      const domainResponse = await fetch(
        `${url.origin}/api/domain?host=${encodeURIComponent(host)}`,
        { headers: { "Content-Type": "application/json" } },
      )

      if (domainResponse.ok) {
        const data = await domainResponse.json()
        if (data?.status === 200 && data?.domain) {
          return NextResponse.rewrite(
            new URL(url.pathname, `https://${data.domain}`),
          )
        }
      }
    } catch (error) {
      console.error("Domain routing error:", error)
      // Fall through to default behavior
    }
  }

  // 3. Public routes
  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
