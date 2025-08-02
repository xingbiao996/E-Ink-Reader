"use client"

import { useRef } from 'react'
import { addSourceAction } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'

export function AddSourceForm() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addSourceAction(formData)
        formRef.current?.reset()
      }}
      className="space-y-4 rounded-lg border bg-card p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold font-headline">Add New Source</h2>
      <div className="flex flex-col sm:flex-row sm:items-end sm:gap-2 space-y-2 sm:space-y-0">
        <div className="flex-grow">
          <Label htmlFor="url" className="sr-only">
            Source URL
          </Label>
          <Input
            id="url"
            name="url"
            type="url"
            placeholder="https://example.com/feed"
            required
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Source
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Enter the URL of a website or RSS feed you want to read. The source will not actually be added in this demo.
      </p>
    </form>
  )
}
