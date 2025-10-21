"use client"

import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/ProductCard"
import { products } from "@/lib/products"
import { ShopFilters } from "@/components/ShopFilters"

export default function ShopPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")

  const filteredProducts = category
    ? products.filter(p => p.category === category)
    : products

  return (
    <div className="container py-16 md:py-24">
      <h1 className="text-4xl font-black tracking-tighter md:text-6xl mb-4">Shop</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Explore our curated collection of high-fashion statements.
      </p>
      <ShopFilters />
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold">No products found</h2>
          <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}