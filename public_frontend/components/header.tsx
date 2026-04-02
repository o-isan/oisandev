"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X, ChevronDown } from "lucide-react"
import Image from "next/image";

type Tag = {
  id: number
  name: string
}

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/publicacion/articulos", label: "Articulos" },
  { href: "/publicacion/proyectos", label: "Proyectos" },
  { href: "/publicacion/principal/certificaciones", label: "Certificaciones" },
  { href: "/publicacion/principal/sobre-mi", label: "Sobre mi" },
  { href: "/contacto", label: "Contacto" },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [tagsOpen, setTagsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [technologies, setTechnologies] = useState<string[]>([])

  // 🔹 Obtener tags desde la API
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/tags")
        if (!res.ok) throw new Error("Error al obtener tags")

        const data = await res.json()

        // 👇 soporta array directo o paginado (con results)
        const tagsArray: Tag[] = Array.isArray(data) ? data : data.results ?? []

        const names = tagsArray.map((tag) => tag.name)
        setTechnologies(names)
      } catch (error) {
        console.error("Error cargando tags:", error)
      }
    }

    fetchTags()
  }, [])

  // Mostrar / ocultar header según scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < lastScrollY || currentScrollY < 150) {
        setIsVisible(true)
      } else if (currentScrollY > 150) {
        setIsVisible(false)
        setMobileMenuOpen(false)
        setTagsOpen(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300",
        !isVisible && "-translate-y-full",
      )}
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex items-center justify-between py-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="flex items-center gap-3 md:flex-none">
            <Image
              src="/logo-x400.webp"
              alt="Logo"
              width={45}
              height={45}
              className="object-contain"
            />
            <span className="text-2xl font-semibold tracking-tight">oisan.dev</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  pathname === link.href ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="w-10 md:hidden" />
        </div>

        {/* 🔹 Menú móvil */}
        {mobileMenuOpen && (
          <nav className="flex flex-col items-center text-center gap-2 border-t border-border py-4 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
        
        {/* 🔹 Tags desktop */}
        <div className="hidden items-center gap-2 overflow-x-auto pb-4 scrollbar-hide md:flex">
          {technologies.map((tech) => (
            <span
              key={tech}
              onClick={() => router.push(`/etiqueta/${tech}`)}
              className="inline-flex shrink-0 items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* 🔹 Tags móvil */}
        <div className="pb-4 md:hidden">
          <button
            onClick={() => setTagsOpen(!tagsOpen)}
            className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
          >
            <span>Etiquetas</span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", tagsOpen && "rotate-180")} />
          </button>

          {tagsOpen && (
            <div className="mt-2 flex flex-wrap gap-2 rounded-lg border border-border bg-secondary/50 p-3">
              {technologies.map((tech) => (
                <span
                  onClick={() => router.push(`/etiqueta/${tech}`)}
                  key={tech}
                  className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}