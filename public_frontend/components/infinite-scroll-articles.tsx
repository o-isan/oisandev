"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"
import { getImageUrlOfEnvironment } from "@/lib/utils"

interface Page {
  id: number
  slug: string
  title: string
  description: string
  cover_image: string | null
  updated_at: string
  state: number
  category: string
}

interface Props {
  categorySlug?: string
  tagName?: string
}

export default function InfiniteScrollArticles({ categorySlug, tagName }: Props) {
  const [pages, setPages] = useState<Page[]>([])
  const [nextUrl, setNextUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)

  const fetchPages = useCallback(async (url: string) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoading(true)

    try {
      const res = await fetch(url, { cache: "no-store" })
      if (!res.ok) return

      const data = await res.json()

      setPages(prev => {
        const ids = new Set(prev.map(p => p.id))
        const fresh = data.results.filter((p: Page) => p.state === 1 && !ids.has(p.id))
        return [...prev, ...fresh]
      })

      if (data.next) {
        const nextPage = new URL(data.next).searchParams.get("page")
        if (categorySlug) setNextUrl(`/api/pages?category=${encodeURIComponent(categorySlug)}&page=${nextPage}`)
        else if (tagName) setNextUrl(`/api/pages?tag=${encodeURIComponent(tagName)}&page=${nextPage}`)
      } else {
        setNextUrl(null)
      }
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [categorySlug, tagName])

  // Resetear y hacer primera carga directa cuando cambian los filtros
  useEffect(() => {
    setPages([])
    setNextUrl(null)

    let initialUrl: string | null = null
    if (categorySlug) initialUrl = `/api/pages?category=${encodeURIComponent(categorySlug)}`
    else if (tagName) initialUrl = `/api/pages?tag=${encodeURIComponent(tagName)}`

    if (initialUrl) fetchPages(initialUrl)
  }, [categorySlug, tagName])

  // Observer para scroll infinito (páginas siguientes)
  useEffect(() => {
    if (!loaderRef.current || !nextUrl) return

    const currentUrl = nextUrl

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) fetchPages(currentUrl)
      },
      { rootMargin: "150px" }
    )
    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [nextUrl, fetchPages])

  return (
    <>
      {pages.map(article => {
        const coverSrc = getImageUrlOfEnvironment(article.cover_image) || "/images/default-article-cover.jpg"
        return (
          <article key={article.id} className="group border-b border-border pb-8 last:border-0">
            <Link href={`/publicacion/${article.category}/${article.slug}`} className="flex flex-col gap-4 sm:flex-row">
              <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg sm:h-32 sm:w-40">
                <img src={coverSrc} alt={article.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {new Date(article.updated_at).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-semibold text-foreground group-hover:text-muted-foreground">
                  {article.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-muted-foreground">{article.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                  Leer más
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </article>
        )
      })}

      {(nextUrl || loading) && (
        <div ref={loaderRef} className="py-6 text-center text-muted-foreground">
          Cargando artículos…
        </div>
      )}
    </>
  )
}