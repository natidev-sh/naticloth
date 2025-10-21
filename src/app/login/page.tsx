"use client"

import { createClient } from "@/lib/supabase/client"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push('/')
        toast.success("Successfully logged in!")
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  return (
    <div className="container flex min-h-[calc(100vh-160px)] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-sm border-2 border-foreground p-8 neo-shadow">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['github', 'google']}
          theme="dark"
        />
      </div>
    </div>
  )
}