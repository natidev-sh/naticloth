"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/products"
import { ProductCard } from "@/components/ProductCard"

export default function Home() {
  const featuredProducts = products.filter(p => p.featured)

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop')"}}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            New Season Arrivals
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-lg md:text-xl">
            Check out all the new trends for the upcoming season.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/shop">Shop Now</Link>
          </Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}