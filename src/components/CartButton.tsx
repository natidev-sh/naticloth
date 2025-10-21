"use client"

import { useEffect, useState } from "react"
import { useCartStore } from "@/store/cart-store"
import { CartDrawer } from "./CartDrawer"
import { Button } from "./ui/button"
import { ShoppingBag } from "lucide-react"

export function CartButton() {
  const items = useCartStore((state) => state.items)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  if (!isMounted) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingBag className="h-5 w-5" />
        <span className="sr-only">Cart</span>
      </Button>
    )
  }

  return (
    <CartDrawer>
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingBag className="h-5 w-5" />
        <span className="sr-only">Cart</span>
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {totalItems}
          </span>
        )}
      </Button>
    </CartDrawer>
  )
}