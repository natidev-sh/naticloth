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
import { Plus, Edit, X } from "lucide-react"
import { upsertCategory } from "@/app/actions/categoryActions"
import { toast } from "sonner"
import { Category } from "@/types"
import { ImageUploadModal } from "./ImageUploadModal"
import Image from "next/image"

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  image_url: z.string().url().optional().nullable(),
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
      image_url: categoryToEdit?.image_url ?? null,
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

  const handleImageUpload = (url: string) => {
    form.setValue("image_url", url)
  }

  const imageUrl = form.watch("image_url")

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
            <FormItem>
              <FormLabel>Image</FormLabel>
              {imageUrl ? (
                <div className="relative h-20 w-20">
                  <Image src={imageUrl} alt="Category image" fill className="rounded-sm border-2 border-foreground object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                    onClick={() => form.setValue("image_url", null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : null}
              <FormControl>
                <ImageUploadModal onUploadSuccess={handleImageUpload}>
                  <Button type="button" variant="outline" className="mt-2">Add Image</Button>
                </ImageUploadModal>
              </FormControl>
              <FormMessage />
            </FormItem>
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