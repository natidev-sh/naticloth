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

export function CategoryTable({ categories }: { categories: Category[] }) {
  return (
    <div className="rounded-sm border-2 border-foreground neo-shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
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