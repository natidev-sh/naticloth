"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Plus, Edit } from "lucide-react"
import { upsertCategory } from "@/app/actions/categoryActions"
import { toast } from "sonner"
import { Category } from "@/types"

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface CategoryFormProps {
  categoryToEdit?: Category
}

export function CategoryForm({ categoryToEdit }: CategoryFormProps) {
  const [open, setOpen] = useState(false)
  const isEditMode = !!categoryToEdit

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: categoryToEdit?.name ?? "",
    },
  })

  const onSubmit = async (values: CategoryFormValues) => {
    const result = await upsertCategory(values, categoryToEdit?.id)
    if (result.success) {
      toast.success(`Category ${isEditMode ? 'updated' : 'created'} successfully`)
      setOpen(false)
      form.reset()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="neo" className="bg-primary text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Category" : "Add New Category"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" variant="neo" className="bg-primary text-primary-foreground">
                {isEditMode ? "Save Changes" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}