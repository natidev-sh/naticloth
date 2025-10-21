import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ProductCard"
import { ArrowRight, Truck, ShieldCheck, Undo2 } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Input } from "@/components/ui/input"

export default async function Home() {
  const supabase = createClient()
  const { data: featuredProducts } = await supabase
    .from('natishop_products')
    .select('*')
    .eq('featured', true)
    .limit(4)

  const { data: categories } = await supabase
    .from('natishop_categories')
    .select('name, image_url')
    .limit(3)

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

      {/* Category Showcase Section */}
      <section className="py-16 md:py-24 bg-secondary border-y-2 border-foreground">
        <div className="container">
          <h2 className="mb-12 text-center text-4xl font-black tracking-tighter md:text-5xl">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {categories?.map(category => (
              <Link key={category.name} href={`/shop?category=${category.name}`} className="group relative block h-80 overflow-hidden rounded-sm border-2 border-foreground neo-shadow transition-all hover:-translate-y-1">
                <Image 
                  src={category.image_url || "https://images.unsplash.com/photo-1588403153501-6a5de4234233?q=80&w=1887&auto=format&fit=crop"} 
                  alt={`${category.name} category`} 
                  fill 
                  className="object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-3xl font-black tracking-tighter text-white">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Shop With Us Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-sm border-2 border-foreground bg-accent">
                <Truck className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold">Free Shipping</h3>
              <p className="mt-2 text-muted-foreground">On all orders over $50. We ship fast, you shop fast.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-sm border-2 border-foreground bg-accent">
                <ShieldCheck className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold">Quality Materials</h3>
              <p className="mt-2 text-muted-foreground">Crafted with premium fabrics for style that lasts.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-sm border-2 border-foreground bg-accent">
                <Undo2 className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold">Easy Returns</h3>
              <p className="mt-2 text-muted-foreground">Not a perfect fit? No problem. We offer hassle-free returns.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="border-t-2 border-foreground bg-accent py-16 md:py-24">
        <div className="container text-center">
          <h2 className="text-4xl font-black tracking-tighter md:text-5xl">Join The Club</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-accent-foreground/80">
            Get exclusive deals and be the first to know about our latest drops.
          </p>
          <form className="mx-auto mt-8 flex max-w-md gap-2">
            <Input type="email" placeholder="Enter your email" className="flex-1 rounded-sm border-2 border-foreground bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-offset-0" />
            <Button type="submit" variant="neo" className="bg-primary text-primary-foreground">Subscribe</Button>
          </form>
        </div>
      </section>
    </>
  );
}