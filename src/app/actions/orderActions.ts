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

// Helper function to validate UUID format (client-side check for basic input validation)
function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export async function createOrder(cartItems: CartItem[], shippingDetails: ShippingDetails) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "You must be logged in to place an order." }
  }

  try {
    // Perform client-side UUID format validation
    const invalidUuidProducts = cartItems.filter(item => !isValidUuid(item.id));
    if (invalidUuidProducts.length > 0) {
      const invalidNames = invalidUuidProducts.map(p => p.name).join(', ');
      const invalidIds = invalidUuidProducts.map(p => p.id).join(', ');
      return { success: false, error: `Invalid product IDs found in cart: ${invalidNames}. Please ensure all product IDs are valid. (IDs: ${invalidIds})` };
    }

    if (cartItems.length === 0) {
      return { success: false, error: "Your cart is empty." };
    }

    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + 5.00 // +5 for shipping

    // Prepare order items for the database function
    const orderItemsForDb = cartItems.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price_at_order: item.price,
      product_details: {
        name: item.name,
        image_url: item.image_urls?.[0] ?? null,
      }
    }));

    // Call the new Supabase function to create the order atomically
    const { data: orderId, error: dbFunctionError } = await supabase.rpc('create_full_order', {
      p_user_id: user.id,
      p_total_amount: totalAmount,
      p_shipping_address: {
        name: shippingDetails.name,
        address: shippingDetails.address,
        city: shippingDetails.city,
        zip: shippingDetails.zip,
      },
      p_order_items: orderItemsForDb,
    });

    if (dbFunctionError) {
      console.error("Supabase function error:", dbFunctionError.message);
      return { success: false, error: dbFunctionError.message };
    }

    revalidatePath("/orders")
    return { success: true, orderId: orderId }

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