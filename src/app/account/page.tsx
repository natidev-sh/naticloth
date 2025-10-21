import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AccountForm } from "@/components/AccountForm"
import { getUserProfile } from "@/app/actions/userActions"

export default async function AccountPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { profile, error } = await getUserProfile()

  if (error) {
    console.error("Error fetching profile:", error)
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-black tracking-tighter md:text-6xl">My Account</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage your profile settings.
        </p>
        <div className="mt-12 rounded-sm border-2 border-foreground p-8 neo-shadow">
          <AccountForm profile={profile} />
        </div>
      </div>
    </div>
  )
}