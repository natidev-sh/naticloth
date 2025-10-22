"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { File } from "lucide-react"
import Image from "next/image" // Import Image component

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Product } from "@/types"
import { Button } from "@/components/ui/button" // Import Button for pills

// Update SearchableProduct type to include image_urls and category
type SearchableProduct = Pick<Product, 'id' | 'name' | 'image_urls' | 'category'>

export function SearchModal({ children, products }: { children: React.ReactNode, products: SearchableProduct[] }) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  const smartCategories = ["Men", "Women", "Accessories"]; // Define smart categories

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {children}
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for products or categories..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Smart Categories">
            <div className="flex flex-wrap gap-2 p-2">
              {smartCategories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className="nati-pill" // Apply the custom pill style
                  onClick={() => {
                    runCommand(() => router.push(`/shop?category=${category}`))
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CommandGroup>

          <CommandGroup heading="Products">
            {products.map((product) => (
              <CommandItem
                key={product.id}
                // Include both name and category in the value for search matching
                value={`${product.name} ${product.category}`} 
                onSelect={() => {
                  runCommand(() => router.push(`/product/${product.id}`))
                }}
              >
                {product.image_urls && product.image_urls[0] ? (
                  <div className="relative h-6 w-6 mr-2 overflow-hidden rounded-sm">
                    <Image 
                      src={product.image_urls[0]} 
                      alt={product.name} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                ) : (
                  <File className="mr-2 h-4 w-4 text-muted-foreground" />
                )}
                <div className="flex flex-col">
                  <span>{product.name}</span>
                  {product.category && (
                    <span className="text-xs text-muted-foreground">{product.category}</span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}