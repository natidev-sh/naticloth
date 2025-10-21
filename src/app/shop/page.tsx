import { ProductCard } from "@/components/ProductCard"
import { ShopFilters } from "@/components/ShopFilters"
import { createClient } from "@/lib/supabase/server"

export default async function ShopPage({ searchParams }: { searchParams: { category?: string } }) {
  const category = searchParams.category
  const supabase = createClient()

  let productsQuery = supabase.from('natishop_products').select('*')

  if (category && category !== "All") {
    productsQuery = productsQuery.eq('category', category)
  }

  const productsPromise = productsQuery.order('created_at', { ascending: false })
  const categoriesPromise = supabase.from('natishop_categories').select('name').order('name')

  const [{ data: filteredProducts }, { data: categories }] = await Promise.all([productsPromise, categoriesPromise])

  return (
    <div className="container py-16 md:py-24">
      <h1 className="text-4xl font-black tracking-tighter md:text-6xl mb-4">Shop</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Explore our curated collection of high-fashion statements.
      </p>
      <ShopFilters categories={categories ?? []} />
      {filteredProducts && filteredProducts.length > 0 ? (
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