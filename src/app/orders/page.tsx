import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getOrdersForUser } from "@/app/actions/orderActions"
import { Order } from "@/types"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function OrdersPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { orders, error } = await getOrdersForUser()

  if (error) {
    return <div className="container py-16 text-center text-destructive">Error loading orders: {error}</div>
  }

  return (
    <div className="container py-16 md:py-24">
      <h1 className="text-4xl font-black tracking-tighter md:text-6xl">My Orders</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Check the status and details of your past orders.
      </p>
      <div className="mt-12">
        {orders && orders.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {orders.map((order: Order) => (
              <AccordionItem key={order.id} value={order.id} className="rounded-sm border-2 border-foreground neo-shadow">
                <AccordionTrigger className="p-6 hover:no-underline">
                  <div className="flex flex-wrap items-center justify-between w-full gap-4">
                    <div className="text-left">
                      <p className="font-bold">Order #{order.id.substring(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">Placed on {formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg">{formatCurrency(order.total_amount)}</span>
                      <Badge>{order.status}</Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 border-t-2 border-dashed">
                  <h3 className="font-bold mb-4">Items</h3>
                  <div className="space-y-4 mb-6">
                    {order.order_items.map(item => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm border-2 border-foreground bg-muted">
                            {item.product_details.image_url && (
                              <Image src={item.product_details.image_url} alt={item.product_details.name} fill className="object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold">{item.product_details.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity} @ {formatCurrency(item.price_at_order)}</p>
                          </div>
                        </div>
                        <p className="font-semibold">{formatCurrency(item.price_at_order * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                  <h3 className="font-bold mb-2">Shipping Address</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.shipping_address.name}<br />
                    {order.shipping_address.address}<br />
                    {order.shipping_address.city}, {order.shipping_address.zip}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-16 rounded-sm border-2 border-dashed">
            <h2 className="text-2xl font-bold">No orders yet</h2>
            <p className="text-muted-foreground mt-2">You haven't placed any orders with us.</p>
          </div>
        )}
      </div>
    </div>
  )
}