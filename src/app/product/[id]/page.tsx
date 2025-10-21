import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/ProductCard"
import { AddToCartButton } from "@/components/AddToCartButton"
import { ProductGallery } from "@/components/ProductGallery"

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const supabase = createClient()
  
  const { data: product } = await supabase
    .from('natishop_products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) {
    notFound()
  }

  const { data: relatedProducts } = await supabase
    .from('natishop_products')
    .select('*')
    .eq('category', product.category)
    .neq('id', product.id)
    .limit(4)

  return (
    <div className="container py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ProductGallery images={product.image_urls} productName={product.name} />
        <div className="flex flex-col justify-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">{product.category}</span>
          <h1 className="mt-2 text-4xl font-black tracking-tighter md:text-6xl">{product.name}</h1>
          <p className="mt-4 text-3xl font-black">${product.price.toFixed(2)}</p>
          <p className="mt-6 text-lg text-muted-foreground">{product.description}</p>
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
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