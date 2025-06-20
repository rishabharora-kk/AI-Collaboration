import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { SignInForm } from "@/components/signin-form"

export default async function SignInPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignInForm />
    </div>
  )
}
