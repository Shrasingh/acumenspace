import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/group(.*)"])

export default clerkMiddleware(async (auth, req) => {
  const baseHost = "localhost:3000"
  const host = req.headers.get("host")?.trim() || baseHost
  const reqPath = req.nextUrl.pathname
  const origin = req.nextUrl.origin

  // ✅ Ensure a proper NextResponse is returned after protecting the route
  if (isProtectedRoute(req)) {
    await auth().protect()
    return NextResponse.next() // ✅ Explicitly return NextResponse
  }

  if (host !== baseHost && reqPath.startsWith("/group")) {
    try {
      const response = await fetch(
        `${origin}/api/domain?host=${encodeURIComponent(host)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        return NextResponse.next()
      }

      const data = await response.json()

      if (data?.status === 200 && data?.domain) {
        return NextResponse.rewrite(new URL(reqPath, `https://${data.domain}`))
      }
    } catch (error) {
      console.error("Middleware Fetch Error:", error)
      return NextResponse.next()
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
