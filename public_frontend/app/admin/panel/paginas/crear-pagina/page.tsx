"use client"

import type React from "react"
import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { TiptapEditor } from "@/components/tiptap-editor"
import { MultiSelect } from "@/components/multi-select"
import { ImageUpload } from "@/components/image-upload"

import { ArrowLeft, Save } from "lucide-react"

import { getCategories } from "@/actions/get/get_categories"
import { getTags } from "@/actions/get/get_tags"

/* ===========================
   Tipos
=========================== */

type Category = {
  id: string
  title: string
  slug: string
}

type Tag = {
  id: string
  name: string
}

type PageStatus = 0 | 1 // 0 = draft | 1 = published

type CreatePageForm = {
  title: string
  slug: string
  description: string
  keywords: string
  content: string
  category: string
  tags: string[]
  state: PageStatus
  cover_image: File | null
}

/* ===========================
   Componente
=========================== */

export default function CrearPaginaPage() {
  const router = useRouter()

  const [formData, setFormData] = useState<CreatePageForm>({
    title: "",
    slug: "",
    description: "",
    keywords: "",
    content: "",
    category: "",
    tags: [],
    state: 0,
    cover_image: null,
  })

  /* ---------- Categorías ---------- */
  const [categories, setCategories] = useState<Category[]>([])
  const [, startTransitionCategories] = useTransition()

  useEffect(() => {
    startTransitionCategories(async () => {
      const data = await getCategories()
      setCategories(data.results)
    })
  }, [])

  /* ---------- Tags ---------- */
  const [tags, setTags] = useState<Tag[]>([])
  const [, startTransitionTags] = useTransition()

  useEffect(() => {
    startTransitionTags(async () => {
      const data = await getTags()
      setTags(data.results)
    })
  }, [])

  /* ---------- Helpers ---------- */
  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }))
  }

  /* ---------- Submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.slug || !formData.category) {
      alert("Faltan campos obligatorios")
      return
    }

    const payload = new FormData()
    payload.append("title", formData.title)
    payload.append("slug", formData.slug)
    payload.append("description", formData.description)
    payload.append("keywords", formData.keywords)
    payload.append("content", formData.content)
    payload.append("category", formData.category)
    payload.append("state", String(formData.state))

    // ⚡ Enviar tags correctamente como ListField
    formData.tags.forEach((tag) => {
      payload.append("tags", tag) // <--- sin []
    })

    if (formData.cover_image) {
      payload.append("cover_image", formData.cover_image)
    }

    const res = await fetch("/api/pages", {
      method: "POST",
      body: payload,
    })

    if (!res.ok) {
      const text = await res.text()
      alert("Error al crear página: " + text)
      return
    }

    router.push("/admin/panel/paginas")
  }

  /* ---------- Tags ---------- */
  const tagOptions = tags.map((tag) => ({
    value: tag.name,
    label: tag.name,
  }))

  /* ===========================
     Render
  =========================== */

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/panel/paginas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Crear Nueva Página</h1>
          <p className="text-muted-foreground">
            Añade una nueva página al sitio
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* MAIN */}
          <div className="lg:col-span-2">
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <Label>Título *</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />

              <Label>Slug *</Label>
              <Input
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />

              <Label>Descripción</Label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <Label>Palabras clave</Label>
              <Input
                value={formData.keywords}
                onChange={(e) =>
                  setFormData({ ...formData, keywords: e.target.value })
                }
              />

              <ImageUpload
                value={formData.cover_image}
                onChange={(file) =>
                  setFormData({ ...formData, cover_image: file })
                }
                label="Imagen de portada"
                maxSize={10}
              />

              <Label>Contenido</Label>
              <TiptapEditor
                content={formData.content}
                onChange={(content) =>
                  setFormData({ ...formData, content })
                }
              />
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">

            <div className="bg-card border rounded-lg p-6 space-y-4">
              <Label>Estado</Label>
              <Select
                value={String(formData.state)}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    state: Number(value) as PageStatus,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Borrador</SelectItem>
                  <SelectItem value="1">Publicada</SelectItem>
                </SelectContent>
              </Select>

              <Button type="submit" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Guardar Página
              </Button>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-4">
              <Label>Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(category) =>
                  setFormData({ ...formData, category })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-4">
              <Label>Etiquetas</Label>
              <MultiSelect
                options={tagOptions}
                selected={formData.tags}
                onChange={(tags) =>
                  setFormData({ ...formData, tags })
                }
              />
            </div>

          </div>
        </div>
      </form>
    </div>
  )
}
