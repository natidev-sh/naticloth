"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { UserForAdmin } from "@/types"

// Helper to create admin client, ensuring secret is only accessed here
function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Supabase URL or service role key is not set.')
  }
  return createAdminClient(supabaseUrl, serviceKey)
}

export async function getUsersForAdmin(): Promise<{ users: UserForAdmin[], error: string | null }> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { users: [], error: "Not authenticated" }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { users: [], error: "Not authorized" }

    const supabaseAdmin = getSupabaseAdminClient()
    const { data: authUsers, error: authUsersError } = await supabaseAdmin.auth.admin.listUsers()
    if (authUsersError) throw authUsersError

    const { data: profiles } = await supabase.from('profiles').select('id, role')

    const usersForAdmin: UserForAdmin[] = authUsers.users.map(authUser => {
      const userProfile = profiles?.find(p => p.id === authUser.id)
      return {
        id: authUser.id,
        email: authUser.email,
        role: userProfile?.role ?? 'user',
      }
    })

    return { users: usersForAdmin, error: null }
  } catch (error: any) {
    console.error("Error fetching users:", error.message)
    return { users: [], error: error.message }
  }
}

export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: "Not authenticated" }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { success: false, error: "Not authorized" }

    if (user.id === userId) return { success: false, error: "Cannot change your own role." }

    const supabaseAdmin = getSupabaseAdminClient()
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ role })
      .eq('id', userId)

    if (error) throw error

    revalidatePath("/admin")
    return { success: true }
  } catch (error: any) {
    console.error("Supabase admin error:", error.message)
    return { success: false, error: error.message }
  }
}