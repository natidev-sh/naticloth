import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function OrderConfirmationPage() {
  return (
    <div className="container flex min-h-[calc(100vh-160px)] flex-col items-center justify-center text-center">
      <CheckCircle className="h-24 w-24 text-green-500" />
      <h1 className="mt-8 text-4xl font-black tracking-tighter md:text-6xl">Thank You!</h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        Your order has been placed successfully. This is a demo, so no products will be shipped.
      </p>
      <Button asChild variant="neo" size="lg" className="mt-8">
        <Link href="/shop">Continue Shopping</Link>
      </Button>
    </div>
  )
}