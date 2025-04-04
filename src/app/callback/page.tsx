import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"

const CallBackPage = () => {
  return (
    <AuthenticateWithRedirectCallback
      signInFallbackRedirectUrl={"/group/create"}
    />
  )
}

export default CallBackPage
