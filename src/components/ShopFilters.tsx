"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const categories = ["All", "Men", "Women", "Accessories"]

export function ShopFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "All"

  const handleFilter = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === "All") {
      params.delete("category")
    } else {
      params.set("category", category)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-12">
      {categories.map((category) => (
        <Button
          key={category}
          variant={currentCategory === category ? "neo" : "outline"}
          className={cn(
            currentCategory === category && "bg-primary text-primary-foreground hover:bg-primary/90 active:translate-x-0 active:translate-y-0 active:shadow-none"
          )}
          onClick={() => handleFilter(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}