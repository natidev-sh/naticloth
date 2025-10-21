"use client"

import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { createOrder } from "@/app/actions/orderActions"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { CreditCard } from "@/components/CreditCard"

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  address: z.string().min(5, "Address is too short."),
  city: z.string().min(2, "City is required."),
  zip: z.string().min(5, "A 5-digit ZIP code is required.").max(5),
  card_number: z.string().length(16, "Card number must be 16 digits."),
  card_expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be in MM/YY format."),
  card_cvc: z.string().length(3, "CVC must be 3 digits."),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore()
  const router = useRouter()
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shippingCost = 5.00
  const total = subtotal + shippingCost

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      city: "",
      zip: "",
      card_number: "",
      card_expiry: "",
      card_cvc: "",
    },
  })

  const watchedValues = form.watch()

  useEffect(() => {
    const supabase = createClient()
    const prefillUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        form.setValue('email', user.email || '')
        const { data: profile } = await supabase.from('profiles').select('first_name, last_name').eq('id', user.id).single()
        if (profile) {
          const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ')
          form.setValue('name', fullName)
        }
      }
    }
    prefillUserData()
  }, [form])

  const onSubmit = async (values: CheckoutFormValues) => {
    const result = await createOrder(items, values)
    if (result.success) {
      toast.success("Order placed successfully!")
      clearCart()
      router.push(`/order-confirmation?orderId=${result.orderId}`)
    } else {
      toast.error(result.error)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[calc(100vh-160px)] flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-black tracking-tighter">Your Cart is Empty</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          You can't check out with nothing to buy!
        </p>
        <Button asChild variant="neo" size="lg" className="mt-8">
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-16 md:py-24">
      <h1 className="mb-12 text-center text-4xl font-black tracking-tighter md:text-6xl">Checkout</h1>
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div className="rounded-sm border-2 border-foreground p-8 neo-shadow order-last lg:order-first">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <h2 className="text-2xl font-bold">Shipping Information</h2>
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem><FormLabel>Street Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="zip" render={({ field }) => (
                  <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              
              <h2 className="pt-6 text-2xl font-bold border-t-2 border-dashed">Payment Details (Demo)</h2>
              <FormField control={form.control} name="card_number" render={({ field }) => (
                <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="1111222233334444" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="card_expiry" render={({ field }) => (
                  <FormItem><FormLabel>Expiry (MM/YY)</FormLabel><FormControl><Input placeholder="12/25" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="card_cvc" render={({ field }) => (
                  <FormItem><FormLabel>CVC</FormLabel><FormControl><Input placeholder="123" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <Button type="submit" variant="neo" size="lg" className="w-full bg-primary text-primary-foreground" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Place Order
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-8">
          <div className="rounded-sm border-2 border-foreground p-8 neo-shadow">
            <h2 className="mb-6 text-2xl font-bold">Order Summary</h2>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm border-2 border-foreground bg-muted">
                      {item.image_urls && item.image_urls[0] && (
                        <Image src={item.image_urls[0]} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 border-t-2 border-dashed border-foreground pt-6 space-y-2">
              <div className="flex justify-between"><p>Subtotal</p><p className="font-semibold">${subtotal.toFixed(2)}</p></div>
              <div className="flex justify-between"><p>Shipping</p><p className="font-semibold">${shippingCost.toFixed(2)}</p></div>
              <div className="flex justify-between text-xl font-black"><p>Total</p><p>${total.toFixed(2)}</p></div>
            </div>
          </div>
          <CreditCard
            cardHolder={watchedValues.name || ''}
            cardNumber={watchedValues.card_number || ''}
            cardExpiry={watchedValues.card_expiry || ''}
          />
        </div>
      </div>
    </div>
  )
}