"use client"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"
import { toast } from "sonner"
import { Product } from "@/types"

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem(product)
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <Button variant="neo" size="lg" className="w-full md:w-auto" onClick={handleAddToCart}>
      Add to Cart
    </Button>
  )
}