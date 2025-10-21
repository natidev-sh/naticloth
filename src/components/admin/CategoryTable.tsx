"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CategoryForm } from "./CategoryForm"
import { DeleteCategoryButton } from "./DeleteCategoryButton"
import { Category } from "@/types"
import Image from "next/image"

export function CategoryTable({ categories }: { categories: Category[] }) {
  return (
    <div className="rounded-sm border-2 border-foreground neo-shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <div className="relative h-12 w-12 overflow-hidden rounded-sm border-2 border-foreground">
                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <span className="text-xs text-muted-foreground">No Img</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <CategoryForm categoryToEdit={category} />
                  <DeleteCategoryButton categoryId={category.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}