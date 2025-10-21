"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ShoppingBag } from "lucide-react"

interface ProductGalleryProps {
  images: string[] | null
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images?.[0] || null)

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square rounded-sm border-2 border-foreground bg-background p-2 neo-shadow">
        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-sm bg-muted">
          <ShoppingBag className="h-24 w-24 text-muted-foreground/20" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-sm border-2 border-foreground bg-muted">
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={`Main image for ${productName}`}
            fill
            className="object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground/20" />
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-sm border-2 transition-all",
                selectedImage === image
                  ? "border-primary neo-shadow-accent"
                  : "border-foreground/20 hover:border-primary"
              )}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1} for ${productName}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}