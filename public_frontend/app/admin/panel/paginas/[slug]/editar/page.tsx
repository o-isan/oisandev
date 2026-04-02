"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
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

/* ===========================
   Tipos
=========================== */

type Category = {
  slug: string
  title: string
}

type Tag = {
  name: string
}

type PageForm = {
  title: string
  slug: string
  description: string
  keywords: string
  content: string
  category: string
  tags: string[]
  state: 0 | 1
  cover_image: File | null
}

/* ===========================
   Componente
=========================== */

export default function EditarPaginaPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [formData, setFormData] = useState<PageForm>({
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

  /* ===========================
     Carga inicial
  =========================== */

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pageRes, catRes, tagRes] = await Promise.all([
          fetch(`/api/pages/${slug}`, { cache: "no-store" }),
          fetch(`/api/categories`, { cache: "no-store" }),
          fetch(`/api/tags`, { cache: "no-store" }),
        ])

        if (!pageRes.ok) throw new Error("Página no encontrada")

        const page = await pageRes.json()
        const cats = await catRes.json()
        const tagData = await tagRes.json()

        const categoriesData: Category[] = cats.results ?? []
        const tagsData: Tag[] = tagData.results ?? []

        setCategories(categoriesData)
        setTags(tagsData)

        const normalizedTags: string[] = Array.isArray(page.tags)
          ? page.tags
            .map((t: string | { name: string }) =>
              typeof t === "string" ? t : t?.name
            )
            .filter(Boolean)
          : []

        setFormData({
          title: page.title ?? "",
          slug: page.slug ?? "",
          description: page.description ?? "",
          keywords: page.keywords ?? "",
          content: page.content ?? "",
          category: page.category ?? "",
          tags: normalizedTags,
          state: page.state ?? 0,
          cover_image: null,
        })

        setLoading(false)
      } catch (error) {
        console.error(error)
        router.push("/admin/panel/paginas")
      }
    }

    loadData()
  }, [slug, router])

  /* ===========================
     Guardar
  =========================== */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = new FormData()

    // Campos obligatorios
    payload.append("title", formData.title.trim())
    payload.append("slug", formData.slug.trim())
    payload.append("description", formData.description ?? "")
    payload.append("keywords", formData.keywords ?? "")
    payload.append("content", formData.content ?? "")
    payload.append("state", String(formData.state))

    // ⚠️ SOLO enviar categoría si tiene valor válido
    if (formData.category && formData.category.trim() !== "") {
      payload.append("category", formData.category.trim())
    }

    // ⚠️ Enviar tags correctamente (multipart compatible con ListField)
    if (Array.isArray(formData.tags)) {
      formData.tags.forEach((tag) => {
        if (tag && tag.trim() !== "") {
          payload.append("tags", tag.trim())
        }
      })
    }

    // Imagen opcional
    if (formData.cover_image instanceof File) {
      payload.append("cover_image", formData.cover_image)
    }

    // DEBUG (puedes quitar luego)
    for (const [key, value] of payload.entries()) {
      console.log("→", key, value)
    }

    const res = await fetch(`/api/pages/${slug}`, {
      method: "PATCH",
      body: payload,
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("ERROR PATCH:", text)
      alert("Error al guardar: " + text)
      return
    }

    router.push("/admin/panel/paginas")
  }


  /* ===========================
     Render
  =========================== */

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        Cargando...
      </div>
    )
  }

  const tagOptions = tags.map(tag => ({
    value: tag.name,
    label: tag.name,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/panel/paginas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Editar página</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border p-6 space-y-4">
            <Label>Título *</Label>
            <Input
              value={formData.title}
              onChange={e =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <Label>Slug *</Label>
            <Input
              value={formData.slug}
              onChange={e =>
                setFormData({ ...formData, slug: e.target.value })
              }
            />

            <Label>Descripción</Label>
            <Input
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <Label>Palabras clave</Label>
            <Input
              value={formData.keywords}
              onChange={e =>
                setFormData({ ...formData, keywords: e.target.value })
              }
            />

            <ImageUpload
              value={formData.cover_image}
              onChange={file =>
                setFormData({ ...formData, cover_image: file })
              }
              label="Imagen de portada"
              maxSize={10}
            />

            <Label>Contenido</Label>
            <TiptapEditor
              content={formData.content}
              onChange={content =>
                setFormData({ ...formData, content })
              }
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border p-6 space-y-4">
            <Label>Estado</Label>
            <Select
              value={String(formData.state)}
              onValueChange={v =>
                setFormData({ ...formData, state: Number(v) as 0 | 1 })
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
              <Save className="mr-2 h-4 w-4" />
              Guardar cambios
            </Button>
          </div>

          <div className="rounded-lg border p-6 space-y-4">
            <Label>Categoría *</Label>

            <Select
              value={formData.category || ""}
              onValueChange={v =>
                setFormData({ ...formData, category: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona categoría" />
              </SelectTrigger>

              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border p-6 space-y-4">
            <Label>Etiquetas</Label>
            <MultiSelect
              options={tagOptions}
              selected={formData.tags}
              onChange={(newTags) =>
                setFormData({ ...formData, tags: newTags })
              }
            />
          </div>
        </div>
      </form>
    </div>
  )
}
