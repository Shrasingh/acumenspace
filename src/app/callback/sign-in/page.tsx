import { onSignInUser, onSignUpUser } from "@/actions/auth"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const CompleteSigIn = async () => {
  const user = await currentUser()
  console.log("complete sign in user", user?.firstName)
  if (!user) return redirect("/sign-in")

  const authenticated = await onSignInUser(user.id)

  console.log("authenticated", authenticated)

  // if user doesn't exist, redirect tem to sign-up page
  if (authenticated.status !== 200 && authenticated.status !== 207) {
    const complete = await onSignUpUser({
      firstname: user.firstName as string, // type assertion
      lastname: user.lastName as string, // type assertion
      image: user.imageUrl,
      clerkId: user.id,
    })

    console.log("complete", complete)

    if (complete.status === 200) {
      console.log("complete status in group create", complete.status)
      return redirect(`/group/create`)
    }
  }

  if (authenticated.status === 200) return redirect(`/group/create`)

  if (authenticated.status === 207)
    return redirect(
      `/group/${authenticated.groupId}/channel/${authenticated.channelId}`,
    )

  // unexpected erorr redirect to sign in
  if (authenticated.status !== 200) {
    console.log("authenticated status", authenticated.status)
    return redirect("/sign-in")
  }
}

export default CompleteSigIn
