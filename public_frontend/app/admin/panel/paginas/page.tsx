"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/pagination"
import { Plus } from "lucide-react"
import { getPages } from "@/actions/get/get_page_list"
import { deletePage } from "@/actions/delete/delete_page"

type Page = {
  id: string
  title: string
  slug: string
  categoryId: string
  tags: string[]
  state: number
  created_at: string
  updated_at: string
}

const PAGE_SIZE = 10

export default function PaginasPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const pageFromUrl = Number(searchParams.get("page")) || 1

  const [pages, setPages] = useState<Page[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(pageFromUrl)

  const [isPending, startTransition] = useTransition()

  // 🔁 Sync URL → estado
  useEffect(() => {
    if (pageFromUrl !== currentPage) {
      setCurrentPage(pageFromUrl)
    }
  }, [pageFromUrl])

  // 🔄 Cargar páginas
  const loadPages = (page: number) => {
    startTransition(async () => {
      const data = await getPages(page)

      setPages(data.results)
      setTotalItems(data.count)
    })
  }

  useEffect(() => {
    loadPages(currentPage)
  }, [currentPage])

  // 📄 Cambio de página
  const onPageChange = (page: number) => {
    setCurrentPage(page)
    router.push(page === 1 ? "?" : `?page=${page}`)
  }

  // ❌ Eliminación optimista (solo frontend)
  const handleDelete = async (page: Page) => {

    await deletePage(page.slug);

    setPages(prev => prev.filter(p => p.id !== page.id))
    setTotalItems(prev => prev - 1)

  }

  const handleEdit = (page: Page) => {
    window.location.href = `/admin/panel/paginas/${page.slug}/editar`
  }

  const columns = [
    { key: "title", header: "Título" },
    { key: "category", header: "Categoría" },
    { key: "slug", header: "Slug" },
    {
      key: "status",
      header: "Estado",
      render: (page: Page) => (
        <Badge
          variant={page.state === 1 ? "default" : "secondary"}
          className={page.state === 1 ? "bg-green-100 text-green-800" : ""}
        >
          {page.state == 1 ? "Publicada" : "Borrador"}
        </Badge>
      ),
    },
    { key: "updated_at", header: "Modificado" },
    { key: "created_at", header: "Creado" },
  ]

  const totalPages = Math.ceil(totalItems / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = Math.min(startIndex + pages.length, totalItems)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Páginas</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona las páginas del sitio
          </p>
        </div>

        <Link href="/admin/panel/paginas/crear-pagina">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Página
          </Button>
        </Link>
      </div>

      {isPending && (
        <p className="text-sm text-muted-foreground">
          Actualizando…
        </p>
      )}

      <DataTable
        data={pages}
        columns={columns}
        onDelete={handleDelete}
        onEdit={handleEdit}
        showEdit
      />

      {totalPages > 1 && (
        <div className="p-4 border-t border-border">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={onPageChange}
            itemLabel="páginas"
          />
        </div>
      )}
    </div>
  )
}
