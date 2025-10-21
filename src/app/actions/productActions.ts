"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  category: z.enum(["Men", "Women", "Accessories"]),
  image_urls: z.array(z.string().url("Please provide valid URLs")).optional().default([]),
  featured: z.boolean().default(false),
})

export async function upsertProduct(formData: unknown, id?: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { success: false, error: "Not authorized" }

  const parsed = productSchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors.map(e => e.message).join(', ') }
  }

  const dataToUpsert = {
    ...parsed.data,
    ...(id && { id }),
  }

  const { error } = await supabase.from("natishop_products").upsert(dataToUpsert)

  if (error) {
    console.error("Supabase error:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/shop")
  revalidatePath(`/product/${id}`)

  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { success: false, error: "Not authorized" }

  const { error } = await supabase.from("natishop_products").delete().eq("id", id)

  if (error) {
    console.error("Supabase error:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/shop")

  return { success: true }
}