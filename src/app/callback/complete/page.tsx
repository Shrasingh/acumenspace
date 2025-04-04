import { onSignUpUser } from "@/actions/auth"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const CompleteOAuthAfterCallback = async () => {
  console.log("complete oauth after callback")
  const user = await currentUser()
  if (!user) redirect("/sign-in")

  const complete = await onSignUpUser({
    firstname: user.firstName as string,
    lastname: user.lastName as string,
    image: user.imageUrl,
    clerkId: user.id,
  })

  if (complete.status == 200) {
    redirect(`/group/create`)
  }

  if (complete.status !== 200) {
    console.log("complete status in signin", complete.status)
    redirect("/sign-in")
  }
}

export default CompleteOAuthAfterCallback
