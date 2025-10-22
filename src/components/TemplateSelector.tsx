"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TemplateSelector() {
  const templates = [
    { name: "NatiCloth (Current)", url: "https://natiweb.vercel.app/templates/naticloth" },
    { name: "NatiMusic", url: "https://natiweb.vercel.app/templates/natimusic" },
    { name: "NatiBlog", url: "https://natiweb.vercel.app/templates/natiblog" },
    { name: "NatiPortfolio", url: "https://natiweb.vercel.app/templates/natiportfolio" },
  ]

  const handleTemplateChange = (url: string) => {
    if (url) {
      window.location.href = url
    }
  }

  return (
    <div className="w-full bg-secondary border-b-2 border-foreground py-2 text-sm text-secondary-foreground flex justify-center items-center">
      <div className="container flex justify-between items-center">
        <p className="text-muted-foreground select-none hidden md:block">Choose a template:</p>
        <Select onValueChange={handleTemplateChange} defaultValue={templates[0].url}>
          <SelectTrigger className="w-[200px] h-8 text-xs md:text-sm rounded-sm border-2 border-foreground neo-shadow bg-background">
            <SelectValue placeholder="Select Template" />
          </SelectTrigger>
          <SelectContent className="rounded-sm border-2 border-foreground neo-shadow">
            {templates.map((template) => (
              <SelectItem key={template.url} value={template.url}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}