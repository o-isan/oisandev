import { PageLayout } from "@/components/page-layout"
import { notFound } from "next/navigation"
import InfiniteScrollArticles from "@/components/infinite-scroll-articles"

const API_URL = process.env.API_URL!

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>
}) {
  const { categorySlug } = await params

  const resCategory = await fetch(
    `${API_URL}/api/v1/categories/${categorySlug}`,
    { cache: "no-store" }
  )

  if (!resCategory.ok) {
    notFound()
  }

  const categoryData = await resCategory.json()

  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="border-b border-border pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {categoryData.title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {categoryData.description}
          </p>
        </div>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_280px]">
          <div className="space-y-8">
            <InfiniteScrollArticles categorySlug={categorySlug} />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
