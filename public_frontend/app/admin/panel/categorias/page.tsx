"use client"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DataTable } from "@/components/data-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { getCategories } from "@/actions/get/get_categories"
import { deleteCategory } from "@/actions/delete/delete_category"
import { addCategory } from "@/actions/post/add_category"

type Category = {
  id: number
  title: string
  description: string
  slug: string
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false);

  const reloadPages = () => {
    startTransition(async () => {
      const data = await getCategories()
      setCategories(data.results)
    })
  }

  useEffect(() => {
    reloadPages()
  }, [])


  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "" })
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }
  
  const handleCreate = () => {
    if (!newCategory.name) return;

    startTransition(async () => {
      const created = await addCategory({
        title: newCategory.name,
        slug: newCategory.slug,
        description: newCategory.description,
      });

      // UX optimista
      setCategories((prev) => [...prev, created]);
      setNewCategory({ name: "", slug: "", description: "" });
      setIsOpen(false);
    });
  };

  const handleDelete = (category: Category) => {
    startTransition(async () => {
      await deleteCategory(category.slug);

      // UX optimista
      setCategories((prev) => prev.filter((c) => c.slug !== category.slug));
    });
  };

  const columns = [
    { key: "title" as const, header: "Título" },
    { key: "description" as const, header: "Descripción" },
    { key: "slug" as const, header: "Alias" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categorías</h1>
          <p className="text-muted-foreground mt-1">Organiza el contenido por categorías</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Crear Categoría</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-foreground">Nombre</Label>
                <Input
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    })
                  }
                  placeholder="Nombre de la categoría"
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Slug</Label>
                <Input
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  placeholder="slug-de-categoria"
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Descripción</Label>
                <Textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Descripción de la categoría"
                  className="bg-input border-border min-h-[80px]"
                />
              </div>
              <Button onClick={handleCreate} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Crear Categoría
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

      <DataTable
        data={categories}
        columns={columns}
        onDelete={handleDelete}
        rowKey="slug"
      />

    </div>
  )
}
