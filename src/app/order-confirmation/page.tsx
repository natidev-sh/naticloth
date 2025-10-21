"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  return (
    <div className="container flex min-h-[calc(100vh-160px)] flex-col items-center justify-center text-center">
      <CheckCircle className="h-24 w-24 text-green-500" />
      <h1 className="mt-8 text-4xl font-black tracking-tighter md:text-6xl">Thank You!</h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        Your order has been placed successfully.
      </p>
      {orderId && (
        <p className="mt-2 text-sm text-muted-foreground">
          Order ID: <span className="font-mono">{orderId.split('-')[0]}...</span>
        </p>
      )}
      <div className="mt-8 flex gap-4">
        <Button asChild variant="neo" size="lg">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/orders">View My Orders</Link>
        </Button>
      </div>
    </div>
  )
}