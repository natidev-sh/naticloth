"use client"

import { useParams } from "next/navigation"
import { products } from "@/lib/products"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"
import { notFound } from "next/navigation"
import { toast } from "sonner"
import { ProductCard } from "@/components/ProductCard"

export default function ProductDetailPage() {
  const { id } = useParams()
  const addItem = useCartStore((state) => state.addItem)
  
  const product = products.find((p) => p.id === Number(id))

  if (!product) {
    notFound()
  }

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    addItem(product)
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-square rounded-sm border-2 border-foreground bg-background p-2">
           <div className="h-full w-full overflow-hidden rounded-sm">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
           </div>
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">{product.category}</span>
          <h1 className="mt-2 text-4xl font-black tracking-tighter md:text-6xl">{product.name}</h1>
          <p className="mt-4 text-3xl font-black">${product.price.toFixed(2)}</p>
          <p className="mt-6 text-lg text-muted-foreground">{product.description}</p>
          <div className="mt-8">
            <Button variant="neo" size="lg" className="w-full md:w-auto" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-24">
          <h2 className="text-3xl font-black tracking-tighter md:text-4xl mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}