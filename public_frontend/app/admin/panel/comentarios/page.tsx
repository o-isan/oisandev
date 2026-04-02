"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, MessageSquare } from "lucide-react"
import { getComments } from "@/actions/get/get_comments"
import { deleteComment } from "@/actions/delete/delete_comment"

type Comment = {
  id: number
  author: string
  author_email: string
  content: string
  created_at: string
  page_data: {
    title: string
  }
}

const PAGE_SIZE = 10

export default function ComentariosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const pageFromUrl = Number(searchParams.get("page")) || 1

  const [comments, setComments] = useState<Comment[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(pageFromUrl)

  const [isPending, startTransition] = useTransition()

  // 🔁 Sync URL → estado
  useEffect(() => {
    if (pageFromUrl !== currentPage) {
      setCurrentPage(pageFromUrl)
    }
  }, [pageFromUrl])

  // 🔄 Cargar comentarios
  const loadComments = (page: number) => {
    startTransition(async () => {
      const data = await getComments(page)
      setComments(data.results)
      setTotalItems(data.count)
    })
  }

  useEffect(() => {
    loadComments(currentPage)
  }, [currentPage])

  // 📄 Cambio de página
  const onPageChange = (page: number) => {
    setCurrentPage(page)
    router.push(page === 1 ? "?" : `?page=${page}`)
  }

  // ❌ Eliminación optimista (solo frontend)
  const handleDelete = async (id: number) => {
    try {
      await deleteComment(id);

      setComments((prev) => prev.filter((c) => c.id !== id));
      setTotalItems((prev) => prev - 1);

    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const totalPages = Math.ceil(totalItems / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = Math.min(startIndex + comments.length, totalItems)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Comentarios</h1>
        <p className="text-muted-foreground">Gestiona los comentarios del sitio</p>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Autor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Comentario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Página</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Fecha</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {comments.map((comment) => (
              <tr key={comment.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium">{comment.author}</div>
                  <div className="text-sm text-muted-foreground">{comment.author_email}</div>
                </td>

                <td className="px-6 py-4 text-sm line-clamp-2 max-w-xs">
                  {comment.content}
                </td>

                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {comment.page_data.title}
                </td>

                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {comment.created_at}
                </td>

                <td className="px-6 py-4 text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar Comentario</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(comment.id)}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {comments.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No hay comentarios</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-border">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              startIndex={startIndex}
              endIndex={endIndex}
              onPageChange={onPageChange}
              itemLabel="comentarios"
            />
          </div>
        )}
      </div>
    </div>
  )
}
