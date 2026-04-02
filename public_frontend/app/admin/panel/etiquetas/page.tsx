"use client"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataTable } from "@/components/data-table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { getTags } from "@/actions/get/get_tags"
import { deleteTag } from "@/actions/delete/delete_tag"
import { addTag } from "@/actions/post/add_tag"

type Tag = {
  id: number
  name: string
}

export default function EtiquetasPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const [newTag, setNewTag] = useState("")

  const reloadTags = () => {
    startTransition(async () => {
      const data = await getTags()
      setTags(data.results)
    })
  }

  useEffect(() => {
    reloadTags()
  }, [])

  const handleCreate = async () => {
    if (!newTag.trim()) return

    try {
      const createdTag: Tag = await addTag({
        name: newTag,
      })

      setTags((prev) => [...prev, createdTag])
      setNewTag("")
      setIsOpen(false)
    } catch (error) {
      console.error("Error creating tag:", error)
    }
  }

  const handleDelete = async (tag: Tag) => {
    try {
      // 👇 convertimos a string porque deleteTag espera string
      await deleteTag(String(tag.id))

      setTags((prev) => prev.filter((t) => t.id !== tag.id))
    } catch (error) {
      console.error("Error deleting tag:", error)
    }
  }

  const columns = [
    { key: "name" as const, header: "Nombre" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Etiquetas</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona las etiquetas del contenido
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Etiqueta
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Crear Etiqueta
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-foreground">Nombre</Label>
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nombre de la etiqueta"
                  className="bg-input border-border"
                />
              </div>

              <Button
                onClick={handleCreate}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Crear Etiqueta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isPending && (
        <p className="text-sm text-muted-foreground">
          Actualizando…
        </p>
      )}

      <DataTable data={tags} columns={columns} onDelete={handleDelete} />
    </div>
  )
}