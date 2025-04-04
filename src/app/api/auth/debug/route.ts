// app/api/auth/debug/route.ts
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
  const user = await currentUser()
  return NextResponse.json({
    clerkUser: user,
    env: {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? "set" : "not set",
    },
  })
}
