"use client"

import { useEffect, useRef, useState } from "react"
import { CommentCard } from "@/components/comment-card"

interface Comment {
  id: number
  author: string
  content: string
  created_at: string
}

export default function InfiniteScrollComments({
  pageId,
}: {
  pageId: string
}) {
  const [comments, setComments] = useState<Comment[]>([])
  const [nextUrl, setNextUrl] = useState<string | null>(
    `/api/pages/${pageId}/comments/`
  )
  const [loading, setLoading] = useState(false)

  const loaderRef = useRef<HTMLDivElement | null>(null)

  const fetchComments = async () => {
    if (!nextUrl || loading) return

    setLoading(true)

    const res = await fetch(nextUrl, { cache: "no-store" })
    const data = await res.json()

    // 🔒 Evitar duplicados
    setComments(prev => {
      const ids = new Set(prev.map(c => c.id))
      const fresh = data.results.filter(
        (c: Comment) => !ids.has(c.id)
      )
      return [...prev, ...fresh]
    })

    // 🔁 Reconstruir nextUrl SOLO usando page
    if (data.next) {
      const nextPage = new URL(data.next).searchParams.get("page")
      setNextUrl(`/api/pages/${pageId}/comments/?page=${nextPage}`)
    } else {
      setNextUrl(null)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchComments()
  }, [])

  useEffect(() => {
    if (!loaderRef.current || !nextUrl) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchComments()
        }
      },
      { rootMargin: "150px" }
    )

    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [nextUrl])

  return (
    <>
      {comments.map(comment => (
        <CommentCard
          key={comment.id}
          author={comment.author}
          content={comment.content}
          date={comment.created_at}
        />
      ))}

      {nextUrl && (
        <div
          ref={loaderRef}
          className="py-6 text-center text-muted-foreground"
        >
          Cargando comentarios…
        </div>
      )}
    </>
  )
}
