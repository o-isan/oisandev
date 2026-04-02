import { PageLayout } from "@/components/page-layout"
import { ArrowRight, Server, Database, Cloud, Code } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Desarrollador Backend, en Python</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            La lógica es más necesaria que nunca
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Bienvenido a mi portafolio profesional. Mi nombre es Óscar de la Iglesia Santacruz. Plasmo en el código la lógica del mundo real, a su paso por libretas.
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Microservicios, API REST, Web Scraping, Automatización de procesos, y patrones de diseño son mi día a día. 
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/publicacion/proyectos"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Proyectos
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/publicacion/articulos"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Artículos
            </Link>
          </div>
        </div>
      </section>

    </PageLayout>
  )
}
