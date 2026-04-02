//import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { CommentCard } from "@/components/comment-card"
import { CommentForm } from "@/components/comment-form"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Calendar, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import InfiniteScrollComments from "@/components/infinite-scroll-comments"
import { CommentCardWrite } from "@/components/comment-card-write"
import { getImageUrlOfEnvironment } from "@/lib/utils"

const API_URL = process.env.API_URL!;

type PageProps = {
  params: Promise<{
    categorySlug: string
    pageSlug: string
  }>
}

export default async function ArticlePage({ params }: PageProps) {

  const { categorySlug, pageSlug } = await params
  const resPages = await fetch(`${API_URL}/api/v1/pages/${pageSlug}`, {
    next: {
      revalidate: 60,
      tags: [`page-${pageSlug}`]
    }
  })

  if (!resPages.ok) {
    notFound()
  }

  const articleData = await resPages.json();
  const imageUrl = getImageUrlOfEnvironment(articleData.cover_image)

  // Si es un borrador no se muestra
  if (articleData.state === 0) {
    notFound()
  }

  return (
    <PageLayout>
      <article className="mx-auto max-w-3xl px-6 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        {/* Cover Image */}
        <div className="mb-8 overflow-hidden rounded-xl">
          <img
            src={imageUrl || "/images/default-article-cover.jpg"}
            alt={articleData.title}
            className="h-64 w-full object-cover md:h-80"
          />
        </div>

        <header className="border-b border-border pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{articleData.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{articleData.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <User className="h-4 w-4" />
              {articleData.author}
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(articleData.updated_at).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Article Content */}
        <div
          className="html-content-page mt-8"
          dangerouslySetInnerHTML={{ __html: articleData.content }}
        />

        {/* Comments Section */}
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Comentarios
          </h2>

          <CommentCardWrite pageSlug={pageSlug} />

          <div className="mt-8">
            <InfiniteScrollComments pageId={pageSlug} />
          </div>
        </section>

      </article>

      <ScrollToTop />
    </PageLayout>
  )
}
