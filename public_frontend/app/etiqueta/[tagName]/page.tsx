// app/etiqueta/[tagName]/page.tsx

import { PageLayout } from "@/components/page-layout"
import Link from "next/link"
import { Calendar, ArrowRight, ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { getImageUrlOfEnvironment } from "@/lib/utils"
import InfiniteScrollArticles from "@/components/infinite-scroll-articles"

const API_URL = process.env.API_URL!

type TagPageProps = {
  params: Promise<{ tagName: string }>
}

export default async function TagPage({ params }: TagPageProps) {
  const { tagName } = await params

  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Volver a inicio */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Inicio
        </Link>

        {/* Header */}
        <div className="mt-6 border-b border-border pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Páginas con la etiqueta: {tagName}
          </h1>
        </div>

        {/* Scroll infinito */}
        <div className="mt-8 space-y-8">
          <InfiniteScrollArticles tagName={tagName} />
        </div>
      </div>
    </PageLayout>
  )
}