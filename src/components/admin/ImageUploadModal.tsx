"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Loader2, Upload } from "lucide-react"

interface ImageUploadModalProps {
  onUploadSuccess: (url: string) => void
  children: React.ReactNode
}

export function ImageUploadModal({ onUploadSuccess, children }: ImageUploadModalProps) {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.")
      return
    }

    setUploading(true)
    const fileName = `${Date.now()}_${file.name}`
    const { data, error } = await supabase.storage
      .from("product_images")
      .upload(fileName, file)

    if (error) {
      toast.error(`Upload failed: ${error.message}`)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from("product_images")
      .getPublicUrl(data.path)

    onUploadSuccess(publicUrl)
    toast.success("Image uploaded successfully!")
    setUploading(false)
    setFile(null)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Product Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          {file && <p>Selected: {file.name}</p>}
          <Button onClick={handleUpload} disabled={uploading || !file} className="w-full">
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}