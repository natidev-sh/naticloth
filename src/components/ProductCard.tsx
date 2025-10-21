import Link from "next/link"
import Image from "next/image"
import { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-sm border-2 border-foreground bg-background">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-xl font-bold tracking-tight">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-lg font-semibold text-muted-foreground">{product.category}</p>
        <p className="mt-4 text-2xl font-black">${product.price.toFixed(2)}</p>
      </div>
      <div className="p-4 pt-0">
        <Button variant="neo" className="w-full" onClick={() => addItem(product)}>
          Add to Cart
        </Button>
      </div>
    </div>
  )
}