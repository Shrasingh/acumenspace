"use client"

import { useUser } from "@clerk/nextjs"

export default function DebugAuth() {
  const { isSignedIn, user } = useUser()

  return (
    <div>
      <h1>Auth Debug Page</h1>
      {isSignedIn ? (
        <div>
          <p>
            <strong>Logged in as:</strong>{" "}
            {user?.emailAddresses[0]?.emailAddress}
          </p>
          <p>
            <strong>User ID:</strong> {user?.id}
          </p>
          <p>
            <strong>Full Name:</strong> {user?.fullName}
          </p>
          <p>
            <strong>Session Active:</strong> {JSON.stringify(isSignedIn)}
          </p>
        </div>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  )
}
