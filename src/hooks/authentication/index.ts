import { onSignUpUser } from "@/actions/auth"
import { SignUpSchema } from "@/components/forms/sign-up/schema"
import { useSignIn, useSignUp } from "@clerk/nextjs"
import { OAuthStrategy } from "@clerk/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { SignInSchema } from "../../components/forms/sign-in/schema"

export const useAuthSignIn = () => {
  const { isLoaded, setActive, signIn } = useSignIn()
  const router = useRouter()

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    mode: "onBlur",
  })

  const onClerkAuth = async (email: string, password: string) => {
    if (!isLoaded) {
      toast.error("Error", { description: "Oops! something went wrong" })
      return
    }

    try {
      const authenticated = await signIn.create({ identifier: email, password })

      if (authenticated.status === "complete") {
        reset()
        await setActive({ session: authenticated.createdSessionId })
        toast.success("Success", { description: "Welcome back!" })
        router.push(`/group/create`)
        return
      }
    } catch (error: any) {
      console.error("Sign-in error:", error)
      const errorCode = error?.errors?.[0]?.code

      if (error?.status === 422) {
        toast.error("Error", {
          description: "User doesn't exist, try signing up",
        })
        router.push("/sign-up")
      } else if (errorCode === "form_password_incorrect") {
        toast.error("Error", {
          description: "Email/password is incorrect, try again",
        })
      } else {
        toast.error("Error", { description: "An unexpected error occurred" })
      }
    }
  }

  const { mutate: InitiateLoginFlow, isPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      onClerkAuth(email, password),
  })

  const onAuthenticateUser = handleSubmit(async (values) => {
    InitiateLoginFlow({ email: values.email, password: values.password })
  })

  return {
    onAuthenticateUser,
    isPending,
    register,
    errors,
  }
}

export const useAuthSignUp = () => {
  const { setActive, isLoaded, signUp } = useSignUp()
  const [creating, setCreating] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState("")

  const router = useRouter()

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    getValues,
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    mode: "onBlur",
  })

  const onGenerateCode = async () => {
    if (!isLoaded)
      return toast.error("Error", { description: "Oops! something went wrong" })

    try {
      const email = getValues("email")
      const password = getValues("password")

      if (!email || !password) {
        return toast.error("Error", { description: "No fields must be empty" })
      }

      await signUp.create({ emailAddress: email, password })
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

      setVerifying(true)
    } catch (error) {
      console.error("Generate Code Error:", error)
      toast.error("Error", {
        description: "Could not generate verification code",
      })
    }
  }

  const onInitiateUserRegistration = handleSubmit(async (values) => {
    if (!isLoaded)
      return toast.error("Error", { description: "Oops! something went wrong" })

    try {
      setCreating(true)

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status !== "complete") {
        toast.error("Error", {
          description: "Oops! Something went wrong, status incomplete",
        })
        return
      }

      const user = await onSignUpUser({
        firstname: values.firstname,
        lastname: values.lastname,
        clerkId: signUp.createdUserId!,
        image: "",
      })

      reset()

      if (user.status === 200) {
        toast.success("Success", { description: user.message })
        await setActive({ session: completeSignUp.createdSessionId })
        router.push(`/group/create`)
      } else {
        toast.error("Error", { description: user.message + " action failed" })
      }
    } catch (error) {
      console.error("Sign-up error:", error)
      toast.error("Error", { description: "An unexpected error occurred" })
    } finally {
      setCreating(false)
      setVerifying(false)
    }
  })

  return {
    register,
    errors,
    onGenerateCode,
    onInitiateUserRegistration,
    verifying,
    creating,
    code,
    setCode,
    getValues,
  }
}

export const useGoogleAuth = () => {
  console.log("google auth")
  const { signIn, isLoaded: LoadedSignIn } = useSignIn()
  const { signUp, isLoaded: LoadedSignUp } = useSignUp()

  const handleOAuthRedirect = async (
    strategy: OAuthStrategy,
    authFunction: any,
    redirectUrl: string,
  ) => {
    if (!authFunction) return

    try {
      await authFunction.authenticateWithRedirect({
        strategy,
        redirectUrl: "/callback",
        redirectUrlComplete: redirectUrl,
      })
    } catch (error) {
      console.error("OAuth Error:", error)
      toast.error("Error", {
        description: `Google ${redirectUrl.includes("sign-in") ? "Sign-in" : "Sign-up"} failed`,
      })
    }
  }

  return {
    signUpWith: (strategy: OAuthStrategy) =>
      LoadedSignUp &&
      handleOAuthRedirect(strategy, signUp, "/callback/complete"),
    signInWith: (strategy: OAuthStrategy) =>
      LoadedSignIn &&
      handleOAuthRedirect(strategy, signIn, "/callback/sign-in"),
  }
}
