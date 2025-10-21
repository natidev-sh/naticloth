import Link from "next/link"
import Image from "next/image"
import { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCartStore } from "@/store/cart-store"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  return (
    <Card className="overflow-hidden">
      <Link href={`/product/${product.id}`}>
        <CardHeader className="p-0">
          <div className="aspect-square relative">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <CardTitle className="text-lg font-medium hover:text-muted-foreground transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        <p className="text-2xl font-bold mt-2">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={() => addItem(product)}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}