"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
})

export async function upsertCategory(formData: unknown, id?: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { success: false, error: "Not authorized" }

  const parsed = categorySchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors.map(e => e.message).join(', ') }
  }

  const dataToUpsert = {
    ...parsed.data,
    ...(id && { id }),
  }

  const { error } = await supabase.from("natishop_categories").upsert(dataToUpsert)

  if (error) {
    console.error("Supabase error:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  revalidatePath("/shop")

  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { success: false, error: "Not authorized" }

  // TODO: Check if any product is using this category before deleting.
  const { error } = await supabase.from("natishop_categories").delete().eq("id", id)

  if (error) {
    console.error("Supabase error:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  revalidatePath("/shop")

  return { success: true }
}