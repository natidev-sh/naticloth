"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { success: false, error: "Not authorized" }

  if (user.id === userId) return { success: false, error: "Cannot change your own role." }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  if (error) {
    console.error("Supabase admin error:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}