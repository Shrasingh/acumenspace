import { onAuthenticatedUser, onSignUpUser } from "@/actions/auth"
import { onGetAffiliateInfo } from "@/actions/groups"
import CreateGroup from "@/components/forms/create-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { currentUser } from "@clerk/nextjs/server"
import { User } from "lucide-react"
import { redirect } from "next/navigation"

interface GroupCreatePageProps {
  searchParams: {
    affiliate?: string
  }
}

const GroupCreatePage = async ({ searchParams }: GroupCreatePageProps) => {
  // First try to get authenticated user from your system
  let user = await onAuthenticatedUser()

  // If not found, try to get from Clerk and sign up
  if (!user?.id) {
    const clerkUser = await currentUser()
    if (!clerkUser) redirect("/sign-in")

    const signUpResult = await onSignUpUser({
      firstname: clerkUser.firstName ?? "",
      lastname: clerkUser.lastName ?? "",
      image: clerkUser.imageUrl,
      clerkId: clerkUser.id,
    })

    if (signUpResult.status === 200) {
      redirect(
        `/group/create${searchParams.affiliate ? `?affiliate=${searchParams.affiliate}` : ""}`,
      )
    } else {
      redirect("/sign-in")
    }
  }

  // Get affiliate info if affiliate param exists
  const affiliate = searchParams.affiliate
    ? await onGetAffiliateInfo(searchParams.affiliate)
    : { status: 400 }

  return (
    <>
      <div className="px-7 flex flex-col">
        <h5 className="font-bold text-base text-themeTextWhite">
          Payment Method
        </h5>
        <p className="text-themeTextGray leading-tight">
          Free for 14 days, then $99/month. Cancel anytime. All features.
          Unlimited everything. No hidden fees.
        </p>
        {affiliate.status === 200 && affiliate.user?.Group?.User && (
          <div className="w-full mt-5 flex justify-center items-center gap-x-2 italic text-themeTextGray text-sm">
            You were referred by
            <Avatar>
              <AvatarImage
                src={affiliate.user.Group.User.image ?? undefined}
                alt="User"
              />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            {affiliate.user.Group.User.firstname}{" "}
            {affiliate.user.Group.User.lastname}
          </div>
        )}
      </div>
      <CreateGroup
        userId={user.id}
        affiliate={affiliate.status === 200}
        stripeId={affiliate.user?.Group?.User.stripeId || ""}
      />
    </>
  )
}

export default GroupCreatePage
