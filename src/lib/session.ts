// lib/session.ts
import { auth } from "@clerk/nextjs/server"
import { client } from "./prisma"
import { currentUser } from "@clerk/nextjs/server"

export const syncSession = async () => {
  const { userId } = auth()
  if (!userId) return null

  let user = await client.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    const clerkUser = await currentUser()
    if (!clerkUser) return null

    user = await client.user.create({
      data: {
        clerkId: clerkUser.id,
        firstname: clerkUser.firstName ?? "",
        lastname: clerkUser.lastName ?? "",
        image: clerkUser.imageUrl,
      },
    })
  }

  return user
}
