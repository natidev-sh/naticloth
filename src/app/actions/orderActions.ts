"use server"

import { createClient } from "@/lib/supabase/server"
import { Product } from "@/types"
import { revalidatePath } from "next/cache"

type CartItem = Product & { quantity: number }

interface ShippingDetails {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
}

export async function createOrder(cartItems: CartItem[], shippingDetails: ShippingDetails) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "You must be logged in to place an order." }
  }

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + 5.00 // +5 for shipping

  try {
    // 1. Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount: totalAmount,
        shipping_address: {
          name: shippingDetails.name,
          address: shippingDetails.address,
          city: shippingDetails.city,
          zip: shippingDetails.zip,
        },
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 2. Create the order items
    const orderItemsToInsert = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_order: item.price,
      product_details: {
        name: item.name,
        image_url: item.image_urls?.[0] ?? null,
      }
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItemsToInsert)

    if (itemsError) throw itemsError

    revalidatePath("/orders")
    return { success: true, orderId: order.id }

  } catch (error: any) {
    console.error("Error creating order:", error)
    return { success: false, error: error.message }
  }
}

export async function getOrdersForUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { orders: [], error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      created_at,
      total_amount,
      status,
      shipping_address,
      order_items (
        id,
        quantity,
        price_at_order,
        product_details
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return { orders: [], error: error.message }
  }

  return { orders: data, error: null }
}