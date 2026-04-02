"use client"

import type React from "react"
import { PageLayout } from "@/components/page-layout"
import { Mail, MapPin, Github, Linkedin, Send } from "lucide-react"

export default function ContactPage() {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    const mailtoLink = `mailto:oscar.iglsan@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      `Nombre: ${name}\nEmail: ${email}\n\n${message}`
    )}`

    window.location.href = mailtoLink
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="border-b border-border pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Contacto</h1>
          <p className="mt-2 text-muted-foreground">
            ¿Tienes un proyecto en mente? Le escucho.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px]">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                    placeholder="Ej. Alfonso de Borbón"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                    placeholder="ej. alfonsoxii@casareal.es"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="text-sm font-medium text-foreground">
                  Asunto
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                  placeholder="¿En qué puedo ayudarle?"
                />
              </div>

              <div>
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                  placeholder="Cuénteme en detalle..."
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Enviar mensaje
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <aside className="space-y-8 lg:border-l lg:border-border lg:pl-8">
            <div>
              <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                Información de contacto
              </h2>

              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <a
                      href="mailto:oscar.iglsan@gmail.com"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      oscar.iglsan@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Ubicación</p>
                    <p className="text-sm text-muted-foreground">Soria, España</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                Redes sociales
              </h2>

              <div className="mt-4 flex gap-3">
                <a
                  href="https://github.com/o-isan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>

                <a
                  href="https://www.linkedin.com/in/%C3%B3scar-de-la-iglesia-santacruz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PageLayout>
  )
}
