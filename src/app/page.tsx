import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ProductCard"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = createClient()
  const { data: featuredProducts } = await supabase
    .from('natishop_products')
    .select('*')
    .eq('featured', true)
    .limit(4)

  return (
    <>
      {/* Hero Section */}
      <section className="border-b-2 border-foreground bg-accent">
        <div className="container grid grid-cols-1 items-center gap-8 py-20 md:grid-cols-2 md:py-32">
          <div className="flex flex-col items-start gap-6">
            <h1 className="text-5xl font-black tracking-tighter md:text-7xl">
              Style Redefined.
            </h1>
            <p className="max-w-md text-lg text-accent-foreground/80">
              Forget trends. We deal in statements. Explore our new collection of high-fashion pieces designed for the bold.
            </p>
            <Button asChild variant="neo" size="lg" className="bg-primary text-primary-foreground hover:bg-primary/80">
              <Link href="/shop">
                Explore Collection <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="relative hidden h-80 w-full md:block">
             <div className="absolute inset-0 rounded-sm border-2 border-foreground bg-background p-2 transition-all neo-shadow">
                <div className="h-full w-full overflow-hidden rounded-sm">
                    <Image 
                        src="https://images.unsplash.com/photo-1681557146557-f77b8683ef4d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1471"
                        alt="High fashion model"
                        fill
                        className="object-cover"
                    />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-center text-4xl font-black tracking-tighter md:text-5xl">
            Featured Pieces
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts?.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}