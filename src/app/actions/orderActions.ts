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

// Helper function to validate UUID format
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
    // 1. Validate UUID format for all product IDs in the cart
    const invalidUuidProducts = cartItems.filter(item => !isValidUuid(item.id));
    if (invalidUuidProducts.length > 0) {
      const invalidNames = invalidUuidProducts.map(p => p.name).join(', ');
      const invalidIds = invalidUuidProducts.map(p => p.id).join(', ');
      console.error("Invalid product IDs found in cart:", invalidIds);
      return { success: false, error: `Invalid product IDs found in cart: ${invalidNames}. Please ensure all product IDs are valid. (IDs: ${invalidIds})` };
    }

    const productIdsInCart = cartItems.map(item => item.id);
    console.log("Product IDs in cart:", productIdsInCart); // Debugging log

    // 2. Validate that all products in the cart still exist in the database
    const { data: existingProductsData, error: validationError } = await supabase
      .from('natishop_products')
      .select('id, name')
      .in('id', productIdsInCart);

    if (validationError) throw validationError;

    const existingProductIds = new Set(existingProductsData.map(p => p.id));
    console.log("Existing product IDs from DB:", Array.from(existingProductIds)); // Debugging log

    const validCartItems = cartItems.filter(item => existingProductIds.has(item.id));

    if (validCartItems.length === 0) {
      return { success: false, error: "No valid items found in your cart to place an order." };
    }

    if (validCartItems.length !== cartItems.length) {
      const missingProductNames = cartItems
        .filter(item => !existingProductIds.has(item.id))
        .map(item => item.name);
      const missingProductIds = cartItems
        .filter(item => !existingProductIds.has(item.id))
        .map(item => item.id);
      
      console.error("Missing product IDs:", missingProductIds); // Debugging log
      return { success: false, error: `The following products are no longer available: ${missingProductNames.join(', ')}. Please remove them from your cart. (IDs: ${missingProductIds.join(', ')})` };
    }

    // If all validations pass, proceed with order creation
    const totalAmount = validCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + 5.00 // +5 for shipping

    // 3. Create the order
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

    // 4. Create the order items using only validCartItems
    const orderItemsToInsert = validCartItems.map(item => ({
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